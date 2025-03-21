<template>
  <nav  class="navbar">
    <button v-if="showNavbar" class="back-btn" @click="handleBack">
      <svg class="back-icon" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
      <span>返回</span>
    </button>
    <h1 class="title">{{ pageTitle }}</h1>
  </nav>
  
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    // 根据路由判断是否显示导航栏
    const showNavbar = computed(() => route.name !== 'Index')

    // 页面标题
    const pageTitle = ref('')
    watch(() => route.meta.title, (newVal) => {
      pageTitle.value = newVal || '纸船王者工具'
    })

    // 返回逻辑
    const handleBack = () => {
      if (window.history.state.back) {
        router.go(-1)
      } else {
        router.push('/')
      }
    }

    return {
      showNavbar,
      pageTitle,
      handleBack
    }
  }
}
</script>

<style>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(145deg, #303050, #262646);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.9);
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255,255,255,0.1);
  transform: translateX(-3px);
}

.back-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.title {
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

@media (max-width: 480px) {
  .navbar {
    height: 50px;
    padding: 0 1rem;
  }
  
  .back-btn span {
    display: none;
  }
  
  .back-icon {
    width: 20px;
    height: 20px;
  }
  
  .title {
    font-size: 1rem;
  }
}
</style>