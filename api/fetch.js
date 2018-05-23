import axios from 'axios'                       //网络请求组件
import Qs from 'qs';                            //数据解析库(使用json亦可，本文未使用qs，如需要，可替换json为qs)
import { Message } from 'element-ui'            //element组件，本文使用message消息提示
import router from '../router'                  //路由引入，拦截访问，进行路由跳转
import * as api from '../api/account_api'       //封装axios请求组件，在特定业务场景使用里面的请求
import store from '../store/index'

//axios网络封装请求开始

var service = axios.create({
    // process.env.NODE_ENV获取当前业务场景的环境,以使用不同的api地址.可将请求地址换为process.env.NODE_ENV.API_ROOT,API_ROOT为自定义api请求地址
    //示例如下：
    //baseURL: process.env.NODE_ENV === 'production' ? process.env.NODE_ENV.API_ROOT : process.env.NODE_ENV === 'presentation' ? 'http://192.168.3.200:8083' : 'http://192.168.3.46:8888',
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : process.env.NODE_ENV === 'presentation' ? 'http://192.168.3.200:8083' : 'http://192.168.3.43:8888',
    timeout: 100000,
    // isRetryRequest = false
})
//获取登录时存储的sessionStorage
let getJsonStr = window.sessionStorage.getItem('token');
//进行数据格式的转换
let getEntity = JSON.parse(getJsonStr);
//拦截网络请求开始
service.interceptors.request.use(config => {
    // 请求头添加token , 就给头部带上token
    if (sessionStorage.getItem('token')) {
        config.headers.Authorization = getEntity.token_type +" "+ getEntity.access_token; // 让每个请求携带token  
    }
    return config;
},error => {
    // 请求错误消息提示
    Message({
        message: error.message,
        type: "error"
    });
    return Promise.reject(error.data.error.message);
 });



//返回状态判断(添加响应拦截器)
service.interceptors.response.use(response => {
   
    return response
    // 返回数据进行消息提示
    if(!response.data){
        Message({
            message: "数据响应失败",
            type: "warning"
        });
    }
},error => {
        const config = error.config
        //拦截response 返回状态码，如果为401需要重新进行token刷新，调用请求并传入参数
        if (error.response.status === 401) {
            const retryreq = new Promise((resolve, reject) => {
                api.refreshToken(store.state.usertonken.refresh_token).then((resp) => {
                    if(resp.data.code === 2000000){
                        this.loginloading = true;
                        //重新添加token到sessionStorage
                        window.sessionStorage.setItem('token',JSON.stringify(resp.data.data))
                        //用vuex重新设置基本信息
                        store.commit('add_login_info',resp.data.data)
                        this.loginloading = false;
                        //修改_retry
                        config._retry = true;
                        let getJsonStr = window.sessionStorage.getItem('token');
                        //进行数据格式的转换
                        let getEntity = JSON.parse(getJsonStr);
                        //修改原请求的token
                        config.headers.Authorization = getEntity.token_type + " " +getEntity.access_token;
                        config.baseURL = '';
                        resolve(axios(config));
                    }
                    
                }).catch(function (error) {
                    console.log(error)
                });
            });
            return retryreq;
        }
        
        
       
        //拦截response 返回状态码，如果为400进行错误消息提示
        if (error.response.status === 400) {
            Message({
                message:error.response.data.err_msg,
                type: "warning"
            });
        }
        if (error.response.status === 403) {
            store.commit('remove_login_info')
            this.$router.push({path:'/login'})
            // window.location.reload()
        }
        return Promise.reject(error);
    }
   
);
service.install = (Vue) => {
    Vue.prototype.$http = axios
}

export default service
  
  