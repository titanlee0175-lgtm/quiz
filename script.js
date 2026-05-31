// 1. 取得 HTML 元素
const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

// 2. 遊戲狀態與物理變數
let birdY = 250;       
let velocity = 0;      
let gravity = 0.25;     
let jumpStrength = -6; 

// 【新增】遊戲進度變數
let isGameOver = false;
let score = 0;
let frames = 0;      // 記錄遊戲經過的幀數，用來控制水管生成頻率
let pipes = [];      // 用陣列來儲存目前畫面上的所有水管物件

// 3. 跳躍動作
function jump() {
    if (isGameOver) return; // 如果遊戲結束，禁止跳躍
    velocity = jumpStrength;
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') jump();
});
gameContainer.addEventListener('mousedown', jump);

// 【新增】水管生成工廠函數
function spawnPipe() {
    const gap = 150; // 上下水管之間的空隙高度
    // 隨機決定上方水管的高度 (限制在 50px 到 350px 之間)
    const topPipeHeight = Math.floor(Math.random() * 300) + 50;
    const bottomPipeHeight = 600 - topPipeHeight - gap;

    // 建立上方水管 DOM 節點
    const topPipe = document.createElement('div');
    topPipe.classList.add('pipe');
    topPipe.style.height = topPipeHeight + 'px';
    topPipe.style.top = '0px';
    topPipe.style.left = '400px'; // 從視窗最右側開始
    gameContainer.appendChild(topPipe);

    // 建立下方水管 DOM 節點
    const bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe');
    bottomPipe.style.height = bottomPipeHeight + 'px';
    bottomPipe.style.bottom = '0px';
    bottomPipe.style.left = '400px';
    gameContainer.appendChild(bottomPipe);

    // 將這對水管的數據封裝推入陣列，方便後續遍歷運算
    pipes.push({
        topElement: topPipe,
        bottomElement: bottomPipe,
        x: 400,
        width: 50,
        passed: false // 標記是否已經被小鳥飛過（用來計分）
    });
}

// 4. 遊戲主迴圈 (Game Loop)
function gameLoop() {
    if (isGameOver) {
        // 遊戲結束時的處理
        alert(`遊戲結束！\n你的最終分數是：${score}\n按下確定重新開始。`);
        location.reload(); // 重新整理網頁來重置狀態
        return; 
    }

    // 更新物理運算
    velocity += gravity;
    birdY += velocity;

    // 邊界檢查 (防呆機制)
    if (birdY > 570) {
        birdY = 570;
        isGameOver = true; // 觸底直接判定死亡
    }
    if (birdY < 0) {
        birdY = 0;
        velocity = 0;
    }
    bird.style.top = birdY + 'px';

    // 【新增】每 90 幀 (約 1.5 秒) 生成一對新水管
    if (frames % 90 === 0) {
        spawnPipe();
    }
    frames++;

    // 【新增】遍歷更新所有水管的狀態
    // 使用倒序迴圈 (i--) 遍歷，這樣在陣列中刪除元素時才不會發生索引錯亂
    for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        p.x -= 3; // 水管向左移動的速度

        p.topElement.style.left = p.x + 'px';
        p.bottomElement.style.left = p.x + 'px';

        // 碰撞偵測演算法 (AABB - Axis-Aligned Bounding Box)
        // 取得鳥與水管在瀏覽器畫面中的絕對座標矩形
        const birdRect = bird.getBoundingClientRect();
        const topRect = p.topElement.getBoundingClientRect();
        const bottomRect = p.bottomElement.getBoundingClientRect();

        // 檢查矩形是否重疊
        if (
            birdRect.right > topRect.left &&
            birdRect.left < topRect.right &&
            (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top)
        ) {
            isGameOver = true;
        }

        // 計分邏輯：當水管的右側超過鳥的左側，且尚未計分
        if (p.x + p.width < 50 && !p.passed) {
            score++;
            scoreDisplay.innerText = score;
            p.passed = true;
        }

        // 資源回收 (Garbage Collection)：清除超出畫面的水管
        // 避免 DOM 節點無限增長導致記憶體洩漏與效能崩潰
        if (p.x < -p.width) {
            p.topElement.remove();
            p.bottomElement.remove();
            pipes.splice(i, 1);
        }
    }

    requestAnimationFrame(gameLoop);
}

// 啟動遊戲
gameLoop();
