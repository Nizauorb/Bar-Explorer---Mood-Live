import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { authService } from '../services/authService';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Lien de réinitialisation invalide');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!token) {
      setError('Lien de réinitialisation invalide');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.resetPassword(token, newPassword);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(result.error || 'Erreur lors de la réinitialisation');
      }
    } catch (err) {
      setError('Une erreur est survenue');
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

        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-[#1A1B2E] mb-6" style={{ fontSize: '24px', fontWeight: 700 }}>
            Nouveau mot de passe
          </h2>

          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <h3 className="text-[#1A1B2E]" style={{ fontSize: '20px', fontWeight: 600 }}>
                Mot de passe réinitialisé !
              </h3>
              <p className="text-[#717182]" style={{ fontSize: '14px' }}>
                Votre mot de passe a été modifié avec succès.<br />
                Redirection vers la page de connexion...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <p className="text-[#717182]" style={{ fontSize: '14px' }}>
                Choisissez un nouveau mot de passe sécurisé
              </p>

              <div>
                <label className="block text-[#1A1B2E] mb-2" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]" size={20} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-[#E8EBF5] focus:border-[#8A7CF5] focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-[#717182] mt-1">Minimum 6 caractères</p>
              </div>

              <div>
                <label className="block text-[#1A1B2E] mb-2" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-[#E8EBF5] focus:border-[#8A7CF5] focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-[#8A7CF5] hover:bg-[#7B6BE5] disabled:bg-[#B5AEF5] text-white py-3 rounded-lg transition-colors shadow-lg"
                style={{ fontWeight: 600 }}
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full text-[#8A7CF5] hover:underline"
                style={{ fontSize: '14px' }}
              >
                Retour à la connexion
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
