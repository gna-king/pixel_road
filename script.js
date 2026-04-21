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

// ⭐️ 카톡 화면 제어용 변수 추가
let currentSubStep = 0; 

// ⭐️ 몽타주 계절 배경 목록 (폴더에 이 파일들이 있어야 합니다!)
const dDayScenes = ['autumn2.png', 'winter.png', 'spring.png', 'summer.png'];

// === 대본 (Story) ===
// (진아님이 수정하신 대본 원본 그대로 유지했습니다!)
const story = [
    { bg: 'dsr.png', text: "때는 2019, 진아는 갓 입사한 신입사원이다."},
    
    // ⭐️ title 속성을 넣으면 상단에 제목이 뜹니다.
    { bg: 'Gn.png', title: "모바일 그룹", text: "진아: 안녕하십니까!"},
    { bg: 'hm.png', title: "모바일 그룹", text: "1년 뒤, 2020 형민이가 입사한다."},
    { bg: 'hm.png', title: "모바일 그룹", text: "진아: 저 잘생긴 오빠 뭐지? 흥미가 생긴다."},
    { bg: 'hm.png', title: "모바일 그룹", text: "실제로 20년도의 형민이는 잘생겼었다."},
    
    // title 속성이 없으면 제목이 스르륵 사라집니다.
    { bg: 'hm.png', text: "형민: 안녕 선배?", showHyungmin: true},
    { bg: 'hm.png', text: "진아: 어.. 안녕?", showHyungmin: true},

    { bg: 'room1.png', text: "21년 봄과 여름 사이 어디쯤, 진아가 방에 누워있다." },
    { bg: 'room1.png', text: "진아 : 심심한데 형민오빠 뭐하고 있지? " },

    // [선택지 파트]
    {
        bg: 'room1.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "전화건다", target: "call_oppa" },
            { text: "다시 눕는다", target: "sleep_again" }
        ]
    },

    // --- [분기점 1] 전화건다 ---
    { id: 'call_oppa', bg: 'room1.png', text: "뚜루루루... 오빠 바빠?" },
    { bg: 'room1.png', text: "형민: 아니, 왜?" },
    { bg: 'room1.png', text: "진아: 나랑 놀래? (두근두근)"},
    { bg: 'room1.png', text: "형민: 좋아!" , nextId: 'go_to_watch_movie' },

    // --- [분기점 2] 다시 눕는다 ---
    { id: 'sleep_again', bg: 'room1.png', text: "진아: 흠.. 아무래도 심심한데 전화 해봐야겠어.", nextId: 'call_oppa' },

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
    { id: "show_your_mind", bg: 'fishzip.png', text: "(관심없다고 하면 다신 나랑 안놀 거 같아.. 일단 지르자) " },
    { bg: 'fishzip.png', text: "진아: 나도 오빠 좋아..!" , nextId: 'some_ing'},

    // --- [분기점 2]  ---
    { id: "dog_sound", bg: 'fishzip.png', text: "진아: (뭔 소리야 이 오빠는? )" , nextId: 'show_your_mind'} ,

    { id: "some_ing", bg: 'fishzip.png', text: "이때부터 썸을 탔다." },
    { bg:  'dongtan_lake.png', text: "2021.10.23 동탄호수공원" },
    { bg:  'dongtan_lake.png', text: "진아: (벌써 호수만 5바퀴째야, 이 오빠 고백할건가?)" },
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
        nextId: "여울"
    },

    { id : '여', bg: '여울.png', text: "진아: 오빠 같이 살자."},
    { bg: '여울.png', text: "형민: 나는 아직 잘 모르겠어.."},
    { bg: '여울.png', text: "진아: 나 그럼 결혼하러 갈게..!"},
    // ⭐️ [몽타주 파트] 사계절 자동 전환 및 D-day 연출
    {
        id: "sad_time",
        type: "montage",
        text: "하 ,, 오빠 없으니 삶이 너무 무료하다.",
        nextId: "messenger_part"
    },
    
    // ⭐️ 카톡 연출 파트
    {
        id: "messenger_part",
        bg: 'room2.png',
        type: 'messenger',
        title: '25년 겨울',
        messages: [
            "자니?",
            "자는구나...",
            "잘 자"
        ]
    },
    // title 속성이 없으면 제목이 스르륵 사라집니다.
    { bg: 'room2.png', text: "진아: 이 오빠 술 마셨네"},
    { bg: 'room2.png', text: "진아: 흠.. 근데 왜 연락했지?"},

    // [선택지 파트]
    {
        bg: 'room2.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "궁금하니 연락해본다.", target: "call_him" },
            { text: "차단하기", target: "blocking" }
        ]
    },

    // --- [분기점 1] ---
    { id: "call_him", bg: 'room2.png', text: " (타닥타닥) 왜 연락했어? " },
    { bg: 'room2.png', text: "형민: (문자) 만나서 얘기하자 "},
    
    // --- [분기점 2]  ---
    { id: "blocking", bg: 'room2.png', text: "진아: 차단하자."} ,
    { bg: 'room2.png', text: "진아: 흠.. 그래도 왜 연락했는지 물어나 볼까.." , nextId: 'call_him'},

    { id: "izakaya", bg: 'izakaya.png', text: "영천동 어딘가 이자카야" },
    { bg:  'izakaya.png', text: "형민: 너가 없는 시간이 힘들었어." },
    { bg:  'izakaya.png', text: "진아: 나도 오빠 없으니 인생이 너무 재미가 없었어." },
    
    { bg:  'proposal.png', text: "형민: 진아야 결혼하자!" },
    { bg:  'proposal.png', text: "진아: 좋아!" },

    
    
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
    const chatBox = document.getElementById('chat-box');

    // 기본 숨김 처리 및 버튼 보이기
    if (dayCounter) dayCounter.style.display = 'none';
    if (phonePopup) phonePopup.style.display = 'none';
    if (char) char.classList.remove('walking');
    isDdayRunning = false;
    
    // ⭐️ 기본적으로 이전/다음 버튼 활성화
    nextBtn.classList.remove('hidden');
    prevBtn.classList.remove('hidden');

    // 챕터 제목 처리
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
    // ⭐️ 몽타주(사계절 자동 전환 & D-day) 로직 (버튼 유지)
    // =========================================================
    if (current.type === 'montage') {
        if (dayCounter) dayCounter.style.display = 'block';
        if (char) char.classList.add('walking');
        // ⭐️ 이전/다음 버튼을 숨기지 않음

        let sceneIndex = 0;
        currentDay = 1;

        bg.style.backgroundImage = `url('${dDayScenes[sceneIndex]}')`;

        dayTimer = setInterval(() => {
            // 1️⃣ 한 번에 며칠씩 올라가게 할지 결정 (현재: 5일씩 팍팍)
            // ⭐️ 1씩 차근차근 올라가게 하고 싶다면 currentDay += 1; 로 바꾸세요!
            currentDay += 5; 
            if (dayCounter) dayCounter.innerText = `D+${currentDay}`;

// ⭐️ 수정된 부분: 150일, 300일, 450일을 "넘어갈 때마다" 배경을 바꿉니다!
            if (currentDay >= (sceneIndex + 1) * 150 && sceneIndex < dDayScenes.length - 1) {
                sceneIndex++;
                bg.style.backgroundImage = `url('${dDayScenes[sceneIndex]}')`;
            }

            // 600일이 되면 자동으로 넘김 (기다리기 싫으면 다음 버튼 누르면 됨)
            if (currentDay >= 1815) {
                clearInterval(dayTimer);
                if (char) char.classList.remove('walking');
                setTimeout(goNext, 1000);
            }
           // 2️⃣ 얼마나 자주 숫자를 올릴지 시간 간격 결정 (현재: 30 밀리초)
        // ⭐️ 이 숫자를 10으로 줄이면 엄청 빨라지고, 100으로 늘리면 천천히 올라갑니다! 
        }, 5);

        return; 
    }

    // =========================================================
    // ⭐️ 카카오톡 메신저 연출 파트 (버튼으로 단계 제어)
    // =========================================================
    if (current.type === 'messenger') {
        if (bubble) bubble.style.display = "none";
        if (choices) choices.style.display = "none";

        // 서브스텝에 따른 동작 (0: 배경만, 1: 빈 스마트폰, 2~: 메시지 추가)
        if (currentSubStep === 0) {
            if (phonePopup) phonePopup.style.display = 'none';
        } else {
            if (phonePopup) phonePopup.style.display = 'block';
            if (chatBox) {
                chatBox.innerHTML = '';
                // 단계에 맞춰 메시지를 화면에 출력
                for (let i = 0; i < currentSubStep - 1; i++) {
                    if (current.messages[i]) {
                        const msgDiv = document.createElement('div');
                        msgDiv.className = 'chat-msg';
                        msgDiv.innerText = current.messages[i];
                        chatBox.appendChild(msgDiv);
                    }
                }
            }
        }
// ⭐️ [새로 추가된 로직] 자동으로 다음 단계 넘기기
        if (currentSubStep < current.messages.length + 1) {
            // 카톡이 다 오기 전까지는 1.5초(1500ms)마다 자동으로 다음 메시지를 띄웁니다.
            clearTimeout(autoTimer);
            autoTimer = setTimeout(() => {
                goNext();
            }, 1500); 
        } else {
            // 카톡이 다 도착하고 나면 기존 대화 속도(autoDelay)에 맞춰서 다음 장면으로 넘어갑니다.
            clearTimeout(autoTimer);
            autoTimer = setTimeout(() => {
                goNext();
            }, autoDelay);
        }



        
        return;
    }

    // =========================================================
    // 선택지 파트
    // =========================================================
    if (current.type === 'choice') {
        if (bubble) bubble.style.display = "none";
        if (choices) choices.style.display = "block";
        nextBtn.classList.add('hidden'); // 선택지 화면에서는 다음 버튼 숨김

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
    if (currentStep === story.length - 1) nextBtn.classList.add('hidden');

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
    // 1. 걸어나가는 모션 중일 때 터치하면 스킵!
    if (isTransitioning) {
        if (walkOffTimer) {
            clearTimeout(walkOffTimer); 
            walkOffTimer = null;
            executeFade(pendingTargetStep); 
        }
        return; 
    }
    
    clearTimeout(autoTimer);
    let current = story[currentStep];

    // ⭐️ 2. 카톡 장면 서브 스텝 이동
    if (current.type === 'messenger' && currentSubStep < current.messages.length + 1) {
        currentSubStep++;
        updateStory();
        return;
    }

    // 3. 일반 다음 장면 이동
    let nextStep = currentStep + 1;
    if (current.nextId) {
        nextStep = story.findIndex(s => s.id === current.nextId);
    }

    if (nextStep < story.length && nextStep !== -1) {
        historyStack.push(currentStep);
        currentSubStep = 0; // ⭐️ 다음 씬으로 넘어가면 서브스텝 초기화

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
    let current = story[currentStep];

    // ⭐️ 1. 카톡 장면 서브 스텝 이전 이동
    if (current.type === 'messenger' && currentSubStep > 0) {
        currentSubStep--;
        updateStory();
        return;
    }

    // 2. 일반 이전 장면 이동
    if (historyStack.length > 0) {
        let prevStep = historyStack.pop();
        currentSubStep = 0; // ⭐️ 이전 씬으로 갈 때도 서브스텝 초기화

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
    pendingTargetStep = targetStep; 
    hideBubble();
    if (choices) choices.style.display = "none";

    const phonePopup = document.getElementById('phone-popup');
    if (phonePopup) phonePopup.style.display = 'none';

    clearTimeout(autoTimer);

    if (isNext) {
        if(char) char.classList.add('walk-off');
        walkOffTimer = setTimeout(() => {
            walkOffTimer = null;
            executeFade(targetStep);
        }, 2700);
    } else {
        executeFade(targetStep);
    }
}

// 암전 및 화면 교체
function executeFade(targetStep) {
    fade.classList.add('fade-out');

    setTimeout(() => {
        currentStep = targetStep;

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

// ⭐️ 진아님이 수정하신 배경 스크롤 기능 유지
function gameLoop() {
    let current = story[currentStep];
    if (!current) return;

    const scrollScenes = [ ...dDayScenes];

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

// ⭐️ 대화창 터치 시 다음으로 넘어가기 (중복 터치 방지 추가)
if (bubble) {
    bubble.addEventListener('click', (e) => {
        e.stopPropagation();
        goNext();
    });
}

setInterval(gameLoop, 30);

// =========================================================
// ⭐️ 화면 전체 터치 감지기
// =========================================================
const gameContainer = document.getElementById('game-container');
if (gameContainer) {
    gameContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        
        // 걸어나가는 중 스킵
        if (isTransitioning && walkOffTimer) {
            goNext();
            return;
        }

        // 카톡/몽타주 화면에서도 빈 바탕 누르면 '다음' 버튼 누른 것과 같게 작동
        let current = story[currentStep];
        if (!isTransitioning && current && current.type !== 'choice') {
            goNext();
        }
    });
}
