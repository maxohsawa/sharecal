// import libraries
import { v4 as uuidv4 } from 'uuid';

export const handleDateClick = (arg, events, setEvents, eventClicked, setEventClicked, eventPopUpData, setEventPopUpData) => {
  console.log("date click event handling");
  console.log(arg);
  const newEvent = {
    id: uuidv4(),
    title: 'New Event',
    date: arg.dateStr
  }
  console.log('new event id', newEvent.id);
  setEvents([...events, newEvent]);
}

export const handleEventClick = (info, events, setEvents, eventClicked, setEventClicked, eventPopUpData, setEventPopUpData) => {

  setEventClicked(!eventClicked);
  // figure out what data we want to set in the eventPopUpData stateful variable
  // info.event.id
  console.log('info', info);
  console.log('info id', info.event.id);
  console.log('info.event.title: ' + info.event.title);
  console.log('info.jsEvent.pageX, pageY: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
  console.log('info.view.type: ' + info.view.type);
  // use setEventPopUpData to set state
  setEventPopUpData({
    id: info.event.id,
    title: info.event.title,
    x: info.jsEvent.pageX,
    y: info.jsEvent.pageY
  });


  // change the border color just for fun
  info.el.style.borderColor = 'red';
}