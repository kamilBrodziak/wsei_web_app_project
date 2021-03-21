class SoundApp {
  audioTags : {[key: string]: HTMLAudioElement} = {};
  constructor() {
    this.loadAudioTags();
    this.addKeyPressEvent();

  }

  loadAudioTags() {
    const _this = this;
    const audios  = document.querySelectorAll("audio.piano_audio");
    audios.forEach((el : HTMLAudioElement) => {
      _this.audioTags[el.dataset.key] = el;
    });
  }

  addKeyPressEvent() {
    const _this = this;
    window.addEventListener('keypress', (ev ) => {
      if(Object.keys(_this.audioTags).indexOf(ev.key) !== -1) {
        const sound = _this.audioTags[ev.key];
        sound.currentTime = 0;
        sound.play();
      }
    })
  }
}

new SoundApp();
