<template>
  <div class="container">
    <!-- 轮播图区域 -->
    <section class="swiper-section">
      <div class="image-scroll" ref="scrollContainer" @scroll.passive="handleScroll">
        <div class="scroll-inner">
          <div 
            v-for="(item, index) in imgUrls" 
            :key="index"
            class="swiper-item"
          >
            <img :src="item" class="swiper-image" />
          </div>
        </div>
      </div>
      
      <!-- 指示器 -->
      <div class="modern-indicator">
        <div 
          v-for="(_, index) in imgUrls"
          :key="index"
          class="indicator-dot"
          :class="{ active: index === current }"
        />
      </div>
    </section>

    <!-- 功能区域 -->
    <main class="function-container">
      <div class="function-grid">
        <div 
          v-for="(item, index) in functions"
          :key="index"
          class="function-card"
          @click="handleNavigation(item.path)"
        >
          <div class="card-aura"></div>
          <div class="icon-wrapper">
            <div class="texture-layer"></div>
            <div :class="`${item.icon}-icon`"></div>
          </div>
          <span class="function-title">{{ item.title }}</span>
        </div>
      </div>
    </main>

    <!-- 背景特效 -->
    <div class="cosmic-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 路由实例
const router = useRouter()

// 响应式数据
const imgUrls = ref([
  new URL('../assets/images/001.png', import.meta.url).href // 根据实际路径调整
])
const current = ref(0)
const itemWidth = 686 + 24 // 原始设计尺寸需要转换

// 功能列表
const functions = [
  { title: '嫦娥祈愿', icon: 'gun', path: '/changE' },
  { title: '重复名生成', icon: 'name', path: '/nickname' },
  { title: '命运左轮', icon: 'gun', path: '/gun' },
  { title: '关于小程序', icon: 'info', path: '/about' }
]

// 处理滚动事件
const handleScroll = (e) => {
  const scrollLeft = e.target.scrollLeft
  current.value = Math.round(scrollLeft / itemWidth)
}

// 处理导航跳转
const handleNavigation = (path) => {
  router.push(path)
}

// 初始化滚动容器宽度
const scrollContainer = ref(null)
onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.style.width = `${686 * imgUrls.value.length + 24 * (imgUrls.value.length - 1)}rpx`
  }
})
</script>

<style scoped>
/* ===== 重置单位系统 ===== */
/* 使用 rem 单位 (1rem = 16px) 并添加响应式处理 */
html {
  font-size: 16px;
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

/* ===== 容器布局 ===== */
.container {
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

/* ===== 轮播图区域优化 ===== */
.swiper-section {
  height: 30vh; /* 视口高度比例 */
  min-height: 200px;
  margin: 1rem 0;
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.4);
}

.image-scroll {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  height: 100%;
}

.scroll-inner {
  display: flex;
  height: 100%;
  scroll-snap-align: start;
}

.swiper-item {
  flex: 0 0 100%;
  scroll-snap-align: center;
  padding: 0 0.5rem;
}

.swiper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
  transition: transform 0.3s ease;
}

/* ===== 指示器优化 ===== */
.modern-indicator {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.indicator-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  width: 1.5rem;
  background: #ff9f43;
  border-radius: 0.75rem;
}

/* ===== 功能区域重构 ===== */
.function-container {
  flex: 1;
  padding: 1rem;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.function-card {
  aspect-ratio: 1; /* 保持正方形 */
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.function-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.3);
}

/* ===== 图标系统优化 ===== */
.icon-wrapper {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  position: relative;
}

.texture-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-conic-gradient(
      from 0deg,
      transparent 0deg 18deg,
      rgba(255,255,255,0.05) 18deg 36deg
    );
    border-radius: 50%;
}

/* 图标尺寸适配 */
.name-icon,
.info-icon,
.gun-icon {
  width: 2.5rem;
  height: 2.5rem;
}
.name-icon {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNSAyIDIgNi41IDIgMTJzNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMFMxNy41IDIgMTIgMm0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHptLTQtMTIuMzFMMTQuNjkgOCAxMiAxMC42OSA5LjMxIDggOCA5LjMxIDEwLjY5IDEyIDggMTQuNjkgOS4zMSAxNiAxMiAxMy4zMSAxNC42OSAxNiAxNiAxNC42OSAxMy4zMSAxMiAxNiA5LjMxeiIvPjwvc3ZnPg==");
}

.info-icon {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMyA5aC0yVjdoMnYybTAgMTBoLTJ2LTZoMnY2bS0xLTlBMTAgMTAgMCAwMDIgMTJhMTAgMTAgMCAwMDEwIDEwIDEwIDEwIDAgMDAxMC0xMEExMCAxMCAwIDAwMTIgMnoiLz48L3N2Zz4=");
}

.gun-icon {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMCAyaC0ydjNoMnYtM20tNCAwaC0ydjNoMnYtM20tNCAwaC0ydjNoMnYtM005IDJIN3YzaDJWMm0tMyAwaC0ydjNoMnYtMm0xNSA3aC0ydjNoLTN2MmgzdjNoMnYtM2gzdi0yaC0zVjloM3YtMmgtM3YzaC0yeiIvPjwvc3ZnPg==");
}

/* ===== 文字排版优化 ===== */
.function-title {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.9);
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* ===== 背景特效优化 ===== */
.cosmic-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 70% 20%, rgba(74,0,224,0.1) 0%, transparent 40%),
      repeating-linear-gradient(
        45deg,
        transparent 0px,
        transparent 2px,
        rgba(255,255,255,0.02) 2px,
        rgba(255,255,255,0.02) 4px
      );
    z-index: -1;
}
@keyframes light-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== 移动端优化 ===== */
@media (max-width: 480px) {
  .function-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .function-card {
    padding: 1rem;
  }
  
  .icon-wrapper {
    width: 3rem;
    height: 3rem;
  }
  
  .function-title {
    font-size: 0.9rem;
  }
}
</style>