# Drive on Sunshine

## 🌟 Project Highlights
The project was created in Home Assistant and Node-red for the 2023 Nissan Leaf with 1-phase charging and a Feyree 3-phase charger connected via local Tuya.

## 🚀 Features
- zero-export mode, balancing the production from photovoltaic panels. Uses the integration [Balance Neto]( https://github.com/MiguelAngelLV/balance_neto)
- maximum current operating mode, in which the PID controller monitors the supply current and sets the car charging current so as not to exceed the connected power for too long.
