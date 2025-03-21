<!-- src/views/Gun.vue -->
<template>
  <div class="container" :class="bgColor">
    <!-- 初始界面 -->
    <div class="setup-view" v-if="!isLoaded">
      <select class="bullet-select" v-model="selectedBullets">
        <option v-for="n in 6" :value="n" :key="n">{{ n }} 发</option>
      </select>
      <button class="load-btn" @click="loadGun">填 入</button>
    </div>

    <!-- 开枪界面 -->
    <div class="shoot-view" v-else>
      <div class="status-text">{{ statusText }}</div>
      <button 
        class="shoot-btn" 
        @click="shoot"
        :disabled="isShooting"
      >
        <span class="btn-text">{{ isShooting ? '进行中...' : '开' }}</span>
      </button>
      <div class="bullet-counter">剩余机会：{{ remainingBullets }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification' // 需要安装 toast 插件

const toast = useToast()

// 响应式状态
const isLoaded = ref(false)
const isShooting = ref(false)
const selectedBullets = ref(6)
const realBulletIndex = ref(-1)
const remainingBullets = ref(0)
const bgColor = ref('')
const statusText = ref('')

// 装弹逻辑
const loadGun = () => {
  const bulletCount = selectedBullets.value
  realBulletIndex.value = Math.floor(Math.random() * bulletCount)
  isLoaded.value = true
  remainingBullets.value = bulletCount
  bgColor.value = 'loaded'
  isShooting.value = false
}

// 开枪逻辑
const shoot = async () => {
  if (isShooting.value) return
  isShooting.value = true
  
  // 模拟射击延迟
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const currentIndex = selectedBullets.value - remainingBullets.value
  const isReal = currentIndex === realBulletIndex.value
  
  showResult(isReal)
  
  if (isReal) {
    handleRealBullet()
  } else {
    handleFakeBullet()
  }
}

// 结果显示
const showResult = (isReal) => {
  bgColor.value = isReal ? 'real' : 'fake'
  statusText.value = isReal ? '⚠️危险⚠️' : '安 全'
}

// 处理实弹
const handleRealBullet = () => {
  setTimeout(() => {
    resetGame()
    toast.warning('游戏结束', { timeout: 2000 })
  }, 2000)
}

// 处理空包弹
const handleFakeBullet = () => {
  remainingBullets.value--
  
  setTimeout(() => {
    bgColor.value = 'loaded'
    statusText.value = ''
    isShooting.value = false
  }, 1500)
}

// 重置游戏
const resetGame = () => {
  isLoaded.value = false
  bgColor.value = ''
  statusText.value = ''
  realBulletIndex.value = -1
  remainingBullets.value = 0
  isShooting.value = false
}
</script>

<style scoped>
/* 容器布局 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background 0.5s ease;
}

/* 背景状态 */
.container { background: #7b2cbf; } /* 默认背景 */
.container.loaded { background: #5a189a; }
.container.fake { background: #2d6a4f; }
.container.real { background: #d00000; }

/* 初始界面样式 */
.setup-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.bullet-select {
  width: 200px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 2rem;
  text-align: center;
  font-size: 1.2rem;
  appearance: none;
}

.load-btn {
  width: 100%;
  padding: 1.2rem;
  font-size: 1.1rem;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.load-btn:active {
  transform: scale(0.95);
}

/* 射击界面样式 */
.shoot-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.status-text {
  color: rgba(255,255,255,0.9);
  font-size: 3rem;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  animation: fadeIn 0.5s;
}

.shoot-btn {
  width: 160px;
  height: 160px;
  background: rgba(255,255,255,0.15);
  border: 4px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.shoot-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.shoot-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.bullet-counter {
  position: absolute;
  bottom: 4rem;
  color: rgba(255,255,255,0.8);
  font-size: 1.2rem;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 移动端适配 */
@media (max-width: 480px) {
  .title {
    font-size: 1.5rem;
  }

  .bullet-select {
    width: 150px;
    padding: 0.8rem;
  }

  .load-btn {
    padding: 0.8rem 1.5rem;
  }

  .status-text {
    font-size: 2rem;
  }

  .shoot-btn {
    width: 120px;
    height: 120px;
    font-size: 1.5rem;
  }
}
</style>