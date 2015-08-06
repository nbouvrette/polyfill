var Graphite = require('graphite');
var Measured = require('measured');

var reportInterval = 5000;
var graphiteHost = process.env.GRAPHITE_HOST || null;
var graphitePort = process.env.GRAPHITE_PORT || 2003;
var envName = process.env.ENV_NAME || "unknown";

var timer = null;
var graphite = null;
var data = Measured.createCollection('origami.polyfill.' + envName);

if (graphiteHost) {
	graphite = Graphite.createClient('plaintext://'+graphiteHost+':'+graphitePort);
	timer = setInterval(function() {
		graphite.write(data.toJSON(), function(err) {

			// Ignore timeouts
			if (err.code === 'ETIMEDOUT') return;

			if (err) {
				console.error(err, err.stack);
				console.warn('Disabling graphite reporting due to error');
				clearTimeout(timer);
			}
		});
	}, reportInterval);
	timer.unref();
}

module.exports = data;
