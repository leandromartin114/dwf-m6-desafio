import { Router } from "@vaadin/router";
import { state } from "../../state";
import { map, find } from "lodash";
type Move = "piedra" | "papel" | "tijera";
class ResultPage extends HTMLElement {
	constructor() {
		super();
	}
	shadow = this.attachShadow({ mode: "open" });
	type = "";
	player1 = "p1";
	player2 = "p2";
	p1Score = "";
	p2Score = "";
	p1Move: Move;
	p2Move: Move;
	roomId = "";
	connectedCallback() {
		const currentState = state.getState();
		const currentGame = map(currentState.currentGame);
		const currentScore = map(currentState.score);
		this.roomId = currentState.roomId;
		find(currentScore, (k) => {
			if (k.name !== currentState.name) {
				this.player2 = k.name;
				this.p2Score = k.score;
			}
			if (k.name == currentState.name) {
				this.player1 = k.name;
				this.p1Score = k.score;
			}
		});
		find(currentGame, (k) => {
			if (k.name !== currentState.name) {
				this.p2Move = k.choice;
			}
			if (k.name == currentState.name) {
				this.p1Move = k.choice;
			}
		});
		if (state.defineWinner(this.p1Move, this.p2Move) == "¡It's a Tie!") {
			this.type = "tie";
		}
		if (state.defineWinner(this.p1Move, this.p2Move) == "¡You Won!") {
			this.type = "won";
		}
		if (state.defineWinner(this.p1Move, this.p2Move) == "¡You Lost!") {
			this.type = "lost";
		}
		this.render();
	}
	addlisteners() {
		const playAgainEl = this.shadow.querySelector(".play-again");
		playAgainEl.addEventListener("click", () => {
			state.end();
			Router.go("/instructions");
		});
		const goHomeEl = this.shadow.querySelector(".go-home");
		goHomeEl.addEventListener("click", () => {
			state.logoff();
			Router.go("/home");
		});
		const resetEl = this.shadow.querySelector(".reset");
		resetEl.addEventListener("click", () => {
			state.resetScore();
			this.p1Score = "0";
			this.p2Score = "0";
			this.shadow.firstChild?.remove();
			this.render();
		});
	}
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		div.innerHTML = `
		<my-result type="${this.type}"></my-result>
		<div class="special">
			<div class="score">
				<my-text tag="h3">Score</my-text>
				<my-text tag="h4">${this.player1}: ${this.p1Score}</my-text>
				<my-text tag="h4">${this.player2}: ${this.p2Score}</my-text>
			</div>
			<my-button type="reset" class="button reset">Reset Game</my-button>
		</div>
		<my-button class="button play-again">Play Again</my-button>
		<my-button class="button go-home">Home</my-button>
		`;
		div.classList.add("content");
		div.classList.add(this.type);
		style.innerHTML = `
					.content{
						padding: 10px;
						height: 100vh;
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						align-items: center;
					}
					.tie{
						background-color: #eef1c0;
					}
					.won{
						background-color: #b6f0b4;
					}
					.lost{
						background-color: #f0b4b4;
					}
					.score{
						box-sizing: border-box;
						border: 8px solid black;
						border-radius: 8px;
						width: 250px;
						height: 180px;
						background-color: white;
						color: black;
						padding: 7px 10px;
						display: flex;
						justify-content: center;
						flex-direction: column;
						font-family: 'Odibee Sans', cursive;
					}
					.button{
						width: 250px;
					}
					.special{
						width: 250px;
						display: grid;
						gap: 5px
					}
					@media (min-width: 969px){
						.score{
							box-sizing: border-box;
							border: 10px solid black;
							width: 290px;
							height: 200px;
							padding: 10px 12px;
						}
						.button{
							width: 290px;
						}
						.special{
							width: 290px;
							gap: 7px;
						}
					}
				`;
		this.shadow.appendChild(div);
		this.shadow.appendChild(style);
		this.addlisteners();
	}
}
customElements.define("result-page", ResultPage);
