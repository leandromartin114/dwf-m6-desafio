import { Router } from "@vaadin/router";
class HomePage extends HTMLElement {
	constructor() {
		super();
	}
	shadow = this.attachShadow({ mode: "open" });
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const newGameEl = this.shadow.querySelector(".new-game");
		newGameEl.addEventListener("click", () => {
			Router.go("/new");
		});
		const scoreEl = this.shadow.querySelector(".load-game");
		scoreEl.addEventListener("click", () => {
			Router.go("/load");
		});
	}
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		div.innerHTML = `
                    <my-text class="text" tag="h1">Rock Paper Scissors</my-text>
                    <div class="buttons-container">
                        <my-button class="button new-game">New Game</my-button>
                        <my-button class="button load-game">Load Game</my-button>
                    </div>
                    <div class="moves">
                        <div ><my-play type="piedra" tag="small"></></div>
                        <div ><my-play type="papel" tag="small"></></div>
                        <div ><my-play type="tijera" tag="small"></></div>
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
                    .text{
                        width: 300px;
                        height: 210px;
                        display: flex;
                        align-items: center;
                    }
                    .buttons-container{
                        width: 300px;
                        display: grid;
                        gap: 55px;
                        justify-content: center;
                        align-items: center;
                    }
                    .button{
                        width: 300px;
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
                        .buttons-container{
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
customElements.define("home-page", HomePage);
