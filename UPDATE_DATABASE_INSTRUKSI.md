# ⚠️ WAJIB: Update Database Supabase Anda!

## 🚨 **PENTING - BACA INI DULU!**

Jika foto profile admin Anda **kembali ke default** setelah logout/login, itu karena **database belum di-update!**

Kolom `photo_url` belum ada di tabel `admin_users` Anda.

---

## 🔧 **Cara Update Database:**

### **Step 1: Buka Supabase Dashboard**
1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik **"SQL Editor"** di sidebar kiri

### **Step 2: Jalankan Query Ini**

Copy dan paste query di bawah ini ke SQL Editor, lalu klik **"RUN"**:

```sql
-- Tambah kolom photo_url ke tabel admin_users
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT '/images/profile.jpg';

-- Add comment
COMMENT ON COLUMN admin_users.photo_url IS 'URL foto profile admin';

-- Update existing admin user dengan default photo
UPDATE admin_users 
SET photo_url = '/images/profile.jpg' 
WHERE photo_url IS NULL;
```

### **Step 3: Verifikasi Hasil**

Jalankan query ini untuk cek apakah kolom sudah ditambahkan:

```sql
SELECT id, username, photo_url, created_at 
FROM admin_users;
```

Harusnya muncul kolom `photo_url` dengan value `/images/profile.jpg`

---

## ✅ **Setelah Update Database:**

1. **Logout** dari admin dashboard
2. **Login** kembali dengan username dan password Anda
3. **Ubah foto profile** di Edit Profile
4. **Logout & Login** lagi
5. **Foto sekarang TIDAK akan hilang!** ✅

---

## 🎯 **Yang Sudah Diperbaiki di Code:**

### ✅ **Bug Fix 1: Update Foto Saat Ubah Username**
**Masalah Lama:**
- Ubah username + foto bersamaan → foto gagal tersimpan
- Karena query pakai username baru, padahal di database masih username lama

**Solusi Baru:**
- Sekarang update username dan foto dalam **SATU query**
- Menggunakan **username lama** untuk identifikasi row
- Foto dan credentials di-update bersamaan dengan benar

### ✅ **Bug Fix 2: Foto Terpisah (Admin vs Portfolio)**
**Sudah Benar dari Awal:**
- 📸 **Foto Admin** = `admin_users.photo_url` (untuk sidebar admin)
- 🏠 **Foto Home** = `profile_card.avatar_url` & `mini_avatar_url` (untuk halaman utama)
- 👤 **Foto About** = `about_content.profile_photo_url` (untuk section About)

**Ketiga foto ini TERPISAH dan TIDAK saling mempengaruhi!**

---

## 📊 **Cara Kerja Sekarang:**

### **Skenario 1: Ubah Username + Password + Foto Bersamaan**
```
1. Anda isi:
   - Old Username: admin
   - Old Password: admin123
   - New Username: myusername
   - New Password: newpass123
   - Photo URL: /images/profile2.jpg

2. System:
   ✅ Validasi old credentials
   ✅ Update SEMUA (username, password, photo) dalam 1 query
   ✅ Pakai OLD username untuk identifikasi row
   ✅ Simpan foto, username, password ke database

3. Logout & Login:
   ✅ Login dengan myusername / newpass123
   ✅ Foto profile = /images/profile2.jpg (TERSIMPAN!)
```

### **Skenario 2: Ubah Foto Saja**
```
1. Anda isi:
   - Photo URL: /images/profile3.jpg
   - (username & password kosong)

2. System:
   ✅ Update photo_url saja
   ✅ Pakai current username untuk identifikasi

3. Logout & Login:
   ✅ Foto profile = /images/profile3.jpg (TERSIMPAN!)
```

---

## 🔍 **Troubleshooting:**

### **Problem: Foto masih hilang setelah update database**
**Solusi:**
1. Cek apakah query SQL berhasil dijalankan
2. Logout & clear cache browser (Ctrl+Shift+Del)
3. Login ulang
4. Ubah foto profile
5. Logout & Login lagi untuk test

### **Problem: Error "column photo_url does not exist"**
**Solusi:**
- Berarti query ALTER TABLE belum dijalankan
- Jalankan ulang query di Step 2 di atas

### **Problem: Foto Home/About berubah saat ubah foto admin**
**Solusi:**
- Ini TIDAK akan terjadi karena foto-foto tersebut TERPISAH
- Foto Admin diubah di: Edit Profile (admin sidebar)
- Foto Home diubah di: Admin Dashboard → Home Section
- Foto About diubah di: Admin Dashboard → About Section

---

## 📝 **Catatan:**

- ✅ Schema utama (`database/schema.sql`) sudah include kolom `photo_url`
- ✅ Untuk database BARU, tidak perlu ALTER TABLE (sudah include di CREATE TABLE)
- ⚠️ Untuk database LAMA yang sudah running, WAJIB jalankan ALTER TABLE di atas
- 🔄 Setelah update database, deploy ulang atau restart aplikasi

---

## 🚀 **Ready to Deploy!**

Setelah update database:
```bash
git add .
git commit -m "Fix: Photo update bug when changing username simultaneously"
git push
```

Vercel akan auto-deploy dan **SEMUA akan berfungsi dengan sempurna!** 🎉

