export type JustDateString = `${number}-${number}-${number}`;
export type JustTimeWithSecondsString = `${number}:${number}:${number}`;
export type JustTimeString = `${number}:${number}`;
export type DateTimeWithSeconds = `${JustDateString}T${JustTimeWithSecondsString}`;
export type DateTimeString = `${JustDateString}T${JustTimeString}`;

export type UtcIsoString = `${JustDateString}T${JustTimeWithSecondsString}.${number}Z`;
