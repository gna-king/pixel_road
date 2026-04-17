let bg = document.getElementById('background');
let char = document.getElementById('character');
let bubble = document.getElementById('bubble');
let choices = document.getElementById('choices');

let bgPosX = 0; // 배경의 처음 위치

// 0.05초마다 실행되는 함수
function gameLoop() {
    // 배경을 왼쪽으로 -2px씩 이동 (앞으로 걸어가는 효과)
    bgPosX -= 2;
    bg.style.left = bgPosX + "px";

    // 특정 위치가 되면 대사 띄우기 (예: 배경이 -100px 이동했을 때)
    if (bgPosX === -100) {
        bubble.style.display = "block";
        bubble.innerText = "어? 저기 식장이 보인다!";
    }

    // 조금 더 가서 멈추고 선택지 띄우기 (예: -300px)
    if (bgPosX <= -300) {
        clearInterval(timer); // 걷기 중단
        bubble.innerText = "잠깐, 가기 전에 퀴즈 하나!"; // 말풍선 내용 바꾸기
        
        // 0.5초 뒤에 선택지 보여주기
        setTimeout(() => {
            choices.style.display = "block";
        }, 500);
    }
}

// 게임 시작!
let timer = setInterval(gameLoop, 50);

// 정답 확인 버튼 (지난번과 동일)
function answer(choice) {
    if(choice === 'spring') {
        alert("정답! 초대장을 보여드릴게요.");
        window.location.href = "https://링크_주소"; // 진짜 모바일 청첩장 링크로 이동!
    } else {
        alert("다시 생각해보세요! (봄/겨울 중에 고민해봐요)");
    }
}
