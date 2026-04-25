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
const story = [
    // =========================================================
    // 👩🏻 [루트 A] 진아의 이야기 시작
    // =========================================================
    { id: 'jina_start', bg: 'dsr.png', title: "2019년도", text: "때는 2019, 진아는 갓 입사한 신입사원이다.",walkOff: true},
    { bg: 'Gn.png', title: "모바일 그룹", text: "진아: 안녕하십니까!"},
    { bg: 'hm.png', title: "모바일 그룹", text: "1년 뒤, 2020 형민이가 입사한다."},
    { bg: 'hm.png', title: "모바일 그룹", text: "진아: 저 잘생긴 오빠 뭐지? 흥미가 생긴다.", showHyungmin: true},
    { bg: 'hm.png', title: "모바일 그룹", text: "실제로 20년도의 형민이는 잘생겼었다.", showHyungmin: true},
    
    { bg: 'hm.png', text: "형민: 안녕 선배?", showHyungmin: true},
    { bg: 'hm.png', text: "진아: 어.. 안녕?", showHyungmin: true},

    { bg: 'room1.png', title: "21년 봄과 여름 사이", text: "진아가 방에 누워있다." },
    { bg: 'room1.png', text: "진아 : 심심한데 형민오빠 뭐하고 있지? " },

    {
        bg: 'room1.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "전화건다", target: "call_oppa" },
            { text: "다시 눕는다", target: "sleep_again" }
        ]
    },

    { id: 'call_oppa', bg: 'room1.png', text: "뚜루루루... 오빠 바빠?" },
    { bg: 'room1.png', text: "형민: 아니, 왜?" },
    { bg: 'room1.png', text: "진아: 나랑 놀래? (두근두근)"},
    { bg: 'room1.png', text: "형민: 좋아!" , nextId: 'go_to_watch_movie' },

    { id: 'sleep_again', bg: 'room1.png', text: "진아: 흠.. 아무래도 심심한데 전화 해봐야겠어.", nextId: 'call_oppa' },

    { id: 'go_to_watch_movie', bg: 'mega.png', text: "동탄 북광장 메가박스", walkOff: true, showHyungmin: true},
    { bg: 'mega.png', text: "형민, 진아 : (어색하게) 안녕!" , showHyungmin: true},

    { bg: 'fishzip.png', text: "영화 보고 나와서 술집을 갔다." , showHyungmin: true},
    { bg: 'fishzip.png', text: "형민: 너 나 좋아하냐? " , showHyungmin: true},
    { bg: 'fishzip.png', text: "진아: .. (뭐지 이 테토맨은? 테스토스테론이 흘러 넘치다 못해 과한데? ) " , showHyungmin: true},
    { bg: 'fishzip.png', text: "형민: 난 여자랑 1:1로 안논다. 관심없으면 " , showHyungmin: true},

    {
        bg: 'fishzip.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "나도 좋아..!", target: "show_your_mind" },
            { text: "뭔 소리여", target: "dog_sound" }
        ]
    },

    { id: "show_your_mind", bg: 'fishzip.png', text: "(관심없다고 하면 다신 나랑 안놀 거 거 같아.. 일단 지르자) " , showHyungmin: true},
    { bg: 'fishzip.png', text: "진아: 나도 오빠 좋아..!" , nextId: 'some_ing', showHyungmin: true},

    { id: "dog_sound", bg: 'fishzip.png', text: "진아: (뭔 소리야 이 오빠는? )" , nextId: 'show_your_mind', showHyungmin: true} ,

    { id: "some_ing", bg: 'fishzip.png', text: "이때부터 썸을 탔다." , showHyungmin: true},
    { bg:  'dongtan_lake.png', text: "2021.10.23 동탄호수공원" , showHyungmin: true},
    { bg:  'dongtan_lake.png', text: "진아: (벌써 호수만 5바퀴째야, 이 오빠 고백할건가?)" , showHyungmin: true},
    { bg:  'dongtan_lake.png', text: "진아: 오빠 뭐 할 말 있어?" , showHyungmin: true},
    { bg:  'dongtan_lake.png', text: "한참을 뜸을 들인다." , showHyungmin: true},
    { bg:  'dongtan_lake.png', text: "형민: 우리 3개월만 만나볼래?" , showHyungmin: true},

    {
        bg: 'dongtan_lake.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "이게 말이야 방구야", target: "show_your_mind2" },
            { text: "못 들은 척 한다", target: "dog_sound2" }
        ]
    },

    { id: "show_your_mind2", bg: 'dongtan_lake.png', text: "(이게 말이야 방구야) " },
    { bg: 'dongtan_lake.png', text: "진아: 다시 고백해!!!" , showHyungmin: true},
    { bg:  'dongtan_lake.png', text: "한참을 뜸을 들인다." , showHyungmin: true},
    { bg: 'dongtan_lake.png', text: "형민: 우리 만나보자" , showHyungmin: true},
    { bg: 'dongtan_lake.png', text: "진아: 좋아!" , nextId: 'dating', showHyungmin: true},

    { id: "dog_sound2", bg: 'dongtan_lake.png', text: "진아: 뭐라고?" , nextId: 'show_your_mind2', showHyungmin: true} ,

    { id: "dating", bg: 'dongtan_lake.png', text: "그렇게 우리는 사귀게 되었다.", showHyungmin: true },

    {
        id: "season_montage",
        type: "montage",
        walkOff: true,
        text: "우리의 시간은 쉼 없이 흘러...",
        nextId: "여울"
    },

    { id : '여울', bg: '여울.png', title: '25년 봄과 여름 사이',text: "진아: 오빠 같이 살자.", showHyungmin: true},
    { bg: '여울.png', text: "형민: 나는 아직 잘 모르겠어..", showHyungmin: true},
    { bg: '여울.png', text: "진아: 나 그럼 결혼하러 갈게..!",walkOff: true, showHyungmin: true},
    
    {id: "sad_time",bg : "rainy_day.png", text: "하 ,, 오빠 없으니 삶이 너무 무료하다."},
    {bg : "rainy_day.png", text: "난 결혼이 하고 싶었던게 아니라 오빠랑 함께이고 싶었던거구나 .."},
    {bg : "rainy_day.png", text: "(나쁜 오빠)", nextId: "messenger_part",walkOff: true},

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
    { bg: 'room2.png', text: "진아: 이 오빠 술 마셨네"},
    { bg: 'room2.png', text: "진아: 흠.. 근데 왜 연락했지?"},

    {
        bg: 'room2.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "궁금하니 연락해본다.", target: "call_him" },
            { text: "차단하기", target: "blocking" }
        ]
    },

    { id: "call_him", bg: 'room2.png', text: " (타닥타닥) 왜 연락했어? " },
    { bg: 'room2.png', text: "형민: (문자) 만나서 얘기하자 " , nextId: 'izakaya'},
    
    { id: "blocking", bg: 'room2.png', text: "진아: 차단하자."} ,
    { bg: 'room2.png', text: "진아: 흠.. 그래도 왜 연락했는지 물어나 볼까.." , nextId: 'call_him'},

    { id: "izakaya", bg: 'izakaya.png', title: '25년 겨울',text: "영천동 어딘가 이자카야" , showHyungmin: true},
    { bg:  'izakaya.png', text: "형민: 너가 없는 시간이 힘들었어." , showHyungmin: true},
    { bg:  'izakaya.png', text: "진아: 나도 오빠 없으니 인생이 너무 재미가 없었어." , showHyungmin: true},
    { bg:  'izakaya.png', text: "형민: 잘 할게 (잘 하자?)" , showHyungmin: true},

    { bg:  'proposal.png', text: "형민: 진아야 결혼하자!" , showHyungmin: true},
    // ⭐️ 진아 이야기의 마지막! 여기서 퀴즈로 점프합니다.
    { bg:  'proposal.png', text: "진아: 좋아!" , showHyungmin: true, nextId: 'final_quiz_start' },


    // =========================================================
    // 👦🏻 [루트 B] 형민의 이야기 시작 (여기에 이어서 작성하세요!)
    // =========================================================
    { id: 'hm_start', bg: 'dsr.png', text: "때는 2020년, 나는 설레는 마음으로 입사했다." },
    { bg: 'Gn.png', title: "모바일 그룹", text: "형민: 안녕하십니까! 신입사원입니다!"},
    // ⭐️ 형민이 이야기 마지막 부분은 다음 퀴즈 파트로 자연스럽게 넘어가게 nextId를 걸어주세요!
    { bg: 'hm.png', title: "모바일 그룹", text: "형민: (우와... 저 선배 예쁘다.)", showHyungmin: true, nextId: 'final_quiz_start' },
    

    // =========================================================
    // 💍 [마지막 공통 퀴즈]
    // =========================================================
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

