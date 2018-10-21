const code = document.getElementById("code");
code.addEventListener("keydown",(e) => {
    if (e.keyCode == 9) {
        e.preventDefault();
        let start = code.selectionStart;
        code.value = code.value.substring(0,code.selectionStart) +
            "\t" + code.value.substring(code.selectionEnd);
        code.selectionStart = code.selectionEnd = start + 1;
    }
    if (e.keyCode == 13) {
        e.preventDefault();
        let start = code.selectionStart;
        code.value = code.value.substring(0,code.selectionStart) +
            "\n\t" + code.value.substring(code.selectionEnd);
        code.selectionStart = code.selectionEnd = start + 2;
        code.style.height = (code.value.split("\n").length + 1) * 23 + "px"
    }
    setTimeout(()=>code.style.height = (code.value.split("\n").length + 1) * 23 + "px", 0);
});

const audio = new AudioContext();

const noteKeys = {
    "C_": 32.7032,
    "C#": 34.6478,
    "D_": 36.7081,
    "D#": 38.8909,
    "E_": 41.2034,
    "F_": 43.6535,
    "F#": 46.2493,
    "G_": 48.9994,
    "G#": 51.9131,
    "A_": 55.0000,
    "A#": 58.2705,
    "B_": 61.7354
};

const global = {
    drumLatencyNode: audio.createDelay(),
    gainNode: audio.createGain(),
    panNode: audio.createStereoPanner(),
}
global.drumLatencyNode.connect(global.gainNode);
global.drumLatency = global.drumLatencyNode.delayTime;
global.drumLatency.value = 0.07;
global.gainNode.connect(global.panNode);
global.gain = global.gainNode.gain;
global.panNode.connect(audio.destination);
global.pan = global.panNode.pan;
global.gain.value = 0.5;

const channel1 = {
    osc: audio.createOscillator(),
    inverseNode: audio.createGain(),
    delayNode: audio.createDelay(),
    gainNode: audio.createGain(),
    panNode: audio.createStereoPanner(),
    octave: 1,
    volume: 1,
    length: 0,
    lengthMultiplier: 1,
    fadeDir: 0,
    fadeSpeed: 0,
    dutyCycle: 2,
    tone: 0,
    pointer: 0,
    line: "",
    subroutine: false,
    caller: 0,
    loopCount: 0,
    loopLine: 0,
    pointerElement: document.getElementById("c1pointer"),
};
channel1.osc.type = "sawtooth";
channel1.osc.start(0);
channel1.osc.connect(channel1.gainNode);
channel1.osc.connect(channel1.delayNode);
channel1.delayNode.connect(channel1.inverseNode);
channel1.delay = channel1.delayNode.delayTime;
channel1.inverseNode.connect(channel1.gainNode);
channel1.inverseNode.gain.value = -1;
channel1.gainNode.connect(channel1.panNode);
channel1.gain = channel1.gainNode.gain;
channel1.gain.value = 0;
channel1.panNode.connect(global.drumLatencyNode);
channel1.pan = channel1.panNode.pan;
channel1.pan.value = 0;
const channel2 = {
    osc: audio.createOscillator(),
    inverseNode: audio.createGain(),
    delayNode: audio.createDelay(),
    gainNode: audio.createGain(),
    panNode: audio.createStereoPanner(),
    octave: 1,
    volume: 1,
    length: 0,
    lengthMultiplier: 1,
    fadeDir: 0,
    fadeSpeed: 0,
    dutyCycle: 2,
    tone: 0,
    pointer: 0,
    line: "",
    subroutine: false,
    caller: 0,
    loopCount: 0,
    loopLine: 0,
    pointerElement: document.getElementById("c2pointer"),
};
channel2.osc.type = "sawtooth";
channel2.osc.start(0);
channel2.osc.connect(channel2.gainNode);
channel2.osc.connect(channel2.delayNode);
channel2.delayNode.connect(channel2.inverseNode);
channel2.delay = channel2.delayNode.delayTime;
channel2.inverseNode.connect(channel2.gainNode);
channel2.inverseNode.gain.value = -1;
channel2.gainNode.connect(channel2.panNode);
channel2.gain = channel2.gainNode.gain;
channel2.gain.value = 0;
channel2.panNode.connect(global.drumLatencyNode);
channel2.pan = channel2.panNode.pan;
channel2.pan.value = 0;
const channel3 = {
    osc: audio.createOscillator(),
    gainNode: audio.createGain(),
    panNode: audio.createStereoPanner(),
    octave: 1,
    instrument: 0,
    waves: [],
    volume: 1,
    length: 0,
    lengthMultiplier: 1,
    tone: 0,
    pointer: 0,
    line: "",
    subroutine: false,
    caller: 0,
    loopCount: 0,
    loopLine: 0,
    pointerElement: document.getElementById("c3pointer"),
};
instrument_fft_data.forEach(instrument => {
    channel3.waves.push(audio.createPeriodicWave(instrument.cos,instrument.sin));
});
channel3.osc.start(0);
channel3.osc.connect(channel3.gainNode);
channel3.gainNode.connect(channel3.panNode);
channel3.gain = channel3.gainNode.gain;
channel3.gain.value = 0;
channel3.panNode.connect(global.drumLatencyNode);
channel3.pan = channel3.panNode.pan;
channel3.pan.value = 0;
const channel4 = {
    gainNode: audio.createGain(),
    panNode: audio.createStereoPanner(),
    drums: [{},{},{},{},{},{}],
    kit: 1,
    volume: 1,
    length: 0,
    lengthMultiplier: 1,
    pointer: 0,
    line: "",
    subroutine: false,
    caller: 0,
    loopCount: 0,
    loopLine: 0,
    pointerElement: document.getElementById("c4pointer"),
};
channel4.drums.forEach((obj, kit) => {
    Object.keys(noteKeys).map(note => {
        let source = audio.createBufferSource();
        let request = new XMLHttpRequest();
        request.open('GET',`drums/${kit}/${note.replace("#","s")}.mp3`, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            audio.decodeAudioData(request.response, buffer => {
                obj[note] = buffer;
            }, e => {
                console.error(`Error with decoding audio data for drum ${note} in kit ${kit}: `, e);
            });
        };
        request.send();
    });
});
channel4.gainNode.connect(channel4.panNode);
channel4.gain = channel4.gainNode.gain;
channel4.panNode.connect(audio.destination);
channel4.pan = channel4.panNode.pan;

