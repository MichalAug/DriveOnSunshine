# Drive on Sunshine

## 🌟 Project Highlights
The project was created in Home Assistant and Node-red for the 2023 Nissan Leaf with 1-phase charging and a Feyree 3-phase charger connected via local Tuya.

Depending on what car you have, what charger and what you measure currents and power with - you will have to modify the code.
In my case, currents and power measurements are performed by shelly 3m.

- zero-export mode, balancing the production from photovoltaic panels. Uses the integration [Balance Neto]( https://github.com/MiguelAngelLV/balance_neto)
- maximum current operating mode, in which the PID controller monitors the supply current and sets the car charging current so as not to exceed the connected power for too long.

## 📖 Node-red Flow

![nodered](https://github.com/MichalAug/DriveOnSunshine/blob/pics/nodered.png)

## 📖 Home Assistant Dashboard

![nodered](https://github.com/MichalAug/DriveOnSunshine/blob/pics/leaf.png)

## 📚 
- **currentbalanced.js** - here you will find the controller code for hourly balancing
- **PID.js** - here you will find the PID controller code in javascript, adjust it to your needs

## 🚀 Testing and Tuning Steps

### Observation of Response:

- Monitor how the system reacts to changes in the steady-state current of the load and how quickly it adjusts to variable loads.
- Pay attention to the settling time (time required to reach the target value) and oscillations.

### Increasing Kp:

- If the system responds too slowly, increase Kp.
- If the response is fast but oscillations occur, decrease Kp.

### Tuning Ki:

- If the system exhibits a consistent error (e.g., the current does not reach the exact maximum value), increase Ki.
- If the response is too aggressive, decrease Ki.

### Tuning Kd:

- If oscillations occur or the system is unstable, increase Kd.
- If damping is too strong (the system responds very slowly), decrease Kd.

![PID regulator](https://github.com/MichalAug/DriveOnSunshine/blob/pics/PID.png)
