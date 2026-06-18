const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeekCalendarStrip({ selectedDay = 0, onSelectDay }) {
  return (
    <div className="flex gap-1.5 px-4 overflow-x-auto scrollbar-hide pb-1">
      {DAYS.map((day, i) => (
        <button
          key={day}
          onClick={() => onSelectDay?.(i)}
          className={`flex-shrink-0 flex flex-col items-center py-2 px-3 rounded-xl text-xs font-medium transition-colors ${
            selectedDay === i
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span>{day}</span>
        </button>
      ))}
    </div>
  );
}
