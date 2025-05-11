// Pobranie danych wejściowych
const totalPowerActual = msg.totalPowerActual.state; // Aktualna moc chwilowa (W)
const powerHourBalance = msg.currentBalance.state * 1000; // Godzinowy bilans energii (Wh)
const currentChargingCurrent = msg.currentChargingCurrent; // Aktualny prąd ładowania (A)

// Parametry ładowarki
const maxCurrent = 32; // Maksymalny prąd ładowania (A)
const minCurrent = 8; // Minimalny prąd ładowania (A)

// Czas do końca godziny w godzinach (ułamkowo)
const remainingTime = (60 - new Date().getMinutes()) / 60;

// Obliczenie mocy docelowej na podstawie bilansu godzinowego
const desiredPower = powerHourBalance / remainingTime; // Moc potrzebna do wyrównania bilansu (W)

// Obliczenie mocy do skompensowania
const compensationPower = (-totalPowerActual + 2*desiredPower)/3; // zwiększenie wagi bilansu względem chwilowej

// Parametry regulatora PID
const Kp = 0.8; //0.5            // Wzmocnienie proporcjonalne
const Ki = 0.1; //0.04;            // Wzmocnienie całkujące
const Kd = 0.1; //0.125;           // Wzmocnienie różniczkujące
const dt = 2.5;             // Próbkowanie w sekundach 

// Stan regulatora PID (przechowywany w pamięci przepływu Node-RED)
let pidState = flow.get("pidState") || { integral: 0, previousError: 0 };

// Sprawdzenie, czy jest pełna godzina
const currentTime = new Date();
if (currentTime.getMinutes() === 0 && currentTime.getSeconds() === 0) {
    // Zerowanie stanu PID o pełnej godzinie
    pidState = { integral: 0, previousError: 0 };
}

// Obliczenie błędu PID
const error = compensationPower; // Błąd PID to moc do skompensowania (W)
pidState.integral += error * dt; // Aktualizacja składnika całkującego
const derivative = (error - pidState.previousError) / dt; // Składnik różniczkujący
pidState.previousError = error; // Zapisanie bieżącego błędu

// Wyjście PID
const pidOutput = Kp * error;// + Ki * pidState.integral + Kd * derivative;

// Obliczenie nowego prądu ładowania
let newChargingCurrent = currentChargingCurrent + pidOutput / 230; // Moc na prąd (230V)

// Ograniczenie prądu ładowania do zakresu ładowarki
newChargingCurrent = Math.max(minCurrent, Math.min(newChargingCurrent, maxCurrent));
newChargingCurrent = Math.round(newChargingCurrent);  // Zaokrąglanie do 1A

// Zapisanie stanu PID w pamięci przepływu
flow.set("pidState", pidState);

/*
//Zwrócenie wyniku
msg.payload = {
    newChargingCurrent: newChargingCurrent, // Nowy prąd ładowania (A)
    pidOutput: pidOutput, // Wyjście regulatora PID (W)
    error: error, // Błąd regulatora PID (W)
    compensationPower: compensationPower, // Moc do skompensowania (W)
    desiredPower: desiredPower, // Moc docelowa z bilansu godzinowego (W)
    totalPowerActual: totalPowerActual // Aktualna moc chwilowa (W)
};
*/
msg.currentBalanced = newChargingCurrent;


return msg;
