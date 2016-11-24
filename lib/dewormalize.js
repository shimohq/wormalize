'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = wormalize;

var _Schema = require('./Schema');

var _Schema2 = _interopRequireDefault(_Schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wormalize(data, schema) {
  if (!data) {
    return { result: data, entities: {} };
  }
  if (Array.isArray(schema)) {
    return wormalizeArray(data, schema);
  }
  if (schema instanceof _Schema2.default) {
    return wormalizeSchema(data, schema);
  }
  if (schema !== null && typeof schema === 'object') {
    return wormalizeObject(data, schema);
  }

  throw new Error('Invalid schema: ' + schema);
}

function wormalizeObject(data, schema) {
  var keys = Object.keys(schema);
  var result = {};
  var entities = {};
  keys.forEach(function (key) {
    var nested = wormalize(data[key], schema[key]);
    deepAssign(entities, nested.entities);
    result[key] = nested.result;
  });

  return { result: result, entities: entities };
}

function wormalizeSchema(data, schema) {
  if (schema.isPlain) {
    return { result: data, entities: setEntity(data, schema) };
  }
  var result = Object.assign({}, data);
  var entities = {};
  schema.forEachNestedSchema(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        property = _ref2[0],
        nestedSchema = _ref2[1];

    var nested = wormalize(result[property], nestedSchema);
    result[property] = nested.result;
    deepAssign(entities, nested.entities);
  });

  return { result: result, entities: entities };
}

function wormalizeArray(data, _ref3) {
  var _ref4 = _slicedToArray(_ref3, 1),
      schema = _ref4[0];

  var result = [];
  var entities = {};
  data.forEach(function (item) {
    var nested = wormalize(item, schema);
    result.push(nested.result);
    deepAssign(entities, nested.entities);
  });

  return { result: result, entities: entities };
}

function setEntity(data, schema) {
  var entities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof entities[schema.name] === 'undefined') {
    entities[schema.name] = {};
  }
  entities[schema.name][data[schema.idProperty]] = data;
}

function deepAssign(target, source) {
  target = target || {};

  for (var key in source) {
    if (!source.hasOwnProperty(key)) {
      continue;
    }
    var value = source[key];
    if (value !== null && typeof value === 'object') {
      deepAssign(target[key], value);
    } else {
      target[key] = value;
    }
  }

  return target;
}