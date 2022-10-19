import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NameView from "../views/NameView.vue";
import LobbyView from "../views/HomeView.vue";
import AdminView from "../views/AdminView.vue";
import store from "../store/index";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "home",
		component: HomeView,
	},
	{
		path: "/name",
		name: "name",
		component: NameView,
	},
	{
		path: "/admin",
		name: "admin",
		component: AdminView,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

router.beforeEach((to, from) => {
	if (
		!store.state.currentPlayer.name &&
		to.path !== "/name" &&
		to.path !== "/admin"
	) {
		return "/name";
	}
});

export default router;
