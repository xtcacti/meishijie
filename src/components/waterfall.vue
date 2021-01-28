<template>
  <div class="waterfall" ref="waterfall">
    <slot></slot>
    <div class="waterfall-loading" ref="loading" v-show="isLoading">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>
<script>
//什么时候到达可视区中：waterfall的与元素的下边距 < 可视区的高度
import { throttle } from "throttle-debounce";
export default {
  name: "Waterfall",
  data() {
    return {
      isLoading: false,
    };
  },
  mounted() {
    //优化,每隔一段时间再去执行函数，不用频繁触发
    this.scrollHandle = throttle(300, this.scroll.bind(this));
    window.addEventListener("scroll", this.scrollHandle);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollHandle);
  },
  methods: {
    scroll() {
      if (this.isLoading) return;
      if (
        this.$refs.waterfall.getBoundingClientRect().bottom <
        document.documentElement.clientHeight
      ) {
        this.isLoading = true;
        // console.log("已到达可视区");
        this.$emit("view");
      }
    },
  },
};
</script>
<style lang="stylus">
.waterfall-loading {
  width: 100%;
  height: 20px;
  text-align: center;
}
</style>