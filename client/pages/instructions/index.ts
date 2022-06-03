import { Router } from "@vaadin/router";
import { state } from "../../state";
import { map } from "lodash";
class InstructionsPage extends HTMLElement {
	constructor() {
		super();
	}
	player1 = "p1";
	player2 = "p2";
	p1Score = "";
	p2Score = "";
	roomId = "";
	shadow = this.attachShadow({ mode: "open" });
	connectedCallback() {
		const currentState = state.getState();
		const score = map(currentState.score);
		if (score.length == 2) {
			if (score[0].name == currentState.name) {
				const player1Name = score[0].name;
				const player2Name = score[1].name;
				this.player1 = player1Name;
				this.player2 = player2Name;
				this.p1Score = score[0].score;
				this.p2Score = score[1].score;
			}
			if (score[1].name == currentState.name) {
				const player1Name = score[1].name;
				const player2Name = score[0].name;
				this.player1 = player1Name;
				this.player2 = player2Name;
				this.p1Score = score[1].score;
				this.p2Score = score[0].score;
			}
		}
		if (score.length == 1) {
			this.player1 = currentState.name;
			this.player2 = "Opponent";
			this.p1Score = score[0].score;
			this.p2Score = "0";
		}
		this.shadow.firstChild?.remove();
		this.render();
		state.subscribe(() => {
			const currentState = state.getState();
			const score = map(currentState.score);
			if (score.length == 2) {
				if (score[0].name == currentState.name) {
					const player1Name = score[0].name;
					const player2Name = score[1].name;
					this.player1 = player1Name;
					this.player2 = player2Name;
					this.p1Score = score[0].score;
					this.p2Score = score[1].score;
				}
				if (score[1].name == currentState.name) {
					const player1Name = score[1].name;
					const player2Name = score[0].name;
					this.player1 = player1Name;
					this.player2 = player2Name;
					this.p1Score = score[1].score;
					this.p2Score = score[0].score;
				}
			}
			if (score.length == 1) {
				this.player1 = currentState.name;
				this.player2 = "Opponent";
				this.p1Score = score[0].score;
				this.p2Score = "0";
			}
		});
	}
	addListeners() {
		const playEl = this.shadow.querySelector(".play-button");
		playEl.addEventListener("click", () => {
			state.start(() => {
				const currentState = state.getState();
				const currentGame = map(currentState.currentGame);
				if (currentGame[0].start == true && currentGame[1].start == true) {
					Router.go("/game");
				} else {
					Router.go("/await");
				}
			});
		});
		window.addEventListener("beforeunload", () => {
			state.logoff();
		});
	}
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		this.roomId = state.getState().roomId;
		div.innerHTML = `
                    <div class="header">
                        <div>
                            <my-text tag="h5">${this.player1} : ${this.p1Score}</my-text>
                            <my-text tag="h5">${this.player2} : ${this.p2Score}</my-text>
                        </div>
                        <div>
                            <my-text tag="h4">Room: ${this.roomId}</my-text>
                        </div>
                    </div>
                    <my-text class="text" tag="p">Press "Play" and choose: 
                    rock, paper or scissors before the countdown ends.</my-text>
                    <my-button class="play-button">Play</my-button>
                    <div class="moves">
                        <div ><my-play type="piedra"></></div>
                        <div ><my-play type="papel"></></div>
                        <div ><my-play type="tijera"></></div>
                    </div>
                `;
		div.classList.add("content");
		style.innerHTML = `
                    .content{
                        padding: 20px 15px;
                        height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .header{
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        width: 100%;
                        margin-bottom: 20px;
                    }
                    .text{
                        width: 350px;
                    }
                    .play-button{
                        width: 300px;
                        margin: 25px 0;
                    }
                    .moves{
                        display: flex;
                        width: 300px;
                        justify-content: space-between;
                    }
                    @media (min-width: 969px){
                        .text{
                            width: 350px;
                        }
                        .button{
                            width: 350px;
                        }
                        .moves{
                            width: 350px;
                        }
                    }
                `;
		this.shadow.appendChild(div);
		this.shadow.appendChild(style);
		this.addListeners();
	}
}
customElements.define("instructions-page", InstructionsPage);
