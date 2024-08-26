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
type KebabCase<S, First extends boolean = true> =
  S extends `${infer F}${infer V}`
    ? Uppercase<F> extends Lowercase<F>
      ? `${F}${KebabCase<V, false>}`
      : Uppercase<F> extends F
        ? `${First extends true ? Lowercase<F> : `-${Lowercase<F>}`}${KebabCase<V, false>}`
        : `${F}${KebabCase<V, false>}`
    : ''
