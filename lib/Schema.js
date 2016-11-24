'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Schema = function () {
  function Schema(name) {
    var idProperty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';

    _classCallCheck(this, Schema);

    this._name = name;
    this._idProperty = idProperty;
    this._nestedSchemas = [];
  }

  _createClass(Schema, [{
    key: 'define',
    value: function define(nestedSchemas) {
      var _this = this;

      Object.keys(nestedSchemas).forEach(function (property) {
        var schema = nestedSchemas[property];
        _this._nestedSchemas.push([property, schema]);
      });
    }
  }, {
    key: 'forEachNestedSchema',
    value: function forEachNestedSchema(iter) {
      this._nestedSchemas.forEach(iter);
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    }
  }, {
    key: 'idProperty',
    get: function get() {
      return this._idProperty;
    }
  }, {
    key: 'isPlain',
    get: function get() {
      return this._nestedSchemas.length === 0;
    }
  }]);

  return Schema;
}();

exports.default = Schema;