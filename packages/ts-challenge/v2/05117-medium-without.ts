// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<Without<[1, 2], 1>, [2]>>,
  Expect<Equal<Without<[1, 2, 4, 1, 5], [1, 2]>, [4, 5]>>,
  Expect<Equal<Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>, []>>,
]


// ============= Your Code Here =============

type Tuple<T> = T extends any[] ? T[number] : T
type Without<T, U, E = Tuple<U>> =
  T extends [infer F, ...infer Rest]
    ? F extends E
      ? Without<Rest, U, E>
      : [F, ...Without<Rest, U, E>]
    : []
