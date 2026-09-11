export type ConferenceDay = 1 | 2;

export type TrackId = 'Track A' | 'Track B' | 'Track C';

export interface Speaker {
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  bio: string;
}

export interface Session {
  id: string;
  day: ConferenceDay;
  timeSlotId: string;
  time: string;
  startTime: string;
  endTime: string;
  track: TrackId;
  trackLabel: string;
  title: string;
  speaker: Speaker;
  room: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  tags: string[];
  summary: string;
  description: string;
  keyTakeaways: string[];
  isKeynote?: boolean;
  isBreak?: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  startTime: string;
  endTime: string;
  label: string;
  isGlobal?: boolean;
  globalSessionId?: string;
}

export interface TrackMeta {
  id: TrackId;
  name: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBorder: string;
  headerBg: string;
  accentColor: string;
}

export interface ScheduleFilterState {
  searchQuery: string;
  selectedTrack: TrackId | 'all';
  bookmarkedOnly: boolean;
  selectedLevel: string | 'all';
}

export interface GitHubRepoOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  forks_count?: number;
  open_issues_count?: number;
  updated_at?: string;
  owner: GitHubRepoOwner;
  topics?: string[];
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}
