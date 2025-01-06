# Drive on Sunshine

## 🌟 Project Highlights
The project was created in Home Assistant and Node-red for the 2023 Nissan Leaf with 1-phase charging and a Feyree 3-phase charger connected via local Tuya.

Depending on what car you have, what charger and what you measure currents and power with - you will have to modify the code.
In my case, currents and power measurements are performed by shelly 3m.

## 🚀 Features
- zero-export mode, balancing the production from photovoltaic panels. Uses the integration [Balance Neto]( https://github.com/MiguelAngelLV/balance_neto)
- maximum current operating mode, in which the PID controller monitors the supply current and sets the car charging current so as not to exceed the connected power for too long.

## 📖 Node-red Flow

![nodered](https://github.com/MichalAug/DriveOnSunshine/blob/pics/nodered.png)

## 📚 
**driveonsunshine.json** - this file contains a complete flow that you can import to node-red

**PID.js** - if you don't have node-red, here you will find the PID controller code in javascript, adjust it to your needs

**currentbalanced.js** - here you will find the controller code for hourly balancing
