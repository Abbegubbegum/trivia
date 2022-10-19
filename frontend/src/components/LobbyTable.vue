<template>
	<div class="LobbyTable">
		<h1>Players:</h1>
		<div
			v-for="player in store.state.players"
			:key="player.id"
			class="player"
		>
			<p>
				{{
					player.name +
					(player.id === store.state.currentPlayer.id ? " (You)" : "")
				}}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { socket } from "@/main";
import { defineComponent } from "vue";
import store from "@/store";

export default defineComponent({
	data() {
		return {
			store,
		};
	},
	methods: {
		getPlayers() {
			socket.emit("GET_PLAYERS");
		},
	},
	created() {
		this.getPlayers();
	},
});
</script>

<style scoped></style>
