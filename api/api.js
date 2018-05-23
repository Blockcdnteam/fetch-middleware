import fetch from './fetch'   //引入axios网络请求封装组件


//进行请求方法的封装，并传入请求参数（非必需）

//获取token
export function getToken(loginmode,phoneno,pwd){
    let data = { loginmode, phoneno ,pwd}
    return fetch({
        url:'login',
        method: 'post',
        data,
    })
}
//登录方法
export function login(){
    return fetch({
        url:'login',
        method:'post'
    })
}
//token刷新方法
export function refreshToken(refresh_token){
    let data = { refresh_token}
    return fetch({
        url:'/connect/refresh',
        method: 'post',
        data,
    })
}

//获取验证码
export function vercode(uid,tcode){
    let data = { uid,tcode}
    return fetch({
        url:'/login_verify',
        method: 'post',
        data,
    })
}