import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://jytpcgoslnlrdeqgivaq.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dHBjZ29zbG5scmRlcWdpdmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyOTY1OTIsImV4cCI6MjEwODg3MjU5Mn0.gIoaoBJuygQaDJ_MpXid_Ejr8KUmsSY4SP6I57kh0u8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface AppUser {
  id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export interface ScoreRecord {
  id: string;
  username: string;
  score: number;
  chapter_reached: number;
  play_duration_seconds: number;
  badges_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  sender_username: string;
  receiver_username: string | null; // null for public community chat, or 'admin' / username for private DM
  content: string;
  is_ai?: boolean;
  created_at: string;
}

// SQL Script to run in Supabase SQL Editor
export const SUPABASE_SQL_SETUP = `-- AFET 72: Supabase Veritabanı Kurulum Betiği
-- Supabase Dashboard -> SQL Editor alanına yapıştırıp "Run" butonuna basın.

-- 1. Kullanıcılar Tablosu (app_users)
CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Varsayılan Yönetici Hesabını Ekle (admin / 12345)
INSERT INTO public.app_users (username, password, role)
VALUES ('admin', '12345', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 2. Skorlar ve Liderlik Tablosu (leaderboard)
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  chapter_reached INTEGER NOT NULL DEFAULT 0,
  play_duration_seconds INTEGER NOT NULL DEFAULT 0,
  badges_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Sohbet Mesajları Tablosu (messages)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_username TEXT NOT NULL,
  receiver_username TEXT, -- NULL ise Ortak Mahalle Sohbeti; 'admin' veya kullanıcı adı ise Özel Mesaj
  content TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- İlk Hoş Geldiniz Mesajı
INSERT INTO public.messages (sender_username, receiver_username, content, is_ai)
VALUES 
  ('admin', NULL, 'Yamaçdere Afet Dayanışma ve Koordinasyon Ortak Sohbetine hoş geldiniz! Buradan mahalleyle yardımlaşabilir veya bana özel mesaj atabilirsiniz.', false),
  ('Derya (Afet Danışmanı)', NULL, 'Merhaba! Afet hazırlıkları veya güvenli güzergâhlar hakkında aklınıza takılan soruları buradan danışabilirsiniz.', true)
ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) Açık ve Anonim İzinleri (Web uygulaması doğrudan REST API ile erişebilsin)
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Politikalar: anon kullanıcıların okuma ve yazmasına izin ver
DROP POLICY IF EXISTS "Allow public read app_users" ON public.app_users;
CREATE POLICY "Allow public read app_users" ON public.app_users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert app_users" ON public.app_users;
CREATE POLICY "Allow public insert app_users" ON public.app_users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all leaderboard" ON public.leaderboard;
CREATE POLICY "Allow public all leaderboard" ON public.leaderboard FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all messages" ON public.messages;
CREATE POLICY "Allow public all messages" ON public.messages FOR ALL USING (true);

-- Realtime Bildirimleri Aktifleştirme (Opsiyonel)
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages, public.leaderboard;
`;

// Helper Storage Keys for Offline/Fallback
const LOCAL_USER_KEY = 'afet72_current_user_v1';
const LOCAL_SCORES_KEY = 'afet72_cached_scores_v1';
const LOCAL_MSGS_KEY = 'afet72_cached_messages_v1';

