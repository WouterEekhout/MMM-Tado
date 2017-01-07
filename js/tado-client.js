/**
 * Created by Wouter Eekhout on 06/01/2017.
 */
function TadoClient(username, password) {
    var BASE_URL = 'https://my.tado.com/api/v2';

    this.api = function(path, callback, userObject, userClass) {
        $.ajax({
            type: "GET",
            url: BASE_URL + path,
            data: {
                password: password,
                username: username
            },
            success: function (result) {
                callback(result, userObject, userClass);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Something went wrong");
            }
        });
    };
    this.me = function(callback, userObject, userClass) {
        return this.api('/me', callback, userObject, userClass);
    };
    this.home = function(homeId, callback, userObject, userClass) {
        return this.api('/homes/' + homeId, callback, userObject, userClass);
    };
    this.zones = function(homeId, callback, userObject, userClass) {
        return this.api('/homes/' + homeId + '/zones', callback, userObject, userClass);
    };
    this.weather = function(homeId, callback, userObject, userClass) {
        return this.api('/homes/' + homeId + '/weather', callback, userObject, userClass);
    };
    this.state = function(homeId, zoneId, callback, userObject, userClass){
        return this.api('/homes/' + homeId + '/zones/' + zoneId + '/state', callback, userObject, userClass);
    };
}