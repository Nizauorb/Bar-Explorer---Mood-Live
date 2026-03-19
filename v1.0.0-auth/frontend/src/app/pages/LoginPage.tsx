import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { Mail, Lock, AlertCircle, X } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('demo-token-123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      
      if (isLogin) {
        // Connexion
        response = await authService.login(email, password);
      } else {
        // Inscription
        response = await authService.register(email, password, pseudo);
      }

      if (response.success) {
        setUser(response.user!);
        navigate('/profile');
      } else {
        setError(response.error || 'Une erreur est survenue');
      }
    } catch (err: any) {
      console.error('Erreur auth:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulation de l'envoi d'email de réinitialisation
      setResetSuccess(true);
    } catch (err: any) {
      console.error('Erreur reset password:', err);
      setError('Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #8A7CF5 0%, #65498D 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-white mb-2" style={{ fontSize: '48px', fontWeight: 700 }}>
            Bar Explorer
          </h1>
          <p className="text-white/90" style={{ fontSize: '24px', fontWeight: 600 }}>
            Mood Live
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex gap-2 p-1 bg-[#E8EBF5] rounded-lg">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  isLogin
                    ? 'bg-[#8A7CF5] text-white shadow-md'
                    : 'text-[#717182]'
                }`}
                style={{ fontWeight: 600 }}
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  !isLogin
                    ? 'bg-[#8A7CF5] text-white shadow-md'
                    : 'text-[#717182]'
                }`}
                style={{ fontWeight: 600 }}
              >
                Inscription
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[#1A1B2E] mb-2" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Pseudo
                </label>
                <input
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#E8EBF5] focus:border-[#8A7CF5] focus:outline-none transition-colors"
                  placeholder="Votre pseudo"
                  required={!isLogin}
                  minLength={3}
                />
              </div>
            )}

            <div>
              <label className="block text-[#1A1B2E] mb-2" style={{ fontSize: '16px', fontWeight: 600 }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-[#E8EBF5] focus:border-[#8A7CF5] focus:outline-none transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#1A1B2E] mb-2" style={{ fontSize: '16px', fontWeight: 600 }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-[#E8EBF5] focus:border-[#8A7CF5] focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-[#717182] mt-1">Minimum 6 caractères</p>
              )}
            </div>

            {isLogin && (
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[#8A7CF5] hover:underline" 
                  style={{ fontSize: '14px' }}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8A7CF5] hover:bg-[#7B6BE5] disabled:bg-[#B5AEF5] text-white py-3 rounded-lg transition-colors shadow-lg"
              style={{ fontWeight: 600 }}
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
            </button>
          </form>
        </div>

        <p className="text-center text-white/80 mt-6" style={{ fontSize: '12px' }}>
          En vous connectant, vous acceptez nos conditions d'utilisation
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#1A1B2E]" style={{ fontSize: '24px', fontWeight: 700 }}>
                Mot de passe oublié
              </h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSuccess(false);
                  setResetEmail('');
                  setError('');
                }}
                className="text-[#717182] hover:text-[#1A1B2E]"
              >
                <X size={24} />
              </button>
            </div>

            {!resetSuccess ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <p className="text-[#717182]" style={{ fontSize: '14px' }}>
                  Entrez votre adresse email pour recevoir un lien de réinitialisation
                </p>

                <div>
                  <label className="block text-[#1A1B2E] mb-2" style={{ fontSize: '16px', fontWeight: 600 }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]" size={20} />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-[#E8EBF5] focus:border-[#8A7CF5] focus:outline-none transition-colors"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8A7CF5] hover:bg-[#7B6BE5] disabled:bg-[#B5AEF5] text-white py-3 rounded-lg transition-colors shadow-lg"
                  style={{ fontWeight: 600 }}
                >
                  {loading ? 'Envoi...' : 'Envoyer le lien'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-[#1A1B2E]" style={{ fontSize: '20px', fontWeight: 600 }}>
                  Email envoyé !
                </h3>
                <p className="text-[#717182]" style={{ fontSize: '14px' }}>
                  Un lien de réinitialisation a été envoyé à <strong>{resetEmail}</strong>
                </p>
                <div className="p-4 bg-[#E8EBF5] rounded-lg text-left">
                  <p className="text-xs text-[#717182] mb-2">Pour cette démo, utilisez ce lien :</p>
                  <button
                    onClick={() => {
                      navigate(`/reset-password?token=${resetToken}`);
                    }}
                    className="text-[#8A7CF5] hover:underline text-sm break-all"
                  >
                    Réinitialiser mon mot de passe
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSuccess(false);
                    setResetEmail('');
                  }}
                  className="text-[#8A7CF5] hover:underline"
                  style={{ fontSize: '14px' }}
                >
                  Retour à la connexion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}