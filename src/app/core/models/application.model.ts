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
  userId?: number;
  company?: Company;
  companyId?: number;
  companyName?: string;
  jobTitle: string;
  jobLocation?: string;
  jobUrl?: string;
  status: ApplicationStatus;
  dateApplied?: string;
  lastUpdated?: string;
  coverLetterPath?: string;
  resumeSnapshotPath?: string;
  referralName?: string;
  referralContact?: string;
  sourceChannel?: string;
  sourceUrl?: string;
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
