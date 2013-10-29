var Colorlog = require('colorlog');

var colorLogger, Logger;

Logger = {
	emergency: function() {
		getLogger().log.apply(colorLogger, arguments);
	},
	alert: function() {
		getLogger().warning.apply(colorLogger, arguments);
	},
	critical: function() {
		getLogger().notice.apply(colorLogger, arguments);
	},
	error: function() {
		getLogger().log.apply(colorLogger, arguments);
	},
	warning: function() {
		getLogger().warning.apply(colorLogger, arguments);
	},
	notice: function() {
		getLogger().notice.apply(colorLogger, arguments);
	},
	info: function() {
		getLogger().info.apply(colorLogger, arguments);
	},
	debug: function() {
		getLogger().debug.apply(colorLogger, arguments);
	}
};

function getLogger(logLevel) {
	if (colorLogger) {
		return colorLogger;
	} else {
		if (logLevel) {
			if (logLevel === 'silent') {
				logLevel = 'alert';
			}
			colorLogger = new Colorlog(logLevel);
			return colorLogger;
		} else {
			return new Colorlog('alert');
		}
	}
}

module.exports = function(logLevel) {
	if (logLevel) {
		getLogger(logLevel);
	}
	return Logger;
};