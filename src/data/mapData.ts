import { MapBuilding, HazardZone, TileCoordinate } from '../types/game';

export const MAP_WIDTH = 40;
export const MAP_HEIGHT = 30;

// River path traversing through the neighborhood
export const RIVER_TILES: TileCoordinate[] = [
  // Upper entry from northeast mountain canyon
  { x: 32, y: 0 }, { x: 31, y: 1 }, { x: 30, y: 2 }, { x: 29, y: 3 }, { x: 28, y: 4 },
  { x: 27, y: 5 }, { x: 26, y: 6 }, { x: 25, y: 7 }, { x: 24, y: 8 }, { x: 23, y: 9 },
  { x: 22, y: 10 }, { x: 21, y: 11 }, { x: 20, y: 12 }, { x: 20, y: 13 }, { x: 19, y: 14 },
  // Meander through center
  { x: 18, y: 15 }, { x: 18, y: 16 }, { x: 17, y: 17 }, { x: 16, y: 18 }, { x: 15, y: 19 },
  { x: 14, y: 20 }, { x: 13, y: 21 }, { x: 12, y: 22 }, { x: 11, y: 23 }, { x: 10, y: 24 },
  { x: 9, y: 25 }, { x: 8, y: 26 }, { x: 7, y: 27 }, { x: 6, y: 28 }, { x: 5, y: 29 },
  // Secondary river width buffer (wider flow)
  { x: 31, y: 0 }, { x: 30, y: 1 }, { x: 29, y: 2 }, { x: 28, y: 3 }, { x: 27, y: 4 },
  { x: 26, y: 5 }, { x: 25, y: 6 }, { x: 24, y: 7 }, { x: 23, y: 8 }, { x: 22, y: 9 },
  { x: 21, y: 10 }, { x: 20, y: 11 }, { x: 19, y: 12 }, { x: 19, y: 13 }, { x: 18, y: 14 },
  { x: 17, y: 15 }, { x: 17, y: 16 }, { x: 16, y: 17 }, { x: 15, y: 18 }, { x: 14, y: 19 },
  { x: 13, y: 20 }, { x: 12, y: 21 }, { x: 11, y: 22 }, { x: 10, y: 23 }, { x: 9, y: 24 },
  { x: 8, y: 25 }, { x: 7, y: 26 }, { x: 6, y: 27 }, { x: 5, y: 28 }, { x: 4, y: 29 },
];

export const isRiverTile = (x: number, y: number): boolean => {
  return RIVER_TILES.some(t => t.x === x && t.y === y);
};

// Two crucial bridges crossing the river
export const BRIDGE_1_TILES: TileCoordinate[] = [
  { x: 24, y: 7 }, { x: 25, y: 7 } // Kuzey Ahşap/Alçak Köprü (Floods & gets closed by AFAD/Authorities in Ch 4)
];

export const BRIDGE_2_TILES: TileCoordinate[] = [
  { x: 15, y: 18 }, { x: 16, y: 18 } // Güney Yüksek Beton Ana Köprü (Reinforced, higher elevation)
];

// Elevation levels (0 to 3) representing Black Sea terrain topography
export const getTileElevation = (x: number, y: number): number => {
  if (isRiverTile(x, y)) return -0.4;
  // Northern hills (Y: 0 to 11)
  if (y < 4) return 2.6;
  if (y < 8) return 1.8;
  if (y < 12) return 1.0;
  // Eastern ridge
  if (x > 34 && y < 18) return 1.5;
  // West high plateau (West gathering area)
  if (x < 7 && y > 15) return 0.8;
  // Central river plain
  return 0.2;
};

// Road networks
export const ROAD_TILES: TileCoordinate[] = [
  // Main East-West arterial through center
  ...Array.from({ length: 40 }, (_, i) => ({ x: i, y: 18 })),
  // Secondary connection across north bridge
  ...Array.from({ length: 20 }, (_, i) => ({ x: 16 + i, y: 7 })),
  // North-South connecting road west bank
  ...Array.from({ length: 26 }, (_, i) => ({ x: 12, y: i + 3 })),
  // North-South connecting road east bank
  ...Array.from({ length: 24 }, (_, i) => ({ x: 28, y: i + 3 })),
  // Hospital & School approach road
  ...Array.from({ length: 15 }, (_, i) => ({ x: 6, y: i + 10 })),
  ...Array.from({ length: 10 }, (_, i) => ({ x: i + 6, y: 12 })),
  // Slope service road
  ...Array.from({ length: 14 }, (_, i) => ({ x: 20 + i, y: 4 })),
];

