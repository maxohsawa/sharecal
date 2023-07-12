const path = require("path");
const express = require("express");
require("dotenv").config();

const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
	ws.on("error", console.error);

	ws.on("message", function message(data) {
		// ws.send(JSON.stringify({ message: "Hello from server" }));
		ws.send("server: " + data.toString());
	});

	// ws.on("open", function open() {
	// 	ws.send("Hello Client");
	// });

	// ws.send("Hello Client unenclosed");
});

const db = require("./db/connection");

const routes = require("./routes");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use("/", routes);

db.once("open", () => {
	console.log("DB connection established");
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});
