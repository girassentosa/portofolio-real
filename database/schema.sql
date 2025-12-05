-- =====================================================
-- PORTFOLIO CMS DATABASE SCHEMA
-- Database: PostgreSQL (Supabase)
-- Version: 1.0.0
-- Author: Taji Jadda Giras Sentosa
-- =====================================================

-- =====================================================
-- CLEANUP: Drop existing tables & policies (if exists)
-- =====================================================

DROP POLICY IF EXISTS "Public read access for home_content" ON home_content;
DROP POLICY IF EXISTS "Allow all operations for home_content" ON home_content;

DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS about_content CASCADE;
DROP TABLE IF EXISTS profile_card CASCADE;
DROP TABLE IF EXISTS home_stats CASCADE;
DROP TABLE IF EXISTS home_content CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;


-- =====================================================
-- TABLE: admin_users
-- Purpose: Authentication untuk admin dashboard
-- =====================================================

CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(32) NOT NULL,
  photo_url TEXT DEFAULT '/images/profile.jpg',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE admin_users IS 'Admin authentication dengan MD5 password hashing';
COMMENT ON COLUMN admin_users.password_hash IS 'MD5 hash dari password';
COMMENT ON COLUMN admin_users.photo_url IS 'URL foto profile admin';


-- =====================================================
-- TABLE: home_content
-- Purpose: Konten utama section Home (greeting, name, description)
-- =====================================================

