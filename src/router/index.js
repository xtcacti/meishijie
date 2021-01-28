import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import {userInfo} from '@/service/api';
import Store from '@/store/index';

import Home from '@/views/home/Home.vue';
import { from } from 'core-js/fn/array';
const Login = ()=>import('@/views/user-login/login.vue');
const Register = ()=>import('@/views/user-login/register.vue');
const Recipe = ()=>import('@/views/recipe/recipe.vue');
const Create = ()=>import('@/views/create/create.vue');
const Edit = ()=>import('@/views/user-space/edit.vue');

const Space = ()=>import( /*webpackChunkName:"space" */ '@/views/user-space/space.vue');
const MenuList = ()=>import( /*webpackChunkName:"space" */ '@/views/user-space/menu-list.vue');
const Fans = ()=>import( /*webpackChunkName:"space" */ '@/views/user-space/fans.vue');

const Detail = ()=>import('@/views/detail/detail.vue');

const viewsRoute = [
    {
        path:'/recipe',
        name:'recipe',
        title:'菜谱大全',
        component:Recipe
    },
    {
        path:'/create',
        name:'create',
        title:'发布菜谱',
        component:Create,
        meta:{
            login:true
        }
    },
    {
        path:'/edit',
        name:'edit',
        title:'编辑个人资料',
        component:Edit,
        meta:{
            login:true
        }
    },
    {
        path:'/space',
        name:'space',
        title:'个人空间',
        component:Space,
        meta:{
            login:true
        },
        redirect:{
            name:'works'
        },
        children:[
            {
               path:'works',
                name:'works',
                title:'作品',
                component:MenuList,
                meta:{
                    login:true
                } 
            },
            {
               path:'fans',
                name:'fans',
                title:'我的粉丝',
                component:Fans,
                meta:{
                    login:true
                } 
            },
            {
               path:'following',
                name:'following',
                title:'我的关注',
                component:Fans,
                meta:{
                    login:true
                } 
            },
            {
               path:'collection',
                name:'collection',
                title:'收藏',
                component:MenuList,
                meta:{
                    login:true
                } 
            }
        ]
    },
    {
        path:'/detail',
        name:'detail',
        title:'菜谱细节',
        component:Detail,
    }
]

const router = new Router({
    mode:"history",  //hash http://localhost:8080#home | history http://localhost:8080/home
    routes:[
        {
            path:'/',
            name:'home',
            title:'首页',
            component:Home
        },
        {
            path:'/register',
            name:'register',
            title:'注册页',
            component:Register,
        },
        {
            path:'/login',
            name:'login',
            title:'登录页',
            component:Login,
            meta:{
                login:true
            }
        },
        ...viewsRoute,
        {
            path:'*',
            name:'noFound',
            title:'未找到',
            redirect:{
                name:'home'
            }
        }
    ]
})

router.beforeEach(async (to,from,next)=>{
    const token = localStorage.getItem('token');
    const isLogin = !!token;
    //进入路由的时候，都要向后端发送token,验证合法不合法
    //不管路由需不需要登录，都需要展示用户信息
    //都需要向后端发请求，拿到用户信息
    const data = await userInfo();
    Store.commit('changeUserInfo', data.data);
    console.log(data);
    if(to.matched.some(item => item.meta.login)){
        if(isLogin){
            if(data.error === 400){
                next({name:'login'});
                localStorage.removeItem('token');
                return;
            }
            if(to.name === 'login'){
                next({name:'home'});
            }else{
                next();
            }
            return;
        }
        //没登录，进入的是login,直接进入
        if(!isLogin && to.name=='login'){
            next();
        }
        //没登录，进入的不是login,跳转到login
        if(!isLogin && to.name!=='login'){
            next({name:'login'})
        }
    }else{
        next();
    }
})

export default router;