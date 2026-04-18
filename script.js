const bg = document.getElementById('background');
const bubble = document.getElementById('bubble');
const choices = document.getElementById('choices');
const fade = document.getElementById('fade-overlay');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let bgPosX = 0;
let sceneNumber = 1;
let isWalking = true;
const walkSpeed = 4; 

const backgrounds = ["bg1.png", "bg2.png"]; 

// 화면 전환 시 버튼 보이기/숨기기 관리
function updateNavButtons() {
    if (sceneNumber === 1) {
        prevBtn.classList.add('hidden'); // 첫 화면: 이전 버튼 숨김
        nextBtn.classList.remove('hidden');
    } else if (sceneNumber === backgrounds.length) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden'); // 마지막 화면: 다음 버튼 숨김
    } else {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    }
}

// 처음 시작할 때 버튼 상태 업데이트
updateNavButtons();

function gameLoop() {
    if (!isWalking) return;

    bgPosX -= walkSpeed;
    bg.style.left = bgPosX + "px";

    if (sceneNumber === 1) {
        if (bgPosX <= -300 && bgPosX > -305) {
            showBubble("드디어 우리의 결혼식장으로 가는 길이야.");
        }
        if (bgPosX <= -800 && bgPosX > -805) {
            hideBubble();
        }
    }

    if (sceneNumber === 2) {
        if (bgPosX <= -500) {
            isWalking = false; 
            showBubble("잠깐! 식장에 들어가기 전에 퀴즈를 맞혀봐!");
            
            setTimeout(() => {
                choices.style.display = "block";
            }, 1500);
        }
    }
}

// 다음 버튼 클릭 시
function goNext() {
    if (sceneNumber < backgrounds.length && isWalking) {
        changeScene(1); // 1칸 앞으로
    }
}

// 이전 버튼 클릭 시
function goPrev() {
    if (sceneNumber > 1 && isWalking) {
        changeScene(-1); // 1칸 뒤로
    }
}

// 장면 전환 (direction에 따라 1 또는 -1 적용)
function changeScene(direction) {
    isWalking = false;
    hideBubble();
    choices.style.display = "none"; // 혹시 열려있는 퀴즈창 닫기
    
    fade.classList.add('fade-out'); 

    setTimeout(() => {
        sceneNumber += direction;
        
        // 배경 이미지 교체 및 위치 초기화
        bg.style.backgroundImage = `url('${backgrounds[sceneNumber-1]}')`;
        bgPosX = 0;
        bg.style.left = "0px";
        
        updateNavButtons(); // 버튼 상태 다시 확인
        
        fade.classList.remove('fade-out');
        
        setTimeout(() => {
            isWalking = true;
        }, 1000);
    }, 1000);
}

function showBubble(text) {
    bubble.innerText = text;
    bubble.style.display = "block";
}

function hideBubble() {
    bubble.style.display = "none";
}

function answer(choice) {
    if (choice === 'spring') {
        choices.style.display = "none";
        showBubble("정답! 이제 진짜 청첩장을 확인하러 갈까?");
        setTimeout(() => {
            window.location.href = "https://your-wedding-link.com"; 
        }, 2000);
    } else {
        showBubble("땡! 다시 한 번 잘 생각해봐!");
    }
}

setInterval(gameLoop, 30);
