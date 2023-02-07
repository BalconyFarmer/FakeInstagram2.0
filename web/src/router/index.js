import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/index'
import LoginRegist from '@/components/LoginRegist'
import HomeDisplay from '@/components/HomeDisplay'
import PersonalPage from "../components/PersonalPage/PersonalPage";

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: HomePage,
            children: [
                {path: 'homeDisplay', component: HomeDisplay},
                {path: 'LoginRegist', component: LoginRegist},
                {path: 'goPersonalPage', component: PersonalPage},
            ]
        },
        {
            path: '/LoginRegist',
            name: 'LoginRegist',
            component: LoginRegist
        },
    ],
    mode: "history",
    // mode: "hash",

    // base: process.env.NODE_ENV === "development" ? "/test/test" : "bigdata/web/",
    base: process.env.NODE_ENV === "development" ? "/test" : "/loginRegist",
})

router.beforeEach((to, from, next) => {
    // 路由拦截
    // const currentRouter = localStorage.getItem('currentRouter')

    // if (currentRouter && currentRouter != to.path) {
    //     next({path: currentRouter})
    // } else {
    //     next()
    // }

    next()
    localStorage.setItem('currentRouter', to.path)
})
export default router
