import React, { useEffect, useState } from "react";

export default function CountdownTimer({ to, className, compact = false }) {
  const target = new Date(to).getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  let diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000);
  diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  const Box = ({ v, l }) => (
    <div className="flex flex-col items-center">
      <span className="bg-primary text-primary-foreground rounded-md font-mono font-bold tabular-nums px-2 py-1 text-sm min-w-[2.25rem] text-center">
        {String(v).padStart(2, "0")}
      </span>
      {!compact && <span className="text-[10px] mt-1 text-muted-foreground uppercase tracking-wide">{l}</span>}
    </div>
  );

  return (
    <div className={className}>
      <div className="flex items-end gap-1.5">
        {days > 0 && <Box v={days} l="Days" />}
        <Box v={hours} l="Hrs" />
        <Box v={mins} l="Min" />
        <Box v={secs} l="Sec" />
      </div>
    </div>
  );
}