import { transformResponse, transformRequest } from '../../src/tools/data'

describe('tools:data', () => {
  test('should transform request data to string if data is a plainObject', () => {
    const a = { a: 1 }
    expect(transformRequest(a)).toBe('{"a":1}')
  })
  test('should do nothing if data is not a plainObject', () => {
    const a = new URLSearchParams('a=b')
    expect(transformRequest(a)).toBe(a)
  })
  test('should do nothing if data is not a plainObject', () => {
    const a = new URLSearchParams('a=b')
    expect(transformRequest(a)).toBe(a)
  })
})

describe('transformResponse', () => {
  test('should do transform response data to Object if data  is a JSON string', () => {
    const a = '{"a":1}'
    expect(transformResponse(a)).toEqual({ a: 1 })
  })
  test('should do nothing if data is a string but is not a JSON string', () => {
    const a = '{a:1}'
    expect(transformResponse(a)).toEqual('{a:1}')
  })
  test('should do nothing if data is not a string', () => {
    const a = { a: 1 }
    expect(transformResponse(a)).toBe(a)
  })
})
