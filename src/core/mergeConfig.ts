import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlainObject } from '../tools/util'

const strategy = Object.create(null)

function defaultStrategy(valX: any, valY: any) {
  return typeof valY !== 'undefined' ? valY : valX
}

/*只取val2*/
function fromVal2Strategy(val1: any, val2: any) {
  if (typeof val2 !== 'undefined') return val2
}

const strategyKeysFromVal2 = ['url','params','data']
strategyKeysFromVal2.forEach(key => {
  strategy[key] = fromVal2Strategy
})

function deepMergeStrat(val1:any,val2:any) {
  if (isPlainObject(val2)) {
    return deepMerge(val1,val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const stratKeysDeepMerge = ['headers']
stratKeysDeepMerge.forEach(key => {
  strategy[key] = deepMergeStrat
})

/*
* 深度合并请求头信息*/
export function mergeConfig(conf1: AxiosRequestConfig, conf2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!conf2) conf2 = {}

  const config = Object.create(null)

  for (let key in conf2) {
    mergeField(key)
  }

  for (let key in conf1) {
    if (!conf2[key]) mergeField(key)
  }

  function mergeField(key: string): void {
    const strat = strategy[key] || defaultStrategy
    config[key] = strat(conf1[key], conf2![key])
  }

  return config
}
