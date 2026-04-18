// 1. 필요한 요소들을 가져옵니다.
const bg = document.getElementById('background');
const bubble = document.getElementById('bubble');
const choices = document.getElementById('choices');

// 2. 게임 설정 변수
let bgPosX = 0;      // 배경의 시작 위치
const walkSpeed = 3; // 걷는 속도 (숫자가 커질수록 빨라요)
let gameActive = true; 

// 3. 게임 루프 (0.03초마다 반복 실행)
function gameLoop() {
    if (!gameActive) return; // 게임이 멈추면 실행 안 함

    // 배경을 왼쪽으로 밀어서 캐릭터가 전진하는 느낌을 줍니다.
    bgPosX -= walkSpeed;
    bg.style.left = bgPosX + "px";

    // [이벤트 1] 조금 걸어가다가 말풍선이 뜹니다.
    if (bgPosX <= -200 && bgPosX > -205) {
        showBubble("오! 드디어 우리의 결혼식장으로 가는 '픽셀 로드'야.");
    }

    // [이벤트 2] 더 걸어가다가 멈추고 퀴즈를 냅니다.
    if (bgPosX <= -600) {
        stopGame();
        showBubble("잠깐! 들어가기 전에 퀴즈를 맞혀봐!");
        
        // 1초 뒤에 선택지 버튼을 보여줍니다.
        setTimeout(() => {
            choices.style.display = "block";
        }, 1000);
    }
}

// 4. 말풍선을 보여주는 함수
function showBubble(text) {
    bubble.style.display = "block";
    bubble.innerText = text;
}

// 5. 게임을 멈추는 함수
function stopGame() {
    gameActive = false;
}

// 6. 버튼 클릭 시 정답 확인 함수
function answer(choice) {
    if (choice === 'spring') {
        bubble.innerText = "딩동댕! 이제 진짜 초대장을 보여줄게!";
        setTimeout(() => {
            // 여기에 실제 모바일 청첩장 주소를 넣으세요!
            window.location.href = "https://your-wedding-link.com"; 
        }, 1500);
    } else {
        bubble.innerText = "땡! 다시 한 번 잘 생각해봐~ (힌트: 벚꽃!)";
    }
}

// 7. 게임 시작!
const timer = setInterval(gameLoop, 30);
