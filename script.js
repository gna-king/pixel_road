// === Variables & Elements ===
const bg = document.getElementById('background');
const bubble = document.getElementById('bubble');
const choices = document.getElementById('choices');
const fade = document.getElementById('fade-overlay');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const char = document.getElementById('character');


let walkOffTimer = null;
let pendingTargetStep = -1;
let msgTimer;
let bgPosX = 0;
const walkSpeed = 2;

let autoTimer;
const autoDelay = 4500;

let dayTimer;
let currentDay = 1;
let isDdayRunning = false;

let historyStack = [];

// ⭐️ 몽타주 계절 배경 목록 (폴더에 이 파일들이 있어야 합니다!)
const dDayScenes = ['autumn2.png', 'winter.png', 'spring.png', 'summer.png'];

// === 대본 (Story) ===
const story = [
    { bg: 'dsr.png', text: "때는 2019, 진아는 갓 입사한 신입사원이다."},
    
    // ⭐️ title 속성을 넣으면 상단에 제목이 뜹니다.
    { bg: 'Gn.png', title: "모바일 그룹", text: "진아: 안녕하십니까!"},
    { bg: 'Gn.png', title: "모바일 그룹", text: "1년 뒤, 2020 형민이가 입사한다."},
    { bg: 'Gn.png', title: "모바일 그룹", text: "진아: 저 잘생긴 오빠 뭐지? 흥미가 생긴다."},
    { bg: 'Gn.png', title: "모바일 그룹", text: "실제로 20년도의 형민이는 잘생겼었다."},
    
    // title 속성이 없으면 제목이 스르륵 사라집니다.
    { bg: 'Gn.png', text: "형민: 안녕 선배?", showHyungmin: true},
    { bg: 'Gn.png', text: "진아: 어.. 안녕?", showHyungmin: true},

    { bg: 'room.png', text: "21년 봄과 여름 사이 어디쯤, 진아가 방에 누워있다." },
    { bg: 'room.png', text: "진아 : 심심한데 형민오빠 뭐하고 있지? " },

    // [선택지 파트]
    {
        bg: 'room.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "전화건다", target: "call_oppa" },
            { text: "다시 눕는다", target: "sleep_again" }
        ]
    },

    // --- [분기점 1] 전화건다 ---
    { id: 'call_oppa', bg: 'room.png', text: "뚜루루루... 오빠 바빠?" },
    { bg: 'room.png', text: "형민: 아니, 왜?" },
    { bg: 'room.png', text: "진아: 나랑 놀래? (두근두근)"},
    { bg: 'room.png', text: "형민: 좋아!" , nextId: 'go_to_watch_movie' },

    // --- [분기점 2] 다시 눕는다 ---
    { id: 'sleep_again', bg: 'room.png', text: "진아: 흠.. 아무래도 심심한데 전화 해봐야겠어.", nextId: 'call_oppa' },

    // --- [새로운 장면] 영화관 데이트 ---
    { id: 'go_to_watch_movie', bg: 'mega.png', text: "동탄 북광장 메가박스" },
    { bg: 'fishzip.png', text: "영화 보고 나와서 술집을 갔다." },
    { bg: 'fishzip.png', text: "형민: 너 나 좋아하냐? " },
    { bg: 'fishzip.png', text: "진아: .. (뭐지 이 테토맨은? 테스토스테론이 흘러 넘치다 못해 과한데? ) " },
    { bg: 'fishzip.png', text: "형민: 난 여자랑 1:1로 안논다. 관심없으면 " },

    // [선택지 파트]
    {
        bg: 'fishzip.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "나도 좋아..!", target: "show_your_mind" },
            { text: "뭔 소리여", target: "dog_sound" }
        ]
    },

    // --- [분기점 1] ---
    { id: "show_your_mind", bg: 'fishzip.png', text: "(관심없다고 하면 다신 나랑 안놀 것 같아.. 일단 지르자) " },
    { bg: 'fishzip.png', text: "진아: 나도 오빠 좋아..!" , nextId: 'some_ing'},

    // --- [분기점 2]  ---
    { id: "dog_sound", bg: 'fishzip.png', text: "진아: (뭔 소리야 이 오빠는? )" , nextId: 'show_your_mind'} ,

    { id: "some_ing", bg: 'fishzip.png', text: "이때부터 썸을 탔다." },
    { bg:  'dongtan_lake.png', text: "2021.10.23 동탄호수공원" },
    { bg:  'dongtan_lake.png', text: "진아: (벌써 호수만 5바퀴쨰야, 이 오빠 고백할건가?)" },
    { bg:  'dongtan_lake.png', text: "진아: 오빠 뭐 할 말 있어?" },
    { bg:  'dongtan_lake.png', text: "한참을 뜸을 들인다." },
    { bg:  'dongtan_lake.png', text: "형민: 우리 3개월만 만나볼래?" },

    // [선택지 파트]
    {
        bg: 'dongtan_lake.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "이게 말이야 방구야", target: "show_your_mind2" },
            { text: "못 들은 척 한다", target: "dog_sound2" }
        ]
    },

    // --- [분기점 1] ---
    { id: "show_your_mind2", bg: 'dongtan_lake.png', text: "(이게 말이야 방구야) " },
    { bg: 'dongtan_lake.png', text: "진아: 다시 고백해!!!" },
    { bg:  'dongtan_lake.png', text: "한참을 뜸을 들인다." },
    { bg: 'dongtan_lake.png', text: "형민: 우리 만나보자" },
    { bg: 'dongtan_lake.png', text: "진아: 좋아!" , nextId: 'dating'},

    // --- [분기점 2]  ---
    { id: "dog_sound2", bg: 'dongtan_lake.png', text: "진아: 뭐라고?" , nextId: 'show_your_mind2'} ,

    { id: "dating", bg: 'dongtan_lake.png', text: "그렇게 우리는 사귀게 되었다." },

    // ⭐️ [몽타주 파트] 사계절 자동 전환 및 D-day 연출
    {
        id: "season_montage",
        type: "montage",
        text: "우리의 시간은 쉼 없이 흘러...",
        nextId: "messenger_part"
    },

    // ⭐️ 카톡 연출 파트
    {
        id: "messenger_part",
        bg: 'room2.png',
        type: 'messenger',
        messages: [
            "자니?",
            "자는구나...",
            "잘 자"
        ]
    },

    // [마지막 퀴즈 파트]
    {
        id: 'final_quiz_start',
        bg: 'bg2.png',
        type: 'choice',
        question: "우리가 처음 만난 계절은?",
        photos: ['photo1', 'photo2', 'photo3'],
        options: [
            { text: "봄 (정답)", target: "link" },
            { text: "겨울", target: "wrong" }
        ]
    }
];

