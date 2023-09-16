import Vertex from './vertex.js';
import Triangle from './triangle.js';
import { color } from '../color.js';
import { applyMatrix3 } from '../matrix_math.js';

export default class Mesh {
	constructor() {
		this.triangles = [];
	}

	static fromVertices(data) {
		const mesh = new Mesh();

		const p = data.slice(0, data.length >> 1);
		const c = data.slice(data.length >> 1);

		for (let i = 0; i < p.length / 6; i++) {
			mesh.triangles.push(
				new Triangle(
					p[3 * i + 0], p[3 * i + 1], p[3 * i + 2],
					p[3 * i + 3], p[3 * i + 4], p[3 * i + 5],
					p[3 * i + 6], p[3 * i + 7], p[3 * i + 8],
					color(255 * c[3 * i + 0], 255 * c[3 * i + 1], 255 * c[3 * i + 2]),
					color(255 * c[3 * i + 3], 255 * c[3 * i + 4], 255 * c[3 * i + 5]),
					color(255 * c[3 * i + 6], 255 * c[3 * i + 7], 255 * c[3 * i + 8]),
				)
			);
		}
	}

	rotate(gamma, beta, alpha) {
		const sa = Math.sin(alpha);
		const sb = Math.sin(beta);
		const sg = Math.sin(gamma);
		const ca = Math.cos(alpha);
		const cb = Math.cos(beta);
		const cg = Math.cos(gamma);
		const ROTATION_MATRIX = [
			ca * cb, ca * sb * sg - sa * cg, ca * sb * cg + sa * sg, 0,
			sa * cb, sa * sb * sg + ca * cg, sa * sb * cg - ca * sg, 0,
			-sb, cb * sg, cb * cg, 0
		];
		this.triangles = this.triangles.map(triangle => {
			const v0 = applyMatrix3(triangle.vertices[0], ROTATION_MATRIX);
			const v1 = applyMatrix3(triangle.vertices[1], ROTATION_MATRIX);
			const v2 = applyMatrix3(triangle.vertices[2], ROTATION_MATRIX);
			return new Triangle(
				v0.x, v0.y, v0.z,
				v1.x, v1.y, v1.z,
				v2.x, v2.y, v2.z,
				v0.color, v1.color, v2.color
			);
		});
	}

	static fromTriangles(triangles) {
		let mesh = new Mesh();
		mesh.triangles = triangles;
		return mesh;
	}
}