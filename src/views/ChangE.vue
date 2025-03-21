<template>
  <div class="container">
    <!-- 头部区域 -->
  <header class="header">
    <div class="title-container">
      <h1 class="title">{{ state.type }}</h1>
    </div>
    <div class="rule-container">
      <button class="rule-btn" @click="navigateToRules">规则说明</button>
    </div>
  </header>

    <!-- 印章进度 -->
    <div class="progress-container">
      <div class="progress-text">当前印章</div>
      <div class="progress-bars">
        <div 
          v-for="n in 4" 
          :key="n"
          :class="['progress-bar', { active: state.yinzhang >= n }]"
        ></div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="control-group">
      <button
        v-for="times in [1, 10]"
        :key="times"
        class="btn pray-btn"
        :disabled="state.batchProcessing"
        @click="handlePray(times)"
      >
        祈愿{{ times }}次
      </button>
    </div>

    <!-- 统计信息 -->
    <div class="stats">
      <span>消耗点券：{{ state.totalDianquan }}</span>
      <span>获得代币：{{ state.totalCoin }}</span>
    </div>

    <!-- 卡片墙 -->
<div class="card-wall">
    <transition-group name="card-list" tag="div" class="card-row-container">
      <!-- 将卡片数据按每3个分组 -->
      <div 
        v-for="(group, groupIndex) in chunkArray(state.cardResults, 3)" 
        :key="groupIndex"
        class="card-row"
      >
        <div 
          v-for="(card, index) in group"
          :key="card.id"
          class="card-container"
          :class="{ show: card.show }"
        >
          <div
            :class="['card', {
              flipped: card.flipped,
              special: card.special
            }]"
            @click="flipCard(card)"
          >
            <div class="card-face front">❓</div>
            <div class="card-face back">
              <span class="prize-name">{{ card.result }}</span>
              <span class="prize-num">×{{ card.num > 0 ? card.num : 1 }}</span>
            </div>
          </div>
          <div v-if="card.isSpecial" class="special-tag">SP</div>
        </div>
        <!-- 补充空容器保持布局 -->
        <div 
          v-for="n in 3 - group.length"
          :key="'empty-' + n"
          class="card-container empty-container"
        ></div>
      </div>
    </transition-group>
  </div>

    <!-- 特殊奖励弹窗 -->
    <teleport to="body">
      <div v-if="state.showSpecialModal" class="modal-mask">
        <div class="special-modal">
          <div class="modal-header">获得特殊抽奖机会</div>
          <button class="modal-btn" @click="closeSpecialModal">确认</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 奖品配置（保持不变）
const ChangEPrize = {
  CHANG_E_PRIZE: { num: 1, description: "嫦娥-器灵·落星盏_直出", probability: 0.002, flag: false },
  JI_FEN_QUAN_PRIZE: { num: 1, description: "积分夺宝抵用券", probability: 0.08, flag: false },
  PI_FU_SUI_PIAN_PRIZE: { num: 6, description: "皮肤碎片", probability: 0.08, flag: false },
  CHUN_YUE_JING_LI_PRIZE: { num: 2, description: "亲密度道具春江跃鲤", probability: 0.1, flag: false },
  BING_NI_HUAN_MENG: { num: 2, description: "亲密度道具冰霓幻梦", probability: 0.1, flag: false },
  EXCHANGE_CURRENCY_6: { num: 6, description: "灵兔兑换币", probability: 0.368, flag: true },
  EXCHANGE_CURRENCY_16: { num: 16, description: "灵兔兑换币", probability: 0.19, flag: true },
  EXCHANGE_CURRENCY_26: { num: 26, description: "灵兔兑换币", probability: 0.075, flag: true },
  EXCHANGE_CURRENCY_66: { num: 66, description: "灵兔兑换币", probability: 0.005, flag: true },
}

