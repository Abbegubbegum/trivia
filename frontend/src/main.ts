import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3001");

socket.on("connect", () => {
	console.log("connected");
});

socket.on("NEW_PLAYER", (data) => {
	store.state.players.push(data);
});
socket.on("PLAYERS", (data) => {
	store.state.players = data;
});
socket.on("MESSAGE", (data) => {
	console.log(data);
});

export { socket };

createApp(App).use(store).use(router).mount("#app");
