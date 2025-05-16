const audioPlayer = document.getElementById('audioPlayer');
const loadingIndicator = document.getElementById('loadingIndicator');
const playButton = document.getElementById('playButton'); // Assuming you have a play button

let retryDelay = 1000; // Initial delay in milliseconds
const maxRetryDelay = 15000; // Maximum delay before giving up (adjust as needed)
let retryCount = 0;

function playStream() {
    audioPlayer.play().catch(error => {
        console.error("Error playing audio:", error);
        attemptReconnect();
    });
    if (playButton) {
        playButton.textContent = 'Pause'; // Update button text if you have one
    }
}

function pauseStream() {
    audioPlayer.pause();
    if (playButton) {
        playButton.textContent = 'Play'; // Update button text if you have one
    }
}

function attemptReconnect() {
    if (retryCount > 5) { // Limit the number of retries
        console.log("Maximum reconnection attempts reached.");
        // Optionally display an error message to the user
        return;
    }

    console.log(`Attempting to reconnect in ${retryDelay / 1000} seconds... (Attempt ${retryCount + 1})`);
    setTimeout(() => {
        audioPlayer.load(); // This will reload the audio source, hopefully triggering a new connection
        playStream();
        retryDelay = Math.min(retryDelay * 2, maxRetryDelay); // Exponential backoff
        retryCount++;
    }, retryDelay);
}

audioPlayer.src = 'https://phoebe.streamerr.co:2165/stream';

audioPlayer.addEventListener('loadstart', () => {
    loadingIndicator.style.display = 'block';
    retryCount = 0; // Reset retry count on a new load attempt
    retryDelay = 1000; // Reset delay
});

audioPlayer.addEventListener('canplay', () => {
    loadingIndicator.style.display = 'none';
    playStream(); // Start playing automatically once ready
});

audioPlayer.addEventListener('error', (error) => {
    console.error('Audio player error:', error);
    loadingIndicator.style.display = 'none';
    if (navigator.onLine) { // Only attempt reconnect if the browser thinks we're online
        attemptReconnect();
    } else {
        console.log("Network offline, not attempting to reconnect.");
        // Optionally display an "offline" message to the user
    }
});

// Example play/pause button logic (if you have one)
if (playButton) {
    playButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            playStream();
        } else {
            pauseStream();
        }
    });
}

// Consider also listening for the 'ended' event if your stream can sometimes end unexpectedly
audioPlayer.addEventListener('ended', () => {
    console.log("Stream ended unexpectedly, attempting to reconnect.");
    attemptReconnect();
});