// 1. 대본 출력 함수
function updateStory() {
    let current = story[currentStep];

    clearTimeout(autoTimer);
    clearInterval(dayTimer);
    if (msgTimer) clearInterval(msgTimer);

    const dayCounter = document.getElementById('day-counter');
    const phonePopup = document.getElementById('phone-popup');
    const sceneTitle = document.getElementById('scene-title');
    const charHyungmin = document.getElementById('char-hyungmin');
    const photoGallery = document.getElementById('photo-gallery');
    const chatBox = document.getElementById('chat-box');

    if (dayCounter) dayCounter.style.display = 'none';
    if (phonePopup) phonePopup.style.display = 'none';
    if (char) char.classList.remove('walking');
    isDdayRunning = false;
    
    nextBtn.classList.remove('hidden');
    prevBtn.classList.remove('hidden');

    if (sceneTitle) {
        if (current.title) {
            sceneTitle.innerText = current.title;
            sceneTitle.style.display = 'block';
        } else {
            sceneTitle.style.display = 'none';
        }
    }

    if (charHyungmin) {
        charHyungmin.style.display = current.showHyungmin ? 'block' : 'none';
    }

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
    if (current.type === 'montage') {
        if (dayCounter) dayCounter.style.display = 'block';
        if (char) char.classList.add('walking');
        if (current.text) showBubble(current.text);
        else hideBubble();
        
        let sceneIndex = 0;
        currentDay = 1;
        
        if (!current.bg) {
            bg.style.backgroundImage = `url('${dDayScenes[sceneIndex]}')`;
        } else {
            bg.style.backgroundImage = `url('${current.bg}')`;
        }

        dayTimer = setInterval(() => {
            currentDay += 5; 
            if (dayCounter) dayCounter.innerText = `D+${currentDay}`;
            if (!current.bg && currentDay >= (sceneIndex + 1) * 450 && sceneIndex < dDayScenes.length - 1) {
                sceneIndex++;
                bg.style.backgroundImage = `url('${dDayScenes[sceneIndex]}')`;
            }

            if (currentDay >= 1815) {
                clearInterval(dayTimer);
                if (char) char.classList.remove('walking');
                setTimeout(goNext, 1000);
            }
        }, 10);

        return; 
    }

    // =========================================================
    if (current.type === 'messenger') {
        if (bubble) bubble.style.display = "none";
        if (choices) choices.style.display = "none";

        if (currentSubStep === 0) {
            if (phonePopup) phonePopup.style.display = 'none';
        } else {
            if (phonePopup) phonePopup.style.display = 'block';
            if (chatBox) {
                chatBox.innerHTML = '';
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

        if (currentSubStep < current.messages.length + 1) {
            clearTimeout(autoTimer);
            autoTimer = setTimeout(() => {
                goNext();
            }, 1500); 
        } else {
            clearTimeout(autoTimer);
            autoTimer = setTimeout(() => {
                goNext();
            }, autoDelay);
        }
        return;
    }

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

    if (choices) choices.style.display = "none";
    showBubble(current.text);

    if (currentStep === 0) prevBtn.classList.add('hidden');
    if (currentStep === story.length - 1) nextBtn.classList.add('hidden');

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
    if (isTransitioning) {
        if (walkOffTimer) {
            clearTimeout(walkOffTimer); 
            walkOffTimer = null;
            executeFade(pendingTargetStep); 
        }
        return; 
    }
    
    clearTimeout(autoTimer);
    clearInterval(dayTimer); 
    let current = story[currentStep];

    if (current.type === 'messenger' && currentSubStep < current.messages.length + 1) {
        currentSubStep++;
        updateStory();
        return;
    }

    let nextStep = currentStep + 1;
    if (current.nextId) {
        nextStep = story.findIndex(s => s.id === current.nextId);
    }

    if (nextStep < story.length && nextStep !== -1) {
        historyStack.push(currentStep);
        currentSubStep = 0; 

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
    clearInterval(dayTimer); 
    let current = story[currentStep];

    if (current.type === 'messenger' && currentSubStep > 0) {
        currentSubStep--;
        updateStory();
        return;
    }

    if (historyStack.length > 0) {
        let prevStep = historyStack.pop();
        currentSubStep = 0; 

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
    clearInterval(dayTimer); 
    
    let current = story[currentStep];

    if (isNext && current.walkOff) {
        if(char) char.classList.add('walk-off');
        walkOffTimer = setTimeout(() => {
            walkOffTimer = null;
            executeFade(targetStep);
        }, 2700);
    } else {
        executeFade(targetStep);
    }
}

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

function gameLoop() {
    let current = story[currentStep];
    if (!current) return;

    const scrollScenes = ['rainy_day.png', ...dDayScenes];

    if (scrollScenes.includes(current.bg) || current.type === 'montage') {
        if (bgPosX > -6000) {
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

if (bubble) {
    bubble.addEventListener('click', (e) => {
        e.stopPropagation();
        goNext();
    });
}

setInterval(gameLoop, 30);

const gameContainer = document.getElementById('game-container');
if (gameContainer) {
    gameContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        
        if (isTransitioning && walkOffTimer) {
            goNext();
            return;
        }

        let current = story[currentStep];
        if (!isTransitioning && current && current.type !== 'choice') {
            goNext();
        }
    });
}


// =========================================================
// ⭐️ 시작 화면 & 프리로딩 로직 (맨 밑에 추가됨)
// =========================================================
const imagesToPreload = [
    'dsr.png', 'Gn.png', 'hm.png', 'room1.png', 'mega.png', 'fishzip.png', 
    'dongtan_lake.png', '여울.png', 'room2.png', 'bg2.png', 'character.png', 
    'char-hyungmin.png', 'rainy_day.png', 'izakaya.png', 'proposal.png',
    'autumn2.png', 'winter.png', 'spring.png', 'summer.png'
];

let loadedCount = 0;
let isLoaded = false;
let chosenRoute = null;

function preloadAllImages() {
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');

    if (imagesToPreload.length === 0) {
        finishLoading(loadingText);
        return;
    }

    // ⭐️ 무적의 안전장치: 5초(5000ms)가 지나면 강제로 로딩을 끝냅니다!
    let fallbackTimer = setTimeout(() => {
        if (!isLoaded) {
            console.warn("⏳ 로딩 시간 초과! 강제로 시작 화면을 띄웁니다.");
            finishLoading(loadingText);
        }
    }, 5000);

    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => { loadedCount++; updateProgress(); };
        img.onerror = () => { 
            console.error("❌ 이미지 로드 실패:", src);
            loadedCount++; updateProgress(); 
        };
    });

    function updateProgress() {
        const progress = (loadedCount / imagesToPreload.length) * 100;
        if (loadingBar) loadingBar.style.width = progress + '%';

        if (loadedCount === imagesToPreload.length) {
            clearTimeout(fallbackTimer); // ⭐️ 정상적으로 다 불러왔으면 강제 종료 타이머 취소
            finishLoading(loadingText);
        }
    }
}

function finishLoading(loadingText) {
    isLoaded = true;
    if (loadingText) loadingText.innerText = "로딩 완료! 이야기를 선택해주세요.";
    checkStartGame(); 
}

function selectRoute(routeId) {
    chosenRoute = routeId;
    
    document.getElementById('btn-jina').classList.remove('selected');
    document.getElementById('btn-hm').classList.remove('selected');
    
    if (routeId === 'jina_start') document.getElementById('btn-jina').classList.add('selected');
    if (routeId === 'hm_start') document.getElementById('btn-hm').classList.add('selected');

    checkStartGame();
}

function checkStartGame() {
    if (isLoaded && chosenRoute) {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0'; 
        
        let targetIndex = story.findIndex(s => s.id === chosenRoute);
        if (targetIndex !== -1) {
            currentStep = targetIndex;
        } else {
            currentStep = 0; 
        }

        setTimeout(() => {
            loadingScreen.style.display = 'none';
            updateStory(); 
        }, 500);
    }
}

preloadAllImages();
