<template>
	<div class="wrapper">
		<LobbyTable v-if="!gameStarted" />
		<div v-if="gameStarted">
			<h1 v-if="waitingForCommands">WAITING FOR HOST</h1>
			<h1 v-if="!waitingForCommands && !questioningCurrentPlayer">
				WAITING FOR PLAYER TO ANSWER: {{ chosenPlayer.name }}
			</h1>
			<div v-if="questioningCurrentPlayer">
				<h1>ANSWER THE QUESTION</h1>
				<div class="question-box">
					<h2>{{ question }}</h2>
					<div class="btn-grid">
						<button
							v-for="answer in answers"
							type="button"
							@click="selectAnswer(answer, $event)"
						>
							{{ answer }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LobbyTable from "@/components/LobbyTable.vue";
import { socket } from "@/main";
import store from "@/store";
import { throwStatement } from "@babel/types";

export default defineComponent({
	data() {
		return {
			gameStarted: false,
			waitingForCommands: true,
			questioningCurrentPlayer: false,
			chosenPlayer: {} as any,
			question: "",
			answers: [] as string[],
		};
	},
	methods: {
		async selectAnswer(answer: string, e: any) {
			let res = await fetch("http://localhost:3000/answer", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ answer }),
			});

			let command = await res.text();

			if (command === "CORRECT_ANSWER") {
				e.target.classList.add("correct");
			} else if (command === "WRONG_ANSWER") {
				e.target.classList.add("incorrect");
			}

			setTimeout(() => {
				this.waitingForCommands = true;
				this.questioningCurrentPlayer = false;
			}, 2000);
		},
		shuffle(array: any[]) {
			let currentIndex = array.length;
			let randomIndex;

			// While there remain elements to shuffle.
			while (currentIndex != 0) {
				// Pick a remaining element.
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				// And swap it with the current element.
				[array[currentIndex], array[randomIndex]] = [
					array[randomIndex],
					array[currentIndex],
				];
			}

			return array;
		},
	},
	components: { LobbyTable },
	created() {
		socket.on("START_GAME", (data) => {
			this.gameStarted = true;
			this.waitingForCommands = true;
			this.questioningCurrentPlayer = false;
		});

		socket.on("QUESTION_PLAYER", (data) => {
			this.waitingForCommands = false;
			if (data.player.id === store.state.currentPlayer.id) {
				this.questioningCurrentPlayer = true;
				this.question = data.question;
				this.answers = data.answers;
				this.answers = this.shuffle(this.answers);
			} else {
				this.chosenPlayer = data.player;
				this.questioningCurrentPlayer = false;
			}
		});

		socket.on("ANSWER", (data) => {
			this.waitingForCommands = true;
		});
	},
});
</script>
<style scoped>
.wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}

.question-box {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.btn-grid {
	display: grid;
	grid-template: 1fr 1fr / 1fr 1fr;
	width: 100%;
	height: 20vh;
}

.correct {
	background-color: lightgreen;
}

.incorrect {
	background-color: red;
}
</style>
