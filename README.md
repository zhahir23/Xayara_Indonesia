# Xayara Indonesia - Website Reservasi HVAC & Elektrikal

Website reservasi profesional untuk Xayara Indonesia, spesialis HVAC & Elektrikal Bersertifikasi.

## 🚀 Fitur

### Fitur Utama
- **Form Reservasi Online**: Formulir lengkap untuk pemesanan layanan AC dengan validasi
- **Admin Dashboard**: Panel admin dengan CRUD lengkap untuk mengelola reservasi
- **PostgreSQL Database**: Database profesional dengan booking ID unik (5 karakter)
- **Flyway Migrations**: Sistem database migration untuk version control schema
- **Responsive Design**: Tampilan modern dan responsif untuk semua perangkat
- **Export CSV**: Fitur export data reservasi ke format CSV
- **Interactive Map**: Peta interaktif dengan Leaflet untuk visualisasi lokasi

### Fitur Keamanan
- **Session-based Auth**: Menggunakan sessionStorage untuk auto-logout saat browser ditutup
- **Idle Timeout**: Auto-logout setelah 30 menit tidak aktif dengan warning 30 detik
- **JWT Authentication**: Token-based authentication dengan expiry 30 menit
- **Date Validation**: Kuota harian hanya dapat diatur untuk tanggal mendatang

### Fitur Notifikasi
- **WhatsApp Notifications**: Notifikasi otomatis via WhatsApp (Wablas API) untuk:
  - Konfirmasi reservasi berhasil
- **Email Broadcast System**: Sistem broadcast email promosional dengan:
  - Manajemen campaign email massal
  - Tracking status pengiriman per recipient
  - Support SendGrid dan Brevo (Sendinblue)
  - Dashboard monitoring campaign

### Fitur Reservasi
- **Multi-Unit Support**: Reservasi untuk multiple unit AC
- **Flexible Options**: Pilihan kebutuhan, merek, dan PK yang fleksibel
- **Status Tracking**: Tracking status reservasi (pending, confirmed, completed, cancelled)
- **Advanced Filtering**: Filter berdasarkan status, tanggal, kebutuhan, merek
- **Search Function**: Pencarian berdasarkan booking ID, nama, email, telepon, alamat
- **Pagination**: Pagination untuk data yang besar
- **Daily Quota Management**: Kuota harian yang dapat dikustomisasi per tanggal
- **Quota Fallback**: Otomatis menggunakan kuota default jika tidak ada kuota spesifik tanggal
- **Auto-Cleanup**: Kuota tanggal lama otomatis dihapus saat server restart
- **Location Services**: Integrasi GPS dengan:
  - Deteksi lokasi otomatis (latitude, longitude)
  - Link Google Maps langsung dari lokasi pelanggan
  - Perhitungan jarak dalam kilometer
  - Visualisasi peta dengan Leaflet dan React-Leaflet
- **Reschedule Feature**: Fitur penjadwalan ulang reservasi dengan validasi tanggal
- **WhatsApp Status Tracking**: Tracking status pengiriman WhatsApp (sent, failed, error message)

### Fitur Integrasi
- **Google Sheets Integration**: Otomatis sync data reservasi ke Google Sheets
- **Parameter Management**: Sistem parameter dinamis untuk konfigurasi aplikasi
- **Database Migrations**: Version control untuk schema database

## 📋 Teknologi yang Digunakan

### Frontend
- **React 19**: UI library modern dengan hooks
- **Vite**: Build tool yang cepat dan efisien
- **React Router DOM**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Lucide Icons**: Icon library modern
- **Axios**: HTTP client untuk API calls
- **Leaflet**: Library peta interaktif open-source
- **React-Leaflet**: React integration untuk Leaflet
- **Tailwind Merge**: Utility untuk merging Tailwind classes
- **CLSX**: Utility untuk conditional CSS classes

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **PostgreSQL**: Relational database
- **Flyway**: Database migration tool
- **JWT**: JSON Web Token authentication
- **CORS**: Cross-Origin Resource Sharing
- **Express Validator**: Input validation middleware
- **BCrypt**: Password hashing library
- **PG**: PostgreSQL client for Node.js

