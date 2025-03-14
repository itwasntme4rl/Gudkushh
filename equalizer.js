// equalizer.js

const audioInput = document.getElementById('audioInput');
let audio = null;
const equalizerDiv = document.getElementById('equalizer');
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let source;
let filters = [];
const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

frequencies.forEach((freq, index) => {
    const bandDiv = document.createElement('div');
    bandDiv.className = 'eq-band';

    const label = document.createElement('label');
    label.textContent = freq + (freq >= 1000 ? 'kHz' : 'Hz');

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '-30';
    slider.max = '30';
    slider.value = '0';

    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = '0 dB';

    bandDiv.appendChild(label);
    bandDiv.appendChild(slider);
    bandDiv.appendChild(valueDisplay);

    equalizerDiv.appendChild(bandDiv);

    const filter = audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = freq;
    filters.push(filter);

    slider.addEventListener('input', () => {
        const gainValue = parseInt(slider.value);
        filter.gain.value = gainValue;
        valueDisplay.textContent = gainValue + ' dB';
    });
});

audioInput.addEventListener('change', (event) => {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed successfully');
            processAudio(event);
        }).catch(error => {
            console.error('Error resuming AudioContext:', error);
        });
    } else {
        processAudio(event);
    }
});

function processAudio(event) {
    const file = event.target.files[0];
    if (file) {
        if (audio) {
            audio.pause();
            audio.remove();
            audio = null;
            if (source) {
                source.disconnect();
            }
        }

        audio = document.createElement('audio');
        audio.id = 'myAudio';
        audio.controls = true;
        document.getElementById('audio-container').appendChild(audio);

        const objectURL = URL.createObjectURL(file);
        audio.src = objectURL;

        audio.addEventListener('loadedmetadata', () => {
            source = audioContext.createMediaElementSource(audio);
            source.connect(filters[0]);
            for (let i = 0; i < filters.length - 1; i++) {
                filters[i].connect(filters[i + 1]);
            }
            filters[filters.length - 1].connect(audioContext.destination);

            audio.play().catch(error => {
                console.error("Play error:", error);
            });
        });
    }
}

window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global error:", message, source, lineno, colno, error);
    return false;
};