/*** Stuff that I'm not using™ ***/
//function creates an Oscillator. In this code we are creating an Oscillator for every tune, which help you control the gain. 
//If you want, you can try creating the Oscillator once and stopping/starting it as you wish.
function createOscillator(freq, duration) {
    var attack = 10, //duration it will take to increase volume full sound volume, makes it more natural
        gain = audio.createGain(),
        osc = audio.createOscillator();

    gain.connect(audio.destination);
    gain.gain.setValueAtTime(0, audio.currentTime); //change to "1" if you're not fadding in/out
    gain.gain.linearRampToValueAtTime(1, audio.currentTime + attack / 1000); //remove if you don't want to fade in
    gain.gain.linearRampToValueAtTime(0, audio.currentTime + duration / 1000); //remove if you don't want to fade out

    osc.frequency.value = freq;
    osc.type = "square";
    osc.connect(gain);
    osc.start(0);


    setTimeout(function() {
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(audio.destination);
    }, duration)
}

let songTimeout;
let tempo = 10; // 3.125x
let lines;
function play() {
    for (channel in [0,1,2,3]) {
        with ([channel1, channel2, channel3, channel4][channel]) {
            gain.cancelScheduledValues(audio.currentTime);
            pointer = 0;
            loopLine = 0;
            subroutine = false;
            length = 0;
            if (channel != 3) {
                gain.value = 0;
                octave = 0;
            }
            pan.value = 0;
        }
    }
    global.pan.value = 0;
    global.gain.value = 1;
    tempo = 10;
    clearTimeout(songTimeout);
    lines = code.value.split("\n");
    
    let match;
    if (lines[1] && (match = lines[1].match(/^\s*musicheader \d, 1, (\w+)$/))) {
        channel1.pointer = lines.indexOf(match[1]+":");
        channel1.pointerElement.style.top = channel1.pointer * 23 + "px";
    }
    if (lines[2] && (match = lines[2].match(/^\s*musicheader 1, 2, (\w+)$/))) {
        channel2.pointer = lines.indexOf(match[1]+":");
        channel2.pointerElement.style.top = channel2.pointer * 23 + "px";
    }
    if (lines[3] && (match = lines[3].match(/^\s*musicheader 1, 3, (\w+)$/))) {
        channel3.pointer = lines.indexOf(match[1]+":");
        channel3.pointerElement.style.top = channel3.pointer * 23 + "px";
    }
    if (lines[4] && (match = lines[4].match(/^\s*musicheader 1, 4, (\w+)$/))) {
        channel4.pointer = lines.indexOf(match[1]+":");
        channel4.pointerElement.style.top = channel4.pointer * 23 + "px";
    }
    advanceSong();
    document.getElementById("pause").textContent = "Pause";
    paused = false;
    document.getElementById("pause").removeAttribute("disabled");
}

