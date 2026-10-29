import { Chapter } from '../types/game';

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 0,
    code: 'BOLUM_0',
    title: 'Bölüm 0: Yamaçdere\'ye Hoş Geldin',
    subtitle: 'Mahalleni Tanı ve Kontrolleri Öğren',
    simulatedTime: 'T-48 Saat (Hazırlık Öncesi)',
    weather: 'sunny',
    meteoWarning: 'green',
    riverLevel: 0.15,
    introDialogue: {
      speaker: 'Derya',
      role: 'Afet Hazırlık Danışmanı',
      message: 'Merhaba! Yamaçdere Mahallemizin Afet Hazırlık ve Karar Destek Ekibine hoş geldin. Mahallemiz Karadeniz\'in yeşil doğasında sakin görünüyor; ancak güvenli bir mahalle yalnızca bugün güvende olan değil, yarının sel ve heyelan risklerine hazırlıklı olandır. İlk görevin haritayı incelemek ve kritik noktaları keşfetmek!',
    },
    learnedPrinciples: [
      'Afet hazırlığı olay anında değil, normal zamanlarda başlar.',
      'Haritayı tanımak, güvenli toplanma alanlarını ve su yollarını önceden bilmeyi sağlar.',
      'Resmî bilgilendirme duyurularını düzenli takip etmek erken önlem aldırır.'
    ],
    tasks: [
      {
        id: 'task_0_1',
        title: 'Kritik 5 Noktayı Keşfet',
        description: '3D haritada Okul, Sağlık Merkezi, Dere, Riskli Yamaç ve Güvenli Toplanma Alanı\'na tıklayarak incele.',
        actionType: 'inspect_objects',
        targetCount: 5,
        currentCount: 0,
        completed: false,
        relatedBuildingIds: ['bld_school', 'bld_hospital', 'bld_house_riverbank_1', 'bld_crack_slope', 'bld_gather_west'],
      },
      {
        id: 'task_0_2',
        title: 'Risk Sembollerini Öğren',
        description: 'Mavi (Güvenli/Hizmet), Kırmızı (Sel Tehlikesi) ve Turuncu (Heyelan/Zemin Riski) işaretlerini ayırt et.',
        actionType: 'decision',
        completed: false,
        dilemma: {
          id: 'dil_0_symbols',
          title: 'Risk İşaretlerini Sınıflandır',
          characterName: 'Mert',
          characterRole: 'Mahalle Gönüllüsü',
          context: 'Mahallemizde sokaklara yeni bilgilendirme ve tehlike işaretleri koyuyoruz. Hangi sembolün hangi duruma işaret ettiğini doğru eşleştirmeliyiz.',
          sourceReference: 'AFAD Afet Farkındalık Eğitimi El Kitabı',
          options: [
            {
              id: 'A',
              text: 'Sarı/Turuncu: Heyelan veya Zemin Çatlağı İnceleme Bölgesi; Kırmızı: Aktif Tehlike / Taşkın Alanı; Mavi/Yeşil: Güvenli Toplanma ve Hizmet Alanı',
              isSafe: true,
              feedback: 'Tebrikler! Uluslararası ve ulusal standartlarda uyarı renkleri risk derecelerine göre belirlenir. Yüksek alanlar otomatik olarak güvenli değildir; heyelan riskine de bakılmalıdır.',
              scoreDelta: 10,
            },
            {
              id: 'B',
              text: 'Bütün yüksek yerler rengi ne olursa olsun kesinlikle güvenlidir, renklerin önemi yoktur.',
              isSafe: false,
              feedback: 'Yanlış varsayım! Rize ve Karadeniz gibi eğimli arazilerde yüksek noktalar selden korunaklı olsa bile heyelan riski taşıyabilir. Renk kodları ve yerel zemin etütleri hayati önem taşır.',
              scoreDelta: 0,
            }
          ]
        }
      },
      {
        id: 'task_0_3',
        title: 'Resmî Duyuru Ekranını Aç',
        description: 'Mahalle Yönetim Paneli üzerinden resmî duyuru akışını kontrol et.',
        actionType: 'general',
        completed: false,
      }
    ]
  },
  {
    id: 1,
    code: 'BOLUM_1',
    title: 'Bölüm 1: Tehlikeyi Önceden Gör',
    subtitle: 'Mahalledeki Risk Belirtilerini Tespit Et',
    simulatedTime: 'T-24 Saat (Saha İncelemesi)',
    weather: 'cloudy',
    meteoWarning: 'green',
    riverLevel: 0.2,
    introDialogue: {
      speaker: 'Mert',
      role: 'Mahalle Gönüllüsü',
      message: 'Derya Hanım haklıydı, mahallede saha taramasına çıktık. Yamaçta zemin çatlakları, dere kenarında tıkanmış bir ızgara ve deforme olmuş bir istinat duvarı fark ettik. Çocukların tehlikeli bölgelere girip kurtarıcılık yapması değil; riskleri erkenden gözlemleyip AFAD ve belediyeye bildirmesi esastır!',
    },
    learnedPrinciples: [
      'Yamaçlardaki yeni çatlaklar ve eğilen elektrik direkleri heyelanın en belirgin habercisidir.',
      'Tıkalı menfezler ve ızgaralar hafif yağışları bile aniden sele dönüştürebilir.',
      'Vatandaşlar bireysel müdahale yerine güvenli mesafeden yetkililere ihbarda bulunmalıdır.'
    ],
    tasks: [
      {
        id: 'task_1_1',
        title: 'Riskli 4 Noktayı Tespit Et',
        description: 'Haritadaki Yamaç Çatlağı, Tıkalı Izgara, Deforme İstinat Duvarı ve Dere Kenarı Konutunu bularak incele.',
        actionType: 'inspect_objects',
        targetCount: 4,
        currentCount: 0,
        completed: false,
        relatedBuildingIds: ['bld_crack_slope', 'bld_drain_clogged', 'bld_deformed_wall', 'bld_house_riverbank_1'],
      },
      {
        id: 'task_1_2',
        title: 'Yamaçtaki Çatlak Kararı',
        description: 'Yamaç kenarındaki yeni açılmış 4 parmaklık yarık için doğru güvenlik tavrını belirle.',
        actionType: 'decision',
        completed: false,
        dilemma: {
          id: 'dil_1_crack',
          title: 'Yamaçtaki Derin Çatlağa Yaklaşım',
          characterName: 'Mert',
          characterRole: 'Mahalle Gönüllüsü',
          context: 'Yamaçtaki çay bahçesinin hemen altında derin bir zemin yarığı var. Bazı mahalleliler çatlağın derinliğini ölçmek için kenarına kadar yürümek istiyor.',
          officialGuidance: 'AFAD Heyelan Rehberi: Çatlak ve kayma belirtisi görülen zeminlerin kenarına yaklaşılmamalı, derhal güvenli bölgeye çekilip 112 Acil Çağrı Merkezine bildirim yapılmalıdır.',
          sourceReference: 'AFAD Heyelan Hazırlık ve Korunma Rehberi',
          options: [
            {
              id: 'A',
              text: 'Çatlağın tam kenarına gidip cep telefonuyla içine bakarak ne kadar derin olduğunu ölç.',
              isSafe: false,
              feedback: 'Tehlikeli Karar! Zemin kayması ve kopması aniden gerçekleşebilir. Heyelan riski taşıyan zemin kenarları gevşektir; ağırlığınızla çökebilir.',
              scoreDelta: 0,
            },
            {
              id: 'B',
              text: 'Güvenli mesafede kal, çevredeki insanları uyar ve durumu derhal yetkili birimlere bildir.',
              isSafe: true,
              feedback: 'Doğru ve Güvenli Karar! Profesyonel olmayan bireyler heyelan bölgesine girmemeli; mesafesini koruyarak koordinasyon ekiplerine haber vermelidir.',
              scoreDelta: 15,
            },
            {
              id: 'C',
              text: 'Önemseme; toprak kuru görünüyor, yağmur yağınca tekrar bakarız.',
              isSafe: false,
              feedback: 'Riskli ihmal! Zemin kuru olsa bile çatlak oluşumu iç gerilmelerin başladığını gösterir. Şiddetli yağmur çatlağa dolduğunda heyelanı tetikleyecektir.',
              scoreDelta: 0,
            }
          ]
        }
      }
    ]
  },
  {
    id: 2,
    code: 'BOLUM_2',
    title: 'Bölüm 2: Mahalleni Hazırla',
    subtitle: 'Afet Çantası & Aile ve Okul Planlaması',
    simulatedTime: 'T-18 Saat (Kişisel & Ortak Hazırlık)',
    weather: 'cloudy',
    meteoWarning: 'green',
    riverLevel: 0.22,
    introDialogue: {
      speaker: 'Elif Öğretmen',
      role: 'Okul Koordinatörü',
      message: 'Okulumuzda afet tatbikatı yapıyoruz ve öğrencilerimizin aileleriyle birlikte afet çantası hazırlamasını istiyoruz. Afet çantası gereksiz ağır eşyalarla doldurulmaz; ilk 72 saat hayatta kalmayı sağlayacak temel ihtiyaçları içermelidir!',
    },
    learnedPrinciples: [
      'Afet çantası taşınabilir olmalı; hayati su, gıda, ilk yardım, düdük ve fener içermelidir.',
      'Aile bireyleri afet anında nasıl haberleşeceklerini ve nerede buluşacaklarını önceden kararlaştırmalıdır.',
      'Okul tahliye planında panik yapmadan engelli ve özel gereksinimli bireyler de hesaba katılmalıdır.'
    ],
    tasks: [
      {
        id: 'task_2_1',
        title: 'Afet Çantasını Eksiksiz Hazırla',
        description: 'Afet Çantası modülünü aç, temel 6 hayati malzemeyi seçerek çantaya yerleştir.',
        actionType: 'pack_bag',
        completed: false,
      },
      {
        id: 'task_2_2',
        title: 'Okul Güvenlik Planını Tamamla',
        description: 'Elif Öğretmen ile birlikte okul tahliye protokolünü doğrula.',
        actionType: 'decision',
        completed: false,
        dilemma: {
          id: 'dil_2_school',
          title: 'Okul Afet Tahliye Önceliği',
          characterName: 'Elif Öğretmen',
          characterRole: 'Okul Koordinatörü',
          context: 'Okulda 320 öğrenci var. Meteorolojik bir acil durumda aileler panikle okula akın etmeden önce nasıl bir plan uygulanmalı?',
          officialGuidance: 'MEB & AFAD Okul Afet Planı: Öğrenciler velileri rastgele okula koşmadan önce okul afet toplanma alanında öğretmen gözetiminde güvene alınır ve teyitli iletişimle teslim edilir.',
          sourceReference: 'MEB Okul Tabanlı Afet Eğitimi Kılavuzu',
          options: [
            {
              id: 'A',
              text: 'Zil çalar çalmaz bütün öğrencileri ana caddeye doğru koşturarak evlerine yolla.',
              isSafe: false,
              feedback: 'Ciddi Güvenlik Hatası! Kaotik sokak trafiğinde sel suları ve panik ezilmelere yol açabilir. Çocuklar okulun güvenli iç toplanma alanında kontrollü tutulmalıdır.',
              scoreDelta: 0,
            },
            {
              id: 'B',
              text: 'Okul acil toplanma alanında yoklama al, güncel veli iletişim planını uygula ve okul idaresi koordinasyonunda güvenli teslimat sağla.',
              isSafe: true,
              feedback: 'Mükemmel! Kontrollü iletişim ve belirlenmiş güvenli toplanma alanı kayıp ve panik risklerini sıfıra indirir.',
              scoreDelta: 15,
            }
          ]
        }
      }
    ]
  },
  {
    id: 3,
    code: 'BOLUM_3',
    title: 'Bölüm 3: Uyarı Geldi',
    subtitle: 'MeteoUYARI Değerlendirmesi & Bilgi Doğrulama',
    simulatedTime: 'T-6 Saat (Meteorolojik Alarm)',
    weather: 'rain_light',
    meteoWarning: 'orange',
    riverLevel: 0.35,
    introDialogue: {
      speaker: 'Aylin',
      role: 'Yerel Yönetim Temsilcisi',
      message: 'Meteoroloji Genel Müdürlüğü ve AFAD\'dan resmî MeteoUYARI bildirimi geldi: Rize ve Doğu Karadeniz havzası için TURUNCU KOD verildi! Bu sırada sosyal medyada asılsız korku yayan ses kayıtları dolaşıyor. Görevimiz resmî bilgiyi ayıklamak ve mahalleliye doğru rehberlik etmektir!',
    },
    learnedPrinciples: [
      'Turuncu Kod: Tehlikeli hava durumu tahmin edilmektedir; hasar ve can kaybı riski yüksektir, çok tedbirli olunmalıdır.',
      'Sosyal medyadaki "Baraj patladı!" gibi kaynağı belirsiz ses kayıtları teyit edilmeden asla paylaşılmamalıdır.',
      'Resmî bilgilendirmelerde tarih, saat, kurum adı ve somut davranış önerisi yer almalıdır.'
    ],
    tasks: [
      {
        id: 'task_3_1',
        title: 'MeteoUYARI Kodunu Anla',
        description: 'Turuncu kodun taşıdığı anlamı ve alınması gereken önlemi belirle.',
        actionType: 'decision',
        completed: false,
        dilemma: {
          id: 'dil_3_meteo',
          title: 'Turuncu Kodun Anlamı Nedir?',
          characterName: 'Aylin',
          characterRole: 'Yerel Yönetim Temsilcisi',
          context: 'Vatandaşlar "Turuncu uyarı geldi, ama şu an sadece çiseliyor, dışarı pikniğe gidebilir miyiz?" diye soruyor.',
          officialGuidance: 'MGM MeteoUYARI: Turuncu Kod hava durumunun tehlikeli olduğunu gösterir. Beklenen meteorolojik hadise sıklıkla görülmeyen türdendir. Hasar ve kayıplar oluşması muhtemeldir.',
          sourceReference: 'Meteoroloji Genel Müdürlüğü MeteoUYARI Tanımları',
          options: [
            {
              id: 'A',
              text: 'Sıradan bir yağmurdur, dere kenarında yürüyüş yapılmasında sakınca yoktur.',
              isSafe: false,
              feedback: 'Hatalı Değerlendirme! Karadeniz\'de turuncu kod ani sağanak ve sel baskını demektir. Dere yataklarından derhal uzaklaşılmalıdır.',
              scoreDelta: 0,
            },
            {
              id: 'B',
              text: 'Hava durumu tehlikelidir; sel, taşkın ve heyelan riski yüksektir. Dere kenarları ve dik yamaçlardan uzak durulmalı, resmî duyurular izlenmelidir.',
              isSafe: true,
              feedback: 'Çok Doğru! Turuncu kod en yüksek ikinci tehlike seviyesidir ve ciddi hazırlık gerektirir.',
              scoreDelta: 15,
            }
          ]
        }
      },
      {
        id: 'task_3_2',
        title: '3 Mesajı Doğrula',
        description: 'Haberleşme akışındaki 3 farklı iletiyi inceleyerek Resmî / Şüpheli ayrımı yap.',
        actionType: 'verify_messages',
        completed: false,
      }
    ]
  },
  {
    id: 4,
    code: 'BOLUM_4',
    title: 'Bölüm 4: Su Yükseliyor',
    subtitle: 'Kapanan Köprü ve Güvenli Rota Seçimi',
    simulatedTime: 'T+02:30 (Şiddetli Yağış & Sel)',
    weather: 'rain_torrential',
    meteoWarning: 'red',
    riverLevel: 0.85,
    introDialogue: {
      speaker: 'Derya',
      role: 'Afet Hazırlık Danışmanı',
      message: 'Şiddetli yağış başladı! Yamaçdere\'nin debisi taşkın seviyesine ulaştı. Kuzeydeki alçak ahşap köprünün üzerinden sel suları aşmaya başladı ve emniyet ekipleri köprüyü kapattı! Fakat bazı sakinler kestirme diye oradan geçmeye çalışıyor. Güvenli alternatif rotayı devreye almalıyız!',
    },
    learnedPrinciples: [
      '15 cm derinliğindeki akıntılı sel suyu bir yetişkini devirebilir; 30 cm derinlik araçları sürükleyebilir.',
      'Yetkililerce kapatılmış yollardan ve köprülerden kestirme olsa bile asla geçilmemelidir.',
      'En kısa rota her zaman en güvenli rota değildir; güvenliği doğrulanmış yüksek güzergâhlar tercih edilir.'
    ],
    tasks: [
      {
        id: 'task_4_1',
        title: 'Kapanan Köprüyü İncele',
        description: 'Haritada su altında kalan Kuzey Köprüsü\'ne tıkla ve kapatma gerekçesini gör.',
        actionType: 'inspect_objects',
        targetCount: 1,
        currentCount: 0,
        completed: false,
        relatedBuildingIds: ['bld_north_bridge'],
      },
      {
        id: 'task_4_2',
        title: 'Tehlikeli Geçişi Engelle',
        description: '"Su dizime bile gelmiyor, karşıya arabayla geçerim" diyen vatandaşa doğru tavsiyeyi ver.',
        actionType: 'decision',
        completed: false,
        dilemma: {
          id: 'dil_4_wading',
          title: 'Sel Suyundan Yürüyerek veya Araçla Geçiş',
          characterName: 'Mert',
          characterRole: 'Mahalle Gönüllüsü',
          context: 'Bir mahalleli aracını kapatılan köprüden sürmek veya suda yürüyerek karşıya geçmek istiyor.',
          officialGuidance: 'AFAD Sel Kılavuzu: Asla sel suları içinde yürümeyin veya aracınızı sürmeyin. Suyun altındaki yolun çöktüğünü veya menfezin yıkıldığını göremezsiniz.',
          sourceReference: 'AFAD Sel ve Taşkın Korunma Rehberi',
          options: [
            {
              id: 'A',
              text: 'Aracın ağır olduğunu söyleyip hemen gaza basarak karşıya geçmesini öner.',
              isSafe: false,
              feedback: 'Ölümcül Hata! Sel suları kaldırma kuvveti nedeniyle tonlarca ağırlıktaki araçları bile bir gemi gibi sürükleyip nehir yatağına devirir.',
              scoreDelta: 0,
            },
            {
              id: 'B',
              text: 'Suların aldatıcı ve ölümcül olduğunu söyle; kapalı köprüden kesinlikle uzak durmasını ve doğrulanmış Güney Yüksek Beton Köprü rotasını kullanmasını sağla.',
              isSafe: true,
              feedback: 'Hayat Kurtaran Karar! Selde 30 cm su araçları, 15 cm akıntı yayaları sürükler. Güvenli teyitli köprüye yönlendirmek esastır.',
              scoreDelta: 20,
            }
          ]
        }
      },
      {
        id: 'task_4_3',
        title: 'Güvenli Alternatif Rotayı Değerlendir',
        description: 'Rota değerlendiriciyi aç ve Güney Yüksek Beton Köprü üzerinden Batı Toplanma Alanı\'na güvenli güzergâhı onayla.',
        actionType: 'evaluate_route',
        completed: false,
      }
    ]
  },
  {
    id: 5,
    code: 'BOLUM_5',
    title: 'Bölüm 5: Yamaç Hareket Ediyor',
    subtitle: 'Heyelan Belirtileri & Tahliye Kararı',
    simulatedTime: 'T+08:00 (Zemin Doygunluğu & Heyelan)',
    weather: 'rain_heavy',
    meteoWarning: 'orange',
    riverLevel: 0.75,
    introDialogue: {
      speaker: 'Mert',
      role: 'Mahalle Gönüllüsü',
      message: 'Yağmur toprakta birikti, zemin suya tamamen doydu! Kuzey yamacındaki konutların arkasında istinat duvarından çamurlu sular fışkırıyor ve ağaçlar yan yatmaya başladı. Sakinler ne yapacağını bilemiyor; doğru tahliye kararlarını uygulamalıyız!',
    },
    learnedPrinciples: [
      'Yağmur hafiflese bile heyelan riski zemin suya doyduğu için saatlerce devam edebilir.',
      'Yamaçtaki binalarda kapı ve pencerelerin aniden sıkışması, boruların patlaması heyelan belirtisidir.',
      'Heyelan anında bina içindeyse sağlam bir eşya yanında cenin pozisyonu alınmalı; yamaçtan aşağı doğru değil, kütlenin yanına doğru güvenli düzlüğe kaçılmalıdır.'
    ],
    tasks: [
      {
        id: 'task_5_1',
        title: 'Heyelan Öncü İşaretlerini Tanı',
        description: 'Yamaçtaki çatlak ve eğilen direği haritada tekrar incele.',
        actionType: 'inspect_objects',
        targetCount: 1,
        currentCount: 0,
        completed: false,
        relatedBuildingIds: ['bld_crack_slope'],
      },
      {
        id: 'task_5_2',
        title: 'Yamaçtaki Konut Sakinine Rehberlik Et',
        description: 'Evinin arkasından çatırtı sesleri geldiğini söyleyen aileye doğru tahliye yönlendirmesini yap.',
        actionType: 'decision',
        completed: false,
        dilemma: {
          id: 'dil_5_landslide_evac',
          title: 'Aktif Heyelan Şüphesinde Güvenli Hareket',
          characterName: 'Mert',
          characterRole: 'Mahalle Gönüllüsü',
          context: 'Ahşap Konut sakini: "Arka bahçedeki istinat duvarı çatırdıyor, kapılar sıkıştı açılmıyor, ne yapmalıyız?"',
          officialGuidance: 'AFAD: Heyelan başladığında binadan hızla güvenli çıkış yapılabiliyorsa heyelan akış doğrultusundan yanlara doğru hızla uzaklaşılmalı; çıkılamıyorsa sağlam eşya yanında korunulmalıdır.',
          sourceReference: 'AFAD Heyelan Sırasında Yapılması Gerekenler',
          options: [
            {
              id: 'A',
              text: 'Değerli eşyaları toplamak için bodrum kata inmesini ve eşyaları kurtarmasını söyle.',
              isSafe: false,
              feedback: 'Son Derece Tehlikeli! Heyelanda saniyeler hayati önemdedir. Eşya kurtarma girişimi can kaybına yol açar; alt katlar en savunmasız yerlerdir.',
              scoreDelta: 0,
            },
            {
              id: 'B',
              text: 'Yalnızca hazır afet çantasını alıp aileyi yan kapıdan çıkararak heyelan hattının sağına doğru, teyitli Doğu Toplanma Alanı\'na yönlendir ve AFAD\'a bildir.',
              isSafe: true,
              feedback: 'Harika ve Doğru Karar! Saniyeler içinde bina tahliye edilmiş ve akış yatağının dışındaki teyitli toplanma alanına yönlendirilmiştir.',
              scoreDelta: 20,
            }
          ]
        }
      },
      {
        id: 'task_5_3',
        title: 'Yanlış Güven Duygusunu Düzelt',
        description: '"Yağmur dindi, tehlike bitti evlerimize dönebilir miyiz?" sorusunu değerlendir.',
        actionType: 'decision',
        completed: false,
        dilemma: {
          id: 'dil_5_false_security',
          title: 'Yağmur Durduktan Sonraki Heyelan Riski',
          characterName: 'Derya',
          characterRole: 'Afet Hazırlık Danışmanı',
          context: 'Güneş hafifçe göründü ve bazı vatandaşlar yamaçtaki hasarlı evlerine hemen dönmek istiyor.',
          officialGuidance: 'Zemin mekaniği gereği su zemine sızmaya devam eder ve toprak kaymaları en çok yağmurun durduğu ilk saatlerde ve günlerde yaşanır.',
          sourceReference: 'TARAP Zemin ve Jeolojik Risk Raporu',
          options: [
            {
              id: 'A',
              text: 'Yağmur bittiğine göre hiçbir risk kalmamıştır, herkes hemen evine geri dönebilir.',
              isSafe: false,
              feedback: 'Yanlış Bilgi! Zemin doygunluğu tepe noktasındadır. Heyelanların çoğu yağmur bittikten hemen sonra tetiklenir. Yetkili jeoloji etüdü olmadan evlere dönülemez.',
              scoreDelta: 0,
            },
            {
              id: 'B',
              text: 'Zeminin suya doygun olduğunu açıkla; yetkili teknik heyet inceleme yapıp güvenli olduğunu açıklamadan hasarlı evlere girilmemesi gerektiğini bildir.',
              isSafe: true,
              feedback: 'Tamamen Doğru! Uzman incelemesi olmadan hasarlı binalara veya kayma riski olan yamaçlara dönüş yapılamaz.',
              scoreDelta: 15,
            }
          ]
        }
      }
    ]
  },
  {
    id: 6,
    code: 'BOLUM_6',
    title: 'Bölüm 6: Birlikte Güçlüyüz',
    subtitle: 'Mahalle İhtiyaçları & Kapsayıcı Koordinasyon',
    simulatedTime: 'T+18:00 (Toplanma & Yardımlaşma)',
    weather: 'rain_light',
    meteoWarning: 'yellow',
    riverLevel: 0.55,
    introDialogue: {
      speaker: 'Deniz',
      role: 'Sağlık Merkezi Yetkilisi',
      message: 'Güvenli toplanma alanlarımızda mahalle sakinlerimiz bir araya geldi. Ancak aralarında bebekli aileler, kronik ilaç ihtiyacı olan yaşlılarımız ve tekerlekli sandalye kullanan komşularımız var. Yardımlaşma planımız kimseyi geride bırakmamalı!',
    },
    learnedPrinciples: [
      'Afet koordinasyonu yaşlı, çocuk, engelli ve kronik hasta bireylerin özel ihtiyaçlarını gözetmelidir.',
      'Gönüllüler tehlikeli kurtarmalara girmemeli; lojistik, bilgilendirme ve ilk yardım desteği vermelidir.',
      'Erişilebilir tahliye yollarında merdiven yerine rampa ve düz zeminli güzergâhlar planlanmalıdır.'
    ],
    tasks: [
      {
        id: 'task_6_1',
        title: 'İhtiyaçları Doğru Ekiplerle Eşleştir',
        description: 'Eczane ve Sağlık Merkezini inceleyerek kronik ilaç ve ilk yardım ihtiyaçlarını listele.',
        actionType: 'inspect_objects',
        targetCount: 2,
        currentCount: 0,
        completed: false,
        relatedBuildingIds: ['bld_hospital', 'bld_pharmacy'],
      },
      {
        id: 'task_6_2',
        title: 'Erişilebilir Güzergâh Seçimi',
        description: 'Tekerlekli sandalye kullanan komşumuz Ahmet Amca için merdivensiz, güvenli düzlük yolu seç.',
        actionType: 'decision',
        completed: false,
        dilemma: {
          id: 'dil_6_accessibility',
          title: 'Hareket Kısıtlılığı Olan Bireylerin Tahliyesi',
          characterName: 'Deniz',
          characterRole: 'Sağlık Merkezi Yetkilisi',
          context: 'Toplanma alanına ulaşmak isteyen tekerlekli sandalyeli komşumuz için iki yol var: Biri 40 basamaklı dik merdivenli kestirme, diğeri düz asfalt rampa güzergâhı.',
          officialGuidance: 'Kapsayıcı Afet Yönetimi: Engelli ve hareket kısıtlılığı olan bireyler için tahliye rotaları basamaksız, engelsiz ve refakatçi desteğine uygun olmalıdır.',
          sourceReference: 'AFAD Engelli ve Yaşlı Bireyler İçin Afet Kılavuzu',
          options: [
            {
              id: 'A',
              text: 'Hızlı olsun diye tekerlekli sandalyeyi dik merdivenlerden indirmeye çalışın.',
              isSafe: false,
              feedback: 'Büyük Risk! Islak ve dik merdivenlerde sandalyenin kayması ve devrilmesi hem bireye hem refakatçiye ağır sakatlanma riski doğurur.',
              scoreDelta: 0,
            },
            {
              id: 'B',
              text: 'Düz asfalt, basamaksız ve güvenli eğime sahip alternatif rampa güzergâhını kullanın.',
              isSafe: true,
              feedback: 'Kapsayıcı ve Güvenli! Ulaşım süresi birkaç dakika uzasa bile güvenli ve erişilebilir yol her zaman tercih edilmelidir.',
              scoreDelta: 15,
            }
          ]
        }
      }
    ]
  },
  {
    id: 7,
    code: 'BOLUM_7',
    title: 'Bölüm 7: Yanlış Bilgiyle Mücadele',
    subtitle: 'Kriz Anında Sorumlu İletişim',
    simulatedTime: 'T+36:00 (İletişim & Doğrulama)',
    weather: 'cloudy',
    meteoWarning: 'yellow',
    riverLevel: 0.4,
    introDialogue: {
      speaker: 'Aylin',
      role: 'Yerel Yönetim Temsilcisi',
      message: 'Afet bölgelerinde fiziksel tehlikeler kadar dedikodu ve yanıltıcı paylaşımlar da hasar verir. Sosyal medyada eski sel görüntüleri ve "Şebeke suyu zehirli!" gibi asılsız iddialar yayılıyor. Bilgi kirliliğini durdurmalı ve mahallemize yalnızca doğrulanmış açıklamaları ulaştırmalıyız!',
    },
    learnedPrinciples: [
      'Doğrulanmamış mesajları korku veya heyecanla paylaşmak acil müdahale ekiplerini kilitler.',
      'Şüpheli bilgileri AFAD, Valilik ve Kaymakamlık gibi resmî kanallardan teyit etmeden yaymayınız.',
      'Sorumlu bir afet elçisi, kaynağı belli olmayan telaş verici ses kayıtlarını grupta uyararak durdurur.'
    ],
    tasks: [
      {
        id: 'task_7_1',
        title: 'Şebeke Suyu Mesajını Teyit Et',
        description: 'WhatsApp gruplarındaki "Şebeke suyu zehirlendi" iddiasını incele ve sorumlu davranışı seç.',
        actionType: 'decision',
        completed: false,
        dilemma: {
          id: 'dil_7_rumor',
          title: 'Sosyal Medyadaki Asılsız İddia',
          characterName: 'Aylin',
          characterRole: 'Yerel Yönetim Temsilcisi',
          context: 'Bir komşu: "Grupta herkes yazıyor, dağdaki kimyasal deposu patlamış sular zehirliymiş, hemen herkesi uyaralım!"',
          officialGuidance: 'İletişim Başkanlığı Dezenformasyonla Mücadele Merkezi: Afet anlarında kaynağı bilinmeyen iddiaları paylaşmayın. Resmî kurumların su analiz raporlarını bekleyin.',
          sourceReference: 'Cumhurbaşkanlığı İletişim Başkanlığı Afet İletişim Rehberi',
          options: [
            {
              id: 'A',
              text: 'Mesajı daha da vurgulu yaparak mahallenin bütün sosyal medya gruplarına acil koduyla ilet.',
              isSafe: false,
              feedback: 'İnfial ve Panik Yarattı! Bu tür teyitsiz paylaşımlar marketlerde izdihama yol açar ve acil telefon hatlarını meşgul eder.',
              scoreDelta: 0,
            },
            {
              id: 'B',
              text: 'Mesajın kaynağını sor, resmî ilçe hıfzıssıhha ve belediye açıklaması gelmeden paylaşılmaması gerektiğini söyle ve insanları sakinliğe davet et.',
              isSafe: true,
              feedback: 'Mükemmel Dezenformasyon Savunması! Bilgi kirliliğini kaynağında keserek gereksiz paniği önledin.',
              scoreDelta: 15,
            }
          ]
        }
      }
    ]
  },
  {
    id: 8,
    code: 'BOLUM_8',
    title: 'Bölüm 8: 72 Saatin Sonunda',
    subtitle: 'Toparlanma, Değerlendirme & Gerçek Yaşama Aktarım',
    simulatedTime: 'T+72:00 (Toparlanma & Çözüm)',
    weather: 'clearing',
    meteoWarning: 'green',
    riverLevel: 0.25,
    introDialogue: {
      speaker: 'Derya',
      role: 'Afet Hazırlık Danışmanı',
      message: 'Tebrikler! Kritik ilk 72 saati Yamaçdere sakinleriyle birlikte bilinçli, soğukkanlı ve dayanışma içinde atlattın. Dere suyu normal seviyesine çekildi, hasar tespit ekipleri sahada çalışıyor. Şimdi neleri doğru yaptığımızı değerlendirme ve en önemlisi bu bilgileri gerçek yaşamına aktarma zamanı!',
    },
    learnedPrinciples: [
      'Afet sonrası hasarlı binalara yetkili Çevre ve Şehircilik mühendisleri incelemeden girilmemelidir.',
      'Oyun burada bitiyor; ancak gerçek hayattaki afet hazırlığı bu kontrol listesiyle evinizde başlıyor.',
      'Ailenizle birlikte afet çantanızı kontrol edip toplanma alanınızı öğrenmek hayat kurtarır.'
    ],
    tasks: [
      {
        id: 'task_8_1',
        title: 'Hasarlı Binaya Dönüş Kuralı',
        description: 'Hasar görmüş evindeki fotoğraf albümünü almak isteyen sakin için doğru kararı ver.',
        actionType: 'decision',
        completed: false,
        dilemma: {
          id: 'dil_8_reentry',
          title: 'Hasarlı Binaya Yeniden Giriş',
          characterName: 'Mert',
          characterRole: 'Mahalle Gönüllüsü',
          context: 'Bir komşumuz: "Yağmur durdu, evimin duvarında küçük çatlaklar var ama içeriden özel eşyalarımı 2 dakikada alıp çıkabilir miyim?"',
          officialGuidance: 'AFAD ve Çevre Şehircilik Bakanlığı: Hasar tespiti yapılmamış hiçbir yapıya elektrik/gaz kaçakları ve artçı sarsıntı/göçük tehlikesi sebebiyle asla girilmemelidir.',
          sourceReference: 'AFAD Afet Sonrası Davranış Kuralları',
          options: [
            {
              id: 'A',
              text: 'Hızlıca içeri girip 2 dakikada alıp çıkabileceğini söyle.',
              isSafe: false,
              feedback: 'Hayati Hata! Taşıyıcı kolonları zedelenmiş veya temeli suyla oyulmuş yapılar aniden çökebilir, gaz kaçağı patlayabilir.',
              scoreDelta: 0,
            },
            {
              id: 'B',
              text: 'Hasar tespit uzmanları resmî rapor verene kadar binaya kesinlikle girilmemesi gerektiğini açıkla.',
              isSafe: true,
              feedback: 'Kusursuz Karar! Can güvenliği her türlü maddi eşyadan değerlidir.',
              scoreDelta: 15,
            }
          ]
        }
      },
      {
        id: 'task_8_2',
        title: 'Gerçek Hayat Hazırlık Listeni Oluştur',
        description: 'Ailenle birlikte uygulayabileceğin Gerçek Hayat Afet Hazırlık Kontrol Listesi\'ni tamamla ve çıktısını al.',
        actionType: 'general',
        completed: false,
      }
    ]
  }
];
