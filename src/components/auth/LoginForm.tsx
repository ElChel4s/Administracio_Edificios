import { useState } from 'react';
import { Building2, LogIn, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SimpleCaptcha } from '../ui/SimpleCaptcha';
import { VerificationForm } from './VerificationForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { PasswordResetSuccess } from './PasswordResetSuccess';
import { AccountBlockedMessage } from './AccountBlockedMessage';
import { AccountUnlockedMessage } from './AccountUnlockedMessage';
import { User } from '../../lib/api';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'login' | 'verification' | 'forgot-password' | 'reset-password' | 'reset-success' | 'account-blocked'>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [attemptInfo, setAttemptInfo] = useState<{
    intentos_fallidos?: number;
    intentos_restantes?: number;
    cuenta_bloqueada?: boolean;
  }>({});
  const [showUnlockedMessage, setShowUnlockedMessage] = useState(false);
  const { signInWithToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar captcha antes de continuar
    if (!captchaValid) {
      setError('Por favor completa la verificación de seguridad correctamente');
      return;
    }

    setLoading(true);

    try {
      // Llamar al endpoint de login (ahora devuelve mensaje de código enviado)
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login exitoso - limpiar info de intentos y pasar al paso de verificación
        setAttemptInfo({});
        setStep('verification');
      } else {
        // Manejar diferentes tipos de error
        if (response.status === 403 && data.cuenta_bloqueada) {
          // Cuenta bloqueada
          setAttemptInfo({
            intentos_fallidos: data.intentos_fallidos,
            cuenta_bloqueada: data.cuenta_bloqueada
          });
          setStep('account-blocked');
        } else if (data.intentos_fallidos !== undefined) {
          // Credenciales incorrectas con información de intentos
          setAttemptInfo({
            intentos_fallidos: data.intentos_fallidos,
            intentos_restantes: data.intentos_restantes
          });
          setError(data.message || 'Credenciales incorrectas');
        } else {
          // Otros errores
          setError(data.message || 'Error al iniciar sesión');
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (token: string, user: User) => {
    // Usar la función signInWithToken del contexto con los datos ya obtenidos
    signInWithToken(token, user);
  };

  // (Removed duplicate handleBackToLogin function)

  const handleResendCode = async () => {
    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    });

    if (!response.ok) {
      throw new Error('Error al reenviar el código');
    }
  };

  // Funciones para el flujo de recuperación de contraseña
  const handleForgotPassword = () => {
    setStep('forgot-password');
    setError('');
  };

  const handleEmailSent = (email: string) => {
    setRecoveryEmail(email);
    setStep('reset-password');
  };

  const handlePasswordReset = () => {
    setStep('reset-success');
  };

  const handleBackToLogin = () => {
    setStep('login');
    setError('');
    setRecoveryEmail('');
  };

  const handleResendResetCode = async () => {
    const response = await fetch('http://localhost:8000/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: recoveryEmail
      }),
    });

    if (!response.ok) {
      throw new Error('Error al reenviar el código de recuperación');
    }
  };

  // Mostrar formularios según el paso actual
  if (step === 'verification') {
    return (
      <VerificationForm
        email={email}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackToLogin}
        onResendCode={handleResendCode}
      />
    );
  }

  if (step === 'forgot-password') {
    return (
      <ForgotPasswordForm
        onBack={handleBackToLogin}
        onEmailSent={handleEmailSent}
      />
    );
  }

  if (step === 'reset-password') {
    return (
      <ResetPasswordForm
        email={recoveryEmail}
        onBack={() => setStep('forgot-password')}
        onPasswordReset={handlePasswordReset}
        onResendCode={handleResendResetCode}
      />
    );
  }

  if (step === 'reset-success') {
    return (
      <PasswordResetSuccess
        onGoToLogin={handleBackToLogin}
      />
    );
  }

  if (step === 'account-blocked') {
    return (
      <AccountBlockedMessage
        email={email}
        intentos_fallidos={attemptInfo?.intentos_fallidos || 4}
        onBack={() => setStep('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-slate-900 p-4 rounded-full mb-4">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Edificio Inteligente</h1>
            <p className="text-slate-600 mt-2">Sistema de Administración</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Mensaje de cuenta desbloqueada */}
            {showUnlockedMessage && (
              <AccountUnlockedMessage
                onContinue={() => {
                  setShowUnlockedMessage(false);
                  setAttemptInfo({});
                  setError('');
                }}
              />
            )}

            {/* Mensaje de intentos fallidos */}
            {attemptInfo && (attemptInfo.intentos_fallidos || 0) > 0 && !attemptInfo.cuenta_bloqueada && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 p-1 rounded">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-800 font-medium text-sm">Atención</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      Has fallado {attemptInfo.intentos_fallidos || 0} de 4 intentos permitidos.
                      {attemptInfo.intentos_restantes && (
                        <span className="block font-medium">
                          Intentos restantes: {attemptInfo.intentos_restantes}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Captcha de verificación */}
            <SimpleCaptcha 
              onValidationChange={setCaptchaValid}
              className="mt-6"
            />

            <button
              type="submit"
              disabled={loading || !captchaValid}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Iniciando sesión...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-slate-600 hover:text-slate-800 text-sm underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
