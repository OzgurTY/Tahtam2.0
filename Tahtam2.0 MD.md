# 🗺️ Tahtam2.0 Proje Yol Haritası

Bu proje, yatırım amaçlı pazar tahtalarının kiralarını, kiracılarını ve doluluk durumlarını takip eden bir "iş zekası" aracıdır.

**Teknoloji Yığını:**
* **Backend:** Spring Boot, Java
* **Frontend:** React
* **Veritabanı:** MongoDB
* **Araçlar:** VSC, Github Desktop

**Ana Hedefler:**
* Hangi tahta hangi kiracıdan ne kadar gelir getiriyor?
* Bu ay ödemesi geciken kiracı var mı?
* Boşta (kiralanmamış) tahta var mı?
* Pazaryerlerine göre gelir ve doluluk takibi.

---

### Faz 1: 🏗️ Temel Kurulum ve "Merhaba Dünya" (0-1 Gün)

**Amaç:** Backend, frontend ve veritabanının birbiriyle konuştuğu en basit "çalışan" yapıyı kurmak.

1.  **Repo Yapısı:** `Tahtam2.0` klasörüne `backend` (Spring) ve `frontend` (React) alt klasörleri oluşturmak.
2.  **Backend (Spring Boot):**
    * `start.spring.io` ile proje oluşturma (Bağımlılıklar: `Spring Web`, `Spring Data MongoDB`, `Lombok`).
    * MongoDB bağlantı ayarlarını (`application.properties`) yapmak.
    * `/api/test` (GET) test endpoint'i yazmak ("Backend çalışıyor!").
3.  **Frontend (React):**
    * `npx create-react-app .` ile `frontend` klasöründe projeyi başlatma.
    * `axios` kütüphanesini kurma (`npm install axios`).
    * Ana sayfada bir düğme ile backend'deki `/api/test` endpoint'ine istek atıp sonucu ekranda gösterme.
4.  **GitHub:** İlk kurulumu "Initial Project Setup" mesajıyla push'lamak.

### Faz 2: 🗄️ Backend API - Çekirdek Varlıklar (1-3 Gün)

**Amaç:** Uygulamanın veri modellerini (MongoDB) ve bunları yönetecek API'leri (Spring) yazmak.

1.  **MongoDB Modelleri (Documents):**
    * `Pazaryeri` (Pazarın adı, adresi)
    * `Tahta` (Tahta no: "3B/114", ürün tipi: ["Gıda", "Tekstil"], ait olduğu `Pazaryeri` ID'si, kira durumu: "Dolu/Boş")
    * `Kiraci` (Ad, soyad, telefon, sattığı ürün)
2.  **Spring Boot (CRUD API):**
    * Her model için `Controller`, `Service`, `Repository` katmanları oluşturmak.
    * **CRUD API'leri:**
        * `POST /api/pazaryeri` (Yeni pazar ekle)
        * `GET /api/pazaryeri` (Pazarları listele)
        * `POST /api/tahta` (Yeni tahta ekle, bir pazarla ilişkilendir)
        * `GET /api/tahta?pazarId={id}` (Bir pazardaki tahtaları getir)
        * `GET /api/tahta/bos` (Boşta olan tüm tahtaları getir)
        * `POST /api/kiraci` (Yeni kiracı ekle)
        * `GET /api/kiraci` (Kiracıları listele)
3.  **Test:** `Postman` veya VSC `Thunder Client` ile API'leri test etmek.

### Faz 3: 🎨 Frontend UI - Temel Yönetim Ekranları (2-4 Gün)

**Amaç:** Backend'de oluşturduğumuz verileri React arayüzünde "görselleştirmek" ve yönetebilmek.

1.  **React Router:** `react-router-dom` ile sayfa yönlendirmesi (Ana Sayfa, Pazarlarım, Tahtalarım, Kiracılarım).
2.  **Bileşenler (Components):**
    * `PazaryeriListesi.js` / `PazaryeriEkle.js`
    * `TahtaListesi.js` / `TahtaEkle.js` (Tahta eklerken pazar yeri seçebilmeli)
    * `KiraciListesi.js` / `KiraciEkle.js`
3.  **Veri Akışı:** `axios` ile API'lere bağlanıp (GET, POST) verileri çekmek ve formları göndermek.

### Faz 4: 🔗 Kiralama ve Ödeme Mantığı (En Önemli Faz!) (2-4 Gün)

**Amaç:** Projenin asıl amacı olan kiralama ve gelir takibini otomatize etmek.

1.  **Backend (API Genişletmesi):**
    * Yeni Model: `Kiralama` (Hangi `Tahta`, hangi `Kiraci` tarafından, hangi tarihler arası, aylık ne kadar ücrete kiralandı).
    * Yeni Model: `Odeme` (Hangi `Kiralama` için, hangi ayın ödemesi, tutar, ödeme tarihi, durum: "Ödendi", "Gecikti", "Bekleniyor").
    * İlişkiler: Bir `Kiralama` oluşturulduğunda ilgili `Tahta`'nın durumunu "Dolu" olarak güncelle.
    * Yeni API'ler:
        * `POST /api/kiralama` (Yeni kiralama yap).
        * `GET /api/kiralama/gecikenler` (Bu ay ödemesi gecikenler).
        * `POST /api/odeme/{kiralamaId}` (Bir kiralamaya ödeme gir).
2.  **Frontend (UI Genişletmesi):**
    * "Boş" durumdaki bir tahtanın yanında "Kirala" butonu.
    * Tıklayınca açılan form: "Kiracı Seç", "Kira Bedeli Gir", "Başlangıç Tarihi Gir".
    * Kiracı detay sayfasında o kiracıya ait kiralamalar ve "Ödeme Al" butonu.

### Faz 5: 📊 Dashboard (Ana Ekran) ve Raporlama (1-2 Gün)

**Amaç:** Kullanıcının (yani sizin) uygulamayı açar açmaz istediği "kritik" bilgileri görmesi.

1.  **Backend (Dashboard API):**
    * `GET /api/dashboard/ozet` diye tek bir endpoint yazmak.
    * Bu endpoint'in döneceği veriler:
        * Bu ay beklenen toplam gelir.
        * Bu ay tahsil edilen toplam gelir.
        * Geciken ödeme sayısı.
        * Boşta olan tahta sayısı.
2.  **Frontend (UI):**
    * `AnaSayfa.js` bileşenini yapmak.
    * Büyük kartlar halinde bu 4 kritik bilgiyi (Gelir, Tahsilat, Geciken, Boş Tahta) göstermek.
    * Altına "Geciken Kiracılar" ve "Boşta Olan Tahtalar" için birer hızlı liste eklemek.

### Faz 6: 🛡️ Güvenlik ve İyileştirmeler (Gelecek Planı)

**Amaç:** Uygulamayı sadece sizin kullanabilmeniz ve daha da geliştirebilmek için altyapı hazırlığı.

1.  **Authentication (Spring Security + JWT):** Backend'e bir login/register sistemi ekleyerek API'leri korumak. Sadece giriş yapan kullanıcının kendi verilerini görmesini sağlamak.
2.  **Roller:** Belki ileride bir "muhasebeci" rolü eklemek istersiniz.
3.  **Otomatik Görevler:** Her ayın 1'inde, aktif kiralamalar için otomatik "Bekleniyor" durumunda `Odeme` kayıtları oluşturacak bir zamanlanmış görev (Scheduled Task) yazmak.