const ChangESpecialPrize = {
  EXCHANGE_CURRENCY_28: { num: 28, description: "灵兔兑换币", probability: 0.32 },
  EXCHANGE_CURRENCY_48: { num: 48, description: "灵兔兑换币", probability: 0.30 },
  EXCHANGE_CURRENCY_88: { num: 88, description: "灵兔兑换币", probability: 0.34 },
  EXCHANGE_CURRENCY_168: { num: 168, description: "灵兔兑换币", probability: 0.035 },
  CHANG_E_PRIZE: { num: 1, description: "嫦娥-器灵·落星盏", probability: 0.005 },
}

// 响应式状态
const state = reactive({
  type: "器灵嫦娥祈愿",
  totalDianquan: 0,
  totalCoin: 0,
  yinzhang: 0,
  totalDraws: 0,
  guaranteeCounter: 0,
  cardResults: [],
  nextCardId: 1,
  batchProcessing: false,
  showSpecialModal: false,
  specialPrizeInfo: null,
  isFirstSpecial: true
})

// 添加数据分组方法
const chunkArray = (arr, size) => {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}
// 导航到规则页面
const navigateToRules = () => {
  router.push('/changErule')
}

// 处理祈愿操作
const handlePray = (times) => {
  if (state.batchProcessing) return
  
  const cost = times * 60
  state.cardResults.push(...generateCardPlaceholders(times))
  state.nextCardId += times
  state.totalDianquan += cost
  state.batchProcessing = true
  
  setTimeout(() => processBatchLottery(times), 500)
}

// 生成占位卡片
const generateCardPlaceholders = (times) => {
  return Array.from({ length: times }, (_, i) => ({
    id: state.nextCardId + i,
    show: false,
    flipped: false,
    special: false,
    result: null,
    num: 0,
    isSpecial: false,
    counted: false
  }))
}

// 批量处理抽奖
const processBatchLottery = async (times) => {
  let processed = 0
  let currentIndex = state.cardResults.length - times

  while (processed < times) {
    // 执行普通抽奖
    const normalPrize = commonLottery()
    state.cardResults[currentIndex] = createCardData(normalPrize)
    currentIndex++
    processed++

    // 保底逻辑处理
    const isGuaranteeTrigger = processGuaranteeCounter()

    // 印章逻辑
    if (!isGuaranteeTrigger) {
      const yinzhangAdded = tryAddYinzhang()
      if (yinzhangAdded && state.yinzhang === 4) {
        state.cardResults.splice(currentIndex, 0, createSpecialCardData(triggerSpecialLottery()))
        currentIndex++
      }
    }

    // 保底触发
    if (isGuaranteeTrigger) {
      state.cardResults.splice(currentIndex, 0, createSpecialCardData(triggerGuaranteedSpecial()))
      currentIndex++
    }

    state.totalDraws++
    await nextTick() // 确保DOM更新
  }

  state.batchProcessing = false
}

// 保底计数器处理
const processGuaranteeCounter = () => {
  let needTrigger = false
  
  if (state.isFirstSpecial) {
    if (state.guaranteeCounter === 9) {
      needTrigger = true
      state.yinzhang = 4
      state.guaranteeCounter = 0
    } else {
      state.guaranteeCounter++
    }
  } else {
    if (state.guaranteeCounter === 9) {
      needTrigger = true
      state.guaranteeCounter = 0
    } else {
      state.guaranteeCounter++
    }
  }

  return needTrigger
}

// 尝试增加印章
const tryAddYinzhang = () => {
  if (state.yinzhang >= 4) return false
  
  const successRates = [0.5, 0.3, 0.15, 0.05]
  const currentStep = state.yinzhang
  
  if (Math.random() < successRates[currentStep]) {
    state.yinzhang++
    return true
  }
  return false
}

// 创建普通卡片数据
const createCardData = (prize) => ({
  id: Date.now() + Math.random(),
  show: true,
  flipped: false,
  special: false,
  result: prize.description,
  isExchangeCoin: prize.description.includes("灵兔兑换币"),
  num: prize.num || 1,
  isSpecial: false,
  counted: false
})

