import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, back, action }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-14 bg-white z-40 flex items-center justify-between px-4 border-b border-gray-100 shadow-sm">
      <div className="w-8">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="text-forest-green text-xl leading-none"
            aria-label="Go back"
          >
            ‹
          </button>
        )}
      </div>
      <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
      <div className="w-8 flex justify-end">{action ?? null}</div>
    </header>
  );
}
