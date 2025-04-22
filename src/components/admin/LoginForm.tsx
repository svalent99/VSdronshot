
import React from 'react';
import { toast } from "sonner";
import { motion } from "framer-motion";

interface LoginFormProps {
  onLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'valen.sotelo.123@gmail.com' && password === 'svolando9') {
      onLogin();
      toast.success('Inicio de sesión exitoso');
    } else {
      toast.error('Credenciales incorrectas. Por favor, intenta de nuevo.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-16 p-8 bg-zinc-800 rounded-lg border border-zinc-700"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
            placeholder="ejemplo@correo.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 rounded font-semibold transition"
        >
          Iniciar Sesión
        </button>
      </form>
    </motion.div>
  );
};
