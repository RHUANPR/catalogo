
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ADMIN_PASSWORD } from '../../constants';
import { Dog, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Senha incorreta.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
            <div className="p-3 bg-primary rounded-full text-white mb-4">
                <Dog size={40} />
            </div>
            <h1 className="text-2xl font-bold text-center text-secondary">Painel Administrativo</h1>
            <p className="text-slate-500">PetShop Alegria</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button type="submit" className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors">
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};