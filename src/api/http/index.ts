import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError, CreateAxiosDefaults } from 'axios'
import Axios from 'axios'
import type { ResultType } from '@/api/http/config'
import { httpConfig } from '@/api/http/config'
import { message } from '@/utils/message'

class AxiosHttp {
  private axiosInstance: AxiosInstance
  constructor() {
    this.axiosInstance = Axios.create(httpConfig() as CreateAxiosDefaults)
    this.httpHookRequest()
    this.httpHookResponse()
  }

  // 请求拦截
  private httpHookRequest(): void {
    this.axiosInstance.interceptors.request.use(
      async (config: any) => {
        // const userStore= useUserStoreWithOut();
        // console.log("userStore", userStore.userToken);
        // try {
        //   await Axios({
        //     method: 'get',
        //     url: "http://10.66.42.70:8080/geoesbmengine/services/servicemanager/user/current.json?ticket=" + userStore.userToken,
        //   });
        //   return config as any
        // } catch (e) {
        //   // window.location.href = "/login";
        // }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  // 响应拦截
  private httpHookResponse(): void {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        /**
         * @todo 这里可以根据后端返回的code进行判断再返回
         */
        if (response.data.code === '0' || response.data.code === 200) {
          return response.data
        } else {
          // message.error(response.data.message);
          message.error(response.data.message || '服务器错误，请联系运维人员')
          return Promise.reject(response.data.message || '服务器错误，请联系运维人员')
        }
      },
      (error: AxiosError) => {
        console.log('error', error)
        const { response } = error
        if (response) {
          this.errorHandler(response.status, response.data)
        } else {
          // const msg = {
          //   "ERR_NETWORK": "发送失败，请联系运维人员"
          // }
          console.log('error.message', error.message)
          message.error('服务器错误，请联系运维人员')
        }
        return Promise.reject(error)
      }
    )
  }

  // 异常请求处理
  private errorHandler(status: number, msg?: any): void {
    switch (status) {
      case 401:
        message.error('账号密码错误请重新登录')
        break
      case 302:
        // window.location.href = `http://10.66.42.70:8080/cas/login?service=${window.config.VITE_APP_URL}`;
        break
      default:
        message.info(msg)
    }
    console.log(status, msg)
  }

  public get<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request({ ...config, method: 'GET' })
  }

  public post<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request({ ...config, method: 'POST' })
  }

  public put<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request({ ...config, method: 'PUT' })
  }

  public patch<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request({ ...config, method: 'PATCH' })
  }

  public delete<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request({ ...config, method: 'DELETE' })
  }

  private request<T>(config: AxiosRequestConfig): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.axiosInstance
        .request(config)
        .then((resp: AxiosResponse<ResultType<any>>) => {
          resolve(resp as any)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const http = new AxiosHttp()
export { http, Axios }
