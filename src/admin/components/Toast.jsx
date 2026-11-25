import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type = 'success') => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, message, type }]);
      setTimeout(() => remove(id), 4000); // ४ सेकेन्डपछि आफैं हराउँछ
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-2 rounded-sm border p-3 text-sm shadow-lift ${
              t.type === 'error'
                ? 'border-brick/50 bg-cream text-brick'
                : 'border-gold bg-cream text-brown'
            }`}
          >
            {t.type === 'error' ? (
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-700" />
            )}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} aria-label="Dismiss" className="text-brown/50 hover:text-brown">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}