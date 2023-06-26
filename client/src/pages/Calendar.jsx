// import box from chakra
import { Box, Heading } from "@chakra-ui/react";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import Header from "../components/Header.jsx";

// fullcalendar.io react docs
  // https://fullcalendar.io/docs/react

function Calendar() {
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
				<FullCalendar
				plugins={[ dayGridPlugin ]}
				initialView="dayGridMonth"
				/>
			</Box>
		</>
	);
}

export default Calendar;
