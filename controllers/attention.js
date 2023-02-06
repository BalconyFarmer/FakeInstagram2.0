const {initSequelize} = require("../app");


const attention = {
    async addAttention(ctx) {
        const result = await initSequelize.attention.addAttention(ctx.request.body)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = ''
        }
    },

    async delAttention(ctx) {
        const result = await initSequelize.attention.delAttention(ctx.request.body)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = ''
        }
    },

    async findAttention(ctx) {
        const result = await initSequelize.attention.findAttention(ctx.request.body)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = ''
        }
    }
}

module.exports = {
    attention
};
