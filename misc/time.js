// Ethan Garnica
// CST-325
// Final
// 5/12/2023

function Time() {
    this.secondsElapsedSinceStart = 0;
    this.lastTime = 0;
    this.deltaTime = 0;

    this.update = function() {
        var currentTime = new Date().getTime();
        if (this.lastTime != 0) {
            this.deltaTime = (currentTime - this.lastTime) / 1000.0;
            this.secondsElapsedSinceStart += this.deltaTime;
        }
        this.lastTime = currentTime;
    }
}

// EOF 00100001-10