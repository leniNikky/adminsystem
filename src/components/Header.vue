<template>
    <div class="header">
        <el-row>
            <el-col :span="4">
                <img src="../assets/img/logo.png" width="50" height="50" style="border-radius:5px;margin-top:10px;float:left;margin-left:30px;">
            </el-col>
            <el-col :span="20">
                <div class="logout" @click="logout">
                    退出
                </div>
                <div class="admin">
                    {{adminname}}, 欢迎回来
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                adminname: '',
            }
        },
        created(){
            this.adminname = JSON.parse(localStorage.adminInfo).name
        },
        methods: {
            logout() {
                localStorage.clear('adminInfo')
                this.$emit('changeLoginStatus')
            }
        },
    }
</script>

<style lang='less' scoped>
    .header{
        width: 100%;
        height:70px;
        line-height: 70px;
        background: rgb(78,86,93);
        .admin{
            font-size: 16px;
            color: #fff;
            float: right;
            margin-right:20px;
        }
        .logout{
            font-size: 16px;
            color: #fff;
            float: right;
            margin-right:20px;
            cursor: pointer;
        }
    }
</style>