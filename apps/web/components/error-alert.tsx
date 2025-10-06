import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
  onDismiss?: () => void;
  variant?: 'destructive' | 'warning';
}

export function ErrorAlert({ error, onDismiss, variant = 'destructive' }: ErrorAlertProps) {
  const variantStyles = {
    destructive: 'bg-red-900/20 border-red-800 text-red-400',
    warning: 'bg-yellow-900/20 border-yellow-800 text-yellow-400',
  };

  return (
    <div className={`p-4 rounded-lg border flex items-start gap-3 ${variantStyles[variant]}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm">{error}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-current hover:opacity-80 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
