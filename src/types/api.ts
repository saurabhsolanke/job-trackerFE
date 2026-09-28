// Application Status Enum
export type ApplicationStatus =
  | 'WISHLIST'
  | 'APPLIED'
  | 'INTERVIEWING'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

// Authentication DTOs
export interface AuthResponse {
  token: string;
  tokenType: 'Bearer';
  userId: number;
  email: string;
  fullName: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Company DTOs
export interface CompanyResponse {
  id: number;
  name: string;
  websiteUrl?: string;
  careerPageUrl?: string;
  notes?: string;
}

export interface CompanyRequest {
  name: string;
  websiteUrl?: string;
  careerPageUrl?: string;
  notes?: string;
}

// Job Application DTOs
export interface JobApplicationResponse {
  id: number;
  company: CompanyResponse;
  jobTitle: string;
  jobLocation?: string;
  jobUrl?: string;
  status: ApplicationStatus;
  dateApplied?: string; // ISO Date string "YYYY-MM-DD"
  lastUpdated: string;  // ISO DateTime string
  coverLetterPath?: string;
  resumeSnapshotPath?: string;
  referralName?: string;
  referralContact?: string;
  sourceChannel?: string;
  sourceUrl?: string;
  jobDescription?: string;
}

export interface JobApplicationRequest {
  companyId: number;
  jobTitle: string;
  jobLocation?: string;
  jobUrl?: string;
  status: ApplicationStatus;
  dateApplied?: string; // "YYYY-MM-DD"
  coverLetterPath?: string;
  resumeSnapshotPath?: string;
  referralName?: string;
  referralContact?: string;
  sourceChannel?: string;
  sourceUrl?: string;
  jobDescription?: string;
}

// Application Note DTOs
export interface ApplicationNoteResponse {
  id: number;
  applicationId: number;
  noteType?: string;
  content: string;
  contactPerson?: string;
  scheduledDate?: string; // ISO DateTime string
  createdAt: string;     // ISO DateTime string
}

export interface ApplicationNoteRequest {
  noteType?: string;
  content: string;
  contactPerson?: string;
  scheduledDate?: string; // ISO DateTime string
}

// Spring Data Page Response Wrapper
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page index (0-based)
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Standard API Error Response
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
