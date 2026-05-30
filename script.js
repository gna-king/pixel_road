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
let currentSubStep = 0; 
const dDayScenes = ['autumn.png', 'winter.png', 'spring.png', 'summer.png'];

// === 대본 (Story) ===
const story = [
    // =========================================================
    // 👩🏻 [루트 A] 진아의 이야기 시작
    // =========================================================
    // ⭐️ J1 버그 수정: 첫 장면에 있던 walkOff: true 제거 (날아오지 않음)
    { id: 'jina_start', bg: 'dsr.png', title: "2019년도", text: "때는 2019, 진아는 갓 입사한 신입사원이다."},
    { bg: 'gn_office.png', title: "모바일 그룹", text: "진아: 안녕하십니까!"},
    { bg: 'hm_office.png', title: "모바일 그룹", text: "1년 뒤, 2020 형민이가 입사한다.", noFade: true},
    { bg: 'hm_office.png', title: "모바일 그룹", text: "진아: 저 잘생긴 오빠 뭐지? 흥미가 생긴다.", showHyungmin: true},
    { bg: 'hm_office.png', title: "모바일 그룹", text: "실제로 20년도의 형민이는 잘생겼었다.", showHyungmin: true},
    
    { bg: 'hm_office.png', title: "모바일 그룹", text: "형민: 안녕 선배?", showHyungmin: true},
    { bg: 'hm_office.png', title: "모바일 그룹", text: "진아: 어.. 안녕?", showHyungmin: true},

    { bg: 'gna_room1.png', title: "21년 봄과 여름 사이", text: "진아가 방에 누워있다." }, 
    { bg: 'gna_room1.png', title: "21년 봄과 여름 사이", text: "진아 : 심심한데 형민오빠 뭐하고 있지? " },

    {
        bg: 'gna_room1.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "전화건다", target: "call_oppa" },
            { text: "다시 눕는다", target: "sleep_again" }
        ]
    },

    { id: 'call_oppa', title: "21년 봄과 여름 사이", bg: 'gna_room1.png', text: "뚜루루루... 오빠 바빠?" },
    { bg: 'gna_room1.png', title: "21년 봄과 여름 사이", text: "형민: 아니, 왜?" },
    { bg: 'gna_room1.png', title: "21년 봄과 여름 사이", text: "진아: 나랑 놀래? (두근두근)"},
    { bg: 'gna_room1.png', title: "21년 봄과 여름 사이", text: "형민: 좋아!" , nextId: 'go_to_watch_movie' },

    { id: 'sleep_again', title: "21년 봄과 여름 사이", bg: 'gna_room1.png', text: "진아: 흠.. 아무래도 심심한데 전화 해봐야겠어.", nextId: 'call_oppa' },

    // ⭐️ 여기서 퇴장
    { id: 'go_to_watch_movie', title: "동탄 북광장 메가박스", bg: 'mega.png', text: "어색어색", walkOff: true, showHyungmin: true},
    { bg: 'mega.png', title: "동탄 북광장 메가박스", text: "형민, 진아 : (어색하게) 안녕!" , showHyungmin: true}, 

    { bg: 'fishzip.png', text: "영화 보고 나와서 술집을 갔다." , showHyungmin: true},
    { bg: 'fishzip.png', text: "형민: 너 나 좋아하냐? " , showHyungmin: true},
    { bg: 'fishzip.png', text: "진아: .. (뭐지 이 테토맨은? 이런 남자는 처음이야 ) " , showHyungmin: true},
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
    
    // ⭐️ 진아 시점: 호수공원 동그라미 (J2 수정: 스크립트는 그대로 두고 아래 updateStory 함수에서 로직 변경)
    { bg:  'dongtan_lake.png', text: "2021.10.23 동탄호수공원" , showHyungmin: true, isCircling: true, faceRight: true}, 
    { bg:  'dongtan_lake.png', text: "진아: (벌써 호수만 5바퀴째야, 이 오빠 고백할건가?)" , showHyungmin: true, isCircling: true, faceRight: true},
    { bg:  'dongtan_lake.png', text: "진아: 오빠 뭐 할 말 있어?" , showHyungmin: true, isCircling: true, faceRight: true},
    { bg:  'dongtan_lake.png', text: "한참을 뜸을 들인다." , showHyungmin: true, isCircling: true, faceRight: true},
    { bg:  'dongtan_lake.png', text: "형민: 우리 3개월만 만나볼래?" , showHyungmin: true, isCircling: true}, 

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
    { bg: 'dongtan_lake.png', text: "진아: 좋아!" , nextId: 'dating', showHyungmin: true,gnEmotion: 'gn_smile.png',hmEmotion: 'hm_smile.png'},

    { id: "dog_sound2", bg: 'dongtan_lake.png', text: "진아: 뭐라고?" , nextId: 'show_your_mind2', showHyungmin: true} ,

    { id: "dating", bg: 'dongtan_lake.png', text: "그렇게 우리는 사귀게 되었다.", showHyungmin: true  ,gnEmotion: 'gn_smile.png',hmEmotion: 'hm_smile.png'},

    { 
        id: "season_montage",
        type: "montage",
        walkTogether: true, 
        faceRight: true, 
        walkOff: true,      
        walkOffPartner: true, 
        text: "우리의 시간은 쉼 없이 흘러...",
        nextId: "여울"
    },

    { id : '여울', bg: '여울.png', title: '25년 봄과 여름 사이',text: "진아: 오빠 같이 살자.", showHyungmin: true},
    { bg: '여울.png', title: '25년 봄과 여름 사이', text: "형민: 나는 아직 잘 모르겠어..", showHyungmin: true},
    
    // ⭐️ 진아 시점: 진아만 걸어나감 (메인 캐릭터 walkOff) -> 메인은 왼쪽(left:10%)에 있으므로 오른쪽으로 퇴장
    { bg: '여울.png', title: '25년 봄과 여름 사이', text: "진아: 나 그럼 결혼하러 갈게..!", walkOff: true, showHyungmin: true},
    
    {id: "sad_time",bg : "rainy_day.png", text: "하 ,, 오빠 없으니 삶이 너무 무료하다."},
    {bg : "rainy_day.png", text: "난 결혼이 하고 싶었던게 아니라 오빠랑 함께이고 싶었던거구나 ..", gnEmotion: 'gn_sad.png'},
    {bg : "rainy_day.png", text: "(나쁜 오빠)", nextId: "messenger_part",walkOff: true, gnEmotion: 'gn_sad.png'},

    {
        id: "messenger_part",
        bg: 'gna_room2.png',
        type: 'messenger',
        title: '25년 겨울',
        chatName: "형민오빠", 
        messages: [
            { text: "자니?", sender: "other" },
            { text: "자는구나...", sender: "other" },
            { text: "잘 자", sender: "other" }
        ]
    },
    { bg: 'gna_room2.png', title: '25년 겨울',text: "진아: 이 오빠 술 마셨네"},
    { bg: 'gna_room2.png', title: '25년 겨울',text: "진아: 흠.. 근데 왜 연락했지?"},

    {
        bg: 'gna_room2.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "궁금하니 연락해본다.", target: "call_him" },
            { text: "차단하기", target: "blocking" }
        ]
    },

    { id: "call_him", title: '25년 겨울',bg: 'gna_room2.png', text: " (타닥타닥) 왜 연락했어? " },
    { bg: 'gna_room2.png', title: '25년 겨울',text: "형민: (문자) 만나서 얘기하자 " , nextId: 'izakaya'},
    
    { id: "blocking", title: '25년 겨울',bg: 'gna_room2.png', text: "진아: 차단하자."} ,
    { bg: 'gna_room2.png', title: '25년 겨울',text: "진아: 흠.. 그래도 왜 연락했는지 물어나 볼까.." , nextId: 'call_him'},

    { id: "izakaya", bg: 'izakaya.png', title: '25년 겨울',text: "영천동 어딘가 이자카야" , showHyungmin: true},
    { bg:  'izakaya.png', title: '25년 겨울',text: "형민: 너가 없는 시간이 힘들었어." , showHyungmin: true},
    { bg:  'izakaya.png', title: '25년 겨울',text: "진아: 나도 오빠 없으니 인생이 너무 재미가 없었어." , showHyungmin: true},
    { bg:  'izakaya.png', title: '25년 겨울',text: "형민: 잘 할게 (잘 하자?)" , showHyungmin: true},

    { bg:  'proposal.png', text: "형민: 진아야 결혼하자!" , showHyungmin: true},
    { bg:  'proposal.png', text: "진아: 좋아!" , showHyungmin: true, nextId: 'final_quiz_start' , gnEmotion: 'gn_smile.png'},


    // =========================================================
    // 👦🏻 [루트 B] 형민의 이야기 시작
    // =========================================================
    { id: 'hm_start', bg: 'dsr.png', text: "때는 2020년, 형민이는 설레는 마음으로 입사했다." },
    { bg: 'hm_office.png', title: "모바일 그룹", text: "형민: 안녕하십니까! 기형민 입니다!", showHyungmin: true},
    { bg: 'hm_office.png', title: "모바일 그룹", text: "형민: (우와... 저 선배 예쁘다.)", showHyungmin: true, nextId: 'hm_suwon' }, 
    
    { id: 'hm_suwon', bg: 'suwon.png', title: "21년 봄과 여름 사이", text: "본가를 다녀온 형민이는 수원역이다." },
    { bg: 'suwon.png', title: "21년 봄과 여름 사이",text: "띠리리링, 발신인 : [김진아] " },
    { bg: 'suwon.png', title: "21년 봄과 여름 사이",text: "형민: 오잉 무슨 일이지? " },
    { bg: 'suwon.png', title: "21년 봄과 여름 사이", text: "진아: 나랑 놀래? " },  
    { bg: 'suwon.png', title: "21년 봄과 여름 사이",text: "(또 술파티 구하나)" },  
    {
        bg: 'suwon.png',
        title: "21년 봄과 여름 사이",
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "좋아!", target: "jina_call" },
            { text: "아니 나 바빠", target: "jina_call" }
        ]
    },

    { id: 'jina_call', title: "21년 봄과 여름 사이",bg: 'suwon.png', text: "형민: 그래! 근데 누구랑?" },
    { bg: 'suwon.png', title: "21년 봄과 여름 사이",text: "진아: 나랑 둘이!" },
    { bg: 'suwon.png', title: "21년 봄과 여름 사이",text: "형민: ... 좋아! (꽤나 당돌하군,, 두근두근)"},

    { bg: 'mega.png', title: "동탄 북광장 메가박스",text: "어색어색", walkOff: true, showHyungmin: true},
    { bg: 'mega.png', title: "동탄 북광장 메가박스",text: "형민, 진아 : (어색하게) 안녕!" , showHyungmin: true},
    { bg: 'fishzip.png', text: "영화 보고 나와서 술집을 갔다." , showHyungmin: true},

    { bg: 'fishzip.png', text: "형민: (오늘 나랑 왜 보자고 했을까 궁금한데,)!" , showHyungmin: true},
    
    {
        bg: 'fishzip.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "관심 있는지 물어본다.!", target: "ask_jina" },
            { text: "그냥 술이나 마신다.", target: "drink_more" }
        ]
    },
    
    {  id: "ask_jina", bg: 'fishzip.png', text: "형민: 너 나 좋아하냐? " , showHyungmin: true},
    { bg: 'fishzip.png', text: "진아: ..?(당황한 표정) ) " , showHyungmin: true},
    { bg: 'fishzip.png', text: "형민: 난 여자랑 1:1로 안논다. 관심없으면 " , showHyungmin: true},
    { bg: 'fishzip.png', text: "진아: 나도 오빠 좋아! " , nextId: 'some_ing2', showHyungmin: true, gnEmotion: 'gn_smile.png' , hmEmotion: 'hm_smile.png'},

    { id: "drink_more", bg: 'fishzip.png', text: "(그래도 너무 궁금한데?) "  , nextId: 'ask_jina', showHyungmin: true},

    { id: "some_ing2", bg: 'fishzip.png', text: "이때부터 썸을 탔다." , showHyungmin: true},
    
    // ⭐️ 형민 시점: 호수공원 동그라미
    { bg:  'dongtan_lake.png', text: "2021.10.23 동탄호수공원" , showHyungmin: true, isCircling: true, faceRight: true},
    { bg:  'dongtan_lake.png', text: "형민: (벌써 호수만 5바퀴째다. 뭐라고 말하지?)" , showHyungmin: true, isCircling: true, faceRight: true},
    { bg:  'dongtan_lake.png', text: "진아: 오빠 뭐 할 말 있어?" , showHyungmin: true, isCircling: true, faceRight: true},
    { bg:  'dongtan_lake.png', text: "한참을 뜸을 들인다." , showHyungmin: true, isCircling: true, faceRight: true},
    
    {
        bg: 'dongtan_lake.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "남자답게 고백한다.", target: "go_baek" },
            { text: "말 못하겠어..!", target: "mian" }
        ]
    },
    
    {  id: "go_baek",bg:  'dongtan_lake.png', text: "형민: 우리 3개월만 만나볼래?" , showHyungmin: true, isCircling: true}, 
    { bg:  'dongtan_lake.png', text: "(3개월이라도 만나줘!!)" , showHyungmin: true},

    { bg: 'dongtan_lake.png', text: "진아: 이게 말이야 방구야! 다시 고백해!!!" , showHyungmin: true},
    { bg: 'dongtan_lake.png', text: "형민: 우리 만나보자" , showHyungmin: true},
    { bg: 'dongtan_lake.png', text: "진아: 좋아!" , nextId: 'dating2', showHyungmin: true, gnEmotion: 'gn_smile.png' , hmEmotion: 'hm_smile.png'},

    { id: "mian", bg: 'dongtan_lake.png', text: "형민: (그래도 남자가 가오가 있지.)" , nextId: 'go_baek', showHyungmin: true} ,

    { id: "dating2", bg: 'dongtan_lake.png', text: "그렇게 우리는 사귀게 되었다.", showHyungmin: true , gnEmotion: 'gn_smile.png' , hmEmotion: 'hm_smile.png' },

    { 
        id: "season_montage2",
        type: "montage",
        walkTogether: true, 
        faceRight: true,     
        walkOff: true,       
        walkOffPartner: true,
        text: "우리의 시간은 쉼 없이 흘러...",
        nextId: "여울2"
    },

    { id : '여울2', bg: '여울.png', title: '25년 봄과 여름 사이',text: "진아: 오빠 같이 살자.", showHyungmin: true},
    {
        bg: '여울.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "난 아직 준비가 안됐는걸,, ", target: "we_need_time" },
            { text: "난 시간이 좀 더 필요해", target: "we_need_time" }
        ]
    },
    
    { id : "we_need_time" ,bg: '여울.png', text: "형민: 나는 아직 잘 모르겠어..", showHyungmin: true},
    
    // ⭐️ 형민 시점: 진아(파트너)만 왼쪽으로 퇴장
    { bg: '여울.png', text: "진아: 나 그럼 결혼하러 갈게..!", walkOffPartnerLeft: true, showHyungmin: true},
    
    {bg : "rainy_day.png", text: "혼자면 편할 줄 알았는데, 힘이 안나..", hmEmotion: 'hm_crying.png', faceRight: true, hidePartner: true},
    {bg : "rainy_day.png", text: "진아가 내게 큰 안식처였구나", hmEmotion: 'hm_soju.png', faceRight: true, hidePartner: true},
    {bg : "rainy_day.png", text: "(보고 싶어)", hmEmotion: 'hm_soju.png', faceRight: true, hidePartner: true, nextId: "messenger_part_hm", walkOff: true},
    
    {
        id: "messenger_part_hm",
        bg: 'rainy_day.png',
        type: 'messenger',
        hmEmotion: 'hm_soju.png'
        title: '25년 겨울',
        chatName: "진아", // ⭐️ H5 수정: 수신인이 진아로 표기됨
        messages: [
            { text: "자니?", sender: "me" },
            { text: "자는구나...", sender: "me" },
            { text: "잘 자", sender: "me" }
        ],
        nextId: "regret_time"
    },
    { id: "regret_time", bg: 'hm_room.png', title: '25년 겨울',text: " 형민: zzZ "}, 
    
    // ⭐️ H6 수정: skipToSubStep: 4 추가해서 이전 메시지는 팝업 애니메이션 없이 렌더링되도록 함
    { 
        id: "jina_reply_scene", 
        bg: 'hm_room.png', 
        type: 'messenger',
        hmEmotion: 'hm_soju.png'
        title: '25년 겨울',
        chatName: "진아", 
        skipToSubStep: 4, // <-- 이 설정 덕분에 4번째(인덱스 3)부터 애니메이션이 동작함
        messages: [
            { text: "자니?", sender: "me" },
            { text: "자는구나...", sender: "me" },
            { text: "잘 자", sender: "me" },
            { text: "왜 연락했어?", sender: "other" } 
        ],
        nextId: "hm_react"
    },

    { id: "hm_react", title: '25년 겨울',bg: 'hm_room.png', text: " 형민: 헉 연락이 왔다. " }, 
    { bg: 'hm_room.png', title: '25년 겨울',text: " 형민: 헉 내가 어제 무슨 짓을,, " }, 
    {
        bg: 'hm_room.png',
        type: 'choice',
        question: "어떻게 할까?",
        options: [
            { text: "하,, 이불킥", target: "not_sorry" },
            { text: "이게 내 마음이야", target: "not_sorry" }
        ]
    },
    
    { id: "not_sorry", bg: 'hm_room.png', text: "형민: 아니? 아무리 취했어도 그게 내 진심이었어. 진아 잘 사는지도 궁금하고,, ", nextId:"call_jina"},
    { id: "call_jina",bg: 'hm_room.png', text: "형민: (타닥타닥) 만나서 얘기하자 " , nextId: 'izakaya2'},
    
    { id: "izakaya2", bg: 'izakaya.png', title: '25년 겨울',text: "영천동 어딘가 이자카야" , showHyungmin: true},
    { bg:  'izakaya.png', title: '25년 겨울',text: "형민: 너가 없는 시간이 힘들었어." , showHyungmin: true},
    { bg:  'izakaya.png', title: '25년 겨울',text: "진아: 나도 오빠 없으니 인생이 너무 재미가 없었어." , showHyungmin: true},
    { bg:  'izakaya.png', title: '25년 겨울',text: "형민: 잘 할게 (잘 하자?)" , showHyungmin: true},

    { bg:  'proposal.png', text: "형민: 진아야 결혼하자!" , showHyungmin: true},
    { bg:  'proposal.png', text: "진아: 좋아!" , showHyungmin: true, nextId: 'final_quiz_start' , gnEmotion: 'gn_smile.png' , hmEmotion: 'hm_smile.png' },

    // =========================================================
    // 💍 [마지막 공통 퀴즈]
    // =========================================================
    {
        id: 'final_quiz_start',
        bg: 'wedding.png',
        type: 'choice',
        question: "저희는 잘 살 수 있을까요?",
        options: [
            { text: "당연하죠 (정답)", target: "link" },
            { text: "흠 잘 모르겠는데요 (오답)", target: "wrong" }
        ]
    }
];

