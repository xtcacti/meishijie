<template>
  <div class="create">
    <h2>欢迎发布新菜谱，先介绍一下你的大作！</h2>
    <section class="create-introduce">
      <h5>标题</h5>
      <el-input
        class="create-input"
        placeholder="请输入内容"
        v-model="backData.title"
      ></el-input>
      <h5>属性</h5>
      <div>
        <el-select
          v-for="item in properties"
          :key="item.parent_type"
          :placeholder="item.parent_name"
          v-model="backData.property[item.title]"
        >
          <el-option
            v-for="option in item.list"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          >
          </el-option>
        </el-select>
      </div>
      <h5>菜谱分类</h5>
      <div>
        <el-select placeholder="请选择菜谱分类" v-model="backData.classify">
          <el-option-group
            v-for="item in classifies"
            :key="item.parent_type"
            :label="item.parent_name"
          >
            <el-option
              v-for="option in item.list"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <h5>成品图 (328*440)</h5>
      <div class="upload-img-box clearfix">
        <div class="upload-img">
          <upload-img
            action="/api/upload?type=product"
            :image-url="backData.product_pic_url"
            @res-url="
              (data) => {
                backData.product_pic_url = data.resImgUrl;
              }
            "
          ></upload-img>
        </div>
        <el-input
          class="introduce-text"
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          v-model="backData.product_story"
        >
        </el-input>
      </div>
    </section>

    <h2>记录所有原材料</h2>
    <section class="create-introduce">
      <h5>主料</h5>
      <!--[ { "name": "", "specs": "" }, { "name": "", "specs": "" }, { "name": "", "specs": "" } ]-->
      <Stuff></Stuff>
      <h5>辅料</h5>
      <Stuff></Stuff>
    </section>

    <h2>开始写步骤了！能否简单易学就看你怎么写了，加油！</h2>
    <section class="create-introduce">
      <Upload></Upload>
      <el-button
        class="eaeaea add-step-button"
        type="primary"
        size="medium"
        icon="el-icon-plus"
        >增加一步</el-button
      >
      <h5>烹饪小技巧</h5>
      <el-input
        class="introduce-text"
        type="textarea"
        :rows="8"
        placeholder="分享下你做这道菜的过程中的心得和小技巧吧！"
      >
      </el-input>
    </section>

    <el-button class="send" type="primary" size="medium" :icon="icon"
      >搞定，提交审核</el-button
    >
  </div>
</template>
<script>
import Stuff from "./stuff";
import Upload from "./step-upload";
import UploadImg from "@/components/upload-img";
import { getProperty, getClassify, publish } from "@/service/api";

//页面中展示的数据
//用户产生的，像后端发送的数据
export default {
  name: "create",
  components: { Stuff, Upload, UploadImg },
  data() {
    return {
      properties: [], //页面中展示的数据
      classifies: [],
      backData: {
        title: "",
        property: {},
        classify: "",
        product_pic_url:
          "https://s1.c.meishij.net/n/images/upload_big_img.png?_=1561906961",
        product_story: "",
      },
    };
  },
  mounted() {
    getProperty().then((data) => {
      this.properties = data.data;
      this.backData.property = data.reduce((o, item) => {
        o[item.title] = "";
        return o;
      }, {});
    });
    getClassify().then((data) => {
      console.log(data);
      this.classifies = data.data;
      this.backData.classify = data.reduce((o, item) => {
        o[item.title] = "";
        return o;
      }, {});
    });
  },
  methods: {},
};
</script>
<style lang="stylus">
.create-introduce {
  background-color: #fff;
  padding: 20px;

  .add-step-button {
    margin-left: 100px;
  }
}

.create {
  width: 100%;

  h2 {
    text-align: center;
    margin: 20px 0;
  }

  .send {
    // ff3232()
    height: 70px;
    width: 220px;
    background: #ff3232;
    color: #fff;
    border: none;
    margin: 20px auto;
    display: block;
  }

  h5 {
    margin: 20px 0;
  }
}

.create-input input {
  width: 446px;
  line-height: 22px;
}

.upload-img-box {
  .upload-img {
    float: left;
  }

  .introduce-text {
    float: left;
  }

  .el-textarea {
    width: 60%;
    margin-left: 10px;
  }
}
</style>


