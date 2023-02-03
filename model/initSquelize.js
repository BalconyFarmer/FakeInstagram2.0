const {Sequelize, Model, DataTypes} = require('sequelize')
const {config} = require('../common/config')
const {Users} = require("./Users")

/**
 * 数据库操作类
 */
class initSquelize {
    constructor() {
        this.init()
    }

    async init() {
        // 链接数据库
        const sequelize = new Sequelize(config.DATABASE, config.USERNAME, config.PASSWORD, {
            host: config.sqlAdress, dialect: 'mysql', timezone: '+08:00', // 输入正确时间
            dialectOptions: {   // 输出正确时间
                charset: 'utf8mb4', dateStrings: true, typeCast: true
            },
        });

        try {
            await sequelize.authenticate();
            console.log('数据库连接成功');
        } catch (error) {
            console.error('数据库链接失败!!!!:', error);
            await sequelize.authenticate();

        }

        this.users = new Users(sequelize)
    }


}

module.exports = {initSquelize}

