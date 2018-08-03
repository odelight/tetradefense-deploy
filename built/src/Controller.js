import { Util } from "./Util.js";
import { AudioService } from "./AudioService.js";
export class Controller {
    constructor(document) {
        this.waitingForClickListeners = [];
        var canvas = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
        canvas.addEventListener('mousemove', Controller.staticOnMouseMove);
        canvas.addEventListener('click', Controller.staticOnMouseClick);
        document.addEventListener('keydown', Controller.staticOnKeyPress);
        this.registerHtmlFormElements(document);
        Controller.instance = this;
    }
    registerHtmlFormElements(document) {
        var soundOnRadio = Util.checkType(document.getElementById('soundOn'), HTMLInputElement);
        var soundOffRadio = Util.checkType(document.getElementById('soundOff'), HTMLInputElement);
        var musicOnRadio = Util.checkType(document.getElementById('musicOn'), HTMLInputElement);
        var musicOffRadio = Util.checkType(document.getElementById('musicOff'), HTMLInputElement);
        soundOnRadio.onclick = (() => AudioService.setSoundEffectsOn(true));
        soundOffRadio.onclick = (() => AudioService.setSoundEffectsOn(false));
        musicOnRadio.onclick = (() => AudioService.setMusicOn(true));
        musicOffRadio.onclick = (() => AudioService.setMusicOn(false));
        var radios = [soundOnRadio, soundOffRadio, musicOnRadio, musicOffRadio];
        for (var radio of radios) {
            if (radio.checked) {
                if (radio.onclick != null)
                    radio.onclick(new MouseEvent("null"));
            }
        }
    }
    static turnSoundOn(a, b) {
        return null;
    }
    setLevel(level) {
        this.level = level;
    }
    static staticOnMouseMove(event) {
        Controller.instance.onMouseMove(event);
    }
    static staticOnMouseClick(event) {
        Controller.instance.onMouseClick(event);
    }
    static staticOnKeyPress(event) {
        Controller.instance.onKeyPress(event);
    }
    onMouseMove(event) {
        if (this.waitingForClick) {
            return;
        }
        this.rawMouseX = event.clientX;
        this.rawMouseY = event.clientY;
        this.level.updateGhostTetrad(this.rawMouseX, this.rawMouseY);
    }
    onMouseClick(event) {
        if (this.waitingForClick) {
            this.stopWaitingForClick();
            return;
        }
        this.level.clearAndDrawStatic();
        this.level.tryPlaceTetrad(event.clientX, event.clientY);
    }
    onKeyPress(event) {
        if (this.waitingForClick) {
            return;
        }
        if (event.keyCode == Controller.SPACE_BAR_CODE) {
            this.level.tryRotateTetrad(this.rawMouseX, this.rawMouseY);
            event.preventDefault();
        }
    }
    registerWaitingForClickListener(listener) {
        this.waitingForClickListeners.push(listener);
    }
    setWaitForClick() {
        this.waitingForClick = true;
    }
    isWaitingForClick() {
        return this.waitingForClick;
    }
    stopWaitingForClick() {
        for (var listener of this.waitingForClickListeners) {
            listener();
        }
        this.waitingForClick = false;
    }
}
Controller.SPACE_BAR_CODE = 32;
