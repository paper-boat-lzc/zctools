<!-- src/views/Nickname.vue -->
<template>
  <div class="container">
	  
    <!-- 温馨提示 -->
    <div v-if="showTips" class="tip-card">
      <div class="tip-item">
        <div class="tip-icon">!</div>
        <span class="tip-text">复制到游戏测试效果，若提示重复可重新生成</span>
      </div>
      <div class="tip-item">
        <div class="tip-icon">!</div>
        <span class="tip-text">热门昵称可能无法避免重复，建议组合使用不同方案</span>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="input-section cosmic-card">
      <input
        v-model="inputText"
        class="nickname-input"
        placeholder="输入1-11个字符"
        maxlength="11"
        @input="onInput"
      />
      <button 
        class="generate-btn" 
        :class="{ active: inputValid }"
        @click="generateNames"
      >
        生成方案
      </button>
    </div>

    <!-- 结果展示 -->
    <div class="result-container">
      <template v-if="generatedNames.length > 0">
        <div 
          v-for="(item, index) in generatedNames"
          :key="index"
          class="result-card cosmic-card"
        >
          <span class="result-text">{{ item.value }}</span>
          <button class="copy-btn" @click="copyText(item.value)">
            <div class="copy-icon"></div>
          </button>
          <div class="hologram-effect"></div>
        </div>
      </template>
      <div v-else class="empty-tip">
        <span>输入内容后生成特殊昵称方案</span>
      </div>
    </div>

    <!-- 背景特效 -->
    <div class="cyber-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const spaceCharacters = [
  { code: '\u00A0', name: 'NoBreak' },
  { code: '\u2009', name: 'Thin' },
  { code: '\u202F', name: 'Narrow' },
  { code: '\uFEFF', name: 'ZeroWidth' }
]

// 响应式状态
const inputText = ref('')
const inputValid = ref(false)
const generatedNames = ref([])
const showTips = ref(true)

// 生命周期
onMounted(() => {
  showWelcomeModal()
})

// 事件处理
const onInput = () => {
  inputValid.value = inputText.value.length >= 1 && inputText.value.length <= 11
}

const generateNames = () => {
  if (!inputValid.value) {
    toast.warning('请输入1-11个字符')
    return
  }
  
  generatedNames.value = generateSpaceVariants()
  showTips.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 工具方法
const generateSpaceVariants = () => {
  const strategies = [
    { pos: 0, desc: '首部插入' },
    { pos: inputText.value.length, desc: '尾部插入' },
    { pos: Math.floor(inputText.value.length/2), desc: '中部插入' }
  ]

  return spaceCharacters.flatMap(space => 
    strategies.map(({ pos, desc }) => ({
      type: `${desc} ${space.name}×${calculateSpaceCount()}`,
      value: insertSpaces(inputText.value, pos, space.code)
    }))
  ).sort(() => Math.random() - 0.5)
}

const calculateSpaceCount = () => 
  inputText.value.length <= 8 ? 2 : 1

const insertSpaces = (text, pos, space) => 
  `${text.slice(0, pos)}${space.repeat(calculateSpaceCount())}${text.slice(pos)}`

// 复制功能
const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('已复制（含隐藏字符）')
    showTips.value = true
  } catch (err) {
    toast.error('复制失败，请手动选择复制')
  }
}

// 初始化弹窗
const showWelcomeModal = () => {
  toast.info(
    '1. 生成后请及时到游戏内测试\n2. 部分热门名称可能仍需多次尝试\n3. 建议组合使用不同符号方案',
    { timeout: 6000 }
  )
}
</script>

<style scoped>
/* 基础布局 */
.container {
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  padding: 2rem 1.5rem;
  position: relative;
  width: 100vw;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* 输入区域 */
.input-section {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  margin-bottom: 2.5rem;
  border-radius: 0.8rem;
}

.nickname-input {
  width: 100%;
  height: 3.5rem;
  background: rgba(0,0,0,0.3);
  border-radius: 0.8rem;
  padding: 0 1.5rem;
  color: white;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.generate-btn {
  width: 100%;
  height: 3.5rem;
  background: linear-gradient(145deg, #8e2de2 0%, #4a00e0 100%);
  border-radius: 0.8rem;
  color: rgba(255,255,255,0.7);
  transition: all 0.3s ease;
}

.generate-btn.active {
  color: white;
  box-shadow: 0 0.3rem 1.5rem rgba(142,45,226,0.4);
}

/* 结果展示 */
.result-container {
  display: grid;
  gap: 1.5rem;
}

.result-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.8rem;
  padding: 1.5rem;
  position: relative;
}

.result-text {
  color: white;
  font-size: 1.1rem;
  margin-right: 4rem;
}

.copy-btn {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(145deg, #00f2fe 0%, #4facfe 100%);
  border-radius: 50%;
  padding: 0.6rem;
}

.copy-icon {
  width: 100%;
  height: 100%;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z'/%3E%3C/svg%3E");
  background: white;
}

/* 提示样式 */
.tip-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(74,0,224,0.3);
  border-radius: 0.8rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.tip-item {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.tip-icon {
  width: 1.2rem;
  height: 1.2rem;
  background: #4a00e0;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-text {
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 空状态 */
.empty-tip {
  text-align: center;
  padding: 3rem;
  color: rgba(255,255,255,0.6);
  position: relative;
}

.empty-tip::before {
  content: "";
  position: absolute;
  inset: -200%;
  background: 
    radial-gradient(circle at 50% 50%, rgba(74,0,224,0.1) 0%, transparent 60%),
    repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 2px,
      rgba(255,255,255,0.02) 2px,
      rgba(255,255,255,0.02) 4px
    );
  animation: cosmic-rotate 40s linear infinite;
  z-index: -1;
}

/* 动画 */


/* 响应式设计 */
@media (max-width: 480px) {
  .container {
    padding: 1.5rem 1rem;
  }

  .input-section {
    padding: 1.5rem;
  }

  .nickname-input {
    height: 3rem;
    font-size: 1rem;
  }

  .result-text {
    font-size: 1rem;
  }
}
</style>