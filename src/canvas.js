import { parseColor, lerpColor } from './color.js';
import Triangle from './3d_stuff/triangle.js';
import Vector from './libs/vector.js';
import { applyWPMatrix } from './matrix_math.js';
import { lerp } from './more_math.js';

const light = new Vector(100, 0, 0);


export default class Canvas {
	static RESOLUTION_MULTIPLIER = .5;
	static FOV = .5 * Math.PI;
	static IDENTITY_TRANSFORM_MATRIX = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0
	];
	constructor(params) {
		this.width = params.width * Canvas.RESOLUTION_MULTIPLIER;
		this.height = params.height * Canvas.RESOLUTION_MULTIPLIER;

		this.windowWidth = params.width;
		this.windowHeight = params.height;

		this.fieldOfView = Math.PI / 2;

		this.gameLoopFunction = params.gameLoop;
		this.isRunning = false;

		this.frameCount = 0;
		this.previousFrameTimeMillis = 0;
		this.frameRate = null;

		this.frameBufferLength = (this.width * this.height) << 2;
		this.clearFrameBuffer();

		this.parentNode = params.parentNode;
		this.#init(typeof params.canvasID === 'string' ? params.canvasID : '');
	}
	#init(canvasID) {
		this.node = this.parentNode.appendChild(
			Object.assign(document.createElement('canvas'), {
				width: this.width,
				height: this.height,
				id: canvasID
			})
		);
		Object.assign(this.node.style, {
			width: `${this.windowWidth}px`,
			height: `${this.windowHeight}px`
		});
		this.ctx = this.node.getContext('2d');
	}

	startGameLoop() {
		this.isRunning = true;
		const loop = timeMillis => {
			this.gameLoopFunction(timeMillis);
			this.frameRate = 1e3 / (timeMillis - this.previousFrameTimeMillis);
			this.previousFrameTimeMillis = timeMillis;
			this.frameCount++;
			if (this.isRunning)
				requestAnimationFrame(loop);
		};
		loop();
	}
	stopGameLoop() {
		this.isRunning = false;
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
	renderBackground(color) {
		const red = (color >> 24) & 0xFF;
		const green = (color >> 16) & 0xFF;
		const blue = (color >> 8) & 0xFF;
		const alpha = color & 0xFF;
		for (let i = 0; i < this.frameBufferLength; i += 4) {
			this.frameBuffer[i] = red;
			this.frameBuffer[i + 1] = green;
			this.frameBuffer[i + 2] = blue;
			this.frameBuffer[i + 3] = alpha;
		}
	}

	line(x0, y0, x1, y1, c0, c1) {
		this.ctx.beginPath();
		this.ctx.moveTo(x0, y0);
		this.ctx.lineTo(x1, y1);
		this.ctx.strokeStyle = '#18a55888';
		this.ctx.lineCap = 'round';
		this.ctx.lineWidth = 5;
		this.ctx.stroke();
	}

	renderTriangle(x0, y0, x1, y1, x2, y2, c0, c1, c2, depth) {
		
		const xMin = 0 | Math.min(x0, x1, x2);
		const yMin = 0 | Math.min(y0, y1, y2);
		const xMax = 0 | Math.max(x0, x1, x2);
		const yMax = 0 | Math.max(y0, y1, y2);

		const invDet = 1 / ((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0));

		const threshold = -.01;

		for (let y = yMin; y < yMax; y++) {
			if (y < 0 || y + 1 > this.height) continue;
			for (let x = xMin; x < xMax; x++) {
				
				const i = 4 * (x + y * this.width);

				if (x < 0 || x + 1 > this.width || this.frameBufferPixelStates[i >> 2] < depth) continue;

				//barycentric weights 
				const w1 = invDet * ((x - x0) * (y2 - y0) + (y - y0) * (x0 - x2));
				const w2 = invDet * ((x - x0) * (y0 - y1) + (y - y0) * (x1 - x0));
				const w0 = 1 - w1 - w2;

				//the point is not inside the triangle 
				if (w0 < threshold || w1 < threshold || w2 < threshold) continue;

				this.frameBuffer[i + 0] = w0 * ((c0 >> 24) & 0xFF) + w1 * ((c1 >> 24) & 0xFF) + w2 * ((c2 >> 24) & 0xFF);
				this.frameBuffer[i + 1] = w0 * ((c0 >> 16) & 0xFF) + w1 * ((c1 >> 16) & 0xFF) + w2 * ((c2 >> 16) & 0xFF);
				this.frameBuffer[i + 2] = w0 * ((c0 >>  8) & 0xFF) + w1 * ((c1 >>  8) & 0xFF) + w2 * ((c2 >>  8) & 0xFF);
				this.frameBuffer[i + 3] = 255;
				this.frameBufferPixelStates[i >> 2] = depth;

			}
		}
	}


	renderTriangleWireframe(triangle) {
		const tv = triangle.vertices;
		for (let i = 0; i < 3; i++) {
			const j = (i + 1) % 3;
			this.line(
				tv[i].x, tv[i].y,
				tv[j].x, tv[j].y,
				tv[i].color, tv[j].color
			);
		}
	}

	renderFrameBuffer() {
		let imageData = this.ctx.getImageData(0, 0, this.width, this.height);

		for (let i = 0; i < this.frameBufferLength; i++) {
			imageData.data[i] = this.frameBuffer[i];
		}

		this.clearFrameBuffer();

		this.ctx.putImageData(imageData, 0, 0);
	}

	clearFrameBuffer() {
		this.frameBuffer = new Uint8ClampedArray(this.frameBufferLength);
		this.frameBufferPixelStates = new Array(this.frameBufferLength >> 2).fill(Infinity);
	}

	renderMesh(mesh, scale, offset) {
		//no depth sorting f yeah
		mesh.triangles.forEach(triangle => {
			const v0 = applyWPMatrix(triangle.vertices[0], scale, offset);
			const v1 = applyWPMatrix(triangle.vertices[1], scale, offset);
			const v2 = applyWPMatrix(triangle.vertices[2], scale, offset);
			this.renderTriangle(
				v0.x, v0.y,
				v1.x, v1.y,
				v2.x, v2.y,
				v0.color, v1.color, v2.color,
				triangle.depth
			);
		});
	}

	renderMeshWireframe(mesh, matrix) {
		mesh.triangles.forEach(triangle => {
			//this.renderTriangleWireframe(Triangle.transform(triangle, matrix))
		});
	}

	displayFrameRate() {
		this.ctx.fillStyle = '#fff';
		this.ctx.font = '15px CourierNew';
		this.ctx.fillText(`${this.frameRate | 0} fps`, 8, 16);
	}
}