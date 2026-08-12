import {createFullDate, TimezoneName, toLuxonDateTime} from '../index.js';

const myFullDate = createFullDate('2023-06-05T14:19:00.870Z', TimezoneName['America/Chicago']);

toLuxonDateTime(myFullDate);
