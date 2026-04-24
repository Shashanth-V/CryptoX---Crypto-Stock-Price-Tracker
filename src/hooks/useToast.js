import { useCallback, useMemo, useState } from 'react';

export function useToast() {
  // [useState]
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);
}

export default useToast;
