// ============= Test Cases =============
import type { Equal, Expect, MergeInsertions } from './test-utils'

type PersonInfo = {
  name: 'Tom'
  age: 30
  married: false
  addr: {
    home: '123456'
    phone: '13111111111'
  }
  hobbies: ['sing', 'dance']
  readonlyArr: readonly ['test']
  fn: () => any
}

type ExpectedResult = {
  name: string
  age: number
  married: boolean
  addr: {
    home: string
    phone: string
  }
  hobbies: [string, string]
  readonlyArr: readonly [string]
  fn: Function
}

type cases = [
  Expect<Equal<ToPrimitive<PersonInfo>, ExpectedResult>>,
]


// ============= Your Code Here =============
type ToPrimitive<T> = {
  [P in keyof T]: T[P] extends string ? string : T[P] extends number ? number : T[P] extends boolean ? boolean : T[P] extends Function ? Function : ToPrimitive<T[P]>
}
