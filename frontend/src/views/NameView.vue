<template>
	<div>
		<form @submit.prevent="enterName">
			Name: <input type="text" v-model="input" />
		</form>
	</div>
</template>
<script lang="ts">
import router from "@/router";
import store from "@/store";
import { defineComponent } from "vue";
import { socket } from "@/main";

export default defineComponent({
	data() {
		return {
			input: "",
		};
	},
	methods: {
		enterName() {
			if (this.input === "") return;

			let player = { name: this.input, id: this.makeid(6) };

			socket.emit("ADD_PLAYER", player);

			store.state.currentPlayer = player;
			router.push("/");
		},
		makeid(length: number) {
			var result = "";
			var characters =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			var charactersLength = characters.length;
			for (var i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}
			return result;
		},
	},
});
</script>
<style scoped></style>
