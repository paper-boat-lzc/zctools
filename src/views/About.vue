<!-- src/views/About.vue -->
<template>
  <div class="container">
    <!-- 背景粒子 -->
    <div class="particle"></div>
    <div class="particle particle-2"></div>
    
    <!-- 内容卡片 -->
    <div class="about-card">
      <div class="section-header">
        <h1 class="section-title">关于小程序</h1>
        <div class="divider"></div>
      </div>
      
      <div class="content-box">
        <div class="content-item">
          <div class="icon-dot"></div>
          <p class="content-text">欢迎使用纸船模拟器！</p>
        </div>
        
        <div class="content-item">
          <div class="icon-dot"></div>
          <p class="content-text">
			  由于微信的原因，微信小程序上线进度一直僵持，因此开发一个静态网页作为暂时过渡
            本程序所有模拟功能均基于概率算法实现，结果仅供娱乐参考。
            开发者只是个大学生，若发现星轨运行异常，请包容宇宙尘埃的扰动。
          </p>
        </div>

        <div class="content-separator"></div>

        <div class="content-item">
          <div class="icon-warning"></div>
          <pre class="content-text">漫游指南：
通过微信公众号「纸船PaperBoat」提交异常星图报告，
您的反馈将帮助完善这片数字宇宙</pre>
        </div>
      </div>

      <button class="starry-button" @click="goBack">
        <span class="button-text">返回主星域</span>
        <div class="starry-effect"></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1) // 使用路由返回
}
</script>

<style scoped>
/* 容器布局 */
.container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(45deg, #1a1a2e, #2a0845);
  padding: 1rem 0.75rem 0;
}

/* 粒子效果 */
.particle {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: particle-float 10s infinite linear;
}

.particle-2 {
  animation-delay: -5s;
  opacity: 0.6;
}

/* 内容卡片 */
.about-card {
  background: rgba(30, 30, 50, 0.9);
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 1.6rem;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 0 2rem rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
}

/* 标题样式 */
.section-title {
  font-size: 2.8rem;
  background: linear-gradient(45deg, #7ae7ff, #1f83ee);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 0.2rem 1rem rgba(122,231,255,0.3);
  text-align: center;
}

/* 分割线 */
.divider {
  width: 12rem;
  height: 2px;
  background: linear-gradient(90deg, transparent, #1f83ee, transparent);
  margin: 1.5rem auto;
}

/* 内容区域 */
.content-box {
  padding: 1rem 0;
}

.content-item {
  display: flex;
  align-items: flex-start;
  margin: 2rem 0;
}

.icon-dot {
  flex-shrink: 0;
  width: 0.8rem;
  height: 0.8rem;
  background: #1f83ee;
  border-radius: 50%;
  margin: 0.5rem 1rem 0 0;
}

.icon-warning {
  width: 1.6rem;
  height: 1.6rem;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%231f83ee'%3E%3Cpath d='M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4h-2m0 6v2h2v-2h-2z'/%3E%3C/svg%3E");
  margin: 0.3rem 1rem 0 0;
}

.content-text {
  color: rgba(255,255,255,0.9);
  font-size: 1.4rem;
  line-height: 1.8;
  white-space: pre-wrap;
}

.content-separator {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(31,131,238,0.3), transparent);
  margin: 2.5rem 0;
}

/* 返回按钮 */
.starry-button {
  position: relative;
  background: linear-gradient(45deg, #1f83ee, #154c7e);
  padding: 1.2rem 2.4rem;
  border: none;
  border-radius: 999px;
  display: block;
  margin: 3rem auto 0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.starry-button:hover {
  transform: translateY(-2px);
}

.button-text {
  color: #fff;
  font-size: 1.6rem;
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
}

.starry-effect {
  position: absolute;
  inset: -100%;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  animation: starry-rotate 4s linear infinite;
  opacity: 0.6;
}

/* 动画定义 */
@keyframes particle-float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5%) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
}

@keyframes starry-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .about-card {
    padding: 1.5rem;
    border-radius: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .content-text {
    font-size: 1.2rem;
  }
  
  .starry-button {
    padding: 1rem 2rem;
  }
  
  .button-text {
    font-size: 1.4rem;
  }
}
</style>