# Model-array

Array properties for Swatinem/model

[![Build Status](https://travis-ci.org/Swatinem/model-array.png?branch=master)](https://travis-ci.org/Swatinem/model-array)
[![Coverage Status](https://coveralls.io/repos/Swatinem/model-array/badge.png?branch=master)](https://coveralls.io/r/Swatinem/model-array)
[![Dependency Status](https://gemnasium.com/Swatinem/model-array.png)](https://gemnasium.com/Swatinem/model-array)

## Installation

    $ component install Swatinem/model-array

## .array(name, [options])

Registers an array property with `name`.
By default, it emits simle `change` events when any change to the array is made.
**note**: This is not working and pending some upstream changes
to [MatthewMueller/array](https://github.com/MatthewMueller/array).

If `options.events` is set to `false`, no change events will be emitted when
the array changes.
If `options.detailedEvents` is set, more detailed events are emitted such as:

```js
('add', element, index)
('remove', element, index)
('sort')
('reverse')
```

If `options.childEvents` is set, the array is assumed to contain Models itself.
Events of the child models are emitted like this:

```js
('child', element, childProperty, value, previousValue)
```

**note**: The array instance is fixed and can not be overwritten. There is a
transparent setter that replaces all the elements but the array itself will
*not* be overwritten.

## Usage

```js
var Model = require('model');
var MArray = require('model-array');

var User = new Model(['first', 'last'])
	.use(MArray)
	.array('pets');

var instance = new User({first: 'Arpad', last: 'Borsos', pets: ['Ansa']});

instance.on('change pets', function () {});
instance.pets.push('Zwara'); // triggers change event

```

## License

  MIT

  Released as free software as part of [ChatGrape](https://chatgrape.com/)

