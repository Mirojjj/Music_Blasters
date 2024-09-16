const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const seekBar = document.getElementById("seek-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeControl = document.getElementById("volume");
const songTitleEl = document.getElementById("song-title");
const songInput = document.getElementById("songInput");
const playlistEl = document.getElementById("playlist");

let isPlaying = false;
let currentSongIndex = 0;
let playlist = [];

function loadSong(index) {
  const song = playlist[index];
  if (song) {
    audioPlayer.src = song.src;
    songTitleEl.innerHTML = `<marquee direction="right">${song.title}</marquee>`;
    isPlaying = false;
    playBtn.innerHTML = "⏯️";
  }
}

const onPlayBtnClick = () => {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    playBtn.innerHTML = "⏯️";
  } else {
    audioPlayer.play();
    isPlaying = true;
    playBtn.innerHTML = "⏸️";
  }
};

const onPrevBtnClick = () => {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentSongIndex);
  audioPlayer.play();
  isPlaying = true;
  playBtn.innerHTML = "⏸️";
};

const onNextBtnClick = () => {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex);
  audioPlayer.play();
  isPlaying = true;
  playBtn.innerText = "⏸️";
};

const moveNextOnSongEnd = () => {
  nextBtn.click();
};

playBtn.addEventListener("click", onPlayBtnClick);
prevBtn.addEventListener("click", onPrevBtnClick);
nextBtn.addEventListener("click", onNextBtnClick);
audioPlayer.addEventListener("ended", moveNextOnSongEnd);

// Update time and seek bar
audioPlayer.addEventListener("timeupdate", () => {
  const currentTime = Math.floor(audioPlayer.currentTime);
  const duration = Math.floor(audioPlayer.duration);

  seekBar.value = (currentTime / duration) * 100 || 0;

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

seekBar.addEventListener("input", () => {
  const seekTo = (seekBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTo;
});

volumeControl.addEventListener("input", () => {
  audioPlayer.volume = volumeControl.value;
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

//add song in to the playlist
songInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    const song = {
      title: file.name,
      src: URL.createObjectURL(file), // Create a URL for the uploaded file
    };
    playlist.push(song);
    addSongToPlaylist(song);
  });
  if (playlist.length > 0 && !audioPlayer.src) {
    loadSong(currentSongIndex); // Load the first song if it's not loaded yet
  }
});

//make the added songs in the playlist visible to UI

function addSongToPlaylist(song) {
  const li = document.createElement("li");
  li.textContent = song.title;
  li.addEventListener("click", () => {
    currentSongIndex = playlist.findIndex(s.title === song.title);
    loadSong(currentSongIndex);
    audioPlayer.play();
    isPlaying = true;
    playBtn.innerHTML("⏸️");
  });
  playlistEl.appendChild(li);
}

if (playlist.length > 0) {
  loadSong(currentSongIndex);
}

// sync volumechange
audioPlayer.addEventListener("volumechange", () => {
  volumeControl.value = audioPlayer.volume;
});

// Sync play/pause when using the default player
audioPlayer.addEventListener("play", () => {
  updatePlayPauseButton(true);
});

audioPlayer.addEventListener("pause", () => {
  updatePlayPauseButton(false);
});

// Update play/pause button based on state
function updatePlayPauseButton(playing) {
  isPlaying = playing;
  playBtn.innerHTML = playing ? "⏸️" : "⏯️"; // Show play/pause icon
}
