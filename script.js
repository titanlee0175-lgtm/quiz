//  html
const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

// 平台
const startPlatform = document.getElementById('start-platform');
const startMessage = document.getElementById('start-message');

// 物理效果
let birdY = 250;       
let velocity = 0;      
let gravity = 0.5;    
let jumpStrength = -6; 

let isGameOver = false;
let isGameStarted = false; 
let score = 0;
let frames = 0;      
let pipes = [];      

// 飛
function jump() {
    if (isGameOver) return; 

    // 隱藏台
    if (!isGameStarted) {
        isGameStarted = true;
        startPlatform.style.display = 'none'; 
        startMessage.style.display = 'none';  
    }

    velocity = jumpStrength;
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') jump();
});
gameContainer.addEventListener('mousedown', jump);

// 聲水管
function spawnPipe() {
    const gap = 150; 
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

// 我幹嘛寫備註阿
function gameLoop() {
    if (isGameOver) {
        alert(`\n分數是：${score}\n重新開始。`);
        location.reload(); 
        return; 
    }

    
    if (isGameStarted) {
        
        velocity += gravity;
        birdY += velocity;

        
        if (birdY > 570) {
            birdY = 570;
            isGameOver = true; 
        }
        if (birdY < 0) {
            birdY = 0;
            velocity = 0;
        }

        // 150真
        if (frames % 150 === 0) {
            spawnPipe();
        }
        frames++;

        
        for (let i = pipes.length - 1; i >= 0; i--) {
            let p = pipes[i];
            p.x -= 3; 

            p.topElement.style.left = p.x + 'px';
            p.bottomElement.style.left = p.x + 'px';

            const birdRect = bird.getBoundingClientRect();
            const topRect = p.topElement.getBoundingClientRect();
            const bottomRect = p.bottomElement.getBoundingClientRect();

            // 碰壁
            if (
                birdRect.right > topRect.left &&
                birdRect.left < topRect.right &&
                (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top)
            ) {
                isGameOver = true;
            }

            // 計分
            if (p.x + p.width < 50 && !p.passed) {
                score++;
                scoreDisplay.innerText = score;
                p.passed = true;
            }

            // 資源回收 一般垃圾
            if (p.x < -p.width) {
                p.topElement.remove();
                p.bottomElement.remove();
                pipes.splice(i, 1);
            }
        }
    }

    // 鳥位置
    bird.style.top = birdY + 'px';

    requestAnimationFrame(gameLoop);
}

// 姑姑嘎嘎
gameLoop();
