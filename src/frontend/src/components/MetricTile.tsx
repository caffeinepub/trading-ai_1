interface Props {
  label: string;
  value: string | number;
  accentColor: string;
  isUp?: boolean;
}

export default function MetricTile({ label, value, accentColor, isUp }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl p-3 flex-1 border"
      style={{
        background: `${accentColor}0A`,
        borderColor: `${accentColor}30`,
      }}
    >
      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </span>
      <div className="flex items-center gap-1">
        {isUp !== undefined && (
          <span style={{ color: accentColor }} className="text-xs">
            {isUp ? "▲" : "▼"}
          </span>
        )}
        <span className="text-sm font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
}
