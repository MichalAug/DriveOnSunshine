// Konfiguracja
const minCurrent = 8; // Minimalny prąd ładowania (A)
const maxCurrent = 32; // Maksymalny prąd ładowania (A)
const stepCurrent = 1; // Krok regulacji prądu (A)

// Parametry wejściowe
const currentBalance = msg.currentBalance; // Bilans energetyczny (kWh)
const remainingMinutes = 60 - (new Date()).getMinutes(); // Minuty do końca godziny

// Aktualny prąd ładowania
let currentChargingCurrent = msg.currentChargingCurrent|| minCurrent; 

// Oblicz energię do skompensowania
const energyToCompensate = currentBalance; // Wartość ujemna oznacza potrzebę poboru

// Maksymalny pobór energii w pozostałym czasie (kWh)
const maxEnergyConsumption = (remainingMinutes / 60) * maxCurrent * 230 / 1000;

// Minimalny pobór energii w pozostałym czasie (kWh)
const minEnergyConsumption = (remainingMinutes / 60) * minCurrent * 230 / 1000;

// Oblicz nowy prąd ładowania
if (energyToCompensate > maxEnergyConsumption) {
    currentChargingCurrent = maxCurrent;
} else if (energyToCompensate < minEnergyConsumption) {
    currentChargingCurrent = minCurrent;
} else {
    // Oblicz optymalny prąd ładowania w celu zbilansowania
    currentChargingCurrent = Math.round((energyToCompensate * 1000) / (230 * remainingMinutes / 60));
    currentChargingCurrent = Math.max(minCurrent, Math.min(maxCurrent, currentChargingCurrent));
    currentChargingCurrent = Math.round(currentChargingCurrent / stepCurrent) * stepCurrent; // Zaokrąglenie do kroku
}

// Wyślij wynik
msg.payload = currentChargingCurrent; // Prąd ładowania (A)
return msg;
