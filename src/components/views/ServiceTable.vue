<template>
    <div class="goods-table">
        <span class="back" @click="goBack"><i class="el-icon-back">返回</i></span>
        <h3 class="form-title">修改服务信息</h3>
        <el-form ref="form" :model="serviceInfo" label-width="130px" class="goods-form">
            <el-form-item label="服务名称">
                <el-input v-model="serviceInfo.NAME"></el-input><i class="info-style">{{nameInfo}}</i>
            </el-form-item>
            <el-form-item label="平均消费价">
                <el-input v-model="serviceInfo.PRESENT_PRICE" onkeyup="if(isNaN(value))execCommand('undo')"></el-input><i class="info-style">{{priceInfo}}</i>
            </el-form-item>
            <el-form-item label="服务描述">
                <el-input type="textarea" v-model="serviceInfo.DETAIL"></el-input><i class="info-style">{{descInfo}}</i>
            </el-form-item>
            <el-form-item label="服务主图">
                <img :src="serviceInfo.IMAGE1" width="80" height="80" @click="changeImg(1)" v-if="!uploadOne" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl1" class="upload-img" :imgUrl="serviceInfo.IMAGE1" v-else></upload-img><i class="info-style">{{imageInfo}}</i>
            </el-form-item>
            <el-form-item label="详情图1">
                <img :src="serviceInfo.IMAGE2" width="80" height="80" @click="changeImg(2)" v-if="!uploadTwo" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl2" class="upload-img" :imgUrl="serviceInfo.IMAGE2" v-else></upload-img>
            </el-form-item>
            <el-form-item label="详情图2">
                <img :src="serviceInfo.IMAGE3" width="80" height="80" @click="changeImg(3)" v-if="!uploadThree" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl3" class="upload-img" :imgUrl="serviceInfo.IMAGE3" v-else></upload-img>
            </el-form-item>
            <el-form-item label="详情图3">
                <img :src="serviceInfo.IMAGE4" width="80" height="80" @click="changeImg(4)" v-if="!uploadFour" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl4" class="upload-img" :imgUrl="serviceInfo.IMAGE4" v-else></upload-img>
            </el-form-item>
            <el-form-item label="详情图4">
                <img :src="serviceInfo.IMAGE5" width="80" height="80" @click="changeImg(5)" v-if="!uploadFive" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl5" class="upload-img" :imgUrl="serviceInfo.IMAGE5" v-else></upload-img>
            </el-form-item>
            <el-form-item label="服务大类">
                <el-radio-group class="radio-btn-style" v-model="serviceInfo.CAT_ID" v-for="(item,index) in categoryList" :key="index" @change="axiosGetCategorySubList(item.TYPE,item._id,item.MALL_CATEGORY_NAME)">
                    <el-radio-button :label="item._id">{{item.MALL_CATEGORY_NAME}}</el-radio-button>
                </el-radio-group><i class="info-style">{{catIdInfo}}</i>
            </el-form-item>
            <el-form-item label="服务小类">
                <el-radio-group class="radio-style" v-model="serviceInfo.SUB_ID" v-for="(item,index) in categorySubList" :key="index">
                    <el-radio :label="item._id" @change="setSubName(item.MALL_SUB_NAME)" style="margin-right:20px">{{item.MALL_SUB_NAME}}</el-radio>
                </el-radio-group><i class="info-style">{{subIdInfo}}</i>
            </el-form-item>
            <el-form-item label="是否为推荐服务">
                <el-switch v-model="ifRecomment" class="radio-style"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateService">立即修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import UploadImg from '@/components/common/UploadImg'
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    export default {
        props:{
            service:Object,
            categorySubArr:Array
        },
        data() {
            return {
                serviceInfo:{},
                categoryList:[],
                categorySubList:this.categorySubArr,
                catID:'',
                categoryID:'',
                nameInfo:'',
                priceInfo:'',
                amountInfo:'',
                subIdInfo:'',
                catIdInfo:'',
                imageInfo:'',
                descInfo:'',
                ifRecomment:this.service.IS_RECOMMEND ? true:false,
                catName:'',
                subNamw:'',
                uploadOne: false,
                uploadTwo: false,
                uploadThree: false,
                uploadFour: false,
                uploadFive: false,
                errorimg:'this.src="http://zyn2019.oss-cn-shenzhen.aliyuncs.com/mpet/nopicture.jpg"',
            }
        },
        watch:{
            service(val){
                this.serviceInfo = val
                this.getCategorySubList(val.CAT_ID)
            }
        },
        components:{
            UploadImg
        },
        created(){
            this.axiosGetCategoryList()
        },
        methods: {
            changeImg(num){
                if(num == 1){
                    this.uploadOne = true
                }
                if(num == 2){
                    this.uploadTwo = true
                }
                if(num == 3){
                    this.uploadThree = true
                }
                if(num == 4){
                    this.uploadFour = true
                }
                if(num == 5){
                    this.uploadFive = true
                }
            },
            goBack(){
                this.uploadOne = false
                this.uploadTwo = false
                this.uploadThree = false
                this.uploadFour = false
                this.uploadFive = false
                this.$emit('showListClick')
            },
            imageUrl1(imgUrl){
                this.serviceInfo.IMAGE1 = imgUrl
            },
            imageUrl2(imgUrl){
                this.serviceInfo.IMAGE2 = imgUrl
            },
            imageUrl3(imgUrl){
                this.serviceInfo.IMAGE3 = imgUrl
            },
            imageUrl4(imgUrl){
                this.serviceInfo.IMAGE4 = imgUrl
            },
            imageUrl5(imgUrl){
                this.serviceInfo.IMAGE5 = imgUrl
            },
            axiosGetCategoryList() {
                axios({
                    url:url.getServiceCategoryList,
                    method:'get'
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.categoryList = response.data.message
                    }else{
                        console.log('数据拉取失败')
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
            },
            getCategorySubList(id){
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
                    }else{
                        console.log('数据拉取失败')
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
            },
            axiosGetCategorySubList(type,id,name){
                this.serviceInfo.CATEGORY_NAME = name
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
                    }else{
                        console.log('数据拉取失败')
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
            },
            setSubName(name){
                let arr = this.serviceInfo.CATEGORY_NAME.split(' ')
                this.serviceInfo.CATEGORY_NAME = arr[0]+' '+name
            },
            onSubmit(){
                this.checkserviceInfo() && this.axiosAddGoods()
            },
            checkserviceInfo() {
                let isOk = true
                if(!this.serviceInfo.NAME){
                    isOk = false
                    this.nameInfo = '服务名不能为空'
                }else{
                    isOk = true
                    this.nameInfo = ''
                }
                if(!this.serviceInfo.PRESENT_PRICE){
                    isOk = false
                    this.priceInfo = '服务销售价不能为空'
                }else{
                    isOk = true
                    this.priceInfo = ''
                }
                if(!this.serviceInfo.AMOUNT){
                    isOk = false
                    this.amountInfo = '服务库存不能为空'
                }else{
                    isOk = true
                    this.amountInfo = ''
                }
                if(!this.serviceInfo.DETAIL){
                    isOk = false
                    this.descInfo = '服务描述不能为空'
                }else{
                    isOk = true
                    this.descInfo = ''
                }
                if(!this.serviceInfo.IMAGE1){
                    isOk = false
                    this.imageInfo = '服务主图不能为空'
                }else{
                    isOk = true
                    this.imageInfo = ''
                }
                if(!this.serviceInfo.CAT_ID){
                    isOk = false
                    this.catIdInfo = '服务大类不能为空'
                }else{
                    isOk = true
                    this.catIdInfo = ''
                }
                if(!this.serviceInfo.SUB_ID){
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
                    url:url.addGoods,
                    method:'post',
                    data:{
                        NAME:this.serviceInfo.NAME,
                        ORI_PRICE:this.serviceInfo.ORI_PRICE,
                        PRESENT_PRICE:this.serviceInfo.PRESENT_PRICE,
                        AMOUNT:this.serviceInfo.AMOUNT,
                        DETAIL:this.serviceInfo.DETAIL,
                        IMAGE1:this.serviceInfo.IMAGE1,
                        IMAGE2:this.serviceInfo.IMAGE2,
                        IMAGE3:this.serviceInfo.IMAGE3,
                        IMAGE4:this.serviceInfo.IMAGE4,
                        IMAGE5:this.serviceInfo.IMAGE5,
                        CAT_ID:this.serviceInfo.CAT_ID,
                        SUB_ID:this.serviceInfo.SUB_ID,
                        GOOD_TYPE:this.serviceInfo.GOOD_TYPE,
                        IS_RECOMMEND:this.ifRecomment ? 1:0,
                        CATEGORY_NAME:this.catName + ' ' + this.subNamw
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.serviceInfo = {}
                        this.catID = ''
                        this.categoryID = ''
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
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
            },
            updateService(){
                this.checkserviceInfo() && this.axiosUpdateService()
            },
            axiosUpdateService(){
                axios({
                    url:url.updateService,
                    method:'post',
                    data:{
                        _id:this.serviceInfo._id,
                        NAME:this.serviceInfo.NAME,
                        ORI_PRICE:this.serviceInfo.ORI_PRICE,
                        PRESENT_PRICE:this.serviceInfo.PRESENT_PRICE,
                        AMOUNT:this.serviceInfo.AMOUNT,
                        DETAIL:this.serviceInfo.DETAIL,
                        IMAGE1:this.serviceInfo.IMAGE1,
                        IMAGE2:this.serviceInfo.IMAGE2,
                        IMAGE3:this.serviceInfo.IMAGE3,
                        IMAGE4:this.serviceInfo.IMAGE4,
                        IMAGE5:this.serviceInfo.IMAGE5,
                        CAT_ID:this.serviceInfo.CAT_ID,
                        SUB_ID:this.serviceInfo.SUB_ID,
                        GOOD_TYPE:this.serviceInfo.GOOD_TYPE,
                        IS_RECOMMEND:this.ifRecomment ? 1:0,
                        CATEGORY_NAME:this.serviceInfo.CATEGORY_NAME
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.goBack()
                    }else{
                        this.$message({
                            type: 'info',
                            message: '修改失败!'
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
        cursor: pointer;
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