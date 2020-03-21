<template>
    <div class="category-table">
        <span class="back" @click="goBack"><i class="el-icon-back">返回</i></span>
        <h3 class="form-title">类别信息</h3>
        <el-form :label-position="labelPosition" label-width="100px" :model="category" class="category-form">
            <el-form-item label="自定义序号">
                <el-input v-model="category.ID" onkeyup="this.value=this.value.replace(/[^\d]/g,'') "></el-input><i class="info-style">{{idInfo}}</i>
            </el-form-item>
            <el-form-item label="类别名称">
                <el-input v-model="category.MALL_CATEGORY_NAME"></el-input><i class="info-style">{{nameInfo}}</i>
            </el-form-item>
            <el-form-item label="类别名称">
                <el-radio v-model="category.TYPE" label="1" class="item-left">商品</el-radio>
                <el-radio v-model="category.TYPE" label="2" class="item-left">服务</el-radio><i class="info-style">{{typeInfo}}</i>
            </el-form-item>
            <el-form-item>
                <upload-img @imageUrl="imageUrl" class="upload-img" ref="upload"></upload-img><i class="info-style">{{imgInfo}}</i>
            </el-form-item>
             <el-button type="primary" @click="addCategory">立即添加</el-button>
        </el-form>
        
    </div>
</template>

<script>
    import UploadImg from '@/components/common/UploadImg'
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    export default {
        data() {
            return {
                category:{
                    ID:'',
                    MALL_CATEGORY_NAME:'',
                    TYPE:'',
                    IMG:''
                },
                idInfo:'',
                nameInfo:'',
                typeInfo:'',
                imgInfo:'',
                categorySubList:[],
                labelPosition: 'left',
                categorySubInfo:{
                    categorySubName:'',
                    categorySubSort:'',
                }
            }
        },
        components:{
            UploadImg
        },
        methods: {
            imageUrl(imgUrl){
                this.category.IMG = imgUrl
            },
            checkCategoryInfo(){
                let isOk = true
                if(!this.category.ID){
                    isOk = false
                    this.idInfo = '自定义序号不能为空'
                }else{
                    isOk = true
                    this.idInfo = ''
                }
                if(!this.category.MALL_CATEGORY_NAME){
                    isOk = false
                    this.nameInfo = '类别名不能为空'
                }else{
                    isOk = true
                    this.nameInfo = ''
                }
                if(!this.category.TYPE){
                    isOk = false
                    this.typeInfo = '类型不能为空'
                }else{
                    isOk = true
                    this.typeInfo = ''
                }
                if(this.category.IMG == ''){
                    isOk = false
                    this.imgInfo = '图片不能为空'
                }else{
                    isOk = true
                    this.imgInfo = ''
                }
                return isOk
            },
            addCategory(){
                this.checkCategoryInfo() && this.axiosAddCategory()
            },
            axiosAddCategory(){
                axios({
                    url:url.addCategory,
                    method:'post',
                    data:{
                        ID:this.category.ID,
                        MALL_CATEGORY_NAME:this.category.MALL_CATEGORY_NAME,
                        TYPE:this.category.TYPE,
                        SORT:this.category.SORT,
                        IMG:this.category.IMG
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.category = {}
                        this.$refs.upload.clearImg()
                        this.$message({
                            type:'success',
                            message:response.data.message
                        })
                    }else{
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
            goBack(){
                this.$emit('showListClick')
            }
        },
    }
</script>

<style lang='less' scoped>
    .back{
        float: right;
        text-decoration:underline;
        color: #3a8ee6;
        font-size: .8em; 
    }
    .form-title{
        float: left;
        margin-top: 0;
    }
    .category-form{
        width: 50%;
        clear: both;
        margin-bottom: 20px;
    }
    .item-left{
        float: left;
        margin-top: 13px;
    }
    .item-clear{
        clear: both;
    }
    .info-style{
        float:left;
        color:red;
        font-size:12px;
        margin-bottom:-20px;
    }
</style>