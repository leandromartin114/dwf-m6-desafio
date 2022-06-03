import { state } from "../../state";
export function initScorepage(params) {
	const div = document.createElement("div");
	const style = document.createElement("style");
	renderPage();
	state.subscribe(() => {
		renderPage();
	});
	function renderPage() {
		let tieCounter = 0;
		let wonCounter = 0;
		let lostCounter = 0;
		const results = state.getState().history;
		div.classList.add("content");
		for (const r of results) {
			if (state.defineWinner(r.userGame, r.pcGame) == "¡It's a Tie!") {
				tieCounter++;
			}
			if (state.defineWinner(r.userGame, r.pcGame) == "¡You Won!") {
				wonCounter++;
			}
			if (state.defineWinner(r.userGame, r.pcGame) == "¡You Lost!") {
				lostCounter++;
			}
		}
		div.innerHTML = `
                    <my-text class="text" tag="h1">Score</my-text>
					<div class="special">
						<div class="score">
							<my-text tag="h3">Score</my-text>
							<my-text tag="h4">You: ${wonCounter.toString()}</my-text>
							<my-text tag="h4">Computer: ${lostCounter.toString()}</my-text>
							<my-text tag="h4">Ties: ${tieCounter.toString()}</my-text>
						</div>
						<my-button type="reset" class="reset">Reset Game</my-button>
					</div>
					<my-button class="button play">Play</my-button>
					<my-button class="button home">Home</my-button>
				`;
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
						border: 8px solid black;
						border-radius: 8px;
						width: 260px;
						height: 195px;
						background-color: white;
						color: black;
						padding: 8px 12px;
						display: flex;
						justify-content: center;
						flex-direction: column;
						font-family: 'Odibee Sans', cursive;
					}
					.button{
						width: 260px;
					}
					.special{
						width: 260px;
						display: grid;
						gap: 5px
					}
					@media (min-width: 969px){
						.score{
							border: 10px solid black;
							width: 300px;
							height: 210px;
							padding: 12px 15px;
						}
						.button{
							width: 300px;
						}
						.special{
							width: 300px;
							gap: 8px;
						}
					}
				`;
		listeners();
	}
	function listeners() {
		div.appendChild(style);
		const playEl = div.querySelector(".play");
		playEl.addEventListener("click", () => {
			params.goTo("/game");
		});
		const homeEl = div.querySelector(".home");
		homeEl.addEventListener("click", () => {
			params.goTo("/home");
		});
		const resetEl = div.querySelector(".reset");
		resetEl.addEventListener("click", () => {
			state.resetHistory();
		});
	}
	return div;
}
