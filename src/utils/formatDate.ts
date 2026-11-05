const pad = (value: number) => String(value).padStart(2, "0");

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} , ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatTime = (isoString: string) => {
  const date = new Date(isoString);

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const getDayKey = (isoString: string) => {
  const date = new Date(isoString);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const formatMessageDay = (
  isoString: string,
  locale: string,
  labels: { today: string; yesterday: string },
  now = new Date(),
) => {
  const date = new Date(isoString);
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  const dayKey = getDayKey(isoString);

  if (dayKey === getDayKey(now.toISOString())) return labels.today;
  if (dayKey === getDayKey(yesterday.toISOString())) return labels.yesterday;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    ...(date.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  }).format(date);
};

export const formatVoiceDuration = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};
