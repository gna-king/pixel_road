let char = document.getElementById('character');
let posX = 20;

// 0.05초마다 캐릭터를 오른쪽으로 조금씩 밀어주는 함수
function walk() {
    if (posX < 150) { // 중간쯤(150px) 가면 멈춰라!
        posX += 2;
        char.style.left = posX + "px";
    } else {
        // 멈추면 선택지를 보여줘라!
        document.getElementById('choices').style.display = "block";
        clearInterval(timer); // 걷기 중단
    }
}

let timer = setInterval(walk, 50); // 게임 시작!

function answer(choice) {
    if(choice === 'spring') {
        alert("정답! 이제 초대장을 확인하러 갈까요?");
        // 여기에 진짜 청첩장 페이지 링크를 넣을 수 있어요.
    } else {
        alert("다시 생각해보세요! ㅎㅎ");
    }
}
