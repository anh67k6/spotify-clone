export const createFormatDuration = (duration) => {
  const integerPart = Math.ceil(duration);
  const hours = Math.floor(integerPart / 3600);
  const minutes = Math.floor((integerPart % 3600) / 60);
  const seconds = integerPart % 60;
  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );
};
