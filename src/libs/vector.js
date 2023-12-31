const isNaNStrict = value => typeof value !== 'number';
const errorMessages = {
	SET_METHOD_INVALID_PARAMS: 'vectorInstance.set() expects either a Vector instance or either two or three numbers as parameters'
};

export default class Vector {
	constructor(x, y, z, w) {
		this.x = isNaNStrict(x) ? 0 : x;
		this.y = isNaNStrict(y) ? 0 : y;
		this.z = isNaNStrict(z) ? 0 : z;
		this.w = isNaNStrict(w) ? 0 : w;
	}
	mag() {
		return Math.hypot(this.x, this.y, this.z);
	}
	normalize() {
		return this.mult(1 / (this.mag() || 1));
	}
	setMag(value) {
		if (isNaNStrict(value) || value < 0)
			throw 'vectorInstance.setMag() expects a non-negative number as the parameter';
		return this.mult(value / (this.mag() || 1));
	}
	add(vectorInstance) {
		if (!Vector.isVector(vectorInstance))
			throw 'vectorInstance.add() expects a Vector instance as the parameter';
		this.x += vectorInstance.x;
		this.y += vectorInstance.y;
		this.z += vectorInstance.z;
		this.w += vectorInstance.w;
		return this;
	}
	sub(vectorInstance) {
		if (!Vector.isVector(vectorInstance))
			throw 'vectorInstance.sub() expects a Vector instance as the parameter';
		this.x -= vectorInstance.x;
		this.y -= vectorInstance.y;
		this.z -= vectorInstance.z;
		this.w -= vectorInstance.w;
		return this;
	}
	mult(value) {
		if (isNaNStrict(value))
			throw 'vectorInstance.mult() expects a number as the parameter';
		this.x *= value;
		this.y *= value;
		this.z *= value;
		return this;
	}
	div(value) {
		if (isNaNStrict(value) || value === 0)
			throw 'vectorInstance.div() expects a non-zero number as the parameter';
		this.x /= value;
		this.y /= value;
		this.z /= value;
		return this;
	}
	clampMag(min, max) {
		if (isNaNStrict(min) || isNaNStrict(max))
			throw 'vectorInstance.clampMag() expects two numbers as the parameters';
		return this.setMag(Math.max(min, Math.min(max, this.mag())));
	}
	set() {
		if (Vector.isVector(arguments[0])) {
			this.x = arguments[0].x;
			this.y = arguments[0].y;
			this.z = arguments[0].z;
			this.w = arguments[0].w;
		} else if (!isNaNStrict(arguments[0]) && !isNaNStrict(arguments[1]) && !isNaNStrict(arguments[2]) && !isNaNStrict(arguments[3])) {
			this.x = arguments[0];
			this.y = arguments[1];
			this.z = arguments[2];
			this.w = arguments[3];
		} else if (!isNaNStrict(arguments[0]) && !isNaNStrict(arguments[1]) && !isNaNStrict(arguments[2])) {
			this.x = arguments[0];
			this.y = arguments[1];
			this.z = arguments[2];
		} else if (!isNaNStrict(arguments[0]) && !isNaNStrict(arguments[1])) {
			this.x = arguments[0];
			this.y = arguments[1];
		}
		return this;
	}
	clone() {
		return new Vector(this.x, this.y, this.z);
	}
	asArray() {
		return [this.x, this.y, this.z];
	}
	map(fun) {
		if (typeof fun !== 'function' || isNaNStrict(fun(this.x)))
			throw 'vectorInstance.map() expects a function that returns a number as the parameter';
		this.x = fun(this.x);
		this.y = fun(this.y);
		this.z = fun(this.z);
		return this;
	}
	apply2DTransformation(matrix) {
		if (matrix.length != 4 || matrix.some(matrixEntry => isNaNStrict(matrixEntry)))
			throw 'Invalid matrix at vectorInstance.apply2DTransformation()';
		return this.set(
			this.x * matrix[0] + this.y * matrix[2],
			this.x * matrix[1] + this.y * matrix[3]
		);
	}
	apply3DTransformation(matrix) {
		if (matrix.length != 9 || matrix.some(matrixEntry => isNaNStrict(matrixEntry)))
			throw 'Invalid matrix at vectorInstance.apply3DTransformation()';
		return this.set(
			this.x * matrix[0] + this.y * matrix[1] + this.z * matrix[2],
			this.x * matrix[3] + this.y * matrix[4] + this.z * matrix[5],
			this.x * matrix[6] + this.y * matrix[7] + this.z * matrix[8]
		);
	}
	rotate2D(angle, pivotPoint) {
		if (isNaNStrict(angle))
			throw 'vectorInstance.rotate2D() expects a number as the first parameter';
		const COS = Math.cos(angle);
		const SIN = Math.sin(angle);
		if (pivotPoint !== undefined) {
			if (!(pivotPoint instanceof Vector))
				throw 'vectorInstance.rotate2D() expects a Vector instance as the second parameter';
			return this
				.sub(pivotPoint)
				.apply2DTransformation([COS, SIN, -SIN, COS])
				.add(pivotPoint);
		}
		return this.apply2DTransformation([COS, SIN, -SIN, COS]);
	}
	static isVector(object) {
		return object instanceof Vector;
	}
	static add(vecA, vecB) {
		if (!Vector.isVector(vecA) || !Vector.isVector(vecB))
			throw 'Vector.add() expects two Vector instances as parameters';
		return new Vector(
			vecA.x + vecB.x,
			vecA.y + vecB.y,
			vecA.z + vecB.z
		);
	}
	static sub(vecA, vecB) {
		if (!Vector.isVector(vecA) || !Vector.isVector(vecB))
			throw 'Vector.sub() expects two Vector instances as parameters';
		return new Vector(
			vecA.x - vecB.x,
			vecA.y - vecB.y,
			vecA.z - vecB.z
		);
	}
	static mult(vectorInstance, multiplier) {
		if (!Vector.isVector(vectorInstance))
			throw 'Vector.mult() expects a Vector instance as the first parameter';
		if (isNaNStrict(multiplier))
			throw 'Vector.mult() expects a number as the second parameter';
		return vectorInstance.clone().mult(multiplier);
	}
	static div(vectorInstance, divisor) {
		if (!Vector.isVector(vectorInstance))
			throw 'Vector.div() expects a Vector instance as one the first parameter';
		if (isNaNStrict(divisor) || divisor === 0)
			throw 'Vector.div() expects a non-zero number as the second parameter';
		return Vector.mult(vectorInstance, 1 / divisor);
	}
	static map(vectorInstance, fun) {
		if (!Vector.isVector(vectorInstance))
			throw 'Vector.map() expects a Vector instance as the first parameter';
		if (typeof fun !== 'function')
			throw 'Vector.map() expects a function that returns a number as the second parameter';
		return vectorInstance.clone().map(fun);
	}
	static fromAngle(theta) {
		if (isNaNStrict(theta))
			throw 'Vector.fromAngle() expects a number as the parameter';
		return new Vector(Math.cos(theta), Math.sin(theta));
	}
	static dot(vecA, vecB) {
		if (!Vector.isVector(vecA) || !Vector.isVector(vecB))
			throw 'Vector.dot() expects two Vector instances as parameters'
		return vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
	}
}