'use strict';

/**
 * LocalStorageService service
 *
 * Use DOM Local storage for storing data
 */
mainAppModule.service('LocalStorageService', function($window, $rootScope) {

	/**
	 * Save data in local storage : use of window.localStorage.setItem(key, value)
	 *
	 * @param 	Object JSON    data {"key" : "value" [, "key" : "value" ]}
	 *
	 * @return 	Boolean        true if successful, otherwise false
	 */
	function save(data) {
		//console.log('data : ', data);
		if(typeof data === 'object') {
			for(var key in data) {
				if(data.hasOwnProperty(key)) {
					var value = data[key];
					if(typeof value === 'object') {
						value = JSON.stringify(value);
					}
					$window.localStorage.setItem(key, value);
				}
			}
			// event
			$rootScope.$broadcast('LocalStorageUpdatedEvent');
			return true;
		}
		return false;
	}

	/**
	 * Get value in local storage
	 *
	 * @param 	String                                 key
	 *
	 * @return 	String|Int|Boolean|Object|undefined    value associated with key
	 */
	function get(key) {
		var output = null;
		if(isKey(key)) {
			try {
				output = JSON.parse($window.localStorage[key]);
			} catch(err) {
				alert(err);
			}
		}
		return output;
	}

	/**
	 * Check if key exists : use of window.localStorage.getItem(key)
	 *
	 * @param 	String     key
	 *
	 * @return 	Boolean    true if successful, otherwise false
	 */
	function isKey(key) {
		try {
			if($window.localStorage.getItem(key)) { return true; }
		} catch(err) {
			return false;
		}
		return false;
	}

	/**
	 * Remove item in local storage : use of removeKey(key)
	 *
	 * @param 	String     key
	 *
	 * @return 	Boolean    true if successful, otherwise false
	 */
	function remove(key) {
		try {
			$window.localStorage.removeKey(key);
			// event
			$rootScope.$broadcast('LocalStorageUpdatedEvent');
			return true; 
		} catch(err) {
			return false;
		}
		return false;
	}

	/**
	 * Remove all items in local storage : use of window.localStorage.clear()
	 *
	 * @return 	Boolean    true if successful, otherwise false
	 */
	function flush() {
		try {
			$window.localStorage.clear();
			// event
			$rootScope.$broadcast('LocalStorageUpdatedEvent');
			return true;
		} catch(err) {
			return false;
		}
		return false;
	}

	/**
	 * Gets LocalStorage Array length : use of window.localStorage.length()
	 *
	 * @return 	Int    length
	 */
	 function getLength() {
	 	return $window.localStorage.length();
	 }

	return ({
		get    : get,
		save   : save,
		isKey  : isKey,
		delete : remove,
		flush  : flush,
		length : getLength
	});
});