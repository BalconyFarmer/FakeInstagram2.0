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

    async getMyProfile(userId, type) {
        const result = await this.videos.findAll({
            where: {
                userid: userId,
                type: type
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
            userid: postData.userid,
            videoname: postData.videoname,
            videopath: postData.videopath,
            type: postData.type
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
