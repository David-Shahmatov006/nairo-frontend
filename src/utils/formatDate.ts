export const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, "0");
  const day = String(local.getDate()).padStart(2, "0");

  const hours = String(local.getHours()).padStart(2, "0");
  const minutes = String(local.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} , ${hours}:${minutes}`;
};

export const formatTime = (isoString: string) => {
  const date = new Date(isoString);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
