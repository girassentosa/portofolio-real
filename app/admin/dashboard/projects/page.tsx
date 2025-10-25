'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/database';
import Image from 'next/image';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [newProject, setNewProject] = useState<Partial<Project>>({
    project_title: '',
    project_subtitle: '',
    project_handle: '',
    project_location: '',
    project_image_url: '/images/preview-home.png',
    project_url: '',
    border_color: '#3B82F6',
    gradient: 'linear-gradient(145deg, #3B82F6, #000)',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order');

      if (error) throw error;
      if (data) setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('projects').insert([newProject]);

      if (error) throw error;
      
      showSuccess('Project berhasil ditambahkan!');
      setShowAddModal(false);
      setNewProject({
        project_title: '',
        project_subtitle: '',
        project_handle: '',
        project_location: '',
        project_image_url: '/images/preview-home.png',
        project_url: '',
        border_color: '#3B82F6',
        gradient: 'linear-gradient(145deg, #3B82F6, #000)',
        display_order: 0,
        is_active: true,
      });
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Gagal menambahkan project');
    } finally {
      setIsSaving(false);
    }
  };

  const updateProject = async (project: Project) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          project_title: project.project_title,
          project_subtitle: project.project_subtitle,
          project_handle: project.project_handle,
          project_location: project.project_location,
          project_image_url: project.project_image_url,
          project_url: project.project_url,
          border_color: project.border_color,
          gradient: project.gradient,
          display_order: project.display_order,
          is_active: project.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);

      if (error) throw error;
      
      showSuccess('Project berhasil diupdate!');
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Gagal mengupdate project');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus project ini?')) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) throw error;
      
      showSuccess('Project berhasil dihapus!');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Gagal menghapus project');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_active: !project.is_active })
        .eq('id', project.id);

      if (error) throw error;
      fetchProjects();
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
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-4 rounded-lg">
          ✅ {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects Management</h2>
          <p className="text-gray-400 mt-1">Total: {projects.length} projects</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
        >
          <span>➕</span>
          <span>Tambah Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`bg-gray-800 rounded-xl overflow-hidden border ${
              project.is_active ? 'border-gray-700' : 'border-gray-700/50 opacity-60'
            }`}
          >
            {/* Project Image */}
            <div className="relative h-48 bg-gray-900">
              <Image
                src={project.project_image_url}
                alt={project.project_title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleActive(project)}
                  className={`px-3 py-1 rounded text-xs font-medium backdrop-blur-sm ${
                    project.is_active
                      ? 'bg-green-500/80 text-white'
                      : 'bg-gray-700/80 text-gray-300'
                  }`}
                >
                  {project.is_active ? 'Active' : 'Hidden'}
                </button>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-5">
              <h3 className="text-white font-bold text-lg mb-1">{project.project_title}</h3>
              <p className="text-gray-400 text-sm mb-2">{project.project_subtitle}</p>
              
              {project.project_handle && (
                <p className="text-cyan-400 text-xs mb-3">📁 {project.project_handle}</p>
              )}

              <div className="flex gap-2 mb-4">
                <span
                  className="px-2 py-1 rounded text-xs text-white"
                  style={{ background: project.gradient }}
                >
                  Gradient
                </span>
                <span
                  className="px-2 py-1 rounded border text-xs"
                  style={{ borderColor: project.border_color, color: project.border_color }}
                >
                  Border
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded transition-all"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-all"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-3xl w-full border border-gray-700 my-8">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Project</h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Project Title *</label>
                  <input
                    type="text"
                    value={editingProject.project_title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, project_title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Subtitle/Tech Stack *</label>
                  <input
                    type="text"
                    value={editingProject.project_subtitle}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, project_subtitle: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Next.js, Tailwind CSS, GSAP"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category/Handle</label>
                  <input
                    type="text"
                    value={editingProject.project_handle || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, project_handle: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Web Development"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={editingProject.display_order}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, display_order: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Project Image URL *</label>
                  <input
                    type="text"
                    value={editingProject.project_image_url}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, project_image_url: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="/images/project.png"
                  />
                  {/* Preview Project Image */}
                  {editingProject.project_image_url && (
                    <div className="mt-4 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                      <p className="text-xs text-gray-400 mb-3">Preview Project Image:</p>
                      <div className="flex justify-center">
                        <div className="w-full max-w-sm aspect-video rounded-lg overflow-hidden border-2 border-cyan-500/50 shadow-lg">
                          <img
                            src={editingProject.project_image_url}
                            alt="Project Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/preview-home.png';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Project URL (Optional)</label>
                  <input
                    type="text"
                    value={editingProject.project_url || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, project_url: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Border Color</label>
                  <input
                    type="text"
                    value={editingProject.border_color}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, border_color: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="#3B82F6"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Gradient CSS</label>
                  <input
                    type="text"
                    value={editingProject.gradient}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, gradient: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="linear-gradient(145deg, #3B82F6, #000)"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => updateProject(editingProject)}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  onClick={() => setEditingProject(null)}
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-3xl w-full border border-gray-700 my-8">
            <h3 className="text-2xl font-bold text-white mb-6">Tambah Project Baru</h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Project Title *</label>
                  <input
                    type="text"
                    value={newProject.project_title}
                    onChange={(e) => setNewProject({ ...newProject, project_title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Portfolio Website"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Subtitle/Tech Stack *</label>
                  <input
                    type="text"
                    value={newProject.project_subtitle}
                    onChange={(e) => setNewProject({ ...newProject, project_subtitle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Next.js, Tailwind CSS, GSAP"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category/Handle</label>
                  <input
                    type="text"
                    value={newProject.project_handle}
                    onChange={(e) => setNewProject({ ...newProject, project_handle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Web Development"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={newProject.display_order}
                    onChange={(e) =>
                      setNewProject({ ...newProject, display_order: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Project Image URL *</label>
                  <input
                    type="text"
                    value={newProject.project_image_url}
                    onChange={(e) => setNewProject({ ...newProject, project_image_url: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="/images/project.png"
                  />
                  {/* Preview Project Image */}
                  {newProject.project_image_url && (
                    <div className="mt-4 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                      <p className="text-xs text-gray-400 mb-3">Preview Project Image:</p>
                      <div className="flex justify-center">
                        <div className="w-full max-w-sm aspect-video rounded-lg overflow-hidden border-2 border-cyan-500/50 shadow-lg">
                          <img
                            src={newProject.project_image_url}
                            alt="Project Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/preview-home.png';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Project URL (Optional)</label>
                  <input
                    type="text"
                    value={newProject.project_url}
                    onChange={(e) => setNewProject({ ...newProject, project_url: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Border Color</label>
                  <input
                    type="text"
                    value={newProject.border_color}
                    onChange={(e) => setNewProject({ ...newProject, border_color: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="#3B82F6"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Gradient CSS</label>
                  <input
                    type="text"
                    value={newProject.gradient}
                    onChange={(e) => setNewProject({ ...newProject, gradient: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="linear-gradient(145deg, #3B82F6, #000)"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={addProject}
                  disabled={isSaving || !newProject.project_title || !newProject.project_subtitle}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Menambahkan...' : 'Tambah Project'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewProject({
                      project_title: '',
                      project_subtitle: '',
                      project_handle: '',
                      project_location: '',
                      project_image_url: '/images/preview-home.png',
                      project_url: '',
                      border_color: '#3B82F6',
                      gradient: 'linear-gradient(145deg, #3B82F6, #000)',
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

