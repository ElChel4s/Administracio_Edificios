import { useState } from 'react';
import { Building2, ArrowLeft, Key, Eye, EyeOff, CheckCircle, Send } from 'lucide-react';

interface ResetPasswordFormProps {
  email: string;
  onBack: () => void;
  onPasswordReset: () => void;
  onResendCode?: () => Promise<void>;
}

export const ResetPasswordForm = ({ email, onBack, onPasswordReset, onResendCode }: ResetPasswordFormProps) => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud mínima de contraseña
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Validar código completo
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          codigo: code,
          nueva_password: newPassword,
          confirmar_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Contraseña cambiada exitosamente
        onPasswordReset();
      } else {
        setError(data.message || 'Error al cambiar la contraseña');
      }
    } catch {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!onResendCode) return;
    
    setResending(true);
    setError('');
    
    try {
      await onResendCode();
    } catch (err) {
      setError(`Error al reenviar el código: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setResending(false);
    }
  };

  // Formatear código con espacios para mejor legibilidad
  const formatCode = (value: string) => {
    return value.replace(/(\d{3})(\d{1,3})/, '$1 $2').trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-slate-900 p-4 rounded-full mb-4">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Nueva Contraseña</h1>
            <p className="text-slate-600 mt-2">Ingresa el código y tu nueva contraseña</p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Código enviado a:</span> {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Campo del código */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">
                Código de Verificación
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="code"
                  type="text"
                  value={formatCode(code)}
                  onChange={handleCodeChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-colors text-center text-2xl font-mono tracking-widest"
                  placeholder="000 000"
                  maxLength={7}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-slate-500">Código de 6 dígitos</p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="text-xs text-slate-600 hover:text-slate-800 underline disabled:opacity-50"
                >
                  {resending ? 'Reenviando...' : 'Reenviar código'}
                </button>
              </div>
            </div>

            {/* Campo nueva contraseña */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-colors"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Campo confirmar contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-colors"
                  placeholder="Repite la nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {newPassword && confirmPassword && (
                <p className={`text-xs mt-1 ${
                  newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}>
                  {newPassword === confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading || code.length !== 6 || newPassword !== confirmPassword || newPassword.length < 8}
                className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Cambiando Contraseña...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Cambiar Contraseña
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full bg-gray-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">🔒 Consejos para tu nueva contraseña:</p>
              <ul className="space-y-1 text-yellow-700">
                <li>• Mínimo 8 caracteres</li>
                <li>• Combina letras, números y símbolos</li>
                <li>• No uses información personal</li>
                <li>• Evita contraseñas comunes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};