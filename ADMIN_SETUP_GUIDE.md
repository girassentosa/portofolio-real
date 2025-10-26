# 🎯 Admin CMS Portfolio - Setup Guide

## 📚 **Struktur yang Sudah Dibuat:**

### ✅ **1. Database Schema** (`database/schema.sql`)
- ✅ `admin_users` - Autentikasi admin (MD5 password + photo profile)
- ✅ `home_content` - Greeting, nama, deskripsi
- ✅ `home_stats` - Stats cards (4 items)
- ✅ `profile_card` - Profile card info
- ✅ `about_content` - Who Am I, My Approach, foto
- ✅ `personal_info` - Personal information items
- ✅ `skills` - Skills dengan CRUD lengkap
- ✅ `projects` - Projects dengan CRUD lengkap

### ✅ **2. Admin System**
- ✅ Login Page (`/admin/login`)
- ✅ Dashboard Layout dengan sidebar
- ✅ Main Dashboard (`/admin/dashboard`)
- ✅ Home Section CRUD (`/admin/dashboard/home`)
- ✅ Skills Section CRUD (`/admin/dashboard/skills`)
- ⏳ Projects Section CRUD (in progress)
- ⏳ About Section CRUD (in progress)

---

## 🚀 **Cara Setup:**

### **Step 1: Setup Supabase Database**

1. Buat project baru di [Supabase](https://supabase.com)
2. Pergi ke **SQL Editor**
3. Copy & paste seluruh isi file `database/schema.sql`
4. Run query untuk membuat semua tables dan data default

### **Step 2: Setup Environment Variables**

Buat file `.env.local` di root project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Cara mendapatkan keys:**
- Buka Supabase Dashboard
- Pergi ke **Settings** → **API**
- Copy `Project URL` dan `anon/public key`

### **Step 3: Install Dependencies** (Sudah dilakukan)

```bash
npm install @supabase/supabase-js md5
```

### **Step 4: Run Development Server**

```bash
npm run dev
```

---

## 🔐 **Login Admin**

### **Default Credentials:**
- **URL:** `http://localhost:3000/admin/login`
- **Username:** `admin`
- **Password:** `admin123`

### **Cara Ganti Password:**

1. Buat MD5 hash dari password baru di sini: https://www.md5hashgenerator.com/
2. Update di Supabase:
   ```sql
   UPDATE admin_users 
   SET password_hash = 'your-new-md5-hash' 
   WHERE username = 'admin';
   ```

---

## 📊 **Fitur Admin Dashboard**

### **Home Section** (`/admin/dashboard/home`)
✅ Edit greeting text ("Halo, saya")
✅ Edit nama lengkap
✅ Edit deskripsi utama
✅ Edit 4 stats cards (icon, value, label, gradient)
✅ Edit profile card (nama, title, handle, status, avatar)

### **Skills Section** (`/admin/dashboard/skills`)
✅ Lihat semua skills
✅ Tambah skill baru
✅ Edit skill (name, category, icon, colors)
✅ Hapus skill
✅ Toggle active/inactive
✅ Set display order

### **Projects Section** (Coming next)
- Lihat semua projects
- Tambah project baru
- Edit project (title, subtitle, image, URL)
- Hapus project
- Toggle active/inactive

### **About Section** (Coming next)
- Edit "Who Am I" content
- Edit "My Approach" content
- Edit personal info items
- Ganti profile photo

---

## 🔧 **Cara Menggunakan Admin:**

1. **Login** ke `/admin/login`
2. **Pilih section** dari sidebar
3. **Edit konten** sesuai kebutuhan
4. **Klik "Simpan"** untuk update database
5. **Refresh halaman utama** untuk melihat perubahan

---

## 🎨 **Custom Warna & Icon**

### **Gradient Colors:**
- Format: `#06b6d4` (Hex color)
- Tools: [Coolors.co](https://coolors.co) untuk color palette

### **Icons:**
- Format: Emoji Unicode (📱, ⚡, 🚀, dll)
- Tools: [Emojipedia](https://emojipedia.org) untuk cari emoji

---

## 🛡️ **Security Notes:**

⚠️ **PENTING:**
- Jangan commit file `.env.local` ke Git
- Ganti password default setelah setup
- Gunakan Row Level Security (RLS) di Supabase untuk production

---

## 📝 **TODO Next:**

- [ ] Selesaikan Projects CRUD page
- [ ] Selesaikan About CRUD page
- [ ] Integrasikan dynamic data ke halaman utama (fetch dari database)
- [ ] Tambah image upload feature (Supabase Storage)
- [ ] Tambah preview changes sebelum save
- [ ] Tambah activity log

---

## 💡 **Tips:**

1. **Backup database** sebelum testing
2. **Gunakan display_order** untuk mengatur urutan tampilan
3. **is_active = false** untuk menyembunyikan item tanpa menghapus
4. **Test di localhost** sebelum deploy production

---

## 🐛 **Troubleshooting:**

**Error: "Failed to fetch"**
- Cek apakah `.env.local` sudah benar
- Pastikan Supabase project sudah running
- Cek console browser untuk error detail

**Error: "Not authorized"**
- Pastikan sudah login
- Clear localStorage dan login ulang
- Cek session timeout

**Data tidak update:**
- Hard refresh browser (Ctrl + Shift + R)
- Cek apakah save berhasil (lihat success message)
- Cek database langsung di Supabase

---

**Need help?** Contact: tajijaddagirassntosa@gmail.com

