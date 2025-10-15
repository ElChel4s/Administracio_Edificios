import { Shield, ArrowLeft, AlertTriangle, Phone } from 'lucide-react';

interface AccountBlockedMessageProps {
  email: string;
  intentos_fallidos: number;
  onBack: () => void;
}

export const AccountBlockedMessage = ({ email, intentos_fallidos, onBack }: AccountBlockedMessageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <Shield className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Cuenta Bloqueada</h1>
            <p className="text-slate-600 mt-2 text-center">Por seguridad, tu cuenta ha sido temporalmente bloqueada</p>
          </div>

          <div className="space-y-6">
            {/* Información de la cuenta */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium mb-1">Cuenta Bloqueada</p>
                  <p className="text-red-700 text-sm">
                    <span className="font-medium">{email}</span> ha sido bloqueada después de {intentos_fallidos} intentos fallidos de inicio de sesión.
                  </p>
                </div>
              </div>
            </div>

            {/* Información sobre qué hacer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-blue-800 font-medium mb-2">¿Qué puedo hacer?</p>
                  <ul className="text-blue-700 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></span>
                      <span>Contacta con el administrador del sistema para desbloquear tu cuenta</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></span>
                      <span>Si olvidaste tu contraseña, puedes usar la opción de recuperación</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></span>
                      <span>Una vez desbloqueada, podrás iniciar sesión normalmente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Información de seguridad */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">🛡️ Medida de Seguridad</p>
                <p className="text-yellow-700">
                  Este bloqueo automático protege tu cuenta contra intentos de acceso no autorizados.
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={onBack}
                className="w-full bg-gray-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al Login
              </button>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">¿Necesitas ayuda?</p>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">📧 Soporte: admin@edificio.com</p>
                <p className="text-sm text-slate-500">📞 Teléfono: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};