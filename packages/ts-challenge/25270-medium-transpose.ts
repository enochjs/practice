// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'
import { ExpectFalse, NotEqual } from './test-utils'

type cases = [
  Expect<Equal<Transpose<[]>, []>>,
  Expect<Equal<Transpose<[[1]]>, [[1]]>>,
  Expect<Equal<Transpose<[[1, 2]]>, [[1], [2]]>>,
  Expect<Equal<Transpose<[[1, 2], [3, 4]]>, [[1, 3], [2, 4]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6]]>, [[1, 4], [2, 5], [3, 6]]>>,
  Expect<Equal<Transpose<[[1, 4], [2, 5], [3, 6]]>, [[1, 2, 3], [4, 5, 6]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6], [7, 8, 9]]>, [[1, 4, 7], [2, 5, 8], [3, 6, 9]]>>,
]


// ============= Your Code Here =============

type TransposeOne<T extends number[], R extends number[][]> =
  T extends [infer F, ...infer Rest extends number[]] 
    ? R extends [infer RF extends number[], ...infer RRest extends number[][]]
      ? [[...RF, F], ...TransposeOne<Rest, RRest>]
      : [[F], ...TransposeOne<Rest, []>]
    : R;
type Transpose<M extends number[][], R extends number[][] = []> =
  M extends [infer F extends number[], ...infer Rest extends number[][]]
    ? Transpose<Rest, TransposeOne<F, R>>
    : R