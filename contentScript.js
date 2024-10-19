// contentScript.js

let dubbingEnabled = false;
let selectedVoice = null;

chrome.storage.sync.get(['dubbingEnabled', 'selectedVoice'], function (data) {
    dubbingEnabled = data.dubbingEnabled || false;
    selectedVoice = data.selectedVoice || null;
    if (dubbingEnabled && selectedVoice) {
        startDubbing();
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'applySettings') {
        dubbingEnabled = request.dubbingEnabled;
        selectedVoice = request.selectedVoice;
        if (dubbingEnabled) {
            startDubbing();
        } else {
            stopDubbing();
        }
    }
});

function startDubbing() {
    // Fetch the transcript
    getTranscriptText().then(transcript => {
        // Send transcript to Cartesia AI API to get audio URL
        fetch('https://api.cartesia.ai/tts/bytes', {
            method: "POST",
            headers: {
                "X-API-Key": "3248ef07-3b61-46b9-8f1f-1106aed258b6",
                "Cartesia-Version": "2024-06-10",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model_id": "string",
                "transcript": "string",
                "voice": {
                "mode": "id",
                "id": "string"
                },
                "output_format": {
                "container": "wav",
                "sample_rate": 0
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Play the audio
            playAudio(data.audio_url);
        })
        .catch(error => {
            console.error('Error converting text to audio:', error);
        });
    });
}

function stopDubbing() {
    // Stop the audio if playing
    const audioElement = document.getElementById('cartesia-dubbing-audio');
    if (audioElement) {
        audioElement.pause();
        audioElement.remove();
    }
}

function getTranscriptText() {
    return new Promise((resolve, reject) => {
        // Code to extract the transcript text from the YouTube page

        // This is a simplified example; actual implementation may vary
        // You may need to programmatically click the transcript button and parse the transcript

        // For this example, let's assume we have the transcript in a variable
        let transcript = 'This is a sample transcript of the YouTube video.';

        resolve(transcript);
    });
}

function playAudio(audioUrl) {
    // Remove any existing audio element
    const existingAudio = document.getElementById('cartesia-dubbing-audio');
    if (existingAudio) {
        existingAudio.remove();
    }

    const audio = document.createElement('audio');
    audio.id = 'cartesia-dubbing-audio';
    audio.src = audioUrl;
    audio.autoplay = true;

    // Optionally, sync audio playback with video playback
    const video = document.querySelector('video');
    if (video) {
        audio.currentTime = video.currentTime;
        video.addEventListener('play', () => audio.play());
        video.addEventListener('pause', () => audio.pause());
        video.addEventListener('seeked', () => {
            audio.currentTime = video.currentTime;
        });
    }

    document.body.appendChild(audio);
}

