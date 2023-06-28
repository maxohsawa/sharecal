import { useState, useEffect } from 'react';

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

// dateHelpers
import { convertToHTMLDate, convertHTMLDateAndTimeToISO, convertISOToTime } from '../utils/dateHelpers';

const EditModal = ({ isOpen, onOpen, onClose, events, setEvents, eventInfo }) => {
  
  const [ allDay, setAllDay ] = useState(true);
  const [ formState, setFormState ] = useState({});

  // when the modal is opened, the eventInfo that's coming from fullcalendar.io is transferred to the formState
  useEffect(() => {
    if (!eventInfo) return;
    console.log('eventInfo', eventInfo);
    const { event } = eventInfo;
    setFormState({
      ...formState,
      title: event.title,
      description: event.extendedProps.description,
      allDay: event.allDay,
      start: convertToHTMLDate(event.start),
      end: event.end ? convertToHTMLDate(event.end) : convertToHTMLDate(event.start),
      startTime: convertISOToTime(event.startStr),
      endTime: convertISOToTime(event.endStr)
    })
  }, [isOpen])

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    if (event.target.name === 'allDay') {
      setFormState({...formState, [name]: event.target.checked});
    } else {
      setFormState({...formState, [name]: value});
    }
  }

  const handleSaveClick = () => {
   
    const oldEvent = events.filter((event) => event.id === eventInfo.event.id)[0];

    console.log('oldEvent', oldEvent);
    
    const newEvent = {
      ...oldEvent,
      ...formState,
      startStr: convertHTMLDateAndTimeToISO(formState.start, formState.startTime),
      endStr: convertHTMLDateAndTimeToISO(formState.end, formState.endTime)
    }

    console.log('newEvent', newEvent);

    setEvents([
      ...events.filter((event) => event.id !== newEvent.id),
      newEvent
    ])
  }

  const handleDeleteClick = () => {

    setEvents([
      ...events.filter((event) => event.id !== eventInfo.event.id)
    ]);
    onClose();
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
                value={formState.title}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Event Description</FormLabel>
              <Input 
                type='text'
                onChange={handleOnChange}
                name="description"
                value={formState.description}
              />
            </FormControl>
            <FormControl>
              <FormLabel>All day</FormLabel>
              <Checkbox
                id="allDayCheck"
                onChange={handleOnChange}
                name="allDay"
                isChecked={formState.allDay}
              ></Checkbox>
            </FormControl>
            <FormControl >
              <FormLabel >Start Date</FormLabel>
              <Input 
                type='date'
                onChange={handleOnChange}
                name="start"
                value={formState.start}
              />
            </FormControl>
            {!formState.allDay && <FormControl>
              <FormLabel>Start Time</FormLabel>
              <Input
                type='time'
                onChange={handleOnChange}
                name="startTime"
                value={formState.startTime}
              />
            </FormControl>}
            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input
                type='date'
                onChange={handleOnChange}
                name="end"
                value={formState.end}
              />
            </FormControl>
            {!formState.allDay && <FormControl>
              <FormLabel>End Time</FormLabel>
              <Input
                type='time'
                onChange={handleOnChange}
                name="endTime"
                value={formState.endTime}
              />
            </FormControl>}
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme='blue' 
              mr={3} 
              onClick={() => {
                handleSaveClick();
                onClose();
              }}
            >
              Save
            </Button>
            <Button 
              colorScheme='red'
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
  
}

export default EditModal