### Integrasi & Services
- **Wablas API**: WhatsApp messaging service untuk notifikasi
- **Google Sheets API**: Integration untuk data sync
- **Google Service Account**: Authentication untuk Google Sheets
- **SendGrid**: Email delivery service untuk broadcast campaigns
- **Brevo (Sendinblue)**: Alternative email service untuk broadcast campaigns

### Database
- **PostgreSQL**: Primary database dengan schema:
  - `reservations`: Data reservasi dengan lokasi dan tracking WhatsApp
  - `parameters`: Konfigurasi sistem
  - `daily_quotas`: Manajemen kuota harian per tanggal
  - `email_broadcasts`: Campaign email promosional
  - `email_broadcast_recipients`: Tracking pengiriman email per recipient

## 🛠️ Instalasi

### Prasyarat
- Node.js (v18 atau lebih tinggi)
- npm atau yarn
- PostgreSQL (v13 atau lebih tinggi)
- Flyway CLI (opsional - untuk database migrations)

### 1. Clone Repository
```bash
git clone <repository-url>
cd "Xayara Indonesia"
```

### 2. Setup Backend
```bash
cd server
npm install
```

#### Konfigurasi Environment Variables
Buat file `.env` di folder `server`:
```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5450
DB_NAME=xayara_indonesia
DB_USER=postgres
DB_PASSWORD=admin

# Admin OTP Configuration
ADMIN_OWNER_PHONE=6285810200501

# Wablas WhatsApp API Configuration
WABLAS_API_DOMAIN=https://smg.wablas.com
WABLAS_API_TOKEN=your_wablas_api_token_here
WABLAS_SECRET_KEY=your_wablas_secret_key_here

# Google Sheets Configuration (Optional - for backup)
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key_here

# Brevo Email API Configuration (Optional - for email broadcasts)
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_NAME=Xayara Indonesia
BREVO_SENDER_EMAIL=noreply@xayaraindonesia.com

# SendGrid Email API Configuration (Optional - alternative to Brevo)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@xayaraindonesia.com
```

#### Setup PostgreSQL Database
1. Pastikan PostgreSQL sudah terinstall dan running
2. Buka GUI database (DBeaver, pgAdmin, atau sejenisnya)
3. Connect ke PostgreSQL dengan credentials:
   - Host: localhost
   - Port: 5450
   - Username: postgres
   - Password: admin
4. Buat database baru dengan nama: `xayara_indonesia`
5. Buat schema baru dengan nama: `xayara_indonesia` (opsional, default schema sudah diset di flyway.conf)

#### Setup Flyway Migrations
Flyway digunakan untuk version control database schema.

**Opsi 1: Install Flyway CLI**
1. Download Flyway dari https://flywaydb.org/download
2. Extract dan tambahkan ke PATH
3. Jalankan migrations:
```bash
cd server
npm run migrate
```

**Opsi 2: Gunakan Docker (lebih mudah)**
```bash
cd server
docker run --rm -v "%cd%:/flyway/sql" -v "%cd%/flyway.conf:/flyway/conf/flyway.conf" flyway/flyway -configFiles=/flyway/conf/flyway.conf migrate
```

**Opsi 3: Gunakan DBeaver**
- DBeaver sudah memiliki integrasi Flyway
- Database → Manage Database → Migrations
- Pilih folder `server/database/migrations`

**Membuat Migration Baru**
Buat file SQL baru di folder `server/database/migrations/` dengan format:
- `V2__Add_new_column.sql`
- `V3__Create_users_table.sql`
- dst.

Jalankan `npm run migrate` untuk apply migration baru.

### 3. Setup Frontend
```bash
cd ../client
npm install
```

## 🚀 Menjalankan Aplikasi

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Aplikasi akan berjalan di:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

