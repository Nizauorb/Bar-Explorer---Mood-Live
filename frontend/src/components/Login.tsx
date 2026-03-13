import { useState } from 'react';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('demo@barexplorer.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.data.token);
        onLogin(data.data.token);
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-4 z-[9999] relative">
      <div className="be-card max-w-md w-full relative">
        <div className="text-center mb-6">
          <h1 className="be-heading-1 text-xl md:text-2xl mb-2">Bar Explorer</h1>
          <p className="be-caption text-text-muted text-sm">Connectez-vous pour voter</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="be-card bg-error-bg text-error-text p-3">
              <p className="be-body text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="be-caption block mb-2 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="be-input w-full"
              required
            />
          </div>

          <div>
            <label className="be-caption block mb-2 text-sm">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="be-input w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="be-btn be-btn-primary w-full disabled:opacity-50 py-3 text-sm md:text-base"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 p-3 be-card bg-surface-muted">
          <p className="be-caption text-text-muted text-center text-xs">
            💡 Demo : Utilisez demo@barexplorer.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
