//초기화면. 메세지창과 시간창 세팅
const messageContainer = document.querySelector("#d-day-message");
const container = document.querySelector("#d-day-container");

//인터벌 id 배열 초기 세팅
const intervalIdArr = [];

//web storage 확인
const savedDate = localStorage.getItem("saved-date");

//사용자가 인풋에 데이터 넣고 읽어온뒤, 날짜형식으로 데이터 정제해서 반환
const dateForMaker = function () {
  const inputYear = document.querySelector("#target-year-input").value;
  const inputMonth = document.querySelector("#target-month-input").value;
  const inputDate = document.querySelector("#target-date-input").value;

  //new date()에 넣을 수 있도록 데이터 정제
  //const dateFormat = inputYear + '-' + inputMonth + '-' + inputDate;
  const dateFormat = `${inputYear}-${inputMonth}-${inputDate}`;

  return dateFormat;
};

const counterMaker = function (data) {
  //storage에 저장된 데이터와 새로 입력된 데이터가 다르다면 새로 저장
  if (data !== savedDate) {
    localStorage.setItem("saved-date", data);
  }
  //사용자가 입력한 날짜와 현재시간 차이 계산
  const nowDate = new Date();
  const targetDate = new Date(data).setHours(0, 0, 0, 0);
  const remaining = (targetDate - nowDate) / 1000;

  if (remaining <= 0) {
    //만약 remaining이 0이라면, 타이머가 종료되었습니다. 출력
    container.style.display = "none";
    messageContainer.innerHTML = "<h3>타이머가 종료되었습니다.</h3>";
    messageContainer.style.display = "flex";
    setClearInterval();
    return;
  } else if (isNaN(remaining)) {
    //만약, 잘못된 날짜가 들어왔다면, 유효한 시간대가 아닙니다. 출력
    container.style.display = "none";
    messageContainer.innerHTML = "<h3>유효한 시간대가 아닙니다.</h3>";
    messageContainer.style.display = "flex";
    setClearInterval();
    return;
  }

  //각각 출력할 날짜, 시간, 분, 초 정제
  const remainingObj = {
    remainingDate: Math.floor(remaining / 3600 / 24),
    remainingHours: Math.floor(remaining / 3600) % 24,
    remainingMin: Math.floor(remaining / 60) % 60,
    remainingSec: Math.floor(remaining) % 60,
  };

  const documentArr = ["days", "hours", "min", "sec"];
  const timeKeys = Object.keys(remainingObj);

  const format = function (time) {
    if (time < 10) {
      return " 0" + time;
    } else {
      return time;
    }
  };

  let i = 0;
  for (let tag of documentArr) {
    const remainingTime = format(remainingObj[timeKeys[i]]);
    document.getElementById(tag).textContent = remainingObj[timeKeys[i]];
    i++;
  }
};

//시작 버튼
const starter = function (targetDateInput) {
  //이전에 저장해둔 데이터가 없을 경우
  if (!targetDateInput) {
    targetDateInput = dateForMaker();
  }

  //이전에 저장해둔 데이터가 있을 경우

  //카운터 창 활성화
  container.style.display = "flex";
  messageContainer.style.display = "none";
  //우선 인터벌 초기화
  setClearInterval();
  counterMaker(targetDateInput);
  //매 인터벌 id를 array에 푸시해주기
  const intervalID = setInterval(() => {
    counterMaker(targetDateInput);
  }, 1000);
  intervalIdArr.push(intervalID);
};

//인터벌 array에 있는 만큼 종료시켜주기
const setClearInterval = function () {
  for (let i = 0; i < intervalIdArr.length; i++) {
    clearInterval(intervalIdArr[i]);
  }
};

//타이머 초기화 버튼 누르면 시간 창 없애고 메세지창 보이게하기, 인터벌 종료시키기
const resetTimer = function () {
  container.style.display = "none";
  messageContainer.innerHTML = "<h3>D-Day를 입력해주세요.</h3>";
  messageContainer.style.display = "flex";
  localStorage.removeItem("saved-date");
  setClearInterval();
};

//storage에 저장된 데이터가 있으면 starter바로 실행, 없으면 초기화면 세팅
if (savedDate) {
  starter(savedDate);
} else {
  container.style.display = "none";
  messageContainer.innerHTML = "<h3>D-Day를 입력해주세요.</h3>";
}
