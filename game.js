// game.js: 修复后的飞机大战核心逻辑 (使用矩形绘制)

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: canvas.width / 2 - 16, // 调整初始位置使其居中
    y: canvas.height - 50,
    width: 32,
    height: 32,
    speed: 5,
    bullets: []
};

let enemies = [];
let score = 0;

// 用于跟踪当前按下的键，解决同时按键和持续移动问题
let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') keys.ArrowLeft = true;
    if (event.key === 'ArrowRight') keys.ArrowRight = true;
    if (event.key === ' ') keys.Space = true;
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowLeft') keys.ArrowLeft = false;
    if (event.key === 'ArrowRight') keys.ArrowRight = false;
    if (event.key === ' ') keys.Space = false;
});

// 添加一个简单的射击冷却机制，防止按住空格键时子弹发射过快
let lastShotTime = 0;
const shootCooldown = 200; // 200毫秒冷却

function shoot() {
    const now = Date.now();
    if (now - lastShotTime > shootCooldown) {
        player.bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            speed: 7
        });
        lastShotTime = now;
    }
}

function update() {
    // 根据按键状态更新玩家位置
    if (keys.ArrowLeft) player.x -= player.speed;
    if (keys.ArrowRight) player.x += player.speed;
    if (keys.Space) shoot(); // 如果按住空格，持续尝试射击（受冷却限制）

    // 限制玩家边界
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

    // 更新子弹位置 (逻辑不变)
    player.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });

    // 生成和更新敌机 (逻辑不变)
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: Math.random() * 2 + 1
        });
    }

    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) enemies.splice(index, 1);
    });

    // 碰撞检测 (逻辑不变)
    player.bullets.forEach(bullet => {
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                enemies.splice(eIndex, 1);
                bullet.y = -100;
                score += 10;
            }
        });
    });

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制玩家 (白色矩形)
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 绘制子弹 (绿色矩形)
    ctx.fillStyle = '#0f0';
    player.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // 绘制敌机 (红色矩形)
    ctx.fillStyle = '#f00';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // 绘制分数
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

// 游戏主循环：使用 requestAnimationFrame 持续调用 update 和 draw
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// 启动游戏循环
gameLoop();
