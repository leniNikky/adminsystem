<template>
    <div class="goods-table">
        <span class="back" @click="goBack"><i class="el-icon-back">返回</i></span>
        <h3 class="form-title">添加服务</h3>
        <el-form ref="form" :model="goodsInfo" label-width="130px" class="goods-form">
            <el-form-item label="服务名称">
                <el-input v-model="goodsInfo.NAME"></el-input><i class="info-style">{{nameInfo}}</i>
            </el-form-item>
            <el-form-item label="平均消费额">
                <el-input v-model="goodsInfo.PRESENT_PRICE" onkeyup="if(isNaN(value))execCommand('undo')"></el-input><i class="info-style">{{priceInfo}}</i>
            </el-form-item>
            <el-form-item label="服务描述">
                <el-input type="textarea" v-model="goodsInfo.DETAIL"></el-input><i class="info-style">{{descInfo}}</i>
            </el-form-item>
            <el-form-item label="服务主图">
                <upload-img @imageUrl="imageUrl1" class="upload-img" ref="upload1"></upload-img><i class="info-style">{{imageInfo}}</i>
            </el-form-item>
            <el-form-item label="详情图1">
                <upload-img @imageUrl="imageUrl2" class="upload-img" ref="upload2"></upload-img>
            </el-form-item>
            <el-form-item label="详情图2">
                <upload-img @imageUrl="imageUrl3" class="upload-img" ref="upload3"></upload-img>
            </el-form-item>
            <el-form-item label="详情图3">
                <upload-img @imageUrl="imageUrl4" class="upload-img" ref="upload4"></upload-img>
            </el-form-item>
            <el-form-item label="详情图4">
                <upload-img @imageUrl="imageUrl5" class="upload-img" ref="upload5"></upload-img>
            </el-form-item>
            <el-form-item label="服务大类">
                <el-radio-group class="radio-btn-style" v-model="goodsInfo.CAT_ID" v-for="(item,index) in categoryList" :key="index" @change="axiosGetCategorySubList(item._id,item.MALL_CATEGORY_NAME,item.TYPE)">
                    <el-radio-button :label="item._id">{{item.MALL_CATEGORY_NAME}}</el-radio-button>
                </el-radio-group><i class="info-style">{{catIdInfo}}</i>
            </el-form-item>
            <el-form-item label="服务小类">
                <el-radio-group class="radio-style" v-model="goodsInfo.SUB_ID" v-for="(item,index) in categorySubList" :key="index">
                    <el-radio :label="item._id" @change="setSubName(item.MALL_SUB_NAME)" style="margin-right:20px">{{item.MALL_SUB_NAME}}</el-radio>
                </el-radio-group><i class="info-style">{{subIdInfo}}</i>
            </el-form-item>
            <el-form-item label="是否选为推荐服务">
                <el-switch v-model="ifRecomment" class="radio-style"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import UploadImg from '@/components/common/UploadImg'
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
import { setTimeout } from 'timers';
    export default {
        data() {
            return {
                goodsInfo: {
                    NAME:'',
                    PRESENT_PRICE:'',
                    DETAIL:'',
                    IMAGE1:'',
                    IMAGE2:'',
                    IMAGE3:'',
                    IMAGE4:'',
                    IMAGE5:'',
                    SUB_ID:'',
                    CAT_ID:'',
                    GOOD_TYPE:'',
                    IS_RECOMMEND:0,
                    CATEGORY_NAME:''
                },
                CAT_ID:'',
                SUB_ID:'',
                categoryList:[],
                categorySubList:[],
                catID:'',
                categoryID:'',
                nameInfo:'',
                priceInfo:'',
                subIdInfo:'',
                catIdInfo:'',
                imageInfo:'',
                descInfo:'',
                ifRecomment:true,
                catName:'',
                subNamw:''
            }
        },
        components:{
            UploadImg
        },
        created(){
            this.axiosGetCategoryList()
        },
        methods: {
            goBack(){
                this.$emit('showListClick')
            },
            imageUrl1(imgUrl){
                this.goodsInfo.IMAGE1 = imgUrl
            },
            imageUrl2(imgUrl){
                this.goodsInfo.IMAGE2 = imgUrl
            },
            imageUrl3(imgUrl){
                this.goodsInfo.IMAGE3 = imgUrl
            },
            imageUrl4(imgUrl){
                this.goodsInfo.IMAGE4 = imgUrl
            },
            imageUrl5(imgUrl){
                this.goodsInfo.IMAGE5 = imgUrl
            },
            axiosGetCategoryList() {
                axios({
                    url:url.getServiceCategoryList,
                    method:'get'
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.categoryList = response.data.message
                        this.goodsInfo.CAT_ID = this.categoryList[0]._id
                        this.CAT_ID = this.categoryList[0]._id
                        this.axiosGetCategorySubList(this.categoryList[0]._id,this.categoryList[0].MALL_CATEGORY_NAME,this.categoryList[0].TYPE)
                    }else{
                        console.log('数据拉取失败')
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
            },
            axiosGetCategorySubList(id,name,type){
                this.catName = name
                this.goodsInfo.GOOD_TYPE = type
                this.goodsInfo.CAT_ID = id
                axios({
                    url:url.getCategorySubList,
                    method:'post',
                    data:{
                        categoryId:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.categorySubList = response.data.message
                        this.goodsInfo.SUB_ID = this.categorySubList[0]._id
                        this.SUB_ID = this.categorySubList[0]._id
                        this.subNamw = this.categorySubList[0].MALL_SUB_NAME
                        console.log(this.categorySubList)
                    }else{
                        console.log('数据拉取失败')
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
            },
            setSubName(name){
                this.subNamw = name
            },
            onSubmit(){
                this.checkGoodsInfo() && this.axiosAddGoods()
            },
            checkGoodsInfo() {
                let isOk = true
                if(!this.goodsInfo.NAME){
                    isOk = false
                    this.nameInfo = '服务名不能为空'
                }else{
                    isOk = true
                    this.nameInfo = ''
                }
                if(!this.goodsInfo.PRESENT_PRICE){
                    isOk = false
                    this.priceInfo = '服务销售价不能为空'
                }else{
                    isOk = true
                    this.priceInfo = ''
                }
                if(!this.goodsInfo.DETAIL){
                    isOk = false
                    this.descInfo = '服务描述不能为空'
                }else{
                    isOk = true
                    this.descInfo = ''
                }
                if(!this.goodsInfo.IMAGE1){
                    isOk = false
                    this.imageInfo = '服务主图不能为空'
                }else{
                    isOk = true
                    this.imageInfo = ''
                }
                if(!this.goodsInfo.CAT_ID){
                    isOk = false
                    this.catIdInfo = '服务大类不能为空'
                }else{
                    isOk = true
                    this.catIdInfo = ''
                }
                if(!this.goodsInfo.SUB_ID){
                    isOk = false
                    this.subIdInfo = '服务小类不能为空'
                }else{
                    isOk = true
                    this.subIdInfo = ''
                }
                return isOk
            },
            axiosAddGoods(){
                axios({
                    url:url.addService,
                    method:'post',
                    data:{
                        NAME:this.goodsInfo.NAME,
                        ORI_PRICE:this.goodsInfo.ORI_PRICE,
                        PRESENT_PRICE:this.goodsInfo.PRESENT_PRICE,
                        AMOUNT:this.goodsInfo.AMOUNT,
                        DETAIL:this.goodsInfo.DETAIL,
                        IMAGE1:this.goodsInfo.IMAGE1,
                        IMAGE2:this.goodsInfo.IMAGE2,
                        IMAGE3:this.goodsInfo.IMAGE3,
                        IMAGE4:this.goodsInfo.IMAGE4,
                        IMAGE5:this.goodsInfo.IMAGE5,
                        CAT_ID:this.goodsInfo.CAT_ID,
                        SUB_ID:this.goodsInfo.SUB_ID,
                        GOOD_TYPE:this.goodsInfo.GOOD_TYPE,
                        IS_RECOMMEND:this.ifRecomment ? 1:0,
                        CATEGORY_NAME:this.catName + ' ' + this.subNamw
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.goodsInfo = {}
                        this.goodsInfo.CAT_ID = this.CAT_ID
                        this.goodsInfo.SUB_ID = this.SUB_ID
                        this.goodsInfo.GOOD_TYPE = 2
                        this.ifRecomment = true
                        this.$refs.upload1.clearImg()
                        this.$refs.upload2.clearImg()
                        this.$refs.upload3.clearImg()
                        this.$refs.upload4.clearImg()
                        this.$refs.upload5.clearImg()
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.goBack()
                    }else{
                        this.$message({
                            type: 'info',
                            message: '添加失败!'
                        });
                    }
                })
                .catch(error=>{
                    this.$message({
                        type: 'info',
                        message: error
                    });
                })
            }
        }
    }
</script>

<style lang='less' scoped>
    .goods-table{
        padding: 10px;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .goods-table::-webkit-scrollbar{
        display: none;
    }
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
    .goods-form{
        clear: both;
        width: 70%;

    }
    .upload-img{
        background-color: #f0f0f0;
        float: left;
    }
    .radio-btn-style{
        float: left;
    }
    .radio-style{
        float: left;
        margin-top: 13px;
    }
    .info-style{
        float:left;
        color:red;
        font-size:12px;
        margin-bottom:-20px;
    }
</style>