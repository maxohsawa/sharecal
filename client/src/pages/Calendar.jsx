// import box from chakra
import { Box, Heading } from "@chakra-ui/react";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick

import { handleDateClick } from "../utils/calendarHandlers";

// fullcalendar.io react docs
  // https://fullcalendar.io/docs/react

function Calendar() {
	return (
		<>
			<Box>
				<Heading>Calendar</Heading>
        <FullCalendar
          plugins={[ dayGridPlugin, interactionPlugin ]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
        />
			</Box>
		</>
	);
}

export default Calendar;
