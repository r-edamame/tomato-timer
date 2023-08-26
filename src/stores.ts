import type { Status } from '$lib/types/status';
import { minute, type Duration } from '$lib/types/time';
import { writable } from 'svelte/store';

export const workingDuration$ = writable<Duration>(minute(25));
export const breakDuration$ = writable<Duration>(minute(5));

export const bgmInWorking$ = writable<string>('');
export const bgmInBreak$ = writable<string>('');

export const currentStatus$ = writable<Status>('waiting');

export const elapsedSeconds$ = writable<number>(0);
export const totalWorkedTime$ = writable<number>(0);
