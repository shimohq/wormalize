import test from 'ava'
import { Schema, dewormalize } from '../lib'

const Person = new Schema('Person')
const Book = new Schema('Book')

Book.define({
  author: Person,
  readers: [Person]
})

test('simple schema', (t) => {
  t.deepEqual(
    dewormalize(1 , Person, { Person: { 1: { id: 1, name: 'Bob' } } }),
    { id: 1, name: 'Bob' }
  )
})

test('nested schema', (t) => {
  t.deepEqual(
    dewormalize(1, Book, {
      Person: {
        1: { id: 1, name: 'Bob' },
        2: { id: 2, name: 'Jeff' },
        3: { id: 3, name: 'Tom' }
      },
      Book: {
        1: { id: 1, author: 1, readers: [2, 3] }
      }
    }),
    {
      id: 1,
      author: { id: 1, name: 'Bob' },
      readers: [
        { id: 2, name: 'Jeff' },
        { id: 3, name: 'Tom' }
      ],
    }
  )
})

test('array of nested schema', (t) => {
  t.deepEqual(
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
    }),
    [{
      id: 1,
      author: { id: 1, name: 'Bob' },
      readers: [ { id: 2, name: 'Jeff' }, { id: 3, name: 'Tom' } ],
    }, {
      id: 2,
      author: { id: 2, name: 'Jeff' },
      readers: [ { id: 3, name: 'Tom' } ],
    }]
  )
})

test('object of nested schema', (t) => {
  t.deepEqual(
    dewormalize({ books: [ 1, 2 ], plain: 'plain' }, { books: [Book] }, {
      Person: {
        1: { id: 1, name: 'Bob' },
        2: { id: 2, name: 'Jeff' },
        3: { id: 3, name: 'Tom' }
      },
      Book: {
        1: { id: 1, author: 1, readers: [2, 3] },
        2: { id: 2, author: 2, readers: [3] }
      }
    }),
    {
      books: [{
        id: 1,
        author: { id: 1, name: 'Bob' },
        readers: [ { id: 2, name: 'Jeff' }, { id: 3, name: 'Tom' } ],
      }, {
        id: 2,
        author: { id: 2, name: 'Jeff' },
        readers: [ { id: 3, name: 'Tom' } ],
      }],
      plain: 'plain'
    }
  )
})

test('fill with null when the entity is absent', (t) => {
  t.deepEqual(
    dewormalize({ books: [ 1, 2 ] }, { books: [Book] }, {
      Person: {
        1: { id: 1, name: 'Bob' },
        2: { id: 2, name: 'Jeff' },
        3: { id: 3, name: 'Tom' }
      },
      Book: {
        1: { id: 1, author: 1, readers: [2, 3] }
      }
    }),
    {
      books: [{
        id: 1,
        author: { id: 1, name: 'Bob' },
        readers: [ { id: 2, name: 'Jeff' }, { id: 3, name: 'Tom' } ],
      }, null]
    }
  )
})
