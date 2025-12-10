# 🚀 Panduan Deploy Clip It ke Netlify

## ✨ Arsitektur Baru: Full Serverless

Aplikasi ini sekarang menggunakan **Netlify Functions** (serverless) untuk backend, sehingga:
- ✅ **Satu platform saja** - Frontend + Backend di Netlify
- ✅ **Tidak perlu Render.com** - Backend berjalan sebagai serverless functions
- ✅ **Setup lebih mudah** - Tidak perlu konfigurasi CORS
- ✅ **Gratis** - 125K requests/bulan

---

## 📋 Quick Start

### 1. Push ke GitHub
```bash
git add .
git commit -m "Deploy to Netlify"
git push origin main
```

### 2. Deploy di Netlify

1. Login ke [netlify.com](https://netlify.com)
2. Klik **"Add new site"** → **"Import an existing project"**
3. Pilih **GitHub** dan pilih repository ini
4. Build settings (auto-detected dari `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

5. Tambahkan **Environment Variables**:
   - `VITE_API_URL` = `/api`
   - `VITE_GOOGLE_CLIENT_ID` = `1061174148072-i48q2kghk74ncgiga642utbouvreocjg.apps.googleusercontent.com`

6. Klik **"Deploy site"**

### 3. Update Google OAuth

Setelah deploy, update redirect URI di [Google Cloud Console](https://console.cloud.google.com):
- Authorized JavaScript origins: `https://your-app.netlify.app`
- Authorized redirect URIs: `https://your-app.netlify.app`

---

## ✅ Testing

### Test Functions Endpoint
```
https://your-app.netlify.app/.netlify/functions/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### Test Download
1. Buka site Netlify Anda
2. Login dengan Google
3. Paste URL video
4. Download! 🎉

---

## 🔧 Local Development

Test dengan Netlify Functions di local:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Install dependencies
npm install

# Run dev server dengan Functions
netlify dev
```

Buka `http://localhost:8888` - Functions akan tersedia di `/.netlify/functions/`

---

## 📊 Monitoring

**Cek Logs:**
1. Netlify Dashboard → Site → **Functions** → **Logs**

**Cek Usage:**
1. Netlify Dashboard → **Functions** → **Usage**

---

## 🔧 Troubleshooting

### Download lambat
- **Penyebab**: Cold start (Functions sleep setelah idle)
- **Solusi**: Request pertama ~2-3 detik, berikutnya lebih cepat

### Functions error
- **Cek**: Netlify Functions logs
- **Test**: Jalankan `netlify dev` di local

### CORS error
- **Seharusnya tidak ada** karena frontend & backend di domain yang sama
- **Jika ada**: Cek environment variables

---

## 📝 Checklist

- [ ] Code di-push ke GitHub
- [ ] Site deployed di Netlify
- [ ] Environment variables ditambahkan
- [ ] Google OAuth redirect URI diupdate
- [ ] Test download berhasil

---

## 📚 Dokumentasi Lengkap

Lihat [NETLIFY_SETUP.md](./NETLIFY_SETUP.md) untuk panduan detail.

---

**Selamat! Aplikasi sekarang fully serverless! 🚀**

