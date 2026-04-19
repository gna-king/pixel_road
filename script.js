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
    { bg: 'bg1.png', text: "때는 2019, 진아는 갓 입사한 신입사원이다."},
    { bg: 'bg1.png', text: "1년 뒤, 2020 형민이가 입사한다."},
    { bg: 'bg1.png', text: "진아: 저 잘생긴 오빠 뭐지? 흥미가 생긴다."},
    { bg: 'bg1.png', text: "실제로 20년도의 형민이는 잘생겼었다."},
    { bg: 'bg1.png', text: "형민: 안녕 선배?"},

    ///배경을 사진들로 바꾼다.
   
    // bg2: 하얀 갤러리 배경 (이 배경에서는 알아서 스크롤이 멈춥니다)
    { bg: 'bg2.png', text: "여기는 우리의 추억이 담긴 갤러리야." },
    { bg: 'bg2.png', text : "모바일 동기들과의 즐거운 시간"},
    { bg: 'bg2.png', text: "우리가 처음 만난 날 기억나?", photos: ['photo1'] }, // 1번 사진 등장
    { bg: 'bg2.png', text: "첫 여행 갔을 때 정말 재밌었는데!", photos: ['photo1', 'photo2'] }, // 2번 사진 추가
    { bg: 'bg2.png', text: "웨딩 촬영 날도 빼놓을 수 없지.", photos: ['photo1', 'photo2', 'photo3'] }, // 3번 사진 추가
    
    { bg: 'bg2.png', type: 'quiz', photos: ['photo1', 'photo2', 'photo3'] }
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
// ⭐️ [추가된 부분] 갤러리 사진 업데이트
    const photoGallery = document.getElementById('photo-gallery');
    if (current.bg === 'bg2.png') {
        photoGallery.style.display = 'block'; // 갤러리 영역 켜기
        
        // 1. 일단 모든 사진을 투명하게 숨깁니다 (이전을 눌렀을 때를 대비)
        document.querySelectorAll('.photo-frame').forEach(el => el.classList.remove('show'));
        
        // 2. 현재 스텝에 지정된 사진(photos 배열)만 스르륵 나타나게 합니다
        if (current.photos) {
            current.photos.forEach(id => {
                document.getElementById(id).classList.add('show');
            });
        }
    } else {
        photoGallery.style.display = 'none'; // bg1에서는 갤러리 숨김
    }
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

// 다음 버튼 클릭 시
function goNext() {
    if (isTransitioning) return; 
    
    if (currentStep < story.length - 1) {
        let nextStep = currentStep + 1;
        
        if (story[nextStep].bg !== story[currentStep].bg) {
            // ⭐️ 두 번째 값으로 true를 전달해서 '앞으로 가는 중'임을 알려줍니다.
            changeScene(nextStep, true); 
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
            // ⭐️ 두 번째 값으로 false를 전달해서 '뒤로 가는 중'임을 알려줍니다.
            changeScene(prevStep, false); 
        } else {
            currentStep = prevStep;
            updateStory();
        }
    }
}

// 장면 전환 함수
function changeScene(targetStep, isNext) {
    isTransitioning = true;
    hideBubble();
    choices.style.display = "none";
    
    let delayBeforeFade = 0; // 화면이 까매지기 전 기다리는 시간

    // '다음'으로 넘어갈 때만 캐릭터가 오른쪽으로 걷습니다.
    if (isNext) {
        char.classList.add('walk-off');
        delayBeforeFade = 2700; // 걷는 모션을 보여주기 위해 2.7초 대기
    }

    // 지정된 시간(다음: 2.7초, 이전: 0초)이 지나면 검은 커튼을 칩니다.
    setTimeout(() => {
        fade.classList.add('fade-out'); 

        setTimeout(() => {
            currentStep = targetStep;
            
            // 배경 이미지 교체
            bg.style.backgroundImage = `url('${story[currentStep].bg}')`;
            bgPosX = 0; 
            bg.style.left = "0px";
            
            // 다음 혹은 이전 장면을 위해 캐릭터 위치 리셋
            char.classList.remove('walk-off');
            
            updateStory(); 
            
            // 검은 커튼 걷기
            fade.classList.remove('fade-out'); 
            
            setTimeout(() => {
                isTransitioning = false;
            }, 1000);
        }, 1000); 
    }, delayBeforeFade);
}

// 게임 내내 배경이 천천히 뒤로 흘러가게 만들기
//function gameLoop() {
    // ⭐️ 배경이 끝(-4000px)에 도달하지 않았을 때만 왼쪽으로 이동시킵니다!
 //   if (bgPosX > -4000) {
 //       bgPosX -= walkSpeed;
 //       bg.style.left = bgPosX + "px";
 //   }
//}

// 게임 내내 배경이 흘러가게 만들기
function gameLoop() {
    // ⭐️ 현재 배경이 bg1일 때만 배경이 움직입니다! (bg2에서는 멈춤)
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
