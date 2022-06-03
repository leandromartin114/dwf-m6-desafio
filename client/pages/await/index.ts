import { Router } from "@vaadin/router";
import { state } from "../../state";
import { map } from "lodash";
class AwaitPage extends HTMLElement {
	constructor() {
		super();
	}
	player1 = "";
	player2 = "";
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
			const currentGame = map(currentState.currentGame);
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
			if (currentGame[0].start == true && currentGame[1].start == true) {
				Router.go("/game");
			}
		});
	}
	addListeners() {
		window.addEventListener("beforeunload", () => {
			state.logoff();
		});
	}
	render() {
		const currentState = state.getState();
		const score = map(currentState.score);
		this.roomId = currentState.roomId;
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
		const div = document.createElement("div");
		const style = document.createElement("style");
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
                    <my-text class="text" tag="p">Waiting for ${this.player2} to push the PLAY button.</my-text>
                    <div class="moves">
                        <div ><my-play type="piedra"></></div>
                        <div ><my-play type="papel"></></div>
                        <div ><my-play type="tijera"></></div>
                    </div>
                `;
		div.classList.add("content");
		style.innerHTML = `
                    .content{
                        padding: 30px 15px;
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
                        margin-bottom: 40px;
                    }
                    .text{
                        width: 300px;
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
customElements.define("await-page", AwaitPage);