let currentStep = 0;
let isTransitioning = false;

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
    const chatName = document.getElementById('chat-name'); 

// ⭐️ 1. 캐릭터 기본 방향 및 스왑 (섞인 이미지 이름 복구 완료!)
    if (chosenRoute === 'hm_start') {
        char.style.backgroundImage = "url('char_hm.png')"; // ◀ 형민 캐릭터 복구
        char.style.transform = "scaleX(1)"; 
        if (charHyungmin) {
            charHyungmin.style.backgroundImage = "url('gn.png')"; // ◀ 진아 캐릭터 복구
            charHyungmin.style.transform = "scaleX(-1)"; 
        }
    } else {
        char.style.backgroundImage = "url('gn.png')"; // ◀ 진아 캐릭터 복구
        char.style.transform = "scaleX(1)"; 
        if (charHyungmin) {
            charHyungmin.style.backgroundImage = "url('char_hm.png')"; // ◀ 형민 캐릭터 복구
            charHyungmin.style.transform = "scaleX(-1)"; 
        }
    }

    // ⭐️ 2. 강제로 오른쪽 보기 (J3, H2 버그 수정: 무조건 둘 다 scaleX(1)을 줌)
    if (current.faceRight) {
        char.style.transform = "scaleX(1)"; 
        if (charHyungmin) charHyungmin.style.transform = "scaleX(1)"; 
    }

    if (current.hmEmotion) {
        if (chosenRoute === 'hm_start') {
            char.style.backgroundImage = `url('${current.hmEmotion}')`;
        } else {
            if (charHyungmin) charHyungmin.style.backgroundImage = `url('${current.hmEmotion}')`;
        }
    }
