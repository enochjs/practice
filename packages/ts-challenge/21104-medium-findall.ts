// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<FindAll<'Collection of TypeScript type challenges', 'Type'>, [14]>>,
  Expect<Equal<FindAll<'Collection of TypeScript type challenges', 'pe'>, [16, 27]>>,
  Expect<Equal<FindAll<'Collection of TypeScript type challenges', ''>, []>>,
  Expect<Equal<FindAll<'', 'Type'>, []>>,
  Expect<Equal<FindAll<'', ''>, []>>,
  Expect<Equal<FindAll<'AAAA', 'A'>, [0, 1, 2, 3]>>,
  Expect<Equal<FindAll<'AAAA', 'AA'>, [0, 1, 2]>>,
]


// ============= Your Code Here =============
type LengthOfString<T extends string, R extends number[] = []> = T extends`${infer F}${infer Rest}` ? LengthOfString<Rest, [...R, 1]> : R["length"]

type FindAll<T extends string, P extends string, R extends any[] = [], Index extends number[] = []> =
  P extends ''
    ? []
    : T extends `${infer F}${infer Rest}`
      ? T extends `${P}${infer PRest}`
        ? FindAll<Rest, P, [...R, Index["length"]], [...Index, 1]>
        : FindAll<Rest, P, R, [...Index, 1]>
      : R
