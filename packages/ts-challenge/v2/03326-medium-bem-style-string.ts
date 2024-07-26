// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<BEM<'btn', ['price'], []>, 'btn__price'>>,
  Expect<Equal<BEM<'btn', ['price'], ['warning', 'success']>, 'btn__price--warning' | 'btn__price--success' >>,
  Expect<Equal<BEM<'btn', [], ['small', 'medium', 'large']>, 'btn--small' | 'btn--medium' | 'btn--large' >>,
]


// ============= Your Code Here =============
type BE<B extends string, E extends string[], D extends string, R = never> =
  E extends [infer F extends string, ...infer Rest extends string[]]
    ? BE<B, Rest, D, R | `${B}${D}${F}`>
    : [R] extends [never] ? B : R

type BEM<B extends string, E extends string[], M extends string[]> = BE<BE<B, E, '__'>, M, '--'>
