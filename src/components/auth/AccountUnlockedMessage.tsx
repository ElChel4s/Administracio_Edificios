import { CheckCircle, Shield, ArrowRight } from 'lucide-react';

interface AccountUnlockedMessageProps {
  onContinue: () => void;
}

export const AccountUnlockedMessage = ({ onContinue }: AccountUnlockedMessageProps) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="bg-green-100 p-2 rounded-full">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="text-green-800 font-semibold">Cuenta Desbloqueada</h3>
          </div>
          <p className="text-green-700 text-sm mb-4">
            ¡Buenas noticias! Tu cuenta ha sido desbloqueada por el administrador. 
            Ya puedes intentar iniciar sesión nuevamente con tus credenciales.
          </p>
          <div className="bg-green-100 border border-green-200 rounded-md p-3 mb-4">
            <p className="text-green-800 text-sm font-medium mb-1">Recordatorio de Seguridad:</p>
            <ul className="text-green-700 text-xs space-y-1">
              <li>• Asegúrate de usar la contraseña correcta</li>
              <li>• Después de 4 intentos fallidos, la cuenta se bloqueará nuevamente</li>
              <li>• Si olvidaste tu contraseña, usa la opción "¿Olvidaste tu contraseña?"</li>
            </ul>
          </div>
          <button
            onClick={onContinue}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
          >
            <span>Continuar al Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};