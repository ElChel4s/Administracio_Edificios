import { CheckCircle, ArrowRight } from 'lucide-react';

interface PasswordResetSuccessProps {
  onGoToLogin: () => void;
}

export const PasswordResetSuccess = ({ onGoToLogin }: PasswordResetSuccessProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">¡Contraseña Cambiada!</h1>
            <p className="text-slate-600 mt-2">Tu contraseña ha sido actualizada exitosamente</p>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium mb-2">✅ Proceso completado</p>
              <p className="text-green-700 text-sm">
                Ya puedes iniciar sesión con tu nueva contraseña
              </p>
            </div>

            <button
              onClick={onGoToLogin}
              className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              Ir al Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">🔐 Recomendaciones de seguridad:</p>
              <ul className="space-y-1 text-blue-700 text-left">
                <li>• Guarda tu nueva contraseña en un lugar seguro</li>
                <li>• No compartas tus credenciales con nadie</li>
                <li>• Cierra sesión cuando uses computadoras compartidas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};