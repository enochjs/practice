// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'
import { ExpectFalse, NotEqual } from './test-utils'

type cases = [
  Expect<Equal<FindEles<[1, 2, 2, 3, 3, 4, 5, 6, 6, 6]>, [1, 4, 5]>>,
  Expect<Equal<FindEles<[2, 2, 3, 3, 6, 6, 6]>, []>>,
  Expect<Equal<FindEles<[1, 2, 3]>, [1, 2, 3]>>,
]


// ============= Your Code Here =============

type LengthOfV<T extends any[], V, C extends any[] = []> =
  T extends [infer F, ...infer Rest]
    ? F extends V
      ? LengthOfV<Rest, V, [...C , 1]>
      : LengthOfV<Rest, V, C>
    : C["length"]

type FindEles<T extends any[], O extends any[] = T, R extends any[] = []> =
  T extends [infer F, ...infer Rest]
    ? LengthOfV<O, F> extends 1
      ? FindEles<Rest, O, [...R, F]>
      : FindEles<Rest, O, R>
    : R