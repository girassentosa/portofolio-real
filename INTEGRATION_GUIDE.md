# 🔌 Integration Guide: Dynamic Data ke Halaman Utama

## 📝 **Overview**

Sekarang Anda sudah punya **Admin CMS** lengkap dan **helper functions** untuk fetch data dari Supabase. Langkah terakhir adalah mengintegrasikan data tersebut ke halaman utama (`app/page.tsx`).

---

## 🎯 **Langkah-Langkah Integrasi**

### **Option 1: Static Generation (Recommended) - Fast Load**

Gunakan **Server Components** dengan data fetching di server. Best performance!

```tsx
// app/page.tsx
import { fetchAllPortfolioData } from '@/lib/fetchPortfolioData';
import TextType from '@/components/TextType';
import ProfileCard from '@/components/ProfileCard';
// ... other imports

export default async function Home() {
  // Fetch all data dari Supabase
  const data = await fetchAllPortfolioData();
  
  return (
    <div>
      {/* HOME SECTION */}
      <section id="home">
        {/* Greeting - Dynamic */}
        <p>{data.homeContent?.greeting || 'Halo, saya'}</p>
        
        {/* Name - Dynamic */}
        <TextType text={data.homeContent?.name || 'Your Name'} />
        
        {/* Description - Dynamic */}
        <p>{data.homeContent?.description || 'Your description...'}</p>
        
        {/* Stats - Loop Dynamic Data */}
        <div className="stats-grid">
          {data.homeStats.map((stat) => (
            <div key={stat.id} style={{ 
              background: `linear-gradient(to right, ${stat.gradient_from}, ${stat.gradient_to})` 
            }}>
              <span>{stat.icon}</span>
              <h3>{stat.stat_value}</h3>
              <p>{stat.stat_label}</p>
            </div>
          ))}
        </div>
        
        {/* Profile Card - Dynamic */}
        {data.profileCard && (
          <ProfileCard
            name={data.profileCard.name}
            title={data.profileCard.title}
            handle={data.profileCard.handle}
            status={data.profileCard.status}
            contactText={data.profileCard.contact_text}
            avatarUrl={data.profileCard.avatar_url}
            // ... other props
          />
        )}
      </section>

      {/* ABOUT SECTION */}
      <section id="about">
        <h2>About Me</h2>
        
        {/* Who Am I - Dynamic */}
        <div>
          <h3>{data.aboutContent?.who_am_i_title}</h3>
          <p>{data.aboutContent?.who_am_i_content}</p>
        </div>
        
        {/* My Approach - Dynamic */}
        <div>
          <h3>{data.aboutContent?.my_approach_title}</h3>
          <p>{data.aboutContent?.my_approach_content}</p>
        </div>
        
        {/* Personal Info - Loop Dynamic Data */}
        <div>
          {data.personalInfo.map((info) => (
            <div key={info.id}>
              <span>{info.info_icon}</span>
              <span>{info.info_label}:</span>
              <span>{info.info_value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills">
        <h2>My Skills</h2>
        
        {/* Skills - Loop Dynamic Data */}
        <div className="skills-grid">
          {data.skills.map((skill) => (
            <div 
              key={skill.id}
              style={{
                background: `linear-gradient(to right, ${skill.gradient_from}, ${skill.gradient_to})`,
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
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="project">
        <h2>My Projects</h2>
        
        {/* Projects - Pass Dynamic Data to ChromaGrid */}
        <ChromaGrid projects={data.projects.map(p => ({
          title: p.project_title,
          subtitle: p.project_subtitle,
          handle: p.project_handle || '',
          imageUrl: p.project_image_url,
          url: p.project_url || '',
          borderColor: p.border_color,
          gradient: p.gradient,
        }))} />
      </section>
    </div>
  );
}
```

---

### **Option 2: Client-Side Fetching - Real-time Updates**

Jika ingin data selalu real-time (re-fetch setiap load), gunakan Client Component:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchAllPortfolioData } from '@/lib/fetchPortfolioData';

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const portfolioData = await fetchAllPortfolioData();
      setData(portfolioData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return <div>Loading portfolio...</div>;
  }

  return (
    <div>
      {/* Use data.homeContent, data.skills, etc */}
    </div>
  );
}
```

---

## 🔄 **Update ChromaGrid untuk Terima Dynamic Projects**

Edit `components/ChromaGrid.tsx` untuk terima props:

```tsx
// components/ChromaGrid.tsx
interface ChromaGridProps {
  projects: Array<{
    title: string;
    subtitle: string;
    handle: string;
    imageUrl: string;
    url: string;
    borderColor: string;
    gradient: string;
  }>;
}

