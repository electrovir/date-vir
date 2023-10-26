import {AtLeastTuple} from '@augment-vir/common';

export type MaybeTuple<T> = T | AtLeastTuple<T, 1>;
