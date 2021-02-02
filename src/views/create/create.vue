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
      <Stuff v-model="backData.raw_material.main_material"></Stuff>
      <h5>辅料</h5>
      <Stuff v-model="backData.raw_material.accessories_material"></Stuff>
    </section>

    <h2>开始写步骤了！能否简单易学就看你怎么写了，加油！</h2>
    <section class="create-introduce">
      <Upload
        v-for="(item, index) in backData.steps"
        :key="item.customeId"
        :n="index + 1"
        v-model="backData.steps[index]"
        @remove="removeStep"
      ></Upload>
      <el-button
        class="eaeaea add-step-button"
        type="primary"
        size="medium"
        icon="el-icon-plus"
        @click="addStep"
        >增加一步</el-button
      >
      <h5>烹饪小技巧</h5>
      <el-input
        class="introduce-text"
        type="textarea"
        :rows="8"
        placeholder="分享下你做这道菜的过程中的心得和小技巧吧！"
        v-model="backData.skill"
      >
      </el-input>
    </section>

    <el-button
      class="send"
      type="primary"
      size="medium"
      :icon="icon"
      @click="send"
      >搞定，提交审核</el-button
    >
  </div>
</template>
<script>
import Stuff from "./stuff";
import Upload from "./step-upload";
import UploadImg from "@/components/upload-img";
import { getProperty, getClassify, publish } from "@/service/api";

const raw_material_struct = {
  name: "",
  specs: "",
};

const steps_struct = {
  img_url: "",
  describe: "",
};

let n = 1;

const mockData = {
  title: "lxt",
  property: {
    craft: "1-2",
    flavor: "2-2",
    hard: "3-2",
    people: "4-2",
  },
  classify: "1-2",
  product_pic_url:
    "http://127.0.0.1:7001\\static\\upload\\product\\test-product1612194263147.jpg",
  product_story: "lxt",
  raw_material: {
    main_material: [
      {
        name: "11",
        specs: "11",
      },
      {
        name: "1122",
        specs: "22",
      },
      {
        name: "3344",
        specs: "433",
      },
    ],
    accessories_material: [
      {
        name: "333",
        specs: "333",
      },
      {
        name: "3332",
        specs: "44",
      },
      {
        name: "55",
        specs: "66",
      },
    ],
  },
  steps: [
    {
      img_url:
        "http://127.0.0.1:7001\\static\\upload\\step\\test1612194299682.jpg",
      describe: "gtrbr",
      customeId: 1612194240333,
    },
    {
      img_url:

      
        "http://127.0.0.1:7001\\static\\upload\\step\\test1612194308862.jpg",
      describe: "lxt",
      customeId: 1612194240334,
    },
  ],
  skill: "lllxxxttt",
  step: [
    {
      img_url:
        "http://127.0.0.1:7001\\static\\upload\\step\\test1612194299682.jpg",
      describe: "gtrbr",
    },
    {
      img_url:
        "http://127.0.0.1:7001\\static\\upload\\step\\test1612194308862.jpg",
      describe: "lxt",
    },
  ],
};

//页面中展示的数据
//用户产生的，像后端发送的数据
export default {
  name: "create",
  components: { Stuff, Upload, UploadImg },
  data() {
    return {
      properties: [], //页面中展示的数据
      classifies: [],
      icon: "",
      backData: {
        title: "",
        property: {},
        classify: "",
        product_pic_url:
          "https://s1.c.meishij.net/n/images/upload_big_img.png?_=1561906961",
        product_story: "",
        raw_material: {
          main_material: Array(3)
            .fill(1)
            .map(() => ({ ...raw_material_struct })),
          accessories_material: Array(3)
            .fill(1)
            .map(() => ({ ...raw_material_struct })),
        },
        steps: Array(3)
          .fill(1)
          .map(() => ({ ...steps_struct, customeId: this.uuid() })),
        skill: "",
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
      this.classifies = data.data;
      this.backData.classify = data.reduce((o, item) => {
        o[item.title] = "";
        return o;
      }, {});
    });
  },
  methods: {
    addStep() {
      this.backData.steps.push({ ...steps_struct, customeId: this.uuid() });
    },
    removeStep(index) {
      this.backData.steps.splice(index - 1, 1);
    },
    uuid() {
      n++;
      return Date.now() + n;
    },
    send() {
      this.icon = "el-icon-loading";
      const param = this.backData;
      //customeId处理：
      // --> 1.删除字段，当前页面需要用的这个字段可能会有问题
      // --> 2.只提取需要用到的字段
      param.step = param.steps.map((item) => {
        return {
          img_url: item.img_url,
          describe: item.describe,
        };
      });
      //测试:
      // --> 1.测试过程中不跳转，手动打开指定的跳转页面看数据对不对
      // --> 2.mock数据，模拟一套数据，预先转杯一套数据
      // param = mockData;
      console.log(JSON.stringify(param, null, 2));
      publish(param).then((data) => {
        console.log(data);
        this.$router.push({
          name: "space",
        });
      });
    },
  },
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


