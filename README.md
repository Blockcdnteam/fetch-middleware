# fetch-middleware
BlockCDN Ajax http request middleware

# axios网络请求封装组件说明文档

axios封装请求为`api/fetch.js`,具体说明请看注释。
`account_api.js`为封装的请求，具体调用方式为


```
import * as api from '../api/account_api'
api.调用方法名(你的参数).then((resp) => {
    if(resp.data){
        console.log(resp.data)
    }else{

    }
    
}).catch(function (error) {
    console.log(error)
});
```
如果不进行此方式，直接使用fetch.js的方法为：
```
import fetch from './api/fetch'
fetch({
url: '请求地址',
method: 'post',
data: 请求参数
}).then((resp) => {
   console.log(resp.data)
})
```