export const authService = {
  getCurrentUser(): AppUser | null {
    try {
      const data = localStorage.getItem(LOCAL_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: AppUser | null) {
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  },

  async login(username: string, password: string): Promise<{ success: boolean; user?: AppUser; message: string; notRegistered?: boolean }> {
    const cleanUser = username.trim().toLowerCase();

    // 1. Hardcoded / Instant Admin Check
    if (cleanUser === 'admin') {
      if (password === '12345') {
        const adminUser: AppUser = { id: 'admin_master_id', username: 'admin', role: 'admin' };
        this.setCurrentUser(adminUser);
        return { success: true, user: adminUser, message: 'Yönetici girişi başarılı!' };
      } else {
        return { success: false, message: 'Hatalı yönetici şifresi!' };
      }
    }

    // 2. Query Supabase
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('username', cleanUser)
        .maybeSingle();

      if (error) {
        // Table might not exist yet; check local cache
        const localUsers = JSON.parse(localStorage.getItem('afet72_local_users') || '[]');
        const found = localUsers.find((u: any) => u.username === cleanUser);
        if (found) {
          if (found.password === password) {
            const user: AppUser = { id: found.id, username: found.username, role: 'user' };
            this.setCurrentUser(user);
            return { success: true, user, message: 'Giriş başarılı!' };
          }
          return { success: false, message: 'Şifre hatalı!' };
        }
        return { success: false, notRegistered: true, message: 'Kullanıcı bulunamadı. Lütfen kayıt olun.' };
      }

      if (!data) {
        return { success: false, notRegistered: true, message: 'Kullanıcı kayıtlı değil, kayıt ekranına yönlendiriliyorsunuz.' };
      }

      if (data.password !== password) {
        return { success: false, message: 'Şifre hatalı!' };
      }

      const user: AppUser = {
        id: data.id,
        username: data.username,
        role: data.role || 'user',
        createdAt: data.created_at,
      };
      this.setCurrentUser(user);
      return { success: true, user, message: 'Giriş başarılı!' };
    } catch {
      // Offline fallback
      return { success: false, notRegistered: true, message: 'Kullanıcı bulunamadı. Lütfen kayıt olun.' };
    }
  },

  async register(username: string, password: string): Promise<{ success: boolean; user?: AppUser; message: string }> {
    const cleanUser = username.trim().toLowerCase();

    if (cleanUser === 'admin') {
      return { success: false, message: '"admin" kullanıcı adı rezerve edilmiştir.' };
    }

    if (cleanUser.length < 3) {
      return { success: false, message: 'Kullanıcı adı en az 3 karakter olmalıdır.' };
    }

    if (password.length < 3) {
      return { success: false, message: 'Şifre en az 3 karakter olmalıdır.' };
    }

    try {
      const { data, error } = await supabase
        .from('app_users')
        .insert([{ username: cleanUser, password, role: 'user' }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: false, message: 'Bu kullanıcı adı zaten alınmış!' };
        }
        // Save locally if Supabase error
        const localUsers = JSON.parse(localStorage.getItem('afet72_local_users') || '[]');
        if (localUsers.some((u: any) => u.username === cleanUser)) {
          return { success: false, message: 'Bu kullanıcı adı zaten kayıtlı!' };
        }
        const newUser = { id: 'usr_' + Date.now(), username: cleanUser, password, role: 'user' };
        localUsers.push(newUser);
        localStorage.setItem('afet72_local_users', JSON.stringify(localUsers));
        const user: AppUser = { id: newUser.id, username: cleanUser, role: 'user' };
        this.setCurrentUser(user);
        return { success: true, user, message: 'Kayıt başarılı! Oturum açıldı.' };
      }

      const user: AppUser = {
        id: data.id,
        username: data.username,
        role: 'user',
        createdAt: data.created_at,
      };
      this.setCurrentUser(user);
      return { success: true, user, message: 'Kayıt başarılı! Hoş geldiniz.' };
    } catch (err: any) {
      return { success: false, message: 'Kayıt sırasında bir hata oluştu: ' + (err.message || 'Bilinmeyen hata') };
    }
  },

  logout() {
    this.setCurrentUser(null);
  }
};

