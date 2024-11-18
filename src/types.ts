export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  level: 'Junior' | 'Mid-Level' | 'Senior';
  description: string;
  requirements: string[];
  postedAt: string;
  companyLogo: string;
  contactEmail: string;
}

export type JobFilter = {
  type: string[];
  level: string[];
  search: string;
}

export interface JobApplication {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: File;
}