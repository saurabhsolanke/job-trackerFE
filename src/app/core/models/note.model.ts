export interface ApplicationNote {
  id?: number;
  applicationId: number;
  userId?: number;
  noteType: string;
  content: string;
  contactPerson?: string;
  scheduledDate?: string;
  createdAt?: string;
}
