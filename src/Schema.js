export default class Schema {
  constructor(name, idProperty = 'id') {
    this._name = name
    this._idProperty = idProperty
    this._nestedSchemas = []
  }

  get name() {
    return this._name
  }

  get idProperty() {
    return this._idProperty
  }

  get isPlain() {
    return this._nestedSchemas.length === 0
  }

  define(nestedSchemas) {
    Object.keys(nestedSchemas).forEach((property) => {
      const schema = nestedSchemas[property]
      this._nestedSchemas.push([property, schema])
    })
  }

  forEachNestedSchema(iter) {
    this._nestedSchemas.forEach(iter)
  }
}
