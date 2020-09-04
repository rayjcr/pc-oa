<template>
    <div class="app-container">
        <div class="u_TableMain">
            <el-tabs>
                <el-tab-pane label="A校区时间方案">
                    <timetable></timetable>
                </el-tab-pane>
                <el-tab-pane label="B校区时间方案">

                </el-tab-pane>
            </el-tabs>
        </div>
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
