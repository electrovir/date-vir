import {createFullDate, Timezone, toLuxonDateTime} from '../index.js';

const myFullDate = createFullDate('2023-06-05T14:19:00.870Z', Timezone['America/Chicago']);

toLuxonDateTime(myFullDate);
