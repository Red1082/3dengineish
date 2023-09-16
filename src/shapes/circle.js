import Mesh from '../3d_stuff/mesh.js';
import Triangle from '../3d_stuff/triangle.js';
import Vertex from '../3d_stuff/vertex.js';
import { color, lerpColor} from '../color.js';

const CENTER_COLOR = color(255);
const COLOR_A = color(64);
const COLOR_B = color(64);

export default class Circle {
	constructor() {
		const N = 16;
		const dt = 1 / N;
		const deltaTheta = Math.PI * 2 * dt;
		let triangles = [];

		for (let i = 0; i < N; i++) {
			const t = i * dt;
			const theta = i * deltaTheta;
			triangles.push(new Triangle(
				Math.cos(theta), .1, Math.sin(theta),
				0, 0, 0,
				Math.cos(theta + deltaTheta), -.1, Math.sin(theta + deltaTheta),
				lerpColor(COLOR_A, COLOR_B, t),
				CENTER_COLOR,
				lerpColor(COLOR_A, COLOR_B, t + dt),
			));
		}
		
		this.mesh = Mesh.fromTriangles(triangles);
	}
}