# Wormalize

Normalizes nested JSON according to a schema

## Install

```shell
$ npm install wormalize
```

## Usage

```javascript
import { Schema, wormalize } from 'wormalize'

const Person = new Schema('Person')
const Book = new Schema('Book')

Book.define({
  author: Person,
  readers: [Person]
})

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

// RETURN:
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

dewormalize([1, 2], [Book], {
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
})

// RETURN:
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
