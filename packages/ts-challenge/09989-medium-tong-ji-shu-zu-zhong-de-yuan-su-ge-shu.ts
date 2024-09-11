// ============= Test Cases =============
import type { Equal, Expect, MergeInsertions } from './test-utils'
type cases = [
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5]>, {
    1: 1
    2: 1
    3: 1
    4: 1
    5: 1
  }
  >>,
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3]]>, {
    1: 2
    2: 2
    3: 2
    4: 1
    5: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3, [4, 4, 1, 2]]]>, {
    1: 3
    2: 3
    3: 2
    4: 3
    5: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<[never]>, {}>>,
  Expect<Equal<CountElementNumberToObject<['1', '2', '0']>, {
    0: 1
    1: 1
    2: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<['a', 'b', ['c', ['d']]]>, {
    'a': 1
    'b': 1
    'c': 1
    'd': 1
  }>>,
]


// ============= Your Code Here =============

type FlattenDeep<T extends any[]> =
  T extends [infer F, ...infer Rest]
    ? [F] extends [never]
     ? FlattenDeep<Rest>
      : F extends any[]
        ? [...FlattenDeep<F>, ...FlattenDeep<Rest>]
        : [F, ...FlattenDeep<Rest>]
      : []

type LengthOfV<T extends any[], V, C extends any[] = []> =
  T extends [infer F, ...infer Rest]
    ? F extends V
      ? LengthOfV<Rest, V, [...C , 1]>
      : LengthOfV<Rest, V, C>
    : C["length"]

type CountElementNumberToObject<T extends any[], E extends any[]= FlattenDeep<T>,  O extends any[] = E, R extends Record<any, number> = {}> =
  E extends [infer F extends PropertyKey, ...infer Rest]
    ? R[F] extends number
      ? CountElementNumberToObject<T, Rest, O, R>
      : CountElementNumberToObject<T, Rest, O, R & Record<F, LengthOfV<O, F>>>
    : MergeInsertions<R>