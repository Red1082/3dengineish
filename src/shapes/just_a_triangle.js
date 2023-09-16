import Mesh from '../3d_stuff/mesh.js';
import Triangle from '../3d_stuff/triangle.js';
import Vertex from '../3d_stuff/vertex.js';
import { color } from '../color.js';

const RED = color(255, 0, 0);
const GREEN = color(0, 255, 0);
const BLUE = color(0, 0, 255);
const SQRT_3_OVER3 = Math.sqrt(3) / 2;

export default class JAT {
	constructor() {
		this.mesh = Mesh.fromTriangles([
			new Triangle(0, 1, 0, SQRT_3_OVER3, -.5, 0, -SQRT_3_OVER3, -.5, 0, RED, GREEN, BLUE)
		]);
	}
}