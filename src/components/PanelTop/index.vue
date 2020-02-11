<template>
  <div>
    <el-card
      :body-style="{ padding: '5px' }"
      style="z-index:8;width:auto;left:calc(50% - 350px);position:absolute;"
    >
      <el-button
        :disabled="!canUndo"
        size="mini"
        icon="el-icon-refresh-left"
        @click="undo"
      >
        Undo 撤销
      </el-button>
      <el-button
        :disabled="!canRedo"
        size="mini"
        icon="el-icon-refresh-right"
        @click="redo"
      >
        Redo 恢复
      </el-button>
      <el-button
        size="mini"
        icon="el-icon-document-add"
        @click="load"
      >
        Load XML 读取
      </el-button>
      <el-button
        size="mini"
        icon="el-icon-upload"
        @click="save"
      >
        Save 保存 (DEMO)
      </el-button>
      <el-button
        size="mini"
        icon="el-icon-video-play"
        type="success"
        @click="run"
      >
        Run 运行 (DEMO)
      </el-button>
    </el-card>
    <div>
      <el-drawer
        title="Debugging"
        :visible.sync="drawerVisible"
        :modal="false"
        size="30%"
        :modal-append-to-body="false"
        :close-on-press-escape="false"
        custom-class="devdrawer"
      >
        <el-button @click="copy">
          Copy Content 复制内容
        </el-button>
        <pre>{{ drawerContent }}</pre>
      </el-drawer>
    </div>
  </div>
</template>
<script>
export default {
  inject: ['diagram'],
  data() {
    return {
      drawerVisible: false,
      drawerContent: undefined,
    }
  },
  computed: {
    canUndo() {
      return this.diagram() ? this.diagram().commandStack.canUndo() : false
    },
    canRedo() {
      return this.diagram() ? this.diagram().commandStack.canRedo() : false
    },
  },
  methods: {
    // TODO: animation & Logs
    run() {},
    // Saving DEMO
    save() {
      this.diagram()
        .exportXML()
        .then(xml => {
          this.drawerVisible = true
          this.drawerContent = xml
        })
        .catch(_ => {
          this.$message.error('Failed!导出失败')
        })
    },
    copy() {
      navigator.clipboard.writeText(this.drawerContent).then(
        () => {
          this.$message.success('Copied 已经复制')
        },
        error => {
          console.log(error)
          this.$message.error('Failed!Please copy mananuly 失败！请手动复制')
        }
      )
    },
    // load XML DEMO
    load() {
      let result = window.prompt(
        'Please input BPMN XML, You can copy/paste it after saving.\n 请输入 BPMN XML，你可以在保存之后复制/粘贴。',
        ''
      )
      if (result === null) {
        return
      }
      this.diagram()
        .importXML(result)
        .catch(_ => {
          this.$message.error(
            'Loading Error Please Check XML. 读取失败请检查 XML 格式!'
          )
        })
    },
    undo() {
      this.diagram().cli.undo()
    },
    redo() {
      this.diagram().cli.redo()
    },
  },
}
</script>
