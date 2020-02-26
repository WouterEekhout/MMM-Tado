const NodeHelper = require("node_helper");
const TadoClient = require('tado-client');

module.exports = NodeHelper.create({
    tadoClient: {},
    tadoMe: {},
    tadoHomes: [],

    start: function() {
        this.tadoClient = new TadoClient();
    },

    getData: function() {
        let self = this;

        this.tadoClient.login(self.config.username, self.config.password).then((success) => {
            this.tadoClient.me().then((me) => {
                self.tadoMe = me;

                self.tadoMe.homes.forEach(home => {
                    let homeInfo = {};
                    homeInfo.id = home.id;
                    homeInfo.name = home.name;
                    homeInfo.zones = [];

                    self.tadoHomes.push(homeInfo);
                    self.tadoClient.zones(home.id).then((zones) => {
                        zones.forEach(zone => {
                            let zoneInfo = {};
                            zoneInfo.id = zone.id;
                            zoneInfo.name = zone.name;
                            zoneInfo.type = zone.type;
                            zoneInfo.state = {};

                            homeInfo.zones.push(zoneInfo);
                            self.tadoClient.state(homeInfo.id, zoneInfo.id).then((state) => {
                                zoneInfo.state = state;
                            });
                        });
                    });
                });
            });
        });

        setTimeout(function () {
             self.sendSocketNotification('NEW_DATA', {'tadoMe': self.tadoMe, 'tadoHomes': self.tadoHomes});
        }, 3000); //wait 3 seconds
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;

            if (this.config.username === '' || this.config.password === '') {
                return;
            }

            this.tadoMe = {};
            this.tadoHomes = [];
            this.getData();

            let self = this;
            setInterval(function () {
                self.tadoMe = {};
                self.tadoHomes = [];
                self.getData();
            }, this.config.updateInterval);
        }
    }
});
