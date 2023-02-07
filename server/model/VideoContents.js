const {Sequelize, Model, DataTypes} = require('sequelize')

class VideoContents {
    constructor(sequelize) {
        // 评论
        this.videoContent = sequelize.define('INSvideoContents', {
            contentid: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            projectId: DataTypes.INTEGER(),
            userId: DataTypes.INTEGER(),
            content: DataTypes.STRING,
            userName: DataTypes.STRING,
            headIcon: DataTypes.STRING,
        }, {
            timestamps: true // 开启/关闭事件戳
        })
    }

    async videoContentAdd(postData) {
        try {
            const result = await this.videoContent.create({
                projectId: postData.projectId,
                userId: postData.userId,
                content: postData.content,
                userName: postData.userName,
                headIcon: postData.headIcon,
            })
            return result
        } catch (error) {
            console.error('!!!!:', error);
        }

    }

    async videoContentQuery(postData) {
        const result = await this.videoContent.findAll({
            where: {
                projectId: postData.projectId
            }
        })
        return result
    }

}

module.exports = {
    VideoContents
};
