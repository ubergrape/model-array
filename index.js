/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

module.exports = bindArray;

var array = require('array');

function bindArray(Model) {
	Model.array = defineArray;
	Model._arrays = {};
	Model.on('construct', construct);
}

function defineArray(name, options) {
	/* jshint validthis: true */
	this._arrays[name] = options || {};
	Object.defineProperty(this.prototype, name, {
		enumerable: true,
		get: function () { return this._data[name]; },
		set: function (val) {
			this._data[name].splice.apply(this._data[name], [0, this._data[name].length].concat(val));
		}
	});

	return this;
}

var slice = [].slice;
function construct(instance) {
	var Model = instance._model;

	for (var name in Model._arrays) {
		var options = Model._arrays[name];
		var arr = instance._data[name] = new array();
		if (options.events === false)
			continue;
		if (options.detailedEvents) {
			arr.on('add', detailedEvent(name, 'add'));
			arr.on('remove', detailedEvent(name, 'remove'));
			arr.on('sort', detailedEvent(name, 'sort'));
			arr.on('reverse', detailedEvent(name, 'reverse'));
		} else {
			arr.on('change', onChange);
		}
		if (options.childEvents) {
			arr.on('add', onChild);
			arr.on('remove', offChild);
		}
	}

	// generic event
	function onChange() {
		Model.emit('change', instance, name);
		Model.emit('change ' + name, instance);
		instance.emit('change', name);
		instance.emit('change ' + name);
	}
	// detailed events
	function detailedEvent(name, ev) {
		return function () {
			var args = [ev].concat(slice.call(arguments));
			Model.emit.apply(Model, ['change', instance, name].concat(args));
			Model.emit.apply(Model, ['change ' + name, instance].concat(args));
			instance.emit.apply(instance, ['change', name].concat(args));
			instance.emit.apply(instance, ['change ' + name].concat(args));
		};
	}
	// delegating child events
	function childEvent() {
		/* jshint validthis: true */
		// thank god this provides the correct `this`
		var args = ['child', this].concat(slice.call(arguments));
		Model.emit.apply(Model, ['change', instance, name].concat(args));
		Model.emit.apply(Model, ['change ' + name, instance].concat(args));
		instance.emit.apply(instance, ['change', name].concat(args));
		instance.emit.apply(instance, ['change ' + name].concat(args));
	}
	function onChild(elem) {
		elem.on('change', childEvent);
	}
	function offChild(elem) {
		elem.off('change', childEvent);
	}
}

