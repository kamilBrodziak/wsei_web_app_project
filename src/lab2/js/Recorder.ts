import ElementBuilder, { EventType, TagName } from "../../utils/ElementBuilder";
import getEl from "../../utils/ElementGetter";

export enum RecorderStatus {
    INIT = 'Recording not started',
    RECORDING = 'Recording',
    ENDED = 'ended',
    PAUSED = 'Paused',
} 

class Recorder {
    container:HTMLDivElement;
    recordingsContainer:HTMLElement;
    startPauseButton: HTMLButtonElement;
    stopRemoveButton: HTMLButtonElement;
    recordingStatus: HTMLDivElement;
    btnsContainer:HTMLDivElement;
    recorder: MediaRecorder;
    status: RecorderStatus = RecorderStatus.INIT;
    chunks: Blob[] = [];
    getElement() {return this.container}
    removeEl:() => void;
    constructor(gain: GainNode, audioCtx: AudioContext, removeEl:() => void, recordingsContainer?:HTMLElement) {
        this.initRecorder(gain, audioCtx);
        this.removeEl = removeEl;
        this.recordingsContainer = recordingsContainer;
        this.initElements();
    }

    private initRecorder(gain:GainNode, audioCtx: AudioContext) {
        const streamNode = audioCtx.createMediaStreamDestination();
        gain.connect(streamNode);
        this.recorder = new MediaRecorder(streamNode.stream);
        this.recorder.ondataavailable = (e) => this.chunks.push(e.data);
        this.recorder.onstop = (e) => {
            const blob = new Blob(this.chunks, {type: 'audio/mpeg'});
            const audio = new Audio(URL.createObjectURL(blob));
            audio.controls = true;
            this.container.prepend(audio)
        }
    }

    private initElements() {
        this.startPauseButton = new ElementBuilder<HTMLButtonElement>(TagName.BUTTON)
            .addEvent(EventType.ONCLICK, () => {
                if(this.status === RecorderStatus.INIT) {
                    this.onStart();
                } else if(this.status === RecorderStatus.PAUSED) {
                    this.onResume();
                } else if(this.status === RecorderStatus.RECORDING) {
                    this.onPause();
                }
            }).innerText("Start").addClass('soundAppButton').build()
        this.stopRemoveButton = new ElementBuilder<HTMLButtonElement>(TagName.BUTTON)
            .addEvent(EventType.ONCLICK, () => {
                if(this.status === RecorderStatus.RECORDING || this.status === RecorderStatus.PAUSED) {
                    this.onStop();
                } else if(this.status === RecorderStatus.ENDED || this.status === RecorderStatus.INIT) {
                    this.onRemove();
                }
            }).innerText("Remove").addClass('soundAppButton').build()
        
        this.recordingStatus = new ElementBuilder<HTMLDivElement>(TagName.DIV).innerText('Recording not started').build();
        this.container = new ElementBuilder<HTMLDivElement>(TagName.DIV)
            .appendChilds([this.startPauseButton, this.recordingStatus, this.stopRemoveButton]).addId("recording").build();
        this.recordingsContainer.appendChild(this.container);
    }

    private setRecordingStatus() {
        this.recordingStatus.innerText = this.status;
        this.recordingStatus.classList.toggle('active');
    }

    private onStart() {
        this.recorder.start();
        this.status = RecorderStatus.RECORDING;
        this.setRecordingStatus();
        this.startPauseButton.innerText = "Pause";
        this.stopRemoveButton.innerText = "Stop";
    }

    private onPause() {
        this.recorder.pause();
        this.status = RecorderStatus.PAUSED;
        this.setRecordingStatus();
        this.startPauseButton.innerText = "Resume";
    }

    private onResume() {
        this.recorder.resume();
        this.startPauseButton.innerText = "Pause";
        this.status = RecorderStatus.RECORDING;
        this.setRecordingStatus();
        this.recorder.resume();
    }

    private onRemove() {
        this.container.remove();
        this.removeEl();
    }

    private onStop() {
        this.recorder.stop();
        this.status = RecorderStatus.ENDED;
        this.stopRemoveButton.innerText = "Remove";
        this.startPauseButton.remove();
        this.recordingStatus.remove();
    }
}

export default Recorder;