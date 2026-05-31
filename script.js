// 1. 取得 HTML 元素
const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

// 【新增】取得待機平台與提示文字
const startPlatform = document.getElementById('start-platform');
const startMessage = document.getElementById('start-message');

// 2. 遊戲狀態與物理變數
let birdY = 250;       
let velocity = 0;      
let gravity = 0.25;    // 使用你調整過後比較順暢的重力
let jumpStrength = -6; 

let isGameOver = false;
let isGameStarted = false; // 【新增】遊戲是否已經開始的旗標
let score = 0;
let frames = 0;      
let pipes = [];      

// 3. 跳躍動作
function jump() {
    if (isGameOver) return; 

    // 【新增】如果是第一次跳躍，啟動遊戲並隱藏待機平台
    if (!isGameStarted) {
        isGameStarted = true;
        startPlatform.style.display = 'none'; // 隱藏木板
        startMessage.style.display = 'none';  // 隱藏文字
    }

    velocity = jumpStrength;
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') jump();
});
gameContainer.addEventListener('mousedown', jump);

// 水管生成工廠函數 (維持不變)
function spawnPipe() {
    const gap = 250; 
    const topPipeHeight = Math.floor(Math.random() * 300) + 50;
    const bottomPipeHeight = 600 - topPipeHeight - gap;

    const topPipe = document.createElement('div');
    topPipe.classList.add('pipe');
    topPipe.style.height = topPipeHeight + 'px';
    topPipe.style.top = '0px';
    topPipe.style.left = '400px'; 
    gameContainer.appendChild(topPipe);

    const bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe');
    bottomPipe.style.height = bottomPipeHeight + 'px';
    bottomPipe.style.bottom = '0px';
    bottomPipe.style.left = '400px';
    gameContainer.appendChild(bottomPipe);

    pipes.push({
        topElement: topPipe,
        bottomElement: bottomPipe,
        x: 400,
        width: 50,
        passed: false 
    });
}

// 4. 遊戲主迴圈 (Game Loop)
function gameLoop() {
    if (isGameOver) {
        alert(`遊戲結束！\n你的最終分數是：${score}\n按下確定重新開始。`);
        location.reload(); 
        return; 
    }

    // 【新增】只有在遊戲開始後，才執行物理運算與水管生成
    if (isGameStarted) {
        // 更新物理運算
        velocity += gravity;
        birdY += velocity;

        // 邊界檢查
        if (birdY > 570) {
            birdY = 570;
            isGameOver = true; 
        }
        if (birdY < 0) {
            birdY = 0;
            velocity = 0;
        }

        // 每 90 幀生成一對新水管
        if (frames % 150 === 0) {
            spawnPipe();
        }
        frames++;

        // 遍歷更新所有水管的狀態
        for (let i = pipes.length - 1; i >= 0; i--) {
            let p = pipes[i];
            p.x -= 3; 

            p.topElement.style.left = p.x + 'px';
            p.bottomElement.style.left = p.x + 'px';

            const birdRect = bird.getBoundingClientRect();
            const topRect = p.topElement.getBoundingClientRect();
            const bottomRect = p.bottomElement.getBoundingClientRect();

            // 碰撞檢查
            if (
                birdRect.right > topRect.left &&
                birdRect.left < topRect.right &&
                (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top)
            ) {
                isGameOver = true;
            }

            // 計分邏輯
            if (p.x + p.width < 50 && !p.passed) {
                score++;
                scoreDisplay.innerText = score;
                p.passed = true;
            }

            // 資源回收
            if (p.x < -p.width) {
                p.topElement.remove();
                p.bottomElement.remove();
                pipes.splice(i, 1);
            }
        }
    }

    // 將 Y 座標應用到小鳥身上 (不管遊戲是否開始，小鳥都會渲染在畫面上)
    bird.style.top = birdY + 'px';

    requestAnimationFrame(gameLoop);
}

// 啟動遊戲迴圈
gameLoop();
