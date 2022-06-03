import { Router } from "@vaadin/router";
import { state } from "../../state";
import { map, isEmpty } from "lodash";
import Swal from "sweetalert2";
class SigningPage extends HTMLElement {
	constructor() {
		super();
	}
	roomId = state.getState().roomId;
	shadow = this.attachShadow({ mode: "open" });
	connectedCallback() {
		this.render();
		setTimeout(() => {
			const currentState = state.getState();
			const name = currentState.name;
			const currentGame = map(currentState.currentGame);
			if (currentGame.length == 2) {
				if (currentGame[0].name == name || currentGame[1].name == name) {
					state.login();
					Router.go("/instructions");
				} else {
					Swal.fire({
						title: "The room is complete",
						text: "You have to access into another room",
						icon: "warning",
						confirmButtonColor: "#006CFC",
					});
					Router.go("/load");
				}
			}
			if (currentGame.length == 1) {
				if (currentGame[0].name == name) {
					state.login();
					Router.go("/instructions");
				} else {
					state.firstLogin();
					Router.go("/instructions");
				}
			}
			if (isEmpty(currentGame)) {
				state.firstLogin();
				Router.go("/instructions");
			}
		}, 2000);
	}
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		div.innerHTML = `
                    <div>
                        <my-text tag="h4">Room: ${this.roomId}</my-text>
                    </div>
                    <my-text class="text" tag="p">Signing you in...</my-text>
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
	}
}
customElements.define("signing-page", SigningPage);
