<template>
	<div class="wrapper">
		<LobbyTable v-if="!gameStarted" />
		<div v-if="gameStarted && waitingForCommands">
			<h1>WAITING FOR HOST</h1>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LobbyTable from "@/components/LobbyTable.vue";
import { socket } from "@/main";

export default defineComponent({
	data() {
		return {
			gameStarted: false,
			waitingForCommands: true,
		};
	},
	components: { LobbyTable },
	created() {
		socket.on("START_GAME", (data) => {
			this.gameStarted = true;
		});
	},
});
</script>
<style scoped>
.wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
