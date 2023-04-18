import { expect, it } from 'vitest'

function sumAll(arr) {
  if(arr.length === 0) {
    return 0
  }
  if(arr.length === 1){
    return arr[0]
  }
  const min = Math.min(arr[0], arr[1])
  const max = Math.max(arr[0], arr[1])
  const expandedArr = new Array(max - min + 1).fill(1).map((_, i) => min + i)
  return expandedArr.reduce((acc, curr) => acc + curr, 0)
}

it('should return 0 with empty array []', () => {
  const result = sumAll([])

  expect(result).toBe(0)
})

it('should return 1 with [1]', () => {
  const result = sumAll([1])

  expect(result).toBe(1)
})

it('should return 10 with [1,4]', () => {
  const result = sumAll([1, 4])

  expect(result).toBe(10)
})

it('should return 10 with [4,1]', () => {
  const result = sumAll([4, 1])

  expect(result).toBe(10)
})

it('should return 45 with [10,5]', () => {
  const result = sumAll([10, 5])

  expect(result).toBe(45)
})