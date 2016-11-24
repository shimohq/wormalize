import Schema from './Schema'
import deepAssign from 'deep-assign'

export default function wormalize(data, schema) {
  if (!data) {
    return { result: data, entities: {} }
  }
  if (Array.isArray(schema)) {
    return wormalizeArray(data, schema)
  }
  if (schema instanceof Schema) {
    return wormalizeSchema(data, schema)
  }
  if (schema !== null && typeof schema === 'object') {
    return wormalizeObject(data, schema)
  }

  throw new Error(`Invalid schema: ${schema}`)
}

function wormalizeObject(data, schema) {
  const result = {}
  const entities = {}
  Object.keys(schema).forEach((key) => {
    const nested = wormalize(data[key], schema[key])
    deepAssign(entities, nested.entities)
    result[key] = nested.result
  })

  Object.keys(data).forEach((key) => {
    if (!schema.hasOwnProperty(key)) {
      result[key] = data[key]
    }
  })

  return { result, entities }
}

function wormalizeSchema(data, schema) {
  const id = data[schema.idProperty]
  if (typeof id === 'undefined') {
    return { result: null, entities: {} }
  }
  if (schema.isPlain) {
    return { result: id, entities: setEntity(data, schema.name, id) }
  }
  const override = Object.assign({}, data)
  const entities = {}
  schema.forEachNestedSchema(([property, nestedSchema]) => {
    const nested = wormalize(override[property], nestedSchema)
    override[property] = nested.result
    deepAssign(entities, nested.entities)
  })
  setEntity(override, schema.name, id, entities)

  return { result: id, entities }
}

function wormalizeArray(data, [schema]) {
  const result = []
  const entities = {}
  data.forEach((item) => {
    const nested = wormalize(item, schema)
    result.push(nested.result)
    deepAssign(entities, nested.entities)
  })

  return { result, entities }
}

function setEntity(data, schemaName, id, entities = {}) {
  if (typeof entities[schemaName] === 'undefined') {
    entities[schemaName] = {}
  }
  entities[schemaName][id] = data

  return entities
}