export const leaderboardService = {
  async getScores(): Promise<ScoreRecord[]> {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false });

      if (error || !data) {
        const cached = localStorage.getItem(LOCAL_SCORES_KEY);
        return cached ? JSON.parse(cached) : [
          { id: '1', username: 'derya_danisman', score: 98, chapter_reached: 8, play_duration_seconds: 1420, badges_count: 7 },
          { id: '2', username: 'mert_gonullu', score: 92, chapter_reached: 8, play_duration_seconds: 1850, badges_count: 6 },
          { id: '3', username: 'elif_ogretmen', score: 88, chapter_reached: 7, play_duration_seconds: 2100, badges_count: 5 },
          { id: '4', username: 'ahmet_rize53', score: 75, chapter_reached: 5, play_duration_seconds: 1200, badges_count: 4 },
        ];
      }

      localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(data));
      return data;
    } catch {
      const cached = localStorage.getItem(LOCAL_SCORES_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  },

  async saveScore(username: string, score: number, chapter: number, durationSeconds: number, badgesCount: number) {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .upsert(
          {
            username,
            score,
            chapter_reached: chapter,
            play_duration_seconds: durationSeconds,
            badges_count: badgesCount,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'username' }
        )
        .select();

      return { success: !error };
    } catch {
      // Local fallback
      const cached: ScoreRecord[] = JSON.parse(localStorage.getItem(LOCAL_SCORES_KEY) || '[]');
      const idx = cached.findIndex(s => s.username === username);
      const record: ScoreRecord = {
        id: 'sc_' + Date.now(),
        username,
        score,
        chapter_reached: chapter,
        play_duration_seconds: durationSeconds,
        badges_count: badgesCount,
        updated_at: new Date().toISOString(),
      };
      if (idx >= 0) cached[idx] = record;
      else cached.push(record);
      cached.sort((a, b) => b.score - a.score);
      localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(cached));
      return { success: true };
    }
  },

  // Admin Only: Delete a score
  async adminDeleteScore(username: string) {
    try {
      await supabase.from('leaderboard').delete().eq('username', username);
    } catch {
      // silent
    }
    const cached: ScoreRecord[] = JSON.parse(localStorage.getItem(LOCAL_SCORES_KEY) || '[]');
    const filtered = cached.filter(s => s.username !== username);
    localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(filtered));
  },

  // Admin Only: Edit a score
  async adminUpdateScore(username: string, newScore: number, newBadges: number) {
    try {
      await supabase
        .from('leaderboard')
        .update({ score: newScore, badges_count: newBadges, updated_at: new Date().toISOString() })
        .eq('username', username);
    } catch {
      // silent
    }
    const cached: ScoreRecord[] = JSON.parse(localStorage.getItem(LOCAL_SCORES_KEY) || '[]');
    const item = cached.find(s => s.username === username);
    if (item) {
      item.score = newScore;
      item.badges_count = newBadges;
      localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(cached));
    }
  }
};

export const chatService = {
  async getMessages(targetUsername?: string | null): Promise<ChatMessage[]> {
    try {
      let query = supabase.from('messages').select('*').order('created_at', { ascending: true });

      if (targetUsername) {
        // Direct private message thread between current user and admin
        query = query.or(`and(sender_username.eq.${targetUsername},receiver_username.eq.admin),and(sender_username.eq.admin,receiver_username.eq.${targetUsername})`);
      } else {
        // Public community chat (receiver_username is null)
        query = query.is('receiver_username', null);
      }

      const { data, error } = await query;
      if (error || !data) {
        const cached = localStorage.getItem(LOCAL_MSGS_KEY);
        return cached ? JSON.parse(cached) : [];
      }
      return data;
    } catch {
      const cached = localStorage.getItem(LOCAL_MSGS_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  },

  async sendMessage(senderUsername: string, content: string, receiverUsername: string | null = null): Promise<boolean> {
    const newMsg: Partial<ChatMessage> = {
      sender_username: senderUsername,
      receiver_username: receiverUsername,
      content,
      is_ai: false,
    };

    try {
      const { error } = await supabase.from('messages').insert([newMsg]);
      return !error;
    } catch {
      // fallback
      const cached: ChatMessage[] = JSON.parse(localStorage.getItem(LOCAL_MSGS_KEY) || '[]');
      cached.push({
        id: 'msg_' + Date.now(),
        sender_username: senderUsername,
        receiver_username: receiverUsername,
        content,
        is_ai: false,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem(LOCAL_MSGS_KEY, JSON.stringify(cached));
      return true;
    }
  }
};
