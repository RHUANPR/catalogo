

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Dog, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login } = useAppContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
        setError("Por favor, preencha a senha.");
        return;
    }

    setLoading(true);
    try {
      await login(password);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
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
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors disabled:bg-primary/70 disabled:cursor-not-allowed flex justify-center items-center">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};