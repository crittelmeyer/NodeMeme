var osDetails = require('os');

module.exports = {
    getDynamicIP: function(callback) {
        var ip;
        try {
            var address = osDetails.networkInterfaces();
            for (key in address) {
                if (address.hasOwnProperty(key)) {
                    if (address[key][0].internal === false && address[key][0].family === 'IPv4') {
                        ip = address[key][0].address;
                        break;
                    }
                }
            }
        } catch (e) {
            return callback(e, null);
        }
        return callback(null, ip);
    }
};