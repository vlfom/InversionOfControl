// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');

module.exports = {
};

(function testUtil() {
	console.log('Test if object is array using util:');
	var x = "string", y = [1, 2, 3];
	console.log("x = '" + x + "' is " + util.isArray(x) + " array");
	console.log("y = '" + y + "' is " + util.isArray(y) + " array");
})()