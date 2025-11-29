class CountdownTimer {
    constructor() {
        this.targetDate = null;
        this.timerInterval = null;
        this.totalDuration = 0;
        this.initializeElements();
        this.bindEvents();
        this.setMinDateTime();
    }

    initializeElements() {
        this.elements = {
            targetDateInput: document.getElementById('target-date'),
            eventNameInput: document.getElementById('event-name'),
            startBtn: document.getElementById('start-timer'),
            resetBtn: document.getElementById('reset-timer'),
            newTimerBtn: document.getElementById('new-timer'),
            timerDisplay: document.getElementById('timer-display'),
            completionMessage: document.getElementById('completion-message'),
            eventTitle: document.getElementById('event-title'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            progressFill: document.getElementById('progress-fill'),
            completionText: document.getElementById('completion-text')
        };
    }

    bindEvents() {
        this.elements.startBtn.addEventListener('click', () => this.startTimer());
        this.elements.resetBtn.addEventListener('click', () => this.resetTimer());
        this.elements.newTimerBtn.addEventListener('click', () => this.newTimer());

        this.elements.targetDateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startTimer();
        });

        this.elements.eventNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startTimer();
        });
    }

    setMinDateTime() {
        const now = new Date();
        const minDateTime = new Date(now.getTime() + 60000);
        this.elements.targetDateInput.min = minDateTime.toISOString().slice(0, 16);
    }

    startTimer() {
        const targetDateValue = this.elements.targetDateInput.value;
        if (!targetDateValue) return this.showError('Please select a target date and time');

        this.targetDate = new Date(targetDateValue);
        const now = new Date();

        if (this.targetDate <= now) {
            return this.showError('Please select a future date and time');
        }

        this.totalDuration = this.targetDate.getTime() - now.getTime();

        const eventName = this.elements.eventNameInput.value.trim();
        this.elements.eventTitle.textContent = eventName || 'Countdown Timer';

        document.querySelector('.input-section').style.display = 'none';
        this.elements.timerDisplay.classList.add('active');
        this.elements.completionMessage.classList.remove('active');

        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;

        if (distance < 0) return this.completeTimer();

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.elements.days.textContent = this.formatTime(days);
        this.elements.hours.textContent = this.formatTime(hours);
        this.elements.minutes.textContent = this.formatTime(minutes);
        this.elements.seconds.textContent = this.formatTime(seconds);

        const elapsed = this.totalDuration - distance;
        const progress = (elapsed / this.totalDuration) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
    }

    formatTime(time) {
        return time.toString().padStart(2, '0');
    }

    completeTimer() {
        clearInterval(this.timerInterval);
        this.elements.timerDisplay.classList.remove('active');
        this.elements.completionMessage.classList.add('active');

        const eventName = this.elements.eventNameInput.value.trim();
        if (eventName) this.elements.completionText.textContent = `${eventName} has arrived!`;

        this.launchConfetti();
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.showInputSection();
    }

    newTimer() {
        this.resetTimer();
        this.elements.targetDateInput.value = '';
        this.elements.eventNameInput.value = '';
    }

    showInputSection() {
        document.querySelector('.input-section').style.display = 'block';
        this.elements.timerDisplay.classList.remove('active');
        this.elements.completionMessage.classList.remove('active');
    }

    showError(message) {
        alert(message);
    }

    launchConfetti() {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });

            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});
