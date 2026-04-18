// 1. 필요한 HTML 요소들 불러오기
const bg = document.getElementById('background');
const bubble = document.getElementById('bubble');
const choices = document.getElementById('choices');
const fade = document.getElementById('fade-overlay');

// 2. 게임 상태 변수
let bgPosX = 0;
let sceneNumber = 1;
let isWalking = true;
const walkSpeed = 4; // 걷는 속도 (현재 아주 좋음!)

// 사용할 배경 이미지 리스트
const backgrounds = ["bg1.png", "bg2.png"]; 

// 3. 메인 게임 루프 (반복 실행)
function gameLoop() {
    if (!isWalking) return;

    bgPosX -= walkSpeed;
    bg.style.left = bgPosX + "px";

    // 첫 번째 장면 진행 중
    if (sceneNumber === 1) {
        if (bgPosX <= -300 && bgPosX > -305) {
            showBubble("드디어 우리의 결혼식장으로 가는 길이야.");
        }
        if (bgPosX <= -800 && bgPosX > -805) {
            hideBubble();
        }
        // 💡 주의: 원래 여기에 있던 '자동으로 넘어가던 코드'를 삭제했습니다!
    }

    // 두 번째(마지막) 장면 진행 중
    if (sceneNumber === 2) {
        if (bgPosX <= -500) {
            isWalking = false; // 멈춤
            showBubble("잠깐! 식장에 들어가기 전에 퀴즈를 맞혀봐!");
            
            // 1.5초 뒤에 버튼 표시
            setTimeout(() => {
                choices.style.display = "block";
            }, 1500);
        }
    }
}

// ⭐ 새로 추가된 부분: 화면을 클릭(또는 터치)하면 다음 장면으로!
document.body.addEventListener('click', function() {
    // 첫 번째 장면이고, 현재 걷고 있는 상태일 때만 넘어가게 합니다.
    if (sceneNumber === 1 && isWalking) {
        changeScene();
    }
});

// 4. 장면 전환 함수 (Fade Out -> 배경 교체 -> Fade In)
function changeScene() {
    isWalking = false;
    hideBubble();
    
    // 화면 까맣게
    fade.classList.add('fade-out'); 

    // 1초 대기 후 배경 교체
    setTimeout(() => {
        sceneNumber++;
        if (sceneNumber <= backgrounds.length) {
            // 배경 이미지와 위치 초기화
            bg.style.backgroundImage = `url('${backgrounds[sceneNumber-1]}')`;
            bgPosX = 0;
            bg.style.left = "0px";
            
            // 화면 다시 밝게
            fade.classList.remove('fade-out');
            
            // 1초 뒤 다시 걷기 시작
            setTimeout(() => {
                isWalking = true;
            }, 1000);
        }
    }, 1000);
}

// 대화창 제어 함수
function showBubble(text) {
    bubble.innerText = text;
    bubble.style.display = "block";
}

function hideBubble() {
    bubble.style.display = "none";
}

// 정답 확인 함수
function answer(choice) {
    if (choice === 'spring') {
        choices.style.display = "none";
        showBubble("정답! 이제 진짜 청첩장을 확인하러 갈까?");
        
        // 2초 뒤 실제 청첩장 링크로 이동
        setTimeout(() => {
            window.location.href = "https://your-wedding-link.com"; // 실제 모바일 청첩장 주소로 변경하세요!
        }, 2000);
    } else {
        showBubble("땡! 다시 한 번 잘 생각해봐!");
    }
}

// 0.03초마다 gameLoop 함수 실행 (게임 시작)
setInterval(gameLoop, 30);
