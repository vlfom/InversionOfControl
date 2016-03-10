// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
	vm = require('vm'),
	path = require('path');

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { 
	module: {},
	console: narrow_clone(console)
};
context.console.log = function(s) {
	var programName = path.basename(process.argv[1]);
    var date = new Date().toLocaleTimeString();

    console.log('<' + programName + '> <' + date + '> ' + s);

	var fileStream = fs.createWriteStream('log.txt', {flags: 'a'});
	fileStream.write('<' + programName + '> <' + date + '> ' + s + '\n');
  };
context.global = context;

var sandbox = vm.createContext(context);
sandbox.require = function(module) {
    var date = new Date().toLocaleTimeString();
    context.console.log('<' + date + '> ' + module + ' is required.');
    return require(module);
}

// Читаем исходный код приложения из файла
process.argv.slice(2).forEach((fileName) => {
	fs.readFile(fileName, function(err, src) {
	  var oldContextKeys = {};
	  for (var key in sandbox.global)
	  	oldContextKeys[key] = sandbox.global[key];
  	  console.log(oldContextKeys);
	  
	  var script = vm.createScript(src, fileName);
	  script.runInNewContext(sandbox);

	  for (var key in sandbox.global)
	  	if (!(key in oldContextKeys))
	  		console.log('<Added global key> ' + key);

	  for (var key in oldContextKeys)
	  	if (!(key in sandbox.global))
	  		console.log('<Deleted global key> ' + key);

	  for (var k in sandbox.module.exports)
	  	console.log(k + ': ' + typeof sandbox.module.exports[k]);
	  
	  if (fileName == 'application.js') {
	  	console.log('Source code of "testFunction":');
	  	console.log(sandbox.module.exports.testFunction.toString());
		console.log('Arguments number: ' + 
			((sandbox.module.exports.testFunction.toString()
				.match(/^.*?\((.*?)\)/)[1]
				.match(/,/g) || []
			).length + 1)
		);
	  }
	})
});

function narrow_clone(o) {
  var r = {};
  for (var k in o)
  	r[k] = o[k];
  return r;
}