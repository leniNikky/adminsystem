<template>
    <div class="user-table">
        <span class="back" @click="goBack"><i class="el-icon-back">返回</i></span>
        <h3 class="title">用户信息</h3>
        <el-row class="row">
            <el-col :span="7"><div class="grid-content">ID：{{userInfo._id}}</div></el-col>
            <el-col :span="7"><div class="grid-content">用户名：{{userInfo.userName}}</div></el-col>
            <el-col :span="7"><div class="grid-content">手机号：{{userInfo.phone}}</div></el-col>
        </el-row>
        <el-row class="row">
            <el-col :span="7"><div class="grid-content">注册时间: {{userInfo.createdDate | dateTimeFormat}}</div></el-col>
            <el-col :span="7"><div class="grid-content">上次登录时间：{{userInfo.lastLoginAt | dateTimeFormat}}</div></el-col>
        </el-row>
        <!-- <h3 class="title">宠物信息</h3>
        <el-table
        :data="petInfo"
        style="width: 80%"
        class="address">
            <el-table-column
                prop="_id"
                label="宠物ID"
                width="220">
            </el-table-column>
            <el-table-column
                prop="pet_name"
                label="宠物昵称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="pet_class"
                label="物种">
            </el-table-column>
            <el-table-column
                prop="pet_classSub"
                label="品种">
            </el-table-column>
        </el-table> -->
        <h3 class="title">收货地址</h3>
        <el-table
        :data="addressList"
        style="width: 80%"
        class="address">
            <el-table-column
                prop="name"
                label="收货人姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="tel"
                label="手机号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="areaCode"
                label="邮编">
            </el-table-column>
            <el-table-column
                prop="address"
                label="收货地址">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {dateTimeFormat,dateFormat} from '@/filters/dateFilter.js'
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    export default {
        props:{
            userInfo:Object,
        },
        data() {
            return {
                addressList:[],
                petInfo:[],
                showPet:false
            }
        },
        filters:{
            dateFormat(date){
                return dateFormat(date)
            },
            dateTimeFormat(date){
                return dateTimeFormat(date)
            }
        },
        watch:{
            userInfo(val){
                this.axiosFindAddress(val._id)
                this.axiosFindPet(val._id)
            }
        },
        methods: {
            goBack(){
                this.$emit('showListClick')
            },
            axiosFindAddress(id){
                axios({
                    url:url.getUserAddress,
                    method:'post',
                    data:{
                        userId:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.addressList = response.data.message
                    }else{
                        this.addressList = {}
                        this.$message({
                            type:'info',
                            message:'地址数据拉取失败'
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
            // axiosFindPet(id){
            //     axios({
            //         url:url.findPetInfo,
            //         method:'post',
            //         data:{
            //             ownerId:id
            //         }
            //     })
            //     .then(response=>{
            //         if(response.data.code == 200 && response.data.message){
            //             this.petInfo.push(response.data.message)
            //         }else{
            //             this.petInfo = {}
            //             this.$message({
            //                 type:'info',
            //                 message:'暂无宠物信息'
            //             })
            //         }
            //     })
            //     .catch(error=>{
            //         this.$message({
            //             type:'info',
            //             message:error
            //         })
            //     })
            // },
        },
    }
</script>

<style scoped>
    .user-table{
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .user-table::-webkit-scrollbar{
        display: none;
    }
   .back{
        float: right;
        text-decoration:underline;
        color: #3a8ee6;
        font-size: .8em; 
        cursor: pointer;
    }
    .title{
        float: left;
        margin-left: 10px;
    }
    .row{
        clear: both;
    }
    .grid-content{
        margin: 10px;
        float: left;
    }
    .address{
        clear: both;
    }
</style>