import Mesh from '../3d_stuff/mesh.js';
import Triangle from '../3d_stuff/triangle.js';
import Vertex from '../3d_stuff/vertex.js';
import { color } from '../color.js';

export default class Cube {
	constructor() {
		const RED = color(255, 0, 0);
		const GREEN = color(0, 255, 0);
		const BLUE = color(0, 0, 255);
		const YELLOW = color(255, 255, 0);
		
		this.mesh = Mesh.fromTriangles([
			//north
			new Triangle(-.5, -.5, -.5, .5, -.5, -.5, .5, .5, -.5, RED, GREEN, BLUE),
			new Triangle(-.5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5, RED, YELLOW, BLUE),
			//south
			new Triangle(.5, .5, .5, .5, -.5, .5, -.5, -.5, .5, RED, YELLOW, BLUE),
			new Triangle(-.5, -.5, .5, -.5, .5, .5, .5, .5, .5, BLUE, GREEN, RED),
			//west
			new Triangle(-.5, .5, .5, -.5, -.5, .5, -.5, -.5, -.5, GREEN, BLUE, RED),
			new Triangle(-.5, -.5, -.5, -.5, .5, -.5, -.5, .5, .5, RED, YELLOW, GREEN),
			//east
			new Triangle(.5, .5, .5, .5, -.5, .5, .5, -.5, -.5, RED, YELLOW, GREEN),
			new Triangle(.5, -.5, -.5, .5, .5, -.5, .5, .5, .5, GREEN, BLUE, RED),
			//bottom
			new Triangle(.5, .5, .5, .5, .5, -.5, -.5, .5, -.5, RED, BLUE, YELLOW),
			new Triangle(-.5, .5, -.5, -.5, .5, .5, .5, .5, .5, YELLOW, GREEN, RED),
			//top
			new Triangle(.5, -.5, .5, .5, -.5, -.5, -.5, -.5, -.5, YELLOW, GREEN, RED),
			new Triangle(-.5, -.5, -.5, -.5, -.5, .5, .5, -.5, .5, RED, BLUE, YELLOW)
		]);
	}
}

/*
this.mesh = Mesh.fromTriangles([
			//north
			new Triangle(-.5, -.5, -.5, .5, -.5, -.5, .5, .5, -.5, RED, GREEN, BLUE),
			new Triangle(-.5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5, RED, YELLOW, BLUE),
			//south
			new Triangle(-.5, -.5, .5, .5, -.5, .5, .5, .5, .5, BLUE, YELLOW, RED),
			new Triangle(-.5, -.5, .5, -.5, .5, .5, .5, .5, .5, BLUE, GREEN, RED),
			//west
			new Triangle(-.5, -.5, -.5, -.5, -.5, .5, -.5, .5, .5, RED, BLUE, GREEN),
			new Triangle(-.5, -.5, -.5, -.5, .5, -.5, -.5, .5, .5, RED, YELLOW, GREEN),
			//east
			new Triangle(.5, -.5, -.5, .5, -.5, .5, .5, .5, .5, GREEN, YELLOW, RED),
			new Triangle(.5, -.5, -.5, .5, .5, -.5, .5, .5, .5, GREEN, BLUE, RED),
			//bottom
			new Triangle(-.5, .5, -.5, .5, .5, -.5, .5, .5, .5, YELLOW, BLUE, RED),
			new Triangle(-.5, .5, -.5, -.5, .5, .5, .5, .5, .5, YELLOW, GREEN, RED),
			//top
			new Triangle(-.5, -.5, -.5, .5, -.5, -.5, .5, -.5, .5, RED, GREEN, YELLOW),
			new Triangle(-.5, -.5, -.5, -.5, -.5, .5, .5, -.5, .5, RED, BLUE, YELLOW)
		]);
*/