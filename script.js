import { typingTexts } from "./info.js";
let historyscore = JSON.parse(localStorage.getItem("history")) || [];
let text = document.querySelector("#origin-text");
let difficulty = document.querySelector("select");
let text_content = "";
let disable = document.querySelector(".disabled");
let content;
let size = 0;
let time = document.querySelector("#time");
let typingdiv = document.querySelector(".typing-test");
let input = document.querySelector("#inputfield");
let resultpopup = document.querySelector(".resultpopup");
let closepopup = document.querySelector(".close");
let count = 0,
  sec = 0,
  min = 0;
let timer;
let rightchar = 0;

difficulty.addEventListener("change", function textassign() {
  if (difficulty.value == "Short") {
    content = typingTexts[0].short[Math.floor(Math.random() * 5)];
    console.log(content);
    text_content = content.text;
  } else if (difficulty.value == "Medium") {
    content = typingTexts[1].medium[Math.floor(Math.random() * 5)];
    console.log(content);
    text_content = content.text;
  } else {
    content = typingTexts[2].long[Math.floor(Math.random() * 5)];
    console.log(content);
    text_content = content.text;
  }
  size = text_content.length;
  rendertext();
});

function rendertext() {
  text.innerHTML = "";
  for (let i = 0; i < text_content.length; i++) {
    let span = document.createElement("span");
    span.style.position = "relative";
    span.style.paddingLeft = "2px";
    if (text_content[i] == " ") span.innerHTML = "&nbsp;";
    else span.innerText = `${text_content[i]}`;
    text.append(span);
  }
}

typingdiv.addEventListener("click", () => {
  if (disable.style.display == "none") input.focus();
});
input.addEventListener("keyup", function check(e) {
  if (input.value && e.key === "Backspace") {
    count--;
    text.children[count].classList.remove("wrongchar");
    if (text.children[count].classList.contains("rightchar")) {
      text.children[count].classList.remove("rightchar");
      rightchar--;
    }
    text.children[count].classList.add("activechar");
    text.children[count + 1].classList.remove("activechar");
  }
  if (!(e.key.length > 2)) {
    let ch = text_content[count];
    text.children[count].classList.remove("activechar");
    if (count < size - 1) text.children[count + 1].classList.add("activechar");
    if (e.key === ch) {
      text.children[count].classList.add("rightchar");
      rightchar++;
    } else {
      text.children[count].classList.add("wrongchar");
    }
    count++;
  }
  console.log(count);
  if (count == size) {
    result();
  }
});
function result() {
  disable.style.display = "block";
  clearInterval(timer);
  let totaltime =
    Number(time.innerText.substring(0, 2)) +
    Number(time.innerText.substring(3, 5)) / 60;
  console.log(totaltime);
  let wpmstatus =
    Math.round(size / (5 * totaltime)) -
    Math.round((size - rightchar) / totaltime);
  let accuracystatus =
    count != 0 ? ((rightchar / size) * 100).toPrecision(4) : 0;
  console.log("the wpm is ", wpmstatus);
  let wpm = document.querySelector("#wpm");
  let accuracy = document.querySelector("#accuracy");
  wpm.innerText = `WPM: ${wpmstatus}`;
  accuracy.innerText = `Accuracy: ${accuracystatus}%`;
  resultpopup.style.display = "block";
  historyscore.push({
    WPM: wpmstatus,
    Accuracy: accuracystatus,
    Difficulty: difficulty.value,
  });
  localStorage.setItem("history", JSON.stringify(historyscore));
}
closepopup.addEventListener("click", () => {
  resultpopup.style.display = "none";
  window.location.reload();
});
let start = document.querySelector(".start");
start.addEventListener("click", () => {
  disable.style.display = "none";
  rendertext();
  input.focus();
  text.children[0].classList.add("activechar");
  time.innerText = "00:00";
  min = 0;
  sec = 0;
  timer = setInterval(() => {
    if (sec > 60) {
      min++;
      sec = 0;
    }
    time.innerText =
      sec < 10
        ? min < 10
          ? `0${min}:0${sec}`
          : `${min}:0${sec}`
        : min < 10
        ? `0${min}:${sec}`
        : `${min}:${sec}`;
    sec++;
  }, 1000);
});
function renderhistory() {
  let history = JSON.parse(localStorage.getItem("history"));
  if (!history) {
    document.querySelector("#nohistory").style.display = "block";
  } else {
    let historybox = document.querySelector(".history");
    history.forEach((item) => {
      let div = document.createElement("div");
      div.classList.add("historyelement");
      for (const key in item) {
        let span = document.createElement("span");
        span.classList.add("element");
        span.innerText =
          key == "Accuracy"
            ? `${key} : ${item[key]}%`
            : `${key} : ${item[key]}`;
        div.append(span);
      }
      historybox.append(div);
    });
    document.querySelector("#nohistory").style.display = "none";
  }
}
window.onload = () => {
  renderhistory();
  difficulty.dispatchEvent(new Event("change"));
};
