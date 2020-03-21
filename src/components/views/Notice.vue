<template>
    <div class="notice">
        <div class="list-header">
            <el-input
                type='textarea'
                :rows="4"
                v-model="content"
                style="width:500px;float:left;margin-right:10px;"
                placeholder="请输入公告内容">
            </el-input>
            <el-button type="primary" @click="addNotice">添加</el-button>
        </div>
        <el-table
            :data="noticeList"
            border
            style="width: 100%">
            <el-table-column
            label="发布时间"
            width="180">
            <template slot-scope="scope">
                {{scope.row.time | dateTimeFormat}}
            </template>
            </el-table-column>
            <el-table-column
            prop="content"
            label="内容">
            </el-table-column>
            <el-table-column
            prop="address"
            label="操作"
            width='180'>
            <template slot-scope="scope">
                <el-button @click="deleteNotice(scope.row._id)" type="text" size="small">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import url from '@/serviceAPI.config.js'
    import axios from 'axios'
    import { dateTimeFormat }  from '@/filters/dateFilter.js'
    export default {
        data() {
            return {
                noticeList: [],
                content:''
            }
        },
        created(){
            this.axiosGetNoticeList()
        },
        filters:{
            dateTimeFormat(date){
                return dateTimeFormat(date)
            }
        },
        methods: {
            deleteNotice(id){
                axios({
                    url:url.deleteNotice,
                    method:'post',
                    data:{
                        id:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.axiosGetNoticeList()
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                    }else{
                        this.noticeList = []
                        this.$message({
                            type:'info',
                            message:'删除失败'
                        })
                    }
                })
            },
            addNotice(){
                if(this.addNotice == ''){
                    this.$message({
                        type:'info',
                        message:'请输入公告内容'
                    })
                }else{
                    this.axiosAddNotice()
                }
            },
            axiosAddNotice(){
                axios({
                    url:url.addNotice,
                    method:'post',
                    data:{
                        content:this.content
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.axiosGetNoticeList()
                        this.content = ''
                        this.$message({
                            type:'success',
                            message:'添加成功'
                        })
                    }else{
                        this.noticeList = []
                        this.$message({
                            type:'info',
                            message:'添加失败'
                        })
                    }
                })
                .catch(error=>{
                    this.$message({
                        type:'info',
                        message:error
                    })
                })
            },
            axiosGetNoticeList() {
                axios({
                    url:url.getAllNotice,
                    method:'get'
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.noticeList = response.data.message
                    }else{
                        this.noticeList = []
                        this.$message({
                            type:'info',
                            message:'暂无数据'
                        })
                    }
                })
                .catch(error=>{
                    this.$message({
                        type:'info',
                        message:error
                    })
                })
            }
        },
    }
</script>

<style lang='less' scoped>
    .notice{
        padding: 10px;
        height: 100%;
        overflow-y: scroll;
        overflow-x: none;
        .list-header{
            float: left;
            margin-bottom: 20px;
        }
    }
    .notice::-webkit-scrollbar{
        display: none;
    }
</style>