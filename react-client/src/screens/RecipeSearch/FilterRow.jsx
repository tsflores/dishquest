import Pill from '../../components/ui/Pill';

export default function FilterRow({ groups }) {
  return (
    <div className="space-y-2">
      {groups.map((g) => (
        <div key={g.key} className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <Pill active={!g.value} onClick={() => g.onChange(null)}>{g.label}</Pill>
          {g.options.map((opt) => (
            <Pill
              key={opt}
              active={g.value === opt}
              onClick={() => g.onChange(g.value === opt ? null : opt)}
            >
              <span className="capitalize">{opt}</span>
            </Pill>
          ))}
        </div>
      ))}
    </div>
  );
}
