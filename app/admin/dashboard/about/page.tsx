'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AboutContent, PersonalInfo } from '@/types/database';

export default function AdminAbout() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingInfo, setEditingInfo] = useState<PersonalInfo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [newInfo, setNewInfo] = useState<Partial<PersonalInfo>>({
    info_key: '',
    info_label: '',
    info_value: '',
    info_icon: '📌',
    display_order: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [aboutRes, infoRes] = await Promise.all([
        supabase.from('about_content').select('*').single(),
        supabase.from('personal_info').select('*').order('display_order'),
      ]);

      if (aboutRes.data) setAboutContent(aboutRes.data);
      if (infoRes.data) setPersonalInfo(infoRes.data);
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

  const addPersonalInfo = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('personal_info').insert([newInfo]);

      if (error) throw error;
      
      showSuccess('Personal info berhasil ditambahkan!');
      setShowAddModal(false);
      setNewInfo({
        info_key: '',
        info_label: '',
        info_value: '',
        info_icon: '📌',
        display_order: 0,
      });
      fetchAllData();
    } catch (error) {
      console.error('Error adding personal info:', error);
      alert('Gagal menambahkan personal info');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePersonalInfo = async (info: PersonalInfo) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('personal_info')
        .update({
          info_label: info.info_label,
          info_value: info.info_value,
          info_icon: info.info_icon,
          display_order: info.display_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', info.id);

      if (error) throw error;
      
      showSuccess('Personal info berhasil diupdate!');
      setEditingInfo(null);
      fetchAllData();
    } catch (error) {
      console.error('Error updating personal info:', error);
      alert('Gagal mengupdate personal info');
    } finally {
      setIsSaving(false);
    }
  };

  const deletePersonalInfo = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('personal_info').delete().eq('id', id);

      if (error) throw error;
      
      showSuccess('Personal info berhasil dihapus!');
      fetchAllData();
    } catch (error) {
      console.error('Error deleting personal info:', error);
      alert('Gagal menghapus personal info');
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
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-4 rounded-lg">
          ✅ {successMessage}
        </div>
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

      {/* Personal Info Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📋</span>
            <span>Personal Info</span>
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 text-sm"
          >
            <span>➕</span>
            <span>Tambah</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personalInfo.map((info) => (
            <div key={info.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{info.info_icon}</span>
                  <div>
                    <h3 className="text-white font-bold text-sm">{info.info_label}</h3>
                    <p className="text-gray-400 text-xs mt-1">{info.info_value}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingInfo(info)}
                  className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded transition-all"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deletePersonalInfo(info.id)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-all"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Personal Info Modal */}
      {editingInfo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-lg w-full border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Personal Info</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Icon</label>
                <input
                  type="text"
                  value={editingInfo.info_icon}
                  onChange={(e) => setEditingInfo({ ...editingInfo, info_icon: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Label</label>
                <input
                  type="text"
                  value={editingInfo.info_label}
                  onChange={(e) => setEditingInfo({ ...editingInfo, info_label: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Value</label>
                <input
                  type="text"
                  value={editingInfo.info_value}
                  onChange={(e) => setEditingInfo({ ...editingInfo, info_value: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Display Order</label>
                <input
                  type="number"
                  value={editingInfo.display_order}
                  onChange={(e) =>
                    setEditingInfo({ ...editingInfo, display_order: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => updatePersonalInfo(editingInfo)}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  onClick={() => setEditingInfo(null)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Personal Info Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-lg w-full border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Tambah Personal Info</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Key (Unique ID) *</label>
                <input
                  type="text"
                  value={newInfo.info_key}
                  onChange={(e) => setNewInfo({ ...newInfo, info_key: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="e.g., email"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Icon</label>
                <input
                  type="text"
                  value={newInfo.info_icon}
                  onChange={(e) => setNewInfo({ ...newInfo, info_icon: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="📧"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Label *</label>
                <input
                  type="text"
                  value={newInfo.info_label}
                  onChange={(e) => setNewInfo({ ...newInfo, info_label: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Value *</label>
                <input
                  type="text"
                  value={newInfo.info_value}
                  onChange={(e) => setNewInfo({ ...newInfo, info_value: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Display Order</label>
                <input
                  type="number"
                  value={newInfo.display_order}
                  onChange={(e) => setNewInfo({ ...newInfo, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={addPersonalInfo}
                  disabled={isSaving || !newInfo.info_key || !newInfo.info_label || !newInfo.info_value}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Menambahkan...' : 'Tambah'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewInfo({
                      info_key: '',
                      info_label: '',
                      info_value: '',
                      info_icon: '📌',
                      display_order: 0,
                    });
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

