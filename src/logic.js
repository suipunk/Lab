const intervalNames = {
    0: "P1 (Unison)", 1: "m2 (Minor Second)", 2: "M2 (Major Second)",
    3: "m3 (Minor Third)", 4: "M3 (Major Third)", 5: "P4 (Perfect Fourth)",
    6: "TT (Tritone)", 7: "P5 (Perfect Fifth)", 8: "m6 (Minor Sixth)",
    9: "M6 (Major Sixth)", 10: "m7 (Minor Seventh)", 11: "M7 (Major Seventh)",
    12: "P8 (Octave)"
};

function midiToFreq(midi) {
    return 440.0 * Math.pow(2.0, (midi - 69) / 12.0);
}

function checkAnswerLogic(semitones, userInput) {
    const correctName = intervalNames[semitones];
    const shortCode = correctName.split(' ')[0].toUpperCase();
    const formattedInput = userInput.trim().toUpperCase();
    return formattedInput === shortCode;
}

// Експортуємо функції ТІЛЬКИ для тестів (браузер цей блок проігнорує)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { midiToFreq, checkAnswerLogic };
}