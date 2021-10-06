import { isURLSameOrigin, buildURL } from '../../src/tools/url'

describe('tools:url', () => {
  describe('isURLSameOrigin', () => {
    // TODO
  })

  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })
    test('should support params', () => {
      expect(buildURL('/foo', { a: 'foo' })).toBe('/foo?a=foo')
    })
    test('should support some params is null', () => {
      expect(buildURL('/foo', { a: 'foo', b: null })).toBe('/foo?a=foo')
    })
    test('should support params is tobe null', () => {
      expect(buildURL('/foo', { a: null, b: null })).toBe('/foo')
    })
    test('should support object params', () => {
      expect(buildURL('/foo', { a: { b: 'null' } })).toBe('/foo?a=' + encodeURI('{"b":"null"}'))
    })
    test('should support Date params', () => {
      const date = new Date()
      expect(buildURL('/foo', { date: date })).toBe('/foo?date=' + date.toISOString())
    })
    test('should support array params', () => {
      expect(buildURL('/foo', { arr: ['bar', 'foo'] })).toBe('/foo?arr[]=bar&arr[]=foo')
    })
    test('should support special char params', () => {
      expect(buildURL('/foo', { foo: '@:$' })).toBe('/foo?foo=@:$')
    })
    test('should support exiting params', () => {
      expect(buildURL('/foo?a=1', { foo: '@:$' })).toBe('/foo?a=1&foo=@:$')
    })
    test('should correct discard url hash mark', () => {
      expect(buildURL('/foo?a=1#hash', { query: 'bar' })).toBe('/foo?a=1&query=bar')
    })
    test('should use serialized if provided', () => {
      expect(buildURL('/foo?a=1#hash', { query: 'bar' })).toBe('/foo?a=1&query=bar')
    })
  })
})
