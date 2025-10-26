# 🎨 Portfolio CMS Admin System

## 🚀 **Complete Admin System untuk Portfolio Website**

Sistem CMS (Content Management System) lengkap dengan authentication, CRUD operations, dan real-time database integration menggunakan **Next.js 16**, **Supabase**, dan **TypeScript**.

---

## ✨ **Features**

### **🔐 Authentication System**
- ✅ Secure MD5 password hashing
- ✅ Login/Logout functionality
- ✅ Session management dengan localStorage
- ✅ Password change feature
- ✅ Protected admin routes

### **📊 Admin Dashboard**
- ✅ Modern glassmorphism design
- ✅ Responsive sidebar navigation
- ✅ Stats overview (skills, projects, personal info count)
- ✅ Quick access cards ke semua sections
- ✅ Real-time system info

### **🏠 Home Section Management**
- ✅ Edit greeting text ("Halo, saya")
- ✅ Edit nama lengkap (dengan TextType animation)
- ✅ Edit deskripsi utama
- ✅ Edit 4 stats cards (icon, value, label, gradient)
- ✅ Edit profile card (name, title, handle, status, avatar)

### **👤 About Section Management**
- ✅ Edit "Who Am I" title & content
- ✅ Edit "My Approach" title & content
- ✅ Edit profile photo URL
- ✅ **Personal Info CRUD:**
  - Add new info item
  - Edit existing info
  - Delete info
  - Reorder with display_order

### **⚡ Skills Section Management**
- ✅ View all skills dalam card grid
- ✅ Add new skill
- ✅ Edit skill (name, category, icon, colors)
- ✅ Delete skill
- ✅ Toggle active/inactive (show/hide)
- ✅ Custom gradient & border colors
- ✅ Reorder with display_order

### **🚀 Projects Section Management**
- ✅ View all projects dengan preview image
- ✅ Add new project
- ✅ Edit project (title, subtitle, image, URL)
- ✅ Delete project
- ✅ Toggle active/inactive
- ✅ Custom gradient & border colors
- ✅ Reorder with display_order

### **⚙️ Settings**
- ✅ Change password dengan MD5 validation
- ✅ System info (username, login time, version)
- ✅ Clear cache & reload
- ✅ Logout from all devices
- ✅ Help & support links

---

## 📁 **Project Structure**

```
portfolio/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page dengan MD5 auth
│   │   └── dashboard/
│   │       ├── layout.tsx         # Dashboard layout dengan sidebar
│   │       ├── page.tsx           # Main dashboard overview
│   │       ├── home/
│   │       │   └── page.tsx       # Home section CRUD
│   │       ├── about/
│   │       │   └── page.tsx       # About section CRUD
│   │       ├── skills/
│   │       │   └── page.tsx       # Skills CRUD
│   │       ├── projects/
│   │       │   └── page.tsx       # Projects CRUD
│   │       └── settings/
│   │           └── page.tsx       # Settings & password change
│   ├── page.tsx                   # Main portfolio page
│   └── layout.tsx                 # Root layout
│
├── components/
│   ├── Navbar.tsx                 # Main navigation
│   ├── ProfileCard.tsx            # Holographic profile card
│   ├── TextType.tsx               # Typing animation
│   ├── TrueFocus.tsx              # Focus animation
│   ├── DecryptedText.tsx          # Decryption animation
│   ├── PixelCard.tsx              # Pixel grid card
│   ├── ChromaGrid.tsx             # Project grid
│   └── LightRays.tsx              # Background effect
│
├── lib/
│   ├── supabase.ts                # Supabase client setup
│   └── fetchPortfolioData.ts      # Helper functions untuk fetch data
│
├── types/
│   └── database.ts                # TypeScript interfaces untuk database
│
├── database/
│   └── schema.sql                 # Complete SQL schema dengan default data
│
└── Documentation:
    ├── ADMIN_README.md            # Overview admin system (this file)
    ├── ADMIN_SETUP_GUIDE.md       # Setup instructions step-by-step
    └── INTEGRATION_GUIDE.md       # Guide untuk integrasi dynamic data
```

---

## 🛠️ **Tech Stack**

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Custom MD5 + localStorage
- **Styling:** Tailwind CSS
- **Animations:** GSAP, Framer Motion
- **State Management:** React Hooks
- **Form Handling:** Controlled Components

---

## 🚀 **Quick Start**

### **1. Clone & Install**
```bash
git clone <your-repo>
cd portfolio
npm install
```