let currentStep = 0;
let isTransitioning = false;

// 시작
updateStory();

// 1. 대본 출력 함수
function updateStory() {
    let current = story[currentStep];

    // 타이머 초기화
    clearTimeout(autoTimer);
    clearInterval(dayTimer);
    if (msgTimer) clearInterval(msgTimer);

    // UI 요소 가져오기
    const dayCounter = document.getElementById('day-counter');
    const phonePopup = document.getElementById('phone-popup');
    const sceneTitle = document.getElementById('scene-title');
    const charHyungmin = document.getElementById('char-hyungmin');
    const photoGallery = document.getElementById('photo-gallery');

    // 기본 숨김 처리
    if (dayCounter) dayCounter.style.display = 'none';
    if (phonePopup) phonePopup.style.display = 'none';
    if (char) char.classList.remove('walking');
    isDdayRunning = false;

    // 챕터 제목 처리 (대본에 title이 있으면 띄움)
    if (sceneTitle) {
        if (current.title) {
            sceneTitle.innerText = current.title;
            sceneTitle.style.display = 'block';
        } else {
            sceneTitle.style.display = 'none';
        }
    }

    // 형민 캐릭터 등장 체크
    if (charHyungmin) {
        charHyungmin.style.display = current.showHyungmin ? 'block' : 'none';
    }

    // 갤러리 처리
    if (photoGallery) {
        if (current.bg === 'bg2.png') {
            photoGallery.style.display = 'block';
            document.querySelectorAll('.photo-frame').forEach(el => el.classList.remove('show'));
            if (current.photos) {
                current.photos.forEach(id => {
                    const photoEl = document.getElementById(id);
                    if(photoEl) photoEl.classList.add('show');
                });
            }
        } else {
            photoGallery.style.display = 'none';
        }
    }

    // =========================================================
    // ⭐️ 몽타주(사계절 자동 전환 & D-day) 연출 로직
    // =========================================================
    if (current.type === 'montage') {
        if (dayCounter) dayCounter.style.display = 'block';
        if (char) char.classList.add('walking');
        nextBtn.classList.add('hidden');
        prevBtn.classList.add('hidden');

        let sceneIndex = 0;
        currentDay = 1;

        bg.style.backgroundImage = `url('${dDayScenes[sceneIndex]}')`;

        dayTimer = setInterval(() => {
            currentDay += 5; // 날짜 올라가는 속도 (5씩 증가)
            if (dayCounter) dayCounter.innerText = `D+${currentDay}`;

            // 150일 마다 배경 전환
            if (currentDay % 150 === 0 && sceneIndex < dDayScenes.length - 1) {
                sceneIndex++;
                bg.style.backgroundImage = `url('${dDayScenes[sceneIndex]}')`;
            }

            // 600일이 되면 멈추고 다음 장면으로 자동 넘김
            if (currentDay >= 600) {
                clearInterval(dayTimer);
                if (char) char.classList.remove('walking');
                setTimeout(goNext, 1000);
            }
        }, 30);

        return; // 함수 종료
    }

    // =========================================================
    // 카카오톡 메신저 연출 파트
    // =========================================================
    if (current.type === 'messenger') {
        if (bubble) bubble.style.display = "none";
        if (choices) choices.style.display = "none";
        nextBtn.classList.add('hidden');
        prevBtn.classList.add('hidden');

        if (phonePopup) phonePopup.style.display = 'block';

        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.innerHTML = '';
            let msgIndex = 0;

            msgTimer = setInterval(() => {
                if (msgIndex < current.messages.length) {
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'chat-msg';
                    msgDiv.innerText = current.messages[msgIndex];
                    chatBox.appendChild(msgDiv);
                    msgIndex++;
                } else {
                    clearInterval(msgTimer);
                    nextBtn.classList.remove('hidden');
                }
            }, 1500);
        }
        return;
    }

    // =========================================================
    // 선택지 파트
    // =========================================================
    if (current.type === 'choice') {
        if (bubble) bubble.style.display = "none";
        if (choices) choices.style.display = "block";
        nextBtn.classList.add('hidden');

        choices.innerHTML = `<p id="question">${current.question}</p>`;
        current.options.forEach(opt => {
            choices.innerHTML += `<button onclick="makeChoice('${opt.target}')">${opt.text}</button>`;
        });
        return;
    }

    // 일반 대화 출력
    if (choices) choices.style.display = "none";
    showBubble(current.text);

    if (currentStep === 0) prevBtn.classList.add('hidden');
    else prevBtn.classList.remove('hidden');

    if (currentStep === story.length - 1) nextBtn.classList.add('hidden');
    else nextBtn.classList.remove('hidden');

    // 자동 넘김
    if (currentStep < story.length - 1 && !current.nextId) {
        autoTimer = setTimeout(() => {
            goNext();
        }, autoDelay);
    }
}

