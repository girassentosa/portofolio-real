# 🔐 Environment Variables Setup

## 📋 **Step-by-Step Instructions**

### **Step 1: Create `.env.local` File**

Di root project Anda, buat file baru bernama `.env.local`

**Windows (PowerShell):**
```powershell
New-Item -Path .env.local -ItemType File
```

**Windows (Command Prompt):**
```cmd
type nul > .env.local
```

**Mac/Linux:**
```bash
touch .env.local
```

---

### **Step 2: Copy & Paste Credentials**

Buka file `.env.local` dengan text editor dan paste ini:

```env
# =====================================================
# PORTFOLIO CMS - ENVIRONMENT VARIABLES
# =====================================================

# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://uttobxvbdhekahhzfibe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dG9ieHZiZGhla2FoaHpmaWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDE0MjYsImV4cCI6MjA3Njk3NzQyNn0.0tJsw6LFMdjxS13gxCWHsABeQBZa2gE7HhfGVlWk5SM

# JWT Secret
JWT_SECRET=portfolio_secret_key_2025_tajijadda

# Database URL (Optional)
DATABASE_URL=postgresql://postgres:h8KxQQ7kwAUvD7HU@db.uttobxvbdhekahhzfibe.supabase.co:5432/postgres

# Node Environment
NODE_ENV=development
```

---

### **Step 3: Save File**

- Pastikan file disimpan sebagai `.env.local` (dengan titik di depan)
- File harus di **root project** (folder yang sama dengan `package.json`)

---

### **Step 4: Verify Setup**

**Check structure:**
```
portfolio/
├── .env.local          ← File ini harus ada!
├── package.json
├── app/
├── components/
└── ...
```

**Test connection:**
```bash
# Restart development server
npm run dev
```

Buka browser console dan check error. Kalau tidak ada error "Supabase URL not found", berarti sukses!

---

## ✅ **Your Supabase Credentials:**

| Key | Value |
|-----|-------|
| **Project URL** | `https://uttobxvbdhekahhzfibe.supabase.co` |
| **Anon Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Database Password** | `h8KxQQ7kwAUvD7HU` |
| **Database Host** | `db.uttobxvbdhekahhzfibe.supabase.co` |

---

## 🛡️ **Security Notes:**

### **✅ Safe to Use:**
- `NEXT_PUBLIC_SUPABASE_URL` → Public URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Public anon key (safe for client-side)
- Variables dengan prefix `NEXT_PUBLIC_` aman di-expose ke browser

### **⚠️ Keep Private:**
- `.env.local` file → NEVER commit to Git
- `DATABASE_URL` → Contains password, keep secret
- `JWT_SECRET` → For server-side only
- Service Role Key (kalau ada) → NEVER expose to client

### **🔒 Git Ignore:**
File `.env.local` sudah otomatis di-ignore oleh Next.js di `.gitignore`:
```
# .gitignore
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## 🚀 **For Production Deployment (Vercel):**

### **Step 1: Go to Vercel Dashboard**
1. Open: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Environment Variables**

### **Step 2: Add Variables**
Add these one by one:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://uttobxvbdhekahhzfibe.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (full key) |
| `JWT_SECRET` | `portfolio_secret_key_2025_tajijadda` |

### **Step 3: Redeploy**
- Klik **Redeploy** di Vercel
- Environment variables akan applied

---

## 🧪 **Testing Checklist:**

After creating `.env.local`, test these:

- [ ] File `.env.local` ada di root project
- [ ] Run `npm run dev` tanpa error
- [ ] Browser console tidak ada error "Supabase URL not found"
- [ ] Login admin: `http://localhost:3000/admin/login`
- [ ] Login berhasil dengan `admin` / `admin123`
- [ ] Dashboard muncul dengan data
- [ ] Edit & save data berhasil

---

## 🐛 **Troubleshooting:**

### **Issue: "Supabase URL not found"**
**Solution:**
- Verify file name adalah `.env.local` (dengan titik)
- Restart dev server: Stop (Ctrl+C) → `npm run dev`
- Check file location (harus di root)

### **Issue: "Invalid API key"**
**Solution:**
- Copy ulang Anon Key dari Supabase Dashboard
- Pastikan tidak ada spasi atau line break
- Format: `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...` (no quotes)

### **Issue: Variables tidak terbaca**
**Solution:**
- Restart dev server
- Hard refresh browser (Ctrl+Shift+R)
- Check typo di variable names
- Pastikan prefix `NEXT_PUBLIC_` benar

---

## 📝 **Quick Commands:**

```bash
# Create .env.local
touch .env.local

# Edit .env.local
code .env.local
# or
notepad .env.local

# Verify file exists
ls -la .env.local    # Mac/Linux
dir .env.local       # Windows

# Test connection
npm run dev
```

---

## ✅ **Ready to Go!**

After setup:
1. ✅ File `.env.local` created
2. ✅ Credentials pasted
3. ✅ File saved
4. ✅ Server restarted
5. ✅ Test admin login works

**Next:** Run database schema di Supabase! 🚀

---

**Need Help?** Check troubleshooting section above or contact support.

