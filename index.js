console.log("hello i'm Bakame, your guy");

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
const initialContent = document.querySelector('.initialText');
const chatContent = document.querySelector('.chatTextContent');
const chatResponse = document.querySelector('.chatTextResponse');


const bakameClean = () =>{
    bakame.style["display"] = "none";
    bakameSend.style["display"] = "none";
    bakameRecording.style['display'] = "none";
}

const bakameRecordCount = () =>{
    let startTime = new Date().getTime();

    setInterval(function() {
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
}


bakameClean();



const foldUp = () =>{
    console.log("foldUp");
    bakame.style["display"] = "block";
    bakameSaba.style["display"] = "none";

}
const foldDown = () =>{
    console.log("foldDown");
    bakame.style["display"] = "none";
    bakameSaba.style["display"] = "block";
}





// Event listeners


bakameType.addEventListener("focus", ()=>{
    console.log("input focused");
    foldUp();
});


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
    initialContent.style['display'] = 'none';
    chatContent.innerHTML += `
    <p class="questionsContent">
        ${bakameType.value}
    </p>`;
    chatResponse.innerHTML += `
    <p class="questionsContent">
    Thanks for question, in second i will provide a response
    </p>
    `;
    bakameType.value = "";

});

bakameMic.addEventListener("click", (event)=>{
    event.preventDefault();
    console.log("Mic clicked");
    bakameRecordCount();
});

bakameCancel.addEventListener("click", (event) =>{
    event.preventDefault();
    console.log("cancel clicked");
    foldUp();
    bakameMic.style["display"] = "block";
    bakameSaba.style["display"] = "none";
    bakameType.style["display"] = "block";
    bakameRecording.style["display"] = "none";
});

