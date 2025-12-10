# 🚀 Panduan Deploy Clip It ke Netlify (Full Serverless)

## Keuntungan Deployment Baru

✅ **Satu platform saja** - Frontend + Backend di Netlify  
✅ **Tidak perlu Render.com** - Semua berjalan di Netlify Functions  
✅ **Setup lebih mudah** - Tidak perlu konfigurasi CORS kompleks  
✅ **Gratis** - 125K requests/bulan untuk Functions  
✅ **Auto-scaling** - Otomatis scale sesuai traffic  

---

## 📋 Langkah-Langkah Deployment

### **1. Push Code ke GitHub**

Pastikan semua perubahan sudah di-commit dan push:

```bash
git add .
git commit -m "Migrate to Netlify Functions"
git push origin main
```

### **2. Deploy ke Netlify**

#### Opsi A: Via Netlify Dashboard (Recommended)

1. Login ke [netlify.com](https://netlify.com)
2. Klik **"Add new site"** → **"Import an existing project"**
3. Pilih **GitHub** dan authorize Netlify
4. Pilih repository project ini
5. Konfigurasi build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions` (auto-detected dari netlify.toml)

6. Klik **"Show advanced"** → **"New variable"** dan tambahkan:
   - Key: `VITE_API_URL`
   - Value: `/api`
   
   - Key: `VITE_GOOGLE_CLIENT_ID`
   - Value: `1061174148072-i48q2kghk74ncgiga642utbouvreocjg.apps.googleusercontent.com`

7. Klik **"Deploy site"**

8. Tunggu deployment selesai (3-5 menit)

#### Opsi B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login ke Netlify
netlify login

# Deploy
netlify deploy --prod
```

### **3. Update Google OAuth Redirect URI**

Setelah deployment, Netlify akan memberikan URL (contoh: `https://your-app.netlify.app`)

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Pilih project Anda
3. Klik **"APIs & Services"** → **"Credentials"**
4. Edit OAuth 2.0 Client ID
5. Tambahkan ke **"Authorized JavaScript origins"**:
   ```
   https://your-app.netlify.app
   ```
6. Tambahkan ke **"Authorized redirect URIs"**:
   ```
   https://your-app.netlify.app
   ```
7. Klik **"Save"**

---

## ✅ Testing

### 1. Test Netlify Functions

Buka browser dan akses Functions endpoint:

```
https://your-app.netlify.app/.netlify/functions/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Expected**: Return JSON dengan video info

### 2. Test Download

1. Buka site Netlify: `https://your-app.netlify.app`
2. Login dengan Google
3. Paste URL video (YouTube, TikTok, Twitter)
4. Klik **"Download"**
5. Video harus terdownload! 🎉

### 3. Test Error Handling

- Test dengan URL invalid → harus muncul error message yang jelas
- Test dengan private video → harus muncul error "content is private"
- Test dengan URL tidak supported → harus muncul error yang informatif

---

## 🔧 Testing Lokal dengan Netlify Dev

Untuk test Netlify Functions di local sebelum deploy:

```bash
# Install Netlify CLI (jika belum)
npm install -g netlify-cli

# Install dependencies
npm install

# Run Netlify Dev
netlify dev
```

Aplikasi akan berjalan di `http://localhost:8888` dengan Netlify Functions aktif.

**Keuntungan `netlify dev`:**
- Test Functions seperti di production
- Hot reload untuk frontend dan functions
- Environment variables otomatis loaded

---

## 🔧 Troubleshooting

### Error: "Failed to fetch media info"

**Penyebab**: yt-dlp mungkin perlu update atau URL tidak supported

**Solusi**:
1. Cek logs di Netlify dashboard: **Site → Functions → Logs**
2. Pastikan URL valid dan public
3. Coba platform lain (YouTube biasanya paling reliable)

### Download lambat atau timeout

**Penyebab**: 
- Cold start (Functions sleep setelah tidak dipakai)
- Video terlalu besar (>50MB)

**Solusi**:
- Request pertama akan lambat (~2-3 detik) - ini normal
- Request berikutnya akan lebih cepat
- Untuk video besar, mungkin perlu tunggu lebih lama

### Functions tidak ditemukan (404)

**Cek**:
1. Apakah `netlify.toml` ada di root project?
2. Apakah folder `netlify/functions/` ada?
3. Redeploy site di Netlify dashboard

---

## 📊 Monitoring

### Cek Logs Functions

1. Buka Netlify dashboard
2. Pilih site Anda
3. Klik **"Functions"** di sidebar
4. Pilih function (`info` atau `download`)
5. Klik **"Logs"** untuk lihat real-time logs

### Cek Usage

1. Netlify dashboard → **"Functions"** → **"Usage"**
2. Monitor:
   - Total invocations
   - Execution time
   - Bandwidth usage

**Free tier limits:**
- 125K requests/month
- 100 hours execution time/month

---

## 💡 Tips

1. **Monitor usage** - Cek dashboard Netlify untuk memastikan tidak over limit
2. **Optimize Functions** - Functions yang cepat = lebih murah
3. **Cache strategy** - Browser akan cache video info untuk performa lebih baik
4. **Error handling** - Logs di Netlify sangat helpful untuk debugging

---

## 🆘 Butuh Bantuan?

Jika masih error:
1. Cek **Functions logs** di Netlify dashboard
2. Cek **console browser** (F12) untuk error frontend
3. Test dengan `netlify dev` di local
4. Pastikan environment variables sudah benar

---

## 📝 Checklist Deployment

- [ ] Code sudah di-push ke GitHub
- [ ] Site sudah di-deploy di Netlify
- [ ] Environment variables sudah ditambahkan
- [ ] Google OAuth redirect URI sudah diupdate
- [ ] Test Functions endpoint berhasil
- [ ] Test download video berhasil
- [ ] Error handling berfungsi dengan baik

**Selamat! Aplikasi Anda sekarang fully serverless di Netlify! 🚀**

---

## 🔄 Perbedaan dengan Deployment Sebelumnya

| Aspek | Sebelumnya (Render) | Sekarang (Netlify) |
|-------|---------------------|---------------------|
| Platform | Frontend (Netlify) + Backend (Render) | Frontend + Backend (Netlify) |
| Setup | 2 deployments terpisah | 1 deployment saja |
| CORS | Perlu konfigurasi kompleks | Tidak perlu (same domain) |
| API URL | `https://backend.onrender.com/api` | `/api` (relative) |
| Cost | Free tier 2 platform | Free tier 1 platform |
| Maintenance | Update 2 tempat | Update 1 tempat |
