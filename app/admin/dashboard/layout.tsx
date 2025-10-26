'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import md5 from 'md5';
import { supabase } from '@/lib/supabase';
import Toast from '@/components/Toast';

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
  const [successMessage, setSuccessMessage] = useState('');
  
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

      // Determine which username to use for database queries
      const usernameForQuery = isChangingCredentials && editForm.oldUsername 
        ? editForm.oldUsername 
        : adminUsername;

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

        // Prepare update data (include photo if changing)
        const updateData: { username?: string; password_hash?: string; photo_url?: string } = {};
        if (editForm.newUsername) updateData.username = editForm.newUsername;
        if (editForm.newPassword) updateData.password_hash = md5(editForm.newPassword);
        if (isChangingPhoto) updateData.photo_url = editForm.photoUrl;

        // Update everything in one query using OLD username
        const { error } = await supabase
          .from('admin_users')
          .update(updateData)
          .eq('username', editForm.oldUsername);

        if (error) throw error;

        // Update localStorage for credentials
        const newUsername = editForm.newUsername || editForm.oldUsername;
        localStorage.setItem('admin_username', newUsername);
        setAdminUsername(newUsername);

        // Update photo in localStorage if changed
        if (isChangingPhoto) {
          localStorage.setItem('admin_photo', editForm.photoUrl);
          setAdminPhoto(editForm.photoUrl);
        }
      } else if (isChangingPhoto) {
        // Update photo only (no credential changes)
        const { error } = await supabase
          .from('admin_users')
          .update({ photo_url: editForm.photoUrl })
          .eq('username', usernameForQuery);

        if (error) throw error;

        localStorage.setItem('admin_photo', editForm.photoUrl);
        setAdminPhoto(editForm.photoUrl);
      }

      setSuccessMessage('Profile berhasil diperbarui! 🎉');
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
    <div className="h-screen bg-gray-900 flex relative overflow-hidden">
      {/* Toast Notification */}
      {successMessage && (
        <Toast 
          message={successMessage} 
          onClose={() => setSuccessMessage('')}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Fixed untuk semua devices */}
      <aside
        className={`
        w-64 lg:${isSidebarOpen ? 'w-64' : 'w-20'}
        bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col
        fixed inset-y-0 left-0 z-50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Profile Header - Same height as top bar */}
        <div className="px-4 py-3 border-b border-gray-700 h-[73px] flex items-center">
          <div className="flex items-center gap-3 w-full">
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
              <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent truncate leading-tight">
                {adminUsername}
              </h1>
              <p className="text-gray-400 text-xs leading-tight">Administrator</p>
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
        <nav className="flex-1 p-3 sm:p-4 space-y-1.5 sm:space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl sm:text-2xl">{item.icon}</span>
                {/* Always show text on mobile, conditional on desktop */}
                <span className={`text-sm sm:text-base font-medium ${isSidebarOpen ? 'block' : 'hidden lg:hidden'}`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
          
          {/* Logout Button - Positioned after menu items */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all w-full text-left bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300"
          >
            <span className="text-xl sm:text-2xl">🚪</span>
            {/* Always show text on mobile, conditional on desktop */}
            <span className={`text-sm sm:text-base font-medium ${isSidebarOpen ? 'block' : 'hidden lg:hidden'}`}>
              Logout
            </span>
          </button>
        </nav>
      </aside>

      {/* Main Content - Add margin to account for fixed sidebar */}
      <main className={`flex-1 flex flex-col h-screen ml-0 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar - Fixed untuk semua devices */}
        <header className={`fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-3 h-[73px] flex items-center z-40 transition-all duration-300 ${isSidebarOpen ? 'lg:left-64' : 'lg:left-20'}`}>
          <div className="flex items-center gap-4 w-full">
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
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {menuItems.find((item) => item.path === pathname)?.title || 'Dashboard'}
              </h2>
              <p className="text-gray-400 text-xs leading-tight hidden sm:block">
                Kelola konten portfolio Anda di sini
              </p>
            </div>
          </div>
        </header>

        {/* Content Area - Scrollable, account for fixed header */}
        <div className="flex-1 overflow-y-auto pt-[73px] px-4 sm:px-6 pb-4 sm:pb-6">
          {children}
        </div>
      </main>

      {/* Photo Zoom Modal - Compact version */}
      {showPhotoModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowPhotoModal(false)}
        >
          <div
            className="relative w-64 max-w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-cyan-400 transition-colors text-2xl font-bold"
            >
              ✕
            </button>

            {/* Photo Container with Frame */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-3 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              {/* Photo */}
              <div className="relative rounded-lg overflow-hidden border-2 border-cyan-500/50 shadow-lg mb-2">
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
              <div className="text-center mb-2">
                <h3 className="text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
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
                className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all text-sm font-medium shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowEditProfileModal(false)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-cyan-500/30 p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                      Edit Profile
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Ubah foto profile atau credentials secara terpisah
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEditProfileModal(false)}
                    className="text-gray-400 hover:text-white transition-colors text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Form Content - Scrollable */}
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {/* Section: Change Password */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🔐</span>
                    <h3 className="text-lg font-bold text-white">Ubah Kata Sandi</h3>
                  </div>

                  {/* Info Notice */}
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-2 mb-3">
                    <p className="text-cyan-400 text-xs">
                      💡 Username & password lama hanya wajib jika ingin mengubah credentials
                    </p>
                  </div>

                  {/* Grid Layout - 2 Columns on Desktop, 1 on Mobile */}
                  <div className="space-y-3">
                    {/* Row 1: Username Lama | Password Lama */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 text-xs font-medium mb-1.5">
                          Username Lama
                        </label>
                        <input
                          type="text"
                          value={editForm.oldUsername}
                          onChange={(e) => setEditForm({ ...editForm, oldUsername: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                          placeholder="Masukkan username lama"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-xs font-medium mb-1.5">
                          Password Lama
                        </label>
                        <input
                          type="password"
                          value={editForm.oldPassword}
                          onChange={(e) => setEditForm({ ...editForm, oldPassword: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                          placeholder="Masukkan password lama"
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-700 pt-3">
                      <p className="text-gray-400 text-xs mb-3">Ubah Credentials (Opsional)</p>
                    </div>

                    {/* Row 2: Username Baru | Password Baru */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 text-xs font-medium mb-1.5">
                          Username Baru
                        </label>
                        <input
                          type="text"
                          value={editForm.newUsername}
                          onChange={(e) => setEditForm({ ...editForm, newUsername: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                          placeholder="Username baru (opsional)"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-xs font-medium mb-1.5">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          value={editForm.newPassword}
                          onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                          placeholder="Password baru (opsional)"
                        />
                      </div>
                    </div>

                    {/* Row 3: Ulangi Password Baru (Full Width) */}
                    <div>
                      <label className="block text-gray-300 text-xs font-medium mb-1.5">
                        Ulangi Password Baru
                      </label>
                      <input
                        type="password"
                        value={editForm.confirmPassword}
                        onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        placeholder="Konfirmasi password baru"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Divider */}
                <div className="border-t border-gray-700"></div>

                {/* Section: Change Photo */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📸</span>
                    <h3 className="text-lg font-bold text-white">Ubah Foto Profile</h3>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-xs font-medium mb-1.5">
                      URL Foto Profile
                    </label>
                    <input
                      type="text"
                      value={editForm.photoUrl}
                      onChange={(e) => handlePhotoUrlChange(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="/images/profile.jpg"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Contoh: /images/profile.jpg atau /images/profile1.jpg
                    </p>

                    {/* Photo Preview - Only show when photoPreview exists */}
                    {photoPreview && (
                      <div className="mt-3 p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <p className="text-gray-400 text-xs mb-2">Preview Foto:</p>
                        <div className="flex justify-center">
                          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
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
              <div className="bg-gray-800/50 border-t border-gray-700 p-4 flex flex-col sm:flex-row gap-2 justify-end flex-shrink-0">
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
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm rounded-lg transition-all font-medium shadow-lg shadow-cyan-500/30"
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

