import {createFullDate, timezones, toLuxonDateTime} from '../index.js';

const myFullDate = createFullDate('2023-06-05T14:19:00.870Z', timezones['America/Chicago']);

toLuxonDateTime(myFullDate);
