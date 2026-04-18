const bg = document.getElementById('background');
const bubble = document.getElementById('bubble');
const choices = document.getElementById('choices');
const fade = document.getElementById('fade-overlay');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const char = document.getElementById('character'); // ⭐️ 이 줄을 추가하세요!
let bgPosX = 0;
const walkSpeed = 2; // 대화를 읽는 동안 배경이 천천히 흘러갑니다

// ⭐️ 여기서 전체 스토리를 마음대로 작성할 수 있습니다! ⭐️
// bg: 배경 이미지 이름 / text: 말풍선에 들어갈 대사
const story = [
    { bg: 'bg1.png', text: "안녕! 우리의 결혼식장으로 가는 길이야." },
    { bg: 'bg1.png', text: "함께 준비하느라 정말 고생 많았지?" },
    { bg: 'bg1.png', text: "어? 저기 멀리 예식장이 보이기 시작했어!" },
    
    // 배경이 bg2.png로 바뀌면, 알아서 화면이 까맣게 변했다가 넘어갑니다.
    { bg: 'bg2.png', text: "드디어 식장 앞에 도착했다!" },
    { bg: 'bg2.png', text: "잠깐! 안으로 들어가기 전에 퀴즈를 맞혀봐!" },
    
    // type이 'quiz'면 말풍선 대신 퀴즈 버튼이 나타납니다.
    { bg: 'bg2.png', type: 'quiz' } 
];

let currentStep = 0;         // 현재 몇 번째 대사인지 기억하는 변수
let isTransitioning = false; // 화면 전환 중일 때 버튼 안 눌리게 막아주는 역할

// 처음 시작할 때 첫 번째 대사 띄우기
updateStory();

// 대본(story)에 맞춰서 화면에 말풍선을 띄우는 함수
function updateStory() {
    let current = story[currentStep];

    // 만약 퀴즈가 나올 차례라면?
    if (current.type === 'quiz') {
        bubble.style.display = "none";     // 말풍선 숨기고
        choices.style.display = "block";   // 퀴즈 창 띄우고
        nextBtn.classList.add('hidden');   // 퀴즈 풀 동안 '다음' 버튼 숨김
        return;
    }

    // 일반 대사라면?
    choices.style.display = "none";
    showBubble(current.text);

    // 첫 대사면 '이전' 버튼 숨기고, 끝이면 '다음' 버튼 숨기기
    if (currentStep === 0) prevBtn.classList.add('hidden');
    else prevBtn.classList.remove('hidden');

    if (currentStep === story.length - 1) nextBtn.classList.add('hidden');
    else nextBtn.classList.remove('hidden');
}

// 다음 버튼 클릭 시
function goNext() {
    if (isTransitioning) return; // 화면 넘어갈 땐 클릭 금지!
    
    if (currentStep < story.length - 1) {
        let nextStep = currentStep + 1;
        
        // 다음 대사의 배경 그림이 현재 배경과 다르면? -> 화면 전환(Fade out/in)
        if (story[nextStep].bg !== story[currentStep].bg) {
            changeScene(nextStep);
        } else {
            currentStep = nextStep;
            updateStory();
        }
    }
}

// 이전 버튼 클릭 시
function goPrev() {
    if (isTransitioning) return;
    
    if (currentStep > 0) {
        let prevStep = currentStep - 1;
        
        if (story[prevStep].bg !== story[currentStep].bg) {
            changeScene(prevStep);
        } else {
            currentStep = prevStep;
            updateStory();
        }
    }
}

// 장면 전환 함수 (오른쪽 퇴장 -> 검은 커튼 효과 -> 배경 교체)
function changeScene(targetStep) {
    isTransitioning = true;
    hideBubble();
    choices.style.display = "none";
    
    // 1. 캐릭터에게 'walk-off' 클래스를 추가해 오른쪽으로 걷게 합니다.
    char.classList.add('walk-off');

    // 2. 캐릭터가 이동하는 시간(1.5초)을 기다린 후 화면을 어둡게(Fade-out) 만듭니다.
    setTimeout(() => {
        fade.classList.add('fade-out'); 

        // 3. 화면이 완전히 까매지면(1초 뒤) 배경을 교체하고 캐릭터를 제자리로 돌려놓습니다.
        setTimeout(() => {
            currentStep = targetStep;
            
            // 배경 교체 및 위치 초기화
            bg.style.backgroundImage = `url('${story[currentStep].bg}')`;
            bgPosX = 0; 
            bg.style.left = "0px";
            
            // 다음 장면을 위해 캐릭터의 'walk-off' 클래스를 제거 (몰래 왼쪽 15%로 복귀)
            char.classList.remove('walk-off');
            
            updateStory(); 
            
            // 4. 다시 화면을 밝게(Fade-in) 만듭니다.
            fade.classList.remove('fade-out'); 
            
            setTimeout(() => {
                isTransitioning = false;
            }, 1000);
        }, 1000); 
    }, 2800); // 1.5초는 CSS의 transition 시간과 맞춥니다.
}
// 게임 내내 배경이 천천히 뒤로 흘러가게 만들기
function gameLoop() {
    // ⭐️ 배경이 끝(-4000px)에 도달하지 않았을 때만 왼쪽으로 이동시킵니다!
    if (bgPosX > -4000) {
        bgPosX -= walkSpeed;
        bg.style.left = bgPosX + "px";
    }
}

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
        showBubble("딩동댕! 이제 진짜 청첩장을 확인하러 갈까?");
        setTimeout(() => {
            window.location.href = " https://gna-king.github.io/happy-wedding-day/"; 
        }, 2000);
    } else {
        choices.style.display = "none";
        showBubble("땡! 다시 한 번 잘 생각해봐!");
        
        // 틀리면 2초 뒤에 다시 퀴즈 창 보여주기
        setTimeout(() => {
            updateStory();
        }, 2000);
    }
}

setInterval(gameLoop, 30);
