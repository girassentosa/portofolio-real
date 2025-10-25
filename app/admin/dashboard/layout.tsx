'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import md5 from 'md5';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPhoto, setAdminPhoto] = useState('/images/profile.jpg');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    oldUsername: '',
    oldPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
    photoUrl: ''
  });
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const username = localStorage.getItem('admin_username');
    const photo = localStorage.getItem('admin_photo');

    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }

    setAdminUsername(username || 'Admin');
    setAdminPhoto(photo || '/images/profile.jpg');
    setIsLoading(false);
  }, [router]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handlePhotoUrlChange = (url: string) => {
    setEditForm({ ...editForm, photoUrl: url });
    setPhotoPreview(url);
  };

  // Open edit profile modal with current photo URL prefilled
  const openEditProfileModal = () => {
    setEditForm({
      ...editForm,
      photoUrl: adminPhoto
    });
    setPhotoPreview(adminPhoto);
    setShowEditProfileModal(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const isChangingCredentials = editForm.newUsername || editForm.newPassword;
      const isChangingPhoto = editForm.photoUrl && editForm.photoUrl !== adminPhoto;

      // Validate: at least one change must be made
      if (!isChangingCredentials && !isChangingPhoto) {
        alert('Tidak ada perubahan yang dilakukan!');
        return;
      }

      // If changing credentials, validate old credentials
      if (isChangingCredentials) {
        if (!editForm.oldUsername || !editForm.oldPassword) {
          alert('Username dan password lama wajib diisi untuk mengubah credentials!');
          return;
        }

        const oldPasswordHash = md5(editForm.oldPassword);
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('username', editForm.oldUsername)
          .eq('password_hash', oldPasswordHash)
          .single();

        if (!adminData) {
          alert('Username atau password lama salah!');
          return;
        }

        // Validate new password confirmation
        if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
          alert('Password baru tidak cocok!');
          return;
        }

        // Update credentials in database
        const updateData: { username?: string; password_hash?: string } = {};
        if (editForm.newUsername) updateData.username = editForm.newUsername;
        if (editForm.newPassword) updateData.password_hash = md5(editForm.newPassword);

        const { error } = await supabase
          .from('admin_users')
          .update(updateData)
          .eq('username', editForm.oldUsername);

        if (error) throw error;

        // Update localStorage for credentials
        const newUsername = editForm.newUsername || editForm.oldUsername;
        localStorage.setItem('admin_username', newUsername);
        setAdminUsername(newUsername);
      }

      // Update photo (can be done independently)
      if (isChangingPhoto) {
        localStorage.setItem('admin_photo', editForm.photoUrl);
        setAdminPhoto(editForm.photoUrl);
      }

      alert('Profile berhasil diupdate!');
      setShowEditProfileModal(false);
      setEditForm({
        oldUsername: '',
        oldPassword: '',
        newUsername: '',
        newPassword: '',
        confirmPassword: '',
        photoUrl: ''
      });
      setPhotoPreview('');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Gagal update profile!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_login_time');
    router.push('/'); // Redirect ke halaman utama
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: '📊',
    },
    {
      title: 'Home Section',
      path: '/admin/dashboard/home',
      icon: '🏠',
    },
    {
      title: 'About Section',
      path: '/admin/dashboard/about',
      icon: '👤',
    },
    {
      title: 'Skills Section',
      path: '/admin/dashboard/skills',
      icon: '⚡',
    },
    {
      title: 'Projects Section',
      path: '/admin/dashboard/projects',
      icon: '🚀',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside
        className={`
        w-64 lg:${isSidebarOpen ? 'w-64' : 'w-20'}
        bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col
        fixed lg:relative inset-y-0 left-0 z-50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Profile Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {/* Profile Photo - Clickable */}
            <button
              onClick={() => setShowPhotoModal(true)}
              className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/50 hover:border-cyan-400 transition-all hover:scale-110 flex-shrink-0"
            >
              <img
                src={adminPhoto}
                alt={adminUsername}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/profile.jpg';
                }}
              />
            </button>

            {/* Admin Info - Always show on mobile, conditional on desktop */}
            <div className={`flex-1 ${isSidebarOpen ? 'block' : 'hidden lg:hidden'}`}>
              <h1 className="text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent truncate">
                {adminUsername}
              </h1>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors text-white flex-shrink-0"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

        </div>

        {/* Menu Items & Logout */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                {/* Always show text on mobile, conditional on desktop */}
                <span className={`font-medium ${isSidebarOpen ? 'block' : 'hidden lg:hidden'}`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
          
          {/* Logout Button - Positioned after menu items */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300"
          >
            <span className="text-2xl">🚪</span>
            {/* Always show text on mobile, conditional on desktop */}
            <span className={`font-medium ${isSidebarOpen ? 'block' : 'hidden lg:hidden'}`}>
              Logout
            </span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full lg:w-auto">
        {/* Top Bar - Responsive */}
        <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors text-white"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Page Title */}
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {menuItems.find((item) => item.path === pathname)?.title || 'Dashboard'}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">
                Kelola konten portfolio Anda di sini
              </p>
            </div>
          </div>
        </header>

        {/* Content Area - Responsive Padding */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>

      {/* Photo Zoom Modal */}
      {showPhotoModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowPhotoModal(false)}
        >
          <div
            className="relative max-w-xs sm:max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors text-3xl font-bold"
            >
              ✕
            </button>

            {/* Photo Container with Frame */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-3 sm:p-4 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              {/* Photo */}
              <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/50 shadow-lg mb-3">
                <img
                  src={adminPhoto}
                  alt={adminUsername}
                  className="w-full h-auto object-cover aspect-square"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/profile.jpg';
                  }}
                />
              </div>

              {/* Admin Name */}
              <div className="text-center mb-3">
                <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  {adminUsername}
                </h3>
                <p className="text-gray-400 text-xs">Administrator</p>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  openEditProfileModal();
                }}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all text-sm font-medium shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
              >
                <span>⚙️</span>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowEditProfileModal(false)}
        >
          <div
            className="relative max-w-4xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-cyan-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                      Edit Profile
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      Ubah foto profile atau credentials secara terpisah
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEditProfileModal(false)}
                    className="text-gray-400 hover:text-white transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Form Content - 2 Columns on Desktop */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Change Password */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🔐</span>
                    <h3 className="text-xl font-bold text-white">Ubah Kata Sandi</h3>
                  </div>

                  {/* Verifikasi Data Saat Ini */}
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3 mb-4">
                    <p className="text-cyan-400 text-xs">
                      💡 Username & password lama hanya wajib jika ingin mengubah credentials
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Username Lama
                    </label>
                    <input
                      type="text"
                      value={editForm.oldUsername}
                      onChange={(e) => setEditForm({ ...editForm, oldUsername: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="Masukkan username lama"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Password Lama
                    </label>
                    <input
                      type="password"
                      value={editForm.oldPassword}
                      onChange={(e) => setEditForm({ ...editForm, oldPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="Masukkan password lama"
                    />
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-400 text-xs mb-3">Ubah Credentials (Opsional)</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Username Baru
                        </label>
                        <input
                          type="text"
                          value={editForm.newUsername}
                          onChange={(e) => setEditForm({ ...editForm, newUsername: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                          placeholder="Username baru (opsional)"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          value={editForm.newPassword}
                          onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                          placeholder="Password baru (opsional)"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Ulangi Password Baru
                        </label>
                        <input
                          type="password"
                          value={editForm.confirmPassword}
                          onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                          placeholder="Konfirmasi password baru"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Change Photo */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📸</span>
                    <h3 className="text-xl font-bold text-white">Ubah Foto Profile</h3>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      URL Foto Profile
                    </label>
                    <input
                      type="text"
                      value={editForm.photoUrl}
                      onChange={(e) => handlePhotoUrlChange(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="/images/profile.jpg"
                    />
                    <p className="text-gray-500 text-xs mt-2">
                      Contoh: /images/profile.jpg atau /images/profile1.jpg
                    </p>

                    {/* Photo Preview - Only show when photoPreview exists */}
                    {photoPreview && (
                      <div className="mt-4 p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
                        <p className="text-gray-400 text-sm mb-3">Preview Foto:</p>
                        <div className="flex justify-center">
                          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/profile.jpg';
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer - Action Buttons */}
              <div className="bg-gray-800/50 border-t border-gray-700 p-6 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowEditProfileModal(false);
                    setEditForm({
                      oldUsername: '',
                      oldPassword: '',
                      newUsername: '',
                      newPassword: '',
                      confirmPassword: '',
                      photoUrl: ''
                    });
                    setPhotoPreview('');
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-cyan-500/30"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

