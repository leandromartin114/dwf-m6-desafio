const papelURL = require("url:../../../client/img/papel.png");
const piedraURL = require("url:../../../client/img/piedra.png");
const tijeraURL = require("url:../../../client/img/tijera.png");
class Play extends HTMLElement {
	constructor() {
		super();
	}
	shadow = this.attachShadow({ mode: "open" });
	types = ["piedra", "papel", "tijera"];
	type: string = "papel";
	tags = ["small", "medium", "large"];
	tag: string = "small";
	connectedCallback() {
		if (this.types.includes(this.getAttribute("type"))) {
			this.type = this.getAttribute("type") || this.type;
		}
		if (this.tags.includes(this.getAttribute("tag"))) {
			this.tag = this.getAttribute("tag") || this.tag;
		}
		this.type = this.getAttribute("type");
		this.render();
	}
	addListeners() {
		const imgEl: HTMLElement = this.shadow.querySelector(".img");
		imgEl.addEventListener("click", (e: any) => {
			imgEl.style.border = "10px solid #53555c";
			imgEl.style.borderRadius = "100%";
			imgEl.style.transition = "border 0.6s";
			const myEvent = new CustomEvent("play", {
				detail: {
					value: this.type,
				},
			});
			this.dispatchEvent(myEvent);
		});
	}
	choosePlay(play) {
		if (play == "papel") {
			return papelURL;
		}
		if (play == "piedra") {
			return piedraURL;
		}
		if (play == "tijera") {
			return tijeraURL;
		}
	}
	chooseSize(size) {
		if (size == "small") {
			return "small";
		}
		if (size == "medium") {
			return "medium";
		}
		if (size == "large") {
			return "large";
		}
	}
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		div.innerHTML = `
			<img type="${this.type}" class="img ${this.chooseSize(
			this.tag
		)}" src="${this.choosePlay(this.type)}">
			`;
		style.innerHTML = `
			.small{
				width: 85px;
				height: 85px;
			}
			.medium{
				width: 100px;
				height: 100px;
			}
			.medium:hover{
				border: 5px solid rgba(208, 212, 214, 0.918);
				border-radius: 100%;
				transition: border 0.3s;
			}
			.large{
				width: 180px;
				height: 180px;
			}
			@media (min-width: 969px){
				.small{
					width: 95px;
					height: 95px;
				}
				.medium{
					width: 120px;
					height: 120px;
				}
				.large{
					width: 220px;
					height: 220px;
				}
			}
            `;
		this.shadow.appendChild(div);
		this.shadow.appendChild(style);
		this.addListeners();
	}
}
customElements.define("my-play", Play);
