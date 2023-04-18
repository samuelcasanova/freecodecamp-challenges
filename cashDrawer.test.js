import { it, expect, describe } from 'vitest'

const CURRENCY_UNITS = [
  ["ONE HUNDRED", 100],
  ["TWENTY", 20],
  ["TEN", 10],
  ["FIVE", 5],
  ["ONE", 1],
  ["QUARTER", 0.25],
  ["DIME", 0.1],
  ["NICKEL", 0.05],
  ["PENNY", 0.01]
]

function checkCashRegister(price, cash, cid) {
  if (isCidEmpty(cid)) {
    return {status: "CLOSED", change: []}
  }
  if (price > cash) {
    return {status: "INSUFFICIENT_FUNDS", change: []}
  }
  if(price === cash) {
    return {status: "OPEN", change: []}
  }
  const { remainingQuantity, change, remainingCid } = subtractChange(cash - price, cid)
  if(remainingQuantity) {
    return {status: "INSUFFICIENT_FUNDS", change: []}
  }
  if(isCidEmpty(remainingCid)) {
    return {status: "CLOSED", change: change}
  }
  return {status: "OPEN", change: change}
}

function isCidEmpty(cid) {
  return cid.reduce((acc, curr) => acc + curr[1], 0) === 0
}

function subtractChange(changeQuantity, cid) {
  const result = CURRENCY_UNITS.reduce((acc, curr) => {
    const { remainingQuantity, remainingCid } = acc
    const currencyUnitIsGreaterThanRemainingQuantity = curr[1] > acc.remainingQuantity
    if (currencyUnitIsGreaterThanRemainingQuantity) {
      return acc
    }
    const availableUnitQuantityInCid = remainingCid.find(c => c[0] === curr[0])
    if (!availableUnitQuantityInCid) {
      return acc
    } 
    const quantityToSubtract = Math.min(availableUnitQuantityInCid[1], Math.floor(remainingQuantity / curr[1]) * curr[1])
    return {
      remainingQuantity: roundToPennies(remainingQuantity - quantityToSubtract),
      change: [...acc.change, [curr[0], roundToPennies(quantityToSubtract)]],
      remainingCid: remainingCid.map(c => c[0] === curr[0] ? [ c[0], roundToPennies(availableUnitQuantityInCid[1] - quantityToSubtract) ] : c)
    }
  }, {
    remainingQuantity: changeQuantity,
    change: [],
    remainingCid: cid
  })
  return result
}

function roundToPennies(quantity) {
  return Math.round(quantity * 100) / 100
}

