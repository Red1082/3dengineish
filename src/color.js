const color = (...args) => {
	let r, g, b, a;
	r = g = b = a = 255;
	if (args[2] === undefined) {
		r = g = b = args[0];
		(args[1] !== undefined) && (a = args[1]);
	} else {
		[r, g, b] = args;
		(args[3] !== undefined) && (a = args[3]);
	}

	const f = x => Math.floor(Math.min(255, Math.max(0, x)));

	return (f(r) << 24) + (f(g) << 16) + (f(b) << 8) + f(a);
};

const parseColor = color => `rgba(${(color >> 24) & 0xFF},${(color >> 16) & 0xFF},${(color >> 8) & 0xFF},${(color & 0xFF) / 255})`;

const lerpColor = (a, b, t) => {
	const T = 1 - t;
	return color(
		T * ((a >> 24) & 0xFF) + t * ((b >> 24) & 0xFF),
		T * ((a >> 16) & 0xFF) + t * ((b >> 16) & 0xFF),
		T * ((a >> 8) & 0xFF) + t * ((b >> 8) & 0xFF),
		T * ((a >> 0) & 0xFF) + t * ((b >> 0) & 0xFF),
	);
};

const decimalToHex = number => {
	if (number < 0) return null;
	let resultArray = [];
	do {
		const r = number % 16;
		resultArray.unshift(r < 10 ? r : String.fromCharCode(55 + r));
	} while (number >>= 4)
	return resultArray.join('');
};

const hexToDecimal = string => {
	let sum = 0;
	for (let i = 0; i < string.length; i++)
		sum += (string[i] < 10 ?
			parseInt(string[i]) : //n < 10 —> n
			(string.charCodeAt(i) - 55)) * //n !< 10 —> convert A-F to 10-15
		(1 << ((string.length - i - 1) << 2)); //coeff * 16 ^ n
	return sum;
};

const parseHex = color => `#${
	[
		0xFF & (color >> 24),
		0xFF & (color >> 16),
		0xFF & (color >> 8),
		0xFF & color
	].map(value => value == 0 ? '00' : decimalToHex(value)).join('')
}`;

const hexToColorInt = hex => {
	let components = [];
	for (let i = 0; i < 4; i++)
		components[i] = hex.substr(2 * i + 1, 2).toUpperCase();
	if (components[3].length == 0) components[3] = 'FF';
	return color(...components.map(hexToDecimal));
};


export { color, parseColor, lerpColor, parseHex, hexToColorInt, decimalToHex, hexToDecimal};

