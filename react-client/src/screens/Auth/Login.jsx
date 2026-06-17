import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-warm-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[342px]">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-forest-green rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-3xl">🌿</span>
          </div>
          <h1 className="text-2xl font-bold text-forest-green">DishQuest</h1>
          <p className="text-sm text-gray-400 mt-1">Your meal planning companion</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-card p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Sign in</h2>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={set('username')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-forest-green transition-colors"
              placeholder="Your username"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-forest-green transition-colors"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? <Spinner /> : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-5">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-forest-green font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
