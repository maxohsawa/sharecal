// import box from chakra
import { Box, Heading } from "@chakra-ui/react";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

// fullcalendar.io react docs
  // https://fullcalendar.io/docs/react

function Calendar() {
	return (
		<>
			<Box>
				<Heading>Calendar</Heading>
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
        />
			</Box>
		</>
	);
}

export default Calendar;
