<template>
  <div class="rich_box">
    <quill-editor ref="myTextEditor"
      :style="{width: mainwidth}"
      v-model="content"
      :options="editorOption" 
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>
<script>
  export default{
    // name: 'RichText',
    data () {
      return {
        content:'',
        editorOption:{
          modules:{
            // 富文本框头部所需功能模块（）
            toolbar:[
              // ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              // ['blockquote', 'code-block'],

              // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
              // [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
              // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
              // [{ 'direction': 'rtl' }],                         // text direction

              // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
              // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

              // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              // [{ 'font': [] }],
              // [{ 'align': [] }],

              // ['clean'] 
            ],
            // placeholder: '........',
            // readOnly: false,
          },
        },
      }
    },
    watch: {
      // dataSource(newval, oldval){
      //   this.content = newval
      // }
    },
    props: {
      showtype:Number,
      dataSource:String,
      mainwidth: String,
      isedit: Boolean, // 输入框是否可编辑控制
    },
    mounted () {
      // this.px = this.px
      this.content = this.dataSource
      if (this.dataSource === '请输入内容' && this.isedit) {
        this.content = ''
      } else if (this.isedit && this.dataSource !== '请输入内容') {
        this.content = this.dataSource
      } else if (!this.isedit) {
        this.content = this.dataSource
      }
      // this.$refs.myTextEditor.quill.enable(true);
      

      // if (this.isedit) {
      //   this.editorOption.modules.readOnly = false
      // } else {
      //   this.editorOption.modules.readOnly = true
      // }
      // this.$refs.myTextEditor.quillEditor.quill.blur()
      // console.log(this.$refs)
      // you can use current editor object to do something(editor methods)
      // console.log('this is my editor', this.editor)
      // this.editor to do something...
    },
    // if you need to get the current editor object, you can find the editor object like this, the $ref object is a ref attribute corresponding to the dom redefined
  // 如果你需要得到当前的editor对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的editor对象，实际上这里的$refs对应的是当前组件内所有关联了ref属性的组件元素对象
    computed: {
      editor() {
        return this.$refs.myTextEditor.quillEditor
      }
    },
    // if you need to manually control the data synchronization, parent component needs to explicitly emit an event instead of relying on implicit binding
    // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
    methods: {
      /**
     * @description: 富文本失去焦点触发事件
     * @param {type} 
     * @return: 
     */
      onEditorBlur(editor) {
        // console.log('hahgahahajhahajhd')
        this.$emit('onEditorBlur', editor)
        
        // console.log('editor blur!', editor)
      },
      /**
       * @description: 富文本获取焦点触发事件
       * @param {type} 
       * @return: 
       */  
      onEditorFocus(editor) {
        this.$emit('onEditorFocus', editor)
        // console.log('editor focus!', editor)
      },
      /**
       * @description: 编辑器准备完毕触发事件
       * @param {type} 
       * @return: 
       */ 
      onEditorReady(editor) {
        if (!this.isedit) {
          editor.enable(false)
        } else {
          // console.log(this.$refs.myTextEditor.value)
          editor.enable(true)

        }
        // this.$refs.myTextEditor.quill.blur()
        this.$emit('onEditorReady', editor)
        // console.log('editor ready!', editor)
      },
      /**
       * @description: 富文本编辑器内容数据发生改变触发事件
       * @param {type} 
       * @return: 
       */  
      onEditorChange({ editor, html, text }) {
        // console.log(this.$refs.myTextEditor._content)
        this.$emit('onEditorChange', { editor, html, text }, this.showtype)
        // console.log(html)
        // console.log('editor change!', editor, html, text)
        this.content = html
      }
    }
  }
</script>
<style lang="scss">
.rich_box{
  .ql-editor{
    p{
      text-indent:2em !important;
    }
  }
  .ql-toolbar{
    display: none;
  }
  .ql-container,.ql-snow{
    min-height: 300px;
    border-top: 1px solid #ccc !important;
  }
}
</style>