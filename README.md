# hashmap
a javascript hashmap implementation that handles key collisions

##Disclaimer

In my contrived tests, with a fast hash function that produced ~.002%
collisions, the `HashMap` performed ~30% slower than using a plain old object
with a `toString()` function that generated unique strings for each object.
So if speed is your aim, this module does not outperform that method, at least
not in my testing. Good learning experience for me, probably not that helpful
to you...


###Install

    npm install --save hashmap-js

##Description
This module implements a hashmap, which can use objects as keys.
You provide the hashing function and a function to determine
equality, in the case of collisions.


###Usage

to initialize, provide your hashing function and equals function:

    var HashMap = require( 'hashmap-js' );

    var myMap = HashMap( hashFn, equalsFn ),
        value = { test: 'success' };

    // add a value
    myMap.set( key, value );

    // returns value
    myMap.get( key );

`key` can be anything. This module is particularly useful, if you
want to use objects as keys and want to handle possible
collisions.

###`hashFn( key )`
`hashFn` is a function that should be able to convert a key to a
hash. Traditionally, this would be a number that is calculated by
performing some arithmetic on the values of an object that
uniquely identify it.

In JavaScript, using a string is reasonable and you could just
use a plain old object in this way as long as your `toString()`
function always produced a unique string. The HashMap module is
more generic and is most beneficial if you wish to use a more
traditional 'hashing' function that returns a number. That being
said, Hashmap is perfectly suitable even if you just provide
`toString()` as the `hashFn`, but again, only provides a benefit
if you expect `toString()` to produce collisions for two
non-equivalent objects.

###`equals( key, otherKey )`
this function will be used to compare two keys, in the case that
they result in the same value from `hashFn`.

###API
`set( key, value )` - stores the passed value, which will be referenced by the passed key.


`get( key )`        - returns the value referenced by the passed key, if present


`contains( key )`   - true if the key is present, otherwise false


`remove( key )`     - removes the value referenced by the passed key, if present


`count()`           - returns the number of elements in the map


`clear()`           - resets ths map


`forEach( onEach )` - iterates over each present value and passes them to the provided callback

###testing
to run the test you'll need to install the development dependencies:

    npm install

then to run the tests:

    npm test