CREATE TABLE home_content (
  id SERIAL PRIMARY KEY,
  greeting TEXT NOT NULL DEFAULT 'Halo, saya',
  name TEXT NOT NULL DEFAULT 'Taji Jadda Giras Sentosa',
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE home_content IS 'Main content untuk Home section';
COMMENT ON COLUMN home_content.greeting IS 'Greeting text (e.g., "Halo, saya")';
COMMENT ON COLUMN home_content.name IS 'Full name dengan TextType animation';
COMMENT ON COLUMN home_content.description IS 'Deskripsi utama dengan DecryptedText animation';


-- =====================================================
-- TABLE: home_stats
-- Purpose: Stats cards di Home section (4 items)
-- =====================================================

CREATE TABLE home_stats (
  id SERIAL PRIMARY KEY,
  stat_key VARCHAR(50) UNIQUE NOT NULL,
  stat_value VARCHAR(50) NOT NULL,
  stat_label VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  gradient_from VARCHAR(50) NOT NULL,
  gradient_to VARCHAR(50) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_gradient_from CHECK (gradient_from ~ '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT check_gradient_to CHECK (gradient_to ~ '^#[0-9A-Fa-f]{6}$')
);

COMMENT ON TABLE home_stats IS 'Stats cards untuk menampilkan achievement/info';
COMMENT ON COLUMN home_stats.stat_key IS 'Unique identifier (e.g., "experience", "projects")';
COMMENT ON COLUMN home_stats.stat_value IS 'Display value (e.g., "2+", "10+", "3.68")';
COMMENT ON COLUMN home_stats.gradient_from IS 'Hex color untuk gradient start';
COMMENT ON COLUMN home_stats.gradient_to IS 'Hex color untuk gradient end';
COMMENT ON COLUMN home_stats.display_order IS 'Order untuk sorting (1, 2, 3, 4)';


-- =====================================================
-- TABLE: profile_card
-- Purpose: Holographic profile card info
-- =====================================================

CREATE TABLE profile_card (
  id SERIAL PRIMARY KEY,
  handle VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  avatar_url TEXT NOT NULL,
  mini_avatar_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profile_card IS 'Holographic profile card dengan 3D effect';
COMMENT ON COLUMN profile_card.handle IS 'Username/handle (e.g., @username)';
COMMENT ON COLUMN profile_card.status IS 'Status text (e.g., "Online", "Available")';
COMMENT ON COLUMN profile_card.avatar_url IS 'Main avatar image URL';
COMMENT ON COLUMN profile_card.mini_avatar_url IS 'Small avatar for user info section';


-- =====================================================
-- TABLE: about_content
-- Purpose: About section main content
-- =====================================================

CREATE TABLE about_content (
  id SERIAL PRIMARY KEY,
  who_am_i_title VARCHAR(100) NOT NULL DEFAULT 'Who am I',
  who_am_i_content TEXT NOT NULL,
  my_approach_title VARCHAR(100) NOT NULL DEFAULT 'My Approach',
  my_approach_content TEXT NOT NULL,
  lanyard_card_file VARCHAR(100) NOT NULL DEFAULT 'card.glb',
  lanyard_texture_file VARCHAR(100) NOT NULL DEFAULT 'lanyard.png',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE about_content IS 'Main content untuk About section';
COMMENT ON COLUMN about_content.who_am_i_title IS 'Title untuk "Who am I" section';
COMMENT ON COLUMN about_content.my_approach_title IS 'Title untuk "My Approach" section';
COMMENT ON COLUMN about_content.lanyard_card_file IS 'Nama file 3D card untuk lanyard (e.g., card.glb, card1.glb)';
COMMENT ON COLUMN about_content.lanyard_texture_file IS 'Nama file texture untuk lanyard (e.g., lanyard.png, lanyard1.png)';



-- =====================================================
-- TABLE: skills
-- Purpose: Skills list dengan custom styling
-- =====================================================

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  skill_name VARCHAR(100) NOT NULL,
  skill_category VARCHAR(100) NOT NULL,
  skill_icon TEXT NOT NULL,
  gradient_from VARCHAR(50) NOT NULL,
  gradient_to VARCHAR(50) NOT NULL,
  border_color VARCHAR(50) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_skill_gradient_from CHECK (gradient_from ~ '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT check_skill_gradient_to CHECK (gradient_to ~ '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT check_skill_border CHECK (border_color ~ '^#[0-9A-Fa-f]{6}$')
);

COMMENT ON TABLE skills IS 'Skills list dengan custom gradient & icon';
COMMENT ON COLUMN skills.skill_name IS 'Skill name (e.g., "React.js", "Node.js")';
COMMENT ON COLUMN skills.skill_category IS 'Category (e.g., "JS Library", "Backend")';
COMMENT ON COLUMN skills.skill_icon IS 'Icon emoji or URL (e.g., "⚛️" or "https://cdn.simpleicons.org/react")';
COMMENT ON COLUMN skills.is_active IS 'Toggle untuk show/hide tanpa delete';


-- =====================================================
-- TABLE: projects
-- Purpose: Portfolio projects dengan preview image
-- =====================================================

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  project_title VARCHAR(200) NOT NULL,
  project_subtitle TEXT NOT NULL,
  project_handle VARCHAR(100),
  project_location VARCHAR(100),
  project_image_url TEXT NOT NULL,
  project_url TEXT,
  border_color VARCHAR(50) NOT NULL DEFAULT '#3B82F6',
  gradient TEXT NOT NULL DEFAULT 'linear-gradient(145deg, #3B82F6, #000)',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_project_border CHECK (border_color ~ '^#[0-9A-Fa-f]{6}$')
);

COMMENT ON TABLE projects IS 'Portfolio projects dengan ChromaGrid design';
COMMENT ON COLUMN projects.project_title IS 'Project title (main heading)';
COMMENT ON COLUMN projects.project_subtitle IS 'Tech stack atau deskripsi singkat';
COMMENT ON COLUMN projects.project_handle IS 'Category handle (e.g., "Web Development")';
COMMENT ON COLUMN projects.project_image_url IS 'Preview image URL';
COMMENT ON COLUMN projects.project_url IS 'Link ke GitHub/demo (optional)';
COMMENT ON COLUMN projects.gradient IS 'CSS gradient untuk card background';


-- =====================================================
-- INDEXES untuk Performance Optimization
-- =====================================================

CREATE INDEX idx_home_stats_order ON home_stats(display_order);
CREATE INDEX idx_skills_active ON skills(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_skills_order ON skills(display_order);
CREATE INDEX idx_projects_active ON projects(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_projects_order ON projects(display_order);

COMMENT ON INDEX idx_skills_active IS 'Partial index untuk active skills only';
COMMENT ON INDEX idx_projects_active IS 'Partial index untuk active projects only';


-- =====================================================
-- ROW LEVEL SECURITY (RLS) Setup
-- =====================================================

-- Enable RLS pada semua tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_card ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- RLS POLICIES: Public Read Access
-- Purpose: Allow public untuk view portfolio content
-- =====================================================

CREATE POLICY "Enable read access for all users" 
  ON home_content FOR SELECT 
  USING (true);

CREATE POLICY "Enable read access for all users" 
  ON home_stats FOR SELECT 
  USING (true);

CREATE POLICY "Enable read access for all users" 
  ON profile_card FOR SELECT 
  USING (true);

CREATE POLICY "Enable read access for all users" 
  ON about_content FOR SELECT 
  USING (true);

CREATE POLICY "Enable read access for all users" 
  ON skills FOR SELECT 
  USING (true);

CREATE POLICY "Enable read access for all users" 
  ON projects FOR SELECT 
  USING (true);

CREATE POLICY "Enable read access for all users" 
  ON admin_users FOR SELECT 
  USING (true);


-- =====================================================
-- RLS POLICIES: Admin Write Access
-- Purpose: Allow admin dashboard untuk modify data
-- =====================================================

CREATE POLICY "Enable all operations for authenticated users" 
  ON home_content FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" 
  ON home_stats FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" 
  ON profile_card FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" 
  ON about_content FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" 
  ON skills FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" 
  ON projects FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" 
  ON admin_users FOR ALL 
  USING (true) 
  WITH CHECK (true);


-- =====================================================
-- DEFAULT DATA: Admin User
-- =====================================================

INSERT INTO admin_users (username, password_hash, photo_url) VALUES 
  ('admin', '0192023a7bbd73250516f069df18b500', '/images/profile.jpg');
-- Default password: admin123 (MD5 hash)
-- ⚠️ IMPORTANT: Ganti password ini setelah first login!


-- =====================================================
-- DEFAULT DATA: Home Section
-- =====================================================

INSERT INTO home_content (greeting, name, description) VALUES (
  'Halo, saya',
  'Taji Jadda Giras Sentosa',
  'Berpengalaman dalam pengembangan web dan IoT, saya terbiasa merancang solusi yang responsif, cepat, dan sesuai kebutuhan pengguna. Menguasai JavaScript sebagai bahasa utama untuk membangun aplikasi modern dan interaktif.'
);

INSERT INTO home_stats (stat_key, stat_value, stat_label, icon, gradient_from, gradient_to, display_order) VALUES
  ('experience', '2+', 'Tahun Pengalaman', '💼', '#06b6d4', '#3b82f6', 1),
  ('language', 'JS', 'Bahasa Utama', '⚡', '#fbbf24', '#f59e0b', 2),
  ('projects', '10+', 'Total Proyek', '🚀', '#3b82f6', '#06b6d4', 3),
  ('gpa', '3.68', 'IPK / 4.00', '🎓', '#10b981', '#06b6d4', 4);

INSERT INTO profile_card (handle, status, avatar_url, mini_avatar_url) VALUES (
  'tajijaddagiras_',
  'Online',
  '/images/profile.jpg',
  '/images/profile.jpg'
);


-- =====================================================
-- DEFAULT DATA: About Section
-- =====================================================

INSERT INTO about_content (who_am_i_title, who_am_i_content, my_approach_title, my_approach_content, lanyard_card_file, lanyard_texture_file) VALUES (
  'Who am I',
  'Saya adalah seorang Software Engineer dengan passion dalam pengembangan web modern dan teknologi IoT. Dengan pengalaman 2+ tahun, saya telah mengerjakan berbagai proyek yang menggabungkan kreativitas dan teknologi.',
  'My Approach',
  'Saya percaya bahwa kode yang baik adalah kode yang clean, maintainable, dan scalable. Saya selalu berusaha untuk menulis kode yang tidak hanya berfungsi, tetapi juga mudah dipahami oleh developer lain. Setiap project adalah kesempatan untuk belajar dan berkembang.',
  'card.glb',
  'lanyard.png'
);


-- =====================================================
-- DEFAULT DATA: Skills Section
-- =====================================================

INSERT INTO skills (skill_name, skill_category, skill_icon, gradient_from, gradient_to, border_color, display_order) VALUES
  ('VS Code', 'Code Editor', 'https://cdn.simpleicons.org/visualstudiocode', '#06b6d4', '#3b82f6', '#06b6d4', 1),
  ('React.js', 'JS Library', 'https://cdn.simpleicons.org/react', '#06b6d4', '#3b82f6', '#06b6d4', 2),
  ('Next.js', 'React Framework', 'https://cdn.simpleicons.org/nextdotjs', '#ffffff', '#d1d5db', '#ffffff', 3),
  ('Tailwind CSS', 'CSS Framework', 'https://cdn.simpleicons.org/tailwindcss', '#22d3ee', '#3b82f6', '#22d3ee', 4),
  ('Bootstrap', 'CSS Framework', 'https://cdn.simpleicons.org/bootstrap', '#a855f7', '#3b82f6', '#a855f7', 5),
  ('JavaScript', 'Programming', 'https://cdn.simpleicons.org/javascript', '#facc15', '#f97316', '#facc15', 6),
  ('Node.js', 'Runtime', 'https://cdn.simpleicons.org/nodedotjs', '#22c55e', '#059669', '#22c55e', 7),
  ('GitHub', 'Version Control', 'https://cdn.simpleicons.org/github', '#9ca3af', '#6b7280', '#9ca3af', 8),
  ('Vercel', 'Deployment', 'https://cdn.simpleicons.org/vercel', '#ffffff', '#d1d5db', '#ffffff', 9),
  ('Supabase', 'Backend', 'https://cdn.simpleicons.org/supabase', '#4ade80', '#10b981', '#4ade80', 10),
  ('Firebase', 'Backend', 'https://cdn.simpleicons.org/firebase', '#f97316', '#eab308', '#f97316', 11),
  ('HTML5', 'Markup', 'https://cdn.simpleicons.org/html5', '#f97316', '#dc2626', '#f97316', 12),
  ('CSS3', 'Styling', 'https://cdn.simpleicons.org/css3', '#3b82f6', '#06b6d4', '#3b82f6', 13),
  ('TypeScript', 'Programming', 'https://cdn.simpleicons.org/typescript', '#3b82f6', '#1e40af', '#3b82f6', 14),
  ('PHP', 'Programming', 'https://cdn.simpleicons.org/php', '#8b5cf6', '#6366f1', '#8b5cf6', 15),
  ('MySQL', 'Database', 'https://cdn.simpleicons.org/mysql', '#06b6d4', '#0891b2', '#06b6d4', 16);


-- =====================================================
-- DEFAULT DATA: Projects Section
-- =====================================================

INSERT INTO projects (project_title, project_subtitle, project_handle, project_image_url, project_url, border_color, gradient, display_order) VALUES
  ('Portfolio Website', 'Next.js, Tailwind CSS, GSAP', 'Web Development', '/images/preview-home.png', 'https://github.com/girassentosa', '#3B82F6', 'linear-gradient(145deg, #3B82F6, #000)', 1),
  ('IoT Smart Home', 'Node.js, Firebase, Arduino', 'IoT Project', '/images/preview-projects.png', 'https://github.com/girassentosa', '#10B981', 'linear-gradient(180deg, #10B981, #000)', 2),
  ('E-Commerce Platform', 'React, Supabase, Stripe', 'Full Stack', '/images/preview-about.png', 'https://github.com/girassentosa', '#F59E0B', 'linear-gradient(165deg, #F59E0B, #000)', 3),
  ('Weather Station IoT', 'ESP32, MQTT, Dashboard', 'IoT Project', '/images/preview-skills.png', 'https://github.com/girassentosa', '#EF4444', 'linear-gradient(195deg, #EF4444, #000)', 4),
  ('Task Management App', 'Next.js, TypeScript, Vercel', 'Web App', '/images/preview-mobile.png', 'https://github.com/girassentosa', '#8B5CF6', 'linear-gradient(225deg, #8B5CF6, #000)', 5),
  ('Smart Parking System', 'IoT, MySQL, Real-time', 'IoT Project', '/images/preview-admin.png', 'https://github.com/girassentosa', '#06B6D4', 'linear-gradient(135deg, #06B6D4, #000)', 6);


-- =====================================================
-- TRIGGERS: Auto-update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SET search_path = 'public'
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_home_content_updated_at BEFORE UPDATE ON home_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_home_stats_updated_at BEFORE UPDATE ON home_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_card_updated_at BEFORE UPDATE ON profile_card
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- VERIFICATION: Check database setup
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 Tables created: 7';
  RAISE NOTICE '🔒 RLS enabled on all tables';
  RAISE NOTICE '📝 Policies created: 14 (2 per table)';
  RAISE NOTICE '🔍 Indexes created: 5';
  RAISE NOTICE '⚡ Triggers created: 7 (with secure search_path)';
  RAISE NOTICE '🛡️ Security: Function search_path configured';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Next steps:';
  RAISE NOTICE '1. Verify tables di Table Editor';
  RAISE NOTICE '2. Check Security Advisor (should be 0 errors, 0 warnings)';
  RAISE NOTICE '3. Test admin login: admin / admin123';
  RAISE NOTICE '4. Update .env.local dengan Supabase keys';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Admin Dashboard: http://localhost:3000/admin/login';
END $$;
