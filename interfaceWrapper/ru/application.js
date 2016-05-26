// Вывод из глобального контекста модуля
console.log('From application global context');

// Пример использования fs API
var fileIn = './README.md';
var fileOut = './out.txt';

setInterval(function() {
	console.log('[APPLICATION READ] ' + fileIn);
	fs.readFile(fileIn, function(err, src) {});
}, 1000);

setInterval(function() {
	console.log('[APPLICATION WRITE] ' + fileOut);
	fs.appendFile(fileOut, 'output', function(err, src) {});
}, 1000);