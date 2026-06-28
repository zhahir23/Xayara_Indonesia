# Xayara Indonesia - Website Reservasi HVAC & Elektrikal

Website reservasi profesional untuk Xayara Indonesia, spesialis HVAC & Elektrikal Bersertifikasi.

## 🚀 Fitur

- **Form Reservasi Online**: Formulir lengkap untuk pemesanan layanan AC
- **Admin Dashboard**: Panel admin dengan CRUD lengkap untuk mengelola reservasi
- **Google Sheets Integration**: Sinkronisasi otomatis data reservasi ke Google Spreadsheet
- **Responsive Design**: Tampilan modern dan responsif untuk semua perangkat
- **Authentication System**: Sistem login aman untuk admin
- **Export CSV**: Fitur export data reservasi ke format CSV

## 📋 Teknologi yang Digunakan

### Frontend
- React 18
- Vite
- React Router DOM
- TailwindCSS
- Lucide Icons
- Axios

### Backend
- Node.js
- Express.js
- Google Sheets API
- JWT Authentication
- CORS

## 🛠️ Instalasi

### Prasyarat
- Node.js (v18 atau lebih tinggi)
- npm atau yarn
- Akun Google dengan Google Sheets API access

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
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_CLIENT_EMAIL=your_google_service_account_email
GOOGLE_PRIVATE_KEY=your_google_private_key
```

#### Setup Google Sheets API
1. Buat project di [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Sheets API
3. Buat Service Account dan download credentials JSON
4. Rename file credentials ke `credentials.json` dan simpan di folder `server`
5. Buat Google Sheet baru dan share dengan email service account (Editor access)
6. Copy Sheet ID dari URL dan masukkan ke `.env`

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
3. Isi formulir dengan data lengkap
4. Submit dan tunggu konfirmasi

### Untuk Admin
1. Buka halaman `/login`
2. Login dengan credentials:
   - Email: `admin@xayara.com`
   - Password: `admin123`
3. Akses dashboard untuk mengelola reservasi
4. Lakukan CRUD operations (Create, Read, Update, Delete)
5. Data akan otomatis sinkron ke Google Sheets

## 🔐 Security Notes

**PENTING**: Untuk production:
- Ganti default admin credentials di `server/controllers/authController.js`
- Gunakan JWT secret yang kuat
- Implementasi database untuk user management (bukan hardcoded)
- Gunakan HTTPS untuk production
- Validasi input yang lebih strict
- Rate limiting untuk API endpoints

## 📊 Struktur Project

```
Xayara Indonesia/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and API client
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Express Application
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── routes/           # API routes
│   ├── server.js         # Entry point
│   ├── .env              # Environment variables
│   └── credentials.json  # Google Sheets credentials
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
