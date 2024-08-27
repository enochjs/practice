// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<Without<[1, 2], 1>, [2]>>,
  Expect<Equal<Without<[1, 2, 4, 1, 5], [1, 2]>, [4, 5]>>,
  Expect<Equal<Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>, []>>,
]


// ============= Your Code Here =============
type Without<T, U, E = U extends any[] ? U[number] : U, R extends any[] = []> =
  T extends [infer F, ...infer Rest]
    ? F extends E
      ? Without<Rest, U, E, R>
      : Without<Rest, U, E, [...R, F]>
    : R
