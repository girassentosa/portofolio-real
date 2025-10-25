'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    personalInfo: 0,
    lastUpdate: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch counts dari semua tables
      const [skillsRes, projectsRes, personalInfoRes] = await Promise.all([
        supabase.from('skills').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('personal_info').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        skills: skillsRes.count || 0,
        projects: projectsRes.count || 0,
        personalInfo: personalInfoRes.count || 0,
        lastUpdate: new Date().toLocaleString('id-ID'),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cards = [
    {
      title: 'Home Section',
      description: 'Edit greeting, nama, deskripsi, stats, dan profile card',
      icon: '🏠',
      link: '/admin/dashboard/home',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'About Section',
      description: 'Kelola Who Am I, My Approach, dan Personal Info',
      icon: '👤',
      link: '/admin/dashboard/about',
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Skills Section',
      description: `Manage ${stats.skills} skills yang ditampilkan`,
      icon: '⚡',
      link: '/admin/dashboard/skills',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      title: 'Projects Section',
      description: `Kelola ${stats.projects} project portfolio`,
      icon: '🚀',
      link: '/admin/dashboard/projects',
      color: 'from-green-500 to-emerald-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang di CMS Admin! 👋</h1>
        <p className="text-blue-100">
          Kelola seluruh konten portfolio Anda dari sini. Semua perubahan akan langsung ter-update di halaman utama.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Skills</p>
              <p className="text-white text-2xl font-bold">{stats.skills}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Projects</p>
              <p className="text-white text-2xl font-bold">{stats.projects}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Personal Info</p>
              <p className="text-white text-2xl font-bold">{stats.personalInfo}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🕒</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last Update</p>
              <p className="text-white text-xs font-medium">{stats.lastUpdate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link
              key={card.link}
              href={card.link}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{card.description}</p>
                </div>
                <svg
                  className="w-6 h-6 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📖</span>
          <span>Panduan Penggunaan</span>
        </h3>
        <div className="space-y-3 text-gray-300">
          <p className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">1.</span>
            <span>Pilih section yang ingin Anda edit dari menu di atas</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">2.</span>
            <span>Lakukan perubahan pada form yang tersedia (edit, tambah, atau hapus)</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">3.</span>
            <span>Klik tombol &quot;Simpan&quot; untuk menyimpan perubahan ke database</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">4.</span>
            <span>Perubahan akan otomatis ter-update di halaman portfolio utama</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">5.</span>
            <span>Gunakan tombol &quot;Lihat Portfolio&quot; untuk melihat hasil perubahan</span>
          </p>
        </div>
      </div>
    </div>
  );
}

