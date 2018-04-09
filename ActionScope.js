#!/usr/bin/env node

'use strict';


const Action = require('zanner-cms-action').Action;
const Scope = require('zanner-cms-scope').Scope;


class ActionScope extends Scope {

	static init (...args) {
		return Object.freeze(new ActionScope(...args));
	}

	_setKeyValue (key, value) {
		if (value instanceof Action) return super._setKeyValue(key, value);
		throw new Error('ActionScope._setKeyValue got value not an Action');
	}

	_setObject (object) {
		if (object instanceof Action) return super._setKeyValue(object.name, object);
		if (object instanceof Object) {
			let result = Object.keys(object).map(key => {
				let O = object[key] || {};
				let name = O.name;
				let service = O.service;
				let action = O.action;
				this._setKeyValue(key, Action.init(name, service, action));
			}, this);
			return result.length===1 ? result[0] : result;
		}
		throw new Error('ActionScope._setObject called with non-object');
	}

	apply (key, args) {		
		if (this._is(key)) return this._get(key).apply(args);
		throw new Error('ActionScope.apply called with key not in Scope');
	}

	call (key, ...args) {
		if (this._is(key)) return this._get(key).call(...args);
		throw new Error('ActionScope.call called with key not in Scope');
	}

}

exports.ActionScope = ActionScope;
