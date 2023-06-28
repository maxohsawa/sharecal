// import libraries
import { v4 as uuidv4 } from 'uuid';

export const handleDateClick = ({ args, events, setEvents }) => {
  
  const newEvent = {
    id: uuidv4(),
    allDay: true,
    start: undefined,
    end: undefined,
    startStr: null,
    endStr: null,
    title: 'New Event',
    date: args.dateStr
  }
  
  setEvents([...events, newEvent]);
}