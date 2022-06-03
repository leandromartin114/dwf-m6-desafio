import "./router";
import "./components/button/index";
import "./components/input-text/index";
import "./components/short-form/index";
import "./components/long-form/index";
import "./components/count-down/index";
import "./components/play/index";
import "./components/result/index";
import "./components/text/index";
import "./pages/home/index";
import "./pages/load-game/index";
import "./pages/new-game/index";
import "./pages/room/index";
import "./pages/instructions/index";
import "./pages/signing-in/index";
import "./pages/await/index";
import "./pages/moves/index";
import "./pages/game/index";
import "./pages/result/index";
import { state } from "./state";
import "dotenv/config";

function main() {
	state.initState();
}
main();
