export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-pantry-slate text-white hover:bg-pantry-slate/90 active:bg-pantry-slate/80',
    accent: 'bg-saffron-gold text-white hover:bg-saffron-gold/90 active:bg-saffron-gold/80',
    outline: 'border-2 border-pantry-slate text-pantry-slate bg-transparent hover:bg-pantry-slate/5',
    ghost: 'text-pantry-slate hover:bg-pantry-slate/5',
  };
  return (
    <button className={`${base} ${variants[variant] ?? ''} ${className}`} {...props}>
      {children}
    </button>
  );
}
