<template>
    <div class="category-table">
        <span class="back" @click="goBack"><i class="el-icon-back">返回</i></span>
        <h3 class="form-title">类别信息</h3>
        <el-form :label-position="labelPosition" label-width="100px" :model="category" class="category-form">
            <el-form-item label="自定义序号" onkeyup="this.value=this.value.replace(/[^\d]/g,'') ">
                <el-input v-model="category.ID" disabled></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-radio-group v-model="category.TYPE" style="float:left;margin-top:13px;">
                    <el-radio :label="1">商品</el-radio>
                    <el-radio :label="2">服务</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="类别名称">
                <el-input v-model="category.MALL_CATEGORY_NAME"></el-input>
            </el-form-item>
            <el-form-item label="图片">
                <img :src="category.IMG" width="80" height="80" @click="changeImg" v-if="!upload" :onerror="errorimg" style="float:left;">
                <upload-img @imageUrl="imageUrl" class="upload-img" :imgUrl="category.IMG" v-else></upload-img>
            </el-form-item>
             <el-button type="primary" @click="updateCategory">立即修改</el-button>
        </el-form>
        <h3 class="form-title">小类管理</h3>
        <div class="category-sub">
            <div class="category-sub-item" v-for="(item,index) in categorySubList" :key="index">
                {{item.MALL_SUB_NAME}}
                <i class="el-icon-circle-close-outline" @click="deleteSub(item._id)"/>
            </div>
        </div>
        <div class="add-area">
            <el-form :model="categorySubInfo">
                <el-input placeholder="输入新的副类" v-model="categorySubInfo.categorySubName"/>
                <el-input placeholder="输入类别序号" v-model="categorySubInfo.categorySubSort" onkeyup="this.value=this.value.replace(/[^\d]/g,'') "/>
                <el-button type="primary" @click="addCategorySub">添加</el-button>
            </el-form>
        </div>
        
    </div>
</template>

<script>
    import UploadImg from '@/components/common/UploadImg'
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    export default {
        props:{
            categoryInfo: Object,
            categorySub:Array
        },
        data() {
            return {
                category:this.categoryInfo,
                categorySubList:this.categorySub,
                labelPosition: 'left',
                categorySubInfo:{
                    categorySubName:'',
                    categorySubSort:'',
                },
                errorimg:'this.src="http://zyn2019.oss-cn-shenzhen.aliyuncs.com/mpet/nopicture.png"',
                upload:false
            }
        },
        watch:{
            categoryInfo(val){
                this.category = val
            },
            categorySub(val){
                this.categorySubList = val
            }
        },
        components:{
            UploadImg
        },
        methods: {
            imageUrl(imgUrl){
                this.category.IMG = imgUrl
            },
            changeImg(){
                this.upload = true
            },
            deleteSub(id){
                this.$confirm('此副类将被永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.axiosDeleteSub(id)
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            updateCategory(){
                if(this.category.MALL_CATEGORY_NAME){
                    this.$confirm('确认修改此分类信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                        this.axiosUpdateCategoryInfo()
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        });          
                    });
                }else{
                    this.$alert('', '信息不能为空', {
                        confirmButtonText: '确定',
                        center: true,
                    });
                }
            },
            axiosUpdateCategoryInfo(){
                axios({
                    url:url.updateOneCategory,
                    method:'post',
                    data:{
                        categoryId:this.category._id,
                        name:this.category.MALL_CATEGORY_NAME,
                        type:this.category.TYPE,
                        IMG:this.category.IMG
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.axiosFindCategory()
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    }else{
                        this.$message({
                            type:'info',
                            message:'修改失败!'
                        })
                    }
                })
                .catch(error=>{
                    console.log(error)
                    this.$message({
                            type:'info',
                            message:error
                        })
                })
            },
            axiosDeleteSub(id) {
                axios({
                    url:url.deteleCategorySub,
                    method:'post',
                    data:{
                        id:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.axiosDeleteGoodsOfCategorySUb(id)
                    }else{
                        this.$alert('删除失败', '标题名称', {
                            confirmButtonText: '确定',
                             center: true,
                        });
                    }
                })
                .catch(error=>{
                    
                })
            },
            axiosDeleteGoodsOfCategorySUb(id){
                axios({
                    url:url.deleteGoodsOFCategorySub,
                    method:'post',
                    data:{
                        id:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.axiosGetCategorySubList()
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                    }else{
                        this.$message({
                            type:'info',
                            message:'删除失败'
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
            addCategorySub(){
                if(!this.categorySubInfo.categorySubName || !this.categorySubInfo.categorySubSort){
                    this.$alert('', '副类信息不能为空', {
                        confirmButtonText: '确定',
                        center: true,
                    });
                }else{
                    this.axiosAddCategorySub()
                }
            },
            axiosAddCategorySub(){
                axios({
                    url:url.addOneCategorySub,
                    method:'post',
                    data:{
                        MALL_CATEGORY_ID:this.category._id,
                        MALL_SUB_NAME:this.categorySubInfo.categorySubName,
                        SORT:this.categorySubInfo.categorySubSort
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.axiosGetCategorySubList()
                        this.categorySubInfo = []
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
                        message: '添加失败!'
                    });
                })
            },
            axiosGetCategorySubList(){
                axios({
                    url:url.getCategorySubList,
                    method:'post',
                    data:{
                        categoryId:this.category._id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.showList = false
                        this.categorySubList = response.data.message
                    }else{
                        this.$alert('', '数据刷新失败', {
                            confirmButtonText: '确定',
                            center: true,
                        });
                    }
                })
                .catch(error=>{
                    console.log(error)
                    this.$alert('', '数据刷新失败', {
                        confirmButtonText: '确定',
                        center: true,
                    });
                })
            },
            axiosFindCategory(){
                axios({
                    url:url.findOneCategory,
                    method:'post',
                    data:{
                        id:this.category._id
                    }
                })
                .then(res=>{
                    if(res.data.code == 200 && res.data.message){
                        this.category = res.data.message
                        this.upload = false
                    }
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
        cursor: pointer;
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
    .category-sub{
        clear: both;
        margin-bottom: 10px;
        .category-sub-item{
            float: left;
            padding: 5px 20px;
            height: 30px;
            line-height: 30px;
            border:1px solid #ccc;
            margin-right:10px;
            i{
                cursor: pointer;
            }
        }
    }
    .add-area{
        clear: both;
        float: left;
        .el-input{
            margin-top: 20px;
            width: 150px;
        }
    }
</style>