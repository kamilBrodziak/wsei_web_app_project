import getEl from "../../utils/ElementGetter";
import Recorder from "./Recorder";

export interface AudioElementAttrs  {
    buf?: AudioBuffer,
    source?: AudioBufferSourceNode,
    src: string,
}

export type AudioElement = {[key:string]:AudioElementAttrs};

export type Recording = {[key:number]:Recorder}

class SoundApp {
    elements: AudioElement = {};
    recordings: Recording = {};
    recordingsCount: number;
    audioCtx:AudioContext;
    gain: GainNode;
    recordingsContainer:HTMLDivElement;
    constructor() {
        this.recordingsContainer = getEl("#recordings");
        this.audioCtx = new AudioContext();
        this.gain = this.audioCtx.createGain();
        this.gain.connect(this.audioCtx.destination);
        this.initAudios();
        this.initAddRecordButton();
    }

    initAddRecordButton() {
        const btn = getEl('#createRecordingButton')
        btn.addEventListener('click', e => {
            this.newRecording();
        });
    }

    removeRecording(id: number) {
        delete this.recordings[id];
    }

    newRecording() {
        const recorder = new Recorder(this.gain, this.audioCtx, 
            () => this.removeRecording(this.recordingsCount), this.recordingsContainer);
        this.recordings[this.recordingsCount++] = recorder;
    }

    initAudios() {
        document.querySelectorAll('audio').forEach(el => this.elements[el.dataset.key] = {src:el.src});
        Promise.all(Object.values(this.elements).map((el) => fetch(el.src)
            .then(resp => resp.arrayBuffer())
            .then(buf => this.audioCtx.decodeAudioData(buf))
            .then(audioBuf => {
                el.buf = audioBuf;
                return Promise.resolve(el);
            })
        
        ))
        window.addEventListener('keypress', (ev) => {
            if (Object.keys(this.elements).indexOf(ev.key) !== -1) {
                const sound = this.elements[ev.key];
                this.playSound(sound);
            }
        })
    }

    playSound(el:AudioElementAttrs) {
        const source = this.audioCtx.createBufferSource();
        source.buffer = el.buf;
        source.connect(this.gain);
        el.source = source;
        source.start(0);
    }
}

export default SoundApp;