describe('checkCashRegister', () => {
  it('should return CLOSED if no change is left no matter price and cash', () => {
    const change = checkCashRegister(5, 25, [])
  
    expect(change).toStrictEqual({status: "CLOSED", change: []})
  })
  
  it('should return OPEN if price and cash are the same and theres change left in cid', () => {
    const change = checkCashRegister(5, 5, [["TEN", 20]])
  
    expect(change).toStrictEqual({status: "OPEN", change: []})
  })
  
  it('should return INSUFFICIENT FUNDS if price > cash', () => {
    const change = checkCashRegister(10, 5, [["TEN", 20]])
  
    expect(change).toStrictEqual({status: "INSUFFICIENT_FUNDS", change: []})
  })

  it('should return CLOSED if after giving the change the cid is empty', () => {
    const change = checkCashRegister(5, 10, [["FIVE", 5]])
  
    expect(change).toStrictEqual({status: "CLOSED", change: [["FIVE", 5]]})
  })

  it('should return OPEN if enough cash and theres change in cid', () => {
    const change = checkCashRegister(5, 28, [["ONE", 90], ["FIVE", 55]])
  
    expect(change).toStrictEqual({status: "OPEN", change: [["FIVE", 20], ["ONE", 3]]})
  })

  it('should return INSUFFICIENT FUNDS if theres no exact cash for change', () => {
    const change = checkCashRegister(5, 28, [["ONE", 2], ["FIVE", 20]])
  
    expect(change).toStrictEqual({status: "INSUFFICIENT_FUNDS", change: []})
  })

  it('test 1 from freeCodeCamp', () => {
    const change = checkCashRegister(3.26, 100, [
      ["PENNY", 1.01], 
      ["NICKEL", 2.05], 
      ["DIME", 3.1], 
      ["QUARTER", 4.25], 
      ["ONE", 90], 
      ["FIVE", 55], 
      ["TEN", 20], 
      ["TWENTY", 60], 
      ["ONE HUNDRED", 100]])

    const expected = {status: "OPEN", change: [
      ["TWENTY", 60],
      ["TEN", 20], 
      ["FIVE", 15], 
      ["ONE", 1], 
      ["QUARTER", 0.5], 
      ["DIME", 0.2], 
      ["PENNY", 0.04]
    ]}
    expect(change).toStrictEqual(expected)
  })

  it('test 2 from freeCodeCamp', () => {
    const change = checkCashRegister(19.5, 20, [
      ["PENNY", 0.5], 
      ["NICKEL", 0], 
      ["DIME", 0], 
      ["QUARTER", 0], 
      ["ONE", 0], 
      ["FIVE", 0], 
      ["TEN", 0], 
      ["TWENTY", 0], 
      ["ONE HUNDRED", 0]]) 

    const expected = {status: "CLOSED", change: [
      ["PENNY", 0.5], 
      ["NICKEL", 0], 
      ["DIME", 0], 
      ["QUARTER", 0], 
      ["ONE", 0], 
      ["FIVE", 0], 
      ["TEN", 0], 
      ["TWENTY", 0], 
      ["ONE HUNDRED", 0]]}
  
      expect(change).toStrictEqual(expected)
  })
})

describe('isCidEmpty', () => {
  it('should return true if cid is empty', () => {
    const empty = isCidEmpty([])

    expect(empty).toBe(true)
  })

  it('should return true if theres no cash available', () => {
    const empty = isCidEmpty([["QUARTER", 0], ["ONE", 0]])

    expect(empty).toBe(true)
  })

  it('should return false if theres cash available', () => {
    const empty = isCidEmpty([["TEN", 20]])

    expect(empty).toBe(false)
  })
})

describe('subtractChange', () => {
  it('should return cid as is if quantity is 0', () => {
    const { remainingQuantity, change, remainingCid } = subtractChange(0, [["TEN", 20]])

    expect(remainingQuantity).toBe(0)
    expect(change).toStrictEqual([])
    expect(remainingCid).toStrictEqual([["TEN", 20]])
  })

  it('should subtract change if theres cash available in cid', () => {
    const { remainingQuantity, change, remainingCid } = subtractChange(264, [["ONE HUNDRED", 300], ["FIVE", 80]])

    expect(remainingQuantity).toBe(4)
    expect(change).toStrictEqual([["ONE HUNDRED", 200], ["FIVE", 60]])
    expect(remainingCid).toStrictEqual([["ONE HUNDRED", 100], ["FIVE", 20]])
  })

  it('should also subtract change if theres not enough cash available in cid', () => {
    const { remainingQuantity, change, remainingCid } = subtractChange(64, [["ONE HUNDRED", 300], ["FIVE", 40], ["DIME", 0.2]])

    expect(remainingQuantity).toBe(23.8)
    expect(change).toStrictEqual([["FIVE", 40], ["DIME", 0.2]])
    expect(remainingCid).toStrictEqual([["ONE HUNDRED", 300], ["FIVE", 0], ["DIME", 0]])
  })
})

describe('roundToPennies', () => {
  it('should round 0.0000000001 to 0', () => {
    expect(roundToPennies(0.0000000001)).toBe(0)
  })

  it('should round 0.00999999999 to 0.01', () => {
    expect(roundToPennies(0.00999999999)).toBe(0.01)
  })
})
