import React, { useState, useCallback, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { Box, Input, Button } from "@chakra-ui/react";

function TestWebSocket2() {
	const socketUrl = "ws://localhost:8080";
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");

	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

	// console log onOpen
	useEffect(() => {
		if (readyState === 1) {
			console.log("Client connected");
		}
	}, [readyState]);

	const onClickHandler = () => {
		setMessages([...messages, "Client: " + input]);
		sendMessage(input + " from client");
		setInput("");
	};

	useEffect(() => {
		if (lastMessage !== null) {
			setMessages([...messages, lastMessage.data]);
		}
	}, [lastMessage, setMessages]);

	return (
		<>
			<Box>
				<ul>
					{messages.map((message, index) => (
						<li key={index}>{message}</li>
					))}
				</ul>
				<Input
					placeholder="test"
					onChange={(event) => setInput(event.currentTarget.value)}
					value={input}
				/>
				<Button onClick={onClickHandler}>Submit</Button>
			</Box>
		</>
	);
}

export default TestWebSocket2;
