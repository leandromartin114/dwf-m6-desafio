class myButton extends HTMLElement {
	constructor() {
		super();
	}
	shadow = this.attachShadow({ mode: "open" });
	text = this.textContent;
	types = ["normal", "reset"];
	type: string = "normal";
	connectedCallback() {
		if (this.types.includes(this.getAttribute("type"))) {
			this.type = this.getAttribute("type") || this.type;
		}
		this.render();
	}
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		div.innerHTML = `
				<button class="${this.type}">${this.text}</button>
			`;
		style.innerHTML = `
				.root{
					width: 100%;
				}
				.normal{
					font-size: 32px;
					background-color: #006CFC;
					border: 5px solid #001997;
					border-radius: 8px;
					width: 100%;
					padding: 5px 2px;
					color: white;
					font-family: 'Odibee Sans', cursive;
					font-weight: 400;
				}
				.normal:active{
					color: rgba(208, 212, 214, 0.918);
				}
				.normal:hover{
					color: rgba(208, 212, 214, 0.918);
				}
				.reset{
					font-size: 23px;
					background-color: #f54848;
					border: 5px solid #9e0c07;
					border-radius: 8px;
					width: 100%;
					padding: 2px;
					color: white;
					font-family: 'Odibee Sans', cursive;
					font-weight: 500;
					display: flex;
                    justify-content: center;
				}
				.reset:active{
					color: rgba(208, 212, 214, 0.918);
				}
				.reset:hover{
					color: rgba(208, 212, 214, 0.918);
				}
				@media (min-width: 969px){
					.normal{
						font-size: 38px;
						border: 7px solid #001997;
						padding: 7px 3px;
					}
					.reset{
						font-size: 26px;
						border: 7px solid #9e0c07;
						padding: 5px 2px;
					}
				}
			`;
		div.classList.add("root");
		this.shadow.appendChild(div);
		this.shadow.appendChild(style);
	}
}
customElements.define("my-button", myButton);
