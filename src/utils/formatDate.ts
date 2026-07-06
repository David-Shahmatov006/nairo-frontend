import { format } from "date-fns";

export const formatDate = (isoString: string) => {
  return format(new Date(isoString), "yyyy.MM.dd , HH:mm");
};

export const formatTime = (isoString: string) => {
  return format(new Date(isoString), "HH:mm");
};