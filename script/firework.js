const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

let rockets = [];
let fireworks = []; // 保存爆炸后的烟花
let dpr = Math.max(1, window.devicePixelRatio || 1);

// 调整画布尺寸，支持高分辨率
function resizeCanvas() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 每次重置缩放
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 配色（更接近真实烟花）
const COLORS = [
  '#FFD700', // 金色
  '#FF2D2D', // 大红
  '#FF6B6B', // 粉红
  '#FF1493', // 洋红
  '#FFA500', // 橙色
  '#FFE8A1', // 香槟金
  '#FFFFFF', // 纯白
  '#9D4EDD', // 紫罗兰
  '#4CC9F0', // 天蓝
  '#00C2FF', // 亮蓝
  '#2ECC71', // 翡翠绿
  '#A3F7B5', // 薄荷绿
  '#FFAC33', // 金橘
  '#FFB3C1', // 樱花粉
  '#F94144', // 喜庆红
  '#F8961E'  // 烟花橙
];

function rand(min, max) { return Math.random() * (max - min) + min; }
function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

class Particle {
  constructor(x, y, vx, vy, color, size = rand(1.2, 2.8)) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.alpha = 1;
    this.life = rand(0.8, 1.3); // 影响透明衰减速度
    this.friction = 0.985;
    this.gravity = 0.06; // 模拟向下重力
    this.spark = Math.random() < 0.25; // 闪烁
  }
  update() {
    this.vx *= this.friction;
    this.vy = this.vy * this.friction + this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    // 透明度随生命衰减
    this.alpha -= 0.015 * this.life;
  }
  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    // 闪烁的火花
    if (this.spark && Math.random() < 0.2) {
      ctx.globalAlpha = Math.max(0, this.alpha * 0.6);
      ctx.beginPath();
      ctx.arc(this.x + rand(-2, 2), this.y + rand(-2, 2), this.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

class Firework {
  constructor(x, y, particleCount = 120, pattern = 'burst') {
    this.particles = [];
    // 根据不同图案分布粒子
    const color = choice(COLORS);
    if (pattern === 'ring') {
      const baseSpeed = rand(3.2, 4.8);
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const vx = Math.cos(angle) * baseSpeed * rand(0.9, 1.1);
        const vy = Math.sin(angle) * baseSpeed * rand(0.9, 1.1);
        this.particles.push(new Particle(x, y, vx, vy, color));
      }
    } else if (pattern === 'star') {
      const points = Math.floor(rand(5, 8));
      const baseSpeed = rand(3.5, 5.0);
      for (let p = 0; p < points; p++) {
        const angle = (p / points) * Math.PI * 2;
        for (let k = 0; k < Math.floor(particleCount / points); k++) {
          const speed = baseSpeed * (k / (particleCount / points)) * rand(0.9, 1.2);
          const vx = Math.cos(angle) * speed + rand(-0.4, 0.4);
          const vy = Math.sin(angle) * speed + rand(-0.4, 0.4);
          this.particles.push(new Particle(x, y, vx, vy, color));
        }
      }
    } else {
      // 随机爆裂（更真实）
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(2.8, 5.2);
        const vx = Math.cos(angle) * speed * rand(0.8, 1.2);
        const vy = Math.sin(angle) * speed * rand(0.8, 1.2);
        this.particles.push(new Particle(x, y, vx, vy, choice(COLORS)));
      }
    }
  }
  update() {
    this.particles.forEach((p, i) => {
      p.update();
      if (p.alpha <= 0) this.particles.splice(i, 1);
    });
  }
  draw(ctx) { this.particles.forEach(p => p.draw(ctx)); }
}

class Rocket {
  constructor(x, targetY) {
    this.x = x;
    this.y = canvas.height / dpr; // 按 CSS 像素坐标
    this.vx = rand(-0.35, 0.35); // 轻微摆动
    this.vy = -rand(6.0, 7.5); // 初始向上速度
    this.targetY = Math.max(60, targetY || rand(canvas.height / dpr * 0.18, canvas.height / dpr * 0.45));
    this.friction = 0.995;
    this.gravity = 0.04; // 火箭阶段重力稍弱
    this.trail = [];
    this.exploded = false;
    this.color = choice(COLORS);
  }
  update() {
    this.vx *= this.friction;
    this.vy = this.vy * this.friction + this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    // 记录轨迹点
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 12) this.trail.shift();
    // 到达目标或即将下落时爆炸
    if (!this.exploded && (this.y <= this.targetY || this.vy >= -0.2)) {
      this.explode();
    }
  }
  explode() {
    this.exploded = true;
    const patterns = ['burst', 'ring', 'star'];
    const pattern = choice(patterns);
    const count = pattern === 'star' ? rand(140, 180) : rand(120, 160);
    fireworks.push(new Firework(this.x, this.y, Math.floor(count), pattern));
  }
  draw(ctx) {
    // 画火箭头
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 画尾焰（梯度）
    for (let i = 1; i < this.trail.length; i++) {
      const p1 = this.trail[i - 1];
      const p2 = this.trail[i];
      const alpha = i / this.trail.length;
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = alpha * 0.6;
      ctx.lineWidth = 2 - (i / this.trail.length) * 1.6;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

// 公共触发函数：发射 count 个火箭到屏幕随机高度
window.triggerFireworks = function(count = 5) {
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w;
    const targetY = rand(h * 0.18, h * 0.5);
    setTimeout(() => { rockets.push(new Rocket(x, targetY)); }, i * 180);
  }
};

function animate() {
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  // 清屏
  ctx.clearRect(0, 0, w, h);
  // 更真实的叠加模式（光晕）
  ctx.globalCompositeOperation = 'lighter';

  // 更新与绘制
  rockets.forEach((r, i) => {
    r.update();
    r.draw(ctx);
    if (r.exploded) rockets.splice(i, 1);
  });

  fireworks.forEach((f, i) => {
    f.update();
    f.draw(ctx);
    if (f.particles.length === 0) fireworks.splice(i, 1);
  });

  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(animate);
}

// 点击发射：从底部发射，飞到点击位置后爆炸
document.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  rockets.push(new Rocket(x, y));
});

animate();