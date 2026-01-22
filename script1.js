let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

let errorCooldown = false;

/* ================= SPEAK FUNCTION (FEMALE VOICE) ================= */

function speak(text) {
    window.speechSynthesis.cancel();

    let utterance = new SpeechSynthesisUtterance(text);
    let voices = window.speechSynthesis.getVoices();

    let femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("female") ||
        v.lang === "en-IN"
    );

    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.rate = 1.5;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = "en-IN";

    window.speechSynthesis.speak(utterance);
}

window.speechSynthesis.onvoiceschanged = () => {};

/* ================= GREETING ================= */

function wishMe() {
    let h = new Date().getHours();
    if (h < 12) speak("Good Morning");
    else if (h < 16) speak("Good Afternoon");
    else speak("Good Evening");
}

window.addEventListener("load", wishMe);

/* ================= SPEECH RECOGNITION ================= */

let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new SpeechRecognition();

recognition.lang = "en-IN";
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = (event) => {
    let transcript = event.results[event.resultIndex][0].transcript.trim();

    if (transcript.length < 2) {
        if (!errorCooldown) {
            errorCooldown = true;
            speak("Please speak clearly");
            setTimeout(() => errorCooldown = false, 3000);
        }
        resetUI();
        return;
    }

    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

recognition.onerror = () => {
    resetUI();
};

/* ================= BUTTON CLICK ================= */

btn.addEventListener("click", () => {
    recognition.abort();

    setTimeout(() => {
        recognition.start();
        voice.style.display = "block";
        btn.style.display = "none";
    }, 400);
});

/* ================= UI RESET ================= */

function resetUI() {
    voice.style.display = "none";
    btn.style.display = "flex";
}

/* ================= COMMAND HANDLER ================= */

function takeCommand(message) {
    resetUI();

    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello, how can I help you?");
    }
    else if (message.includes("who are you")) {
        speak("My name is Lily. I am your virtual assistant created for our mini project");
    }
       else if (message.includes("how are you")) {
        speak("I am doing great. Thank you for asking. How can I help you today?");
    }
    else if (message.includes("open youtube")) {
        speak("Opening YouTube");
        window.open("https://youtube.com", "_blank");
    }
    else if (message.includes("open google")) {
        speak("Opening Google");
        window.open("https://google.com", "_blank");
    }
    else if (message.includes("open facebook")) {
        speak("Opening Facebook");
        window.open("https://facebook.com", "_blank");
    }
    else if (message.includes("open linkedin")) {
        speak("Opening LinkedIn");
        window.open("https://linkedin.com", "_blank");
    }
    else if (message.includes("open instagram")) {
        speak("Opening Instagram");
        window.open("https://instagram.com", "_blank");
    }
    else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp");
        window.open("https://web.whatsapp.com", "_blank");
    }
    else if (message.includes("time")) {
        let time = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
        speak("The time is " + time);
    }
    else if (message.includes("date")) {
        let date = new Date().toLocaleDateString([], {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
        speak("Today's date is " + date);
    }
    else {
        speak("Here is what I found on the internet");
        window.open(
            `https://www.google.com/search?q=${encodeURIComponent(message)}`,
            "_blank"
        );
    }
}
