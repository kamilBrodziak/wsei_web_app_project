import './scss/soundApp.scss';
import './scss/recorder.scss'
import '../scss/common.scss';
import SoundApp from "./js/SoundApp";

window.addEventListener("load", () => {
    new SoundApp();
})