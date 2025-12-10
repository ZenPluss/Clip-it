# 🚀 Langkah Deploy ke Render.com (Step-by-Step)

## ✅ Persiapan (Sudah Selesai)
- [x] Code sudah di-push ke GitHub
- [x] File konfigurasi sudah dibuat

---

## 📝 Langkah Deploy Backend

### **Step 1: Buat Akun Render**

1. Buka browser, kunjungi: **https://render.com**
2. Klik tombol **"Get Started for Free"** (pojok kanan atas)
3. Pilih **"Sign up with GitHub"** (paling mudah)
4. Authorize Render untuk akses GitHub Anda
5. Selesai! Anda akan masuk ke Dashboard Render

---

### **Step 2: Deploy Web Service**

1. Di Dashboard Render, klik tombol **"New +"** (pojok kanan atas)
2. Pilih **"Web Service"**
3. Klik **"Build and deploy from a Git repository"**
4. Klik **"Next"**

---

### **Step 3: Connect Repository**

1. Cari repository project Anda di list
   - Jika tidak muncul, klik **"Configure account"** untuk izinkan akses
2. Klik **"Connect"** di sebelah nama repository Anda

---

### **Step 4: Konfigurasi Web Service**

Isi form dengan data berikut:

#### **Basic Settings:**
- **Name**: `clipit-backend` (atau nama lain yang Anda mau)
- **Region**: Pilih **"Singapore"** (paling dekat dengan Indonesia)
- **Branch**: `main` (atau branch yang Anda pakai)
- **Root Directory**: `server` ⚠️ **PENTING! Jangan kosong!**

#### **Build & Deploy:**
- **Runtime**: Pilih **"Node"**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### **Instance Type:**
- Pilih **"Free"** (paling bawah)

---

### **Step 5: Environment Variables**

1. Scroll ke bawah, cari bagian **"Environment Variables"**
2. Klik **"Add Environment Variable"**
3. Tambahkan variabel pertama:
   - **Key**: `NODE_ENV`
   - **Value**: `production`
4. Klik **"Add Environment Variable"** lagi
5. Tambahkan variabel kedua:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-netlify-site.netlify.app`
   
   ⚠️ **GANTI dengan URL Netlify Anda yang sebenarnya!**
   
   Contoh: `https://clipit-app.netlify.app`

---

### **Step 6: Deploy!**

1. Scroll ke paling bawah
2. Klik tombol biru besar **"Create Web Service"**
3. Tunggu proses deployment (5-10 menit)
4. Anda akan melihat log deployment berjalan

---

### **Step 7: Salin URL Backend**

Setelah deployment selesai (status jadi "Live"):

1. Di bagian atas halaman, Anda akan lihat URL backend
   - Format: `https://clipit-backend.onrender.com`
2. **SALIN URL ini!** Anda akan butuh untuk step berikutnya

---

## ✅ Setelah Backend Deploy

### **Step 8: Update Frontend (Netlify)**

#### **Opsi A: Via Netlify Dashboard**

1. Login ke **https://netlify.com**
2. Pilih site Anda
3. Klik **"Site configuration"** (menu kiri)
4. Klik **"Environment variables"**
5. Klik **"Add a variable"**
6. Tambahkan:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://clipit-backend.onrender.com/api` (URL backend Anda + `/api`)
7. Klik **"Create variable"**

#### **Opsi B: Via File .env.production**

1. Buat file `.env.production` di root project:
   ```env
   VITE_API_URL=https://clipit-backend.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=1061174148072-i48q2kghk74ncgiga642utbouvreocjg.apps.googleusercontent.com
   ```
2. Push ke GitHub:
   ```bash
   git add .env.production
   git commit -m "Add production environment variables"
   git push origin main
   ```
3. Netlify akan auto-rebuild

---

### **Step 9: Update FRONTEND_URL di Render**

Sekarang update environment variable di Render dengan URL Netlify yang benar:

1. Kembali ke Render Dashboard
2. Pilih web service backend Anda
3. Klik **"Environment"** (menu kiri)
4. Cari `FRONTEND_URL`
5. Klik **"Edit"**
6. Ganti dengan URL Netlify Anda yang sebenarnya
7. Klik **"Save Changes"**
8. Service akan restart otomatis

---

## 🧪 Testing

### **Test 1: Backend**
Buka browser, akses:
```
https://clipit-backend.onrender.com
```
Harus muncul: **"Clip it Server is running"**

### **Test 2: API Endpoint**
Akses:
```
https://clipit-backend.onrender.com/api/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
Harus return JSON dengan info video

### **Test 3: Download Video**
1. Buka site Netlify Anda
2. Login dengan Google
3. Paste URL video (YouTube/TikTok/Instagram)
4. Klik **Download**
5. Video harus terdownload! 🎉

---

## ⚠️ Troubleshooting

### "Service Unavailable" atau 503
- Backend sedang sleep (normal untuk free tier)
- Tunggu 30 detik, refresh lagi
- Request berikutnya akan cepat

### "CORS Error" di Console Browser
- Cek `FRONTEND_URL` di Render environment variables
- Pastikan URL Netlify benar (dengan https://)
- Restart service di Render

### Download Tidak Jalan
- Buka Console browser (F12)
- Lihat error message
- Pastikan `VITE_API_URL` di Netlify sudah benar

---

## 📊 Monitor Deployment

### Cek Logs Render:
1. Dashboard Render → Pilih service
2. Klik **"Logs"** (menu kiri)
3. Lihat real-time logs

### Cek Status:
- **"Live"** = Backend berjalan normal ✅
- **"Building"** = Sedang deploy 🔄
- **"Failed"** = Ada error ❌

---

## 🎉 Selesai!

Jika semua test berhasil, aplikasi Anda sudah berjalan di production!

**URL Anda:**
- Frontend: `https://your-site.netlify.app`
- Backend: `https://clipit-backend.onrender.com`

---

## 💡 Tips

1. **Bookmark URL backend** untuk testing cepat
2. **Monitor usage** di Render dashboard (free: 750 jam/bulan)
3. **First request lambat** setelah sleep = normal
4. **Jangan commit `.env.production`** dengan secrets ke Git public

Selamat! 🚀
