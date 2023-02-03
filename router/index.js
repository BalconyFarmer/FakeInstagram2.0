const Router = require('koa-router')
const router = new Router()
const {users} = require("../controllers/users")
const {videos} = require("../controllers/videos")

const routeList = [

    {
        method: 'post',
        path: '/regist',
        controller: users.regist
    },
    {
        method: 'post',
        path: '/login',
        controller: users.login
    },
    {
        method: 'post',
        path: '/getUserById',
        controller: users.getUserById
    },
    {
        method: 'post',
        path: '/uploadHead',
        before: users.uploadHeadBefore,
        controller: users.uploadHead
    },

    {
        method: 'post',
        path: '/saveVideo',
        before: videos.saveVideoBefore,
        controller: videos.saveVideo
    },
    {
        method: 'post',
        path: '/delMyProfile',
        controller: videos.delMyProfile
    },
    {
        method: 'post',
        path: '/updateMyProfile',
        controller: videos.updateMyProfile
    },
    {
        method: 'post',
        path: '/getMyProfileByType',
        controller: videos.getMyProfileByType
    },
    {
        method: 'post',
        path: '/getVideoList',
        controller: videos.getVideoList
    },
    {
        method: 'post',
        path: '/getVideoListLength',
        controller: videos.getVideoListLength
    },
];

routeList.forEach(item => {
    if (item.before) { // 文件上传处理
        const {method, path, before, controller} = item;
        router[method](path, before, controller);
    } else {
        const {method, path, controller} = item;
        router[method](path, controller);
    }
});


module.exports = {router};
