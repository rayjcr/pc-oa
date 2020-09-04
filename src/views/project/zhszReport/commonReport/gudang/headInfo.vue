<template>
  <div class="templateTitle">
    <div class="bgdTitle" v-if="bgd">{{bgd.xn.split('-')[0]}}学年{{bgd.xq=='01'?'第一学期':'第二学期'}}报告单</div>
    <div class="stuInfo" :class="{'noimg':!showHeadImg}">
      <div class="userHead" v-if="showHeadImg">
          <div class="imgBox">
              <img :src="userImgPath?userImgPath:'/static/report/common/_testuser.jpg'">
          </div>
      </div>
      <div v-if="userInfo">
        <div class="userName">{{userInfo.xm}}</div>
        <div class="className">{{userInfo.bjmc}}</div>              
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "reportHead",
    props:[
      'userImgPath',
      'userInfo',
      'bgd'
    ],
    data(){
      return {
        showHeadImg: false
      }
    },
    mounted() {
      this.showHeadImg = !(this.bgd.xn == '2019-2020' && this.bgd.xq == '02');
    }
}
</script>

<style scoped lang="scss">
.templateTitle{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  top: 36px;
  .bgdTitle{
    color: #058937;
    font-size: 29px;
    margin-left: 105px;
  }
  .stuInfo{
    display: flex;
    align-items: center;
    width: 255px;
    &.noimg{
      width: 190px;
      text-align: right;
    }
    .userHead{
        width: 64px;
        height: 64px;
        border:3px solid #FFF;
        background: #FFF;
        overflow: hidden;
        border-radius: 4px;
        margin-right: 5px;
        .imgBox{
            width: 100%;
            height: 100%;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
        }
    }
    .userName{
      font-size: 24px;
      color: #058937;
      line-height: 35px;
    }    
    .className{
      font-size: 19px;
      color: #058937;
      line-height: 35px;
    }
  }
}

</style>
