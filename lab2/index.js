var SoundApp = /** @class */ (function () {
    function SoundApp() {
        this.audioTags = {};
        this.loadAudioTags();
        this.addKeyPressEvent();
    }
    SoundApp.prototype.loadAudioTags = function () {
        var _this = this;
        var audios = document.querySelectorAll("audio.piano_audio");
        audios.forEach(function (el) {
            _this.audioTags[el.dataset.key] = el;
        });
    };
    SoundApp.prototype.addKeyPressEvent = function () {
        var _this = this;
        window.addEventListener('keypress', function (ev) {
            if (Object.keys(_this.audioTags).indexOf(ev.key) !== -1) {
                var sound = _this.audioTags[ev.key];
                sound.currentTime = 0;
                sound.play();
            }
        });
    };
    return SoundApp;
}());
new SoundApp();
