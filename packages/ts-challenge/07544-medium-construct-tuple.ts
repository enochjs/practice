// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<ConstructTuple<0>, []>>,
  Expect<Equal<ConstructTuple<2>, [unknown, unknown]>>,
  Expect<Equal<ConstructTuple<999>['length'], 999>>,
  // @ts-expect-error
  Expect<Equal<ConstructTuple<1000>['length'], 1000>>,
]


// ============= Your Code Here =============
type ConstructTuple<L extends number, R extends unknown[] = []> =
  R['length'] extends L
    ? R
    : ConstructTuple<L, [...R, unknown]>
