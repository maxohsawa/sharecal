// yyyy-mm-dd
export const convertToISO = (input) => {
  const dateObj = new Date(input);
  return dateObj.toISOString().split('T')[0];
}