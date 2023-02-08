import axios from 'axios';
import {serverAdress} from '@/config';

/**
 * 添加评论
 * @param formData
 * @returns {*}
 */
export function videoContentAdd(formData) {
    return axios({
        method: "post",
        url: serverAdress + '/videoContentAdd',
        data: formData,
        withCredentials: true
    })
}

export function videoContentQuery(formData) {
    return axios({
        method: "post",
        url: serverAdress + '/videoContentQuery',
        data: formData,
        withCredentials: true
    })
}

export function test(formData) {
    return axios({
        method: "post",
        url: serverAdress + '/test',
        data: formData,
        withCredentials: true
    })
}

/**
 * 获取我的作品
 * @param formData
 * @returns {*}
 */
export function getMyProfile(formData) {
    return axios({
        method: "post",
        url: serverAdress + '/getMyProfile',
        data: formData,
        withCredentials: true
    })
}

/**
 * 获取我的作品_video
 * @param formData
 * @returns {*}
 */
export function getMyProfileVideo(formData) {
    return axios({
        method: "post",
        url: serverAdress + '/getMyProfileVideo',
        data: formData,
        withCredentials: true
    })
}

/**
 * 删除我的图片 文字
 * @param formData
 * @returns {*}
 */
export function delMyProfile(formData) {
    return axios({
        method: "post",
        url: serverAdress + '/delMyProfile',
        data: formData,
        withCredentials: true
    })
}

/**
 * 删除我的视频 文字
 * @param formData
 * @returns {*}
 */
export function delMyProfileVideo(params) {
    return axios({
        method: "post",
        url: serverAdress + '/delMyProfileVideo',
        data: params,
        withCredentials: true
    })
}

/**
 * 更新我的作品
 * @param formData
 * @returns {*}
 */
export function updateMyProfile(formData) {
    return axios({
        method: "post",
        url: serverAdress + '/updateMyProfile',
        data: formData,
        withCredentials: true
    })
}


/**
 * 注册
 */
export function signUpApi(params) {
    return axios({
        method: "post",
        url: serverAdress + '/regist',
        data: {
            name: params.name,
            password: params.password
        },
        withCredentials: true
    })
}

/**
 * 登陆
 */
export function loginApi(params) {
    return axios({
        method: "post",
        url: serverAdress + '/login',
        data: {
            name: params.name,
            password: params.password
        },
        withCredentials: true
    })
}

export function saveVideo(formData) {
    return axios({
        method: "post",
        url: serverAdress + '/saveVideo',
        data: formData,
        withCredentials: true
    })
}

export function uploadHead(formData) {
    return axios({
        method: "post",
        url: serverAdress + '/uploadHead',
        data: formData,
        withCredentials: true
    })
}

/**
 * 获取 视频 文字
 * @param formData
 * @returns {*}
 */
export function getVideoList(formData) {
    return axios({
        method: "post",
        url: serverAdress + '/getVideoList',
        data: formData,
    })
}



/**
 * 加载用户头像
 */
export function getUserById(id) {
    return axios({
        method: "post",
        url: serverAdress + '/getUserById',
        data: {
            id: id
        },
    })
}

/**
 *
 */
export function addAttention(params) {
    return axios({
        method: "post",
        url: serverAdress + '/addAttention',
        data: params,
        withCredentials: true
    })
}

/**
 *
 */
export function delAttention(params) {
    return axios({
        method: "post",
        url: serverAdress + '/delAttention',
        data: params,
        withCredentials: true
    })
}


/**
 *
 */
export function findAttention(params) {
    return axios({
        method: "post",
        url: serverAdress + '/findAttention',
        data: params,
        withCredentials: true
    })
}

/**
 *
 */
export function findMyAttention(params) {
    return axios({
        method: "post",
        url: serverAdress + '/findMyAttention',
        data: params,
        withCredentials: true
    })
}

/**
 *
 */
export function findMyFlowerAttention(params) {
    return axios({
        method: "post",
        url: serverAdress + '/findMyFlowerAttention',
        data: params,
        withCredentials: true
    })
}