### **2. Setup Supabase**
1. Buat project di [Supabase](https://supabase.com)
2. Copy SQL dari `database/schema.sql`
3. Run di Supabase SQL Editor

### **3. Environment Variables**
Buat file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### **4. Run Development**
```bash
npm run dev
```

### **5. Access Admin**
- URL: `http://localhost:3000/admin/login`
- Username: `admin`
- Password: `admin123`

---

## 📊 **Database Tables**

### **admin_users**
```sql
- id (PRIMARY KEY)
- username (UNIQUE)
- password_hash (MD5)
- photo_url (TEXT, default: '/images/profile.jpg')
- created_at, updated_at
```

### **home_content**
```sql
- id (PRIMARY KEY)
- greeting (TEXT)
- name (TEXT)
- description (TEXT)
```

### **home_stats**
```sql
- id (PRIMARY KEY)
- stat_key, stat_value, stat_label
- icon, gradient_from, gradient_to
- display_order
```

### **profile_card**
```sql
- id (PRIMARY KEY)
- name, title, handle, status
- contact_text
- avatar_url, mini_avatar_url
```

### **about_content**
```sql
- id (PRIMARY KEY)
- who_am_i_title, who_am_i_content
- my_approach_title, my_approach_content
- profile_photo_url
```

### **personal_info**
```sql
- id (PRIMARY KEY)
- info_key (UNIQUE), info_label, info_value
- info_icon, display_order
```

### **skills**
```sql
- id (PRIMARY KEY)
- skill_name, skill_category, skill_icon
- gradient_from, gradient_to, border_color
- display_order, is_active
```

### **projects**
```sql
- id (PRIMARY KEY)
- project_title, project_subtitle
- project_handle, project_location
- project_image_url, project_url
- border_color, gradient
- display_order, is_active
```

---

## 🎯 **Usage Guide**

### **Login ke Admin**
1. Navigate ke `/admin/login`
2. Enter username & password
3. Klik "Login ke Dashboard"

### **Manage Content**
1. Pilih section dari sidebar
2. Edit form fields
3. Klik "Simpan" untuk update database
4. Refresh halaman utama untuk lihat perubahan

### **Add New Skill/Project**
1. Klik tombol "➕ Tambah"
2. Isi form lengkap
3. Klik "Tambah" untuk save
4. Item baru muncul di halaman utama

### **Delete Item**
1. Klik tombol "🗑️ Hapus" pada item
2. Confirm deletion
3. Item dihapus dari database

### **Change Password**
1. Go to Settings
2. Enter current password
3. Enter new password (min 6 chars)
4. Confirm new password
5. Klik "Ganti Password"
6. Auto-logout → Login dengan password baru

---

## 🔒 **Security Features**

- ✅ MD5 password hashing
- ✅ Protected routes dengan auth check
- ✅ Session validation
- ✅ SQL injection prevention (Supabase Prepared Statements)
- ✅ XSS protection (Next.js built-in)
- ✅ CORS handled by Supabase

**⚠️ Production Recommendations:**
- Use bcrypt instead of MD5
- Implement JWT tokens
- Add rate limiting
- Enable RLS (Row Level Security) in Supabase
- Use environment secrets for sensitive data

---

## 🎨 **Customization**

### **Change Admin Theme**
Edit `app/admin/dashboard/layout.tsx`:
```tsx
// Colors
bg-gray-900  → bg-[your-color]
from-cyan-500 to-blue-600  → your-gradient
```

### **Add New Section**
1. Create new table in Supabase
2. Add TypeScript interface in `types/database.ts`
3. Create fetch function in `lib/fetchPortfolioData.ts`
4. Create CRUD page in `app/admin/dashboard/[section]/page.tsx`
5. Add menu item in `layout.tsx`

### **Change Logo**
Edit `app/admin/dashboard/layout.tsx`:
```tsx
<h1>CMS Admin</h1>  // Change this
```

---

## 🐛 **Troubleshooting**

### **Issue: Cannot login**
- Check `.env.local` is correct
- Verify Supabase project is active
- Check `admin_users` table exists
- Verify password_hash matches MD5 of password

### **Issue: Data tidak save**
- Check console for errors
- Verify Supabase connection
- Check table permissions
- Try hard refresh (Ctrl + Shift + R)

### **Issue: 404 on admin routes**
- Restart dev server: `npm run dev`
- Clear Next.js cache: `rm -rf .next`
- Check file structure matches above

---

## 📦 **Dependencies**

```json
{
  "@supabase/supabase-js": "^2.x",
  "md5": "^2.x",
  "next": "16.0.0",
  "react": "^19.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "gsap": "^3.x",
  "framer-motion": "^11.x"
}
```

---

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard
```

### **Environment Variables di Production**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📚 **Documentation Files**

1. **ADMIN_README.md** (this file) - Overview admin system
2. **ADMIN_SETUP_GUIDE.md** - Setup instructions
3. **INTEGRATION_GUIDE.md** - Integrate dynamic data ke halaman utama
4. **database/schema.sql** - Complete SQL schema

---

## 🤝 **Contributing**

This is a personal portfolio project, but feel free to:
- Report bugs
- Suggest features
- Fork dan customize untuk project sendiri

---

## 📧 **Contact & Support**

**Developer:** Taji Jadda Giras Sentosa  
**Email:** tajijaddagirassntosa@gmail.com  
**GitHub:** [girassentosa](https://github.com/girassentosa)

---

## 📝 **License**

This project is for personal use. Feel free to learn from it and adapt for your own projects.

---

## 🎉 **Changelog**

### **v1.0.0 - Initial Release**
- ✅ Complete admin authentication system
- ✅ CRUD for Home, About, Skills, Projects
- ✅ Responsive admin dashboard
- ✅ Settings & password management
- ✅ Database schema dengan default data
- ✅ Helper functions untuk data fetching
- ✅ Complete documentation

---

**Made with ❤️ by Taji Jadda Giras Sentosa**

**Admin Dashboard:** `http://localhost:3000/admin/login`  
**Main Portfolio:** `http://localhost:3000`

