import express, { request } from "express";
import cors from "cors";
import Server from "socket.io";

let gamestates = {
	waitingForGame: "WAITING_FOR_GAME",
	waitingForCommand: "WAITING_FOR_COMMAND",
	playerAnswering: "PLAYER_ANSWERING",
};

let gamestate = gamestates.waitingForGame;

let players: any[] = [];

let correctAnswer = "";

const io = new Server(3001, {
	cors: {
		origin: "http://localhost:8080",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket: any) => {
	console.log("Connection established");

	socket.on("ADD_PLAYER", (data: any) => {
		players.push(data);
		io.emit("NEW_PLAYER", data);
		if (gamestate !== gamestates.waitingForGame) {
			socket.emit("START_GAME");
		}
	});

	socket.on("GET_PLAYERS", (data: any) => {
		socket.emit("PLAYERS", players);
	});

	socket.on("START_GAME", (data: any) => {
		io.emit("START_GAME");
		gamestate = gamestates.waitingForCommand;
	});

	socket.on("QUESTION_PLAYER", (data: any) => {
		io.emit("QUESTION_PLAYER", data);
		gamestate = gamestates.playerAnswering;
		correctAnswer = data.answers[0];
	});
});

let app = express();
let port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).send("Hello world!");
});

app.get("/players", (req, res) => {
	res.status(200).json(players);
});

app.post("/players", (req, res) => {
	let player = req.body;

	players.push(player);

	res.sendStatus(200);
});

app.post("/answer", (req, res) => {
	let answer = req.body.answer;

	res.status(200);

	if (answer === correctAnswer) {
		res.send("CORRECT_ANSWER");
	} else {
		res.send("WRONG_ANSWER");
	}

	io.emit("ANSWER");
});

app.listen(port, () => {
	console.log("Listening on http://localhost:" + port);
});
