/**
 * Created by Wouter Eekhout on 06/01/2017.
 */
Module.register("MMM-Tado", {
    // Default module config.
    defaults: {
        username: '',
        password: '',
        updateInterval: 300000,
    },

    tadoMe: {},
    tadoHomes: [],

    getStyles: function () {
        return [
            this.file('css/MMM-Tado.css'),
        ];
    },

    start: function () {
        if (this.config.updateInterval < this.defaults.updateInterval){
            this.config.updateInterval = this.defaults.updateInterval;
        }

        this.config.units = self.config.units;
        this.sendSocketNotification('CONFIG', this.config);
    },

    // Override dom generator.
    getDom: function () {
        let self = this;
        let wrapper = document.createElement("div");
        wrapper.className = "tado-info";

        this.tadoHomes.forEach(home => {
            let homeWrapper = document.createElement("div");
            homeWrapper.className = "tado-home";

            let logoWrapper = document.createElement("i");
            logoWrapper.className = "tado-icon-tado_logo tado-logo";
            homeWrapper.appendChild(logoWrapper);

            let tableWrapper = document.createElement("table");
            tableWrapper.className = "tado-table small";

            home.zones.forEach(zone => {
                let rowWrapper = document.createElement("tr");

                if (zone.type === "HOT_WATER") {
                    let firstTableDataWrapper = document.createElement("td");
                    firstTableDataWrapper.className = "tado-table-name";

                    let zoneNameWrapper = document.createElement("span");
                    zoneNameWrapper.innerText = zone.name;
                    firstTableDataWrapper.appendChild(zoneNameWrapper);
                    rowWrapper.appendChild(firstTableDataWrapper);

                    let secondTableDateWrapper = document.createElement("td");
                    secondTableDateWrapper.className = "tado-table-data";

                    let temperatureWrapper = document.createElement("span");
                    let temperatureIconWrapper = document.createElement("i");
                    temperatureIconWrapper.className = "fa fa-thermometer-half";
                    temperatureWrapper.appendChild(temperatureIconWrapper);
                    if (zone.state.setting.temperature == null) {
                        var temperatureTextWrapper = document.createTextNode(zone.state.setting.power);
                    } else {
                        if (self.config.units === "metric") {
                            var temperatureTextWrapper = document.createTextNode(zone.state.setting.temperature.celsius + "°");
                        } else {
                            var temperatureTextWrapper = document.createTextNode(zone.state.setting.temperature.fahrenheit + "°");
                        }
                    }
                    temperatureWrapper.appendChild(temperatureTextWrapper);
                    secondTableDateWrapper.appendChild(temperatureWrapper);

                    rowWrapper.appendChild(secondTableDateWrapper);
                }
                else if (zone.type === "HEATING") {
                    let firstTableDataWrapper = document.createElement("td");
                    firstTableDataWrapper.className = "tado-table-name";

                    let zoneNameWrapper = document.createElement("span");
                    zoneNameWrapper.innerText = zone.name;
                    firstTableDataWrapper.appendChild(zoneNameWrapper);
                    rowWrapper.appendChild(firstTableDataWrapper);

                    let secondTableDateWrapper = document.createElement("td");
                    secondTableDateWrapper.className = "tado-table-data";

                    //current temperature
                    let temperatureWrapper = document.createElement("span");
                    temperatureWrapper.className = "bright";
                    let temperatureIconWrapper = document.createElement("i");
                    temperatureIconWrapper.className = "fa fa-thermometer-half";
                    temperatureWrapper.appendChild(temperatureIconWrapper);
                    if (this.config.units === "metric") {
                        var temperatureTextWrapper = document.createTextNode(zone.state.sensorDataPoints.insideTemperature.celsius + "°");
                    } else {
                        var temperatureTextWrapper = document.createTextNode(zone.state.sensorDataPoints.insideTemperature.fahrenheit + "°");
                    }
                    temperatureWrapper.appendChild(temperatureTextWrapper);
                    if (zone.state.activityDataPoints.heatingPower.percentage > 0) {
                        //The zone is heating
                        let heatingWrapper = document.createElement("i");
                        heatingWrapper.className = "fa fa-fire bright";
                        temperatureWrapper.appendChild(heatingWrapper);
                    }
                    secondTableDateWrapper.appendChild(temperatureWrapper);

                    //target temperature
                    let temperatureTargetWrapper = document.createElement("span");
                    temperatureTargetWrapper.className = "xsmall";
                    let temperatureTargetIconWrapper = document.createElement("i");
                    temperatureTargetIconWrapper.className = "fa fa-thermometer-half";
                    temperatureTargetWrapper.appendChild(temperatureTargetIconWrapper);
                    if (zone.state.setting.temperature == null) {
                        var temperatureTargetTextWrapper = document.createTextNode(zone.state.setting.power);
                    } else {
                        if (this.config.units === "metric") {
                            var temperatureTargetTextWrapper = document.createTextNode(zone.state.setting.temperature.celsius + "°");
                        } else {
                            var temperatureTargetTextWrapper = document.createTextNode(zone.state.setting.temperature.fahrenheit + "°");
                        }
                    }
                    temperatureTargetWrapper.appendChild(temperatureTargetTextWrapper);
                    secondTableDateWrapper.appendChild(temperatureTargetWrapper);

                    let breakLine = document.createElement("br");
                    secondTableDateWrapper.appendChild(breakLine);

                    let humidityWrapper = document.createElement("span");
                    let humidityIconWrapper = document.createElement("i");
                    humidityIconWrapper.className = "fa fa-tint";
                    humidityWrapper.appendChild(humidityIconWrapper);
                    let humidityTextWrapper = document.createTextNode(zone.state.sensorDataPoints.humidity.percentage + "%");
                    humidityWrapper.appendChild(humidityTextWrapper);
                    secondTableDateWrapper.appendChild(humidityWrapper);

                    rowWrapper.appendChild(secondTableDateWrapper);
                }
                else if (zone.type === "AIR_CONDITIONING") {
                    let firstTableDataWrapper = document.createElement("td");
                    firstTableDataWrapper.className = "tado-table-name";

                    let zoneNameWrapper = document.createElement("span");
                    zoneNameWrapper.innerText = zone.name;
                    firstTableDataWrapper.appendChild(zoneNameWrapper);
                    rowWrapper.appendChild(firstTableDataWrapper);

                    let secondTableDateWrapper = document.createElement("td");
                    secondTableDateWrapper.className = "tado-table-data";

                    //current temperature
                    let temperatureWrapper = document.createElement("span");
                    temperatureWrapper.className = "bright";
                    let temperatureIconWrapper = document.createElement("i");
                    temperatureIconWrapper.className = "fa fa-thermometer-half";
                    temperatureWrapper.appendChild(temperatureIconWrapper);
                    if (this.config.units === "metric") {
                        var temperatureTextWrapper = document.createTextNode(zone.state.sensorDataPoints.insideTemperature.celsius + "°");
                    } else {
                        var temperatureTextWrapper = document.createTextNode(zone.state.sensorDataPoints.insideTemperature.fahrenheit + "°");
                    }
                    temperatureWrapper.appendChild(temperatureTextWrapper);
                    if (zone.state.setting.mode === "HEAT") {
                        //The zone is heating
                        let heatingWrapper = document.createElement("i");
                        heatingWrapper.className = "fa fa-fire bright";
                        temperatureWrapper.appendChild(heatingWrapper);
                    }
                    else if (zone.state.setting.mode === "COOL") {
                        //The zone is cooling
                        let coolingWrapper = document.createElement("i");
                        coolingWrapper.className = "fa fa-snowflake bright";
                        temperatureWrapper.appendChild(coolingWrapper);
                    }
                    secondTableDateWrapper.appendChild(temperatureWrapper);

                    //target temperature
                    let temperatureTargetWrapper = document.createElement("span");
                    temperatureTargetWrapper.className = "xsmall";
                    let temperatureTargetIconWrapper = document.createElement("i");
                    temperatureTargetIconWrapper.className = "fa fa-thermometer-half";
                    temperatureTargetWrapper.appendChild(temperatureTargetIconWrapper);
                    if (zone.state.setting.temperature == null) {
                        var temperatureTargetTextWrapper = document.createTextNode(zone.state.setting.power);
                    } else {
                        if (this.config.units === "metric") {
                            var temperatureTargetTextWrapper = document.createTextNode(zone.state.setting.temperature.celsius + "°");
                        } else {
                            var temperatureTargetTextWrapper = document.createTextNode(zone.state.setting.temperature.fahrenheit + "°");
                        }
                    }
                    temperatureTargetWrapper.appendChild(temperatureTargetTextWrapper);
                    secondTableDateWrapper.appendChild(temperatureTargetWrapper);

                    let breakLine = document.createElement("br");
                    secondTableDateWrapper.appendChild(breakLine);

                    let humidityWrapper = document.createElement("span");
                    let humidityIconWrapper = document.createElement("i");
                    humidityIconWrapper.className = "fa fa-tint";
                    humidityWrapper.appendChild(humidityIconWrapper);
                    let humidityTextWrapper = document.createTextNode(zone.state.sensorDataPoints.humidity.percentage + "%");
                    humidityWrapper.appendChild(humidityTextWrapper);
                    secondTableDateWrapper.appendChild(humidityWrapper);

                    rowWrapper.appendChild(secondTableDateWrapper);
                } else {
                    //don't add it
                    return;
                }

                tableWrapper.appendChild(rowWrapper);
            });

            homeWrapper.appendChild(tableWrapper);
            wrapper.appendChild(homeWrapper);
        });
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'NEW_DATA') {
            this.tadoMe = payload.tadoMe;
            this.tadoHomes = payload.tadoHomes;
            this.updateDom();
        }
    }
});