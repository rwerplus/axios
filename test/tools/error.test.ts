import { createError } from '../../src/tools/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('tools:error', () => {
  test('should create an Error with message,config,code,request,response and is AxiosError', () => {
    const request = new XMLHttpRequest()
    const conf: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 20,
      statusText: 'OK',
      headers: null,
      request,
      config: conf,
      data: { foo: 'bar' }
    }
    const error = createError('Fuuu', conf, 'SOMETHING', request, response)
    expect(error.message).toBe('Fuuu')
    expect(error instanceof Error).toBeTruthy()
    expect(error.config).toBe(conf)
    expect(error.code).toBe('SOMETHING')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
  })
})
