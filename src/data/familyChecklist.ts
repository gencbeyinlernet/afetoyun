import { FamilyChecklistItem } from '../types/game';

export const INITIAL_FAMILY_CHECKLIST: FamilyChecklistItem[] = [
  {
    id: 'chk_1',
    category: 'İletişim',
    text: 'Ailemle afet durumunda telefon hatları kilitlendiğinde kullanacağımız "Şehir Dışı İletişim Kişisi"ni belirledik ve numarasını ezberledik.',
    completed: true,
  },
  {
    id: 'chk_2',
    category: 'Toplanma',
    text: 'e-Devlet üzerinden evimize en yakın resmî AFAD Acil Toplanma Alanı\'nı sorguladık ve tüm aile bireyleriyle yerini öğrendik.',
    completed: true,
  },
  {
    id: 'chk_3',
    category: 'Afet Çantası',
    text: 'Evimizde kolayca ulaşılabilecek bir yerde 72 saatlik Afet ve Acil Durum Çantamızı hazırladık (Su, fener, düdük, radyo, ilk yardım, konserve).',
    completed: false,
  },
  {
    id: 'chk_4',
    category: 'Özel İhtiyaçlar',
    text: 'Ailemizdeki bebek, yaşlı, engelli veya kronik hastalığı olan bireylerin düzenli kullandığı reçeteli ilaçların yedeklerini çantaya ekledik.',
    completed: false,
  },
  {
    id: 'chk_5',
    category: 'Ev Güvenliği',
    text: 'Evimizdeki devrilebilecek gardırop, kitaplık ve ağır beyaz eşyaları duvara sabitledik ("Tehlike Avı" yaptık).',
    completed: false,
  },
  {
    id: 'chk_6',
    category: 'Ev Güvenliği',
    text: 'Doğalgaz, su vanası ve ana elektrik şalterinin yerlerini ve afet anında nasıl kapatılacağını öğrendik.',
    completed: false,
  },
  {
    id: 'chk_7',
    category: 'Resmî Bilgi',
    text: 'Telefonlarımıza AFAD Acil Mobil Uygulamasını indirdik ve Meteoroloji Genel Müdürlüğü MeteoUYARI renk kodlarının anlamını ailemize anlattık.',
    completed: true,
  },
  {
    id: 'chk_8',
    category: 'Resmî Bilgi',
    text: 'Afet sırasında kaynağı belirsiz ses kayıtlarını ve doğrulanmamış sosyal medya dedikodularını asla yaymamaya söz verdik.',
    completed: true,
  },
];
