<template>
    <div class="app-container">
        这里是课表
    </div>
</template>

<script>
import _ from 'lodash';
import timetable from './components/timetable.vue';
export default {
    name: "setReport",
    components: {
        timetable
    },
    data() {
        return {
            
        }
    },
    mounted(){
       
    },
    methods: {
        
    }
}
</script>

<style scoped lang="scss">
*{
    font-family: "微软雅黑";
}
.u_TableMain{
    padding: 10px 30px;
}

</style>
