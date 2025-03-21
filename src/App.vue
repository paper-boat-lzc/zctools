<!-- src/App.vue -->
<template>
  <NavBar />
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  background-color: #eeeeee;
  color: #333;
  padding-top: 60px;
}

/* 导航条样式 */
.navbar {
  background-color: #ffffff;
  color: #333;
  padding: 22px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}
@media (max-width: 480px) {
  body {
    padding-top: 50px;
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 页面内容样式 */
#app {
  padding-top: 44px; /* 调整为导航条高度 */
}
</style>