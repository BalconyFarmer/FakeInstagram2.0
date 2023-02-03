const {Sequelize, Model, DataTypes} = require('sequelize')

class Videos {
    constructor(sequelize) {
        // 定义用户模型
        this.videos = sequelize.define('INSvideos', {
            videoid: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            userid: DataTypes.INTEGER(),
            videoname: DataTypes.STRING,
            videopath: DataTypes.STRING,
            type: DataTypes.STRING
        }, {
            timestamps: true // 开启/关闭事件戳
        })
    }

    async getMyProfile(userId) {
        const result = await this.videos.findAll({
            where: {
                userid: userId,
                type: "img"

            }
        })
        if (result[0]) {
            return result
        } else {
            return
        }
    }

    async getMyProfileVideo(userId) {
        const result = await this.videos.findAll({
            where: {
                userid: userId,
                type: "video"
            }
        })
        if (result[0]) {
            return result
        } else {
            return
        }
    }

    async delMyProfile(msID) {

        const result = await this.videos.destroy({
            where: {
                videoid: msID
            }
        })
        return result
    }

    async delMyProfileVideo(msID) {

        const result = await this.videos.destroy({
            where: {
                videoid: msID
            }
        })
        return result
    }

    async updateMyProfile(params) {

        const result = await this.videos.update(
            {
                'videoname': params.msg
            },
            {
                'where': {'videoid': params.msgid}
            })
        return result
    }

    async saveVideo(postData) {
        const result = await this.videos.create({
            // userid: postData.userid,
            // videoname: postData.videoname,
            // videopath: postData.videopath,
            // type: postData.type
            userid: "11",
            videoname: "11",
            videopath: "11",
            type: "11"
        })
        return result
    }

    async saveBigImg(postData) {
        const result = await this.videos.create({
            userid: postData.userid,
            videoname: postData.videoname,
            videopath: postData.videopath,
            type: "img"
        })
        return result
    }

    async getVideoList(pageIndex) {
        const result = await this.videos.findAll(
            {
                'order': [['timestamp', 'DESC']],
                limit: 3,
                offset: pageIndex
            }
        )
        return result
    }

    async getVideoListLength() {
        const result = await this.videos.findAndCountAll(
            {
                'order': [['timestamp', 'DESC']],
            }
        )
        return result
    }

}

module.exports = {
    Videos
};
