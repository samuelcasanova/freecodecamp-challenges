import { expect, it } from 'vitest'

function whatIsInAName(collection, source) {
  if(!source) {
    return collection
  }
  return collection.filter(e => {
    return Object.keys(source).every(k => e[k] === source[k])
  })
}

it('should return [] when no parameters', () => {
  const result = whatIsInAName([])

  expect(result).toStrictEqual([])
})

it('should return [{a: 1}] with ([{a: 1}, {b: 1}], {a: 1})', () => {
  const result = whatIsInAName([{a: 1}, {b: 1}], {a: 1})

  expect(result).toStrictEqual([{a: 1}])
})

it('should return { first: "Tybalt", last: "Capulet" } with ([{ first: "Romeo", last: "Montague" }, { first: "Mercutio", last: null }, { first: "Tybalt", last: "Capulet" }], { last: "Capulet" })', () => {
  const result = whatIsInAName([{ first: "Romeo", last: "Montague" }, { first: "Mercutio", last: null }, { first: "Tybalt", last: "Capulet" }], { last: "Capulet" });

  expect(result).toStrictEqual([{ first: "Tybalt", last: "Capulet" }])
})