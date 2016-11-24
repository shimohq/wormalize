'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = wormalize;

var _Schema = require('./Schema');

var _Schema2 = _interopRequireDefault(_Schema);

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

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
  var result = {};
  var entities = {};
  Object.keys(schema).forEach(function (key) {
    var nested = wormalize(data[key], schema[key]);
    (0, _deepAssign2.default)(entities, nested.entities);
    result[key] = nested.result;
  });

  Object.keys(data).forEach(function (key) {
    if (!schema.hasOwnProperty(key)) {
      result[key] = data[key];
    }
  });

  return { result: result, entities: entities };
}

function wormalizeSchema(data, schema) {
  var id = data[schema.idProperty];
  if (typeof id === 'undefined') {
    return { result: null, entities: {} };
  }
  if (schema.isPlain) {
    return { result: id, entities: setEntity(data, schema.name, id) };
  }
  var override = Object.assign({}, data);
  var entities = {};
  schema.forEachNestedSchema(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        property = _ref2[0],
        nestedSchema = _ref2[1];

    var nested = wormalize(override[property], nestedSchema);
    override[property] = nested.result;
    (0, _deepAssign2.default)(entities, nested.entities);
  });
  setEntity(override, schema.name, id, entities);

  return { result: id, entities: entities };
}

function wormalizeArray(data, _ref3) {
  var _ref4 = _slicedToArray(_ref3, 1),
      schema = _ref4[0];

  var result = [];
  var entities = {};
  data.forEach(function (item) {
    var nested = wormalize(item, schema);
    result.push(nested.result);
    (0, _deepAssign2.default)(entities, nested.entities);
  });

  return { result: result, entities: entities };
}

function setEntity(data, schemaName, id) {
  var entities = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (typeof entities[schemaName] === 'undefined') {
    entities[schemaName] = {};
  }
  entities[schemaName][id] = data;

  return entities;
}