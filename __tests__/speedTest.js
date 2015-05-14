'use strict';

jest.dontMock( '../hashmap.js' );

var test_objs = [], i, next_obj;

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

for( i = 0; i < 1000; i += 1 ){

  next_obj = {
    id_1: getRandomInt( 1, 10 ),
    id_2: getRandomInt( 1, 10 ),
    id_3: getRandomInt( 1, 10 ),
    id_4: getRandomInt( 1, 10 ),
    id_5: getRandomInt( 1, 10 ),
    id_6: getRandomInt( 1, 10 ),
    id_7: getRandomInt( 1, 10 ),
    id_8: getRandomInt( 1, 10 ),
    id_9: getRandomInt( 1, 10 ),
    id_0: getRandomInt( 1, 10 ),
    id_u: undefined
  };

  test_objs.push( next_obj );
};

var hashFn = function( obj ){
  var hash = 17;
  hash = (hash * 31) + obj.id_1;
  hash = (hash * 31) + obj.id_2;
  hash = (hash * 31) + obj.id_3;
  hash = (hash * 31) + obj.id_4;
  hash = (hash * 31) + obj.id_5;
  hash = (hash * 31) + obj.id_6;
  hash = (hash * 31) + obj.id_7;
  hash = (hash * 31) + obj.id_8;
  hash = (hash * 31) + obj.id_9;
  hash = (hash * 31) + obj.id_0;
  hash = (hash * 31) + (obj.id_u?obj.id_u:0);
  return hash;
};

var equalsFn = function( obj, other ){
  return (
    obj.id_1 === other.id_1 &&
    obj.id_2 === other.id_2 &&
    obj.id_3 === other.id_3 &&
    obj.id_4 === other.id_4 &&
    obj.id_5 === other.id_5 &&
    obj.id_6 === other.id_6 &&
    obj.id_7 === other.id_7 &&
    obj.id_8 === other.id_8 &&
    obj.id_9 === other.id_9 &&
    obj.id_0 === other.id_0
  );
};

toString = function( obj ){
  var key = obj._key;

  if( !key ){
    key = obj.id_1 + '-' +
          obj.id_2 + '-' +
          obj.id_3 + '-' +
          obj.id_4 + '-' +
          obj.id_5 + '-' +
          obj.id_6 + '-' +
          obj.id_7 + '-' +
          obj.id_8 + '-' +
          obj.id_9 + '-' +
          obj.id_0 + '-' +
          obj.id_u;
    obj._key = key; // caching key, ~15% improvement
  }
  return key;
};

var HashMap = require( '../hashmap' )( hashFn, equalsFn );
var StringMap = require( '../hashmap' )( toString, equalsFn );
var pojsobj = {};

var key, hash, value, time;

time = Date.now();
for( i = 0; i < test_objs.length; i += 1 ){
  key = toString( test_objs[ i ] );
  pojsobj[ key ] = 'test';
};

for( i = 0; i < test_objs.length; i += 1 ){
  key = toString( test_objs[ i ] );
  value = pojsobj[ key ];
};

time = Date.now() - time;
console.log( 'pojo: '+time +'ms' );


time = Date.now();
for( i = 0; i < test_objs.length; i += 1 ){
  HashMap.set( test_objs[ i ], 'test' );
};

for( i = 0; i < test_objs.length; i += 1 ){
  value = HashMap.get( test_objs[ i ] );
};

time = Date.now() - time;
console.log( 'HashMap: ' +time +'ms' );

console.log( HashMap.count() );
console.log( HashMap._get_collision_count() );


// HASH MAP That uses string

time = Date.now();
for( i = 0; i < test_objs.length; i += 1 ){
  StringMap.set( test_objs[ i ], 'test' );
};

for( i = 0; i < test_objs.length; i += 1 ){
  value = StringMap.get( test_objs[ i ] );
};

time = Date.now() - time;
console.log( 'StringMap: ' +time +'ms' );

console.log( StringMap.count() );
console.log( StringMap._get_collision_count() );
