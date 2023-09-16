import Canvas from './canvas.js';
import Vector from './libs/vector.js';
import InputManager from './libs/input_manager.js';
import { color } from './color.js';
import FullScreenButton from './libs/fsb.js';
FullScreenButton();

import Cube from './shapes/cube.js';
import JAT from './shapes/just_a_triangle.js';
import Pyramid from './shapes/pyramid.js';
import Circle from './shapes/circle.js';

const canvas = new Canvas({
	width: innerWidth,
	height: innerHeight,
	parentNode: document.body,
	canvasID: 'myCanvas',
	gameLoop: draw
});

const angularVelocity = new Vector();

const inputManager = new InputManager({
	targetNode: canvas.node,
	onPointerMove: ptrData => {
		angularVelocity.add(
			Vector.mult(ptrData.pointerMovement, .005)
		);
	}
})

const cube = new Cube();
const triangleShape = new JAT();
const pyramid = new Pyramid();
const circle = new Circle();

const OFFSET = new Vector(
	canvas.width >> 1,
	canvas.height >> 1
);

const LOCAL_TO_WORLD = (scale, offset) => [
		scale, 0, 0, offset.x,
		0, scale, 0, offset.y,
		0, 0, scale, offset.z
	];


function draw() {
	canvas.renderBackground(color(0));

	pyramid.mesh.rotate(angularVelocity.y, -angularVelocity.x, 0);
	cube.mesh.rotate(angularVelocity.y, -angularVelocity.x, 0);
	triangleShape.mesh.rotate(angularVelocity.y, -angularVelocity.x, 0);
	circle.mesh.rotate(angularVelocity.y, -angularVelocity.x, 0);


	angularVelocity.mult(.8);

	canvas.renderMesh(circle.mesh, 128, OFFSET);
/*	canvas.renderMesh(cube
	canvas.renderMesh(triangleShape.mesh, [
			32, 0, 0, OFFSET.x,
			0, 32, 0, OFFSET.y + 96,
			0, 0, 32, 0
		]);*/

	canvas.renderFrameBuffer();

	canvas.displayFrameRate();

}
canvas.startGameLoop();