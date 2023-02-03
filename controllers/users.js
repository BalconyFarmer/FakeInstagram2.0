const getUploadFileExt = require("../common/utils/getUploadFileExt");
const checkDirExist = require("../common/utils/checkDirExist");
const getUploadFileName = require("../common/utils/getUploadFileName");
const {initSequelize} = require("../app");
const koaBody = require('koa-body')
const path = require('path');
const fs = require('fs');
const {sessionApp} = require("../app.js")

const users = {
    /**
     {
        name: "yiyi",
        password: "yiyi",
        headIcon: './static/2userStatic/defaultPortrait.png'
    }
     * @param ctx
     * @returns {Promise<void>}
     */
    regist: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.users.handleRegist(postData)
        if (result === null) {
            ctx.body = '该账户已注册'
        } else {
            const folderAddress = `./static/2userStatic/${result.id}`
            const folderAddressObj = `./static/2userStatic/${result.id}/objs`
            const folderAddressPic = `./static/2userStatic/${result.id}/pictures`
            const folderAddressvideo = `./static/2userStatic/${result.id}/videos`
            const folderAddressScene = `./static/2userStatic/${result.id}/scenes`
            const headIcon = `./static/2userStatic/${result.id}/headIcon`
            fs.mkdirSync(folderAddress); // 创建用户文件夹
            fs.mkdirSync(folderAddressObj);
            fs.mkdirSync(folderAddressPic);
            fs.mkdirSync(folderAddressvideo);
            fs.mkdirSync(folderAddressScene);
            fs.mkdirSync(headIcon);
            ctx.body = '注册成功'
        }
    },

    /**
     {
    "name" :"11",
    "password" :"11",
    }
     * @param ctx
     * @returns {Promise<void>}
     */
    login: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.users.handleLogin(postData)
        ctx.body = '+++++++++++++++++++++++++++++++++++++++++++++++'
        if (result) {
            if (result.password === postData.password) {
                sessionApp.setSession(ctx, result)
                ctx.body = result
            } else {
                ctx.body = '密码错误'
            }
        } else {
            ctx.body = '请先注册'
        }
    },

    /**
     {
            "id": 1
        }
     */
    getUserById: async ctx => {
        let postData = ctx.request.body
        const params = postData.id
        const result = await initSequelize.users.getUserById(params)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = '获取失败'
        }
    },

    uploadHeadBefore: koaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(__dirname, './2userStatic'),
            keepExtensions: true,
            maxFieldsSize: 2000 * 1024 * 1024,  // 1000 M
            onFileBegin: (name, file) => {
                const fileType = "headIcon"
                // 获取文件后缀
                const ext = getUploadFileExt(file.name);
                const staticPath = '../static'
                const dir = path.join(__dirname, `${staticPath}/2userStatic/${name}/${fileType}`);
                checkDirExist(dir);
                const fileName = getUploadFileName(ext);

                // 真实写入路径
                file.path = `${dir}/${fileName}`;

                // 数据库存储路径
                const realPath = `/2userStatic/${name}/${fileType}/${fileName}`
                file.realPath = realPath
            },
            patchKoa: true
        }
    }),

    uploadHead: async ctx => {
        const files = ctx.request.files

        let userid = null
        for (let i in files) {
            userid = i
        }

        const isArr = Array.isArray(files[userid])
        let fileList = []
        if (isArr) {
            fileList = [...files[userid]]
        } else {
            fileList = [files[userid]]
        }

        let result = []
        fileList.forEach((item) => {
            const postData = {
                userid: userid,
                videoname: ctx.request.body.videoIntroduce,
                videopath: item.realPath
            }
            initSequelize.users.uploadHead(postData)
            result.push(postData)
        })
        ctx.body = result;
    }
}
module.exports = {
    users
};
