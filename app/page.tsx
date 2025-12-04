'use client';

import { useState, useEffect } from 'react';
import ProfileCard from '@/components/ProfileCard';
import TextType from '@/components/TextType';
import TrueFocus from '@/components/TrueFocus';

import PixelCard from '@/components/PixelCard';
import ChromaGrid from '@/components/ChromaGrid';
import { fetchAllPortfolioData } from '@/lib/fetchPortfolioData';
import type { HomeContent, HomeStat, ProfileCard as ProfileCardType, AboutContent, PersonalInfo, Skill, Project } from '@/types/database';

export default function Home() {
  // Database State (DYNAMIC DATA!)
  const [portfolioData, setPortfolioData] = useState<{
    homeContent: HomeContent | null;
    homeStats: HomeStat[];
    profileCard: ProfileCardType | null;
    aboutContent: AboutContent | null;
    personalInfo: PersonalInfo[];
    skills: Skill[];
    projects: Project[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    sendVia: 'whatsapp',
    email: '',
    subject: 'website',
    message: ''
  });

  // CV Download Modal State
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'image' | null>(null);

  // Fetch Portfolio Data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        const data = await fetchAllPortfolioData();
        setPortfolioData(data);
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setIsLoading(false);
        // Show navbar dan konten bersamaan dengan smooth transition
        setTimeout(() => {
          document.body.setAttribute('data-page-loading', 'false');
        }, 150);
      }
    }
    loadData();
  }, []);

  // Handle Form Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Form Submit
  const handleSubmit = () => {
    const { name, sendVia, email, subject, message } = formData;

    // Validation
    if (!name || !email || !message) {
      alert('Mohon lengkapi semua field yang diperlukan!');
      return;
    }

    // Subject mapping
    const subjectText = {
      'website': 'Pembuatan Website',
      'aplikasi': 'Pembuatan Aplikasi Website',
      'proposal': 'Proposal/Skripsi'
    }[subject] || 'Pembuatan Website';

    // Format message
    const formattedMessage = `Halo, saya ${name}

Email: ${email}
Subject: ${subjectText}

Pesan:
${message}`;

    if (sendVia === 'whatsapp') {
      // WhatsApp
      const waNumber = '6281265098103'; // 62 is Indonesia country code
      const encodedMessage = encodeURIComponent(formattedMessage);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
      window.open(waUrl, '_blank');
    } else {
      // Email
      const emailAddress = 'tajijaddagirassntosa@gmail.com';
      const encodedSubject = encodeURIComponent(`${subjectText} - ${name}`);
      const encodedBody = encodeURIComponent(formattedMessage);
      const mailtoUrl = `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`;
      window.location.href = mailtoUrl;
    }

    // Reset form after submit
    setFormData({
      name: '',
      sendVia: 'whatsapp',
      email: '',
      subject: 'website',
      message: ''
    });
  };

  // Scroll to Section Helper
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      // Responsive offset untuk semua devices
      const width = window.innerWidth;
      let headerOffset;

      if (width < 640) {
        headerOffset = 55; // Mobile (< 640px)
      } else if (width < 768) {
        headerOffset = 60; // Small tablet (640px - 768px)
      } else if (width < 1024) {
        headerOffset = 85; // Medium tablet (768px - 1024px)
      } else {
        headerOffset = 100; // Desktop (≥ 1024px)
      }

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle CV Download
  const handleDownloadCV = () => {
    if (!selectedFormat) return;

    const fileName = selectedFormat === 'pdf'
      ? 'CV TAJI JADDA GIRAS SENTOSA.pdf'
      : 'CV TAJI JADDA GIRAS SENTOSA.jpg';
    const filePath = `/images/${fileName}`;

    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Close modal and reset
    setShowCVModal(false);
    setSelectedFormat(null);
  };

  // Loading state - Custom Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-center">
          {/* Logo Container with Glow */}
          <div className="relative mb-8">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-20 blur-3xl animate-pulse"></div>
            </div>

            {/* Logo Circle */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-1 rounded-full bg-black flex items-center justify-center">
                <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  TJ
                </span>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Loading Portofolio
            </h2>
            <div className="flex justify-center gap-1.5">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-xl mb-4">⚠️ Failed to load portfolio data</p>
          <p className="text-white/60 mb-6">Please check your Supabase connection in .env.local</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isLoading ? 'opacity-0' : 'opacity-100 animate-fade-in'} transition-opacity duration-500`}>
      {/* Home Section */}
      <div id="home" className="w-full min-h-screen pt-32 sm:pt-36 md:pt-40 lg:pt-48 px-4 sm:px-6 md:px-8 lg:px-12 pb-12">
        <div className="container mx-auto max-w-7xl">

          {/* 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Column - Text Content */}
            <div className="text-white order-2 lg:order-1">

              {/* Greeting with TrueFocus Effect - DYNAMIC! */}
              <div className="text-base sm:text-lg md:text-xl text-white/70 leading-tight">
                <TrueFocus
                  sentence={portfolioData.homeContent?.greeting || 'Halo, saya'}
                  manualMode={false}
                  blurAmount={5}
                  borderColor="#06b6d4"
                  glowColor="rgba(6, 182, 212, 0.6)"
                  animationDuration={0.5}
                  pauseBetweenAnimations={0.5}
                />
              </div>

              {/* Name with Typing Effect - DYNAMIC! */}
              <div className="w-full mt-3 sm:mt-3 md:mt-3 lg:mt-3">
                <TextType
                  as="h1"
                  text={portfolioData.homeContent?.name || 'Your Name'}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                  loop={true}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight break-words"
                  cursorClassName="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
                />
              </div>

              {/* Description with Decrypted Text Effect - DYNAMIC! */}
              <div className="w-full mt-3 sm:mt-3 md:mt-3 lg:mt-3 text-sm sm:text-base md:text-lg lg:text-xl text-white/80 leading-normal sm:leading-normal md:leading-relaxed text-justify">
                {portfolioData.homeContent?.description || 'Your description here'}
              </div>

              {/* Social Media */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 animate-fade-in-up mt-4 sm:mt-4 md:mt-4 lg:mt-4">
                <span className="text-xs sm:text-sm md:text-base text-white/70">Ikuti saya:</span>
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* GitHub */}
                  <a
                    href="https://github.com/girassentosa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-4 md:mt-4 lg:mt-4">
                <button
                  onClick={() => scrollToSection('#project')}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🚀</span>
                    Jelajahi Proyek Saya
                  </span>
                </button>
                <button
                  onClick={() => setShowCVModal(true)}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-semibold rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    Unduh CV Saya
                    <span>📥</span>
                  </span>
                </button>
              </div>

              {/* Stats Cards - DYNAMIC! */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 md:gap-2.5 mt-4 sm:mt-4 md:mt-4 lg:mt-4">
                {portfolioData.homeStats.map((stat) => (
                  <div
                    key={stat.id}
                    className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-md sm:rounded-lg md:rounded-xl p-2 sm:p-2.5 md:p-3 text-center hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <div
                      className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent leading-tight"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${stat.gradient_from}, ${stat.gradient_to})`
                      }}
                    >
                      {stat.stat_value}
                    </div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs text-white/60 mt-0.5 sm:mt-1 leading-tight">{stat.stat_label}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column - Profile Card - DYNAMIC! */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[420px]">
                {portfolioData.profileCard && (
                  <ProfileCard
                    avatarUrl={portfolioData.profileCard.avatar_url}
                    miniAvatarUrl={portfolioData.profileCard.mini_avatar_url}
                    name={portfolioData.profileCard.name}
                    title={portfolioData.profileCard.title}
                    handle={portfolioData.profileCard.handle}
                    status={portfolioData.profileCard.status}
                    contactText={portfolioData.profileCard.contact_text}
                    showUserInfo={true}
                    enableTilt={true}
                    enableMobileTilt={false}
                    onContactClick={() => scrollToSection('#contact')}
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="w-full pt-11 sm:pt-12 md:pt-11 lg:pt-13 px-4 sm:px-6 md:px-8 lg:px-12 pb-8 lg:pb-12">
        <div className="container mx-auto max-w-7xl">

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div className="flex justify-center items-center">
              <TrueFocus
                sentence="About Me"
                manualMode={false}
                blurAmount={5}
                borderColor="#06b6d4"
                glowColor="rgba(6, 182, 212, 0.6)"
                animationDuration={0.5}
                pauseBetweenAnimations={0.5}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
              />
            </div>
            <div className="mt-3 sm:mt-4 w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* About Content Grid */}
          <div className="relative space-y-6 lg:space-y-8">

            {/* Main Grid Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

              {/* Left Column - Who am I and Personal Info */}
              <div className="lg:col-span-9 space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">

                {/* Top Row - Who am I and My Approach */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">

                  {/* Who am I - DYNAMIC! */}
                  <PixelCard variant="blue" className="w-full">
                    <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Who am I
                      </h2>
                      <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-justify">
                        {portfolioData.aboutContent?.who_am_i_content || 'Content not available'}
                      </p>
                    </div>
                  </PixelCard>

                  {/* My Approach - DYNAMIC! */}
                  <PixelCard variant="yellow" className="w-full">
                    <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        My Approach
                      </h2>
                      <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-justify">
                        {portfolioData.aboutContent?.my_approach_content || 'Content not available'}
                      </p>
                    </div>
                  </PixelCard>

                </div>

                {/* Personal Info - DYNAMIC! */}
                <PixelCard variant="pink" className="w-full">
                  <div className="p-4 sm:p-5 md:p-6 space-y-3">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      Personal Info
                    </h2>

                    {/* Grid 2 kolom untuk info selain address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {portfolioData.personalInfo
                        .filter(info => info.info_key !== 'address')
                        .map((info) => (
                          <div
                            key={info.id}
                            className="flex items-start gap-2 p-2 sm:p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
                          >
                            <span className="text-base sm:text-lg">{info.info_icon}</span>
                            <div>
                              <p className="text-[9px] sm:text-[10px] text-white/60">{info.info_label}</p>
                              <p className="text-xs sm:text-sm text-white font-medium break-all">{info.info_value}</p>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Address - Full Width di bawah */}
                    {portfolioData.personalInfo
                      .filter(info => info.info_key === 'address')
                      .map((info) => (
                        <div
                          key={info.id}
                          className="flex items-start gap-2 p-2 sm:p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
                        >
                          <span className="text-base sm:text-lg">{info.info_icon}</span>
                          <div>
                            <p className="text-[9px] sm:text-[10px] text-white/60">{info.info_label}</p>
                            <p className="text-xs sm:text-sm text-white font-medium break-all">{info.info_value}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </PixelCard>

              </div>

              {/* Right Column - Profile Image - DYNAMIC! */}
              <div className="lg:col-span-3 flex items-center justify-center order-1 lg:order-2">
                <div className="relative w-full lg:max-w-full">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl">
                    <img
                      src={portfolioData.aboutContent?.profile_photo_url || '/images/profile.jpg'}
                      alt="Taji Jadda Giras Sentosa - Profile Photo"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                      width="600"
                      height="600"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20 -z-10"></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div id="skills" className="w-full pt-11 sm:pt-12 md:pt-11 lg:pt-13 px-4 sm:px-6 md:px-8 lg:px-12 pb-8 lg:pb-12">
        <div className="container mx-auto max-w-7xl">

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div className="flex justify-center items-center">
              <TrueFocus
                sentence="My Skills"
                manualMode={false}
                blurAmount={5}
                borderColor="#06b6d4"
                glowColor="rgba(6, 182, 212, 0.6)"
                animationDuration={0.5}
                pauseBetweenAnimations={0.5}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
              />
            </div>
            <div className="mt-3 sm:mt-4 w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Skills Grid - DYNAMIC! */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {portfolioData.skills.map((skill) => (
              <div
                key={skill.id}
                className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border-2 rounded-lg p-2 sm:p-3 transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: skill.border_color || 'rgba(255,255,255,0.3)'
                }}
              >
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${skill.gradient_from}10, ${skill.gradient_to}10)`
                  }}
                ></div>
                <div
                  className="absolute -inset-0.5 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${skill.gradient_from}, ${skill.gradient_to})`
                  }}
                ></div>
                <div className="relative flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 flex-shrink-0">
                    {skill.skill_icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate">{skill.skill_name}</h3>
                    <p className="text-[9px] sm:text-[10px] text-white/60 truncate">{skill.skill_category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Section */}
      <div id="project" className="w-full pt-11 sm:pt-12 md:pt-11 lg:pt-13 px-4 sm:px-6 md:px-8 lg:px-12 pb-8 lg:pb-12">
        <div className="container mx-auto max-w-7xl">

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div className="flex justify-center items-center">
              <TrueFocus
                sentence="My Projects"
                manualMode={false}
                blurAmount={5}
                borderColor="#06b6d4"
                glowColor="rgba(6, 182, 212, 0.6)"
                animationDuration={0.5}
                pauseBetweenAnimations={0.5}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
              />
            </div>
            <div className="mt-3 sm:mt-4 w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* ChromaGrid Container - DYNAMIC! */}
          <div className="w-full" style={{ minHeight: '600px', height: 'auto', position: 'relative' }}>
            <ChromaGrid
              items={portfolioData.projects.map(project => ({
                image: project.project_image_url,
                title: project.project_title,
                subtitle: project.project_subtitle,
                handle: project.project_handle || '',
                borderColor: project.border_color,
                gradient: project.gradient,
                url: project.project_url || '#'
              }))}
              radius={250}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="w-full min-h-screen pt-11 sm:pt-12 md:pt-11 lg:pt-13 px-4 sm:px-6 md:px-8 lg:px-12 pb-8 lg:pb-12">
        <div className="container mx-auto max-w-7xl">

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div className="flex justify-center items-center">
              <TrueFocus
                sentence="Contact Me"
                manualMode={false}
                blurAmount={5}
                borderColor="#06b6d4"
                glowColor="rgba(6, 182, 212, 0.6)"
                animationDuration={0.5}
                pauseBetweenAnimations={0.5}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
              />
            </div>
            <div className="mt-3 sm:mt-4 w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Contact Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 lg:items-center">

            {/* Left Column - Contact Info */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Hubungi Saya</h3>

              {/* WhatsApp */}
              <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg p-2 sm:p-3 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-2xl sm:text-3xl filter drop-shadow-[0_0_10px_rgba(34,197,94,0.7)] group-hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.9)] transition-all duration-300 flex-shrink-0">
                    📱
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">WhatsApp</h4>
                    <p className="text-[9px] sm:text-[10px] text-white/60 truncate">081265098103</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg p-2 sm:p-3 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-2xl sm:text-3xl filter drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.9)] transition-all duration-300 flex-shrink-0">
                    📧
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">Email</h4>
                    <p className="text-[9px] sm:text-[10px] text-white/60 truncate">tajijaddagirassntosa@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* TikTok */}
              <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg p-2 sm:p-3 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-2xl sm:text-3xl filter drop-shadow-[0_0_10px_rgba(236,72,153,0.7)] group-hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] transition-all duration-300 flex-shrink-0">
                    🎵
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">TikTok</h4>
                    <p className="text-[9px] sm:text-[10px] text-white/60 truncate">@tajijddagrssntosa</p>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg p-2 sm:p-3 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-orange-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-2xl sm:text-3xl filter drop-shadow-[0_0_10px_rgba(236,72,153,0.7)] group-hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] transition-all duration-300 flex-shrink-0">
                    📷
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">Instagram</h4>
                    <p className="text-[9px] sm:text-[10px] text-white/60 truncate">@tajijaddagiras_</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column - Contact Form */}
            <div className="relative">
              {/* Form Container with Premium Glassmorphism */}
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl">

                {/* Gradient Border Effect */}
                <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl -z-10 blur-sm"></div>

                {/* Glow Effect */}
                <div className="absolute -inset-[2px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl -z-20 blur-xl opacity-50"></div>

                {/* Form Header */}
                <div className="mb-4 sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                      <span className="text-xl sm:text-2xl">✉️</span>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      Kirim Pesan Langsung
                    </h3>
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/60 ml-0 sm:ml-12">
                    Hubungi saya untuk kolaborasi atau pertanyaan
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Row 1: Nama Lengkap & Kirim Via - 2 Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nama Lengkap */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90 mb-2">
                        <span className="text-base">👤</span>
                        <span>Nama Lengkap</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Masukkan nama lengkap Anda"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm sm:text-base placeholder:text-white/30 focus:border-cyan-500/60 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 hover:border-white/20"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Kirim Via */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90 mb-2">
                        <span className="text-base">📤</span>
                        <span>Kirim Via</span>
                      </label>
                      <div className="relative">
                        <select
                          name="sendVia"
                          value={formData.sendVia}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm sm:text-base focus:border-cyan-500/60 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 hover:border-white/20 appearance-none cursor-pointer"
                        >
                          <option value="whatsapp" className="bg-gray-900 py-2">📱 WhatsApp</option>
                          <option value="email" className="bg-gray-900 py-2">📧 Email</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Email & Subject - 2 Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90 mb-2">
                        <span className="text-base">📧</span>
                        <span>Email</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="contoh@email.com"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm sm:text-base placeholder:text-white/30 focus:border-cyan-500/60 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 hover:border-white/20"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90 mb-2">
                        <span className="text-base">📋</span>
                        <span>Subject</span>
                      </label>
                      <div className="relative">
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm sm:text-base focus:border-cyan-500/60 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 hover:border-white/20 appearance-none cursor-pointer"
                        >
                          <option value="website" className="bg-gray-900 py-2">🌐 Pembuatan Website</option>
                          <option value="aplikasi" className="bg-gray-900 py-2">💻 Pembuatan Aplikasi Website</option>
                          <option value="proposal" className="bg-gray-900 py-2">📄 Proposal/Skripsi</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pesan - Full Width */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90 mb-2">
                      <span className="text-base">💬</span>
                      <span>Pesan</span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tulis pesan Anda di sini..."
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm sm:text-base placeholder:text-white/30 focus:border-cyan-500/60 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 hover:border-white/20 resize-none"
                      ></textarea>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Kirim Button - Premium Design - Full Width */}
                  <button
                    onClick={handleSubmit}
                    className="group relative w-full py-3 sm:py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/50 active:scale-[0.98] overflow-hidden"
                  >
                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                    {/* Button Content */}
                    <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                      <span>Kirim Pesan</span>
                      <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">📨</span>
                    </span>

                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer - Premium Design */}
      <footer className="relative w-full mt-12 sm:mt-16 md:mt-20 overflow-hidden">
        {/* Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/60"></div>

        {/* Animated Gradient Border Top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

        {/* Glow Effect Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 blur-xl"></div>

        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-14 md:py-16">

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">

            {/* Brand Section - Enhanced */}
            <div className="space-y-4 sm:space-y-5">
              {/* Logo & Brand Name */}
              <div className="group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all duration-300">
                      <span className="text-white text-lg sm:text-xl font-bold">TJ</span>
                    </div>
                    {/* Glow Ring */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/40 to-blue-600/40 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      Taji Jadda Giras Sentosa
                    </h3>
                    <p className="text-[10px] sm:text-xs text-white/40 mt-0.5">Web & IoT Developer</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Mengembangkan solusi web dan IoT yang inovatif dan responsif untuk masa depan digital.
              </p>

              {/* Social Media - Enhanced */}
              <div>
                <p className="text-xs font-semibold text-white/80 mb-3">Connect With Me</p>
                <div className="flex items-center gap-2 sm:gap-2.5">
                  {[
                    { href: "https://github.com/girassentosa", icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z", color: "cyan" },
                    { href: "https://instagram.com/tajijaddagiras_", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z", color: "pink" },
                    { href: "https://www.facebook.com/share/1A2FSc1z5H/?mibextid=wwXIfr", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", color: "blue" },
                    { href: "https://tiktok.com/@tajijddagrssntosa", icon: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z", color: "purple" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group/social relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-${social.color}-500/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1`}
                    >
                      <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white/80 group-hover/social:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.icon} />
                      </svg>
                      {/* Glow Effect */}
                      <div className={`absolute -inset-1 bg-gradient-to-br from-${social.color}-500/40 to-${social.color}-600/40 rounded-xl blur-md opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 -z-10`}></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links - Enhanced */}
            <div className="space-y-4 sm:space-y-5">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
                Quick Links
              </h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((link, index) => (
                  <li key={index}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="group flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-cyan-400 transition-all duration-300"
                    >
                      <span className="w-0 h-[2px] bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:w-4 transition-all duration-300 rounded-full"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services - Enhanced */}
            <div className="space-y-4 sm:space-y-5">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
                Services
              </h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {[
                  { icon: '💻', name: 'Web Development' },
                  { icon: '🔌', name: 'IoT Solutions' },
                  { icon: '🎨', name: 'UI/UX Design' },
                  { icon: '⚡', name: 'API Integration' },
                  { icon: '💡', name: 'Consultation' }
                ].map((service, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-white/60 group hover:text-white/80 transition-colors duration-300">
                    <span className="text-sm group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
                    <span>{service.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info - Enhanced */}
            <div className="space-y-4 sm:space-y-5">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
                Contact Info
              </h4>
              <ul className="space-y-3 sm:space-y-3.5">
                <li>
                  <a
                    href="mailto:tajijaddagirassntosa@gmail.com"
                    className="group flex items-start gap-2 text-xs sm:text-sm text-white/60 hover:text-cyan-400 transition-colors duration-300"
                  >
                    <span className="text-sm mt-0.5 group-hover:scale-110 transition-transform duration-300">📧</span>
                    <span className="break-all">tajijaddagirassntosa@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+6281265098103"
                    className="group flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-cyan-400 transition-colors duration-300"
                  >
                    <span className="text-sm group-hover:scale-110 transition-transform duration-300">📱</span>
                    <span>+62 812-6509-8103</span>
                  </a>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-white/60">
                  <span className="text-sm mt-0.5">📍</span>
                  <span>Dendang, Satabat, Kab. Langkat</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Divider - Enhanced */}
          <div className="relative mb-8 sm:mb-10">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm"></div>
          </div>

          {/* Bottom Footer - Enhanced */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">

            {/* Copyright */}
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="text-[10px] sm:text-xs text-white/40">
                © 2025
              </span>
              <span className="text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Taji Jadda Giras Sentosa
              </span>
              <span className="text-[10px] sm:text-xs text-white/40">
                • All rights reserved
              </span>
            </div>

            {/* Policy Links */}
            <div className="flex items-center gap-4 sm:gap-5">
              <a
                href="#"
                className="group relative text-[10px] sm:text-xs text-white/40 hover:text-cyan-400 transition-colors duration-300"
              >
                <span>Privacy Policy</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <span className="text-white/20">•</span>
              <a
                href="#"
                className="group relative text-[10px] sm:text-xs text-white/40 hover:text-cyan-400 transition-colors duration-300"
              >
                <span>Terms of Service</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* CV Download Modal */}
      {showCVModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            setShowCVModal(false);
            setSelectedFormat(null);
          }}
        >
          <div
            className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/10 rounded-xl p-5 sm:p-6 max-w-sm w-full shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowCVModal(false);
                setSelectedFormat(null);
              }}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <span className="text-white text-lg leading-none">×</span>
            </button>

            {/* Modal Header */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-1">
                Unduh CV Saya
              </h3>
              <p className="text-xs text-white/60">
                Pilih format file yang Anda inginkan
              </p>
            </div>

            {/* Download Options */}
            <div className="space-y-2 mb-5">
              {/* PDF Option */}
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-300 ${selectedFormat === 'pdf'
                  ? 'bg-red-500/20 border-red-500/60 shadow-lg shadow-red-500/20'
                  : 'bg-white/5 border-white/10 hover:border-red-500/30'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📕</span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">PDF</p>
                      <p className="text-[10px] text-white/60">Portable Document Format</p>
                    </div>
                  </div>
                  {selectedFormat === 'pdf' && (
                    <span className="text-green-400 text-lg">✓</span>
                  )}
                </div>
              </button>

              {/* Image Option */}
              <button
                onClick={() => setSelectedFormat('image')}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-300 ${selectedFormat === 'image'
                  ? 'bg-blue-500/20 border-blue-500/60 shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 border-white/10 hover:border-blue-500/30'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🖼️</span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">Image (JPG)</p>
                      <p className="text-[10px] text-white/60">JPEG Image Format</p>
                    </div>
                  </div>
                  {selectedFormat === 'image' && (
                    <span className="text-green-400 text-lg">✓</span>
                  )}
                </div>
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadCV}
              disabled={!selectedFormat}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${selectedFormat
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105'
                : 'bg-white/5 text-white/40 cursor-not-allowed'
                }`}
            >
              {selectedFormat ? '📥 Download CV' : 'Pilih Format Terlebih Dahulu'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
