'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Введіть email та пароль.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ login: email, password: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Помилка входу.');
        return;
      }
      router.push('/admin/main');
    } catch (err) {
      setError('Не вдалось підключитись до сервера.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginBackground">
      <div className="text-6xl text-center mb-6 color black">LYNE</div>
      <div className="w-full max-w-2xl px-10">

        <h1 className="text-3xl text-center mb-8 tracking-widest font-light">
          Login Page for Admin
        </h1>

        {/* Помилка */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/80 px-4 py-3 text-base outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/80 px-4 py-3 text-base outline-none"
          />
        </div>

        {/* Forgot password */}
        <p className="text-sm mb-4 cursor-pointer hover:underline">
          Forgot a password?
        </p>

        {/* Remember me */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="w-5 h-5"
          />
          <label htmlFor="remember" className="text-sm">Remember me</label>
        </div>

        {/* Кнопка */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-zinc-800 text-white py-4 text-lg tracking-widest hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Завантаження...' : 'Log in'}
        </button>

      </div>
    </div>
  );
}