function makeChoice(target) {
    if (target === 'link') {
        if (choices) choices.style.display = "none";
        showBubble("딩동댕! 이제 진짜 청첩장을 확인하러 갈까?");
        setTimeout(() => { window.location.href = "https://gna-king.github.io/happy-wedding-day/"; }, 2000);
    } else if (target === 'wrong') {
        if (choices) choices.style.display = "none";
        showBubble("땡! 다시 한 번 잘 생각해봐!");
        setTimeout(() => { updateStory(); }, 2000);
    } else {
        let targetIndex = story.findIndex(s => s.id === target);
        if (targetIndex !== -1) {
            historyStack.push(currentStep);
            if (story[targetIndex].bg !== story[currentStep].bg) {
                changeScene(targetIndex, true);
            } else {
                currentStep = targetIndex;
                updateStory();
            }
        }
    }
}

function goNext() {
// ⭐️ 화면 전환(걸어나가는 중)일 때 누르면 스킵 발동!
    if (isTransitioning) {
        if (walkOffTimer) {
            clearTimeout(walkOffTimer); // 2.7초 기다리는 타이머 취소
            walkOffTimer = null;
            executeFade(pendingTargetStep); // 묻지도 따지지도 않고 바로 화면 암전
        }
        return; 
    }
    clearTimeout(autoTimer);

    let current = story[currentStep];
    let nextStep = currentStep + 1;

    if (current.nextId) {
        nextStep = story.findIndex(s => s.id === current.nextId);
    }

    if (nextStep < story.length && nextStep !== -1) {
        historyStack.push(currentStep);

        // 몽타주 씬에서 넘어갈 때나 배경이 다를 때 화면 전환
        if (current.type === 'montage' || story[nextStep].bg !== story[currentStep].bg) {
            changeScene(nextStep, true);
        } else {
            currentStep = nextStep;
            updateStory();
        }
    }
}

