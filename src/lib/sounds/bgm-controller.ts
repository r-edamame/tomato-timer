export class BgmController {
	private sounds: [string, HTMLAudioElement][];
	private selected: HTMLAudioElement;

	private state: 'paused' | 'playing' | 'fadein' | 'fadeout' = 'paused';

	private volume = 0.2;

	private fadeIntervalId: number | null;

	constructor(paths: string[]) {
		this.sounds = paths.map((p) => [p, new Audio(p)]);
		this.selected = this.sounds[0][1];
		this.fadeIntervalId = null;

		const name = localStorage.getItem('bgm-sound');
		if (name) {
			try {
				this.selectSound(name);
			} catch (e) {}
		}
	}

	get soundNames(): string[] {
		return this.sounds.map(([name]) => name);
	}

	selectSound(target: string) {
		if (!this.selected.paused) {
			this.selected.pause();
			this.selected.currentTime = 0;
		}

		const sound = this.sounds.find(([name, audio]) => {
			const match = name.match(/[^/]+\.mp3$/);
			if (match && match[0] === target) {
				return true;
			}
		});

		if (!sound) {
			throw new Error('unknown sound selected');
		}

		this.selected = sound[1];
	}

	setVolume(volume: number) {
		if (volume < 0 || 1 < volume) {
			throw new Error('invalid audio volume');
		}

		this.volume = volume;

		if (this.fadeIntervalId) {
			clearInterval(this.fadeIntervalId);
			this.fadeIntervalId = null;

			if (this.state === 'fadein') {
				this.selected.volume = volume;
				this.state = 'playing';
			} else if (this.state === 'fadeout') {
				this.selected.pause();
				this.state = 'paused';
			}
		} else if (this.state === 'playing') {
			this.selected.volume = volume;
		}
	}

	fadeIn(seconds: number) {
		if (this.fadeIntervalId) {
			clearInterval(this.fadeIntervalId);
		}

		this.selected.volume = 0;
		this.selected.currentTime = 0;
		this.selected.loop = true;

		let count = 0;
		const increaseValue = this.volume / (seconds * 100);

		this.fadeIntervalId = setInterval(() => {
			if (this.selected.volume + increaseValue < 1) {
				this.selected.volume += increaseValue;
			}

			if (count++ > seconds * 100) {
				this.state = 'playing';

				this.fadeIntervalId && clearInterval(this.fadeIntervalId);
				this.fadeIntervalId = null;
			}
		}, seconds * 10);

		this.selected.play();
		this.state = 'fadein';
	}

	fadeOut(seconds: number) {
		if (this.fadeIntervalId) {
			clearInterval(this.fadeIntervalId);
		}

		let count = 0;
		const decreaseValue = this.volume / (seconds * 100);
		this.fadeIntervalId = setInterval(() => {
			if (this.selected.volume - decreaseValue > 0) {
				this.selected.volume -= decreaseValue;
			}

			if (count++ > seconds * 100) {
				this.selected.pause();
				this.state = 'paused';

				this.fadeIntervalId && clearInterval(this.fadeIntervalId);
				this.fadeIntervalId = null;
			}
		}, seconds * 10);

		this.state = 'fadeout';
	}

	pause() {
		if (this.fadeIntervalId) {
			clearInterval(this.fadeIntervalId);
			this.fadeIntervalId = null;
		}

		this.selected.pause();
		this.state = 'paused';
	}
}
