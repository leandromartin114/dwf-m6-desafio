import { Router } from "@vaadin/router";
import { state } from "../../state";
import { map } from "lodash";
type Move = "piedra" | "papel" | "tijera";
class MovesPage extends HTMLElement {
	constructor() {
		super();
	}
	shadow = this.attachShadow({ mode: "open" });
	myMove: Move;
	opponentMove: Move;
	connectedCallback() {
		this.render();
		state.end();
		state.setScore();
		setTimeout(() => {
			Router.go("/result");
		}, 4000);
	}
	render() {
		const div = document.createElement("div");
		div.classList.add("content");
		const style = document.createElement("style");
		div.innerHTML = ` 
		<my-text class="text" tag="p">Waiting for the result...</my-text>
            `;
		setTimeout(() => {
			const currentState = state.getState();
			const currentGame = map(currentState.currentGame);
			if (currentState.name == currentGame[0].name) {
				this.myMove = currentGame[0].choice;
				this.opponentMove = currentGame[1].choice;
			}
			if (currentState.name == currentGame[1].name) {
				this.myMove = currentGame[1].choice;
				this.opponentMove = currentGame[0].choice;
			}
			div.innerHTML = `
			<div class="result">
			<my-play class="${this.opponentMove}" type="${this.opponentMove}" tag="large"></my-play>
			<my-play class="${this.myMove}" type="${this.myMove}" tag="large"></my-play>
			</div>
				`;
		}, 2500);
		style.innerHTML = `
            .result{
                display: grid;
                gap: 30px;
                align-items: center;
                justify-items: center;
            }
			.text{
				display: flex;
				align-items: center;
                justify-items: center;
			}
            .content{
                padding: 30px 15px;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            `;
		this.shadow.appendChild(div);
		this.shadow.appendChild(style);
	}
}
customElements.define("moves-page", MovesPage);
