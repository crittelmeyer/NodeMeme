var osDetails = require('os');

module.exports = {
    getDynamicIP: function(callback) {
        var address,
            key,
            ip;

        try {
            address = osDetails.networkInterfaces();
            for (key in address) {
                if (address.hasOwnProperty(key)) {
                    address[key].forEach(function(entry) {
                        if (entry.family === 'IPv4') {
                            ip = entry.address;
                            return false;
                        }
                    });
                }
            }
        } catch (e) {
            return callback(e, null);
        }
        return callback(null, ip);
    }
};