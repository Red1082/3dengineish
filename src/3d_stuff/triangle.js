import Vertex from './vertex.js';
import { applyMatrix3 } from '../matrix_math.js';

const CAMERA_POS = [0, 0, 1000];

export default class Triangle {
	constructor(x0, y0, z0, x1, y1, z1, x2, y2, z2, c0, c1, c2) {
		this.vertices = [
			new Vertex(x0, y0, z0, c0),
			new Vertex(x1, y1, z1, c1),
			new Vertex(x2, y2, z2, c2)
		];
		this.center = [
			(x0 + x1 + x2) / 3,
			(y0 + y1 + y2) / 3,
			(z0 + z1 + z2) / 3
		];
		this.depth = Math.hypot(
			this.center[0] - CAMERA_POS[0],
			this.center[1] - CAMERA_POS[1],
			this.center[2] - CAMERA_POS[2],
		);

		const ax = this.vertices[1].x - this.vertices[0].x;
		const ay = this.vertices[1].y - this.vertices[0].y;
		const az = this.vertices[1].z - this.vertices[0].z;
		const bx = this.vertices[2].x - this.vertices[0].x;
		const by = this.vertices[2].y - this.vertices[0].y;
		const bz = this.vertices[2].z - this.vertices[0].z;

		const kx = ay * bz - az * bx;
		const ky = az * bx - ax * bx;
		const kz = ax * by - ay * bx;

		const mag = Math.hypot(kx, ky, kz);

		const invMag = 1 / (mag > 0 ? mag : 1);


		this.normal = [
			kx * invMag,
			ky * invMag,
			kz * invMag
		];

	}
	/*
	static transform(triangle, m) {
		const zoffset = 2;
		const q0 = 1 / (triangle.vertices[0].z + zoffset);
		const q1 = 1 / (triangle.vertices[1].z + zoffset);
		const q2 = 1 / (triangle.vertices[2].z + zoffset);

		const tv0 = applyMatrix3(
			applyMatrix3(
				triangle.vertices[0],
				[
					q0, 0, 0, 0,
					0, q0, 0, 0,
					0, 0, 1, 0
				]
			),
			m
		);
		const tv1 = applyMatrix3(triangle.vertices[1], m);
		const tv2 = applyMatrix3(triangle.vertices[2], m);

		return new Triangle(
			tv0.x, tv0.y, tv0.z,
			tv1.x, tv1.y, tv1.z,
			tv2.x, tv2.y, tv2.z,
			triangle.vertices[0].color,
			triangle.vertices[1].color,
			triangle.vertices[2].color
		);
	}
	*/
}