<template>
  <div>
    <template>
      <el-carousel :interval="4000" type="card">
        <el-carousel-item v-for="item in imgList" :key="item">
          <img :src="item">
          <!-- <img src="../assets/img/1.jpg" alt=""> -->
        </el-carousel-item>
      </el-carousel>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgList: [
        require('../assets/img/1.jpg'),
        require('../assets/img/2.jpg'),
        require('../assets/img/3.jpg'),
        require('../assets/img/4.jpg'),
        require('../assets/img/5.jpg'),
        require('../assets/img/6.jpg')]
    }
  }
}
</script>
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .img {
    width: 100%;
    height: 100%;
  }
</style>
