import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await authApi.register(email, password);
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="glass-card p-8 w-full max-w-md shadow-xl border-none">
                <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Register</h2>
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-600">Email</label>
                        <input
                            type="email"
                            className="input-field w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-600">Password</label>
                        <input
                            type="password"
                            className="input-field w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4 h-11">Register</button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
