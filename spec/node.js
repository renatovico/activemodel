require.paths.unshift('spec', 'lib' , '/Users/gards/.rvm/gems/ruby-1.9.2-p0/gems/jspec-4.3.3/lib')
require('jspec')
require('unit/spec.helper')
jsdom  = require("jsdom"),

dom = jsdom.defaultLevel;
browser = jsdom.windowAugmentation(dom);


document = browser.document;
window = browser.window;
self = browser.self;
navigator = browser.navigator;
location = browser.location;

require('../vendor/inflection');

window.XMLHttpRequest = XMLHttpRequest = null;
window.ActiveXObject = ActiveXObject = null;

jsdom.jQueryify(window, __dirname + "/../vendor/jquery/jquery.js", function() {
	$ = window.jQuery;
	jQuery = $;
	
	
	
	jQuery.getText = function() {
		return "mock";
	}
	jQuery.tmpl = function() {
		return "mock";
	}
	jQuery.blockUI = function() {
		return "mock";
	}
	jQuery.unblockUI = function() {
		return "mock";
	}
	
	XMLHttpRequest = null;
	require('jspec.xhr');
	jQuery.ajaxSettings.xhr = function() {
		return new XMLHttpRequest();
	}
	
	window.alert = function(msg) {
		console.log(msg);
	}
	

	ActiveModel = require('core');
	require("sti");
	require('associations');
	require('validators');
	require('crud');
	mockRest = require('mock_rest');



	JSpec
	  .exec('spec/unit/core.js')
	  .exec('spec/unit/sti.js')
	  .exec('spec/unit/associations.js')
	  .exec('spec/unit/validators.js')
	  .exec('spec/unit/crud.js')
	  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: false })
	  .report()

	

});

