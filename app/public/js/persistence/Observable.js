define(["dojo/_base/kernel", "dojo/_base/lang", "dojo/when", "dojo/_base/array" /*=====, "./api/Store" =====*/
], function(kernel, lang, when, array /*=====, Store =====*/){

// module:
//		dojo/store/Observable

// Code from:
// https://github.com/mercmobily/hotplate/blob/master/node_modules/hotDojoStores/client/JsonObservable.js

var Observable = function(/*Store*/ store){
	// summary:
	//		The Observable store wrapper takes a store and sets an observe method on query()
	//		results that can be used to monitor results for changes.
	//
	// description:
	//		Observable wraps an existing store so that notifications can be made when a query
	//		is performed.
	//
	// example:
	//		Create a Memory store that returns an observable query, and then log some
	//		information about that query.
	//
	//	|	var store = Observable(new Memory({
	//	|		data: [
	//	|			{id: 1, name: "one", prime: false},
	//	|			{id: 2, name: "two", even: true, prime: true},
	//	|			{id: 3, name: "three", prime: true},
	//	|			{id: 4, name: "four", even: true, prime: false},
	//	|			{id: 5, name: "five", prime: true}
	//	|		]
	//	|	}));
	//	|	var changes = [], results = store.query({ prime: true });
	//	|	var observer = results.observe(function(object, previousIndex, newIndex){
	//	|		changes.push({previousIndex:previousIndex, newIndex:newIndex, object:object});
	//	|	});
	//
	//		See the Observable tests for more information.

	var undef, queryUpdaters = [], revision = 0;
	// a Comet driven store could directly call notify to notify observers when data has
	// changed on the backend
	// create a new instance
	store = lang.delegate(store);

	store.notify = function(object, existingId, methodOptions ){
		revision++;
		var updaters = queryUpdaters.slice();
		for(var i = 0, l = updaters.length; i < l; i++){
			updaters[i](object, existingId, methodOptions);
		}
	};
	var originalQuery = store.query;
	store.query = function(query, options){
		options = options || {};

		var results = originalQuery.apply(this, arguments);
		if(results && results.forEach){
			var nonPagedOptions = lang.mixin({}, options);
			delete nonPagedOptions.start;
			delete nonPagedOptions.count;

			var queryExecutor = store.queryEngine && store.queryEngine(query, nonPagedOptions);
			var queryRevision = revision;
			var listeners = [], queryUpdater;

			var newQueryTotal = options.start + options.count; // Added by MERC, needed later

			results.observe = function(listener, includeObjectUpdates){
				if(listeners.push(listener) == 1){
					// first listener was added, create the query checker and updater
					queryUpdaters.push(queryUpdater = function(changed, existingId, methodOptions){
						when(results, function(resultsArray){

							var atEnd = resultsArray.length != options.count;
							var i, l, listener;
							if(++queryRevision != revision){
								throw new Error("Query is out of date, you must observe() the query prior to any data modifications");
							}


							// Look for an object with id objectId in resultsArray
							function findObjectInResult( objectId ) {
								var i, l, object;
								for(i = 0, l = resultsArray.length; i < l; i++){
									object = resultsArray[ i ];
									if( store.getIdentity( object ) == objectId ){
										return i;
									}
								}
								return -1;
							}

							// CASE #1: It's a deletion. No dramas.
							if( changed === undef && existingId !== undef ){
								var ownPosition = findObjectInResult( existingId );
								if( ownPosition != -1 ){
									newQueryTotal --;
									tellAllListeners( resultsArray[ownPosition], ownPosition, -1 );
									resultsArray.splice( ownPosition, 1 );
								}
							}

							// It's either an insert or a replace
							if( changed !== undef ){

								// Look for self in the query
								var ownPosition = findObjectInResult( existingId );


								// CASE 2: it's an update and includeObjectUpdates
								// is true: place record in-place
								if( ownPosition != -1 && includeObjectUpdates ){

									//console.log("METHOD OPTIONS:" , methodOptions, changed, existingId );

									if( methodOptions && typeof( methodOptions.before ) !== 'undefined' ){
										//console.log("MOVING THE ITEM...:" );

										//console.log("RESULTARRAY BEFORE WAS:" );
										//resultsArray.forEach( function(e, k){ console.log( k, e.name ); } );

										// methodOptions.before is null: the item needs to be at the end
                    // of the resultsArray
										if( methodOptions.before === null ){
								    	var pos = resultsArray.length;
											resultsArray.splice( ownPosition, 1 );
											resultsArray.push( changed );
											tellAllListeners( changed, ownPosition, pos -1 );
										} else {

											var beforePosition = findObjectInResult( store.getIdentity( methodOptions.before ) );
											if( beforePosition > ownPosition ) beforePosition --;

											//console.log("BEFOREPOSITION:", beforePosition, "OWNPOSITION: ", ownPosition );

											resultsArray.splice(beforePosition, 0, resultsArray.splice(ownPosition, 1)[0]);
										  tellAllListeners( changed, ownPosition, beforePosition );
										}

										// Tell all listeners...
										//console.log("RESULTARRAY NOW IS:" );
										//resultsArray.forEach( function(e, k){ console.log( k, e.name ); } );


									} else {
										resultsArray.splice( ownPosition, 1, changed );
										tellAllListeners( changed, ownPosition, ownPosition );
									}

								}

								// CASE 3: it's an add.

								if( ownPosition == -1 ){

									// There are three possibilities: it might go:
									// * first (options.placeNew === 'first'
									// * last (options.placeNew === 'last' OR options.before === null )
									// * none (options.placeNew === 'none' OR anything else )


									// CASE 3a: options.before is indeed specified.
									// In this case, look for that, and place it there
									if( methodOptions && methodOptions.before ){

										var beforePosition = findObjectInResult( store.getIdentity( methodOptions.before ) )

										if( beforePosition != -1 ){
											resultsArray.splice( beforePosition, 0, changed );
											newQueryTotal ++;
											tellAllListeners( changed, -1, beforePosition );
										}

									// CASE 3b: it's an add, and query.placeNew is "last" OR undefined
									// _OR_ options.before === null (required by store API): add the item
									// to the query marked as "last" (note: the query might not have been
									// made and therefore observed yet)
									} else if( options.placeNew === 'last' || options.placeNew === undefined ||
                    ( typeof( methodOptions ) === 'object' && methodOptions !== null && methodOptions.before === null ) ){

										// var queryTo = options.start + options.count; // var queryTo = results.ioArgs.args.headers.Range.split('-')[1];
										when( results.total ).then( function( grandTotal ) {

											// If there are no limits to the query, OR if the new element will be outside the range of
											// the current query, OR if methodOptions.before is null, add it
                      // FIXME: it should check if it's within the last page of the shown fields, so that if you are for example
                      // on page 3 of 4 and you add it last, it won't display it
											if( (options.start == 0 && options.count == 0 ) || newQueryTotal >= grandTotal || ( methodOptions && methodOptions.before === null ) ){
												var pos = resultsArray.length;
												resultsArray.push( changed );
												tellAllListeners( changed, -1, pos );
												newQueryTotal ++;
											}
										});

									// CASE 3c: it's an add, where query.placeNew is "first": will add the item
									// to the top of the list
									} else if( options.placeNew === 'first') {

										// This query has the beginning of the result: add to it
										if( options.start == 0 ){
											resultsArray.splice( 0, 0, changed );
											tellAllListeners( changed, -1, 0 );
										}

									// CASE 3d: it's an add, but query.placeNew is probably
									// "none" or undefined, do nothing
									} else{

									}

								}

							}

							function tellAllListeners( element, removedFrom, insertedInto ){
								var listener, i, copyListeners = listeners.slice();
								for(var i = 0;listener = copyListeners[i]; i++){
									listener(element, removedFrom, insertedInto );
								}
							}
						});
					});
				}
				var handle = {};
				// TODO: Remove cancel in 2.0.
				handle.remove = handle.cancel = function(){
					// remove this listener
					var index = array.indexOf(listeners, listener);
					if(index > -1){ // check to make sure we haven't already called cancel
						listeners.splice(index, 1);
						if(!listeners.length){
							// no more listeners, remove the query updater too
							queryUpdaters.splice(array.indexOf(queryUpdaters, queryUpdater), 1);
						}
					}
				};
				return handle;
			};
		}
		return results;
	};
	var inMethod;
	function whenFinished(method, action ){
		var original = store[method];
		if(original){
			store[method] = function(value){
			var params = arguments[1];

				if(inMethod){
					// if one method calls another (like add() calling put()) we don't want two events
					return original.apply(this, arguments);
				}
				inMethod = true;
				try{
					var results = original.apply(this, arguments);
					when(results, function(results){
						action((typeof results == "object" && results) || value, params );
					});
					return results;
				}finally{
					inMethod = false;
				}
			};
		}
	}
	// monitor for updates by listening to these methods
	whenFinished("put", function(object, methodOptions ){
		store.notify(object, store.getIdentity(object), methodOptions);
	});
	whenFinished("add", function(object, methodOptions){
		store.notify(object, undefined, methodOptions);
	});
	whenFinished("remove", function(id, methodOptions){
		store.notify(undefined, id, methodOptions);
	});

	return store;
};

lang.setObject("dojo.store.Observable", Observable);

return Observable;
});
