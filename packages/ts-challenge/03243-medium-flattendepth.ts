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

type FlattenOne<T> =
  T extends [infer F, ...infer Rest]
    ? F extends any[]
      ? [...F, ...FlattenOne<Rest>]
      : [F, ...FlattenOne<Rest>]
    : []

type FlattenDepth<T, D=1, I extends number[] = [], FT=FlattenOne<T>> =
  I['length'] extends D
    ? T
    : T extends FT
      ? T
      : FlattenDepth<FT, D, [...I, 1]>
