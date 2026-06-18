export default function SearchBar({ value, onChange, onSubmit, placeholder }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }} className="relative">
      <svg
        viewBox="0 0 24 24"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none" stroke="currentColor" strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white rounded-pill pl-9 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-primary"
      />
    </form>
  );
}