let paused = false;
function pause() {
    if (paused) {
        advanceSong();
        document.getElementById("pause").textContent = "Pause";
        paused = false;
    } else {
        for (channel in [0,1,2,3]) {
            with ([channel1, channel2, channel3, channel4][channel]) {
                gain.cancelScheduledValues(audio.currentTime);
                if (channel != 3) {
                    gain.value = 0;
                }
            }
        }
        clearTimeout(songTimeout);
        document.getElementById("pause").textContent = "Resume";
        paused = true;
    }
}
let savedState = [{},{},{},{},{}]
function saveState() {
    for (channel in [0,1,2,3]) {
        with ([channel1, channel2, channel3, channel4][channel]) {
            savedState[channel].subroutine = subroutine;
            savedState[channel].caller = caller;
            savedState[channel].pointer = pointer;
            savedState[channel].length = length;
            savedState[channel].pan = pan.value;
            savedState[channel].lengthMultiplier = lengthMultiplier;
            savedState[channel].loopLine = loopLine;
            savedState[channel].loopCount = loopCount;
            if (channel != 3) {
                savedState[channel].octave = octave;
                savedState[channel].volume = volume;
                if (channel == 2) {
                    savedState[channel].instrument = instrument;
                } else {
                    savedState[channel].dutyCycle = dutyCycle;
                    savedState[channel].fadeDir = fadeDir;
                    savedState[channel].fadeSpeed = fadeSpeed;
                }
            } else {
                
            }
        }
    }
    savedState[4].tempo = tempo;
    savedState[4].gain = global.gain.value;
    savedState[4].pan = global.pan.value;
    document.getElementById("load").removeAttribute("disabled");
}
function loadState() {
    for (channel in [0,1,2,3]) {
        with ([channel1, channel2, channel3, channel4][channel]) {
            subroutine = savedState[channel].subroutine;
            caller = savedState[channel].caller;
            pointer = savedState[channel].pointer;
            pointerElement.style.top = pointer * 23 + "px";
            length = savedState[channel].length;
            pan.value = savedState[channel].pan;
            lengthMultiplier = savedState[channel].lengthMultiplier;
            loopLine = savedState[channel].loopLine;
            loopCount = savedState[channel].loopCount;
            if (channel != 3) {
                gain.value = 0;
                octave = savedState[channel].octave;
                volume = savedState[channel].volume;
                if (channel == 2) {
                    instrument = savedState[channel].instrument;
                    osc.setPeriodicWave(waves[instrument]);
                } else {
                    dutyCycle = savedState[channel].dutyCycle;
                    fadeDir = savedState[channel].fadeDir;
                    fadeSpeed = savedState[channel].fadeSpeed;
                }
            }
        }
    }
    tempo = savedState[4].tempo;
    global.gain.value = savedState[4].gain;
    global.pan.value = savedState[4].pan;
}

