<template>
    <div class="all">
        <div class="inner">
            <div class="top">
                <div class="left1 finger" v-if="userInf.headIcon">
                    <img @click="anotherUser.show ? ChangeHeadShow = false : ChangeHeadShow = true"
                         :src="serverAdress + userInf.headIcon">
                </div>

                <div class="right1">
                    <div class="name">{{ this.userInf.name }}</div>

                    <div v-if="this.anotherUser.show">
                        <div v-if="attentionFlag">已关注</div>
                        <div v-else>未关注</div>
                        <el-switch
                            @change="changeAttention"
                            v-model="attentionFlag"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch>
                    </div>

                    <div class="follow finger">
                        <div @click="folowing = true"> {{ myAttentionList.length }} following</div>
                        <div @click="folower = true"> {{ myFolowAttentionList.length }} followers</div>
                    </div>
                </div>
            </div>

            <div class="bottom">
                <div class="bottomHeader" v-loading="loading">
                    <div class="finger" :class="{ active : buttonIndex == 'pic' }" @click="buttonIndex='pic'">pictures
                    </div>
                    <div class="finger" :class="{ active : buttonIndex == 'video' }" @click="buttonIndex='video'">
                        videos
                    </div>
                </div>

                <div v-if="buttonIndex == 'pic'">
                    <el-table :data="gridData">
                        <el-table-column label="图片预览">
                            <template width="90" slot-scope="scope">
                                <img style="width:80px;height:80px;border:none;"
                                     :src="serverAdress + scope.row.videopath">
                            </template>
                        </el-table-column>
                        <el-table-column property="videoname" label="名称" width="150"></el-table-column>
                        <el-table-column property="videoid" label="id" width="200"></el-table-column>
                        <el-table-column
                            v-if="!this.anotherUser.show"

                            fixed="right"
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button @click="handleUpdata(scope.row)" type="text" size="small">修改</el-button>
                                <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-dialog title="??" :visible.sync="dialogVisible" :modal-append-to-body='false'>
                        <el-input v-model="input" placeholder="请输入内容"></el-input>
                        <el-button @click="handleUpdataGo()" type="text" size="small">提交</el-button>
                    </el-dialog>
                </div>

                <div v-if="buttonIndex == 'video'">
                    <el-table :data="videoList">
                        <el-table-column label="视频预览">
                            <template width="90" slot-scope="scope">
                                <PlayVideo class="PlayVideo" :mySrc="serverAdress + scope.row.videopath"></PlayVideo>
                            </template>
                        </el-table-column>
                        <el-table-column property="videoname" label="videoname" width="150"></el-table-column>
                        <el-table-column
                            v-if="!this.anotherUser.show"
                            fixed="right"
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button @click="deleteVideo(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </div>
        </div>

        <el-dialog
            title="更换头像"
            :visible.sync="ChangeHeadShow"
            width="90%"
            append-to-body
        >
            <ChangeHead v-if="ChangeHeadShow"></ChangeHead>
        </el-dialog>

        <el-dialog
            title="我的关注"
            :visible.sync="folowing"
            width="90%"
            append-to-body
        >
            <div v-for="item in  myAttentionList ">
                {{ item }}
            </div>
        </el-dialog>


        <el-dialog
            title="关注我的:"
            :visible.sync="folower"
            width="90%"
            append-to-body
        >
            <div v-for="item in myFolowAttentionList ">
                {{ item }}
            </div>
        </el-dialog>


    </div>
</template>

<script>
import {mapGetters, mapState, mapMutations} from "vuex";
import {
    findMyFlowerAttention,
    findMyAttention,
    findAttention,
    delAttention,
    addAttention,
    getMyProfileByType,
    delMyProfile,
    updateMyProfile,
    getMyProfileVideo,
    delMyProfileVideo
} from '@/api/api'
import {serverAdress} from '@/config';
import PlayVideo from "@/commonComponents/PlayVideo";
import ChangeHead from "./ChangeHead";

