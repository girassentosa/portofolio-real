# 🔄 Dynamic Data Integration Guide

## ⚠️ **MASALAH YANG DITEMUKAN:**

Admin dashboard **SUDAH terhubung** ke Supabase ✅  
Halaman utama (app/page.tsx) **BELUM terhubung** ❌ (masih hardcoded)

---

## ✅ **YANG SUDAH DILAKUKAN:**

1. ✅ Added import untuk `fetchAllPortfolioData`
2. ✅ Added state `portfolioData` untuk menyimpan data dari database
3. ✅ Added `useEffect` untuk fetch data saat page load
4. ✅ Added loading state

---

## 🔧 **YANG PERLU DIUPDATE:**

### **📍 Section 1: HOME - Greeting (Line ~160)**

**Current (Hardcoded):**
```tsx
<TrueFocus 
  sentence="Halo, saya"
  ...
/>
```

**Update to (Dynamic):**
```tsx
<TrueFocus 
  sentence={portfolioData?.homeContent?.greeting || 'Halo, saya'}
  ...
/>
```

---

### **📍 Section 2: HOME - Name (Line ~174)**

**Current (Hardcoded):**
```tsx
<TextType 
  text="Taji Jadda Giras Sentosa"
  ...
/>
```

**Update to (Dynamic):**
```tsx
<TextType 
  text={portfolioData?.homeContent?.name || 'Your Name'}
  ...
/>
```

---

### **📍 Section 3: HOME - Description (Line ~188)**

**Current (Hardcoded):**
```tsx
<DecryptedText
  text="Berpengalaman dalam pengembangan..."
  ...
/>
```

**Update to (Dynamic):**
```tsx
<DecryptedText
  text={portfolioData?.homeContent?.description || 'Your description here'}
  ...
/>
```

---

### **📍 Section 4: HOME - Stats Cards (Line ~260+)**

**Current (Hardcoded):**
```tsx
<div>
  <span>💼</span>
  <h3>2+</h3>
  <p>Tahun<br/>Pengalaman</p>
</div>
```

**Update to (Dynamic):**
```tsx
{portfolioData?.homeStats.map((stat) => (
  <div 
    key={stat.id}
    className="..."
    style={{
      background: `linear-gradient(135deg, ${stat.gradient_from}, ${stat.gradient_to})`
    }}
  >
    <span>{stat.icon}</span>
    <h3>{stat.stat_value}</h3>
    <p>{stat.stat_label.split(' ').join('<br/>')}</p>
  </div>
))}
```

---

### **📍 Section 5: HOME - Profile Card (Line ~298+)**

**Current (Hardcoded):**
```tsx
<ProfileCard
  name="Taji Jadda Giras Sentosa"
  title="Software Engineer"
  handle="tajijaddagiras_"
  status="Online"
  contactText="Contact"
  avatarUrl="/images/profile.jpg"
  ...
/>
```

**Update to (Dynamic):**
```tsx
{portfolioData?.profileCard && (
  <ProfileCard
    name={portfolioData.profileCard.name}
    title={portfolioData.profileCard.title}
    handle={portfolioData.profileCard.handle}
    status={portfolioData.profileCard.status}
    contactText={portfolioData.profileCard.contact_text}
    avatarUrl={portfolioData.profileCard.avatar_url}
    miniAvatarUrl={portfolioData.profileCard.mini_avatar_url}
    ...
  />
)}
```

---

### **📍 Section 6: ABOUT - Who Am I (Line ~340+)**

**Current (Hardcoded):**
```tsx
<PixelCard title="Who am I" />
<p>Saya adalah seorang Software Engineer...</p>
```

**Update to (Dynamic):**
```tsx
<PixelCard title={portfolioData?.aboutContent?.who_am_i_title || 'Who am I'} />
<p>{portfolioData?.aboutContent?.who_am_i_content}</p>
```

---

### **📍 Section 7: ABOUT - My Approach (Line ~360+)**

**Current (Hardcoded):**
```tsx
<PixelCard title="My Approach" />
<p>Saya percaya bahwa kode...</p>
```

**Update to (Dynamic):**
```tsx
<PixelCard title={portfolioData?.aboutContent?.my_approach_title || 'My Approach'} />
<p>{portfolioData?.aboutContent?.my_approach_content}</p>
```

---

