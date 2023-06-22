export const handleDateClick = (arg, events, setEvents) => {
  console.log("date click event handling");
  console.log(arg);
  const newEvent = {
    title: 'New Event',
    date: arg.dateStr
  }
  setEvents([...events, newEvent]);
}