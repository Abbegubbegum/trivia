<template>
	<div class="wrapper">
		<div v-if="!gameStarted">
			<LobbyTable />
			<button type="button" @click="startGame">START GAME</button>
		</div>
		<div v-if="gameStarted && waitingForCommands">
			<button
				v-for="player in store.state.players"
				type="button"
				@click="selectPlayer(player)"
			>
				{{ player.name }}
			</button>
		</div>
	</div>

	<div class="question-popup" v-if="showpopup">
		<h2>{{ selectedPlayer.name }}</h2>
		<h2>Question</h2>
		<input type="text" v-model="q" />
		<h3>Answers</h3>
		<input type="text" v-model="a1" />
		<input type="text" v-model="a2" />
		<input type="text" v-model="a3" />
		<input type="text" v-model="a4" />
		<div class="btn-group">
			<button type="button" @click="sendQuestion">Submit</button>
			<button type="button" @click="closePopup">Close</button>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LobbyTable from "@/components/LobbyTable.vue";
import { socket } from "@/main";
import store from "@/store";

export default defineComponent({
	data() {
		return {
			gameStarted: false,
			waitingForCommands: false,
			selectedPlayer: {} as any,
			store,
			showpopup: false,
			q: "",
			a1: "",
			a2: "",
			a3: "",
			a4: "",
		};
	},
	methods: {
		startGame() {
			socket.emit("START_GAME");
			this.gameStarted = true;
			this.waitingForCommands = true;
		},
		selectPlayer(player: any) {
			this.selectPlayer = player;
			this.showpopup = true;
		},
		closePopup() {
			this.selectedPlayer = undefined;
			this.showpopup = false;
		},
		sendQuestion() {
			if (
				this.q === "" ||
				this.a1 === "" ||
				this.a2 === "" ||
				this.a3 === "" ||
				this.a4 === ""
			) {
				return;
			}

			socket.emit("SEND_QUESTION", {
				player: this.selectedPlayer,
				question: this.q,
				answers: [this.a1, this.a2, this.a3, this.a4],
			});
		},
	},
	created() {
		socket.emit("GET_PLAYERS");
	},
	components: { LobbyTable },
});
</script>

<style scoped>
.wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
}

.question-popup {
	padding: 1rem;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 2;
	background-color: white;
	border: 1px solid black;
	box-shadow: 5px 5px 10px;
	border-radius: 5px;
}
</style>
