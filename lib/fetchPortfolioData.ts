import { supabase } from './supabase';
import type {
  HomeContent,
  HomeStat,
  ProfileCard,
  AboutContent,
  PersonalInfo,
  Skill,
  Project,
} from '@/types/database';

// Fetch Home Content
export async function fetchHomeContent(): Promise<HomeContent | null> {
  try {
    const { data, error } = await supabase.from('home_content').select('*').single();

    if (error) {
      console.error('Error fetching home content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Fetch Home Stats
export async function fetchHomeStats(): Promise<HomeStat[]> {
  try {
    const { data, error } = await supabase.from('home_stats').select('*').order('display_order');

    if (error) {
      console.error('Error fetching home stats:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Fetch Profile Card
export async function fetchProfileCard(): Promise<ProfileCard | null> {
  try {
    const { data, error } = await supabase.from('profile_card').select('*').single();

    if (error) {
      console.error('Error fetching profile card:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Fetch About Content
export async function fetchAboutContent(): Promise<AboutContent | null> {
  try {
    const { data, error } = await supabase.from('about_content').select('*').single();

    if (error) {
      console.error('Error fetching about content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Fetch Personal Info
export async function fetchPersonalInfo(): Promise<PersonalInfo[]> {
  try {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error fetching personal info:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Fetch Active Skills
export async function fetchSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching skills:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Fetch Active Projects
export async function fetchProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Fetch All Portfolio Data (untuk SSR/Initial Load)
export async function fetchAllPortfolioData() {
  const [homeContent, homeStats, profileCard, aboutContent, personalInfo, skills, projects] =
    await Promise.all([
      fetchHomeContent(),
      fetchHomeStats(),
      fetchProfileCard(),
      fetchAboutContent(),
      fetchPersonalInfo(),
      fetchSkills(),
      fetchProjects(),
    ]);

  return {
    homeContent,
    homeStats,
    profileCard,
    aboutContent,
    personalInfo,
    skills,
    projects,
  };
}

