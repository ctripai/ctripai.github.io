// game.js: 飞机大战核心逻辑

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 32,
    height: 32,
    speed: 5,
    bullets: []
};

let enemies = [];
let score = 0;

// 事件监听：键盘控制玩家移动和射击
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') player.x -= player.speed;
    if (event.key === 'ArrowRight') player.x += player.speed;
    if (event.key === ' ') shoot(); // 空格键射击
});

function shoot() {
    player.bullets.push({
        x: player.x + player.width / 2 - 2, // 子弹居中
        y: player.y,
        width: 4,
        height: 10,
        speed: 7
    });
}

function update() {
    // 限制玩家边界
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

    // 更新子弹位置
    player.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });

    // 生成和更新敌机
    if (Math.random() < 0.02) { // 概率生成敌机
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

    // 碰撞检测（子弹命中敌机）
    player.bullets.forEach(bullet => {
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // 命中，移除子弹和敌机
                enemies.splice(eIndex, 1);
                bullet.y = -100; // 将子弹移出屏幕，下次更新时移除
                score += 10;
            }
        });
    });

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';

    // 绘制玩家
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 绘制子弹
    ctx.fillStyle = '#0f0';
    player.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // 绘制敌机
    ctx.fillStyle = '#f00';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // 绘制分数
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

// 游戏主循环
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
