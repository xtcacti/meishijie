<template>
  <div class="menu-detail">
    <detail-header :info="menuInfo"></detail-header>
    <detail-content :info="menuInfo"></detail-content>
    <Comment :info="menuInfo"></Comment>
  </div>
</template>
<script>
import DetailHeader from "./detail-header";
import DetailContent from "./detail-content";
import Comment from "./comment";
import { menuInfo } from "@/service/api";
export default {
  components: { DetailHeader, DetailContent, Comment },
  data() {
    return {
      menuInfo: {
        userInfo: {},
        raw_material: {
          main_material: [],
          accessories_material: [],
        },
        stpe:[]
      },
    };
  },
  watch: {
    $route: {
      handler() {
        let { menuId } = this.$route.query;
        if (menuId) {
          menuInfo({ menuId }).then((data) => {
            this.menuInfo = data.data.info;
          });
        } else {
          this.$message({
            showClose: true,
            message: "请重新进入",
            type: "warning",
          });
        }
      },
      immediate: true,
    },
  },
};
</script>
