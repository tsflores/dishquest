import { useNavigate } from "react-router-dom";

export default function TopBar({ title, back, action, offsetSidebar = true }) {
  const navigate = useNavigate();
  const sidebarClasses = offsetSidebar
    ? "md:left-20 md:w-[calc(100%-5rem)]"
    : "md:left-0 md:w-full";

  return (
    <header
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-14 bg-white z-40 flex items-center justify-between px-4 border-b border-gray-100 shadow-sm md:translate-x-0 md:max-w-none ${sidebarClasses}`}
    >
      <div className="w-8">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-xl leading-none"
            aria-label="Go back"
          >
            ‹
          </button>
        )}
      </div>
      <h1 className="text-base font-semibold text-gray-900 truncate">
        {title}
      </h1>
      <div className="w-8 flex justify-end">{action ?? null}</div>
    </header>
  );
}
