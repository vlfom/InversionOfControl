// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

for (var k in global) {
	console.log('<Key: ' + k + '> <Type: ' + typeof k + '>');
}

module.exports = {
	testFunction: function(a, b, c, d) {
		return 42;
	}
};