### **📍 Section 8: ABOUT - Personal Info (Line ~380+)**

**Current (Hardcoded):**
```tsx
<div>
  <span>👤</span>
  <p>Name</p>
  <p>Taji Jadda Giras Sentosa</p>
</div>
<div>
  <span>📧</span>
  <p>Email</p>
  <p>email@example.com</p>
</div>
```

**Update to (Dynamic):**
```tsx
{portfolioData?.personalInfo.map((info) => (
  <div key={info.id} className="...">
    <span>{info.info_icon}</span>
    <div>
      <p className="text-[10px] text-white/60">{info.info_label}</p>
      <p className="text-sm text-white">{info.info_value}</p>
    </div>
  </div>
))}
```

---

### **📍 Section 9: ABOUT - Profile Photo (Line ~400+)**

**Current (Hardcoded):**
```tsx
<img src="/images/profile.jpg" alt="Profile" />
```

**Update to (Dynamic):**
```tsx
<img 
  src={portfolioData?.aboutContent?.profile_photo_url || '/images/profile.jpg'} 
  alt="Profile" 
/>
```

---

### **📍 Section 10: SKILLS - Skills Grid (Line ~500+)**

**Current (Hardcoded):**
```tsx
<div>
  <span>💻</span>
  <h4>VS Code</h4>
  <p>Code Editor</p>
</div>
```

**Update to (Dynamic):**
```tsx
{portfolioData?.skills.map((skill) => (
  <div 
    key={skill.id}
    className="..."
    style={{
      background: `linear-gradient(135deg, ${skill.gradient_from}, ${skill.gradient_to})`,
      borderColor: skill.border_color
    }}
  >
    <span>{skill.skill_icon}</span>
    <div>
      <h4>{skill.skill_name}</h4>
      <p>{skill.skill_category}</p>
    </div>
  </div>
))}
```

---

### **📍 Section 11: PROJECTS - ChromaGrid (Line ~600+)**

**Current (Hardcoded):**
```tsx
<ChromaGrid
  projects={[
    { title: "Portfolio Website", ... },
    { title: "IoT Smart Home", ... }
  ]}
/>
```

**Update to (Dynamic):**
```tsx
<ChromaGrid
  projects={portfolioData?.projects.map(p => ({
    title: p.project_title,
    subtitle: p.project_subtitle,
    handle: p.project_handle || '',
    imageUrl: p.project_image_url,
    url: p.project_url || '',
    borderColor: p.border_color,
    gradient: p.gradient,
  })) || []}
/>
```

---

## 🚀 **CARA CEPAT (Alternatif):**

Karena banyak yang perlu diupdate, saya sarankan:

### **Option 1: Update Manual (Recommended)**
Follow guide di atas, update satu per satu. Estimasi waktu: 15-20 menit

### **Option 2: Rebuild Page with Dynamic Data**
Saya buatkan file `app/page.tsx` yang baru dengan semua data sudah dynamic. Estimasi waktu: 5 menit

### **Option 3: Hybrid - Update Critical Only**
Update hanya bagian yang user test (name, description, stats). Estimasi waktu: 5 menit

---

## ✅ **TESTING STEPS:**

Setelah update, test ini:

1. ✅ **Edit name di admin** → Refresh home page → Name berubah
2. ✅ **Edit description di admin** → Refresh → Description berubah
3. ✅ **Add skill di admin** → Refresh → Skill muncul
4. ✅ **Add project di admin** → Refresh → Project muncul

---

## 🐛 **TROUBLESHOOTING:**

### **Issue: Data tidak muncul**
**Check:**
- Console browser untuk errors
- Network tab → Check fetch to Supabase
- Verify `.env.local` ada dan correct

### **Issue: "Cannot read property of null"**
**Fix:**
- Pastikan pakai optional chaining: `portfolioData?.homeContent?.name`
- Add fallback values: `|| 'Default Value'`

### **Issue: Loading forever**
**Check:**
- Supabase URL & API key correct
- Database ada data (check Table Editor)
- RLS policies enabled

---

## 💡 **PILIH OPTION ANDA:**

**Beri tahu saya:**
1. **Option 1** - Saya update manual (guide di atas)
2. **Option 2** - Saya buatkan file baru lengkap
3. **Option 3** - Update critical parts only (name, desc, stats)

---

**Mana yang Anda pilih?** 🤔

