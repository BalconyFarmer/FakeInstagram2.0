const {Sequelize, Model, DataTypes} = require('sequelize')

class Attention {
    constructor(sequelize) {
        // 关注
        this.attention = sequelize.define('INSattentions', {
            attentionid: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            from: DataTypes.INTEGER(),
            to: DataTypes.INTEGER(),
        }, {
            timestamps: true // 开启/关闭事件戳
        })
    }

    async addAttention(params) {
        try {
            const result = await this.attention.create(
                {
                    'from': params.from,
                    'to': params.to
                })
            return result
        } catch (error) {
            console.error('!!!!:', error);
        }

    }

    async delAttention(params) {
        const result = await this.attention.destroy(
            {
                where: {
                    'from': params.from,
                    'to': params.to
                }
            })
        return result
    }


    async findAttention(params) {
        const result = await this.attention.findAll(
            {
                where: {
                    'from': params.from,
                    'to': params.to
                }
            }
        )
        return result
    }

}

module.exports = {
    Attention
};
