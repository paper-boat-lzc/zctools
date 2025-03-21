<template>
  <div class="rule-container">
    <!-- 标题区域 -->
    <div class="header">
      <h1 class="title">规则说明</h1>
      <div class="decorative-line"></div>
    </div>

    <!-- 规则内容 -->
    <div class="content-wrapper">
      <div class="rule-card">
        <!-- 规则区块 -->
        <section 
          v-for="(section, index) in ruleSections" 
          :key="index"
          class="rule-section"
        >
          <h2 class="section-title">
            <span class="icon">✦</span>
            {{ section.title }}
          </h2>
          <ul class="rule-list">
            <li 
              v-for="(item, idx) in section.items"
              :key="idx"
              class="rule-item"
            >
              <span class="highlight">{{ item.label }}</span>
              <span class="probability">{{ item.value }}</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 规则数据结构
const ruleSections = reactive([
  {
    title: '基本规则',
    items: [
      { label: '抽奖类型', value: '分为祈愿池和特殊抽奖' }
    ]
  },
  {
    title: '祈愿池概率',
    items: [
      { label: '嫦娥-器灵·落星盏', value: '0.2%' },
      { label: '积分夺宝抵用券×1', value: '8%' },
      { label: '皮肤碎片×6', value: '8%' },
      { label: '亲密度道具春江跃鲤×2', value: '10%' },
      { label: '亲密度道具冰霓幻梦×2', value: '10%' },
      { label: '灵兔兑换币×6', value: '36.8%' },
      { label: '灵兔兑换币×16', value: '19%' },
      { label: '灵兔兑换币×26', value: '7.5%' },
      { label: '灵兔兑换币×66', value: '0.5%' }
    ]
  },
  {
    title: '特殊抽奖规则',
    items: [
      { label: '触发条件', value: '集齐4个灵兔印章' },
      { label: '奖励内容', value: '大量兑换币/随机皮肤二选一' },
      { label: '重复处理', value: '已拥有皮肤自动转换兑换币' }
    ]
  },
  {
    title: '特殊抽奖概率',
    items: [
      { label: '伴生皮肤/兑换币×28', value: '32%' },
      { label: '勇者皮肤/兑换币×48', value: '30%' },
      { label: '史诗皮肤/兑换币×88', value: '34%' },
      { label: '传说皮肤/兑换币×168', value: '3.5%' },
      { label: '器灵嫦娥传说皮肤/兑换币×198', value: '0.5%' }
    ]
  },
  {
    title: '印章获取概率',
    items: [
      { label: '第一枚印章', value: '100%' },
      { label: '第二枚印章', value: '50%' },
      { label: '第三枚印章', value: '25%' },
      { label: '第四枚印章', value: '10%' }
    ]
  },
  {
    title: '其他规则',
    items: [
      { label: '抽奖消耗', value: '首次10点券，后续60点券/次' },
      { label: '每日登录奖励', value: '最多可获得34兑换币' },
      { label: '皮肤兑换标准', value: '嫦娥皮肤：498币 | 赵怀真皮肤：138币' }
    ]
  }
])

// 返回逻辑
const goBack = () => {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.rule-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c1e3d, #1a1629);
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  .title {
    color: #ffd700;
    font-size: 2.2rem;
    font-weight: 600;
    letter-spacing: 0.1rem;
    text-shadow: 0 0 1rem rgba(255, 215, 0, 0.3);
  }

  .decorative-line {
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ffd700, transparent);
    margin: 1rem auto;
  }
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.rule-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
}

.rule-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.07);
  }

  .section-title {
    color: #a0a0ff;
    font-size: 1.4rem;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;

    .icon {
      color: #ff6b6b;
      font-size: 1.2em;
    }
  }
}

.rule-list {
  list-style: none;
  padding-left: 0;
}

.rule-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0.6rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 53, 102, 0.4);
  }

  .highlight {
    color: #fff;
    font-weight: 500;
  }

  .probability {
    color: #ff9f43;
    font-weight: 600;
    min-width: 5rem;
    text-align: right;
  }
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  padding: 1.2rem;
  margin-top: 2rem;
  background: linear-gradient(45deg, #4a3566, #332a4c);
  border: none;
  border-radius: 1rem;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 1.5rem rgba(74, 53, 102, 0.5);
    
    .btn-icon {
      transform: translateX(-5px);
    }
  }

  .btn-text {
    font-weight: 500;
	color: #ffffff;
  }

  .btn-icon {
    transition: transform 0.3s ease;
  }
}

@media (max-width: 768px) {
  .rule-container {
    padding: 1rem;
  }

  .rule-card {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .rule-item {
    flex-direction: column;
    gap: 0.5rem;

    .probability {
      text-align: left;
    }
  }
}
</style>