import { Duration } from './time';
import { z } from 'zod';

export const Config = z.object({
	workingDuration: Duration,
	breakDuration: Duration
});
export type Config = z.infer<typeof Config>;
