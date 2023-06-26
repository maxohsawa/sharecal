// import react hooks
import { useState } from 'react';

// import libraries
import { v4 as uuidv4} from 'uuid';

// import fullcalendar adapter and plugins
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick

// import box from chakra
import { Box, Heading, useDisclosure } from "@chakra-ui/react";

// import handlers
import { handleDateClick, handleEventClick } from "../utils/calendarHandlers";

// import components
import EventPopUp from '../components/EventPopUp';
import EditModal from '../components/EditModal';

// fullcalendar.io react docs
  // https://fullcalendar.io/docs/react
// additional calendar plugins
  // https://fullcalendar.io/docs/plugin-index

const wrapperStyle = {
  width: "90vw",
  height: "90vw"
}

function Calendar() {

  const [events, setEvents ] = useState(
    [
      { id: uuidv4(), title: 'test event 1', date: '2023-06-26' },
      { id: uuidv4(), title: 'test event 2', date: '2023-06-27' }
    ]
  )

  const [eventClicked, setEventClicked ] = useState(false);
  const [eventPopUpData, setEventPopUpData ] = useState({});

  // chakra custom hook for modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const eventClickData = [
    events, setEvents,
    eventClicked, setEventClicked,
    eventPopUpData, setEventPopUpData
  ];

	return (
		<>
			<Box>
				<Heading>Calendar</Heading>
        
        <Box
          style={wrapperStyle}
        >

          <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            events={events}
            dateClick={(args) => handleDateClick(args, ...eventClickData)}
            eventClick={(info) => handleEventClick(info, ...eventClickData)}
          />

          {eventClicked && <EventPopUp data={eventPopUpData} />}
        </Box>
        <EditModal 
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />

			</Box>
		</>
	);
}

export default Calendar;
