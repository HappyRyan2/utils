class CanvasIO {
	constructor(canvasID = "", canvasType = "fill-parent", parentElement = document.body) {
		this.canvas = document.createElement("canvas");
		this.canvas.id = canvasID;
		this.ctx = this.canvas.getContext("2d");
		this.canvasType = canvasType;
		this.parentElement = parentElement;

		this.keys = {};
		this.mouse = new Vector();
	}

	activate() {
		if(this.canvasType === "fill-parent") {
			/* add the canvas to fill its parent element, and update the internal width / height of the canvas so that 1 canvas pixel = 1 on-screen pixel*/
			this.parentElement.appendChild(this.canvas);
			this.canvas.style.width = "100%";
			this.canvas.style.height = "100%";
			if(this.parentElement === document.body) {
				this.parentElement.style.margin = "0px";
				this.parentElement.style.overflow = "hidden";

				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
				window.addEventListener("resize", () => {
					this.canvas.width = window.innerWidth;
					this.canvas.height = window.innerHeight;
				});
			}
		}

		this.parentElement.addEventListener("keydown", (event) => {
			this.keys[event.code] = true;
		});
		this.parentElement.addEventListener("keyup", (event) => {
			this.keys[event.code] = false;
		});
		this.canvas.addEventListener("mousedown", (event) => {
			this.mouse.pressed = true;
			this.mouse.button = (event.which === 3) ? "right" : "left";
		});
		this.canvas.addEventListener("mouseup", (event) => {
			this.mouse.pressed = false;
			this.mouse.button = null;
		});
		this.canvas.addEventListener("mousemove", (event) => {
			const canvasRect = this.canvas.getBoundingClientRect();
			this.mouse.x = (event.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * this.canvas.width
			this.mouse.y = (event.clientY - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * this.canvas.height;
		});
		this.canvas.addEventListener("contextmenu", (event) => {
			event.preventDefault();
		});
	}
}
