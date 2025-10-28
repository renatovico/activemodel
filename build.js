
var fs = require('fs'),
util = require('util'),
files = [
'../vendor/date.js',
'../vendor/inflection.js',
'../vendor/jquery.tmpl.1.1.1.js',
'../vendor/jgettext.js',
'core.js',
'sti.js',
'associations.js',
'validators.js',
'reflect.js',
'gettext.js',
'crud.js'
],

content = "/** RailsDocument v0.2 - Built with build.js */\n";


console.log('Reading files…');

files.forEach(function(file){
var path = __dirname + '/lib/' + file;
console.log(' + ' + path);
content += fs.readFileSync(path) + "\n";
});

console.log('Generating…');

fs.writeFileSync(__dirname + '/railsDocument.js', content, 'utf8');
console.log(' + ' + __dirname + '/railsDocument.js');

console.log('All done!');