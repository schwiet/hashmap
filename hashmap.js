'use strict';

/*
 * HashMap namespace
 */
var HashMap = {

init: function( hashFn, equalsFn ){

  var object_array = [],
      count = 0;

  var add_value, get_value, replace_value, add_node, check_key,
      replace_node, return_value, return_true, return_false,
      remove_node, remove_value, find_node;

  ///////////////////////////////////////////////////////////////
  // PRIVATE IMPLEMENTATION
  ///////////////////////////////////////////////////////////////

  //
  replace_value = function( new_value, node ){
    var old_value = node.value;

    node.value = new_value;
    return old_value;
  };

  return_value = function( ignored, node ){
    return node.value;
  };

  return_true  = function(){ return true; };
  return_false = function(){ return false; };

  //
  remove_node = function( ignored, node, previous_node, index ){

    // if there is a node before the one we're removing, make
    // it point to out node's next element
    if( previous_node ){

      previous_node.next = node.next;
    }

    // if there is not previous node, make the bin point to our
    // node's next element
    else{
      object_array[ index ] = node.next;
    }

    count -= 1;

    return node.value;
  };

  var collision_count = 0;
  //
  add_node = function( key, value, index, previous_node ){
    var node = { key: key, value: value, next: null };

    // there is at least another node in this bin
    if( previous_node ){
      previous_node.next = node;
      collision_count += 1;
    }

    // first node in this bin
    else{
      object_array[ index ] = node;
    }

    // increment the count
    count += 1;

    return null;
  };

  find_node = function( on_found,
                        on_not_found,
                        previous_node,
                        value,
                        index,
                        node,
                        key ){

    var result = null;

    // ADD - end of the chain
    if( !node ){

      if( on_not_found ){

        result = on_not_found( key , value, index, previous_node );
      }
    }

    // UPDATE - this node equal to the one we're looking for
    else if( equalsFn( node.key, key ) ){

      if( on_found ){

        result = on_found( value, node, previous_node, index );
      }
    }

    // not found yet
    else{
      result = find_node( on_found,
                          on_not_found,
                          node,
                          value,
                          index,
                          node.next,
                          key );
    }

    return result;
  };

  // aliases for find_node with some default intial arguments
  add_value    = find_node.bind( null, replace_value, add_node,     null );
  get_value    = find_node.bind( null, return_value,  null,         null, null );
  check_key    = find_node.bind( null, return_true,   return_false, null, null );
  remove_value = find_node.bind( null, remove_node,   null,         null, null );


  ///////////////////////////////////////////////////////////////
  // PUBLIC API
  ///////////////////////////////////////////////////////////////
  return {

    /*
     * stores the passed value, which will be referenced by the
     * passed key.
     *
     * @param key the object used to reference the value
     * @param value the value to be stored
     * @return the value previously referenced by the passed key,
     *         if any, otherwise null
     */
    set: function( key, value ){

      var index = hashFn( key ),
          node = object_array[ index ];

      // add or update the node
      return add_value( value, index, node, key );
    },

    /*
     * returns the value referenced by the passed key, if present
     *
     * @param key the key to look for
     * @return the value referenced by key, if found, otherwise
     *         null
     */
    get: function( key ){
      var index = hashFn( key ),
          node = object_array[ index ];

      return get_value( index, node, key );
    },

    /*
     * removes the value referenced by the passed key, if present
     *
     * @param key the key to look for
     * @return the value that was removed, otherwise null
     */
    remove: function( key ){
      var index = hashFn( key ),
          node = object_array[ index ];

      return remove_value( index, node, key );

    },

    /*
     * returns the element count
     *
     * @return: the number of elements in the hashmap
     */
    count: function(){
      return count;
    },

    _get_collision_count: function(){
      return collision_count;
    },

    /*
     * resets the hashmap, it will not be usable to reference
     * previously stored values
     */
    clear: function(){

      object_array = [];
      count = 0;
    },

    /*
     *
     * @param key the key object to look for
     * @return true if the key is present, otherwise false
     */
    contains: function( key ){
      var index = hashFn( key ),
          node = object_array[ index ];

      // true if key is found, otherwise false
      return check_key( index, node, key );
    },

    /*
     * TODO: will currently only work for arrays, meaning
     *       the hashFn returns an integer.
     *
     * iterates over each present value and passes them to the
     * provided callback
     *
     * @param function that will be called with each value in the
     *        collection
     */
    forEach: function( onEach ){

      var handle_node = function( node ){
        if( node ){
          onEach( node.value );
          handle_node( node.next );
        }
      };

      object_array.forEach( handle_node );
    },
  };
}
};

// HashMap module
if( module ){
  module.exports = HashMap.init;
  }
