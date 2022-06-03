import { Router } from "@vaadin/router";
import { state } from "../../state";
class NewGamePage extends HTMLElement {
	constructor() {
		super();
	}
	shadow = this.attachShadow({ mode: "open" });
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const newFormEl = this.shadow.querySelector(".new");
		newFormEl.addEventListener("send", (e: any) => {
			const target = e.detail;
			state.setNameAndRoomId(target.name);
			state.createUser((err) => {
				if (err) {
					console.error("There was a problem with de user");
				}
				state.createRoom(() => {
					state.getRoom(() => {
						Router.go("/room");
					});
				});
			});
		});
	}
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		div.innerHTML = `
                    <my-text class="text" tag="h1">Rock Paper Scissors</my-text>
                    <short-form class="new"></short-form>
                    <div class="moves">
                        <div ><my-play type="piedra" tag="small"></></div>
                        <div ><my-play type="papel" tag="small"></></div>
                        <div ><my-play type="tijera" tag="small"></></div>
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
                    .text{
                        width: 300px;
                        height: 210px;
                        display: flex;
                        align-items: center;
                    }
                    .moves{
                        display: flex;
                        width: 300px;
                        justify-content: space-between;
                    }
                    @media (min-width: 969px){
                        .text{
                            width: 330px;
                            height: 230px;
                        }
                        .new{
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
customElements.define("new-game", NewGamePage);
