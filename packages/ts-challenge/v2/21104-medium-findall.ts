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
type StringToArr<T extends string, R extends number[] = []> = T extends `${infer F}${infer Rest}` ?  StringToArr<Rest, [...R, 1]> : R
type FindAll<T extends string, P extends string, PV extends number[] = [], R extends number[] = []> =
  P extends ''
    ? []
    : T extends `${infer Pre}${P}${infer Rest}`
      ? P extends `${infer P1}${infer P2}`
        ? FindAll<`${P2}${Rest}`, P, StringToArr<`${Pre}${P1}`, PV>, [...R, StringToArr<Pre, PV>['length']]>
        : FindAll<Rest, P, StringToArr<`${Pre}${P}`, PV>, [...R, StringToArr<Pre, PV>['length']]>
      : R