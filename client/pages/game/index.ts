import Swal from "sweetalert2";
import { Router } from "@vaadin/router";
import { state } from "../../state";
class GamePage extends HTMLElement {
	constructor() {
		super();
	}
	currentState = state.getState();
	currentGame = {};
	shadow = this.attachShadow({ mode: "open" });
	connectedCallback() {
		this.render();
	}
	render() {
		const div = document.createElement("div");
		div.classList.add("content");
		const style = document.createElement("style");
		div.innerHTML = ` 
            <div class="counter-container"></div>
            <ul class="moves">
                <my-play class="piedra" type="piedra" tag="medium"></my-play>
                <my-play class="papel" type="papel" tag="medium"></my-play>
                <my-play class="tijera" type="tijera" tag="medium"></my-play>
            </ul>
            `;
		style.innerHTML = `
            .content{
                padding: 0;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
            }
            .moves{
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 13px;
                width: 334px;
				height: 180px;
                justify-items: center;
                align-items: center;
                margin: 0;
                padding: 0;
            }
			@media (min-width: 969px){
				.moves{
					width: 470px;
					gap: 32px;
				}
			}
            `;
		this.shadow.appendChild(div);
		this.shadow.appendChild(style);
		this.addListeners();
	}
	addListeners() {
		const counterContainer = this.shadow.querySelector(".counter-container");
		counterContainer.innerHTML = `<count-down>5</count-down>`;
		let counter = 6;
		const interval = setInterval(() => {
			counter--;
			counterContainer.innerHTML = `<count-down>${counter.toString()}</count-down>`;
			if (counter == 0) {
				clearInterval(interval);
				Swal.fire({
					title: "You didn't choose!",
					text: "Remember, you must choose before the countdown ends",
					icon: "warning",
					confirmButtonColor: "#006CFC",
				});
				state.end();
				console.log("no jugaste");
				Router.go("/instructions");
			}
		}, 1000);
		const piedraEl: HTMLElement = this.shadow.querySelector(".piedra");
		piedraEl.addEventListener("play", (e: any) => {
			clearInterval(interval);
			const myMove = e.detail.value;
			state.sendMove(myMove);
			setTimeout(() => {
				Router.go("/moves");
			}, 3000);
		});
		const papelEl: HTMLElement = this.shadow.querySelector(".papel");
		papelEl.addEventListener("play", (e: any) => {
			clearInterval(interval);
			const myMove = e.detail.value;
			state.sendMove(myMove);
			setTimeout(() => {
				Router.go("/moves");
			}, 3000);
		});
		const tijeraEl: HTMLElement = this.shadow.querySelector(".tijera");
		tijeraEl.addEventListener("play", (e: any) => {
			clearInterval(interval);
			const myMove = e.detail.value;
			state.sendMove(myMove);
			setTimeout(() => {
				Router.go("/moves");
			}, 3000);
		});
	}
}
customElements.define("game-page", GamePage);
