
import { Course } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'CS101',
    name: 'Introduction to Computer Science',
    description: 'Basics of programming using Python and algorithms.',
    instructor: 'Dr. Alan Turing',
    schedule: 'Mon/Wed 10:00 AM - 11:30 AM'
  },
  {
    id: 'MATH202',
    name: 'Calculus II',
    description: 'Integration, sequences, and series.',
    instructor: 'Prof. Isaac Newton',
    schedule: 'Tue/Thu 1:00 PM - 2:30 PM'
  },
  {
    id: 'ENG305',
    name: 'Advanced Creative Writing',
    description: 'Developing voice and style in fiction and poetry.',
    instructor: 'Ms. Maya Angelou',
    schedule: 'Fridays 9:00 AM - 12:00 PM'
  },
  {
    id: 'BIO101',
    name: 'General Biology',
    description: 'Study of life from cellular levels to ecosystems.',
    instructor: 'Dr. Charles Darwin',
    schedule: 'Mon/Wed/Fri 2:00 PM - 3:00 PM'
  }
];

export const SYSTEM_INSTRUCTION = `
You are "EduAssist", a friendly, polite, and professional Student Helpdesk Bot. 
Your goal is to help students with course-related queries, enrollment info, and campus resources.

Knowledge Base:
- Courses Available: ${MOCK_COURSES.map(c => `${c.id}: ${c.name} by ${c.instructor}`).join(', ')}.
- Office Hours: General hours are 9 AM to 5 PM, Mon-Fri.
- Registration Deadline: Spring Semester registration ends Feb 15th.
- Financial Aid: Direct students to the "Financial Aid Portal" or the office in Building B.

Guidelines:
1. Always be natural and helpful.
2. If a student mentions a specific course from the list, provide relevant details.
3. If a student is frustrated or the query is too complex (e.g., grading disputes, specific medical leave), suggest they use the "Escalate to Human" button.
4. Keep answers concise but thorough.
5. Do not make up facts about courses not in the list. Refer them to the official catalog.
`;