// 创建特殊卡片数据
const createSpecialCardData = (prize) => ({
  id: Date.now() + Math.random(),
  show: true,
  flipped: false,
  special: true,
  result: prize.description,
  num: prize.num,
  isSpecial: true,
  counted: false
})

// 显示特殊奖励弹窗
const showSpecialResult = (prize) => {
  state.showSpecialModal = true
  state.specialPrizeInfo = {
    name: prize.description,
    num: prize.num,
    isGuaranteed: prize.probability === 0.005
  }
}

// 触发特殊抽奖
const triggerSpecialLottery = () => {
  const specialPrize = specialLottery()
  showSpecialResult(specialPrize)
  state.yinzhang = 0
  state.guaranteeCounter = 0
  state.isFirstSpecial = false
  return specialPrize
}

// 保底触发特殊抽奖
const triggerGuaranteedSpecial = () => {
  const specialPrize = specialLottery()
  showSpecialResult(specialPrize)
  state.yinzhang = 0
  state.guaranteeCounter = 0
  state.isFirstSpecial = false
  return specialPrize
}

// 翻转卡片
const flipCard = (card) => {
  if (card.counted) return

  const index = state.cardResults.findIndex(c => c.id === card.id)
  if (index === -1) return

  if (card.num > 0 && card.result.includes("灵兔兑换币")) {
    state.totalCoin += card.num
  }
  
  state.cardResults[index] = {
    ...card,
    flipped: true,
    counted: true
  }
}

// 随机选择奖品
const randomSelect = (prizes) => {
  const scaled = prizes.filter(p => p.probability > 0)
    .map(p => ({ ...p, scaled: Math.round(p.probability * 100000) }))
  
  const total = scaled.reduce((sum, p) => sum + p.scaled, 0)
  let random = Math.floor(Math.random() * total)
  
  for (const p of scaled) {
    if (random < p.scaled) return p
    random -= p.scaled
  }
  return scaled[scaled.length - 1]
}

// 普通抽奖
const commonLottery = () => randomSelect(Object.values(ChangEPrize))

// 特殊抽奖
const specialLottery = () => randomSelect(Object.values(ChangESpecialPrize))

// 关闭弹窗
const closeSpecialModal = () => {
  state.showSpecialModal = false
}
</script>

<style scoped>
/* 容器样式 */
.container {
  padding: 2.67vw;
  background: #2c2340;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 头部样式 */
.header {
  display: block; /* 改为块级布局 */
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  border-radius: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.2);
}
.title-container {
  margin-bottom: 1.5rem; /* 增加下边距 */
  text-align: center; /* 标题居中 */
}
.rule-container {
  text-align: right; /* 按钮右对齐 */
}
.title {
  color: #ffd700;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
}


/* 规则按钮 */
.rule-btn {
  background: linear-gradient(45deg, #a0a0ff, #8080ff);
  color: white;
  font-size: 1rem;
  padding: 0.8rem 1.6rem;
  border: none;
  border-radius: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 1rem rgba(160,160,255,0.3);
}
.rule-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 1.5rem rgba(160,160,255,0.5);
}

.rule-btn:active {
  background: rgba(160,160,255,0.1);
  transform: scale(0.95);
}

/* 印章进度 */
.progress-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 1.2rem;
  margin-bottom: 2rem;
}
.progress-text {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 500;
}

.progress-bars {
  display: flex;
  gap: 0.8rem;
  flex-wrap: nowrap;
}

.progress-bar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #4a4a66;
  border: 0.2rem solid #666;
  transition: all 0.3s ease;
}

