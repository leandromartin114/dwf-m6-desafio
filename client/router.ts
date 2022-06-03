import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
	{ path: "/", component: "home-page" },
	{ path: "/home", component: "home-page" },
	{ path: "/load", component: "load-game" },
	{ path: "/new", component: "new-game" },
	{ path: "/signing", component: "signing-page" },
	{ path: "/instructions", component: "instructions-page" },
	{ path: "/room", component: "room-page" },
	{ path: "/await", component: "await-page" },
	{ path: "/game", component: "game-page" },
	{ path: "/moves", component: "moves-page" },
	{ path: "/result", component: "result-page" },
]);
