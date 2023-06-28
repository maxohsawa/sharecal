// Month Date Year -> yyyy-mm-dd
export const convertToHTMLDate = (input) => {
  const dateObj = new Date(input);
  return dateObj.toISOString().split('T')[0];
}

// yyyy-mm-ddThh:mm:ssZ -> hh:mm
export const convertISOToTime = (input) => {
  if (input.split('T').length === 1) return null;
  const time = input.split('T')[1];
  return time.split(':').slice(0, 2).join(':');
}

// yyyy-mm-dd, hh:mm -> yyyy-mm-ddThh:mm:00Z
export const convertHTMLDateAndTimeToISO = (date, time) => {
  if (!time) return date;
  return `${date}T${time}:00Z`;
}