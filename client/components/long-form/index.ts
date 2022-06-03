class LongForm extends HTMLElement {
	constructor() {
		super();
	}
	shadow = this.attachShadow({ mode: "open" });
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const longF = this.shadow.querySelector(".long-form") as HTMLFormElement;
		longF.addEventListener("submit", (e: any) => {
			e.preventDefault();
			const data = e.target;
			const myEvent = new CustomEvent("send", {
				detail: {
					name: data.name.value,
					code: data.code.value,
				},
			});
			this.dispatchEvent(myEvent);
			longF.reset();
		});
	}
	render() {
		const div = document.createElement("div");
		const style = document.createElement("style");
		div.innerHTML = `
                    <form class="long-form">
                        <input class ="input" name="name" type="text" placeholder="Your name">
                        <input class ="input" name="code" type="text" placeholder="Game code">
                        <button class="button">Enter Game</button> 
                    </form>
                `;
		style.innerHTML = `
                    .long-form{
                        width: 300px;
                        display: grid;
                        gap: 30px;
                        justify-content: center;
                        align-items: center;
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
                    input::placeholder{
                        color: #cfd6c0;
                    }
                    .input:active{
                        background-color: #f5f5dc;
                    }
                    .input:hover{
                        background-color: #f5f5dc;
                    }
                    .button{
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
                    .button:active{
                        color: rgba(208, 212, 214, 0.918);
                    }
                    .button:hover{
                        color: rgba(208, 212, 214, 0.918);
                    }
                    @media (min-width: 969px){
                        .input{
                            font-size: 38px;
                            border: 7px solid #001997;
                            padding: 7px 3px;
                        }
                        .long-form{
                            width: 350px;
                        }
                        .button{
                            font-size: 38px;
                            border: 7px solid #001997;
                            padding: 7px 3px;
                        }
                    }
                `;
		this.shadow.appendChild(div);
		this.shadow.appendChild(style);
		this.addListeners();
	}
}
customElements.define("long-form", LongForm);
