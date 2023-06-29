// import libraries
import { v4 as uuidv4 } from 'uuid';

export const handleDateClick = ({ args, events, setEvents }) => {
  
  const newEvent = {
    id: uuidv4(),
    allDay: args.allDay,
    start: args.dateStr,
    end: args.dateStr,
    title: 'New Event',
    description: '',
    date: args.dateStr
  }
  
  setEvents([...events, newEvent]);
}