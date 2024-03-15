import { ContentTypeEnum } from '@/utils/enum'
import type { AxiosRequestConfig, Canceler } from 'axios'

/**
 * 默认配置
 */
export const defaultConfig: AxiosRequestConfig = {
  // baseURL: window.config.VITE_APP_BASE_URL || '',
  //10秒超时
  timeout: 10000000000,
  headers: { 'Content-Type': ContentTypeEnum.JSON },
  withCredentials: true, // 允许携带cookie
}

export function httpConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config) {
    return defaultConfig
  }

  const { headers } = config
  if (headers && typeof headers === 'object') {
    defaultConfig.headers = {
      ...defaultConfig.headers,
      ...headers,
    } as any
  }
  return { ...excludeProps(config, 'headers'), ...defaultConfig }
}

// 取消指定的属性
export function excludeProps<T extends { [key: string]: any }>(origin: T, prop: string): { [key: string]: T } {
  return Object.keys(origin)
    .filter((key) => !prop.includes(key))
    .reduce(
      (res, key) => {
        res[key] = origin[key]
        return res
      },
      {} as { [key: string]: T }
    )
}

export type CancelTokenType = { cancelKey: string; cancelExecutor: Canceler }

export interface ResultType<T> {
  data: T
  code: number
  message: string
}
