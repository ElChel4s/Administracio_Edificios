import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface SimpleCaptchaProps {
  onValidationChange: (isValid: boolean) => void;
  className?: string;
}

export const SimpleCaptcha = ({ onValidationChange, className = '' }: SimpleCaptchaProps) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Generar captcha simple con operación matemática
  const generateCaptcha = () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, result: number;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        result = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 25;
        num2 = Math.floor(Math.random() * 25) + 1;
        result = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        result = num1 * num2;
        break;
      default:
        num1 = 1;
        num2 = 1;
        result = 2;
    }

    setCaptchaText(`${num1} ${operation} ${num2} = ?`);
    return result.toString();
  };

  const [correctAnswer, setCorrectAnswer] = useState('');

  const refreshCaptcha = () => {
    const answer = generateCaptcha();
    setCorrectAnswer(answer);
    setUserInput('');
    setIsValid(false);
    onValidationChange(false);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const valid = userInput.trim() === correctAnswer && userInput.trim() !== '';
    setIsValid(valid);
    onValidationChange(valid);
  }, [userInput, correctAnswer, onValidationChange]);

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-slate-700">
        Verificación de Seguridad
      </label>
      
      <div className="flex items-center space-x-3">
        {/* Captcha display */}
        <div className="flex-1 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg px-4 py-3 text-center font-mono text-lg font-bold text-slate-800 select-none">
          {captchaText}
        </div>
        
        {/* Refresh button */}
        <button
          type="button"
          onClick={refreshCaptcha}
          className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          title="Generar nuevo captcha"
        >
          <RefreshCw className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Input field */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ingresa el resultado"
          className={`flex-1 px-4 py-2 border rounded-lg transition ${
            userInput.trim() === ''
              ? 'border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent'
              : isValid
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
          }`}
        />
        
        {/* Validation indicator */}
        {userInput.trim() !== '' && (
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            isValid ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <span className="text-white text-sm font-bold">
              {isValid ? '✓' : '✗'}
            </span>
          </div>
        )}
      </div>

      {userInput.trim() !== '' && !isValid && (
        <p className="text-sm text-red-600">
          Resultado incorrecto. Inténtalo de nuevo.
        </p>
      )}
    </div>
  );
};