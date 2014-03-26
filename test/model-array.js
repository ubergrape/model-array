/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var array = require('../');

describe('array', function () {
	it('should create a new static `array`', function () {
		var SomeModel = new Model(['prop'])
			.use(array);
		SomeModel.array.should.be.type('function');
	});
	it('should allow creating a new array property', function () {
		var SomeModel = new Model(['prop'])
			.use(array)
			.array('arr');
		var obj = new SomeModel();
		obj.arr.length.should.eql(0);
		obj.arr.push(1);
		obj.arr.length.should.eql(1);
		obj.arr[0].should.eql(1);
	});
	it('should support disabling change events', function () {
		var SomeModel = new Model(['prop'])
			.use(array)
			.array('arr', {events: false});
		var obj = new SomeModel();
		obj.arr.length.should.eql(0);
		obj.on('change', function () {
			throw new Error('unreached');
		});
		obj.arr.push('foo');
	});
	// TODO: depends on a new upstream array release
	it.skip('should support change events', function () {
		var SomeModel = new Model(['prop'])
			.use(array)
			.array('arr');
		var obj = new SomeModel();
		obj.arr.length.should.eql(0);
		var called = false;
		obj.on('change', function (name) {
			name.should.eql('arr');
			called = true;
		});
		obj.arr.push('foo');
		called.should.be.true;
	});
	it('should support precise change events', function () {
		var SomeModel = new Model(['prop'])
			.use(array)
			.array('arr', {detailedEvents: true});
		var obj = new SomeModel({arr: ['foo']});
		obj.arr.length.should.eql(1);
		SomeModel.on('change', function (instance, prop, event, elem, index) {
			instance.should.eql(obj);
			prop.should.eql('arr');
			event.should.eql('add');
			elem.should.eql('bar');
			index.should.eql(1);
		});
		obj.arr.push('bar');
	});
	it('should support change events for children', function () {
		var SomeModel = new Model()
			.use(array)
			.array('arr', {childEvents: true});
		var SomeOtherModel = new Model(['prop']);

		var obj = new SomeModel();
		var sub = new SomeOtherModel();
		sub.prop = 1;
		obj.arr.push(sub);
		obj.once('change arr', function (type, child, prop, val, prev) {
			type.should.eql('child');
			child.should.eql(sub);
			prop.should.eql('prop');
			val.should.eql(2);
			prev.should.eql(1);
		});
		sub.prop = 2;
		obj.arr.pop();
		obj.once('change arr', function () {
			throw new Error('unreached');
		});
		sub.prop = 3;
	});
});