export default function ChromaGrid({ projects }: ChromaGridProps) {
  return (
    <div className="chroma-grid">
      {projects.map((project, index) => (
        <div 
          key={index}
          className="project-card"
          style={{
            borderColor: project.borderColor,
            background: project.gradient,
          }}
        >
          <img src={project.imageUrl} alt={project.title} />
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
          {project.handle && <span>{project.handle}</span>}
          {project.url && <a href={project.url}>View Project</a>}
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 **Struktur Data yang Tersedia**

Setelah `fetchAllPortfolioData()`, Anda dapat akses:

```typescript
data = {
  // Home Section
  homeContent: {
    id, greeting, name, description
  },
  homeStats: [
    { id, stat_key, stat_value, stat_label, icon, gradient_from, gradient_to }
  ],
  profileCard: {
    id, name, title, handle, status, contact_text, avatar_url, mini_avatar_url
  },
  
  // About Section
  aboutContent: {
    id, who_am_i_title, who_am_i_content, my_approach_title, my_approach_content, profile_photo_url
  },
  personalInfo: [
    { id, info_key, info_label, info_value, info_icon, display_order }
  ],
  
  // Skills Section
  skills: [
    { id, skill_name, skill_category, skill_icon, gradient_from, gradient_to, border_color }
  ],
  
  // Projects Section
  projects: [
    { id, project_title, project_subtitle, project_handle, project_image_url, project_url, border_color, gradient }
  ]
}
```

---

## ⚡ **Tips & Best Practices**

### **1. Fallback Values**

Selalu gunakan fallback jika data null:

```tsx
<h1>{data.homeContent?.name || 'Default Name'}</h1>
```

### **2. Loading State**

Tambahkan loading indicator untuk UX yang lebih baik:

```tsx
{isLoading ? (
  <div className="loading-spinner">Loading...</div>
) : (
  <div>{/* Content */}</div>
)}
```

### **3. Error Handling**

Tangani error dengan graceful:

```tsx
try {
  const data = await fetchAllPortfolioData();
  // ...
} catch (error) {
  console.error('Failed to load portfolio data:', error);
  // Show error message to user
}
```

### **4. Revalidation**

Untuk Server Components, tambahkan revalidation:

```tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const data = await fetchAllPortfolioData();
  // ...
}
```

### **5. Caching**

Next.js secara otomatis cache fetch results. Untuk force fresh data:

```tsx
const { data } = await supabase
  .from('skills')
  .select('*', { head: false, count: 'exact' });
```

---

## 🧪 **Testing Integration**

### **Step 1: Setup Database**
1. Run SQL schema di Supabase
2. Verify data ada di tables

### **Step 2: Test Fetch Functions**
```tsx
// Temporary test component
'use client';
import { useEffect } from 'react';
import { fetchHomeContent } from '@/lib/fetchPortfolioData';

export default function TestFetch() {
  useEffect(() => {
    fetchHomeContent().then(data => {
      console.log('Home Content:', data);
    });
  }, []);
  
  return <div>Check Console</div>;
}
```

### **Step 3: Gradual Migration**
Migrate satu section per satu:
1. ✅ Home Section → Dynamic
2. ✅ About Section → Dynamic
3. ✅ Skills Section → Dynamic
4. ✅ Projects Section → Dynamic

### **Step 4: Verify Real-time**
1. Edit konten di Admin Dashboard
2. Save perubahan
3. Refresh halaman utama
4. Verify perubahan muncul

---

## 🚨 **Common Issues & Solutions**

### **Issue: Data tidak muncul**
**Solution:**
- Cek .env.local sudah benar
- Verify Supabase URL & API Key
- Check browser console for errors
- Verify data exists in Supabase tables

### **Issue: "Failed to fetch"**
**Solution:**
- Cek internet connection
- Verify Supabase project is active
- Check RLS (Row Level Security) settings di Supabase

### **Issue: Old data still showing**
**Solution:**
- Hard refresh browser (Ctrl + Shift + R)
- Clear Next.js cache: `rm -rf .next`
- Check revalidation settings

---

## 📚 **Next Steps**

1. ✅ Migrate halaman utama ke dynamic data
2. ✅ Test semua CRUD operations
3. ✅ Setup proper RLS di Supabase
4. ✅ Add image upload feature (Supabase Storage)
5. ✅ Deploy to production (Vercel)

---

## 💡 **Pro Tips**

- Use **Incremental Static Regeneration (ISR)** untuk best of both worlds
- Enable **Supabase Realtime** untuk instant updates
- Add **loading skeletons** untuk better UX
- Implement **error boundaries** untuk error handling
- Use **React Query** atau **SWR** untuk advanced caching

---

**Need Help?** Contact: tajijaddagirassntosa@gmail.com

**Admin Dashboard:** `http://localhost:3000/admin/login`

**Supabase Dashboard:** `https://supabase.com/dashboard`

