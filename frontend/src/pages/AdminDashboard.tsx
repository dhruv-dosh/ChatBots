import React, { useState, useEffect } from 'react';
import { documentApi, chatbotApi } from '../services/api';
import { Upload, Plus, FileText, Bot, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [chatbots, setChatbots] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [botName, setBotName] = useState('');
    const [selectedDoc, setSelectedDoc] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [docsRes, botsRes] = await Promise.all([
                documentApi.list(),
                chatbotApi.list()
            ]);
            setDocuments(docsRes.data);
            setChatbots(botsRes.data);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setIsUploading(true);
        try {
            await documentApi.upload(e.target.files[0]);
            loadData();
        } catch (err) {
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCreateBot = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Attempting to create bot:', { botName, selectedDoc });
        if (!selectedDoc || !botName) {
            alert('Please provide a name and select a document');
            return;
        }
        try {
            await chatbotApi.create({ name: botName, document_id: selectedDoc });
            setBotName('');
            setSelectedDoc('');
            loadData();
            alert('Chatbot created!');
        } catch (err: any) {
            console.error('Bot creation error:', err);
            alert(`Failed to create chatbot: ${err.response?.data?.error || err.message}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-bold font-display text-slate-900">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <a href="/" className="btn-primary bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 shadow-none">User View</a>
                    <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="text-slate-500 hover:text-slate-900 font-medium">Logout</button>
                </div>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Document section */}
                <section className="glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800"><FileText size={20} /> Documents</h2>
                        <label className="cursor-pointer btn-primary flex items-center gap-2">
                            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                            Upload PDF
                            <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.txt" disabled={isUploading} />
                        </label>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {documents.length === 0 && <p className="text-slate-400 text-center py-8">No documents uploaded yet.</p>}
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-slate-50/50 p-4 rounded-lg flex items-center justify-between border border-slate-100 hover:border-indigo-300 transition-colors">
                                <span className="truncate flex-1 mr-4 text-slate-700 font-medium">{doc.name}</span>
                                <span className="text-xs text-slate-400">{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Chatbot Creation */}
                <section className="glass-card p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800"><Bot size={20} /> Create Chatbot</h2>
                    <form onSubmit={handleCreateBot} className="space-y-4 mb-10">
                        <div>
                            <label className="block text-sm text-slate-500 mb-1 font-medium">Chatbot Name</label>
                            <input
                                type="text"
                                className="input-field w-full"
                                placeholder="Support Bot"
                                value={botName}
                                onChange={(e) => setBotName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1 font-medium">Source Document</label>
                            <select
                                className="input-field w-full"
                                value={selectedDoc}
                                onChange={(e) => setSelectedDoc(e.target.value)}
                                required
                            >
                                <option value="">Select Document</option>
                                {documents.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                            <Plus size={18} /> Create Bot
                        </button>
                    </form>

                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 border-t border-slate-100 pt-6 text-slate-800"><Bot size={18} /> Existing Chatbots</h3>
                    <div className="space-y-2">
                        {chatbots.length === 0 && <p className="text-slate-400 text-sm">No chatbots created yet.</p>}
                        {chatbots.map(bot => (
                            <div key={bot.id} className="bg-indigo-50/50 p-3 rounded-lg flex items-center justify-between border border-indigo-100">
                                <span className="text-sm font-medium text-slate-700">{bot.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {bot.id}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
