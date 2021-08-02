class CanvasIO {
	constructor(canvasID = "", canvasType = "fill-parent", parentElement = document.body) {
		this.canvas = document.createElement("canvas");
		this.canvas.id = canvasID;
		this.ctx = this.canvas.getContext("2d");
		this.canvasType = canvasType;
		this.parentElement = parentElement;
	}

	activate() {
		if(this.canvasType === "fill-parent") {
			/* add the canvas to fill its parent element, and update the internal width / height of the canvas so that 1 canvas pixel = 1 on-screen pixel*/
			this.parentElement.appendChild(this.canvas);
			this.canvas.style.width = "100%";
			this.canvas.style.height = "100%";
			if(this.parentElement === document.body) {
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
				window.addEventListener("resize", () => {
					this.canvas.width = window.innerWidth;
					this.canvas.height = window.innerHeight;
				});
			}
		}
	}
}
