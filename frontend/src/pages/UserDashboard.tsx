import { useState, useEffect } from 'react';
import { chatbotApi } from '../services/api';
import { Link } from 'react-router-dom';
import { Bot, MessageSquare, Settings } from 'lucide-react';

export default function UserDashboard() {
    const [chatbots, setChatbots] = useState<any[]>([]);

    useEffect(() => {
        loadChatbots();
    }, []);

    const loadChatbots = async () => {
        try {
            const res = await chatbotApi.list();
            setChatbots(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-bold font-display text-slate-900">Your Chatbots</h1>
                <div className="flex gap-4">
                    <Link to="/admin" className="btn-primary bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center gap-2 shadow-none hover:bg-indigo-100">
                        <Settings size={18} /> Admin
                    </Link>
                    <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="text-slate-500 hover:text-slate-900 font-medium">Logout</button>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                {chatbots.length === 0 && (
                    <div className="col-span-full text-center py-20 glass-card">
                        <Bot size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500">No chatbots available. Head to Admin to create one!</p>
                    </div>
                )}
                {chatbots.map((bot) => (
                    <Link key={bot.id} to={`/chat/${bot.id}`} className="glass-card p-6 border-none hover:translate-y-[-4px] transition-all group">
                        <div className="w-12 h-12 bg-indigo-600/10 rounded-lg flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
                            <Bot size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-slate-900">{bot.name}</h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{bot.description || 'No description provided.'}</p>
                        <div className="flex items-center text-indigo-600 text-sm font-semibold">
                            Start Chatting <MessageSquare size={16} className="ml-2" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
