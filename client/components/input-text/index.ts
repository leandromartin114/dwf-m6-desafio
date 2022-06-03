class InputText extends HTMLElement {
	constructor() {
		super();
	}
	shadow = this.attachShadow({ mode: "open" });
	text = this.textContent;
	connectedCallback() {
		this.render();
	}
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		div.innerHTML = `
                <input type="text" name="text" class="input" placeholder="${this.text}">
			`;
		style.innerHTML = `
				.root{
					width: 100%;
				}
				.input{
                    box-sizing: border-box;
					font-size: 32px;
					border: 5px solid #001997;
					border-radius: 8px;
					width: 100%;
					padding: 5px 2px;
					font-family: 'Odibee Sans', cursive;
					font-weight: 400;
                    text-align: center;
				}
				.input:active{
                    background-color: #f5f5dc;
				}
				.input:hover{
                    background-color: #f5f5dc;
				}
				@media (min-width: 969px){
					.input{
						font-size: 38px;
						border: 7px solid #001997;
						padding: 7px 3px;
					}
				}
			`;
		div.classList.add("root");
		this.shadow.appendChild(div);
		this.shadow.appendChild(style);
	}
}
customElements.define("input-text", InputText);
