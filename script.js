const bg = document.getElementById('background');
const bubble = document.getElementById('bubble');
const choices = document.getElementById('choices');
const fade = document.getElementById('fade-overlay');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const char = document.getElementById('character'); 

let bgPosX = 0;          
const walkSpeed = 2;     

// ⭐️ [자동 재생을 위한 타이머 변수 추가] ⭐️
let autoTimer; 
const autoDelay = 4500; // 대사를 읽고 다음으로 넘어갈 때까지 기다리는 시간 (4500 = 4.5초)

const story = [
    { bg: 'bg1.png', text: "안녕! 우리의 결혼식장으로 가는 길이야." },
    { bg: 'bg1.png', text: "함께 준비하느라 정말 고생 많았지?" },
    { bg: 'bg1.png', text: "어? 저기 멀리 예식장이 보이기 시작했어!" },
    { bg: 'bg1.png', text: "때는 2019, 진아는 갓 입사한 신입사원이다."},
    { bg: 'bg1.png', text: "1년 뒤, 2020 형민이가 입사한다."},
    { bg: 'bg1.png', text: "진아: 저 잘생긴 오빠 뭐지? 흥미가 생긴다."},
    { bg: 'bg1.png', text: "실제로 20년도의 형민이는 잘생겼었다."},
    { bg: 'bg1.png', text: "형민: 안녕 선배?"},

    { bg: 'bg2.png', text: "여기는 우리의 추억이 담긴 갤러리야." },
    { bg: 'bg2.png', text: "모바일 동기들과의 즐거운 시간"},
    { bg: 'bg2.png', text: "우리가 처음 만난 날 기억나?", photos: ['photo1'] }, 
    { bg: 'bg2.png', text: "첫 여행 갔을 때 정말 재밌었는데!", photos: ['photo1', 'photo2'] }, 
    { bg: 'bg2.png', text: "웨딩 촬영 날도 빼놓을 수 없지.", photos: ['photo1', 'photo2', 'photo3'] }, 
    { bg: 'bg2.png', text: "드디어 식장 앞에 도착했다!", photos: ['photo1', 'photo2', 'photo3'] },
    { bg: 'bg2.png', text: "잠깐! 안으로 들어가기 전에 퀴즈를 맞혀봐!", photos: ['photo1', 'photo2', 'photo3'] },
    
    // 마지막 퀴즈 파트
    { bg: 'bg2.png', type: 'quiz', photos: ['photo1', 'photo2', 'photo3'] } 
];

let currentStep = 0;         
let isTransitioning = false; 

// 시작
updateStory();

function updateStory() {
    let current = story[currentStep];

    // ⭐️ [자동 재생 기능] ⭐️
    // 새로운 대사가 뜰 때마다 기존에 돌아가던 타이머를 취소합니다. (중복 방지)
    clearTimeout(autoTimer);

    const photoGallery = document.getElementById('photo-gallery');
    if (current.bg === 'bg2.png') {
        photoGallery.style.display = 'block'; 
        document.querySelectorAll('.photo-frame').forEach(el => el.classList.remove('show'));
        if (current.photos) {
            current.photos.forEach(id => {
                document.getElementById(id).classList.add('show');
            });
        }
    } else {
        photoGallery.style.display = 'none'; 
    }

    // 퀴즈 화면일 때는 버튼 숨기고, "자동 재생도 멈춥니다"
    if (current.type === 'quiz') {
        bubble.style.display = "none";     
        choices.style.display = "block";   
        nextBtn.classList.add('hidden'); 
        return; 
    }

    choices.style.display = "none";
    showBubble(current.text);

    if (currentStep === 0) prevBtn.classList.add('hidden');
    else prevBtn.classList.remove('hidden');

    if (currentStep === story.length - 1) nextBtn.classList.add('hidden');
    else nextBtn.classList.remove('hidden');

    // ⭐️ [자동 재생 타이머 시작] ⭐️
    // 아직 마지막 대사가 아니라면, 지정된 시간(4.5초) 뒤에 알아서 goNext()를 실행합니다!
    if (currentStep < story.length - 1) {
        autoTimer = setTimeout(() => {
            goNext();
        }, autoDelay);
    }
}

function goNext() {
    if (isTransitioning) return; 
    
    // 사용자가 버튼을 직접 눌렀을 수도 있으니 타이머를 끕니다.
    clearTimeout(autoTimer); 
    
    if (currentStep < story.length - 1) {
        let nextStep = currentStep + 1;
        
        if (story[nextStep].bg !== story[currentStep].bg) {
            changeScene(nextStep, true); 
        } else {
            currentStep = nextStep;
            updateStory();
        }
    }
}

function goPrev() {
    if (isTransitioning) return;
    
    // 뒤로 가기를 눌러도 타이머를 한 번 끕니다.
    clearTimeout(autoTimer);
    
    if (currentStep > 0) {
        let prevStep = currentStep - 1;
        
        if (story[prevStep].bg !== story[currentStep].bg) {
            changeScene(prevStep, false); 
        } else {
            currentStep = prevStep;
            updateStory();
        }
    }
}

function changeScene(targetStep, isNext) {
    isTransitioning = true;
    hideBubble();
    choices.style.display = "none";
    
    // 장면이 넘어가는 도중에는 자동 재생이 겹치지 않게 타이머를 끕니다.
    clearTimeout(autoTimer);
    
    let delayBeforeFade = 0; 

    if (isNext) {
        char.classList.add('walk-off');
        delayBeforeFade = 2700; 
    }

    setTimeout(() => {
        fade.classList.add('fade-out'); 

        setTimeout(() => {
            currentStep = targetStep;
            
            bg.style.backgroundImage = `url('${story[currentStep].bg}')`;
            bgPosX = 0; 
            bg.style.left = "0px";
            
            char.classList.remove('walk-off');
            updateStory(); // 여기서 다시 타이머가 작동 시작합니다!
            
            fade.classList.remove('fade-out'); 
            
            setTimeout(() => {
                isTransitioning = false; 
            }, 1000);
        }, 1000); 
    }, delayBeforeFade);
}

function gameLoop() {
    if (story[currentStep] && story[currentStep].bg === 'bg1.png') {
        if (bgPosX > -4000) {
            bgPosX -= walkSpeed;
            bg.style.left = bgPosX + "px";
        }
    }
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
        showBubble("딩동댕! 이제 진짜 청첩장을 확인하러 갈까?");
        setTimeout(() => {
            window.location.href = "https://gna-king.github.io/happy-wedding-day/"; 
        }, 2000);
    } else {
        choices.style.display = "none";
        showBubble("땡! 다시 한 번 잘 생각해봐!");
        setTimeout(() => {
            updateStory();
        }, 2000);
    }
}

setInterval(gameLoop, 30);
