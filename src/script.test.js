import { describe, it, expect, vi } from 'vitest';
import { midiToFreq, checkAnswerLogic } from './logic.js';
describe('Бізнес-логіка: Тренажер Інтервалів', () => {

    // Блок 1: Тестування математики (перетворення MIDI в частоту)
    describe('Функція midiToFreq', () => {
        it('повинна повертати 440 Гц для ноти A4 (MIDI 69)', () => {
            const freq = midiToFreq(69);
            expect(freq).toBe(440.0);
        });

        it('повинна повертати 220 Гц для ноти A3 (MIDI 57) - октавою нижче', () => {
            const freq = midiToFreq(57);
            expect(freq).toBe(220.0);
        });

        it('повинна правильно рахувати дробові частоти (C5 = 523.25 Гц)', () => {
            const freq = midiToFreq(72);
            // Використовуємо toBeCloseTo через похибку округлення чисел з рухомою комою
            expect(freq).toBeCloseTo(523.25, 1);
        });
    });

    // Блок 2: Тестування логіки перевірки відповідей
    describe('Функція checkAnswerLogic', () => {
        it('повинна повертати true для правильної відповіді (P5 = 7 півтонів)', () => {
            const isCorrect = checkAnswerLogic(7, 'P5');
            expect(isCorrect).toBe(true);
        });

        it('повинна ігнорувати регістр літер (ввід p5 замість P5)', () => {
            const isCorrect = checkAnswerLogic(7, 'p5');
            expect(isCorrect).toBe(true);
        });

        it('повинна ігнорувати зайві пробіли у відповіді користувача', () => {
            const isCorrect = checkAnswerLogic(4, '  M3  '); // 4 півтони = Велика терція (M3)
            expect(isCorrect).toBe(true);
        });

        it('повинна повертати false для неправильної відповіді', () => {
            const isCorrect = checkAnswerLogic(7, 'm3'); // P5 != m3
            expect(isCorrect).toBe(false);
        });
    });

    // Блок 3: Використання Mock-об'єктів (Вимога лабораторної)
    describe('Робота з Mock та Spy об\'єктами', () => {
        it('повинна викликати функцію-заглушку під час імітації перевірки', () => {
            // Створюємо "шпигуна" (Spy) за допомогою Vitest
            const mockCheck = vi.fn(checkAnswerLogic);

            // Викликаємо мок-функцію
            const result = mockCheck(12, 'P8'); // Октава

            // Перевіряємо (Assertions), чи функція була викликана, і чи правильний результат
            expect(mockCheck).toHaveBeenCalled();
            expect(mockCheck).toHaveBeenCalledWith(12, 'P8');
            expect(result).toBe(true);
        });
    });
});