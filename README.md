# MagicMirror Module: MMM-Tado
A MagicMirror Module for your Tado Smart Thermostat. 

### The module displays the following information:

* A symbol to show if the heater is currently active.
* The current temperature
* The target temperature
* The humidity
* The hot water temperature.

### Screenshot
![screenshot](https://github.com/WouterEekhout/MMM-Tado/blob/master/img/screenshot.png)

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/WouterEekhout/MMM-Tado
````

Configure the module in your `config.js` file.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
        module: 'MMM-Tado',
        position: 'top_right', // This can be any of the regions.
        config: {
            username: 'your_tado_username', 
            password: 'your_tado_password', 
            updateInterval: 300000
        }
    }
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	</thead>
	<tbody>
        <tr>
			<td><code>username</code></td>
			<td><b>Required</b></code> - Your Tado username.</td>
		</tr>
        <tr>
			<td><code>password</code></td>
			<td><b>Required</b></code> - Your Tado password.</td>
		</tr>
        <tr>
            <td><code>updateInterval</code></td>
            <td><b>Optional</b></code> - In milliseconds the update interval. Default: <code>300000</code> (5 minutes).</td>
        </tr>
	</tbody>
</table>

---
<p align="center">
    <a href="https://www.tado.com">This module is powered by the Tado API.</a>    
</p>


## Acknowledgements
This module is highly inspired by the 
MMM-Toon module: https://github.com/MichMich/MMM-Toon.

The Tado client is inspired by:
node-tado by dVelopment: https://github.com/dVelopment/node-tado
