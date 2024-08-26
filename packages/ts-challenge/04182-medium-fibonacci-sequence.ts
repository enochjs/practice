// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<Fibonacci<1>, 1>>,
  Expect<Equal<Fibonacci<2>, 1>>,
  Expect<Equal<Fibonacci<3>, 2>>,
  Expect<Equal<Fibonacci<8>, 21>>,
]


// ============= Your Code Here =============
type Fibonacci<T extends number, P1 extends number[] = [1],  P2 extends number[] = [], C extends number[] = [1]> =
  C["length"] extends T
    ? P1["length"]
    : Fibonacci<T, [...P1, ...P2], P1, [...C, 1]>
