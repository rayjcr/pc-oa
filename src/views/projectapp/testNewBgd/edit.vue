<template>
  <div class="editMain">

        <div class="layoutMain">
            <!-- <div @mousedown="dragDown($event)" class="layout"> -->
            <div class="layout">
                <div class="layoutBox" data-layout="one-column">1列<br>100%</div>
            </div>
            <!-- <div class="dragCell layoutBox">2列<br>2 x 50%</div>
            <div class="dragCell layoutBox">2列<br>33% + 66%</div> -->
        </div>

        <div class="editBox">
            <div class="pageEdit"></div>
        </div>

        
        <div ref="dragTemp" class="dragTemp" :class="dargType"></div>
    

  </div>
</template>
<script>
import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/droppable'
import 'jquery-ui/ui/widgets/resizable'
export default {
  name: '',
  data() {
    return {
        isCellCheck:false,
        isCanMove:false,
        startPos:{
            x:0,
            y:0
        },
        dargType:"",

    };
  },
  mounted() {
        var that = this;
        document.addEventListener("mousemove",function(e){
            that.dragMove(e);
        })
        document.addEventListener("mouseup",function(e){
            that.dragup(e);
        })

        $(function(){
            $(".layout").draggable({
                helper: function() {
                    return $('<div class="arrow_box"><p>You can drop it here!</p></div>');
                },
                appendTo: 'body',
                connectToSortable: '.builder-wrapper'  // 排序用的
            });

            $(".pageEdit").droppable({
                drop: function(event,ui){
                    console.log("aabbcc")
                }
            });
        })
        


  },
  methods: {
        dragDown(ev){
            //记录鼠标的初始坐标
            // console.log(ev);
            this.startPos.x = ev.pageX;
            this.startPos.y = ev.pageY;
            //判断是什么类型的结构
            if(ev.target.dataset.layout=="one-column"){
                this.isCellCheck = true; 
            }
        },
        dragMove(ev){
            if(this.isCellCheck&&this.isCanMove){
                this.dargType = "layout";
                this.$refs.dragTemp.style.left = ev.pageX - this.$refs.dragTemp.offsetWidth/2 + "px";
                this.$refs.dragTemp.style.top = ev.pageY - this.$refs.dragTemp.offsetHeight/2 + "px";

            }else if(this.isCellCheck){
                if(Math.abs(this.startPos.x-ev.pageX)>=40||Math.abs(this.startPos.y-ev.pageY)>=40){
                    this.isCanMove = true;
                }else{
                    this.isCanMove = false;
                }
            }
        },
        dragup(ev){
            this.isCellCheck = false; 
            this.isCanMove = false;
            this.dargType = "";
        },
        inPage(){
            console.log("我进编辑页咯！！！");
        },
  }
};
</script>
<style lang='scss' scoped>
.editMain{
    width: 100%;
    height: 100%;
    flex: 1;
    padding: 20px;
    position: relative;
    .editBox{
        width: 500px;
        height: 708px;
        border: 1px solid #eee;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, .2);
        top: 20px;
        left: 140px;
        position: absolute;
        box-sizing: content-box;

    }
}
.layoutBox{
    width: 80px;
    height: 80px;
    border-radius: 10px;
    margin-bottom: 0;
    border: 1px solid #e6e6e6;
    text-align: center;
    padding: 20px 0;
    line-height: 20px;
    cursor: pointer;
}
.layoutMain{
    width: 100px;
    height: 400px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    padding: 0 10px;
    position: relative;
    z-index: 1;
    .layoutBox{
        margin-top: 10px;
    }
    .layoutBox:hover{
        background: #e6e6e6;
    }
}
.pageEdit{
    width: 500px;
    height: 708px;
    background: #eee;
}

.dragTemp{
    position: fixed;
    z-index: 200;
}
.dragTemp.layout{
    width: 150px;
    height: 70px;
    background: rgba($color: #000000, $alpha: .8);
    border-radius: 5px;
}

</style>
<style>
.main-container,.app-main{
    display: flex;
    flex-direction: column;
}
</style>
