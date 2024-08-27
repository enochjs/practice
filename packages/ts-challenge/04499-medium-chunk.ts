// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<Chunk<[], 1>, []>>,
  Expect<Equal<Chunk<[1, 2, 3], 1>, [[1], [2], [3]]>>,
  Expect<Equal<Chunk<[1, 2, 3], 2>, [[1, 2], [3]]>>,
  Expect<Equal<Chunk<[1, 2, 3, 4], 2>, [[1, 2], [3, 4]]>>,
  Expect<Equal<Chunk<[1, 2, 3, 4], 5>, [[1, 2, 3, 4]]>>,
  Expect<Equal<Chunk<[1, true, 2, false], 2>, [[1, true], [2, false]]>>,
]


// ============= Your Code Here =============
type Chunk<T extends any[], L extends number, R extends any[] = [], Temp extends any[] = []> =
  Temp["length"] extends L
    ? Chunk<T, L, [...R, Temp], []>
    : T extends [infer F, ...infer Rest]
      ? Chunk<Rest, L, R, [...Temp, F]>
      : Temp["length"] extends 0 
        ? R
        : [...R, Temp]
