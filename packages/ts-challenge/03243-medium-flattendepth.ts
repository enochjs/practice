// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<FlattenDepth<[]>, []>>,
  Expect<Equal<FlattenDepth<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<FlattenDepth<[1, [2]]>, [1, 2]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, [[5]]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 3>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 19260817>, [1, 2, 3, 4, 5]>>,
]


// ============= Your Code Here =============

type Flatten<T extends any[]> =
  T extends [infer F, ...infer Rest]
    ? F extends any[]
      ? [...F, ...Flatten<Rest>]
      : [F, ...Flatten<Rest>]
    : [];

type a = Flatten<[1, 2, [3, 4], [[[5]]]]>

type FlattenDepth<T extends any[], D extends number = 1, C extends number[] = [], R extends any[] = Flatten<T>> =
  C['length'] extends D
    ? T
    : R extends T
      ? T
      : FlattenDepth<R, D, [...C, 1]>
