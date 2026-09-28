import { Company } from "./company.model";

export type ApplicationStatus = 
  | 'WISHLIST' 
  | 'APPLIED' 
  | 'INTERVIEWING' 
  | 'OFFER' 
  | 'REJECTED' 
  | 'WITHDRAWN';

export interface JobApplication {
  id?: number;
  user_id?: number;
  userId?: number;
  company?: Company;
  company_id?: number;
  companyId?: number;
  company_name?: string;
  companyName?: string;
  job_title: string;
  jobTitle?: string;
  job_location?: string;
  jobLocation?: string;
  job_url?: string;
  jobUrl?: string;
  status: ApplicationStatus;
  date_applied?: string;
  dateApplied?: string;
  last_updated?: string;
  lastUpdated?: string;
  cover_letter_path?: string | null;
  coverLetterPath?: string | null;
  resume_snapshot_path?: string | null;
  resumeSnapshotPath?: string | null;
  referral_name?: string;
  referralName?: string;
  referral_contact?: string;
  referralContact?: string;
  source_channel?: string;
  sourceChannel?: string;
  source_url?: string;
  sourceUrl?: string;
  job_description?: string;
  jobDescription?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first?: boolean;
  last?: boolean;
}
