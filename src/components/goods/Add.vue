<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <el-steps
        :space="200"
        :active="activeName - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="goodsForm"
        :rules="goodsFormRules"
        ref="goodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs tab-position="left" v-model="activeName" :before-leave="nextStep">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="goodsForm.goods_price" type="Number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="goodsForm.goods_weight" type="Number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="goodsForm.goods_number" type="Number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goodsForm.goods_cat"
                :options="options"
                :props="props"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item,i) in manyList" :key="i">
                <el-checkbox-group v-model="manyAttr">
                  <el-checkbox border :label="item1" v-for="(item1,i1) in item.attr_vals" :key="i1"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyList" :key="i">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              list-type="picture-card"
              :on-success="handleSuccess"
              :on-remove='handleRemove'
              :headers="token"
              :on-preview="handlePictureCardPreview">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="goodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeName: 0,
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      goodsForm: {
        goods_name: 'ada',
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cat: [],
        attrs: [],
        pics: [],
        goods_introduce: ''
      },
      manyAttr: [],
      goodsFormRules: {
        goods_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      dialogImageUrl: '',
      disabled: false,
      manyList: [],
      onlyList: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      fileList: [],
      token: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const {data: res} = await this.$http.get('categories')
      if (res.meta.status !== 200) this.$message.error('获取分类失败！')
      this.options = res.data
      console.log(res)
    },
    async handleChange() {
      const {data: res} = await this.$http.get(`categories/${this.goodsForm.goods_cat[2]}/attributes`, {
        params: {
          sel: 'many'
        }
      })
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.split(' ')
      })
      this.manyList = res.data
      const {data: res1} = await this.$http.get(`categories/${this.goodsForm.goods_cat[2]}/attributes`, {
        params: {
          sel: 'only'
        }
      })
      // res.data.forEach(item => {
      //   item.attr_vals = item.attr_vals.split(' ')
      // })
      this.onlyList = res1.data
    },
    nextStep(activeName, oldActiveName) {
      console.log(123)
      if (oldActiveName === '0') {
        if (this.goodsForm.goods_cat.length !== 3) {
          this.$message.error('请选择商品的分类')
          return false
        } else if (this.goodsForm.goods_name.trim() === '') {
          this.$message.error('请输入商品名称')
          return false
        } else if (this.goodsForm.goods_price === 0) {
          this.$message.error('请输入商品价格')
          return false
        } else if (this.goodsForm.goods_weight === 0) {
          this.$message.error('请输入商品重量')
          return false
        } else if (this.goodsForm.goods_number === 0) {
          this.$message.error('请输入商品数量')
          return false
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      console.log(file)
      console.log(this.token)
    },
    handleDownload (file) {
    },
    handleRemove (file) {
      const path = file.response.data.tmp_path
      const index = this.goodsForm.pics.findIndex(item => item.pic === path)
      this.goodsForm.pics.splice(index, 1)
    },
    handleSuccess(response) {
      this.goodsForm.pics = [{
        pic: response.data.tmp_path
      }]
      console.log(response)
    },
    addGoods() {
      this.$refs.goodsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要项！')
        const form = _.cloneDeep(this.goodsForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyList.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: this.manyAttr.join(' ')
          })
        })
        this.onlyList.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        console.log(form)
        const {data: res} = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  }
}
// tabsChange(activeName, oldActiveName) {
//   console.log(123)
//   // if (this.goodsForm.goods_cat.length !== 3) {
//   //   return false
//   // }
// }
</script>
<style lang="less" scoped>
.el-steps {
  margin-top: 15px;
}
/deep/ .el-step__title {
  font-size: 12px;
}
.el-tabs {
  margin-top: 15px;
}
/deep/.ql-editor {
  min-height: 350px;
}
.el-button {
  margin-top: 15px;
}
</style>
