import { Box, Input, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function TestWebSocket() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [connection, setConnection] = useState(false);

	const socket = new WebSocket("ws://localhost:8080/");

	socket.onopen = () => {
		console.log("connected");
		setConnection(true);
	};

	socket.onmessage = (event) => {
		console.log(event.data);
		setMessages([...messages, event.data]);
	};

	const onClickHandler = () => {
		setMessages([...messages, "Client: " + input]);
	};

	useEffect(() => {
		if (connection) {
			socket.send(input);
			setInput("");
		}
	}, [messages]);

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

export default TestWebSocket;
