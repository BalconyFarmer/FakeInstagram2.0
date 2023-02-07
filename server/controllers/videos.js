const getUploadFileExt = require("../common/utils/getUploadFileExt");
const checkDirExist = require("../common/utils/checkDirExist");
const getUploadFileName = require("../common/utils/getUploadFileName");
const {initSequelize} = require("../app");
const koaBody = require('koa-body')
const path = require('path');
const fs = require('fs');
const {sessionApp} = require("../app.js")

const videos = {

    saveVideoBefore: koaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(__dirname, './2userStatic'),
            keepExtensions: true,
            maxFieldsSize: 2000 * 1024 * 1024,  // 1000 M
            onFileBegin: (name, file) => {
                const fileType = "videos"
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

    saveVideo: async ctx => {
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
                videoname: ctx.request.body.videoname,
                videopath: item.realPath,
                type: ctx.request.body.type
            }
            initSequelize.videos.saveVideo(postData)
            result.push(postData)
        })
        ctx.body = result;
    },

    delMyProfile: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.videos.delMyProfile(postData.id)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    },

    updateMyProfile: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.videos.updateMyProfile(postData)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    },
    getMyProfileByType: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.videos.getMyProfile(postData.id, postData.type)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    },
    getVideoList: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.videos.getVideoList(ctx.request.body.pageIndex)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    },
    getVideoListLength: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.videos.getVideoListLength()
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    },
}

module.exports = {
    videos
};
