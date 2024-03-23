//input에 입력된 내용 참조해오기
let todoInput = document.querySelector("#todo-input");
//생성될 todo-list 태그 참조
const todoList = document.querySelector("#todo-list");

//string을 객체를 가진 배열로 변환하여 변수에 저장
const savedTodoList = JSON.parse(localStorage.getItem("saved-items"));

const savedWeatherData = JSON.parse(localStorage.getItem("saved-weather"));

const createTodo = function (storageData) {
  let todoContents = todoInput.value;
  if (storageData) {
    todoContents = storageData.contents;
  }

  //todo-list에 추가될 li들 선언
  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  const newBtn = document.createElement("button");

  //버튼 누르면 실선, 색변화
  newBtn.addEventListener("click", () => {
    newLi.classList.toggle("complete");
    saveItemsFn();
  });

  //두번 클릭하면 삭제
  newLi.addEventListener("dblclick", () => {
    newLi.remove();
    saveItemsFn();
  });

  if (storageData?.complete) {
    newLi.classList.add("complete");
  }

  //span에 input내용 넣기
  newSpan.textContent = todoContents;
  //li에 버튼, 내용 넣기
  newLi.appendChild(newBtn);
  newLi.appendChild(newSpan);
  //list에 생성된 li넣기
  todoList.appendChild(newLi);

  //입력창 빈값으로 만들기
  todoInput.value = "";
  saveItemsFn();
};

//사용자가 엔터를 칠 때 인풋 내용 리스트에 추가하기
const keyCodeCheck = function () {
  if (window.event.keyCode === 13 && todoInput.value.trim() !== "") {
    createTodo();
  }
};

//전체삭제 버튼과 연결
const deleteAll = function () {
  //모든 li태그 선택하여 liList에 참조, 이때 배열형식으로 들어가 있음
  const liList = document.querySelectorAll("li");
  //배열을 반복문을 이용해 삭제
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  saveItemsFn();
};

//storage에 저장하기
const saveItemsFn = function () {
  //빈 배열 만들어서 요소객체 저장해주기
  const saveItems = [];
  for (let i = 0; i < todoList.children.length; i++) {
    const todoObj = {
      contents: todoList.children[i].querySelector("span").textContent,
      complete: todoList.children[i].classList.contains("complete"),
    };
    saveItems.push(todoObj);
  }

  saveItems.length === 0
    ? localStorage.removeItem("saved-items")
    : localStorage.setItem("saved-items", JSON.stringify(saveItems));
};

//storage 미리 확인하고 저장되어 있는 것들 todo에 추가하기
if (savedTodoList) {
  for (let i = 0; i < savedTodoList.length; i++) {
    createTodo(savedTodoList[i]);
  }
}

const weatherDataActive = function ({ location, weather }) {
  const weatherMainList = [
    "Clear",
    "Clouds",
    "Drizzle",
    "Rain",
    "Snow",
    "Thunderstorm",
  ];
  weather = weatherMainList.includes(weather) ? weather : "Fog";
  const locationNameTag = document.querySelector("#location-name-tag");
  locationNameTag.textContent = location;
  document.body.style.backgroundImage = `url(./images/${weather}.jpg)`;

  //location이나 weather가 새로운 상황이거나, 통신으로 받아온 데이터 일때
  if (
    !savedWeatherData ||
    savedWeatherData.location !== location ||
    savedWeatherData.weather !== weather
  ) {
    //console.log("조건식 성립");
    //localStorage 업데이트
    localStorage.setItem(
      "saved-weather",
      JSON.stringify({ location, weather })
    );
  }
  //그렇지 않고 localStorage에서 저장되어졌던 데이터를 매개변수로 사용했을 때
  //console.log("조건식 불성립");
};

const weatherSearch = function ({ latitude, longitude }) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=9c21b1e84f25395d0efb9a844e36d8ac`
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      const weatherData = {
        location: json.name,
        weather: json.weather[0].main,
      };
      weatherDataActive(weatherData);
    })
    .catch((err) => {
      console.log(err);
    });
};

const accessToGeo = function ({ coords }) {
  const { latitude, longitude } = coords;
  //shorthand property
  const positionObj = {
    latitude,
    longitude,
  };

  weatherSearch(positionObj);
};

const askForLocation = function () {
  navigator.geolocation.getCurrentPosition(accessToGeo, (err) => {
    console.log(err);
  });
};

askForLocation();

if (savedWeatherData) {
  weatherDataActive(savedWeatherData);
}
