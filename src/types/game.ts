export type GamePhase = 
  | 'welcome'
  | 'playing'
  | 'chapter_complete'
  | 'final_report'
  | 'teacher_mode'
  | 'family_checklist';

export type WeatherState = 'sunny' | 'cloudy' | 'rain_light' | 'rain_heavy' | 'rain_torrential' | 'clearing';

export type MeteoWarningColor = 'green' | 'yellow' | 'orange' | 'red';

export type RoadStatus = 'open' | 'closed' | 'review_required';

export interface TileCoordinate {
  x: number;
  y: number;
}

export type TileType = 
  | 'grass'
  | 'slope'
  | 'rock'
  | 'river'
  | 'bridge'
  | 'road'
  | 'field'
  | 'gathering';

export interface MapBuilding {
  id: string;
  name: string;
  type: 'house' | 'karadeniz_house' | 'school' | 'hospital' | 'market' | 'pharmacy' | 'bridge' | 'gathering_area' | 'retaining_wall' | 'drain_drainage';
  tileX: number;
  tileY: number;
  rotation?: number;
  residentsCount?: number;
  riskDescription?: string;
  isInspected?: boolean;
  hasRiskSign?: boolean;
  riskCategory?: 'flood' | 'landslide' | 'safe' | 'infrastructure';
  signDetails?: string;
}

export interface HazardZone {
  id: string;
  type: 'flood' | 'landslide' | 'blocked_road';
  coordinates: TileCoordinate[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  activeInChapters: number[];
  name: string;
  description: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
  isSafe: boolean;
  feedback: string;
  scoreDelta?: number;
}

export interface DecisionDilemma {
  id: string;
  title: string;
  characterName: string;
  characterRole: string;
  characterAvatar?: string;
  context: string;
  officialGuidance?: string;
  sourceReference: string;
  options: ChoiceOption[];
}

export interface ChapterTask {
  id: string;
  title: string;
  description: string;
  targetCount?: number;
  currentCount?: number;
  completed: boolean;
  actionType: 'inspect_objects' | 'decision' | 'pack_bag' | 'verify_messages' | 'evaluate_route' | 'coordinate_needs' | 'general';
  relatedBuildingIds?: string[];
  dilemma?: DecisionDilemma;
}

export interface Chapter {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  simulatedTime: string; // e.g. "T-48 Saat", "T-12 Saat", "T+02:30"
  weather: WeatherState;
  meteoWarning: MeteoWarningColor;
  riverLevel: number; // 0 to 1
  introDialogue: {
    speaker: string;
    role: string;
    message: string;
  };
  tasks: ChapterTask[];
  learnedPrinciples: string[];
}

export interface BagItem {
  id: string;
  name: string;
  category: 'water_food' | 'safety_light' | 'health_hygiene' | 'communication' | 'documents' | 'unnecessary';
  weightUnits: number; // e.g. 1-3
  isEssential: boolean;
  explanation: string;
  iconName: string;
}

export interface SocialMessage {
  id: string;
  sender: string;
  platform: 'WhatsApp Ses Kaydı' | 'Resmî Açıklama' | 'Sosyal Medya Gönderisi' | 'Eski Haber Ekranı' | 'Mahalle Grubu';
  text: string;
  timestamp: string;
  realType: 'verified_official' | 'needs_verification' | 'misleading';
  feedback: string;
  isVerified?: boolean;
  userClassification?: 'verified_official' | 'needs_verification' | 'misleading';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
}

export interface ScoreBreakdown {
  riskDetection: number;      // max 20
  preparedness: number;       // max 25
  safeDecisionMaking: number; // max 30
  communication: number;      // max 15
  inclusivePlanning: number;  // max 10
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  topic: string;
}

export interface FamilyChecklistItem {
  id: string;
  text: string;
  category: 'İletişim' | 'Toplanma' | 'Afet Çantası' | 'Ev Güvenliği' | 'Resmî Bilgi' | 'Özel İhtiyaçlar';
  completed: boolean;
  note?: string;
}
