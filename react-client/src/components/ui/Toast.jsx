import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, onDismiss, duration]);

  if (!message) return null;

  const colors = {
    success: 'bg-herb-green text-white',
    error: 'bg-paprika-red text-white',
    info: 'bg-gray-800 text-white',
  };

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-pill text-sm font-medium shadow-lg whitespace-nowrap ${colors[type] ?? colors.info}`}
    >
      {message}
    </div>
  );
}
