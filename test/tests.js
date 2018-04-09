#!/usr/bin/env node

'use strict';


const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const mlog = require('mocha-logger');
const util = require('util');

const Action = require('zanner-cms-action').Action;

const ActionScope = require('../ActionScope').ActionScope;


describe('ActionScope', () => {

	describe('static', () => {

		it('ActionScope is a function', (done) => {
			expect(ActionScope).to.be.an.instanceof(Function);
			done();
		});

		it('ActionScope.init is a function', (done) => {
			expect(ActionScope.init).to.be.an.instanceof(Function);
			done();
		});

		it('ActionScope.init creates instanceof Action', (done) => {
			expect(ActionScope.init()).to.be.an.instanceof(ActionScope);
			done();
		});

	});
	
	describe('instance', () => {

		it('ActionScope creates instanceof ActionScope with Action', (done) => {
			let A = {
				name: 'name',
				service: 'service',
				action: async function () {}
			};

			expect(new ActionScope({name: A})).to.be.an.instanceof(ActionScope);
			done();
		});

		it('ActionScope._setKeyValue', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};
			let A = Action.init(name, service, action);
			let a = ActionScope.init();
			a._setKeyValue('name', A);

			expect(a.keys).to.have.members(['name']);
			done();
		});

		it('ActionScope._setObject', (done) => {
			let A = {
				name: 'name',
				service: 'service',
				action: async function () {}
			};
			let a = ActionScope.init();
			a._setObject({name: A});

			expect(a.keys).to.have.members(['name']);
			done();
		});

		it('ActionScope.apply exec', (done) => {
			let A = {
				name: 'name',
				service: 'service',
				action: async function (x, y) { return x + y; }
			};
			let a = ActionScope.init({name: A});

			expect(a.apply).to.be.an.instanceof(Function);
			expect(a.apply('name', [13, 31])).to.eventually.equal(13 + 31).notify(done);
			//a.apply('name', [13, 31]).should.eventually.equal(44).notify(done);
		});

		it('ActionScope.apply exec with throw', (done) => {
			let A = {
				name: 'name',
				service: 'service',
				action: async function (x, y) { throw new Error('ActionScope.apply'); }
			};
			let a = ActionScope.init({name: A});

			expect(a.apply('name', [13, 31])).to.be.rejectedWith('ActionScope.apply').notify(done);
		});

		it('ActionScope.call exec', (done) => {
			let A = {
				name: 'name',
				service: 'service',
				action: async function (x, y) { return x + y; }
			};
			let a = ActionScope.init({name: A});

			expect(a.call).to.be.an.instanceof(Function);
			expect(a.call('name', 13, 31)).to.eventually.equal(13 + 31).notify(done);
			//a.call('name', 13, 31).should.eventually.equal(44).notify(done);
		});

		it('ActionScope.call exec with throw', (done) => {
			let A = {
				name: 'name',
				service: 'service',
				action: async function (x, y) { throw new Error('ActionScope.call'); }
			};
			let a = ActionScope.init({name: A});

			expect(a.apply('name', 13, 31)).to.be.rejectedWith('ActionScope.call').notify(done);
		});

	});

});
