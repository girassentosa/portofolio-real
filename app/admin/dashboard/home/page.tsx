'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HomeContent, HomeStat, ProfileCard } from '@/types/database';

export default function AdminHome() {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [stats, setStats] = useState<HomeStat[]>([]);
  const [profileCard, setProfileCard] = useState<ProfileCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [contentRes, statsRes, profileRes] = await Promise.all([
        supabase.from('home_content').select('*').single(),
        supabase.from('home_stats').select('*').order('display_order'),
        supabase.from('profile_card').select('*').single(),
      ]);

      if (contentRes.data) setHomeContent(contentRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (profileRes.data) setProfileCard(profileRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHomeContent = async () => {
    if (!homeContent) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('home_content')
        .update({
          greeting: homeContent.greeting,
          name: homeContent.name,
          description: homeContent.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', homeContent.id);

      if (error) throw error;
      showSuccess('Home content berhasil disimpan!');
    } catch (error) {
      console.error('Error saving home content:', error);
      alert('Gagal menyimpan home content');
    } finally {
      setIsSaving(false);
    }
  };

  const saveAllStats = async () => {
    setIsSaving(true);

    try {
      // Update all stats
      const updates = stats.map((stat) =>
        supabase
          .from('home_stats')
          .update({
            stat_value: stat.stat_value,
            stat_label: stat.stat_label,
            icon: stat.icon,
            gradient_from: stat.gradient_from,
            gradient_to: stat.gradient_to,
            updated_at: new Date().toISOString(),
          })
          .eq('id', stat.id)
      );

      await Promise.all(updates);
      showSuccess('Semua stats berhasil disimpan!');
    } catch (error) {
      console.error('Error saving stats:', error);
      alert('Gagal menyimpan stats');
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfileCard = async () => {
    if (!profileCard) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profile_card')
        .update({
          name: profileCard.name,
          title: profileCard.title,
          handle: profileCard.handle,
          status: profileCard.status,
          contact_text: profileCard.contact_text,
          avatar_url: profileCard.avatar_url,
          mini_avatar_url: profileCard.mini_avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileCard.id);

      if (error) throw error;
      showSuccess('Profile card berhasil disimpan!');
    } catch (error) {
      console.error('Error saving profile card:', error);
      alert('Gagal menyimpan profile card');
    } finally {
      setIsSaving(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-4 rounded-lg">
          ✅ {successMessage}
        </div>
      )}

      {/* Home Content Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📝</span>
          <span>Main Content</span>
        </h2>

        <div className="space-y-4">
          {/* Greeting */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Greeting (e.g., &quot;Halo, saya&quot;)
            </label>
            <input
              type="text"
              value={homeContent?.greeting || ''}
              onChange={(e) =>
                setHomeContent(homeContent ? { ...homeContent, greeting: e.target.value } : null)
              }
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={homeContent?.name || ''}
              onChange={(e) =>
                setHomeContent(homeContent ? { ...homeContent, name: e.target.value } : null)
              }
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deskripsi
            </label>
            <textarea
              value={homeContent?.description || ''}
              onChange={(e) =>
                setHomeContent(homeContent ? { ...homeContent, description: e.target.value } : null)
              }
              rows={5}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          <button
            onClick={saveHomeContent}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Main Content'}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📊</span>
          <span>Stats Cards</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Icon</label>
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={(e) => {
                        const updated = stats.map((s) =>
                          s.id === stat.id ? { ...s, icon: e.target.value } : s
                        );
                        setStats(updated);
                      }}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Value</label>
                    <input
                      type="text"
                      value={stat.stat_value}
                      onChange={(e) => {
                        const updated = stats.map((s) =>
                          s.id === stat.id ? { ...s, stat_value: e.target.value } : s
                        );
                        setStats(updated);
                      }}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Label</label>
                  <input
                    type="text"
                    value={stat.stat_label}
                    onChange={(e) => {
                      const updated = stats.map((s) =>
                        s.id === stat.id ? { ...s, stat_label: e.target.value } : s
                      );
                      setStats(updated);
                    }}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Gradient From</label>
                    <input
                      type="text"
                      value={stat.gradient_from}
                      onChange={(e) => {
                        const updated = stats.map((s) =>
                          s.id === stat.id ? { ...s, gradient_from: e.target.value } : s
                        );
                        setStats(updated);
                      }}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Gradient To</label>
                    <input
                      type="text"
                      value={stat.gradient_to}
                      onChange={(e) => {
                        const updated = stats.map((s) =>
                          s.id === stat.id ? { ...s, gradient_to: e.target.value } : s
                        );
                        setStats(updated);
                      }}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save All Stats Button */}
        <button
          onClick={saveAllStats}
          disabled={isSaving}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Semua Stats'}
        </button>
      </div>

      {/* Profile Card Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>👤</span>
          <span>Profile Card</span>
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nama</label>
              <input
                type="text"
                value={profileCard?.name || ''}
                onChange={(e) =>
                  setProfileCard(profileCard ? { ...profileCard, name: e.target.value } : null)
                }
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title/Posisi</label>
              <input
                type="text"
                value={profileCard?.title || ''}
                onChange={(e) =>
                  setProfileCard(profileCard ? { ...profileCard, title: e.target.value } : null)
                }
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Handle (Username)</label>
              <input
                type="text"
                value={profileCard?.handle || ''}
                onChange={(e) =>
                  setProfileCard(profileCard ? { ...profileCard, handle: e.target.value } : null)
                }
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <input
                type="text"
                value={profileCard?.status || ''}
                onChange={(e) =>
                  setProfileCard(profileCard ? { ...profileCard, status: e.target.value } : null)
                }
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Avatar URLs Section - 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Avatar URL</label>
              <input
                type="text"
                value={profileCard?.avatar_url || ''}
                onChange={(e) =>
                  setProfileCard(profileCard ? { ...profileCard, avatar_url: e.target.value } : null)
                }
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="/images/profile.jpg"
              />
              {/* Preview Avatar */}
              {profileCard?.avatar_url && (
                <div className="mt-3 p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
                  <p className="text-xs text-gray-400 mb-2">Preview Avatar:</p>
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg">
                      <img
                        src={profileCard.avatar_url}
                        alt="Avatar Preview"
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mini Avatar URL</label>
              <input
                type="text"
                value={profileCard?.mini_avatar_url || ''}
                onChange={(e) =>
                  setProfileCard(profileCard ? { ...profileCard, mini_avatar_url: e.target.value } : null)
                }
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="/images/profile.jpg"
              />
              {/* Preview Mini Avatar */}
              {profileCard?.mini_avatar_url && (
                <div className="mt-3 p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
                  <p className="text-xs text-gray-400 mb-2">Preview Mini Avatar:</p>
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg">
                      <img
                        src={profileCard.mini_avatar_url}
                        alt="Mini Avatar Preview"
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

          <button
            onClick={saveProfileCard}
            disabled={isSaving}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Profile Card'}
          </button>
        </div>
      </div>
    </div>
  );
}

