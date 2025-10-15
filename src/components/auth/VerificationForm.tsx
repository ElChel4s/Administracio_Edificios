import { useState } from 'react';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import { User } from '../../lib/api';

interface VerificationFormProps {
  email: string;
  onVerificationSuccess: (token: string, user: User) => void;
  onBack: () => void;
  onResendCode?: () => Promise<void>;
}

export const VerificationForm = ({ 
  email, 
  onVerificationSuccess, 
  onBack, 
  onResendCode 
}: VerificationFormProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: code
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Verificación exitosa
        onVerificationSuccess(data.token, data.usuario);
      } else {
        setError(data.message || 'Error al verificar el código');
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
      setError(''); // Limpiar error si el reenvío fue exitoso
    } catch (err) {
      console.error('Resend code error:', err);
      setError('Error al reenviar el código');
    } finally {
      setResending(false);
    }
  };

  // Formatear código con espacios para mejor legibilidad
  const formatCode = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 6);
    return numbers.replace(/(\d{3})(\d{1,3})/, '$1 $2').trim();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length <= 6) {
      setCode(numbersOnly);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-600 p-4 rounded-full mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Verificación</h1>
            <p className="text-slate-600 mt-2 text-center">
              Ingresa el código de 6 dígitos enviado a:<br />
              <span className="font-medium text-slate-800">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2 text-center">
                Código de Verificación
              </label>
              <input
                id="code"
                type="text"
                value={formatCode(code)}
                onChange={handleCodeChange}
                required
                className="w-full px-4 py-4 text-center text-2xl font-mono tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="000 000"
                maxLength={7} // 6 dígitos + 1 espacio
                autoComplete="off"
              />
              <p className="text-xs text-slate-500 mt-2 text-center">
                Solo dígitos, sin espacios ni letras
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Verificando...</span>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Verificar Código</span>
                  </>
                )}
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  disabled={loading}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>

                {onResendCode && (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resending || loading}
                    className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                    <span>{resending ? 'Enviando...' : 'Reenviar'}</span>
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <p>El código expira en 10 minutos</p>
          </div>
        </div>
      </div>
    </div>
  );
};