function goPrev() {
    if (isTransitioning) return;
    clearTimeout(autoTimer);

    if (historyStack.length > 0) {
        let prevStep = historyStack.pop();

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
    pendingTargetStep = targetStep; // 스킵 시 이동할 목표 지점 저장    
    hideBubble();
    if (choices) choices.style.display = "none";

    const phonePopup = document.getElementById('phone-popup');
    if (phonePopup) phonePopup.style.display = 'none';

    clearTimeout(autoTimer);

    if (isNext) {
        if(char) char.classList.add('walk-off');
        // 2.7초 타이머를 변수에 담아둡니다 (스킵할 때 부수기 위해)
        walkOffTimer = setTimeout(() => {
            walkOffTimer = null;
            executeFade(targetStep);
        }, 2700);
    } else {
        executeFade(targetStep);
    }
}

// ⭐️ 암전 및 화면 교체 로직을 담당하는 새 함수
function executeFade(targetStep) {
    fade.classList.add('fade-out');

    setTimeout(() => {
        currentStep = targetStep;

        // 몽타주 타입일 때는 배경 초기화를 건너뜀
        if (story[currentStep].type !== 'montage') {
            bg.style.backgroundImage = `url('${story[currentStep].bg}')`;
        }

        bgPosX = 0;
        bg.style.left = "0px";

        if(char) char.classList.remove('walk-off');
        updateStory();

        fade.classList.remove('fade-out');

        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
    }, 1000);
}

// ⭐️ 배경 스크롤 기능
function gameLoop() {
    let current = story[currentStep];
    if (!current) return;

    const scrollScenes = ['dsr.png', 'Gn.png', 'dongtan_lake.png', ...dDayScenes];

    if (scrollScenes.includes(current.bg) || current.type === 'montage') {
        if (bgPosX > -4000) {
            bgPosX -= walkSpeed;
            bg.style.left = bgPosX + "px";
        }
    }
}

function showBubble(text) {
    if(bubble) {
        bubble.innerText = text;
        bubble.style.display = "block";
    }
}

function hideBubble() {
    if(bubble) bubble.style.display = "none";
}

// ⭐️ 대화창 터치 시 다음으로 넘어가기
if (bubble) {
    bubble.addEventListener('click', goNext);
}

setInterval(gameLoop, 30);