export const isRoadTile = (x: number, y: number): boolean => {
  return ROAD_TILES.some(t => t.x === x && t.y === y);
};

// Hazard Zones
export const HAZARD_ZONES: HazardZone[] = [
  {
    id: 'hz_flood_riverbed',
    name: 'Dere Yatağı Taşkın Riski Koridoru',
    type: 'flood',
    severity: 'critical',
    activeInChapters: [3, 4, 5, 6, 7],
    description: 'Şiddetli yağış durumunda derenin debisi hızla yükselerek yatak kenarındaki kotu düşük alanları su basabilir.',
    coordinates: RIVER_TILES.flatMap(t => [
      { x: t.x - 1, y: t.y },
      { x: t.x + 1, y: t.y },
      { x: t.x, y: t.y - 1 },
      { x: t.x, y: t.y + 1 },
    ]),
  },
  {
    id: 'hz_landslide_north_slope',
    name: 'Kuzey Yamaç Çatlak & Heyelan Bölgesi',
    type: 'landslide',
    severity: 'critical',
    activeInChapters: [1, 2, 3, 4, 5, 6, 7, 8],
    description: 'Suya doygun dik eğimli yamaçta yeni derin zemin çatlakları ve deforme istinat duvarı tespit edilmiştir.',
    coordinates: [
      { x: 22, y: 3 }, { x: 23, y: 3 }, { x: 24, y: 3 }, { x: 25, y: 3 }, { x: 26, y: 3 },
      { x: 22, y: 4 }, { x: 23, y: 4 }, { x: 24, y: 4 }, { x: 25, y: 4 }, { x: 26, y: 4 },
      { x: 23, y: 5 }, { x: 24, y: 5 }, { x: 25, y: 5 },
    ],
  },
  {
    id: 'hz_blocked_bridge_1',
    name: 'Alçak Köprü Kapatılan Geçiş',
    type: 'blocked_road',
    severity: 'high',
    activeInChapters: [4, 5, 6, 7],
    description: 'Su seviyesinin köprü tabliyesini aşması sebebiyle emniyet ve AFAD ekiplerince yaya ve araç trafiğine kapatılmıştır.',
    coordinates: BRIDGE_1_TILES,
  },
];

