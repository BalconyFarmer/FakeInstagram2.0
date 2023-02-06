const {initSequelize} = require("../app");


const videoContents = {
    async videoContentAdd(ctx) {
        const result = await initSequelize.videoContents.videoContentAdd(ctx.request.body)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = ''
        }
    },

    async videoContentQuery(ctx) {
        const result = await initSequelize.videoContents.videoContentQuery(ctx.request.body)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = ''
        }
    }
}

module.exports = {
    videoContents
};
