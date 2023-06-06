export type JustDateString = `${number}-${number}-${number}`;
export type JustTimeWithSecondsString = `${number}:${number}:${number}`;
export type JustTimeString = `${number}:${number}`;

export type UtcIsoString = `${JustDateString}T${JustTimeWithSecondsString}.${number}Z`;
