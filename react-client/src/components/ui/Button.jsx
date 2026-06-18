export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80',
    accent: 'bg-accent text-white hover:bg-accent/90 active:bg-accent/80',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/5',
    ghost: 'text-primary hover:bg-primary/5',
  };
  return (
    <button className={`${base} ${variants[variant] ?? ''} ${className}`} {...props}>
      {children}
    </button>
  );
}
