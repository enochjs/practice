// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<KebabCase<'FooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'fooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'foo-bar'>, 'foo-bar'>>,
  Expect<Equal<KebabCase<'foo_bar'>, 'foo_bar'>>,
  Expect<Equal<KebabCase<'Foo-Bar'>, 'foo--bar'>>,
  Expect<Equal<KebabCase<'ABC'>, 'a-b-c'>>,
  Expect<Equal<KebabCase<'-'>, '-'>>,
  Expect<Equal<KebabCase<''>, ''>>,
  Expect<Equal<KebabCase<'😎'>, '😎'>>,
]


// ============= Your Code Here =============

type isUpperCase<S extends string> = Lowercase<S> extends Uppercase<S> ? false : S extends Uppercase<S> ? true : false 
type KebabCase<S, First=true> =
  S extends `${infer F}${infer Rest}`
    ? First extends true
      ? `${Lowercase<F>}${KebabCase<Rest, false>}`
      : isUpperCase<F> extends true
        ? `-${Lowercase<F>}${KebabCase<Rest, false>}`
        : `${F}${KebabCase<Rest, false>}`
    : ''
