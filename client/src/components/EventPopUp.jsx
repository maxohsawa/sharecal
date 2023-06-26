import { Box, Button } from '@chakra-ui/react';

import './EventPopUp.css';

const EventPopUp = ({ data, onOpen }) => {
  return (
    <Box className={'event-pop-up'} style={{left: data.x, top: data.y}}>
      <Button className={'edit-button'} onClick={onOpen}>Edit</Button>
    </Box>
  )
}

export default EventPopUp