'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Skill } from '@/types/database';
import Toast from '@/components/Toast';

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    skill_name: '',
    skill_category: '',
    skill_icon: '⚡',
    gradient_from: '#06b6d4',
    gradient_to: '#3b82f6',
    border_color: '#06b6d4',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order');

      if (error) throw error;
      if (data) setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('skills').insert([newSkill]);

      if (error) throw error;

      showSuccess('Skill berhasil ditambahkan!');
      setShowAddModal(false);
      setNewSkill({
        skill_name: '',
        skill_category: '',
        skill_icon: '⚡',
        gradient_from: '#06b6d4',
        gradient_to: '#3b82f6',
        border_color: '#06b6d4',
        display_order: 0,
        is_active: true,
      });
      fetchSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Gagal menambahkan skill');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSkill = async (skill: Skill) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('skills')
        .update({
          skill_name: skill.skill_name,
          skill_category: skill.skill_category,
          skill_icon: skill.skill_icon,
          gradient_from: skill.gradient_from,
          gradient_to: skill.gradient_to,
          border_color: skill.border_color,
          display_order: skill.display_order,
          is_active: skill.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', skill.id);

      if (error) throw error;

      showSuccess('Skill berhasil diupdate!');
      setEditingSkill(null);
      fetchSkills();
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Gagal mengupdate skill');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSkill = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus skill ini?')) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);

      if (error) throw error;

      showSuccess('Skill berhasil dihapus!');
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Gagal menghapus skill');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (skill: Skill) => {
    try {
      const { error } = await supabase
        .from('skills')
        .update({ is_active: !skill.is_active })
        .eq('id', skill.id);

      if (error) throw error;
      fetchSkills();
    } catch (error) {
      console.error('Error toggling active:', error);
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Skills Management</h2>
          <p className="text-gray-400 mt-1">Total: {skills.length} skills</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
        >
          <span>➕</span>
          <span>Tambah Skill</span>
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`bg-gray-800 rounded-xl p-5 border ${skill.is_active ? 'border-gray-700' : 'border-gray-700/50 opacity-60'
              }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{skill.skill_icon}</span>
                <div>
                  <h3 className="text-white font-bold">{skill.skill_name}</h3>
                  <p className="text-gray-400 text-sm">{skill.skill_category}</p>
                </div>
              </div>
              <button
                onClick={() => toggleActive(skill)}
                className={`px-3 py-1 rounded text-xs font-medium ${skill.is_active
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-700 text-gray-400'
                  }`}
              >
                {skill.is_active ? 'Active' : 'Hidden'}
              </button>
            </div>

            <div className="flex gap-2 text-xs text-gray-400 mb-3">
              <span
                className="px-2 py-1 rounded"
                style={{
                  background: `linear-gradient(to right, ${skill.gradient_from}, ${skill.gradient_to})`,
                  color: 'white',
                }}
              >
                Gradient
              </span>
              <span
                className="px-2 py-1 rounded border"
                style={{ borderColor: skill.border_color, color: skill.border_color }}
              >
                Border
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingSkill(skill)}
                className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded transition-all"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deleteSkill(skill.id)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-all"
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Skill</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Skill Name</label>
                  <input
                    type="text"
                    value={editingSkill.skill_name}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, skill_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    value={editingSkill.skill_category}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, skill_category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Icon</label>
                  <input
                    type="text"
                    value={editingSkill.skill_icon}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, skill_icon: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={editingSkill.display_order}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, display_order: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Gradient From</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingSkill.gradient_from}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, gradient_from: e.target.value })
                      }
                      className="w-12 h-12 sm:w-14 sm:h-12 rounded cursor-pointer border border-gray-600 flex-shrink-0"
                      title="Pick color"
                    />
                    <input
                      type="text"
                      value={editingSkill.gradient_from}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, gradient_from: e.target.value })
                      }
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base min-w-0"
                      placeholder="#06b6d4"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Gradient To</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingSkill.gradient_to}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, gradient_to: e.target.value })
                      }
                      className="w-12 h-12 sm:w-14 sm:h-12 rounded cursor-pointer border border-gray-600 flex-shrink-0"
                      title="Pick color"
                    />
                    <input
                      type="text"
                      value={editingSkill.gradient_to}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, gradient_to: e.target.value })
                      }
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base min-w-0"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Border Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingSkill.border_color}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, border_color: e.target.value })
                      }
                      className="w-12 h-12 sm:w-14 sm:h-12 rounded cursor-pointer border border-gray-600 flex-shrink-0"
                      title="Pick color"
                    />
                    <input
                      type="text"
                      value={editingSkill.border_color}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, border_color: e.target.value })
                      }
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base min-w-0"
                      placeholder="#06b6d4"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => updateSkill(editingSkill)}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  onClick={() => setEditingSkill(null)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Tambah Skill Baru</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Skill Name *</label>
                  <input
                    type="text"
                    value={newSkill.skill_name}
                    onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="e.g., React.js"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category *</label>
                  <input
                    type="text"
                    value={newSkill.skill_category}
                    onChange={(e) => setNewSkill({ ...newSkill, skill_category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="e.g., JS Library"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Icon</label>
                  <input
                    type="text"
                    value={newSkill.skill_icon}
                    onChange={(e) => setNewSkill({ ...newSkill, skill_icon: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="⚛️"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={newSkill.display_order}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, display_order: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Gradient From</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newSkill.gradient_from}
                      onChange={(e) => setNewSkill({ ...newSkill, gradient_from: e.target.value })}
                      className="w-12 h-12 sm:w-14 sm:h-12 rounded cursor-pointer border border-gray-600 flex-shrink-0"
                      title="Pick color"
                    />
                    <input
                      type="text"
                      value={newSkill.gradient_from}
                      onChange={(e) => setNewSkill({ ...newSkill, gradient_from: e.target.value })}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base min-w-0"
                      placeholder="#06b6d4"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Gradient To</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newSkill.gradient_to}
                      onChange={(e) => setNewSkill({ ...newSkill, gradient_to: e.target.value })}
                      className="w-12 h-12 sm:w-14 sm:h-12 rounded cursor-pointer border border-gray-600 flex-shrink-0"
                      title="Pick color"
                    />
                    <input
                      type="text"
                      value={newSkill.gradient_to}
                      onChange={(e) => setNewSkill({ ...newSkill, gradient_to: e.target.value })}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base min-w-0"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Border Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newSkill.border_color}
                      onChange={(e) => setNewSkill({ ...newSkill, border_color: e.target.value })}
                      className="w-12 h-12 sm:w-14 sm:h-12 rounded cursor-pointer border border-gray-600 flex-shrink-0"
                      title="Pick color"
                    />
                    <input
                      type="text"
                      value={newSkill.border_color}
                      onChange={(e) => setNewSkill({ ...newSkill, border_color: e.target.value })}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base min-w-0"
                      placeholder="#06b6d4"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={addSkill}
                  disabled={isSaving || !newSkill.skill_name || !newSkill.skill_category}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Menambahkan...' : 'Tambah Skill'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSkill({
                      skill_name: '',
                      skill_category: '',
                      skill_icon: '⚡',
                      gradient_from: '#06b6d4',
                      gradient_to: '#3b82f6',
                      border_color: '#06b6d4',
                      display_order: 0,
                      is_active: true,
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

