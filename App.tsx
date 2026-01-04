
import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, GraduationCap, LayoutDashboard, MessageSquare } from 'lucide-react';
import StudentChat from './components/StudentChat';
import AdminDashboard from './components/AdminDashboard';
import { Role, Conversation } from './types';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('student');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Load conversations from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('eduassist_conversations');
    if (saved) {
      setConversations(JSON.parse(saved));
    }
  }, []);

  // Save conversations whenever they change
  useEffect(() => {
    localStorage.setItem('eduassist_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const updateConversations = (updated: Conversation[]) => {
    setConversations(updated);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-indigo-900 text-white flex flex-col shrink-0 shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-indigo-800">
          <GraduationCap size={32} className="text-indigo-300" />
          <h1 className="text-xl font-bold tracking-tight">EduAssist AI</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setRole('student')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${role === 'student' ? 'bg-indigo-700 shadow-inner' : 'hover:bg-indigo-800/50'}`}
          >
            <MessageSquare size={20} />
            <span className="font-medium">Student Helpdesk</span>
          </button>
          
          <button 
            onClick={() => setRole('admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${role === 'admin' ? 'bg-indigo-700 shadow-inner' : 'hover:bg-indigo-800/50'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Admin Dashboard</span>
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-indigo-800">
          <div className="flex items-center gap-3 px-4 py-2 text-indigo-300">
            {role === 'student' ? <User size={18} /> : <ShieldCheck size={18} />}
            <span className="text-sm font-semibold uppercase tracking-wider">{role} View</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {role === 'student' ? (
          <StudentChat 
            conversations={conversations} 
            setConversations={updateConversations} 
          />
        ) : (
          <AdminDashboard 
            conversations={conversations} 
            setConversations={updateConversations} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
