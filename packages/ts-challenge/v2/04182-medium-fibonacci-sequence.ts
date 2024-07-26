// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<Fibonacci<1>, 1>>,
  Expect<Equal<Fibonacci<2>, 1>>,
  Expect<Equal<Fibonacci<3>, 2>>,
  Expect<Equal<Fibonacci<8>, 21>>,
]


// ============= Your Code Here =============
type Fibonacci<T extends number, I extends number[] = [1], F1 extends number[] = [1], F2 extends number[] = []> =
  I['length'] extends T
    ? F1['length']
    : Fibonacci<T, [...I, 1], [...F1, ...F2], F1>
