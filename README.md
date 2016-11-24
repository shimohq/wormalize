# Wormalize

Normalizes nested JSON according to a schema

## Install

```shell
$ npm install wormalize
```

## Usage

Using `Schema` to defines schemas that responding to your model definitions. All the following
operations are based on these schemas.

```javascript
import { Schema } from 'wormalize'

const Person = new Schema('Person')
const Book = new Schema('Book')

Book.define({
  author: Person,
  readers: [Person]
})
```

Given the following API response consisting of a list of the Book entity (which has already
been defined above), the User entity is nested in the `author` and `readers` properties,
which makes it non-trivial to resolve them into your Redux state.

```javascript
{
  id: 1,
  author: { id: 1, name: 'Bob' },
  readers: [
    { id: 2, name: 'Jeff' },
    { id: 3, name: 'Tom' }
  ],
}, {
  id: 2,
  author: { id: 2, name: 'Jeff' },
  readers: [
    { id: 3, name: 'Tom' }
  ],
}
```

`wormalize` comes to rescue in this case. By providing a schema corresponding to the structure
of data, `wormalize` is able to resolve them to the `result` and `entities` properties:

```javascript
import { wormalize } from 'wormalize'

wormalize([{
  id: 1,
  author: { id: 1, name: 'Bob' },
  readers: [
    { id: 2, name: 'Jeff' },
    { id: 3, name: 'Tom' }
  ],
}, {
  id: 2,
  author: { id: 2, name: 'Jeff' },
  readers: [
    { id: 3, name: 'Tom' }
  ],
}], [Book])
```

The code above returns:

```javascript
{
  result: [1, 2],
  entities: {
    Person: {
      1: { id: 1, name: 'Bob' },
      2: { id: 2, name: 'Jeff' },
      3: { id: 3, name: 'Tom' }
    },
    Book: {
      1: { id: 1, author: 1, readers: [2, 3] },
      2: { id: 2, author: 2, readers: [3] }
    }
  }
}
```

Correspondingly, `dewormalize` is provided to do the opposite:

```javascript
import { dewormalize } from 'wormalize'

dewormalize([1, 2], [Book], {
  Person: {
    1: { id: 1, name: 'Bob' },
    2: { id: 2, name: 'Jeff' },
    3: { id: 3, name: 'Tom' }
  },
  Book: {
    1: { id: 1, author: 1, readers: [2, 3] },
    2: { id: 2, author: 2, readers: [3] }
  }
})
```

The code above returns:

```javascript
[{
  id: 1,
  author: { id: 1, name: 'Bob' },
  readers: [
    { id: 2, name: 'Jeff' },
    { id: 3, name: 'Tom' }
  ],
}, {
  id: 2,
  author: { id: 2, name: 'Jeff' },
  readers: [
    { id: 3, name: 'Tom' }
  ],
}
```

The third argument of `dewormalize` can also be a function, which will be called with
two arguments `schemaName` and `id` when resolving each data.
