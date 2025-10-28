/**
 * Test setup for ActiveModel
 * Loads the built railsDocument.js and makes it available for tests
 */

const { expect } = require('chai');

// Load the built ActiveModel
global.ActiveModel = require('../railsDocument.js');

// Make Utils available globally (it should already be exported)
global.Utils = global.Utils || require('../lib/utils.js');

// Make expect available globally for convenience
global.expect = expect;

// Mock XMLHttpRequest for CRUD tests if needed
if (typeof XMLHttpRequest === 'undefined') {
    global.XMLHttpRequest = class XMLHttpRequest {
        constructor() {
            this.readyState = 0;
            this.status = 0;
            this.responseText = '';
        }
        open(method, url, async) {
            this.method = method;
            this.url = url;
            this.async = async;
        }
        setRequestHeader(header, value) {
            this.headers = this.headers || {};
            this.headers[header] = value;
        }
        send(data) {
            // Mock implementation - tests can override
        }
    };
}

module.exports = { expect, ActiveModel: global.ActiveModel };
