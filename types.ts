
export type Role = 'student' | 'admin';

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  messages: Message[];
  status: 'active' | 'escalated' | 'resolved';
  lastUpdated: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  schedule: string;
}
