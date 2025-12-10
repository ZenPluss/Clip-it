# Cara Gampang Jalanin Webnya

Halo! Kalau lupa cara jalaninnya, ikuti langkah santai ini ya.

Intinya, kita butuh **2 Terminal** yang jalan barengan.
1. Satu buat **Server** (Bagian belakang/otaknya).
2. Satu buat **Web** (Tampilannya).

---

## 📚 Teknologi yang Digunakan

### **Frontend (Tampilan Web)**
- **React** - Library JavaScript untuk membuat UI yang interaktif
- **Vite** - Build tool yang super cepat untuk development
- **React Router** - Untuk navigasi antar halaman (Home, Dashboard, History)
- **Tailwind CSS** - Framework CSS untuk styling yang modern dan responsif
- **Framer Motion** - Library untuk animasi yang smooth
- **Lucide React** - Icon library untuk ikon-ikon cantik
- **Axios** - Untuk komunikasi dengan server (HTTP requests)

### **Backend (Server)**
- **Node.js** - Runtime JavaScript di server
- **Express.js** - Framework web untuk membuat API
- **yt-dlp** - Tool powerful untuk download video dari berbagai platform
- **CORS** - Middleware untuk mengizinkan request dari frontend
- **dotenv** - Untuk menyimpan konfigurasi rahasia (API keys, dll)

### **Authentication (Login)**
- **Google OAuth 2.0** - Login menggunakan akun Google
- **@react-oauth/google** - Library untuk integrasi Google Login di React
- **Google API** - Untuk mengambil data profil user (nama, foto, email)

### **Database**
- **localStorage (Browser Storage)** - Menyimpan data di browser user:
  - Token autentikasi Google
  - Data profil user
  - Riwayat download video
  - Preferensi tema (dark/light mode)
- **Tidak menggunakan database server** - Semua data disimpan lokal di browser

### **External Tools**
- **yt-dlp-exec** - Wrapper Node.js untuk menjalankan yt-dlp
- **Supported Platforms:**
  - YouTube (video & audio)
  - TikTok
  - Instagram
  - Facebook
  - Twitter/X

### **Development Tools**
- **ESLint** - Linter untuk menjaga kualitas kode
- **PostCSS** - Tool untuk memproses CSS
- **Autoprefixer** - Menambahkan vendor prefixes otomatis ke CSS

---

### Langkah 1: Buka Terminal
Di VS Code, buka Terminal dengan cara tekan tombol `Ctrl + J` atau klik menu **Terminal > New Terminal**.

Kamu butuh **2 Terminal**. Jadi, klik tanda `+` (tambah) di pojok kanan terminal biar punya dua.

---

### Langkah 2: Jalanin Server (Terminal Pertama)
Di terminal yang pertama, ketik perintah ini satu per satu (tekan Enter setelah setiap baris):

1. Masuk ke folder server:
   ```bash
   cd server
   ```
2. Nyalakan servernya:
   ```bash
   npm run dev
   ```

*Kalau berhasil, bakal muncul tulisan "Server is running...". Biarin aja jalan, jangan ditutup.*

---

### Langkah 3: Jalanin Web (Terminal Kedua)
Sekarang pindah ke **terminal kedua** (klik di daftar terminal di kanan).
Pastikan kamu ada di folder awal (`Web App`), bukan di dalam folder `server`.

Ketik perintah ini terus Enter:
```bash
npm run dev
```

*Nanti bakal muncul link (biasanya `http://localhost:5173`).*
*Tinggal **Ctrl + Klik** link itu, atau buka browser dan ketik alamatnya.*

---

### ⚠️ Kalau Ada Error (Belum Install)
Kalau pas jalanin perintah di atas muncul error merah-merah (biasanya karena belum pernah dijalankan di laptop ini), kamu perlu install "bahan-bahannya" dulu.

1. **Di folder utama**, ketik: `npm install` (tunggu sampai selesai).
2. **Di folder server** (`cd server`), ketik: `npm install` (tunggu sampai selesai).

Baru coba lagi Langkah 2 & 3 di atas.

Selamat mencoba! 🚀
