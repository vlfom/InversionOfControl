// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

function getTime() {
  return Math.floor(Math.random() * (30 - 10 + 1)) + 10;
}

function cloneInterface(infc) {
  var clone = {};
  for (var key in infc) {
    clone[key] = wrapFunction(key, infc[key]);
  }
  return clone;
}

var readBytes = 0;
var wroteBytes = 0;
var callbacksCount = 0;
var callbackExecutionSummary = 0;

function wrapCallbackFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);

    if (fnName.indexOf('read') > -1)
      readBytes += args[1].length;

    var time_start = Date.now();
    fn.apply(undefined, args);
    callbackExecutionSummary += getTime();
    callbacksCount += 1;
  }
}

function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    var l = args.length;

    if (fnName.indexOf('append') > -1)
      wroteBytes += args[1].length;

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
  console.log('[REPORT Average execution time] ' + (callbackExecutionSummary * 1.0 / callbacksCount) + ' ms');
  console.log('[REPORT Bytes read] ' + readBytes);
  console.log('[REPORT Bytes wrote] ' + wroteBytes);
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