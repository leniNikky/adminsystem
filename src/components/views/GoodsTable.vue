<template>
    <div class="goods-table">
        <span class="back" @click="goBack"><i class="el-icon-back">返回</i></span>
        <h3 class="form-title">修改商品信息</h3>
        <el-form ref="form" :model="goodsInfo" label-width="130px" class="goods-form">
            <el-form-item label="商品名称">
                <el-input v-model="goodsInfo.NAME"></el-input><i class="info-style">{{nameInfo}}</i>
            </el-form-item>
            <el-form-item label="商品原价">
                <el-input v-model="goodsInfo.ORI_PRICE" onkeyup="if(isNaN(value))execCommand('undo')"></el-input>
            </el-form-item>
            <el-form-item label="商品销售价">
                <el-input v-model="goodsInfo.PRESENT_PRICE" onkeyup="if(isNaN(value))execCommand('undo')"></el-input><i class="info-style">{{priceInfo}}</i>
            </el-form-item>
            <el-form-item label="商品库存">
                <el-input v-model="goodsInfo.AMOUNT" onkeyup="this.value=this.value.replace(/[^\d]/g,'') "></el-input><i class="info-style">{{amountInfo}}</i>
            </el-form-item>
            <el-form-item label="商品描述">
                <el-input type="textarea" v-model="goodsInfo.DETAIL"></el-input><i class="info-style">{{descInfo}}</i>
            </el-form-item>
            <el-form-item label="商品主图">
                <img :src="goodsInfo.IMAGE1" width="80" height="80" @click="changeImg(1)" v-if="!uploadOne" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl1" class="upload-img" :imgUrl="goodsInfo.IMAGE1" v-else></upload-img><i class="info-style">{{imageInfo}}</i>
            </el-form-item>
            <el-form-item label="详情图1">
                <img :src="goodsInfo.IMAGE2" width="80" height="80" @click="changeImg(2)" v-if="!uploadTwo" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl2" class="upload-img" :imgUrl="goodsInfo.IMAGE2" v-else></upload-img>
            </el-form-item>
            <el-form-item label="详情图2">
                <img :src="goodsInfo.IMAGE3" width="80" height="80" @click="changeImg(3)" v-if="!uploadThree" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl3" class="upload-img" :imgUrl="goodsInfo.IMAGE3" v-else></upload-img>
            </el-form-item>
            <el-form-item label="详情图3">
                <img :src="goodsInfo.IMAGE4" width="80" height="80" @click="changeImg(4)" v-if="!uploadFour" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl4" class="upload-img" :imgUrl="goodsInfo.IMAGE4" v-else></upload-img>
            </el-form-item>
            <el-form-item label="详情图4">
                <img :src="goodsInfo.IMAGE5" width="80" height="80" @click="changeImg(5)" v-if="!uploadFive" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl5" class="upload-img" :imgUrl="goodsInfo.IMAGE5" v-else></upload-img>
            </el-form-item>
            <el-form-item label="商品大类">
                <el-radio-group class="radio-btn-style" v-model="goodsInfo.CAT_ID" v-for="(item,index) in categoryList" :key="index" @change="axiosGetCategorySubList(item.TYPE,item._id,item.MALL_CATEGORY_NAME)">
                    <el-radio-button :label="item._id">{{item.MALL_CATEGORY_NAME}}</el-radio-button>
                </el-radio-group><i class="info-style">{{catIdInfo}}</i>
            </el-form-item>
            <el-form-item label="商品小类">
                <el-radio-group class="radio-style" v-model="goodsInfo.SUB_ID" v-for="(item,index) in categorySubList" :key="index">
                     <el-radio :label="item._id" @change="setSubName(item.MALL_SUB_NAME)" style="margin-right:20px">{{item.MALL_SUB_NAME}}</el-radio>
                </el-radio-group><i class="info-style">{{subIdInfo}}</i>
            </el-form-item>
            <el-form-item label="是否为推荐商品">
                <el-switch v-model="ifRecomment" class="radio-style"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateGoods">立即修改</el-button>
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
            goods:Object,
            categorySubArr:Array
        },
        data() {
            return {
                goodsInfo:{},
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
                ifRecomment:this.goods.IS_RECOMMEND ? true:false,
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
            imgUrl(val){
                this.files[0].src = val
            }
        },
        components:{
            UploadImg
        },
        created(){
            this.axiosGetCategoryList()
        },
        watch:{
            goods(val){
                this.goodsInfo = val
                this.getCategorySubList(val.CAT_ID)
            }
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
            showUpload(num){
                this.uploadNum = num
            },
            axiosGetCategoryList() {
                axios({
                    url:url.getGoodsCategoryList,
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
                this.goodsInfo.CATEGORY_NAME = name
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
                let arr = this.goodsInfo.CATEGORY_NAME.split(' ')
                this.goodsInfo.CATEGORY_NAME=arr[0]+' '+name
            },
            onSubmit(){
                this.checkGoodsInfo() && this.axiosAddGoods()
            },
            checkGoodsInfo() {
                let isOk = true
                if(!this.goodsInfo.NAME){
                    isOk = false
                    this.nameInfo = '商品名不能为空'
                }else{
                    isOk = true
                    this.nameInfo = ''
                }
                if(!this.goodsInfo.PRESENT_PRICE){
                    isOk = false
                    this.priceInfo = '商品销售价不能为空'
                }else{
                    isOk = true
                    this.priceInfo = ''
                }
                if(!this.goodsInfo.AMOUNT){
                    isOk = false
                    this.amountInfo = '商品库存不能为空'
                }else{
                    isOk = true
                    this.amountInfo = ''
                }
                if(!this.goodsInfo.DETAIL){
                    isOk = false
                    this.descInfo = '商品描述不能为空'
                }else{
                    isOk = true
                    this.descInfo = ''
                }
                if(!this.goodsInfo.IMAGE1){
                    isOk = false
                    this.imageInfo = '商品主图不能为空'
                }else{
                    isOk = true
                    this.imageInfo = ''
                }
                if(!this.goodsInfo.CAT_ID){
                    isOk = false
                    this.catIdInfo = '商品大类不能为空'
                }else{
                    isOk = true
                    this.catIdInfo = ''
                }
                if(!this.goodsInfo.SUB_ID){
                    isOk = false
                    this.subIdInfo = '商品小类不能为空'
                }else{
                    isOk = true
                    this.subIdInfo = ''
                }
                return isOk
            },
            axiosAddGoods(){
                alert(this.goodsInfo.CATEGORY_NAME)
                axios({
                    url:url.addGoods,
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
                        CATEGORY_NAME:this.goodsInfo.CATEGORY_NAME
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.goodsInfo = {}
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
            updateGoods(){
                this.checkGoodsInfo() && this.axiosUpdateGoods()
            },
            axiosUpdateGoods(){
                axios({
                    url:url.updateGoods,
                    method:'post',
                    data:{
                        _id:this.goodsInfo._id,
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
                        CATEGORY_NAME:this.goodsInfo.CATEGORY_NAME
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