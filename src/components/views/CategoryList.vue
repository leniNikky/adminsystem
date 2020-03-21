<template>
    <div class="category-list">
        <i class="el-icon-circle-plus-outline add-btn" @click="addCategory" v-show="!showTable && !showAdd"></i>
        <el-table
            :data="categoryList"
            border
            style="width: 100%;"
            v-show="!showTable && !showAdd"
            >
            <el-table-column
            prop="_id"
            label="ID"
            width="230">
            </el-table-column>
            <el-table-column
            prop="ID"
            label="自定义序号"
            width="110">
            </el-table-column>
            <el-table-column
            prop="MALL_CATEGORY_NAME"
            label="类别名称"
            width="150">
            </el-table-column>
            <el-table-column
            label="类别图"
            width="150">
                <template slot-scope="scope"><img :src="scope.row.IMG" width="50" height="50"></template>
            </el-table-column>
            <el-table-column
            label="类型"
            width="150">
            <template slot-scope="scope">
                {{scope.row.TYPE == 1 ? '商品' : '服务'}}
            </template>
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            >
            <template slot-scope="scope">
                <el-button @click="editCategory(scope.row)" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="deleteCategory(scope.row._id)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <!--分类列表-->
        <category-table v-show="showTable" :categoryInfo="categoryInfo" :categorySub="categorySub" @showListClick="showListClick"></category-table>
        <!--添加分类-->
        <add-category v-if="showAdd" @showListClick="showListClick"></add-category>
    </div>
</template>

<script>
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    import CategoryTable from '@/components/views/CategoryTable'
    import AddCategory from '@/components/views/AddCategory'
  export default {
    data() {
      return {
        categoryList: [],
        showTable:false,
        showAdd:false,
        categoryInfo:[],
        categorySub:[]
      }
    },
    components:{
        CategoryTable,
        AddCategory
    },
    created(){
        this.axiosGetCategoryList()
    },
    methods: {
        axiosGetCategoryList() {
            axios({
                url:url.getCategoryList,
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
        editCategory(item){
            this.showTable = true
            this.showAdd = false
            this.categoryInfo = item
            this.axiosGetCategorySubList(item._id)
        },
        axiosGetCategorySubList(categoryId){
            axios({
                url:url.getCategorySubList,
                method:'post',
                data:{
                    categoryId:categoryId
                }
            })
            .then(response=>{
                if(response.data.code == 200 && response.data.message){
                    this.showTable = true
                    this.showAdd = false
                    this.categorySub = response.data.message
                }else{
                    console.log('数据拉取失败')
                }
            })
            .catch(error=>{
                console.log(error)
            })
        },
        showListClick(){
            this.showTable = false
            this.showAdd = false
            this.axiosGetCategoryList()
        },
        addCategory(){
            this.showAdd = true
            this.showTable = false
        },
        deleteCategory(id){
            this.$confirm('删除此类，此分类下的商品也将被删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.axiosDeleteCategory(id)
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        axiosDeleteCategory(id){
            axios({
                url:url.deleteCategory,
                method:'post',
                data:{
                    id:id
                }
            })
            .then(response=>{
                if(response.data.code == 200 && response.data.message){
                    this.axiosDeleteAllCategorySub(id)
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
        axiosDeleteGoodsOfCategory(id){
            axios({
                url:url.deleteGoodsOFCategory,
                method:'post',
                data:{
                    id:id
                }
            })
            .then(response=>{
                if(response.data.code == 200 && response.data.message){
                    this.axiosGetCategoryList()
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
        axiosDeleteAllCategorySub(id){
            axios({
                url:url.deleteGoodsOFCategory,
                method:'post',
                data:{
                    id:id
                }
            })
            .then(response=>{
                if(response.data.code == 200 && response.data.message){
                    this.axiosDeleteGoodsOfCategory(id)
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
        }
    },
  }
</script>

<style lang='less' scoped>
    .category-list{
        padding: 20px;
        position: relative;
        overflow-y: scroll;
        overflow-x: hidden;
        .list-header{
            float: left;
            margin-bottom: 20px;
        }
        .add-btn{
            float: right;
            font-size: 40px;
            color: rgb(64, 158, 255);
            margin-top: -3px;
            margin-bottom: 30px;
        }
    }
    .category-list::-webkit-scrollbar{
        display: none;
    }
</style>