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

function wrapCallbackFunction(fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    console.log('Callback:');
    for (var i = 0; i < args.length; ++i) {
      if (args[i] == null || args[i].length == 'undefined' || args[i].length < 10)
        console.dir(args[i]);
      else
        console.dir(typeof args[i]);
    }
    fn.apply(undefined, args);
  }
}

function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    console.log('Call: ' + fnName);
    console.dir(args);
    var l = args.length;
    if (typeof args[l - 1] == 'function') {
      args[l - 1] = wrapCallbackFunction(args[l - 1]);
    }
    fn.apply(undefined, args);
  }
}

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: cloneInterface(fs)
};

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