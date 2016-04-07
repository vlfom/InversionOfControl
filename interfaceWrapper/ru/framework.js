// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

function cloneInterface(infc) {
  var clone = {};
  for (var key in infc) {
    clone[key] = wrapFunction(key, infc[key]);
  }
  return clone;
}

var readBytes = 0;

function wrapCallbackFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    if (fnName.indexOf('read') > -1)
      readBytes += args[1].length;
    fn.apply(undefined, args);
  }
}

function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    var l = args.length;
    if (typeof args[l - 1] == 'function') {
      args[l - 1] = wrapCallbackFunction(fnName, args[l - 1]);
    }
    fn.apply(undefined, args);
  }
}

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: cloneInterface(fs),
  setInterval: setInterval
};

setInterval(function() {
  console.log('[Bytes read] ' + readBytes);
}, 2000);

// Преобразовываем хеш в контекст
context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});