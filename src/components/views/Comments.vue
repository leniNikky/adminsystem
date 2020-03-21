<template>
  <div class="comments">
    <div class="list-header">
        <el-input
            v-model="searchInfo"
            style="width:300px;float:left;margin-right:10px;"
            placeholder="请输入商品ID">
        </el-input>
        <el-button type="primary" @click="searchCommentsByID">搜索</el-button>
        <el-select v-model="value" placeholder="请选择审核状态" class="select-margin">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-button type="primary" @click="searchCommentsByStatus">搜索</el-button>
        <el-button type="primary" @click="axiosGetAllComments">全部评论</el-button>
    </div>
      <el-table
      :data="commentsList"
      border
      style="width: 100%">
      <el-table-column
        prop="goodsId"
        label="商品ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userId"
        label="用户ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容"
        width="260">
      </el-table-column>
      <el-table-column
        label="时间"
        width="180">
        <template slot-scope="scope">
          {{scope.row.time | dateTimeFormat}}
        </template>
      </el-table-column>
      <el-table-column
        label="审核">
        <template slot-scope="scope">
            <el-button @click="changeStatus(scope.row._id,1)" type="text" size="small" v-show="scope.row.status == 0">通过</el-button>
            <el-button @click="changeStatus(scope.row._id,2)" type="text" size="small" v-show="scope.row.status == 0">不通过</el-button>
            <el-button type="text" size="small" v-show="scope.row.status == 1" disabled>已通过</el-button>
            <el-button type="text" size="small" v-show="scope.row.status == 2" disabled>未通过</el-button>
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
        commentsList: [],
         options:[{
                    value:0,
                    label:'未审核'
                },{
                    value:1,
                    label:'已通过'
                },{
                    value:2,
                    label:'未通过'
                }],
                searchInfo:'',
                value:''
      }
    },
    created(){
      this.axiosGetAllComments()
    },
    filters:{
      dateTimeFormat(date){
          return dateTimeFormat(date)
      }
    },
    methods: {
      searchCommentsByStatus(){
        if(this.value == '' && this.value !=0){
          this.$message({
            type:'info',
            message:'请先选择评论状态'
          })
        }else{
          axios({
            url:url.findCommentsByStatus,
            method:'post',
            data:{
              status:this.value
            }
          })
          .then(response=>{
            if(response.data.code == 200 && response.data.message){
              this.commentsList = response.data.message
            }else{
              this.commentsList = []
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
       searchCommentsByID(){
        if(this.searchInfo == ''){
          this.$message({
            type:'info',
            message:'请先输入商品ID'
          })
        }else{
          axios({
            url:url.findCommentsOfGoods,
            method:'post',
            data:{
              id:this.searchInfo
            }
          })
          .then(response=>{
            if(response.data.code == 200 && response.data.message){
              this.commentsList = response.data.message
            }else{
              this.commentsList = []
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
      changeStatus(id,status){
        axios({
          url:url.changeCommentPass,
          method:'post',
          data:{
            id:id,
            status:status
          }
        })
        .then(response=>{
          if(response.data.code == 200 && response.data.message){
            this.axiosGetAllComments()
            this.$message({
              type:'success',
              message:'修改成功'
            })
          }else{
            this.$message({
              type:'info',
              message:'修改失败'
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
      axiosGetAllComments() {
        axios({
          url:url.getAllComments,
          method:'get',
        })
        .then(response=>{
          if(response.data.code == 200 && response.data.message){
            this.commentsList = response.data.message
          }else{
            this.$message({
              type:'info',
              message:'数据调取失败'
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
  .comments{
    padding: 10px;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    .list-header{
      float: left;
      margin-bottom: 20px;
    }
  }
  .comments::-webkit-scrollbar{
    display: none;
  }
</style>