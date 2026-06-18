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
      <div className="flex items-center justify-start">
        {back ? (
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-xl leading-none w-8"
            aria-label="Go back"
          >
            ‹
          </button>
        ) : (
          <img
            src="/icons/dishquest-logo-modern-pantry-alt.svg"
            alt="DishQuest"
            className="h-8 w-auto"
          />
        )}
      </div>
      <h1 className="flex-1 text-center text-base font-semibold text-gray-900 truncate px-2">
        {title}
      </h1>
      <div className="w-8 flex justify-end">{action ?? null}</div>
    </header>
  );
}
