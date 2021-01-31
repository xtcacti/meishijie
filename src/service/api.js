import axios from 'axios';

class HttpRequest{
    constructor(options){
        this.defaults = {
            baseURL:''
        }
        this.defaults = Object.assign(this.defaults,options);
    }
    setConfig(){

    }

    interceptors(install){
    install.interceptors.request.use(
      config => {
        let token = localStorage.getItem('token');
        if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
          config.headers.authorization = `token ${token}`;
        }
        return config;
      },
      err => {
        return Promise.reject(err);
      }
    );
    install.interceptors.response.use(
      res => {
        const { data, status } = res;
        return data;
      },
      err => {
        return Promise.reject(err);
      }
    );
  }
    request(options){
        options = Object.assign(this.defaults,options)
        const instance = axios.create(options)
        this.interceptors(instance);
        return instance
    }
}

const request = new HttpRequest({
    baseURL:'/api'
});

const http = request.request();

export async function getBanner(){
    return await http.get('/banner');
}

export async function getMenus(params){
    return await http.get('/menu/query',{params});
}

export async function login(params){
    return await http.post('/user/login',params);
}

export async function userInfo(params){
  return await http.post('/user/info', params);
}

export async function login_out(){
  return await http.post('/user/login_out');
}

export async function register(params){
  return await http.post('/user/create', params);
}

export async function toggleFollowing(params){
  return await http.post('/user/following', params);
}

export async function following(params){
  return await http.get('/user/following', {params});
}

export async function fans(params){
  return await http.get('/user/fans', {params});
}

export async function collection(params){
  return await http.get('/user/collection', {params});
}

export async function upload(params){
  return await http.post('/upload', {params});
}

export async function userEdit(params){
  return await http.post('/user/edit', params);
}

export async function getProperty(){
  return await http.get('/menu/property');
}

export async function getClassify(){
  return await http.get('/menu/classify');
}

export async function publish(params){
  return await http.post('/menu/publish', params);
}
