'use strict';

jest.dontMock( '../hashmap.js' );

describe( 'hashmap', function(){

  var HashMap = require( '../hashmap' ),
      map,
      hashFn = jest.genMockFn(),
      equalsFn = jest.genMockFn();

  // for out tests, we'll just use string values for keys
  equalsFn.mockImpl( function( val1, val2 ){ return val1 === val2 });

  //
  it( 'should initialize an empty HashMap', function(){

    map = HashMap( hashFn, equalsFn );

    expect( map.count() ).toBe( 0 );
  });


  describe( 'set()', function(){

    //
    it( 'should add a component', function(){

      var result;

      hashFn.mockReturnValueOnce( 101 );
      result = map.set( 'key', 'value' );
      expect( result ).toBeNull();
      expect( map.count() ).toBe( 1 );
      expect( equalsFn ).not.toBeCalled();

      hashFn.mockReturnValueOnce( 11 );
      result = map.set( 'key-1', 'value-1' );
      expect( result ).toBeNull();
      expect( map.count() ).toBe( 2 );
      expect( equalsFn ).not.toBeCalled();
    });


    //
    it( 'should handle collisions', function(){

      var result;

      hashFn.mockReturnValueOnce( 101 );
      result = map.set( 'key-2', 'value-2' );

      expect( result ).toBeNull();

      expect( equalsFn ).toBeCalled();
      equalsFn.mockClear();
      // should increment
      expect( map.count() ).toBe( 3 );
    });


    //
    it( 'should handle updates to the same component', function(){

      var result;

      hashFn.mockReturnValueOnce( 101 );
      result = map.set( 'key', 'new value' );

      expect( result ).toBe( 'value' );

      expect( equalsFn ).toBeCalled();
      equalsFn.mockClear();
      // should not have incremented
      expect( map.count() ).toBe( 3 );
    });
  });


  //
  describe( 'get()', function(){

    //
    it( 'should retrieve values', function(){

      hashFn.mockReturnValueOnce( 11 );
      var value = map.get( 'key-1' );

      expect( value ).toBe( 'value-1' );
    });


    //
    it( 'should handle retrieving values from bins with collisions', function(){

      var value;

      hashFn.mockReturnValueOnce( 101 );
      value = map.get( 'key' );
      expect( value ).toBe( 'new value' );

      hashFn.mockReturnValueOnce( 101 );
      value = map.get( 'key-2' );
      expect( value ).toBe( 'value-2' );
    });


    //
    it( 'should return null, if value not found', function(){

      var value;

      hashFn.mockReturnValueOnce( 0 );
      value = map.get( 'key' );
      expect( value ).toBeNull();

      // check case where something is at bin
      hashFn.mockReturnValueOnce( 101 );
      value = map.get( 'unknown-key' );
      expect( value ).toBeNull();
    });
  });


  // contains() method
  describe( 'contains()', function(){

    it( 'should return true for elements that exist', function(){

      var value;

      hashFn.mockReturnValueOnce( 101 );
      value = map.contains( 'key' );
      expect( value ).toBe( true );

      hashFn.mockReturnValueOnce( 101 );
      value = map.contains( 'key-2' );
      expect( value ).toBe( true );
    });


    it( 'should return false for elements that do not exist', function(){

      var value;

      hashFn.mockReturnValueOnce( 9 );
      value = map.contains( 'key' );
      expect( value ).toBe( false );

      hashFn.mockReturnValueOnce( 101 );
      value = map.contains( 'populated bin, but uknown key' );
      expect( value ).toBe( false );
    });
  });


  describe( 'remove()', function(){


    it( 'should remove elements that are referenced by the provided key', function(){

      var value;

      hashFn.mockReturnValueOnce( 101 );
      value = map.remove( 'key-2' );
      expect( value ).toBe( 'value-2' );
      expect( map.count() ).toBe( 2 );
    });

    it( 'should return null when no such reference exists', function(){

      var value;

      hashFn.mockReturnValueOnce( 9 );
      value = map.remove( 'key' );
      expect( value ).toBeNull();
      expect( map.count() ).toBe( 2 );

      hashFn.mockReturnValueOnce( 101 );
      value = map.remove( 'populated bin, but unknown key' );
      expect( value ).toBeNull();
      expect( map.count() ).toBe( 2 );

      hashFn.mockReturnValueOnce( 101 );
      value = map.remove( 'key-2' );
      expect( value ).toBeNull();
      expect( map.count() ).toBe( 2 );
    });

    it( 'should not screw up the collection', function(){

      var value;

      hashFn.mockReturnValueOnce( 101 );
      value = map.remove( 'key' );
      expect( value ).toBe( 'new value' );
      expect( map.count() ).toBe( 1 );

      hashFn.mockReturnValueOnce( 11 );
      value = map.remove( 'key-1' );
      expect( value ).toBe( 'value-1' );
      expect( map.count() ).toBe( 0 );

      // add some values
      hashFn.mockReturnValueOnce( 5064 );
      map.set( 'test', 'val' );
      hashFn.mockReturnValueOnce( 5064 );
      map.set( 'test-1', 'val-1' );
      hashFn.mockReturnValueOnce( 5064 );
      map.set( 'test-2', 'val-2' );
      hashFn.mockReturnValueOnce( 5064 );
      map.set( 'test-3', 'val-3' );
      hashFn.mockReturnValueOnce( 5064 );
      map.set( 'test-4', 'val-4' );

      expect( map.count() ).toBe( 5 );

      // remove a value in the chain
      hashFn.mockReturnValueOnce( 5064 );
      value = map.remove( 'test-1' );
      expect( value ).toBe( 'val-1' );
      expect( map.count() ).toBe( 4 );

      // remove another value in the chain
      hashFn.mockReturnValueOnce( 5064 );
      value = map.remove( 'test-3' );
      expect( value ).toBe( 'val-3' );
      expect( map.count() ).toBe( 3 );

      // should still be able to access values in the chain
      hashFn.mockReturnValueOnce( 5064 );
      value = map.get( 'test-4' );
      expect( value ).toBe( 'val-4' );

    });
  });


  describe( 'forEach()', function(){

    var callback = jest.genMockFn();

    it( 'should pass each value to the provided callback', function(){

      hashFn.mockReturnValueOnce( 9926 );
      map.set( 'last', 'extra' );

      map.forEach( callback );

      expect( callback.mock.calls.length ).toBe( 4 );
      expect( callback ).toBeCalledWith( 'val' );
      expect( callback ).toBeCalledWith( 'val-2' );
      expect( callback ).toBeCalledWith( 'val-4' );
      expect( callback ).toBeCalledWith( 'extra' );
    });
  });

});
