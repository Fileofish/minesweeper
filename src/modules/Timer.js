export default class Timer {
  constructor(timerDisplay) {
    this.timerDisplay = timerDisplay;
    this.timerMean = '00:00:00';
    this.timerId = null;
  }

  startTimer() {
    let [hour, minute, second] = this.timerMean.split(':');
    if (+second < 59) {
      second = (+second < 9) ? '0' + (+second + 1) : +second + 1;
    } else if (+minute < 59) {
      second = '00';
      minute = (+minute < 9) ? '0' + (+minute + 1) : +minute + 1;
    } else {
      second = '00';
      minute = '00';
      hour = (+hour < 9) ? '0' + (+hour + 1) : +hour + 1;
    }
    this.timerMean = `${hour}:${minute}:${second}`;
    this.timerDisplay.innerHTML = this.timerMean;

    this.timerId = setTimeout(() => {
      this.startTimer();
    }, 1000);

    return this.timerMean;
  }

  clearTimer() {
    clearTimeout(this.timerId);
  }
}