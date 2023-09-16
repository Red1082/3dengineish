import Mesh from '../3d_stuff/mesh.js';
import Triangle from '../3d_stuff/triangle.js';
import Vertex from '../3d_stuff/vertex.js';
import { color } from '../color.js';

const RED = color(255, 0, 0);
const GREEN = color(0, 255, 0);
const BLUE = color(0, 0, 255);
const TOP_COLOR = color(255, 255, 255);

export default class Pyramid {
	static H = 2;
	constructor() {
		this.mesh = Mesh.fromTriangles([
			new Triangle(-1, 1, -1, 1, 1, -1, -1, 1, 1, RED, GREEN, BLUE),
			new Triangle(-1, 1, 1, 1, 1, -1, 1, 1, 1, BLUE, GREEN, RED),
			new Triangle(-1, 1, -1, 0, -Pyramid.H, 0, 1, 1, -1, RED, TOP_COLOR, GREEN),
			new Triangle(1, 1, -1, 0, -Pyramid.H, 0, 1, 1, 1, GREEN, TOP_COLOR, RED),
			new Triangle(1, 1, 1, 0, -Pyramid.H, 0, -1, 1, 1, RED, TOP_COLOR, BLUE),
			new Triangle(-1, 1, 1, 0, -Pyramid.H, 0, -1, 1, -1, BLUE, TOP_COLOR, RED)
		]);
	}
}