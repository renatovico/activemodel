
var fs = require('fs'),
sys = require('sys'),
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


sys.log('Reading files…');

files.forEach(function(file){
var path = __dirname + '/lib/' + file;
sys.log (' + ' + path);
content += fs.readFileSync(path) + "\n";
});

sys.log('Generating…');

fs.write(fs.openSync(__dirname + '/railsDocument.js', 'w'), content, 0, 'utf8');
sys.log(' + ' + __dirname + '/railsDocument.js');

sys.log('All done!');