// 1. 사용할 HTML 요소들 불러오기
const bg = document.getElementById('background');
const bubble = document.getElementById('bubble');
const choices = document.getElementById('choices');
const fade = document.getElementById('fade-overlay');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const char = document.getElementById('character'); 

let bgPosX = 0;          // 배경의 현재 위치
const walkSpeed = 2;     // 배경이 흘러가는(걷는) 속도

// ⭐️ 2. 전체 대본 (스토리 목록) ⭐️
// 주의: 항목과 항목 사이에는 반드시 쉼표(,)가 있어야 에러가 나지 않습니다!
const story = [
    // [1막] bg1: 길을 걷는 파트
    { bg: 'bg1.png', text: "안녕! 우리의 결혼식장으로 가는 길이야." },
    { bg: 'bg1.png', text: "함께 준비하느라 정말 고생 많았지?" },
    { bg: 'bg1.png', text: "어? 저기 멀리 예식장이 보이기 시작했어!" },
    { bg: 'bg1.png', text: "때는 2019, 진아는 갓 입사한 신입사원이다."},
    { bg: 'bg1.png', text: "1년 뒤, 2020 형민이가 입사한다."},
    { bg: 'bg1.png', text: "진아: 저 잘생긴 오빠 뭐지? 흥미가 생긴다."},
    { bg: 'bg1.png', text: "실제로 20년도의 형민이는 잘생겼었다."},
    { bg: 'bg1.png', text: "형민: 안녕 선배?"},

    // [2막] bg2: 갤러리 파트 (배경 멈춤, 사진 등장)
    { bg: 'bg2.png', text: "여기는 우리의 추억이 담긴 갤러리야." },
    { bg: 'bg2.png', text: "모바일 동기들과의 즐거운 시간"},
    // photos 배열에 사진 이름을 적으면 해당 대사에서 클릭 시 즉시 나타납니다.
    { bg: 'bg2.png', text: "우리가 처음 만난 날 기억나?", photos: ['photo1'] }, 
    { bg: 'bg2.png', text: "첫 여행 갔을 때 정말 재밌었는데!", photos: ['photo1', 'photo2'] }, 
    { bg: 'bg2.png', text: "웨딩 촬영 날도 빼놓을 수 없지.", photos: ['photo1', 'photo2', 'photo3'] }, 
    { bg: 'bg2.png', text: "드디어 식장 앞에 도착했다!", photos: ['photo1', 'photo2', 'photo3'] },
    { bg: 'bg2.png', text: "잠깐! 안으로 들어가기 전에 퀴즈를 맞혀봐!", photos: ['photo1', 'photo2', 'photo3'] },
    
    // [3막] 퀴즈 파트 (가장 마지막에 와야 합니다)
    { bg: 'bg2.png', type: 'quiz', photos: ['photo1', 'photo2', 'photo3'] } 
];

let currentStep = 0;         // 현재 내가 몇 번째 대사를 보고 있는지 저장
let isTransitioning = false; // 화면 전환 중일 때 버튼 더블클릭 방지용

// 처음 시작할 때 0번째 대사를 화면에 띄웁니다.
updateStory();

// 3. 대본(story)에 맞춰 화면을 그려주는 핵심 함수
function updateStory() {
    let current = story[currentStep];

    // [갤러리 로직] 현재 배경이 bg2.png이면 사진을 세팅합니다.
    const photoGallery = document.getElementById('photo-gallery');
    if (current.bg === 'bg2.png') {
        photoGallery.style.display = 'block'; 
        
        // 일단 모든 사진을 다 숨깁니다 (이전 버튼을 눌렀을 때 사진을 지우기 위함)
        document.querySelectorAll('.photo-frame').forEach(el => el.classList.remove('show'));
        
        // 현재 대본에 photos 리스트가 있다면 그 사진들만 화면에 짠! 하고 보여줍니다.
        if (current.photos) {
            current.photos.forEach(id => {
                document.getElementById(id).classList.add('show');
            });
        }
    } else {
        photoGallery.style.display = 'none'; // bg1일 때는 갤러리를 꺼둡니다.
    }

    // [퀴즈 로직] 대본 타입이 quiz라면 말풍선을 끄고 버튼을 띄웁니다.
    if (current.type === 'quiz') {
        bubble.style.display = "none";     
        choices.style.display = "block";   
        nextBtn.classList.add('hidden'); // 퀴즈 풀 동안 다음으로 못 넘어가게 숨김
        return;
    }

    // 일반 대사라면 퀴즈창을 끄고 말풍선에 글씨를 넣습니다.
    choices.style.display = "none";
    showBubble(current.text);

    // 첫 대사면 '이전' 버튼 숨기기 / 마지막 대사면 '다음' 버튼 숨기기
    if (currentStep === 0) prevBtn.classList.add('hidden');
    else prevBtn.classList.remove('hidden');

    if (currentStep === story.length - 1) nextBtn.classList.add('hidden');
    else nextBtn.classList.remove('hidden');
}

