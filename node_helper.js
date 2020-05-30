const NodeHelper = require("node_helper");
const TadoClient = require("node-tado-client");
const logger = require("mocha-logger");

module.exports = NodeHelper.create({
    tadoClient: {},
    tadoMe: {},
    tadoHomes: [],
    length_zones: undefined,

    start: function() {
        this.tadoClient = new TadoClient();
        x = '';
    },

    getData: async function() {
        let self = this;

        self.length_zones = undefined;

        self.tadoClient.login(self.config.username, self.config.password).then(() => {
            logger.log('Logged in');
            self.tadoClient.getMe().then((me) => {
                logger.log('Got me()');
                self.tadoMe = me;

                self.tadoMe.homes.forEach(home => {
                    logger.log('Got homes()');
                    let homeInfo = {};
                    homeInfo.id = home.id;
                    homeInfo.name = home.name;
                    homeInfo.zones = [];

                    self.tadoHomes.push(homeInfo);
                    self.tadoClient.getZones(home.id).then((zones) => {
                        logger.log('Got zones()');
                        self.length_zones = zones.length;

                        zones.forEach(zone => {
                            let zoneInfo = {};
                            zoneInfo.id = zone.id;
                            zoneInfo.name = zone.name;
                            zoneInfo.type = zone.type;
                            zoneInfo.state = {};

                            homeInfo.zones.push(zoneInfo);
                            self.tadoClient.getZoneState(homeInfo.id, zoneInfo.id).then((state) => {
                                zoneInfo.state = state;
                            });
                        });
                    });
                });
            });
        });

        //Check if every state has been received
        while (true) {
            logger.log("MMM-Tado: Checking if all data is present");
            if (self.length_zones !== undefined) {
                try {
                    let received_states = 0;
                    self.tadoHomes.forEach(home => {
                        home.zones.forEach(zone => {
                            if (zone.state !== undefined &&
                                Object.entries(zone.state).length !== 0) {
                                received_states++;
                            }
                        });
                    });

                    if (received_states === self.length_zones) {
                        logger.log("MMM-TADO: All data is present");
                        self.sendSocketNotification('NEW_DATA', {'tadoMe': self.tadoMe, 'tadoHomes': self.tadoHomes});
                        break;
                    }
                } catch (err) {
                    //NOP
                    logger.error("MMM-Tado: Not all data present");
                }
            }

            // We don't have all the data yet
            logger.log("MMM-Tado: Not all data present");
            await self.sleep(1000);
        }
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
    },

    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