**Build Frontend:**
```bash
cd client
npm run build
```

**Jalankan Backend:**
```bash
cd server
npm start
```

## 📱 Penggunaan

### Untuk Pelanggan
1. Buka halaman beranda
2. Klik tombol "Buat Reservasi Sekarang"
3. Isi formulir dengan data lengkap (nama, email, telepon, alamat, detail AC)
4. Masukkan kode promo jika ada (opsional)
5. Submit dan tunggu konfirmasi
6. Notifikasi WhatsApp akan dikirim untuk konfirmasi

### Untuk Admin
1. Buka halaman `/login`
2. Login dengan credentials:
   - Email: `admin@xayara.com`
   - Password: `admin123`
3. Akses dashboard untuk mengelola:
   - **Reservasi**: CRUD operations, update status, filter, search, reschedule
   - **Kuota Harian**: Atur kuota spesifik per tanggal (hanya tanggal mendatang)
   - **Parameter**: Konfigurasi sistem (kebutuhan, merek, dll)
   - **Email Broadcast**: Buat dan kirim campaign email promosional
   - **Location Tracking**: Lihat lokasi pelanggan di peta dengan Google Maps link
4. Data akan otomatis tersimpan di PostgreSQL database
5. Auto-logout setelah 30 menit tidak aktif
6. Token expiry 30 menit untuk keamanan

## 🔐 Security Notes

**PENTING**: Untuk production:
- Ganti default admin credentials di `server/controllers/authController.js`
- Gunakan JWT secret yang kuat dan unik
- Implementasi database untuk user management (bukan hardcoded)
- Gunakan HTTPS untuk production
- Validasi input yang lebih strict
- Rate limiting untuk API endpoints
- Konfigurasi Wablas API dengan domain dan token yang valid
- Konfigurasi email service (SendGrid/Brevo) dengan API key yang valid
- Gunakan environment variables untuk semua sensitive data
- Pastikan Google Sheets service account memiliki permission yang tepat
- Review dan update security headers di production

## 📊 Struktur Project

```
Xayara Indonesia/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components (Home, Reservation, Login, AdminDashboard, Reschedule)
│   │   ├── lib/           # Utilities and API client
│   │   ├── config/        # Configuration files
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Express Application
│   ├── controllers/      # Route controllers (auth, reservations, parameters, dailyQuota, emailBroadcast)
│   ├── middleware/        # Custom middleware (auth)
│   ├── routes/           # API routes (auth, reservations, parameters, dailyQuotas, emailBroadcasts)
│   ├── config/           # Database configuration
│   ├── database/         # Database migrations and schema
│   │   ├── migrations/   # Flyway migration files (V1-V11)
│   │   └── schema.sql    # Complete database schema
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── server.js         # Entry point
│   ├── .env              # Environment variables
│   ├── .env.example      # Environment variables template
│   ├── flyway.conf       # Flyway configuration
│   ├── credentials.json  # Google Sheets service account
│   └── package.json
├── assets/               # Static assets
├── referensi/           # Reference materials
├── DEPLOYMENT.md        # Deployment guide
├── GOOGLE_SHEETS_SETUP.md # Google Sheets setup guide
└── README.md
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
1. Build frontend: `cd client && npm run build`
2. Deploy folder `dist` ke Vercel/Netlify
3. Set environment variables jika diperlukan

### Backend (Render/Heroku)
1. Deploy folder `server`
2. Set environment variables di platform
3. Upload `credentials.json` sebagai environment variable atau file

### Google Sheets Setup
1. Pastikan Sheet ID benar di environment variables
2. Service account memiliki akses Editor ke sheet
3. Sheet memiliki tab "Reservations" dengan header baris pertama

## 📞 Kontak

Untuk informasi lebih lanjut:
- Email: info@xayara.com
- Telepon: 0812-3456-7890
- Area: Jabodetabek

## 📄 License

Copyright © 2024 Xayara Indonesia. All rights reserved.
