import { processHeaders, parseHeaders, flattenHeaders } from '../../src/tools/headers'

describe('tools:headers', () => {
  describe('processHeaders', () => {
    test('should normalize Content-Type header name', () => {
      const headers: any = {
        'content-TYPe': 'foo/bar',
        'Content-length': 1024
      }
      processHeaders(headers, {})
      expect(headers['Content-Type']).toBe('foo/bar')
      expect(headers['content-TYPe']).toBeUndefined()
      expect(headers['Content-length']).toBe(1024)
    })
    test('should set Content-Type if not set and data is PlainObject', () => {
      const headers: any = {}
      processHeaders(headers, {})
      expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
    })
    test('should do nothing if headers is undefined or null', () => {
      const headers: any = null
      const nullHeader: any = undefined
      processHeaders(headers, {})
      processHeaders(nullHeader, {})
      expect(headers).toBeNull()
      expect(nullHeader).toBeUndefined()
    })
  })

  describe('flattenHeaders', () => {
    test('should flatten the headers and include common headers', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-CSRF-HEADER': 'commonHeader'
        },
        get: {
          'X-GET-HEADER': 'GetHeader'
        },
        post: {
          'X-POST-HEADER': 'postHeader'
        }
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-CSRF-HEADER': 'commonHeader',
        'X-GET-HEADER': 'GetHeader'
      })
      expect(flattenHeaders(headers, 'post')).toEqual({
        Accept: 'application/json',
        'X-CSRF-HEADER': 'commonHeader',
        'X-POST-HEADER': 'postHeader'
      })
    })
    test('should flatten the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'GetHeader'
        }
      }
      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })
    test('should do nothing if headers is undefined or null', () => {
      expect(flattenHeaders(undefined, 'patch')).toBeUndefined()
      expect(flattenHeaders(null, 'options')).toBeNull()
    })
  })

  describe('parseHeaders', () => {
    test('should parse headers', () => {
      const parsed = parseHeaders(
        'Content-type:application/json\r\nConnection: keep-alive\r\n' +
          'Transfer-Encoding:chunked\r\nDate:Tue 21 Oct :2021 GMT\r\n' +
          ':aa\r\n' +
          'key:'
      )
      expect(parsed['content-type']).toBe('application/json')
      expect(parsed['connection']).toBe('keep-alive')
      expect(parsed['transfer-encoding']).toBe('chunked')
      expect(parsed['date']).toBe('Tue 21 Oct :2021 GMT')
      expect(parsed['key']).toBe('')
    })
    test('should return empty Object if headers is empty', () => {
      expect(parseHeaders('')).toEqual({})
    })
  })
})
