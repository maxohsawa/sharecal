import {
  useState
} from 'react';

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

const EditModal = ({ isOpen, onOpen, onClose, events, setEvents, eventInfo }) => {
  
  const [ allDay, setAllDay ] = useState(true);
  const [ formState, setFormState ] = useState({});

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    if (event.target.id === "allDayCheck") setFormState({...formState, [name]: event.target.checked})
    else setFormState({...formState, [name]: value});
  }

  const handleSaveClick = (event) => {
   
    const oldEvent = events.filter((event) => event.id === eventInfo.event.id)[0];
    
    const newEvent = {
      ...oldEvent,
      ...formState
    }

    setEvents([
      ...events.filter((event) => event.id !== newEvent.id),
      newEvent
    ])
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Event Title</FormLabel>
              <Input 
                type='text'
                onChange={handleOnChange}
                name="title"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Event Description</FormLabel>
              <Input 
                type='text'
                onChange={handleOnChange}
                name="description"
              />
            </FormControl>
            <FormControl>
              <FormLabel>All day</FormLabel>
              <Checkbox
                id="allDayCheck"
                defaultChecked
                onChange={(event) => {
                  setAllDay(!allDay)
                  handleOnChange(event);
                }}
                name="allDay"
              ></Checkbox>
            </FormControl>
            <FormControl >
              <FormLabel >Start Date</FormLabel>
              <Input 
                type='date'
                onChange={handleOnChange}
                name="start"
              />
            </FormControl>
            {!allDay && <FormControl>
              <FormLabel>Start Time</FormLabel>
              <Input
                type='time'
                onChange={handleOnChange}
                name="startStr"
              />
            </FormControl>}
            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input
                type='date'
                onChange={handleOnChange}
                name="end"
              />
            </FormControl>
            {!allDay && <FormControl>
              <FormLabel>End Time</FormLabel>
              <Input
                type='time'
                onChange={handleOnChange}
                name="endStr"
              />
            </FormControl>}
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme='blue' 
              mr={3} 
              onClick={(event) => {
                handleSaveClick(event);
                onClose(event);
              }}
            >
              Save
            </Button>
            <Button colorScheme='red'>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
  
}

export default EditModal