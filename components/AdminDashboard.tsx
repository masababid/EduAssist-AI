
import React, { useState } from 'react';
import { Search, Filter, Mail, Trash2, CheckCircle, ExternalLink, MessageSquare, Clock, User } from 'lucide-react';
import { Conversation } from '../types';

interface Props {
  conversations: Conversation[];
  setConversations: (updated: Conversation[]) => void;
}

const AdminDashboard: React.FC<Props> = ({ conversations, setConversations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'escalated' | 'resolved'>('all');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  const filtered = conversations.filter(c => {
    const matchesSearch = 
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.messages.some(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || c.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const selectedConv = conversations.find(c => c.id === selectedConvId);

  const deleteConversation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this conversation record?')) {
      setConversations(conversations.filter(c => c.id !== id));
      if (selectedConvId === id) setSelectedConvId(null);
    }
  };

  const resolveConversation = (id: string) => {
    setConversations(conversations.map(c => 
      c.id === id ? { ...c, status: 'resolved' as const } : c
    ));
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left List */}
      <div className="w-full md:w-[400px] border-r flex flex-col bg-white">
        <div className="p-6 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Student Inquiries</h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
              {conversations.length} Total
            </span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'escalated', 'resolved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 text-xs font-bold py-2 rounded-md uppercase tracking-wider transition-all ${
                  filter === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((conv) => (
              <div 
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`p-4 border-b cursor-pointer transition-all hover:bg-slate-50 relative ${
                  selectedConvId === conv.id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate pr-4">{conv.subject}</h4>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    conv.status === 'escalated' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {conv.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <User size={12} />
                  <span>{conv.studentName}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>{new Date(conv.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={10} />
                    <span>{conv.messages.length} messages</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-slate-400 text-sm italic">No records found matching criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Detail */}
      <div className="hidden md:flex flex-1 flex-col bg-slate-50 overflow-hidden">
        {selectedConv ? (
          <>
            <div className="p-6 bg-white border-b flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{selectedConv.studentName}</h2>
                  <p className="text-sm text-indigo-600 flex items-center gap-1">
                    <Mail size={14} /> {selectedConv.studentEmail}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {selectedConv.status !== 'resolved' && (
                  <button 
                    onClick={() => resolveConversation(selectedConv.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 shadow-sm transition-all"
                  >
                    <CheckCircle size={16} /> Mark Resolved
                  </button>
                )}
                <button 
                  onClick={() => deleteConversation(selectedConv.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all"
                >
                  <Trash2 size={16} /> Delete Record
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider">Conversation Transcript</h3>
                  <div className="space-y-4">
                    {selectedConv.messages.map((msg, idx) => (
                      <div key={idx} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {msg.role === 'user' ? 'ST' : 'AI'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              {msg.role === 'user' ? 'Student' : msg.role === 'model' ? 'Helpdesk Bot' : 'System Notification'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(msg.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className={`text-sm leading-relaxed ${msg.role === 'system' ? 'italic text-amber-600' : 'text-slate-700'}`}>
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <ExternalLink size={16} className="text-indigo-600" /> Meta Data
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li><span className="font-medium text-slate-700">Origin:</span> Web Messenger</li>
                      <li><span className="font-medium text-slate-700">Device:</span> Chrome / MacOS</li>
                      <li><span className="font-medium text-slate-700">IP Address:</span> 192.168.1.45 (Simulated)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Clock size={16} className="text-indigo-600" /> Academic Context
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li><span className="font-medium text-slate-700">GPA:</span> 3.8 / 4.0</li>
                      <li><span className="font-medium text-slate-700">Year:</span> Sophomore</li>
                      <li><span className="font-medium text-slate-700">Major:</span> Computer Science</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-600">Select an inquiry</h3>
            <p className="max-w-xs text-sm">Choose a student conversation from the left to view the full history and take action.</p>
          </div>
        )}
      </div>

      {/* Mobile Detail Modal Overlay (Simplified) */}
      {selectedConvId && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <button onClick={() => setSelectedConvId(null)} className="p-2 -ml-2 text-indigo-600 font-bold">Back</button>
            <h2 className="font-bold truncate px-4">{selectedConv?.subject}</h2>
            <div></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {/* Same Transcript View as Desktop... omitted for brevity or could be shared component */}
            <div className="space-y-4">
              {selectedConv?.messages.map((m, i) => (
                <div key={i} className="mb-4">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{m.role}</p>
                  <p className="text-sm bg-slate-100 p-3 rounded-lg">{m.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
