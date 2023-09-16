import Vector from './vector.js';

export default class InputManager {
	constructor(params) {
		this.previousPointerPosition = new Vector();
		this.currentPointerPosition = new Vector();
		this.pointerMovement = new Vector();
		this.targetNode = params.targetNode;
		const validateFunction = fun => typeof fun == 'function' ? fun : null;
		Object.assign(this, {
			onPointerDown: validateFunction(params.onPointerDown),
			onPointerMove: validateFunction(params.onPointerMove),
			onPointerUp: validateFunction(params.onPointerUp)
		});
		this.targetNode.addEventListener('pointerdown', pointerEvent => {
			this.updatePointerPosition(pointerEvent);
			this.previousPointerPosition.set(this.currentPointerPosition);
			this.onPointerDown && this.onPointerDown(this.getPackagedEventData());
			document.body.style.cursor = 'grabbing';
		});
		this.targetNode.addEventListener('pointermove', pointerEvent => {
			this.previousPointerPosition.set(this.currentPointerPosition);
			this.updatePointerPosition(pointerEvent);
			this.pointerMovement.set(Vector.sub(
				this.currentPointerPosition,
				this.previousPointerPosition
			));
			this.onPointerMove && this.onPointerMove(this.getPackagedEventData());
		});
		this.targetNode.addEventListener('touchmove', touchEvent => {
			this.previousPointerPosition.set(this.currentPointerPosition);
			this.updatePointerPosition(touchEvent.touches[0]);
			this.pointerMovement.set(Vector.sub(
				this.currentPointerPosition,
				this.previousPointerPosition
			));
			this.onPointerMove && this.onPointerMove(this.getPackagedEventData());
		});
		['touchend', 'pointerup'].forEach(eventType =>
			this.targetNode.addEventListener(eventType, () => {
				this.pointerMovement.set(new Vector());
				this.onPointerUp && this.onPointerUp(this.getPackagedEventData());
				document.body.style.cursor = 'default'
			}));
	}
	updatePointerPosition(pointerEvent) {
		this.currentPointerPosition.set(this.getPointerPosition(pointerEvent));
	}
	getPointerPosition(pointerEvent) {
		return new Vector(pointerEvent.pageX, pointerEvent.pageY)
			.mult(this.targetNode.RESOLUTION_MULTIPLIER ?? 1);
	}
	getPackagedEventData() {
		return {
			previousPointerPosition: this.previousPointerPosition,
			currentPointerPosition: this.currentPointerPosition,
			pointerMovement: this.pointerMovement
		};
	}
}