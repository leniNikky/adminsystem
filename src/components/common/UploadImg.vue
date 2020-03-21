<template>
  <div class="vue-uploader">
    <div class="file-list">
      <section v-for="(file) of files" class="file-item draggable-item" :key="file.name">
        <img :src="file.src" alt="" ondragstart="return false;">
        <!--<span class="file-remove" @click="remove(index)">+</span>-->
      </section>
      <section v-if="status == 'ready' && files.length<=0" class="file-item">
        <div @click="add" class="add"></div>
      </section>
    </div>
    <input type="file" @change="fileChanged" ref="file" multiple="multiple" accept="image/jpg,image/jpeg,image/png,image/bmp">
  </div>
</template>
<script>
    import client from '@/client.js'
    export default {
        props:{
            imgUrl:String
        },
        data() {
            return {
                status: 'ready',
                files: [],
                point: {},
                uploading: false,
                percent: 0,
            }
        },
        methods: {
            add() {
                this.$refs.file.click()
            },
            clearImg(){
                this.files = []
            },
            submit() {
                var that=this
                const fNum = this.files;
                for(var i=0;i<fNum.length;i++){
                var f=fNum[i].file
                //console.log(f)
                const Name=f.name
                //console.log(Name)
                const suffix = Name.substr(Name.indexOf("."));
                const obj=this.timestamp();
                const storeAs = 'mpet/'+obj+suffix // 路径+时间戳+后缀名
                //console.log(storeAs)
                client.multipartUpload(storeAs, f).then( (result)=>{
                    let img = 'http://zyn2019.oss-cn-shenzhen.aliyuncs.com/'+storeAs
                    //console.log(this.imgUrl)
                    this.$emit('imageUrl',img)
                    //return true
                    console.log('http://zyn2019.oss-cn-shenzhen.aliyuncs.com/'+storeAs)
                })
                }
            },
            // 时间戳
            timestamp:function(){ 
                const time = new Date(); 
                const y = time.getFullYear(); 
                const m = time.getMonth()+1; 
                const d = time.getDate(); 
                const h = time.getHours(); 
                const mm = time.getMinutes(); 
                const s = time.getSeconds(); 
                const ms = time.getMilliseconds() 
                return ""+y+this.Add0(m)+this.Add0(d)+this.Add0(h)+this.Add0(mm)+this.Add0(s)+this.Add0(ms); 
            },
            Add0:function(m){ 
                return m<10?'0'+m : m; 
            } ,
        
            finished() {
                this.files = []
                this.status = 'ready'
                
            },
            remove(index) {
                this.files.splice(index, 1)
            },
            fileChanged() {
                const list = this.$refs.file.files
                for (let i = 0; i < list.length; i++) {
                if (!this.isContain(list[i])) {
                    const item = {
                    name: list[i].name,
                    size: list[i].size,
                    file: list[i]
                    }
                    this.html5Reader(list[i], item)
                    this.files.push(item)
                }
                }
                this.$refs.file.value = ''
                this.submit()
            },
            // 将图片文件转成BASE64格式
            html5Reader(file, item){
                const reader = new FileReader()
                reader.onload = (e) => {
                this.$set(item, 'src', e.target.result)
                }
                reader.readAsDataURL(file)
            },
            isContain(file) {
            return this.files.find((item) => item.name === file.name && item.size === file.size)
            },
        }
    }
</script>
<style>
.vue-uploader {
  border: 1px solid #e5e5e5;
}
.vue-uploader .file-list .file-item {
  float: left;   
  position: relative;
  width: 80px;
}
.vue-uploader .file-list .file-item img{
  width: 80px;
  height: 80px;
  border: 1px solid #ececec;
}
.vue-uploader .file-list .file-item .file-remove {
  position: absolute;
  right: 4px;
  display: none;
  top: 4px;
  width: 20px;
  height: 20px;
  font-size:20px;
  text-align: center;
  color: white;
  cursor: pointer;
  line-height: 20px;
  border-radius: 100%;
  transform: rotate(45deg);
  background: rgba(0, 0, 0, 0.5);
}
.vue-uploader .file-list .file-item:hover .file-remove {
  display: inline;
}
.vue-uploader .add {
  width: 80px;
  height: 80px;
  float: left;
  line-height: 80px;
  cursor: pointer;
  background: url('http://zyn2019.oss-cn-shenzhen.aliyuncs.com/mpet/nopicture.jpg') no-repeat; 
  background-size: 100% 100%;
}

.vue-uploader .upload-func .progress-bar section {
  margin-top: 5px;
  background: #00b4aa;
  border-radius: 3px;
  text-align: center; 
  color: #fff;
  font-size: 12px;
  transition: all .5s ease;
}
.vue-uploader > input[type="file"] {
  display: none;
}
</style>