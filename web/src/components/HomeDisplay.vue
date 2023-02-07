<template>
    <div v-loading="loading" class="hAll">
        <div class="up" v-if="getsendShow">
            <upload-big-img @callback="afterUpload"></upload-big-img>
        </div>

        <div class="videoAll" v-if="videoList.length">
            <div v-for="item in videoList">

                <div class="videoItem" v-if="item.videopath">
                    <div class="top">
                        <div class="headIcon finger" @click="gotoPer(item.userInf)">
                            <img style="width: 100%; height: 100%;border-radius: 50%;" :src="serverAdress + item.userInf.headIcon">
                        </div>
                        <div @click="gotoPer(item.userInf)" class="userName finger" v-if="item.userInf">{{ item.userInf.name }}</div>
                    </div>

                    <PlayVideo v-if="item.type == 'video'" class="centerPlayVideo" :mySrc="serverAdress + item.videopath"></PlayVideo>
                    <!--                    <img v-if="item.type == 'img'" class="centerPlayVideo" :src="serverAdress + item.videopath" id="wordPic">-->

                    <el-image
                        fit="cover"
                        class="centerPlayVideo"
                        v-if="item.type == 'img'"
                        style="width: 100%; height: 60%"
                        :src="serverAdress + item.videopath"
                        :preview-src-list="[serverAdress + item.videopath]">
                    </el-image>

                    <div class="bottom">
                        <div class="picName">
                            <span style="font-weight: bold;margin-left: 10px">{{ item.userInf.name }} : </span>
                            <div style="overflow: auto" v-html="item.videoname"></div>
                        </div>
                        <div v-if="item.contentList.length" v-for="item1 in item.contentList">
                            <span style="font-weight: bold;margin-left: 10px">{{ item1.userName }} : </span>
                            <span class="vdName">{{ item1.content }}</span>
                            <span class="vdName">{{ item1.updatedAt }}</span>
                        </div>
                    </div>

                    <div class="sendChat">
                        <div class="textInner">
                            <el-input
                                type="textarea"
                                :rows="1"
                                placeholder="发表评论"
                                v-model="item.textarea">
                            </el-input>
                        </div>

                        <div class="btn">
                            <el-button size="mini" type="primary" icon="el-icon-check" @click="addContent(item)"></el-button>
                        </div>
                    </div>
                </div>

            </div>

            <el-dialog
                title="个人主页"
                :visible.sync="dialogVisible"
                width="90%"
            >
                <PersonalPage v-if="dialogVisible"></PersonalPage>
            </el-dialog>

        </div>
        <div v-else>快来分享有shi以来第一条消息吧!</div>
        <div class="bottomLoad" v-if="allProLength > videoList.length">
            <button @click="get">
                加载
            </button>
        </div>

    </div>
</template>

<script>
import {serverAdress} from '../config'
import {getVideoList, getUserById, videoContentAdd, videoContentQuery, test} from '@/api/api'
import PersonalPage from "./PersonalPage/PersonalPage";
import PlayVideo from "../commonComponents/PlayVideo";
import {mapGetters, mapState, mapMutations} from "vuex";
import ChangeHead from "./PersonalPage/ChangeHead";
import uploadBigImg from "./uploadBigImg/uploadBigImg";

export default {
    components: {PlayVideo, PersonalPage, ChangeHead, uploadBigImg},
    data() {
        return {
            allMsg: null,
            videoList: [],
            serverAdress: serverAdress,
            dialogVisible: false,

            contentPatams: {
                textarea: null,
                projectId: null
            },
            contentList: [],
            loading: false,
            i: 0,
            allProLength: 0,
        }
    },
    computed: {
        ...mapGetters(["getUserInf", "getsendShow"])
    },
    methods: {
        addContent(contentPatams) {

            if (contentPatams.textarea) {
                let params = {
                    projectId: contentPatams.videoid,
                    userId: this.getUserInf.id,
                    content: contentPatams.textarea,
                    userName: this.getUserInf.name,
                    headIcon: this.getUserInf.headIcon
                }
                videoContentAdd(params).then(res => {
                    if (res.status == 200) {
                        contentPatams.contentList.push(params)
                        this.$forceUpdate()
                    }

                })
            } else {
                this.$message.error('请输入内容!');
            }
        },


        async loadAllVideo(pageIndex) {
            this.loading = true

            const formData = {
                pageIndex: pageIndex
            }
            const _res = await getVideoList(formData)

            // const see = await test()
            // console.log(see)
            // debugger

            const list = _res.data.list
            this.allProLength = _res.data.allCnt

            if (list.length) {
                list.forEach(item => {
                    this.videoList.push(item)
                })
            } else {
            }

            // 获取用户信息
            for (let i = 0; i < this.videoList.length; i++) {
                let res = await getUserById(this.videoList[i].userid)

                if (res.data) {
                    this.videoList[i].userInf = res.data
                    this.videoList[i].userInf.headIcon = this.videoList[i].userInf.headIcon.slice(8)
                }
            }

            // 获取评论内容
            this.videoList.forEach(item => {
                item.contentList = []
                this.getChat(item)
            })

            this.loading = false

        },

        afterUpload() {
            this.videoList = []
            this.i = 0
            this.get()
        },

        getChat(data) {
            const self = this
            this.contentPatams.projectId = data.videoid
            videoContentQuery({projectId: this.contentPatams.projectId}).then(responce => {
                this.contentList = responce.data
                data.contentList = responce.data
                self.$forceUpdate()
            })
        },
        gotoPer(data) {

            if (data.id == this.getUserInf.id) {
                let userInf = {
                    show: false,
                    inf: null
                }
                this.$store.commit('changeAnotherUser', userInf)
            } else {
                let userInf = {
                    show: true,
                    inf: data
                }
                this.$store.commit('changeAnotherUser', userInf)
            }

            this.dialogVisible = true
        },
        async get() {
            await this.loadAllVideo(this.i)
            this.i = this.i + 3
        }

    },
    created() {
    },
    async mounted() {
        await this.get()
    }
}
</script>

<style lang="less">
@value: 0.01;

.hAll {
    .up {
        width: 100%;
        height: 20%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
}

.videoAll {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .videoItem {
        width: 600px;
        height: 500px;
        margin: 30px;
        border: 1px solid grey;

        .top {
            width: 100%;
            height: 10%;
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;


            .headIcon {
                width: 40px;
                height: 40px;
                margin-left: 20px;
            }

            .userName {
                margin-left: 20px;
                color: gray;
                font-size: 4px;
            }

        }

        .centerPlayVideo {
            width: 100%;
            height: 60%;
        }

        .bottom {
            width: 100%;
            height: 23%;
            overflow: auto;
            position: relative;

            .vdName {
                margin-left: 20px;
            }

            .picName {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;
            }
        }

        .sendChat {
            width: 100%;
            height: 7%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .btn {
                height: 100%;
            }

            .textInner {
                width: 90%;
                height: 100%;
            }

            .el-textarea {
                width: 100% !important;
                height: 100% !important;
            }

            .el-textarea__inner {
                width: 100% !important;
                height: 100% !important;
                min-height: 10px !important;
            }

        }
    }

}

.bottomLoad {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>
