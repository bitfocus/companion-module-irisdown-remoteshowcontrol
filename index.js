var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_tcp();
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(1,'Connecting'); // status ok!

	self.init_tcp();
};

instance.prototype.init_tcp = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, 61001);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.status(self.STATE_ERROR, err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			self.status(self.STATE_OK);
			debug("Connected");
		})

		self.socket.on('data', function (data) {});
	}
};


// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};


instance.prototype.actions = function(system) {
	var self = this;

	self.system.emit('instance_actions', self.id, {
		'open': {
			label: 'Open file',
			options: [
 				{
 					 type: 'textinput',
 					 label: 'filename',
 					 id: 'file',
 					 default: ''
 				}
 			]
		  },
		'close':{
			label: 'Close file',
			options: [
		 {
				type: 'textinput',
				label: 'filename',
				id: 'file',
				default: ''
		 }
	 ]
	 },
		'run':  {
			label: 'Run file',
			options: [
			 {
					type: 'textinput',
					label: 'filename',
					id: 'file',
					default: ''
			 }
		 ]
		},

		'stop':  {
			label: 'Stop file',
			options: [
			 {
					type: 'textinput',
					label: 'filename',
					id: 'file',
					default: ''
			 }
		 ]
		},

		'next': { label: 'Next slide' },
		'prev': { label: 'Previous' },
		'go':   {
			label: 'Goto Slide',
			options: [
			 {
					type: 'textinput',
					label: 'slide nr',
					id: 'slide',
					default: ''
			 }
			]
		 },
		'setbg':{ label: 'Set background' }

	});
};

instance.prototype.action = function(action) {
	var self = this;
	var id = action.action;
	var cmd

	switch (action.action){

		case 'open':
			cmd = 'OPEN ' + '\"' + action.options.file + '\"';
			break;

		case 'close':
			cmd = 'CLOSE ' + '\"' + action.options.file + '\"' ;
			break;

		case 'run':
			cmd = 'RUN ' + '\"' + action.options.file + '\"';
			break;

			case 'stop':
				cmd = 'STOP ' + '\"' + action.options.file + '\"';
				break;

		case 'next':
			cmd = 'NEXT ';
			break;

		case 'Prev':
			cmd = 'PREV ';
			break;

		case 'go':
			cmd = 'GO '+ action.options.slide;
			break;

		case 'setbg':
			cmd = 'SETBG ';
			break;

	};




	if (cmd !== undefined) {

		debug('sending ',cmd,"to",self.config.host);

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + "\r");
		} else {
			debug('Socket not connected :(');
		}

	}

	// debug('action():', action);

};

instance.module_info = {
	label: 'PPT Remote Show Control ',
	id: 'pptrsc',
	version: '0.0.1'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
