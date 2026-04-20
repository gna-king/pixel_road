const bg = document.getElementById('background');
const bubble = document.getElementById('bubble');
const choices = document.getElementById('choices');
const fade = document.getElementById('fade-overlay');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const char = document.getElementById('character'); 

let bgPosX = 0;          
const walkSpeed = 2;     

let autoTimer; 
const autoDelay = 4500; // 4.5초 뒤 자동 넘김

// 지나온 길을 기억하는 타임머신 배열
let historyStack = [];

const story = [
    { bg: 'dsr.png', text: "때는 2019, 진아는 갓 입사한 신입사원이다."},
    { bg: 'Gn.png', text: "진아: 안녕하십니까!"},
    
    { bg: 'Gn.png', text: "1년 뒤, 2020 형민이가 입사한다."},
    { bg: 'hm.png', text: "진아: 저 잘생긴 오빠 뭐지? 흥미가 생긴다."},
    { bg: 'hm.png', text: "실제로 20년도의 형민이는 잘생겼었다."},
    { bg: 'hm.png', text: "형민: 안녕 선배?"},

 //   { bg: 'bg2.png', text: "여기는 우리의 추억이 담긴 갤러리야." },
 //   { bg: 'bg2.png', text: "모바일 동기들과의 즐거운 시간"},
 //   { bg: 'bg2.png', text: "우리가 처음 만난 날 기억나?", photos: ['photo1'] }, 
 //   { bg: 'bg2.png', text: "첫 여행 갔을 때 정말 재밌었는데!", photos: ['photo1', 'photo2'] }, 
 //   { bg: 'bg2.png', text: "웨딩 촬영 날도 빼놓을 수 없지.", photos: ['photo1', 'photo2', 'photo3'] }, 

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
    // ⭐️ 눕는다를 선택하면 이 대사를 치고, 바로 분기점 1번(call_oppa)으로 점프시켜버립니다!
    { id: 'sleep_again', bg: 'room.png', text: "진아: 흠.. 아무래도 심심한데 전화 해봐야겠어.", nextId: 'call_oppa' },

    // ==========================================
    // --- [새로운 장면] 영화관 데이트 ---
    // ==========================================
    
    // ⭐️ 분기점 1번이 끝난 후 여기로 도착합니다!
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

    {  id: "some_ing", bg: 'fishzip.png', text: "이때부터 썸을 탔다." },     
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

    {  id: "dating", bg: 'dongtan_lake.png', text: "그렇게 우리는 사귀게 되었다." },     
    {  id: "dating", bg: 'dongtan_lake.png', text: "" },         


    
    
    
    // [마지막 퀴즈 파트] ⭐️ 새로운 시스템으로 통일했습니다!
    { 
        id: 'final_quiz_start', // 👆 위 분기점들이 끝난 후 여기로 점프해서 모입니다!
        bg: 'bg2.png', 
        type: 'choice', 
        question: "우리가 처음 만난 계절은?", 
        photos: ['photo1', 'photo2', 'photo3'],
        options: [
            { text: "봄 (정답)", target: "link" }, // 정답 시 청첩장으로 이동
            { text: "겨울", target: "wrong" }      // 오답 시 처리
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

    clearTimeout(autoTimer);

    // 갤러리 사진 처리
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

    // ⭐️ 선택지 창 띄우기 및 버튼 생성
    if (current.type === 'choice') {
        bubble.style.display = "none";     
        choices.style.display = "block";   
        nextBtn.classList.add('hidden'); 
        
        choices.innerHTML = `<p id="question">${current.question}</p>`;
        current.options.forEach(opt => {
            choices.innerHTML += `<button onclick="makeChoice('${opt.target}')">${opt.text}</button>`;
        });
        return; 
    }

    choices.style.display = "none";
    showBubble(current.text);

    if (currentStep === 0) prevBtn.classList.add('hidden');
    else prevBtn.classList.remove('hidden');

    if (currentStep === story.length - 1) nextBtn.classList.add('hidden');
    else nextBtn.classList.remove('hidden');

    // 대본에 nextId(점프)가 없을 때만 타이머 작동
    if (currentStep < story.length - 1 && !current.nextId) {
        autoTimer = setTimeout(() => {
            goNext();
        }, autoDelay);
    }
}

// 2. ⭐️ 빠져있던 버튼 선택 로직 추가! 
function makeChoice(target) {
    if (target === 'link') {
        // 정답을 맞춘 경우
        choices.style.display = "none";
        showBubble("딩동댕! 이제 진짜 청첩장을 확인하러 갈까?");
        setTimeout(() => { window.location.href = "https://gna-king.github.io/happy-wedding-day/"; }, 2000);
    } else if (target === 'wrong') {
        // 틀린 경우
        choices.style.display = "none";
        showBubble("땡! 다시 한 번 잘 생각해봐!");
        setTimeout(() => { updateStory(); }, 2000);
    } else {
        // 일반적인 분기점(전화걸기/눕기) 선택 시 점프
        let targetIndex = story.findIndex(s => s.id === target);
        if (targetIndex !== -1) {
            historyStack.push(currentStep); // 이동 전 위치 저장
            
            if (story[targetIndex].bg !== story[currentStep].bg) {
                changeScene(targetIndex, true);
            } else {
                currentStep = targetIndex;
                updateStory();
            }
        }
    }
}

// 3. ⭐️ 점프 기능이 추가된 다음 버튼
function goNext() {
    if (isTransitioning) return; 
    clearTimeout(autoTimer); 
    
    let current = story[currentStep];
    let nextStep = currentStep + 1; // 기본은 바로 다음 줄

    // 대본에 nextId가 있다면 그 번호로 점프!
    if (current.nextId) {
        nextStep = story.findIndex(s => s.id === current.nextId);
    }

    if (nextStep < story.length && nextStep !== -1) {
        historyStack.push(currentStep); // 이동 전 위치 저장
        
        if (story[nextStep].bg !== story[currentStep].bg) {
            changeScene(nextStep, true); 
        } else {
            currentStep = nextStep;
            updateStory();
        }
    }
}

// 4. ⭐️ 길을 잃지 않는 이전 버튼
function goPrev() {
    if (isTransitioning) return;
    clearTimeout(autoTimer);
    
    // historyStack에 저장된 '최근 위치'로 되돌아갑니다.
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

// 장면 전환
function changeScene(targetStep, isNext) {
    isTransitioning = true;
    hideBubble();
    choices.style.display = "none";
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
            updateStory(); 
            
            fade.classList.remove('fade-out'); 
            
            setTimeout(() => {
                isTransitioning = false; 
            }, 1000);
        }, 1000); 
    }, delayBeforeFade);
}

// 배경 스크롤 루프
function gameLoop() {
    if (story[currentStep] && story[currentStep].bg === 'dsr.png') {
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

setInterval(gameLoop, 30);