function advanceSong() {
    for (channel in [channel1, channel2, channel3, channel4]) {
        with ([channel1,channel2,channel3,channel4][channel]) {
            if (pointer == 0) continue;
            loop: while (--length <= 0) {
                line = lines[++pointer].trim();
                pointerElement.style.top = pointer * 23 + "px";
                if (line.indexOf(";") != -1) line = line.substring(0,line.indexOf(";")).trim();
                if (line == "") continue;
                let command = line.split(/\s+/)[0];
                // console.log(line);
                let args = line.substring(command.length+1).split(/\s*,\s*/);
                switch (line.split(/\s/)[0]) {
                    case "tempo":
                        // console.log(args[0]/16);
                        tempo = args[0]/16;
                        break;
                    case "volume":
                        if (args[1]) {
                            args[1] = parseInt(args[1].replace("$",""),16);
                            args[0] = parseInt(args[0].replace("$",""),16);
                        } else {
                            args[1] = parseInt(args[0][2],16);
                            args[0] = parseInt(args[0][1],16);
                        }
                        global.gain.value = Math.max(args[0], args[1])/15;
                        if (args[1] > args[0]) {
                            global.pan.value = 1 - args[0]/args[1];
                        } else if (args[0] > args[1]) {
                            global.pan.value = -1 + args[1]/args[0];
                        } else {
                            global.pan.value = 0;
                        }
                        break;
                    case "stereopanning":
                    case "panning":
                        // break; // disable stereo;
                        // TODO: what does anything other than f or 0 do
                        switch (args[0]) {
                            case "$f":
                            case "$0f":
                                pan.value = -1;
                                break;
                            case "$ff":
                                pan.value = 0;
                                break;
                            case "$f0":
                                pan.value = 1;
                                break;
                        }
                        break;
                    case "vibrato":
                        // TODO: implement vibrato
                        break;
                    case "notetype":
                        // console.log(args[0]);
                        lengthMultiplier = parseInt(args[0].replace("$",""),16) % 16;
                        if (!args[1]) break;
                        args[0] = args[1];
                    case "intensity":
                        if (channel == 2) {
                            volume = [0, 1, 0.5, 0.25][args[0][1]];
                            // console.log(parseInt(args[0][2],16));
                            instrument = parseInt(args[0][2],16);
                            osc.setPeriodicWave(waves[instrument]);
                        } else {
                            // TODO: (possibly) more arguments for future versions or something?
                            // meanwhile I get to do some math
                            volume = parseInt(args[0][1],16)/15;
                            fadeDir = parseInt(args[0][2],16) > 7 ? 1 : 0;
                            fadeSpeed = parseInt(args[0][2],16) % 8; // TODO: this probably is dependent on the note length
                        }
                        break;
                    case "dutycycle":
                        dutyCycle = parseInt(args[0].replace("$",""),16);
                        break;
                    case "octave":
                        octave = args[0] - (channel == 2);
                        break;
                    case "tone":
                        tone = parseInt(args[0].replace("$",""),16);
                        break;
                    case "callchannel":
                        subroutine = true;
                        caller = pointer;
                        pointer = lines.indexOf(args[0]+":");
                        break;
                    case "endchannel":
                        if (subroutine) {
                            subroutine = false;
                            pointer = caller;
                            caller = 0;
                        } else {
                            // TODO: what needs to happen here? I honestly don't know
                            pointer = 0;
                        }
                        break;
                    case "loopchannel":
                        if (loopLine == pointer) {
                            if (args[0] == 0 || ++loopCount < args[0]-1) {
                                pointer = lines.indexOf(args[1]+":");
                            }
                        } else {
                            loopLine = pointer;
                            loopCount = 0;
                            pointer = lines.indexOf(args[1]+":");
                        }
                        break;
                    case "note":
                        if (channel < 3) {
                            if (args[0] == "__") {
                                gain.value = 0;
                                length = args[1] * lengthMultiplier;
                                break loop;
                            };
                            osc.frequency.value = noteKeys[args[0]]*(2**octave) + 131072/(2048-tone) - 64;
                            // console.log(channel);
                            if (channel <= 1) delay.value = [0.125,0.25,0.5,0.75][dutyCycle] * 1/osc.frequency.value;
                            // console.log(volume);
                            gain.value = volume;
                            if (channel <= 1) gain.linearRampToValueAtTime(fadeDir, audio.currentTime + (args[1]*lengthMultiplier*tempo/1000));
                            length = args[1]*lengthMultiplier;
                            break loop;
                        } else { // channel 4 = drums
                            if (args[0] == "__") {
                                length = args[1] * lengthMultiplier;
                                break loop;
                            }
                            let source = audio.createBufferSource();
                            source.buffer = drums[kit][args[0]];
                            source.connect(gainNode);
                            source.start();
                            length = args[1] * lengthMultiplier;
                            break loop;
                        }
                    case "slidepitchto":
                        break; // TODO: I don't actually know how this works well enough, requires testing
                        if (channel != 0) break;
                        osc.frequency.linearRampToValueAtTime(noteKeys[args[2]]*(2**args[1]), audio.currentTime + args[0])
                        break;
                }
            }
        }
    }
    songTimeout = setTimeout(advanceSong, tempo);
}