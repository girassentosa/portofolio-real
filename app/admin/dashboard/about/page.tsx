'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AboutContent, HomeStat } from '@/types/database';
import Toast from '@/components/Toast';

export default function AdminAbout() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [stats, setStats] = useState<HomeStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [aboutRes, statsRes] = await Promise.all([
        supabase.from('about_content').select('*').single(),
        supabase.from('home_stats').select('*').order('display_order'),
      ]);

      if (aboutRes.data) setAboutContent(aboutRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAboutContent = async () => {
    if (!aboutContent) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('about_content')
        .update({
          who_am_i_title: aboutContent.who_am_i_title,
          who_am_i_content: aboutContent.who_am_i_content,
          my_approach_title: aboutContent.my_approach_title,
          my_approach_content: aboutContent.my_approach_content,
          profile_photo_url: aboutContent.profile_photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', aboutContent.id);

      if (error) throw error;
      showSuccess('About content berhasil disimpan!');
    } catch (error) {
      console.error('Error saving about content:', error);
      alert('Gagal menyimpan about content');
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

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (isLoading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successMessage && (
        <Toast
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}

      {/* Who Am I Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>👋</span>
          <span>Who Am I</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={aboutContent?.who_am_i_title || ''}
              onChange={(e) =>
                setAboutContent(aboutContent ? { ...aboutContent, who_am_i_title: e.target.value } : null)
              }
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={aboutContent?.who_am_i_content || ''}
              onChange={(e) =>
                setAboutContent(aboutContent ? { ...aboutContent, who_am_i_content: e.target.value } : null)
              }
              rows={5}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* My Approach Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>My Approach</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={aboutContent?.my_approach_title || ''}
              onChange={(e) =>
                setAboutContent(aboutContent ? { ...aboutContent, my_approach_title: e.target.value } : null)
              }
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={aboutContent?.my_approach_content || ''}
              onChange={(e) =>
                setAboutContent(aboutContent ? { ...aboutContent, my_approach_content: e.target.value } : null)
              }
              rows={5}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📸</span>
          <span>Profile Photo</span>
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Photo URL</label>
          <input
            type="text"
            value={aboutContent?.profile_photo_url || ''}
            onChange={(e) =>
              setAboutContent(aboutContent ? { ...aboutContent, profile_photo_url: e.target.value } : null)
            }
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
            placeholder="/images/profile.jpg"
          />
          {/* Preview Profile Photo */}
          {aboutContent?.profile_photo_url && (
            <div className="mt-4 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
              <p className="text-xs text-gray-400 mb-3">Preview Profile Photo:</p>
              <div className="flex justify-center">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg overflow-hidden border-2 border-cyan-500/50 shadow-lg">
                  <img
                    src={aboutContent.profile_photo_url}
                    alt="Profile Photo Preview"
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

      {/* Save Button */}
      <button
        onClick={saveAboutContent}
        disabled={isSaving}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 text-lg"
      >
        {isSaving ? 'Menyimpan...' : '💾 Simpan Semua About Content'}
      </button>

      {/* Stats Section (Moved from Home) */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Gradient From</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={stat.gradient_from}
                        onChange={(e) => {
                          const updated = stats.map((s) =>
                            s.id === stat.id ? { ...s, gradient_from: e.target.value } : s
                          );
                          setStats(updated);
                        }}
                        className="w-10 h-10 sm:w-12 sm:h-10 rounded cursor-pointer border border-gray-500 flex-shrink-0"
                        title="Pick color"
                      />
                      <input
                        type="text"
                        value={stat.gradient_from}
                        onChange={(e) => {
                          const updated = stats.map((s) =>
                            s.id === stat.id ? { ...s, gradient_from: e.target.value } : s
                          );
                          setStats(updated);
                        }}
                        className="flex-1 px-2 sm:px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-xs sm:text-sm min-w-0"
                        placeholder="#06b6d4"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Gradient To</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={stat.gradient_to}
                        onChange={(e) => {
                          const updated = stats.map((s) =>
                            s.id === stat.id ? { ...s, gradient_to: e.target.value } : s
                          );
                          setStats(updated);
                        }}
                        className="w-10 h-10 sm:w-12 sm:h-10 rounded cursor-pointer border border-gray-500 flex-shrink-0"
                        title="Pick color"
                      />
                      <input
                        type="text"
                        value={stat.gradient_to}
                        onChange={(e) => {
                          const updated = stats.map((s) =>
                            s.id === stat.id ? { ...s, gradient_to: e.target.value } : s
                          );
                          setStats(updated);
                        }}
                        className="flex-1 px-2 sm:px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-xs sm:text-sm min-w-0"
                        placeholder="#3b82f6"
                      />
                    </div>
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
    </div>
  );
}

