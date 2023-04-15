console.log("hello i'm Bakame, your guy");

const chatbot = document.querySelector(".chatbot");
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
const bakameMobile = document.querySelector("#bakameMobile");
const smallDev = document.querySelector(".smallDev");

var recorder = null;
var timerCounter = null;
const mins10 = 600000;

const userGenerator = () => {
  return `user${Date.now()}`;
}


// user CRUD
const setUser = () => {
  let user = userGenerator();
  window.localStorage.setItem("mbazaUser", user);
}
const deleteUser = () => {
  window.localStorage.setItem("mbazaUser", "nouser");
}
const getUser = () => {
  let user = window.localStorage.getItem("mbazaUser");
  return user;
}

// default function to run 
(() => {
  setUser();
  console.log("user", userGenerator());
})();


let wait10mins = window.setInterval(() => {
  deleteUser();
  setUser();
  // console.log("user", userGenerator());
}, mins10);

const bakameClean = () => {
  bakame.style["display"] = "none";
  bakameSend.style["display"] = "none";
  bakameRecording.style["display"] = "none";
  timerLabel.textContent = '';
};

const bakameCleanRecorder = () => {
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

const stopRecoder = async () => {
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

  timerCounter = setInterval(function () {
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


const regexInputValidataion = (input) => {
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

bakameType.addEventListener("focus", () => {
  console.log("input focused");
  foldUp();
});

bakameType.addEventListener("input", () => {
  if (bakameType.value === "") {
    bakameMic.style["display"] = "block";
    bakameSend.style["display"] = "none";
  }
  if (bakameType.value !== "") {
    bakameMic.style["display"] = "none";
    bakameSend.style["display"] = "block";
  }
});

bakameType.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    regexInputValidataion(bakameType.value);
    console.log("Return key pressed!", bakameType.value);
    initialContent.style['display'] = 'none';
    rasaApi(bakameType.value);
    bakameType.value = "";
  }
});

bakameMic.addEventListener("click", (event) => {
  event.preventDefault();
  foldUp();
  bakameMic.style["display"] = "none";
  bakameSaba.style["display"] = "none";
  bakameType.style["display"] = "none";
  bakameRecording.style["display"] = "flex";
});

bakameSend.addEventListener("click", (event) => {
  event.preventDefault();
  regexInputValidataion(bakameType.value);

  initialContent.style['display'] = 'none';

  rasaApi(bakameType.value);
  bakameType.value = "";

});

bakameMic.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Mic clicked");
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

bakameAudio.addEventListener("click", (event) => {
  event.preventDefault();
  bakameCleanRecorder();
});

bakameMobile.addEventListener("click", () => {
  chatbot.style["display"] = "block";
  smallDev.style["display"] = "none";
});


// calling the api

const rasaApi = (query) => {

  let rasaURL = "http://64.226.97.252:5005/webhooks/rest/webhook";
  let user = getUser();
  let reqData = {
    sender: user,
    message: query
  }
  const sendRequest = async () => {
    // const { data: res } = await axios.post(rasaURL, reqData, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    res = [
      {
        recipient_id: "user",
        text: "Murakaza neza kuri Bakame"
      },
      {
        recipient_id: "user",
        image: "https://rtn.rw/wp-content/uploads/2019/07/irembo-300x83.png"
      },
      {
        recipient_id: "user",
        text: "murashaka gukora ku wuhe munsi",
        buttons: [
          {
            title: "2023-01-23",
            payload: "/permanent_driving_license_date{\"permanent_driving_license_date_slot\": \"2023-01-23\"}"
          },
          {
            title: "2023-02-01",
            payload: "/permanent_driving_license_date{\"permanent_driving_license_date_slot\": \"2023-02-01\"}"
          },
          {
            title: "2023-02-15",
            payload: "/permanent_driving_license_date{\"permanent_driving_license_date_slot\": \"2023-02-15\"}"
          }
        ]
      }
    ]


    chatContent.innerHTML = `
      <p class="questionsContent">
          ${query}
      </p>`;


    //responses
    allResponse = '';
    let div = createDiv(); // this div will hold the buttons

    res.map((response) => {

      let text = response.text || "";
      // let image = response.image || "";
      let buttons = response.buttons || [];

      buttons.length && buttons.map((btn) => {
        let button = document.createElement('button');
        button.class="BakameBtn";
        button.payload=btn.payload;
        //onclick the button should call a function to send another req with the payload provided
        button.innerHTML = btn.title;
        div.appendChild(button);
      });
      //append the button's div into the response div

      allResponse += `
        <p class="questionsContent">
        ${response.text}
        </p>`;
      //on the above allResponse, instead it should be a content,
      // which will append the children in chronological order
      //both for the request then the response
    });

    chatResponse.innerHTML = allResponse;
    // after all, no more of chatResponse or allResponse
    // then build a function to handle when a user clicks on a button
    console.log("--->", res);
  }


  sendRequest();

}

const createDiv = () =>{
  let div = document.createElement('div');
  return div;
}

// this function will receive the request data
// it should create  the request div and its children included and return it

const createDomRequestTree = (req)=>{
  let chatTextContent = document.createElement('div');
  chatTextContent.class = "chatTextContent"
  const questionsContent= document.createElement("p");
  questionsContent.class ="questionsContent";
  questionsContent.innerHTML=req;
  chatTextContent.appendChild(questionsContent);

  return chatTextContent;
}


//this function will receive the response object
// it should create the response div and its children included and return it
const createDomResponseTree = (res)=>{
  let chatTextResponse = document.createElement('div');
  chatTextResponse.class= "chatTextResponse";
  const questionsContent = document.createElement('p');
  questionsContent.class ="questionsContent";
  questionsContent.innerHTML=res;
  chatTextResponse.appendChild(questionsContent);

  return chatTextResponse;

}