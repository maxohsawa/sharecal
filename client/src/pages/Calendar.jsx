// import react hooks
import { useState, useEffect } from 'react';

// import libraries
import { v4 as uuidv4} from 'uuid';

// import fullcalendar adapter and plugins
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick

// import box from chakra
import { Box, Heading, useDisclosure } from "@chakra-ui/react";

// import handlers
import { handleDateClick } from "../utils/calendarHandlers";

// import components
import Header from '../components/Header';
import EditModal from '../components/EditModal';

// fullcalendar.io react docs
  // https://fullcalendar.io/docs/react
// additional calendar plugins
  // https://fullcalendar.io/docs/plugin-index

function Calendar() {

  const [ events, setEvents ] = useState([]);
  const [ eventInfo, setEventInfo ] = useState();

  useEffect(() => {
    console.log('events', events);
  }, [events]);

  // chakra custom hook for modal
  const { isOpen, onOpen, onClose } = useDisclosure();

	return (
    <>
			<Box
				w="100vw"
				h="100vh"
				bgColor="gray.200"
				display="flex"
				flexDirection="column"
				alignItems="center"
			>
				<Header />
				<Heading
					my={5}
				>
					Calendar
				</Heading>
   
        <Box w="100%" h="100%">
          <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            events={events}
            dateClick={(args) => handleDateClick({ args, events, setEvents })}
            eventClick={(info) => { setEventInfo(info); onOpen(); }}
          />
      
          <EditModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            events={events}
            setEvents={setEvents}
            eventInfo={eventInfo}
          />
        </Box>

				
			
			</Box>
		</>
	);
}

export default Calendar;