export default {
    name: "PersonalPage.vue",
    components: {PlayVideo, ChangeHead},
    computed: {
        ...mapGetters(["getUserInf", "anotherUser"])
    },
    data() {
        return {
            folowing: false,
            folower: false,
            myFolowAttentionList: [],
            myAttentionList: [],
            attentionFlag: false,
            ChangeHeadShow: false,
            serverAdress: serverAdress,
            userInf: null,
            buttonIndex: 'video',
            gridData: [{
                msg: "1",
                msgid: 13,
                picData: "data:image/png;base64,/9j/4SCJaHR0cDovL25zLmFkb2J..",
                picPath: "./static/2userStatic/78/pictures/头像.jpg.png",
                userid: 78
            }],
            videoList: [],
            dialogVisible: false,
            input: null,
            loading: false

        }
    },
    watch: {
        buttonIndex: {
            handler(newValue) {
                this.getVideoList()
            },
            deep: true,
            immediate: true

        },
        anotherUser: {
            handler(newValue) {
                this.switchUser()
            },
            deep: true,
            immediate: false
        }
    },
    methods: {
        changeAttention(data) {
            if (data) {
                this.addAttention()
            } else {
                this.delAttention()
            }
        },
        deleteVideo(data) {
            const videoid = data.videoid
            const videopath = data.videopath
            const params = {
                videoid: videoid,
                videopath: videopath
            }
            delMyProfileVideo(params).then(res => {
                this.$message.success(res.data);
                this.getVideoList()
            })
        },
        getPicList() {
            this.loading = true
            let userInf = null
            if (this.anotherUser.show) {
                userInf = this.anotherUser.inf
            } else {
                userInf = this.getUserInf
            }

            this.gridData = []
            const param = {id: userInf.id, type: "video"}
            getMyProfileByType(param).then(res => {
                if (res.data.length) {
                    this.gridData = res.data
                    this.loading = false
                } else {
                    this.loading = false
                }
            })
        },
        getVideoList() {
            this.loading = true

            let userInf = null
            if (this.anotherUser.show) {
                userInf = this.anotherUser.inf
            } else {
                userInf = this.getUserInf
            }

            const param = {id: userInf.id, type: this.buttonIndex}
            this.videoList = []
            getMyProfileByType(param).then(res => {
                if (res.data.length) {
                    this.videoList = res.data
                    this.loading = false
                } else {
                    this.videoList = []
                    this.loading = false
                }
            })
        },
        handleUpdata(data) {
            this.inputID = data.videoid
            this.dialogVisible = true
        },
        handleClick(data) {
            const param = {id: data.videoid, path: data.videopath}
            delMyProfile(param).then(res => {
                this.$message.success(res.data);
                this.getPicList()
            })
        },
        handleUpdataGo() {

            const param = {
                msgid: this.inputID,
                msg: this.input
            }
            updateMyProfile(param).then(res => {
                if (res.data) {
                    this.$message.success(res.data);
                }
            })
        },

        switchUser() {
            let userInf = null
            if (this.anotherUser.show) {
                userInf = this.anotherUser.inf
            } else {
                userInf = this.getUserInf
            }
            this.userInf = userInf
        },

        checkAttention() {
            const params = {
                'from': this.getUserInf.id,
                'to': this.anotherUser.inf.id
            }

            findAttention(params).then(res => {
                if (!res.data.length) {
                    this.attentionFlag = false
                } else {
                    this.attentionFlag = true
                }
            })
        },

        addAttention() {
            const params = {
                'from': this.getUserInf.id,
                'to': this.anotherUser.inf.id
            }

            addAttention(params).then(res => {
                console.log(res, "+++++++++++++")
            })
        },

        delAttention() {
            const params = {
                'from': this.getUserInf.id,
                'to': this.anotherUser.inf.id
            }

            delAttention(params).then(res => {
                console.log(res, "+++++++++++++")
            })
        },
        findMyAttention() {

            let params = null
            if (this.anotherUser.show) {
                params = {
                    from: this.anotherUser.inf.id
                }
            } else {
                params = {
                    from: this.getUserInf.id
                }
            }

            findMyAttention(params).then(res => {
                this.myAttentionList = res.data
            })
        },

        findMyFolowAttention() {
            let params = null
            if (this.anotherUser.show) {
                params = {
                    to: this.anotherUser.inf.id
                }
            } else {
                params = {
                    to: this.getUserInf.id
                }
            }
            findMyFlowerAttention(params).then(res => {
                this.myFolowAttentionList = res.data
            })
        }


    },
    mounted() {
        this.switchUser()

        if (this.anotherUser.show) {
            this.checkAttention()
        }

        this.findMyAttention()

        this.findMyFolowAttention()
    }

}
</script>

<style scoped lang="less">

.all {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .inner {
        width: 50%;
        height: 100%;

        .top {
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            height: 25%;
            border-bottom: 1px solid gray;
            margin-top: 30px;

            .left1 {
                width: calc(100vw * 0.1);
                height: calc(100vw * 0.1);
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                img {
                    object-fit: cover;
                    width: calc(100vw * 0.1);
                    height: calc(100vw * 0.1);
                    border-radius: 50%;
                    z-index: 1;
                }

            }

            .right1 {
                width: 80%;
                height: 100%;
                //border: 4px solid #0e24bd;
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-left: 100px;

                .name {
                    font-size: 30px;
                    font-weight: bold;
                }

                .follow {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;

                    div {
                        margin-right: 30px;
                    }
                }
            }

        }

        .bottom {
            width: 100%;
            height: 75%;
            margin-top: 30px;

            .bottomHeader {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                font-size: 20px;
                color: gray;
                margin-bottom: 30px;

            }

            .active {
                font-weight: bold;
                color: black;
            }
        }
    }
}


</style>
