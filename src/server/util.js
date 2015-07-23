var osDetails = require('os');

module.exports = {
    getDynamicIP: function(callback) {
        var ip;
        try {
            var address = osDetails.networkInterfaces();
//console.log(address);
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