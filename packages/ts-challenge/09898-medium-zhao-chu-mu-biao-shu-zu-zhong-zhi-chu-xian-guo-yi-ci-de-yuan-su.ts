// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'
import { ExpectFalse, NotEqual } from './test-utils'

type cases = [
  Expect<Equal<FindEles<[1, 2, 2, 3, 3, 4, 5, 6, 6, 6]>, [1, 4, 5]>>,
  Expect<Equal<FindEles<[2, 2, 3, 3, 6, 6, 6]>, []>>,
  Expect<Equal<FindEles<[1, 2, 3]>, [1, 2, 3]>>,
]


// ============= Your Code Here =============

type CountV<T, V, I extends number[] = []> =
  T extends [infer F, ...infer Rest]
    ? F extends V
      ? CountV<Rest, V, [...I, 1]>
      : CountV<Rest, V, I>
    : I['length']

type FindEles<T extends any[], O = T, R extends any[] = []> =
  T extends [infer F, ...infer Rest]
    ? CountV<O, F> extends 1
      ? FindEles<Rest, O, [...R, F]>
      : FindEles<Rest, O, R>
    : R