// 4. 다음 버튼 클릭 함수
function goNext() {
    if (isTransitioning) return; // 화면 넘어가는 중엔 눌러도 무시
    
    if (currentStep < story.length - 1) {
        let nextStep = currentStep + 1;
        
        // 다음 대사의 배경 그림이 바뀌면 검은 커튼(changeScene)을 부르고, 아니면 대사만 넘깁니다.
        if (story[nextStep].bg !== story[currentStep].bg) {
            changeScene(nextStep, true); // true = 앞으로 가는 중이니까 캐릭터 걸어가라!
        } else {
            currentStep = nextStep;
            updateStory();
        }
    }
}

// 5. 이전 버튼 클릭 함수
function goPrev() {
    if (isTransitioning) return;
    
    if (currentStep > 0) {
        let prevStep = currentStep - 1;
        
        // 이전 대사로 갈 때 배경이 바뀌면 검은 커튼 치기
        if (story[prevStep].bg !== story[currentStep].bg) {
            changeScene(prevStep, false); // false = 뒤로 가는 거니까 걷지 말고 화면만 까맣게 해라!
        } else {
            currentStep = prevStep;
            updateStory();
        }
    }
}

// 6. 장면 전환(검은 커튼) 함수
function changeScene(targetStep, isNext) {
    isTransitioning = true;
    hideBubble();
    choices.style.display = "none";
    
    let delayBeforeFade = 0; // 화면이 까매지기 전 기다리는 시간

    // '다음'으로 넘어갈 때만 캐릭터가 오른쪽으로 걸어나가는 클래스(walk-off)를 붙입니다.
    if (isNext) {
        char.classList.add('walk-off');
        delayBeforeFade = 2700; // 걷는 모습을 보여주기 위해 2.7초 기다립니다.
    }

    // 설정된 시간이 지나면 화면을 까맣게 만듭니다.
    setTimeout(() => {
        fade.classList.add('fade-out'); 

        // 1초 뒤 완전히 까매지면 뒤에서 배경과 캐릭터 위치를 리셋합니다.
        setTimeout(() => {
            currentStep = targetStep;
            
            // 배경 바꾸기
            bg.style.backgroundImage = `url('${story[currentStep].bg}')`;
            bgPosX = 0; 
            bg.style.left = "0px";
            
            // 캐릭터 원래 자리로 이동
            char.classList.remove('walk-off');
            
            updateStory(); // 새로운 배경의 대사 띄우기
            
            // 까만 커튼 다시 걷기
            fade.classList.remove('fade-out'); 
            
            setTimeout(() => {
                isTransitioning = false; // 전환 완료! 다시 클릭 가능
            }, 1000);
        }, 1000); 
    }, delayBeforeFade);
}

// 7. 게임 배경 스크롤 루프 함수
function gameLoop() {
    // 배경이 bg1일 때만 움직이게 합니다. (bg2는 사진을 봐야 하므로 배경 멈춤)
    if (story[currentStep] && story[currentStep].bg === 'bg1.png') {
        if (bgPosX > -4000) {
            bgPosX -= walkSpeed;
            bg.style.left = bgPosX + "px";
        }
    }
}

// 말풍선 제어 도우미
function showBubble(text) {
    bubble.innerText = text;
    bubble.style.display = "block";
}
function hideBubble() {
    bubble.style.display = "none";
}

// 8. 퀴즈 정답 확인 함수
function answer(choice) {
    if (choice === 'spring') {
        choices.style.display = "none";
        showBubble("딩동댕! 이제 진짜 청첩장을 확인하러 갈까?");
        // 2초 뒤에 진짜 청첩장으로 리다이렉트
        setTimeout(() => {
            window.location.href = "https://gna-king.github.io/happy-wedding-day/"; 
        }, 2000);
    } else {
        choices.style.display = "none";
        showBubble("땡! 다시 한 번 잘 생각해봐!");
        
        // 틀렸을 경우 2초 뒤에 퀴즈 창을 다시 띄웁니다.
        setTimeout(() => {
            updateStory();
        }, 2000);
    }
}

// 0.03초마다 배경 흘러가게 만들기
setInterval(gameLoop, 30);
