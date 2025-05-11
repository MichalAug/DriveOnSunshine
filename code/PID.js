// Parametry Anti-Windup
const maxIntegral = 5; // Maksymalna dopuszczalna wartość integralnej części
const minIntegral = -5; // Minimalna dopuszczalna wartość integralnej części

// Parametry PID
let kp = 0.3;//0.4; //było 0.5;  // Proporcjonalne wzmocnienie
let ki = 0.1; //0.05; //było 0.1// Całkowe wzmocnienie
let kd = 0.11; //0.08; //było 0.06; // Różniczkowe wzmocnienie

// Wejścia (wartości prądów)
const maxCurrent = 20; // Domyślnie 20A
const currentSource = msg.currentSource;
const currentAdjustable = msg.currentChargingCurrent;
const currentBalanced = msg.currentBalanced||32;

// Bufor dla wartości wejściowych
context.inputBuffer = context.inputBuffer || [];
context.inputBuffer.push(currentSource);

// Zachowaj tylko 5 ostatnich wartości
if (context.inputBuffer.length > 2) {
    context.inputBuffer.shift();
}

// Uśrednij wartości w buforze
const filteredCurrentSource = context.inputBuffer.reduce((sum, val) => sum + val, 0) / context.inputBuffer.length;

// Błąd regulacji
const error = maxCurrent - filteredCurrentSource;

// Inicjalizacja kontekstu
context.previousError = context.previousError || 0;
context.integral = context.integral || 0;

// Progi do resetowania integralnej części przy dużych zmianach
const integralResetThreshold = 5;  // Próg dla dużych zmian w błędzie (np. 5A)
if (Math.abs(error - context.previousError) > integralResetThreshold) {
    context.integral = 0;  // Resetowanie integralnej części przy dużych zmianach
}

// Obliczanie części całkowej (akumulacja błędu)
context.integral += error;

// Zastosowanie Anti-Windup: Ograniczenie wartości integralnej części
if (context.integral > maxIntegral) {
    context.integral = maxIntegral;
} else if (context.integral < minIntegral) {
    context.integral = minIntegral;
}

// Obliczanie części różniczkowej
const derivative = error - context.previousError;

// Obliczanie wartości wyjścia PID
let adjustment = kp * error + ki * context.integral + kd * derivative;

// Dodanie histerezy
const upperThreshold = 1;  // Górny próg dla regulacji (np. 1A)
const lowerThreshold = -1; // Dolny próg dla regulacji (np. -1A)

// Zmiana tylko, jeśli błąd wykracza poza progi
if (error > upperThreshold) {
    adjustment = 1;  // Zwiększenie prądu
} else if (error < lowerThreshold) {
    adjustment = -1;  // Zmniejszenie prądu
} else {
    adjustment = 0;  // Brak zmiany, gdy błąd jest w obrębie histerezy
}

// Zaktualizowanie wyjścia
let newCurrentAdjustable = currentAdjustable + adjustment;
newCurrentAdjustable = Math.round(newCurrentAdjustable);  // Zaokrąglanie do 1A
newCurrentAdjustable = Math.min(Math.max(newCurrentAdjustable, 8), 32);  // Ograniczenie zakresu (min 8A, max 20A)

// Zapisz bieżący błąd do kolejnej iteracji
context.previousError = error;

if (currentBalanced > newCurrentAdjustable) {
    msg.payload = newCurrentAdjustable;    
} else {
    msg.payload = currentBalanced;    
}
return msg;
