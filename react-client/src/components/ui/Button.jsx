export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-forest-green text-white hover:bg-forest-green/90 active:bg-forest-green/80',
    accent: 'bg-coral-orange text-white hover:bg-coral-orange/90 active:bg-coral-orange/80',
    outline: 'border-2 border-forest-green text-forest-green bg-transparent hover:bg-forest-green/5',
    ghost: 'text-forest-green hover:bg-forest-green/5',
  };
  return (
    <button className={`${base} ${variants[variant] ?? ''} ${className}`} {...props}>
      {children}
    </button>
  );
}
