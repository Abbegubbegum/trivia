import express, { request } from "express";
import cors from "cors";
import { Server } from "socket.io";

let gamestates = {
	waitingForGame: "WAITING_FOR_GAME",
	waitingForCommand: "WAITING_FOR_COMMAND",
	playerAnswering: "PLAYER_ANSWERING",
};

let gamestate = gamestates.waitingForGame;

const io = new Server(3001, {
	cors: {
		origin: "http://localhost:8080",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	socket.on("ADD_PLAYER", (data) => {
		players.push(data);
		io.emit("NEW_PLAYER", data);
		if (gamestate !== gamestates.waitingForGame) {
			socket.emit("START_GAME");
		}
	});

	socket.on("GET_PLAYERS", (data) => {
		socket.emit("PLAYERS", players);
	});

	socket.on("START_GAME", (data) => {
		io.emit("START_GAME");
		gamestate = gamestates.waitingForCommand;
	});

	socket.on("QUESTION_PLAYER", (data) => {
		io.emit("QUESTION_PLAYER", data);
		gamestate = gamestates.playerAnswering;
	});

	socket.on("PLAYER_ANSWER", (data) => {
		io.emit("PLAYER_ANSWER", data);
		gamestate = gamestates.waitingForCommand;
	});
});

let app = express();
let port = 3000;

let players: any[] = [];

app.use(cors());
app.use(express.json());

app.get("/players", (req, res) => {
	res.status(200).json(players);
});

app.post("/players", (req, res) => {
	let player = req.body;

	players.push(player);

	console.log(players);

	res.sendStatus(200);
});

app.listen(port, () => {
	console.log("Listening on http://localhost:" + port);
});
