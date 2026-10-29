import { QuizQuestion } from '../types/game';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Sel suyu ile kaplanmış bir yolu gördüğünde en uygun yaklaşım nedir?',
    options: [
      { id: 'A', text: 'Suyun içinden yürüyerek karşıya geçmek' },
      { id: 'B', text: 'Güvenli yerde kalıp doğrulanmış yönlendirmeleri izlemek' },
      { id: 'C', text: 'Araçla hızla geçmeyi denemek' },
    ],
    correctOptionId: 'B',
    explanation: 'Sel suyunda yürümek veya araç sürmek hayati tehlikedir. 15 cm akıntılı su yayayı devirebilir, 30 cm su araçları sürükler. Güvenli bölgede kalıp yetkilileri beklemek gerekir.',
    topic: 'Sel Güvenliği',
  },
  {
    id: 2,
    question: 'Meteorolojik turuncu uyarının genel anlamı nedir?',
    options: [
      { id: 'A', text: 'Tehlike olmadığı, havanın güneşli olduğu' },
      { id: 'B', text: 'Hava koşullarının tehlikeli olduğu ve hasar oluşabileceği' },
      { id: 'C', text: 'Yalnızca hava sıcaklığının hafifçe arttığı' },
    ],
    correctOptionId: 'B',
    explanation: 'Turuncu kod tehlikeli hava hadiselerini ifade eder. Sel, taşkın ve heyelan riski yüksektir, çok dikkatli ve tedbirli olunmalıdır.',
    topic: 'MeteoUYARI',
  },
  {
    id: 3,
    question: 'Bir yamaçta yeni derin bir zemin çatlağı fark edildiğinde ne yapılmalıdır?',
    options: [
      { id: 'A', text: 'Çatlağın tam kenarına giderek içine doğru inceleme yapmak' },
      { id: 'B', text: 'Görmezden gelip havanın açmasını beklemek' },
      { id: 'C', text: 'Güvenli mesafede kalıp durumu yetkililere bildirmek' },
    ],
    correctOptionId: 'C',
    explanation: 'Zemin çatlakları heyelanın öncü işaretidir. Gevşeyen zemin aniden çökebilir. Profesyonel olmayan bireyler yaklaşmamalı, güvenli mesafeden 112/AFAD\'a ihbar etmelidir.',
    topic: 'Heyelan Riski',
  },
  {
    id: 4,
    question: 'Afet öncesinde ailenin toplanma alanına ilişkin ne yapması uygundur?',
    options: [
      { id: 'A', text: 'Resmî toplanma alanı bilgisini e-Devlet/AFAD üzerinden önceden öğrenmek ve planlamak' },
      { id: 'B', text: 'Afet gerçekleşince panikle rastgele bir meydan seçmek' },
      { id: 'C', text: 'Yalnızca sosyal medya yorumlarındaki önerilere bakmak' },
    ],
    correctOptionId: 'A',
    explanation: 'Toplanma alanları e-Devlet üzerinden önceden sorgulanmalı, tüm aile bireyleri tarafından öğrenilmeli ve tatbikatı yapılmalıdır.',
    topic: 'Aile Planı',
  },
  {
    id: 5,
    question: 'Kaynağı belirsiz bir afet mesajıyla veya ses kaydıyla karşılaşıldığında ne yapılmalıdır?',
    options: [
      { id: 'A', text: 'Daha çok kişi görsün diye hemen bütün gruplarda paylaşmak' },
      { id: 'B', text: 'Güncel resmî kaynaklardan doğrulamak ve doğrulanmayanı yaymamak' },
      { id: 'C', text: 'Mesajı daha korkutucu ve abartılı hâle getirmek' },
    ],
    correctOptionId: 'B',
    explanation: 'Dezenformasyon afet yönetimini felce uğratır. Yalnızca Valilik, AFAD ve resmî yetkililerin teyit ettiği bilgiler dikkate alınmalı ve paylaşılmalıdır.',
    topic: 'Bilgi Doğrulama',
  },
  {
    id: 6,
    question: 'Afet çantasında aşağıdakilerden hangisi temel ve öncelikli hazırlık malzemesidir?',
    options: [
      { id: 'A', text: 'Su, ilk yardım kiti, düdük ve el feneri' },
      { id: 'B', text: 'Büyük dekoratif biblo ve porselen eşyalar' },
      { id: 'C', text: 'Ağır oyun konsolu ve büyük hoparlörler' },
    ],
    correctOptionId: 'A',
    explanation: 'Afet çantası ilk 72 saat hayati fonksiyonları idame ettirecek hafif, dayanıklı temel gıda, su, sağlık ve haberleşme gereçlerini içermelidir.',
    topic: 'Afet Çantası',
  },
  {
    id: 7,
    question: 'Yetkililerce taşkın riski sebebiyle kapatılmış bir köprü için en uygun karar hangisidir?',
    options: [
      { id: 'A', text: 'Kestirme olduğu için güvenlik şeridini aşarak hızla geçmek' },
      { id: 'B', text: 'Kapatma kararına uymak ve teyitli güvenli alternatif rotayı kullanmak' },
      { id: 'C', text: 'Suyun derinliğini test etmek için köprünün ortasına yürümek' },
    ],
    correctOptionId: 'B',
    explanation: 'Kapatılan köprülerin zemin ayakları sel akıntısıyla oyulmuş olabilir. Kestirme değil, emniyetli doğrulanmış rota tercih edilmelidir.',
    topic: 'Güvenli Güzergâh',
  },
  {
    id: 8,
    question: 'Afet sonrası hasar görmüş bir binaya geri dönüşte hangi yaklaşım doğrudur?',
    options: [
      { id: 'A', text: 'Eşya almak için bina sahibinin hemen içeri dalması' },
      { id: 'B', text: 'Başkaları girdiyse yapıyı sağlam sayıp girmek' },
      { id: 'C', text: 'Yetkili teknik ekiplerin güvenlik değerlendirmesi ve onayına uymak' },
    ],
    correctOptionId: 'C',
    explanation: 'Hasar tespiti yapılmamış binalarda gizli taşıyıcı hasarları, gaz kaçakları ve çökme tehlikesi bulunur. Resmî onay olmadan asla girilmez.',
    topic: 'Afet Sonrası Davranış',
  },
  {
    id: 9,
    question: 'Aile afet hazırlık planında özellikle ne dikkate alınmalıdır?',
    options: [
      { id: 'A', text: 'Yalnızca yetişkin bireylerin gücü ve istekleri' },
      { id: 'B', text: 'Yalnızca araçların yakıt durumu' },
      { id: 'C', text: 'Bebek, yaşlı, engelli ve kronik hasta bireyler dahil tüm özel ihtiyaçlar' },
    ],
    correctOptionId: 'C',
    explanation: 'Kapsayıcı afet planlaması ailedeki ve mahalledeki tüm bireylerin ilaç, mama, tekerlekli sandalye gibi özel ihtiyaçlarını zorunlu olarak içerir.',
    topic: 'Kapsayıcılık',
  },
  {
    id: 10,
    question: 'Bir afet senaryosunda güvenli güzergâh nasıl değerlendirilir?',
    options: [
      { id: 'A', text: 'Yalnızca metre cinsinden en kısa mesafeye bakılarak' },
      { id: 'B', text: 'Güncel tehlike, kapatma, zemin eğimi ve yetkili yönlendirmelerine bakılarak' },
      { id: 'C', text: 'En çok arabanın peş peşe gittiği yola bakılarak' },
    ],
    correctOptionId: 'B',
    explanation: 'En kısa yol sel veya heyelan riski altında olabilir. Güvenli rota tespitinde resmî açıklamalar, açık yollar ve zemin güvenliği belirleyicidir.',
    topic: 'Güzergâh Değerlendirme',
  },
];
