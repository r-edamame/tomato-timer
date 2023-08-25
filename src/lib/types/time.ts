import { z } from 'zod';

export const Minute = z.object({
	durType: z.literal('minute'),
	value: z.number()
});
export type Minute = z.infer<typeof Minute>;
export const minute = (m: number): Minute => ({ durType: 'minute', value: m });

export const Second = z.object({
	durType: z.literal('second'),
	value: z.number()
});
export type Second = z.infer<typeof Second>;
export const second = (s: number): Second => ({ durType: 'second', value: s });

export const getSeconds = (dur: Duration): number => {
	switch (dur.durType) {
		case 'minute':
			return dur.value * 60;
		case 'second':
			return dur.value;
	}
};

export const Duration = z.union([Minute, Second]);
export type Duration = z.infer<typeof Duration>;
export type DurationType = Duration['durType'];