// ▼▼▼ 여기에 진아 감정(gnEmotion) 로직을 새로 추가! ▼▼▼
    if (current.gnEmotion) {
        if (chosenRoute === 'jina_start') {
            char.style.backgroundImage = `url('${current.gnEmotion}')`;
        } else {
            if (charHyungmin) charHyungmin.style.backgroundImage = `url('${current.gnEmotion}')`;
        }
    }
    // ▲▲▲ 여기까지 추가 ▲▲▲
    if (dayCounter) dayCounter.style.display = 'none';
    if (phonePopup) phonePopup.style.display = 'none';
    
// ▼ 여기서부터 기존 초기화(if (char) { ... } ) 코드를 지우고 이 코드를 덮어쓰기 ▼
    const wasCircling = char.classList.contains('circling');
    const keepCircling = wasCircling && current.isCircling;

    if (!keepCircling) {
        if (char) {
            char.classList.remove('walking', 'circling', 'walk-off', 'walk-off-left');
            char.style.transition = 'none';
            char.style.marginLeft = "0px"; 
            void char.offsetWidth; 
            char.style.transition = '';
        }
        if (charHyungmin) {
            charHyungmin.classList.remove('walking', 'circling', 'walk-off', 'walk-off-left');
            charHyungmin.style.transition = 'none';
            charHyungmin.style.marginLeft = "0px"; 
            void charHyungmin.offsetWidth;
            charHyungmin.style.transition = '';
        }
    }
    // ▲ 여기까지 덮어쓰기 ▲
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
        if (current.hidePartner) {
            charHyungmin.style.display = 'none';
        } else {
            charHyungmin.style.display = current.showHyungmin ? 'block' : 'none';
        }
    }

