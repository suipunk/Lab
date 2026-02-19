#include <iostream>
#include <cmath>
#include <string>
#include <map>
#include <chrono>
#include <thread>
#include <random>

#ifdef _WIN32
#include <windows.h>
#endif

// Перетворення MIDI → частота (A4 = 440 Гц)
double midiToFreq(int midi) {
    return 440.0 * std::pow(2.0, (midi - 69) / 12.0);
}

// Таблиця назв інтервалів
std::map<int, std::string> intervalNames = {
    {0, "P1 (Unison)"},
    {1, "m2 (Minor Second)"},
    {2, "M2 (Major Second)"},
    {3, "m3 (Minor Third)"},
    {4, "M3 (Major Third)"},
    {5, "P4 (Perfect Fourth)"},
    {6, "TT (Tritone)"},
    {7, "P5 (Perfect Fifth)"},
    {8, "m6 (Minor Sixth)"},
    {9, "M6 (Major Sixth)"},
    {10, "m7 (Minor Seventh)"},
    {11, "M7 (Major Seventh)"},
    {12, "P8 (Octave)"}
};

// Порівняння введеної відповіді з інтервалом
bool checkAnswer(const std::string& input, int semitones) {
    std::string correct = intervalNames[semitones];
    std::string shortCode = correct.substr(0, correct.find(' ')); // наприклад "P5"
    std::string in = input;
    
    // Перевірка без урахування регістру для зручності
    for (auto &c : in) c = std::toupper(c);
    std::string shortCodeUpper = shortCode;
    for (auto &c : shortCodeUpper) c = std::toupper(c);

    if (in == shortCodeUpper) return true;
    return false;
}

// Відтворення частоти (тільки Windows) або вивід у консоль
void playTone(double freq, int durationMs) {
#ifdef _WIN32
    Beep((DWORD)freq, durationMs);
#else
    std::cout << "[tone: " << freq << " Hz for " << durationMs << " ms]" << std::endl;
#endif
    std::this_thread::sleep_for(std::chrono::milliseconds(durationMs + 150));
}

int main() {
    std::cout << "Simple Interval Trainer (Console Edition)\n";
    // ОНОВЛЕНО: Додано інструкцію для повтору
    std::cout << "Enter the interval (e.g. P5, m3, M2, TT), 'r' to replay, or 'exit' to quit.\n\n";

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> noteDist(48, 72); // MIDI 48..72 (C3–C5)
    std::uniform_int_distribution<> intervalDist(0, 12);

    int correct = 0, total = 0;

    while (true) {
        int root = noteDist(gen);
        int semitones = intervalDist(gen);
        int second = root + semitones;

        double freq1 = midiToFreq(root);
        double freq2 = midiToFreq(second);

        bool needNewInterval = true;
        
        while (needNewInterval) {
            std::cout << "Playing interval..." << std::endl;
            playTone(freq1, 500);
            playTone(freq2, 500);

            std::cout << "Your answer: ";
            std::string input;
            std::cin >> input;
            
            if (input == "exit" || input == "EXIT") {
                std::cout << "\nFinal Score: " << correct << " / " << total << "\n";
                std::cout << "Thanks for training your ear! \n";
                return 0; // Вихід з програми
            }
            
            // НОВА ФУНКЦІЯ: Повтор інтервалу
            if (input == "r" || input == "R") {
                std::cout << "Replaying...\n";
                continue; // Повертаємось на початок внутрішнього циклу, щоб зіграти ще раз
            }

            total++;
            if (checkAnswer(input, semitones)) {
                correct++;
                std::cout << "Correct! It was " << intervalNames[semitones] << "\n\n";
            } else {
                std::cout << "Wrong. It was " << intervalNames[semitones] << "\n\n";
            }

            std::cout << "Score: " << correct << " / " << total << "\n";
            std::cout << "-----------------------------\n";
            needNewInterval = false; // Виходимо з внутрішнього циклу, генеруємо новий інтервал
        }
    }
    return 0;
