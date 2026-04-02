import { intervalNames, midiToFreq, checkAnswerLogic } from './logic.js';
import posthog from 'posthog-js';

posthog.init('phc_yydQmedtpkpLHjZ2MFCSmpskcsb4iaUNQMdML9buAond', {
    api_host: 'https://eu.i.posthog.com',
    person_profiles: 'identified_only'
});

// Чекаємо, поки PostHog завантажить прапорці
posthog.onFeatureFlags(() => {
    const hintButton = document.getElementById('hint-btn');

    // Перевіряємо, чи існує кнопка та чи увімкнено прапорець
    if (hintButton) {
        if (posthog.isFeatureEnabled('show-hint-button')) {
            hintButton.style.display = 'inline-block'; // Показуємо кнопку
        } else {
            hintButton.style.display = 'none'; // Ховаємо кнопку
        }
    }
});

// Стан нашої програми
let isPlaying = false;
let currentInterval = null;
let correct = 0;
let total = 0;

// Отримуємо елементи сторінки (як змінні)
const btnPlay = document.getElementById('btn-play');
const btnReplay = document.getElementById('btn-replay');
const answerSection = document.getElementById('answer-section');
const inputAnswer = document.getElementById('input-answer');
const btnCheck = document.getElementById('btn-check');
const feedbackEl = document.getElementById('feedback');
const scoreCorrectEl = document.getElementById('score-correct');
const scoreTotalEl = document.getElementById('score-total');


// 2. Логіка відтворення звуку через браузер
function playTone(freq, durationMs, audioCtx) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = freq;

    // Плавне затухання, щоб звук не "клацав"
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationMs / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + durationMs / 1000);
}

function playIntervalNotes(rootMidi, intervalSemitones) {
    isPlaying = true;
    btnPlay.disabled = true;
    btnReplay.disabled = true;
    feedbackEl.textContent = 'Playing interval...';
    feedbackEl.className = 'feedback';

    const freq1 = midiToFreq(rootMidi);
    const freq2 = midiToFreq(rootMidi + intervalSemitones);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    playTone(freq1, 500, audioCtx); // Перша нота

    setTimeout(() => {
        playTone(freq2, 500, audioCtx); // Друга нота через півсекунди
        setTimeout(() => {
            isPlaying = false;
            btnPlay.disabled = false;
            btnReplay.disabled = false;
            feedbackEl.textContent = '';
        }, 500);
    }, 500);
}

// 3. Логіка взаємодії з користувачем
function generateAndPlayInterval() {
    const root = Math.floor(Math.random() * (72 - 48 + 1)) + 48;
    const semitones = Math.floor(Math.random() * 13);

    currentInterval = { root, semitones };
    inputAnswer.value = '';
    answerSection.style.display = 'block'; // Показуємо поле вводу

    playIntervalNotes(root, semitones);
    posthog.capture('interval_generated');
}

function replayInterval() {
    if (currentInterval) {
        playIntervalNotes(currentInterval.root, currentInterval.semitones);
    }
}

function handleAnswer() {
    if (!currentInterval) return;

    total++;
    scoreTotalEl.textContent = total;

    const isCorrect = checkAnswerLogic(currentInterval.semitones, inputAnswer.value);
    const correctName = intervalNames[currentInterval.semitones];

    if (isCorrect) {
        correct++;
        scoreCorrectEl.textContent = correct;
        feedbackEl.textContent = `Correct! It was ${correctName} 🎸`;
        feedbackEl.className = 'feedback success';
    } else {
        feedbackEl.textContent = `Wrong. It was ${correctName}`;
        feedbackEl.className = 'feedback error';
    }

    currentInterval = null;
    answerSection.style.display = 'none'; // Ховаємо поле вводу до наступної ноти
    btnReplay.disabled = true;
    // Якщо відповідь правильна
    posthog.capture('answer_submitted', { isCorrect: true });

    // якщо неправильна
    posthog.capture('answer_submitted', { isCorrect: false });
}

// 4. Прив'язуємо дії до кнопок
btnPlay.addEventListener('click', generateAndPlayInterval);
btnReplay.addEventListener('click', replayInterval);
btnCheck.addEventListener('click', handleAnswer);

// Дозволяємо натискати Enter в полі вводу
inputAnswer.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleAnswer();
});

// Дозволяємо натискати 'r' для повтору (як у консольній версії)
document.addEventListener('keyup', (e) => {
    if ((e.key === 'r' || e.key === 'к') && currentInterval && !isPlaying && document.activeElement !== inputAnswer) {
        replayInterval();
    }
});

// Вивід статусу застосунку згідно з Лаб №3
const statusEl = document.getElementById('app-status');
if (statusEl) {
    statusEl.textContent = import.meta.env.VITE_APP_STATUS;
}