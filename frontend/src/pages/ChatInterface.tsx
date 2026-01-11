import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chatApi } from '../services/api';
import { Send, Bot, ChevronLeft, Loader2 } from 'lucide-react';

export default function ChatInterface() {
    const { chatbotId } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadHistory();
    }, [chatbotId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadHistory = async () => {
        if (!chatbotId) return;
        try {
            const res = await chatApi.getHistory(chatbotId);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = { message: input, response: '', role: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            if (!chatbotId) throw new Error("Chatbot ID is missing");
            const res = await chatApi.sendMessage(chatbotId, userMsg.message);
            setMessages(prev => {
                const last = [...prev];
                last[last.length - 1].response = res.data.response;
                return last;
            });
        } catch (err) {
            alert('Failed to get response');
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white font-sans">
            <header className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-slate-500 hover:text-slate-900"><ChevronLeft /></Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white shadow-sm"><Bot size={18} /></div>
                        <h2 className="font-semibold text-lg text-slate-800">Chatbot Assistant</h2>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto w-full">
                {messages.map((msg, idx) => (
                    <div key={idx} className="space-y-4">
                        {/* User Message */}
                        <div className="flex justify-end">
                            <div className="bg-indigo-600 text-white p-3 px-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-md shadow-indigo-100">
                                {msg.message}
                            </div>
                        </div>
                        {/* AI Response */}
                        {msg.response && (
                            <div className="flex justify-start items-start gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center flex-shrink-0 text-indigo-600 border border-slate-200">
                                    <Bot size={18} />
                                </div>
                                <div className="bg-slate-100 p-4 px-5 rounded-2xl rounded-tl-none max-w-[80%] text-slate-800 border border-slate-200 leading-relaxed shadow-sm">
                                    {msg.response}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center flex-shrink-0 text-indigo-600 border border-slate-200">
                            <Bot size={18} />
                        </div>
                        <div className="bg-slate-100 p-4 px-5 rounded-2xl rounded-tl-none text-slate-500 border border-slate-200 flex items-center gap-2 shadow-sm italic">
                            Assistant is thinking <Loader2 size={16} className="animate-spin" />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <div className="bg-white p-4 border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
                    <input
                        type="text"
                        className="input-field flex-1"
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" disabled={isTyping} className="btn-primary flex items-center gap-2 shadow-indigo-100">
                        <Send size={18} /> Send
                    </button>
                </form>
            </div>
        </div>
    );
}
