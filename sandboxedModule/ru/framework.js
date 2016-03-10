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

// Читаем исходный код приложения из файла
process.argv.slice(2).forEach((fileName) => {
	fs.readFile(fileName, function(err, src) {
	  // Тут нужно обработать ошибки
	  
	  // Запускаем код приложения в песочнице
	  var script = vm.createScript(src, fileName);
	  script.runInNewContext(sandbox);
	  
	  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
	  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
	})
})

function narrow_clone(o) {
  var r = {};
  for (var k in o)
  	r[k] = o[k];
  return r;
}