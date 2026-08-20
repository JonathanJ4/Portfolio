export interface RopePosition {
	x: number;
	y: number;
}

interface RopePoint extends RopePosition {
	previousX: number;
	previousY: number;
}

const frameDuration = 1000 / 60;

export class RopeSimulation {
	private points: RopePoint[] = [];
	private width = 0;
	private height = 0;
	private segmentLength = 0;
	private ropeLength = 0;
	private dragging = false;

	reset(width: number, height: number, ropeLength: number, pointCount = 11): void {
		this.width = width;
		this.height = height;
		this.ropeLength = ropeLength;
		this.segmentLength = ropeLength / (pointCount - 1);
		this.dragging = false;

		const anchorX = width / 2;
		this.points = Array.from({ length: pointCount }, (_, index) => {
			const y = index * this.segmentLength;
			return { x: anchorX, y, previousX: anchorX, previousY: y };
		});
	}

	step(elapsedMilliseconds: number): void {
		if (this.points.length < 2) return;

		const timeScale = Math.min(elapsedMilliseconds / frameDuration, 2);
		const damping = Math.pow(0.985, timeScale);
		const gravity = 0.28 * timeScale * timeScale;
		const lastIndex = this.points.length - 1;

		for (let index = 1; index < this.points.length; index += 1) {
			if (this.dragging && index === lastIndex) continue;

			const point = this.points[index];
			const velocityX = (point.x - point.previousX) * damping;
			const velocityY = (point.y - point.previousY) * damping;

			point.previousX = point.x;
			point.previousY = point.y;
			point.x += velocityX;
			point.y += velocityY + gravity;
		}

		for (let iteration = 0; iteration < 8; iteration += 1) {
			this.pinAnchor();
			this.applyDistanceConstraints();
			this.constrainToCanvas();
		}
	}

	grab(position: RopePosition): void {
		this.dragging = true;
		this.moveHandle(position);
	}

	moveHandle(position: RopePosition): void {
		if (!this.dragging || this.points.length === 0) return;

		const handle = this.points[this.points.length - 1];
		const x = Math.min(Math.max(position.x, 8), this.width - 8);
		const y = Math.min(Math.max(position.y, this.segmentLength), this.height - 8);

		handle.previousX = handle.x;
		handle.previousY = handle.y;
		handle.x = x;
		handle.y = y;
	}

	release(): void {
		this.dragging = false;
	}

	nudge(): void {
		if (this.points.length === 0) return;

		const handle = this.points[this.points.length - 1];
		handle.previousY = handle.y - 12;
		handle.previousX = handle.x + 2;
	}

	handlePosition(): RopePosition {
		const handle = this.points[this.points.length - 1];
		return handle ? { x: handle.x, y: handle.y } : { x: this.width / 2, y: 0 };
	}

	pullDistance(): number {
		return Math.max(0, this.handlePosition().y - this.ropeLength);
	}

	ropePoints(): readonly RopePosition[] {
		return this.points;
	}

	private pinAnchor(): void {
		const anchor = this.points[0];
		anchor.x = this.width / 2;
		anchor.y = -1;
		anchor.previousX = anchor.x;
		anchor.previousY = anchor.y;
	}

	private applyDistanceConstraints(): void {
		const lastIndex = this.points.length - 1;

		for (let index = 0; index < lastIndex; index += 1) {
			const first = this.points[index];
			const second = this.points[index + 1];
			const deltaX = second.x - first.x;
			const deltaY = second.y - first.y;
			const distance = Math.hypot(deltaX, deltaY) || 1;
			const difference = (distance - this.segmentLength) / distance;
			const correctionX = deltaX * difference;
			const correctionY = deltaY * difference;
			const firstPinned = index === 0;
			const secondPinned = this.dragging && index + 1 === lastIndex;

			if (firstPinned && secondPinned) continue;

			if (firstPinned) {
				second.x -= correctionX;
				second.y -= correctionY;
			} else if (secondPinned) {
				first.x += correctionX;
				first.y += correctionY;
			} else {
				first.x += correctionX * 0.5;
				first.y += correctionY * 0.5;
				second.x -= correctionX * 0.5;
				second.y -= correctionY * 0.5;
			}
		}
	}

	private constrainToCanvas(): void {
		const lastIndex = this.points.length - 1;

		for (let index = 1; index < this.points.length; index += 1) {
			if (this.dragging && index === lastIndex) continue;

			const point = this.points[index];
			point.x = Math.min(Math.max(point.x, 4), this.width - 4);
			point.y = Math.min(point.y, this.height - 6);
		}
	}
}