// Key neighborhood buildings & infrastructure points
export const BUILDINGS: MapBuilding[] = [
  // Critical Public Buildings
  {
    id: 'bld_school',
    name: 'Yamaçdere Şehitler İlk ve Ortaokulu',
    type: 'school',
    tileX: 7,
    tileY: 13,
    residentsCount: 320,
    riskDescription: 'Okul binası sağlam zemindedir. Acil durum tahliye kapıları açık ve afet planı mevcuttur.',
    riskCategory: 'safe',
  },
  {
    id: 'bld_hospital',
    name: 'Yamaçdere Aile Sağlığı Merkezi',
    type: 'hospital',
    tileX: 9,
    tileY: 16,
    residentsCount: 18,
    riskDescription: 'Sağlık personeli ve acil müdahale dolabı aktiftir. Ambulans giriş güzergâhı açık tutulmalıdır.',
    riskCategory: 'safe',
  },
  {
    id: 'bld_market_1',
    name: 'Merkez Market & Lojistik Noktası',
    type: 'market',
    tileX: 11,
    tileY: 17,
    residentsCount: 6,
    riskDescription: 'Temel kuru gıda ve su stoklarına sahiptir.',
    riskCategory: 'infrastructure',
  },
  {
    id: 'bld_pharmacy',
    name: 'Yamaç Eczanesi',
    type: 'pharmacy',
    tileX: 13,
    tileY: 17,
    residentsCount: 3,
    riskDescription: 'Kronik ilaç ihtiyacı olan sakinlerin listesi bulunmaktadır.',
    riskCategory: 'infrastructure',
  },
  // Safe Gathering Areas
  {
    id: 'bld_gather_west',
    name: 'Batı Güvenli Toplanma Alanı (Kurgusal Doğrulanmış)',
    type: 'gathering_area',
    tileX: 4,
    tileY: 22,
    residentsCount: 0,
    riskDescription: 'Hem sel su seviyesinden yüksek hem de dik yamaçlardan güvenli mesafededir. Tabela ve aydınlatması mevcuttur.',
    riskCategory: 'safe',
  },
  {
    id: 'bld_gather_east',
    name: 'Doğu Spor Sahası Toplanma Alanı',
    type: 'gathering_area',
    tileX: 34,
    tileY: 15,
    residentsCount: 0,
    riskDescription: 'Geniş düzlük, helikopter inişine uygun ve yamaç/dere taşkın etki sahası dışındadır.',
    riskCategory: 'safe',
  },
  // Specific Hazard & Inspection Objects for Chapters
  {
    id: 'bld_crack_slope',
    name: 'Yamaçtaki Yeni Zemin Çatlağı & Eğilen Direk',
    type: 'retaining_wall',
    tileX: 24,
    tileY: 4,
    riskDescription: 'Zeminde 4 parmak genişliğinde yeni açılmış çatlak ve telefon direğinde 15 derecelik eğilme tespit edilmiştir.',
    hasRiskSign: true,
    riskCategory: 'landslide',
    signDetails: 'Heyelan öncü belirtisidir. Derhal yetkililere bildirilmelidir!',
  },
  {
    id: 'bld_house_riverbank_1',
    name: 'Dere Yatağına Sıfır Konut (Riskli)',
    type: 'karadeniz_house',
    tileX: 18,
    tileY: 13,
    residentsCount: 5,
    riskDescription: 'Dere taşkın kotunun tam sınırında yer almaktadır. Bodrum katı su basma riski taşır.',
    hasRiskSign: true,
    riskCategory: 'flood',
    signDetails: 'Dere debisi arttığında alt katlar derhal boşaltılmalı, çatı/üst kat veya güvenli alana geçilmelidir.',
  },
  {
    id: 'bld_drain_clogged',
    name: 'Tıkalı Yağmur Suyu Izgarası',
    type: 'drain_drainage',
    tileX: 16,
    tileY: 17,
    riskDescription: 'Kuru ağaç dalları ve çakıl nedeniyle su menfezi tıkanmış, yüzey suyu göllenme yapmaktadır.',
    hasRiskSign: true,
    riskCategory: 'infrastructure',
    signDetails: 'Yüzey suyunun deşarjını engeller, belediye fen işlerine öncelikli bildirim gerektirir.',
  },
  {
    id: 'bld_deformed_wall',
    name: 'Deforme Olmuş İstinat Duvarı',
    type: 'retaining_wall',
    tileX: 27,
    tileY: 6,
    riskDescription: 'Taş istinat duvarında dışa doğru bombeleşme ve derz harçlarında dökülme mevcuttur.',
    hasRiskSign: true,
    riskCategory: 'landslide',
    signDetails: 'Duvar arkasındaki su drenaj borularının tıkandığını ve aşırı zemin yükü bindiğini gösterir.',
  },
  {
    id: 'bld_north_bridge',
    name: 'Kuzey Ahşap/Alçak Köprü',
    type: 'bridge',
    tileX: 24,
    tileY: 7,
    riskDescription: 'Alçak tabliyeli köprü. Yoğun yağışta taşan sel suları tabliyenin üstünden akmaktadır.',
    hasRiskSign: true,
    riskCategory: 'flood',
  },
  {
    id: 'bld_south_bridge',
    name: 'Güney Yüksek Beton Ana Köprü',
    type: 'bridge',
    tileX: 15,
    tileY: 18,
    riskDescription: 'Yüksek beton ayaklı köprü. Yetkili ekiplerce kontrolleri yapılmış, açık ve güvenli ana geçiş rotasıdır.',
    riskCategory: 'safe',
  },
  // Residential Neighborhood (30 housing clusters distributed across slopes and plains)
  { id: 'bld_h_01', name: 'Ahşap Konut - Çay Bahçesi Üstü', type: 'karadeniz_house', tileX: 28, tileY: 3, residentsCount: 4, riskCategory: 'landslide' },
  { id: 'bld_h_02', name: 'Geleneksel Konut 2', type: 'karadeniz_house', tileX: 32, tileY: 4, residentsCount: 6, riskCategory: 'safe' },
  { id: 'bld_h_03', name: 'Yamaç Evi A Blok', type: 'house', tileX: 21, tileY: 2, residentsCount: 5, riskCategory: 'landslide' },
  { id: 'bld_h_04', name: 'Yamaç Evi B Blok', type: 'house', tileX: 20, tileY: 5, residentsCount: 8, riskCategory: 'landslide' },
  { id: 'bld_h_05', name: 'Dere Boyu Konut 3', type: 'house', tileX: 21, tileY: 9, residentsCount: 4, riskCategory: 'flood' },
  { id: 'bld_h_06', name: 'Dere Boyu Konut 4', type: 'house', tileX: 22, tileY: 12, residentsCount: 6, riskCategory: 'flood' },
  { id: 'bld_h_07', name: 'Gül Sokak Apartmanı 1', type: 'house', tileX: 10, tileY: 8, residentsCount: 16, riskCategory: 'safe' },
  { id: 'bld_h_08', name: 'Gül Sokak Apartmanı 2', type: 'house', tileX: 14, tileY: 8, residentsCount: 14, riskCategory: 'safe' },
  { id: 'bld_h_09', name: 'Öğretmenler Sitesi A', type: 'house', tileX: 7, tileY: 10, residentsCount: 18, riskCategory: 'safe' },
  { id: 'bld_h_10', name: 'Öğretmenler Sitesi B', type: 'house', tileX: 5, tileY: 10, residentsCount: 15, riskCategory: 'safe' },
  { id: 'bld_h_11', name: 'Sağlık Yanı Konut 1', type: 'house', tileX: 10, tileY: 14, residentsCount: 7, riskCategory: 'safe' },
  { id: 'bld_h_12', name: 'Sağlık Yanı Konut 2', type: 'house', tileX: 12, tileY: 14, residentsCount: 9, riskCategory: 'safe' },
  { id: 'bld_h_13', name: 'Meydan Apartmanı', type: 'house', tileX: 10, tileY: 19, residentsCount: 22, riskCategory: 'safe' },
  { id: 'bld_h_14', name: 'Pınar Konakları 1', type: 'karadeniz_house', tileX: 7, tileY: 19, residentsCount: 5, riskCategory: 'safe' },
  { id: 'bld_h_15', name: 'Pınar Konakları 2', type: 'karadeniz_house', tileX: 5, tileY: 19, residentsCount: 4, riskCategory: 'safe' },
  { id: 'bld_h_16', name: 'Batı Tepe Evleri 1', type: 'karadeniz_house', tileX: 4, tileY: 25, residentsCount: 6, riskCategory: 'safe' },
  { id: 'bld_h_17', name: 'Batı Tepe Evleri 2', type: 'karadeniz_house', tileX: 6, tileY: 26, residentsCount: 5, riskCategory: 'safe' },
  { id: 'bld_h_18', name: 'Alt Geçit Yakını Konut', type: 'house', tileX: 11, tileY: 21, residentsCount: 8, riskCategory: 'flood' },
  { id: 'bld_h_19', name: 'Doğu Yakası Sitesi 1', type: 'house', tileX: 30, tileY: 10, residentsCount: 20, riskCategory: 'safe' },
  { id: 'bld_h_20', name: 'Doğu Yakası Sitesi 2', type: 'house', tileX: 32, tileY: 12, residentsCount: 18, riskCategory: 'safe' },
  { id: 'bld_h_21', name: 'Doğu Dereyolu Konut 1', type: 'house', tileX: 23, tileY: 16, residentsCount: 7, riskCategory: 'flood' },
  { id: 'bld_h_22', name: 'Doğu Dereyolu Konut 2', type: 'house', tileX: 20, tileY: 19, residentsCount: 6, riskCategory: 'flood' },
  { id: 'bld_h_23', name: 'Yıldız Sokak 1', type: 'karadeniz_house', tileX: 35, tileY: 9, residentsCount: 4, riskCategory: 'safe' },
  { id: 'bld_h_24', name: 'Yıldız Sokak 2', type: 'karadeniz_house', tileX: 36, tileY: 12, residentsCount: 5, riskCategory: 'safe' },
  { id: 'bld_h_25', name: 'Çamlık Konakları 1', type: 'karadeniz_house', tileX: 30, tileY: 19, residentsCount: 6, riskCategory: 'safe' },
  { id: 'bld_h_26', name: 'Çamlık Konakları 2', type: 'karadeniz_house', tileX: 33, tileY: 21, residentsCount: 7, riskCategory: 'safe' },
  { id: 'bld_h_27', name: 'Güney Köprübaşı Konut', type: 'house', tileX: 17, tileY: 20, residentsCount: 10, riskCategory: 'flood' },
  { id: 'bld_h_28', name: 'Menderes Yolu Konut', type: 'house', tileX: 14, tileY: 23, residentsCount: 8, riskCategory: 'flood' },
  { id: 'bld_h_29', name: 'Taş Mektep Yanı Konut', type: 'karadeniz_house', tileX: 27, tileY: 22, residentsCount: 4, riskCategory: 'safe' },
  { id: 'bld_h_30', name: 'Vadi Sonu Çiftlik Evi', type: 'karadeniz_house', tileX: 10, tileY: 27, residentsCount: 5, riskCategory: 'flood' },
];
