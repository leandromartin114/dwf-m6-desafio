class MyText extends HTMLElement {
	constructor() {
		super();
		if (this.tags.includes(this.getAttribute("tag"))) {
			this.tag = this.getAttribute("tag") || this.tag;
		}
	}
	connectedCallback() {
		this.render();
	}
	text = this.textContent;
	tags: string[] = ["h1", "h3", "h4", "h5", "p"];
	tag: string = "p";
	shadow = this.attachShadow({ mode: "open" });
	render() {
		const textEl = document.createElement(this.tag);
		textEl.textContent = this.text;
		const style = document.createElement("style");
		style.innerHTML = `
                h1{
					margin: 0;
                    color: #009048;
                    font-size: 60px;
                    font-weight: 700;
                    text-align: center;
					line-height: 66px;
                }
				h3{
					margin: 0 0 15px 0;
                    font-size: 38px;
                    text-align: center;
                    font-weight: 700;
				}
				h4{
					margin: 0;
                    font-size: 30px;
                    text-align: right;
                    font-weight: 500;
				}
				h5{
					margin: 0;
                    font-size: 25px;
                    text-align: right;
                    font-weight: 400;
				}
                p{
					margin: 0;
                    font-size: 40px;
                    font-weight: 500;
                    text-align: center;
                }
				@media (min-width: 969px){
					h1{
						font-size: 68px;
						line-height: 70px;
					}
					h3{
						font-size: 45px;
					}
					h4{
						font-size: 35px;
					}
					h5{
						font-size: 28px;
					}
					p{
						font-size: 46px;
					}
				}
            `;
		this.shadow.appendChild(textEl);
		this.shadow.appendChild(style);
	}
}
customElements.define("my-text", MyText);
