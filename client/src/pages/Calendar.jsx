// import react hooks
import { useState } from 'react';

// import box from chakra
import { Box, Heading } from "@chakra-ui/react";

// import fullcalendar adapter and plugins
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick

import { handleDateClick } from "../utils/calendarHandlers";

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
      { title: 'test event 1', date: '2023-06-22' },
      { title: 'test event 2', date: '2023-06-23' }
    ]
  )

	return (
		<>
			<Box>
				<Heading>Calendar</Heading>
        
        <div
          style={wrapperStyle}
        >

          <FullCalendar
            
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            events={events}
            dateClick={(args) => handleDateClick(args, events, setEvents)}
          />
        </div>
			</Box>
		</>
	);
}

export default Calendar;
