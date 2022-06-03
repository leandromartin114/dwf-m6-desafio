class CountDown extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.render();
	}
	shadow = this.attachShadow({ mode: "open" });
	text = this.textContent;
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		div.textContent = this.text;
		div.classList.add("root");
		style.innerHTML = `
                .root{
                    border: 20px solid black;
                    border-radius: 100%;
                    width: 210px;
                    height: 210px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 110px;
                    font-weight: 700;
					font-family: 'Odibee Sans', cursive;
                }
				@media (min-width: 969px){
					.root{
						width: 250px;
						height: 250px;
					}
				}
            `;
		this.shadow.appendChild(div);
		this.shadow.appendChild(style);
	}
}
customElements.define("count-down", CountDown);