.progress-bar.active {
  background: linear-gradient(45deg, #ff9f43, #ff6b6b);
  border-color: #ff6b6b;
  box-shadow: 0 0 0.8rem rgba(255, 159, 107, 0.4);
}
/* 印章系统 */
.yinzhang-box {
  display: flex;
  align-items: center;
  margin-bottom: 4vw;
}

.yinzhang-icons {
  display: flex;
  gap: 1.07vw;
}

.yinzhang {
  width: 4.27vw;
  height: 4.27vw;
  border-radius: 50%;
  background: #666;
  border: 0.27vw solid #999;
  transition: all 0.3s;
}

.yinzhang.active {
  background: #ff9f43;
  border-color: #ff6b6b;
  box-shadow: 0 0 1.33vw #ff9f43;
}

/* 操作按钮组 */
.control-group {
  display: flex;
  gap: 4vw;
  justify-content: center;
  margin: 5.33vw 0;
}

.pray-btn {
  background: linear-gradient(45deg, #ff6b6b, #ff9f43);
  color: white;
  font-size: 4.27vw;
  padding: 2.67vw 6.67vw;
  border-radius: 6.67vw;
  border: none;
  box-shadow: 0 0.53vw 1.6vw rgba(255, 107, 107, 0.4);
  transition: transform 0.2s;
}

.pray-btn:active {
  transform: scale(0.95);
}

/* 统计信息 */
.stats {
  display: flex;
  justify-content: space-around;
  color: #fff;
  margin-bottom: 4vw;
  font-size: 3.73vw;
}

/* 卡片墙 */
.card-wall {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}
.card-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* 卡片容器 */
.card-container {
  width: calc((100% - 40px) / 3); /* 三列布局 */
  position: relative;
  perspective: 1000px;
}

.card {
  width: 100%;
  height: 0;
  padding-bottom: 140%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  cursor: pointer;
  background: rgba(255,255,255,0.1); /* 占位背景 */
}
/* 空容器样式 */
.empty-container {
  visibility: hidden; /* 隐藏空容器但保持布局 */
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2.13vw;
  padding: 2.67vw;
}

.front {
  background: linear-gradient(135deg, #d400ff, #0051ff);
  color: #6f00ff;
  border: 0.53vw solid #ffe600;
  font-size: 6.4vw;
}

.back {
  background: linear-gradient(45deg, #4a3566, #2c2340);
  color: #ffff7f;
  transform: rotateY(180deg);
  /* 新增高级文字效果 */
  padding: 1.5rem;
}
.prize-name {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: linear-gradient(to right, #ffd700 20%, #ffffff 60%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
  margin-bottom: 0.8rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.prize-name::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 2px;
  background: linear-gradient(to right, transparent, #ffd700, transparent);
}

.prize-num {
  font-family: 'Avenir Next', sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  color: #ffffff;
  text-shadow: 
    0 0 10px rgba(255, 215, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  display: inline-block;
  padding: 0.2rem 0.8rem;
  background: linear-gradient(45deg, 
    rgba(255, 215, 0, 0.1) 0%, 
    rgba(255, 215, 0, 0.2) 50%, 
    rgba(255, 215, 0, 0.1) 100%);
  border-radius: 4px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.special .back {
  background: linear-gradient(45deg, #ff6b6b, #ff9f43);
}

/* 特殊标签 */
.special-tag {
  position: absolute;
  top: -1.33vw;
  right: -1.33vw;
  background: #ff4757;
  color: white;
  font-size: 2.67vw;
  padding: 0.53vw 1.6vw;
  border-radius: 2.67vw;
  transform: rotate(15deg);
  z-index: 2;
}

/* 弹窗样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.special-modal {
  background: #1f193b;
  width: 80%;
  border-radius: 4.27vw;
  padding: 8vw 5.33vw;
  text-align: center;
  position: relative;
}

.modal-header {
  font-size: 6.4vw;
  color: #ff6b6b;
  margin-bottom: 4vw;
}

.modal-btn {
  background: #4a3566;
  color: white;
  border: none;
  padding: 2.67vw 8vw;
  border-radius: 6.67vw;
  margin-top: 5.33vw;
}

/* 过渡动画 */
.card-list-move {
  transition: transform 0.5s ease;
}
/* 响应式布局 */
@media (min-width: 768px) {
  .card-wall {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (min-width: 1024px) {
  .card-wall {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}
@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }
  
  .rule-btn {
    width: 100%;
    text-align: center;
    margin-top: 1rem;
  }
  
  .rule-container {
    text-align: center;
  }
}
</style>