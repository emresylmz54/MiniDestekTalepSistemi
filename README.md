# Mini Destek Talep Takip Sistemi

Mini Destek Talep Takip Sistemi, destek taleplerinin oluşturulması, listelenmesi, filtrelenmesi, güncellenmesi ve durumlarının takip edilmesi amacıyla geliştirilmiş basit bir web uygulamasıdır.

## Kullanılan Teknolojiler

### Backend
- .NET 8 Web API
- Entity Framework Core
- SQLite
- Swagger

### Frontend
- React
- Vite
- JavaScript
- CSS

## Proje Yapısı

```text
MiniDestekTalepSistemi
├── Backend
│   └── MiniSupport.Api
└── Frontend
    └── mini-support

    Özellikler
Destek taleplerini listeleme
Duruma göre filtreleme
Önceliğe göre filtreleme
Yeni destek talebi oluşturma
Talep detaylarını görüntüleme
Talep bilgilerini güncelleme
Talep durumunu değiştirme
Açık, işlemde ve kapalı taleplerin sayılarını gösterme
Açık talepler için bekleme süresini hesaplama
SQLite veritabanında veri saklama
Backend'i Çalıştırma

Backend klasörüne gidin:
cd Backend\MiniSupport.Api
dotnet run --urls "http://localhost:5290"

Backend şu adreste çalışır:
http://localhost:5290

Swagger arayüzü:
http://localhost:5290/swagger

Frontend'i Çalıştırma

Yeni bir terminal açın ve frontend klasörüne gidin:
cd Frontend\mini-support

Gerekli paketleri yükleyin:
npm install

Ardından uygulamayı çalıştırın:
npm run dev

Frontend genellikle şu adreste çalışır:

http://localhost:5174

Veritabanı

Uygulama SQLite kullanmaktadır.

Entity Framework Core migration kullanılarak veritabanı oluşturulmuştur.

API Endpointleri
Method	Endpoint	Açıklama
GET	/api/Tickets	Talepleri listeler
GET	/api/Tickets/{id}	Tek talep getirir
POST	/api/Tickets	Yeni talep oluşturur
PUT	/api/Tickets/{id}	Talebi günceller
PATCH	/api/Tickets/{id}/status	Talep durumunu değiştirir
Not

Bu proje teknik değerlendirme amacıyla geliştirilmiş bir Mini Destek Talep Takip Sistemi uygulamasıdır.
