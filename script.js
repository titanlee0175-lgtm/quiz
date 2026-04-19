// 1. 取得 HTML 元素：讓 JS 能夠控制畫面上的小鳥
const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');

// 2. 設定遊戲的物理變數
let birdY = 250;       // 小鳥初始 Y 座標 (跟 CSS 裡的 top 對應)
let velocity = 0;      // 小鳥目前的垂直速度
let gravity = 0.5;     // 重力加速度 (數字越大，掉落越快)
let jumpStrength = -8; // 跳躍力量 (在網頁座標系中，Y軸往上是負數，往下是正數)

// 3. 建立跳躍動作
function jump() {
    // 每次跳躍時，直接重置並給予一個向上的速度
    velocity = jumpStrength;
}

// 監聽鍵盤事件：按下空白鍵時觸發跳躍
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        jump();
    }
});

// 監聽滑鼠事件：點擊遊戲畫面也能跳躍 (方便手機或滑鼠測試)
gameContainer.addEventListener('mousedown', jump);

// 4. 遊戲主迴圈 (Game Loop)
function gameLoop() {
    // 物理運算：速度會因為重力不斷累加
    velocity += gravity;
    // 位移運算：小鳥的位置會因為速度不斷改變
    birdY += velocity;

    // 邊界檢查 (防呆機制)：不讓小鳥飛出畫面或掉落到地下
    // 容器高度 600px - 小鳥高度 30px = 570px (觸底極限)
    if (birdY > 570) {
        birdY = 570;
        velocity = 0; // 撞到底部時速度歸零
    }
    // 天花板極限
    if (birdY < 0) {
        birdY = 0;
        velocity = 0;
    }

    // 5. 將計算好的數據更新到 HTML 畫面上
    bird.style.top = birdY + 'px';

    // 告訴瀏覽器：在畫下一張圖(下一幀)之前，再執行一次 gameLoop
    // 這會創造出每秒約 60 次的平滑動畫
    requestAnimationFrame(gameLoop);
}

// 啟動遊戲
gameLoop();
