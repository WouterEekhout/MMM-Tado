# MagicMirror Module: MMM-Tado
A MagicMirror Module for your Tado Smart Thermostat. 

### The module displays the following information:

* A symbol to show if the heater is currently active.
* The current temperature
* The target temperature
* The humidity
* The hot water temperature, if not available; the current power state

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

Install NPM dependencies from inside the MMM-Tado folder:
```
cd MMM-Tado/
npm install
```

Configure the module in your `config.js` file.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
units: 'metric',

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
			<td><b>Required</b> - Your Tado username.</td>
		</tr>
        <tr>
			<td><code>password</code></td>
			<td><b>Required</b> - Your Tado password.</td>
		</tr>
        <tr>
            <td><code>updateInterval</code></td>
            <td><b>Optional</b> - In milliseconds the update interval. Default: <code>300000</code> 
            (5 minutes). This value cannot be lower than <code>300000</code>. Otherwise users get a
             <code>Tado block</code>.</td>
        </tr>
        <tr>
            <td><code>units</code></td>
            <td>
                What units to use. This property can be set in the general configuration settings. See the <a href="https://docs.magicmirror.builders/getting-started/configuration.html#general">MagicMirror Documentation</a> for more information.
            </td>
        </tr>
	</tbody>
</table>

---
<p align="center">
    <a href="https://www.tado.com">This module is powered by the Tado API.</a>    
</p>


## Credits
This module is highly inspired by the 
MMM-Toon module: https://github.com/MichMich/MMM-Toon.

Using the NPM package node-tado-client: https://github.com/mattdavis90/node-tado-client
