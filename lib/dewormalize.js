'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = dewormalize;

var _Schema = require('./Schema');

var _Schema2 = _interopRequireDefault(_Schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dewormalize(data, schema, entities) {
  if (Array.isArray(schema)) {
    return dewormalizeArray(data, schema, entities);
  }
  if (schema instanceof _Schema2.default) {
    return dewormalizeSchema(data, schema, entities);
  }
  if (schema !== null && typeof schema === 'object') {
    return dewormalizeObject(data, schema, entities);
  }

  throw new Error('Invalid schema: ' + schema);
}

function dewormalizeObject(data, schema, entities) {
  var result = Object.assign({}, data);
  Object.keys(schema).forEach(function (key) {
    result[key] = dewormalize(data[key], schema[key], entities);
  });
  return result;
}

function dewormalizeSchema(data, schema, entities) {
  var entity = getEntity(entities, schema.name, data);
  if (schema.isPlain || !entity) {
    return entity;
  }
  var override = Object.assign({}, entity);
  schema.forEachNestedSchema(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        property = _ref2[0],
        nestedSchema = _ref2[1];

    override[property] = dewormalize(override[property], nestedSchema, entities);
  });

  return override;
}

function dewormalizeArray(data, _ref3, entities) {
  var _ref4 = _slicedToArray(_ref3, 1),
      schema = _ref4[0];

  return data.map(function (item) {
    return dewormalize(item, schema, entities);
  });
}

function getEntity(entities, schemaName, id) {
  if (typeof entities === 'function') {
    return entities(schemaName, id);
  }
  if (entities[schemaName] && entities[schemaName][id]) {
    return entities[schemaName][id];
  }
  return null;
}