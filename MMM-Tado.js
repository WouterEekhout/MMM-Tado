/**
 * Created by Wouter Eekhout on 06/01/2017.
 */
Module.register("MMM-Tado",{
    // Default module config.
    defaults: {
        username: '',
        password: '',
        updateInterval: 300000
    },

    tadoClient: {},
    tadoMe: {},
    tadoHomes: [],

    getScripts: function() {
        return [
            'moment.js',
            this.file('js/lib/jquery.min.js'),
            this.file('js/lib/lodash.min.js'),
            this.file('js/tado-client.js') // this file will be loaded straight from the module folder.
        ]
    },

    getStyles: function() {
        return [
            this.file('css/MMM-Tado.css'),
            this.file('css/font-awesome-4.7.0/css/font-awesome.min.css')
        ];
    },

    init: function() {

    },

    start: function() {
        if(this.config.username == '' || this.config.password == '') {
            return;
        }

        this.refreshAll();

        var self = this;

        setTimeout(function(){
            self.updateTadoStates();
            self.updateDom();
        }, 3000); //wait 3 seconds

        setInterval(function() {
            self.updateTadoStates();
            setTimeout(function(){
                self.updateDom();
            }, 3000); //wait 3 seconds
        }, this.config.updateInterval);
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "tado-info";
        _.forEach(this.tadoHomes, function(home){
            var homeWrapper = document.createElement("div");
            homeWrapper.className = "tado-home";

            var logoWrapper = document.createElement("i");
            logoWrapper.className = "tado-icon-tado_logo tado-logo";
            homeWrapper.appendChild(logoWrapper);

            // var homeTitleWrapper = document.createElement("h3");
            // homeTitleWrapper.className = "tado-home-name bright medium light";
            // homeTitleWrapper.innerHTML = home.name;
            // homeWrapper.appendChild(homeTitleWrapper);

            var tableWrapper = document.createElement("table");
            tableWrapper.className = "tado-table small";

            _.forEach(home.zones, function(zone){
                var rowWrapper = document.createElement("tr");

                if(zone.type == "HOT_WATER"){
                    if(zone.state.setting.power == "OFF") {
                        return; //ignore the HOT WATER control has been turned off
                    }

                    var firstTableDataWrapper = document.createElement("td");
                    firstTableDataWrapper.className = "tado-table-name";

                    var zoneNameWrapper = document.createElement("span");
                    zoneNameWrapper.innerText = zone.name;
                    firstTableDataWrapper.appendChild(zoneNameWrapper);
                    rowWrapper.appendChild(firstTableDataWrapper);

                    var secondTableDateWrapper = document.createElement("td");
                    secondTableDateWrapper.className = "tado-table-data";

                    var temperatureWrapper = document.createElement("span");
                    var temperatureIconWrapper = document.createElement("i");
                    temperatureIconWrapper.className = "fa fa-thermometer-full";
                    temperatureWrapper.appendChild(temperatureIconWrapper);
                    var temperatureTextWrapper = document.createTextNode(zone.state.setting.temperature.celsius + "°");
                    temperatureWrapper.appendChild(temperatureTextWrapper);
                    secondTableDateWrapper.appendChild(temperatureWrapper);

                    rowWrapper.appendChild(secondTableDateWrapper);
                } else if (zone.type == "HEATING") {
                    var firstTableDataWrapper = document.createElement("td");
                    firstTableDataWrapper.className = "tado-table-name";

                    var zoneNameWrapper = document.createElement("span");
                    zoneNameWrapper.innerText = zone.name;
                    firstTableDataWrapper.appendChild(zoneNameWrapper);
                    rowWrapper.appendChild(firstTableDataWrapper);

                    var secondTableDateWrapper = document.createElement("td");
                    secondTableDateWrapper.className = "tado-table-data";

                    var temperatureWrapper = document.createElement("span");
                    temperatureWrapper.className = "bright";
                    var temperatureIconWrapper = document.createElement("i");
                    temperatureIconWrapper.className = "fa fa-thermometer-full";
                    temperatureWrapper.appendChild(temperatureIconWrapper);
                    var temperatureTextWrapper = document.createTextNode(zone.state.sensorDataPoints.insideTemperature.celsius + "°");
                    temperatureWrapper.appendChild(temperatureTextWrapper);
                    if(zone.state.activityDataPoints.heatingPower.percentage > 0) {
                        //The zone is heating
                        var heatingWrapper = document.createElement("i");
                        heatingWrapper.className = "fa fa-fire bright";
                        temperatureWrapper.appendChild(heatingWrapper);
                    }
                    secondTableDateWrapper.appendChild(temperatureWrapper);

                    var breakLine = document.createElement("br");
                    secondTableDateWrapper.appendChild(breakLine);

                    var humidityWrapper = document.createElement("span");
                    var humidityIconWrapper = document.createElement("i");
                    humidityIconWrapper.className = "fa fa-tint";
                    humidityWrapper.appendChild(humidityIconWrapper);
                    var humidityTextWrapper = document.createTextNode(zone.state.sensorDataPoints.humidity.percentage + "%");
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

    getTadoInfo: function() {
        this.tadoClient.me(this.loadTadoMe, this);
    },

    loadTadoMe: function(me, cl) {
        this.tadoMe = me;

        _.forEach(this.tadoMe.homes, function(home) {
            var homeInfo = {};
            homeInfo.id = home.id;
            homeInfo.name = home.name;
            homeInfo.zones = [];

            cl.tadoHomes.push(homeInfo);
            cl.tadoClient.zones(home.id, cl.loadTadoZones, homeInfo, cl);
        });
    },

    loadTadoZones: function(zones, homeInfo, cl) {
        _.forEach(zones, function(zone) {
            var zoneInfo = {};
            zoneInfo.id = zone.id;
            zoneInfo.name = zone.name;
            zoneInfo.type = zone.type;
            zoneInfo.state = {};

            homeInfo.zones.push(zoneInfo);
            cl.tadoClient.state(homeInfo.id, zoneInfo.id, cl.loadTadoZoneState, zoneInfo, cl);
        });
    },

    loadTadoZoneState: function(state, zone, cl) {
        zone.state = state;
    },

    updateTadoStates: function() {
        var self = this;
        _.forEach(this.tadoHomes, function(home){
           _.forEach(home.zones, function(zone){
               self.tadoClient.state(home.id, zone.id, this.loadTadoZoneState, zone, this);
           });
        });
    },

    refreshAll: function() {
        this.tadoClient = {};
        this.tadoMe = {};
        this.tadoHomes = [];

        this.tadoClient = new TadoClient(this.config.username, this.config.password);
        this.getTadoInfo();
    }
});