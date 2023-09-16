import Vertex from './3d_stuff/vertex.js';

const applyMatrix3 = (v, m) => {
	return new Vertex(
		v.x * m[0] + v.y * m[1] + v.z * m[2] + m[3],
		v.x * m[4] + v.y * m[5] + v.z * m[6] + m[7],
		v.x * m[8] + v.y * m[9] + v.z * m[10] + m[11],
		v.color
	);
};

const fieldOfView = Math.PI * .5;
const tsu = 1 / Math.tan(fieldOfView / 2);

const applyWPMatrix = (v, scale, offset) => {
	const a = tsu * scale / (v.z - 2);
	return applyMatrix3(v, [
		a, 0, 0, offset.x,
		0, a, 0, offset.y,
		0, 0, 1, offset.z
	]);
};

export { applyMatrix3, applyWPMatrix};