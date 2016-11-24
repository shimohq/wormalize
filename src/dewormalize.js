import Schema from './Schema'

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
  const keys = Object.keys(schema)
  const result = {}
  const entities = {}
  keys.forEach((key) => {
    const nested = wormalize(data[key], schema[key])
    deepAssign(entities, nested.entities)
    result[key] = nested.result
  })

  return { result, entities }
}

function wormalizeSchema(data, schema) {
  if (schema.isPlain) {
    return { result: data, entities: setEntity(data, schema) }
  }
  const result = Object.assign({}, data)
  const entities = {}
  schema.forEachNestedSchema(([property, nestedSchema]) => {
    const nested = wormalize(result[property], nestedSchema)
    result[property] = nested.result
    deepAssign(entities, nested.entities)
  })

  return { result, entities }
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

function setEntity(data, schema, entities = {}) {
  if (typeof entities[schema.name] === 'undefined') {
    entities[schema.name] = {}
  }
  entities[schema.name][data[schema.idProperty]] = data
}

function deepAssign(target, source) {
  target = target || {}

  for (const key in source) {
    if (!source.hasOwnProperty(key)) {
      continue
    }
    const value = source[key]
    if (value !== null && typeof value === 'object') {
      deepAssign(target[key], value)
    } else {
      target[key] = value
    }
  }

  return target
}
