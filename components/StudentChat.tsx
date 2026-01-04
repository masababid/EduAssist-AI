
import React, { useState, useRef, useEffect } from 'react';
// Added missing MessageSquare and GraduationCap icons to imports from lucide-react
import { Send, AlertCircle, Bot, User, ArrowLeft, MoreHorizontal, Phone, Video, MessageSquare, GraduationCap } from 'lucide-react';
import { Conversation, Message } from '../types';
import { gemini } from '../geminiService';

interface Props {
  conversations: Conversation[];
  setConversations: (updated: Conversation[]) => void;
}

const StudentChat: React.FC<Props> = ({ conversations, setConversations }) => {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConv?.messages, isTyping]);

  const startNewChat = () => {
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      studentName: 'Guest Student',
      studentEmail: 'student@university.edu',
      subject: 'New Inquiry',
      messages: [
        {
          id: 'welcome',
          role: 'model',
          content: 'Hello! I am EduAssist, your university helpdesk bot. How can I help you today?',
          timestamp: Date.now()
        }
      ],
      status: 'active',
      lastUpdated: Date.now()
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
  };

  const handleSend = async () => {
    if (!inputText.trim() || !activeConvId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: Date.now()
    };

    const updatedConv = conversations.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          messages: [...c.messages, userMessage],
          lastUpdated: Date.now()
        };
      }
      return c;
    });

    setConversations(updatedConv);
    setInputText('');
    setIsTyping(true);

    // Call Gemini
    const aiResponse = await gemini.sendMessage(inputText);
    
    setIsTyping(false);
    const modelMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: aiResponse,
      timestamp: Date.now()
    };

    setConversations(conversations.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          messages: [...c.messages, userMessage, modelMessage],
          lastUpdated: Date.now()
        };
      }
      return c;
    }));
  };

  const escalate = () => {
    if (!activeConvId) return;
    const updated = conversations.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          status: 'escalated' as const,
          messages: [
            ...c.messages,
            {
              id: 'escalate-msg',
              role: 'system',
              content: 'Your query has been escalated to a human administrator. They will review this conversation and reach out via email shortly.',
              timestamp: Date.now()
            }
          ]
        };
      }
      return c;
    });
    setConversations(updated);
  };

  if (!activeConvId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <Bot size={48} className="text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to EduAssist</h2>
        <p className="text-slate-500 max-w-md mb-8">
          Need help with courses, registration, or campus life? Our AI helpdesk is here to support you 24/7.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <button 
            onClick={startNewChat}
            className="flex flex-col items-center p-6 bg-white border-2 border-transparent hover:border-indigo-500 rounded-xl shadow-sm transition-all group"
          >
            <MessageSquare size={32} className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-slate-800">Start a Chat</span>
            <span className="text-xs text-slate-500">Instant AI support</span>
          </button>
          
          <div className="flex flex-col items-center p-6 bg-white border-2 border-slate-100 rounded-xl shadow-sm">
            <GraduationCap size={32} className="text-indigo-600 mb-3" />
            <span className="font-semibold text-slate-800">Browse Catalog</span>
            <span className="text-xs text-slate-500">Coming soon</span>
          </div>
        </div>

        {conversations.length > 0 && (
          <div className="mt-12 w-full max-w-2xl">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider text-left">Recent Conversations</h3>
            <div className="space-y-3">
              {conversations.slice(0, 3).map(conv => (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveConvId(conv.id)}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                      <MessageSquare size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{conv.subject}</p>
                      <p className="text-xs text-slate-500">{new Date(conv.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    conv.status === 'escalated' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {conv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header (WhatsApp/Messenger Style) */}
      <header className="px-4 py-3 border-b flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveConvId(null)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              EA
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-none">EduAssist Bot</h3>
            <p className="text-xs text-green-500 font-medium mt-1">Online & ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Phone size={20} /></button>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Video size={20} /></button>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><MoreHorizontal size={20} /></button>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
      >
        {activeConv.messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : msg.role === 'system'
                  ? 'bg-amber-50 border border-amber-200 text-amber-800 italic text-center text-sm w-full mx-auto rounded-lg'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }`}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-[10px] uppercase tracking-wider">
                  <Bot size={12} />
                  EduAssist
                </div>
              )}
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-[10px] mt-2 opacity-60 text-right`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Input */}
      <footer className="p-4 bg-white border-t border-slate-100">
        {activeConv.status === 'active' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-100 rounded-full px-4 py-3 flex items-center focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about courses, enrollment, or campus..."
                  className="bg-transparent border-none focus:outline-none flex-1 text-slate-800 text-[15px]"
                />
              </div>
              <button 
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={escalate}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors border border-transparent hover:border-indigo-100"
              >
                <AlertCircle size={14} />
                Need a human? Escalate Query
              </button>
            </div>
          </div>
        )}
        
        {activeConv.status === 'escalated' && (
          <div className="text-center p-2 bg-amber-50 rounded-lg text-amber-700 text-sm font-medium">
            This conversation is being reviewed by an administrator.
          </div>
        )}
      </footer>
    </div>
  );
};

export default StudentChat;