// ▼ 기존의 if (current.isCircling) { ... } 전체를 이걸로 덮어쓰기 ▼
    if (current.isCircling) {
        if (!keepCircling) { 
            char.style.transform = ""; 
            char.style.left = "30px"; // 메인 캐릭터 위치
            char.classList.add('circling');
            
            if (charHyungmin) {
                charHyungmin.style.display = 'block';
                charHyungmin.style.right = 'auto'; 
                charHyungmin.style.left = '130px'; // ⭐️ 딱 손잡고 걷는 정도의 간격 (100px 차이)
                charHyungmin.style.transform = ""; 
                charHyungmin.classList.add('circling');
                
                // ⭐️ 딜레이를 0초로 줘서 똑같은 타이밍에 움직이게 만듦!
                charHyungmin.style.setProperty('animation-delay', '0s', 'important');
            }
        }
    } else {
        char.style.left = "10%"; // 원상복구
        if (charHyungmin) {
            charHyungmin.style.right = '10%'; 
            charHyungmin.style.left = 'auto';
            charHyungmin.style.removeProperty('animation-delay'); 
        }
    }
    // ▲ 여기까지 덮어쓰기 ▲

    if (current.type === 'montage') {
        if (dayCounter) dayCounter.style.display = 'block';
        if (char) char.classList.add('walking');
        
        if (current.walkTogether && charHyungmin) {
            charHyungmin.style.display = 'block';
            charHyungmin.style.right = 'auto';
            char.style.left = '30px'; 
            charHyungmin.style.left = '170px'; 
            charHyungmin.classList.add('walking');
        }

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
                if (charHyungmin) charHyungmin.classList.remove('walking');
                setTimeout(goNext, 1000);
            }
        }, 10);

        return; 
    }

    // 메신저 처리 로직
    if (current.type === 'messenger') {
        if (bubble) bubble.style.display = "none";
        if (choices) choices.style.display = "none";

        if (chatName && current.chatName) {
            chatName.innerText = current.chatName;
        }

        // ⭐️ H6 수정: 특정 카톡 개수부터 즉시 띄우기
        if (current.skipToSubStep && currentSubStep === 0) {
            currentSubStep = current.skipToSubStep;
        }

        if (currentSubStep === 0) {
            if (phonePopup) phonePopup.style.display = 'none';
        } else {
            if (phonePopup) phonePopup.style.display = 'block';
            if (chatBox) {
                chatBox.innerHTML = '';
                for (let i = 0; i < currentSubStep - 1; i++) {
                    let msgData = current.messages[i];
                    if (msgData) {
                        const msgDiv = document.createElement('div');
                        msgDiv.className = 'chat-msg';
                        
                        if (typeof msgData === 'string') {
                            if (current.isSender) msgDiv.classList.add('sent');
                            msgDiv.innerText = msgData;
                        } else {
                            if (msgData.sender === 'me') msgDiv.classList.add('sent');
                            msgDiv.innerText = msgData.text;
                        }
                        
                        // ⭐️ 이미 보낸 카톡은 애니메이션 없이 그대로 표시
                        if (current.skipToSubStep && i < current.skipToSubStep - 1) {
                            msgDiv.style.animation = 'none';
                            msgDiv.style.opacity = '1';
                            msgDiv.style.transform = 'translateY(0)';
                        }
                        
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
            if (story[nextStep].noFade) {
                currentStep = nextStep;
                bg.style.backgroundImage = `url('${story[currentStep].bg}')`;
                bgPosX = 0;
                bg.style.left = "0px";
                updateStory();
            } else {
                changeScene(nextStep, true);
            }
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
            if (story[currentStep].noFade) {
                currentStep = prevStep;
                bg.style.backgroundImage = `url('${story[currentStep].bg}')`;
                bgPosX = 0;
                bg.style.left = "0px";
                updateStory();
            } else {
                changeScene(prevStep, false);
            }
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
    const charHyungmin = document.getElementById('char-hyungmin');

    if (isNext && current.walkOff && current.walkOffPartner) {
        if(char) char.classList.add('walk-off');
        if(charHyungmin) charHyungmin.classList.add('walk-off'); 
        walkOffTimer = setTimeout(() => { walkOffTimer = null; executeFade(targetStep); }, 2700);
    } 
    else if (isNext && current.walkOffPartnerLeft) { 
        // ⭐️ H4 버그 수정: 왼쪽으로 걸어갈 때 확실하게 왼쪽을 바라보도록 세팅
        if(charHyungmin) {
            charHyungmin.style.transform = "scaleX(-1)";
            charHyungmin.classList.add('walk-off-left');
        }
        walkOffTimer = setTimeout(() => { walkOffTimer = null; executeFade(targetStep); }, 2700);
    } 
    else if (isNext && current.walkOff) {
        if(char) char.classList.add('walk-off');
        walkOffTimer = setTimeout(() => { walkOffTimer = null; executeFade(targetStep); }, 2700);
    } 
    else if (isNext && current.walkOffPartner) {
        if(charHyungmin) charHyungmin.classList.add('walk-off'); 
        walkOffTimer = setTimeout(() => { walkOffTimer = null; executeFade(targetStep); }, 2700);
    } else {
        executeFade(targetStep);
    }
}

function executeFade(targetStep) {
    fade.classList.add('fade-out');
    const charHyungmin = document.getElementById('char-hyungmin');

    setTimeout(() => {
        currentStep = targetStep;

        if (story[currentStep].type !== 'montage') {
            bg.style.backgroundImage = `url('${story[currentStep].bg}')`;
        }

        bgPosX = 0;
        bg.style.left = "0px";
        
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

const imagesToPreload = [
    'dsr.png', 'gn.png', 'gn_office.png', 'hm_office.png', 'gna_room1.png', 'mega.png', 'fishzip.png', 
    'dongtan_lake.png', '여울.png', 'gna_room2.png', 'char_hm.png', 
    'rainy_day.png', 'izakaya.png', 'proposal.png', 'autumn.png', 
    'winter.png', 'spring.png', 'summer.png', 'suwon.png', 'hm_room.png', 
    'wedding.png', 'hm_crying.png' , 'hm_smile.png' , 'gn_sad.png', 'gn_smile.png', 
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
            clearTimeout(fallbackTimer); 
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
