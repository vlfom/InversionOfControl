// Вывод из глобального контекста модуля
console.log('From application global context');

// Пример использования fs API
var fileIn = './README.md';
setInterval(function() {
	console.log('[READ] ' + fileIn);
	fs.readFile(fileIn, function(err, src) {
	});
}, 1000);