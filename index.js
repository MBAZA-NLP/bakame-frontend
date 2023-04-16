console.log("hello i'm Bakame, your guy");

const chatbot= document.querySelector(".chatbot");
const bakame = document.querySelector("#bakame");
const bakameSaba = document.querySelector("#bakameSaba");
const bakameType = document.querySelector("#bakameType");
const bakameSend = document.querySelector("#bakameSend");
const bakameMic = document.querySelector("#bakameMic");

const bakameRecording = document.querySelector("#bakameRecording");
const bakameCancel = document.querySelector("#bakameCancel");
const bakamePause = document.querySelector("#bakamePause");
const bakameAudio = document.querySelector("#bakameAudio");

const timerLabel = document.getElementById("timerLabel");
const content = document.querySelector(".content");
const initialContent = document.querySelector(".initialText");
const chatContent = document.querySelector(".chatTextContent");
const chatResponse = document.querySelector(".chatTextResponse");
const typing = document.querySelector(".typing");
const bakameMobile = document.querySelector("#bakameMobile");
const smallDev = document.querySelector(".smallDev");
var recorder = null;
var timerCounter = null;

const bakameClean = () => {
  bakame.style["display"] = "none";
  bakameSend.style["display"] = "none";
  bakameRecording.style["display"] = "none";
  timerLabel.textContent = '';
};

const bakameCleanRecorder = () =>{
  timerLabel.textContent = '';
  clearInterval(timerCounter);

}


const recordAudio = () =>
new Promise(async (resolve) => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks = [];

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  const start = () => mediaRecorder.start();

  const stop = () =>
    new Promise((resolve) => {
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        const play = () => audio.play();
        resolve({ audioBlob, audioUrl, play });
      });
      mediaRecorder.stop();
    });
  resolve({ start, stop });
});

const stopRecoder = async() =>{
    const audio = await recorder.stop();
    audio.play();
    console.log(audio);
    timerLabel.textContent = '';
}

const bakameRecordCount = async () => {
  let startTime = new Date().getTime();
  (async () => {
    recorder = await recordAudio();
    recorder.start();
  })();

  timerCounter = setInterval(function() {
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - startTime;
  
  // Calculate minutes and seconds from time difference
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  // Add leading zero to seconds if necessary
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  // Update the timer label
  timerLabel.textContent = `${minutes}:${formattedSeconds}`;
  }, 1000);
};

bakameClean();


const regexInputValidataion = (input) =>{
    let regexB = /^(?:\b[^\W\d_aeiou]{17,}\b|\b[^\W\d_aeiou]+\b(?=\W|$))/gi
    const isMatch = regexB.test(input);
    
    console.log(isMatch); 
    console.log(input.length);

}

// in any given sentence it should check and match only
// if it is a sentence made up of 1 word and composed of more than 16 characters
// or if in the whole sentence there's no any vowel, or words of that sentence has no vowels
// otherwise it should return false

// catch the whole input and match if it is only made of consonants, 
// if it is more than 16 characters long in 1 word 
// if it is 
const foldUp = () => {
  console.log("foldUp");
  bakame.style["display"] = "block";
  bakameSaba.style["display"] = "none";
};
const foldDown = () => {
  console.log("foldDown");
  bakame.style["display"] = "none";
  bakameSaba.style["display"] = "block";
};

// Event listeners

bakameType.addEventListener("input", ()=>{
    if(bakameType.value === ""){
        bakameMic.style["display"] = "block";
        bakameSend.style["display"] = "none";
    }
    if(bakameType.value !== ""){
        bakameMic.style["display"] = "none";
        bakameSend.style["display"] = "block";
    }
});


bakameMic.addEventListener("click", (event) =>{
    event.preventDefault();
    foldUp();
    bakameMic.style["display"] = "none";
    bakameSaba.style["display"] = "none";
    bakameType.style["display"] = "none";
    bakameRecording.style["display"] = "flex";
    
})

bakameSend.addEventListener("click", (event)=>{
    event.preventDefault();
    regexInputValidataion(bakameType.value);

    initialContent.style['display'] = 'none';
    content.innerHTML += `
    <div class="chatTextContent">
        <p class="questionsContent">
            ${bakameType.value}
        </p>
    </div>
    `;
    content.innerHTML += `
    <div class="chatTextResponse">
    <p class="questionsContent">
        Thanks for question, in second i will provide a response
        <span class="material-symbols-outlined">volume_up</span>
    </p>
</div>
    `;
    bakameType.value = "";
  rasaApi(bakameType.value);
  bakameType.value = "";
});

bakameType.addEventListener("blur", ()=>{
    console.log("input focused out");
    foldUp();
    typing.style["display"] = "none";
});
bakameType.addEventListener("focus", ()=>{
    console.log("input focused");
    foldUp();
    typing.style["display"] = "block";
});

bakameMic.addEventListener("click", (event)=>{
    event.preventDefault();
    bakameRecordCount();
});
bakameCancel.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("cancel clicked");
  foldUp();
  bakameMic.style["display"] = "block";
  bakameSaba.style["display"] = "none";
  bakameType.style["display"] = "block";
  bakameRecording.style["display"] = "none";
  stopRecoder();
  bakameCleanRecorder();
});

bakameAudio.addEventListener("click", (event) =>{
  event.preventDefault();
  bakameCleanRecorder();
});

bakameMobile.addEventListener("click", ()=>{
  chatbot.style["display"]="block";
  smallDev.style["display"]="none";
});


// calling the api

const rasaApi = (query) =>{

  let rasaURL = "http://64.226.97.252:5005/webhooks/rest/webhook";
  let reqData = {
    sender:"user101",
    message:query
  }
  const sendRequest = async () =>{
    const { data: res } = await axios.post(rasaURL, reqData, {
      headers: {
        "Content-Type": "application/json",
      },
    });


  chatContent.innerHTML = `
    <p class="questionsContent">
        ${query}
    </p>`;
    allResponse = '';
    res.map((response)=>{
      allResponse += `
      <p class="questionsContent">
      ${response.text}
      </p>`;
    });

  chatResponse.innerHTML = allResponse;
    console.log("--->",res);
  }

  sendRequest();

}