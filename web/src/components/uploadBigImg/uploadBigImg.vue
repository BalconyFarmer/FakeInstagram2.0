<template>
    <!--上传文件-->
    <div id="videoUploadContainer">
        <div id="div1"></div>
        <div>
            <div class="btnss">
                <a-upload class="b1" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
                    <a-button>
                        <a-icon type="upload"/>
                    </a-button>
                </a-upload>

                <a-button
                    class="b2"
                    type="primary"
                    :disabled="fileList.length === 0"
                    :loading="uploading"
                    @click="handleUpload"
                >
                    {{ uploading ? 'Uploading' : '发布' }}
                </a-button>
            </div>
        </div>
    </div>

</template>

<script>
import {saveBigImg, saveVideo} from '@/api/api'
import {serverAdress} from '@/config'
import E from "wangeditor"

export default {
    components: {},
    data() {
        return {
            serverAdress: serverAdress,
            name3D: null,
            fileList: [],
            uploading: false,
            videoIntroduce: null,
            resData: [],
            type: null
        }
    },
    methods: {
        initWangE() {
            this.editorApp = new E('#div1')
            // 配置菜单栏，删减菜单，调整顺序
            this.editorApp.config.menus = [
                'emoticon',
                'bold',
                'fontSize',
                'fontName',
                'italic',
                'underline',
                'strikeThrough',
                'foreColor',
                'backColor',
                'list',
            ]
            this.editorApp.create()
        },
        // 上传至页面
        beforeUpload(file) {
            if (this.fileList.length != 0) {
                this.fileList = []
            }

            if (file.type == "image/jpeg" || file.type == "image/png") {
                this.fileList = [...this.fileList, file];
                this.type = "pic"
                return false;
            } else if (file.type == "video/mp4") {
                this.fileList = [...this.fileList, file];
                this.type = "video"
                return false;
            } else {
                this.$message.success(file.type, "image/jpeg");
            }
        },

        // 页面删除
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList;
        },

        // 上传服务器
        handleUpload() {
            const formData = new FormData();
            this.fileList.forEach(file => {
                formData.append('files[]', file);
            });

            const jsonData = this.editorApp.txt.html()
            formData.append('videoIntroduce', jsonData || '默认');

            this.uploading = true;

            if (this.type == "pic") {
                saveBigImg(formData).then(response => {
                    if (response.data == "无权限") {
                        this.$message.success("登陆过期,重新登陆!");
                        this.uploading = false;
                        this.fileList = []
                        this.resData = response.data
                    } else {
                        this.$message.success(response.statusText);
                        this.uploading = false;
                        this.fileList = []
                        this.resData = response.data
                        this.$emit("callback", "");
                        this.$store.commit('setSendShow', 1)
                    }
                })
            } else if (this.type == "video") {
                saveVideo(formData).then(response => {
                    this.$message.success(response.statusText);
                    this.uploading = false;
                    this.fileList = []
                    this.resData = response.data
                    this.$emit("callback", "");
                    this.$store.commit('setSendShow', 1)
                })
            }


        },
    },
    mounted() {
        this.initWangE()
    },
    beforeDestroy: function () {
        console.log('清除3D内存!')
    }
}
</script>

<style lang="less">
#3DContainer {

    background-color: #00B7FF;
    width: calc(50vw);

    .designePicture {
        width: 50%;
        height: 50%;
    }

    label {
        position: relative;
    }

    #fileinp {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }

    #fileinp0 {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }

    #btn {
        margin-right: 5px;
    }

    #text {
        color: red;
    }

}

#videoUploadContainer {
    border: 1px solid gray;
    width: 31%;
    height: 90%;

    #div1 {
        width: 100%;
        height: 10%;
    }

    .btnss {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        position: relative;

        .b1 {
        }

        .b2 {
            position: absolute;
            left: 60px;
            top: 0px;
        }
    }
}

</style>
