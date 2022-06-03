import { Router } from "@vaadin/router";
import { state } from "../../state";
class RoomPage extends HTMLElement {
	constructor() {
		super();
	}
	shadow = this.attachShadow({ mode: "open" });
	roomId = state.getState().roomId;
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const playButtonEl = this.shadow.querySelector(".play");
		playButtonEl.addEventListener("click", () => {
			Router.go("/signing");
		});
	}
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		div.innerHTML = `
                    <div class="text">
                        <div>
                            <my-text tag="p">Game room code:</my-text>
                        </div>
                        <div>
                            <my-text class="color" tag="h3">${this.roomId}</my-text>
                        </div>
                        <div>
                            <my-text tag="p">Share this code with your opponent</my-text>
                        </div>
                    </div>
                    <my-button class="play">Play</my-button>
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
                        display: grid;
                        gap: 10px;
                        justify-content: center;
                    }
                    .color{
                        color: #009048;
                    }
                    .play{
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
                        .play{
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
customElements.define("room-page", RoomPage);
