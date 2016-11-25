import Schema from './Schema'

export default function dewormalize(data, schema, entities) {
  if (!data) {
    return data
  }
  if (Array.isArray(schema)) {
    return dewormalizeArray(data, schema, entities)
  }
  if (schema instanceof Schema) {
    return dewormalizeSchema(data, schema, entities)
  }
  if (schema !== null && typeof schema === 'object') {
    return dewormalizeObject(data, schema, entities)
  }

  throw new Error(`Invalid schema: ${schema}`)
}

function dewormalizeObject(data, schema, entities) {
  const result = Object.assign({}, data)
  Object.keys(schema).forEach((key) => {
    result[key] = dewormalize(data[key], schema[key], entities)
  })
  return result
}

function dewormalizeSchema(data, schema, entities) {
  const entity = getEntity(entities, schema.name, data)
  if (schema.isPlain || !entity) {
    return entity
  }
  const override = Object.assign({}, entity)
  schema.forEachNestedSchema(([property, nestedSchema]) => {
    override[property] = dewormalize(override[property], nestedSchema, entities)
  })

  return override
}

function dewormalizeArray(data, [schema], entities) {
  return data.map((item) => dewormalize(item, schema, entities))
}

function getEntity(entities, schemaName, id) {
  if (typeof entities === 'function') {
    return entities(schemaName, id)
  }
  if (entities[schemaName] && entities[schemaName][id]) {
    return entities[schemaName][id]
  }
  return null
}
