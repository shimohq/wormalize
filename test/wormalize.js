import test from 'ava'
import { Schema, wormalize } from '../lib'

const Person = new Schema('Person')
const Book = new Schema('Book')

Book.define({
  author: Person,
  readers: [Person]
})

test('simple schema', (t) => {
  t.deepEqual(
    wormalize({ id: 1, name: 'Bob' } , Person),
    { result: 1, entities: { Person: { 1: { id: 1, name: 'Bob' } } } }
  )
})

test('nested schema', (t) => {
  t.deepEqual(
    wormalize({
      id: 1,
      author: { id: 1, name: 'Bob' },
      readers: [
        { id: 2, name: 'Jeff' },
        { id: 3, name: 'Tom' }
      ],
    } , Book),
    {
      result: 1,
      entities: {
        Person: {
          1: { id: 1, name: 'Bob' },
          2: { id: 2, name: 'Jeff' },
          3: { id: 3, name: 'Tom' }
        },
        Book: {
          1: { id: 1, author: 1, readers: [2, 3] }
        }
      }
    }
  )
})

test('ignore undefined property', (t) => {
  t.deepEqual(
    wormalize({ id: 1 } , Book),
    { result: 1, entities: { Book: { 1: { id: 1 } } } }
  )
})

test('array of nested schema', (t) => {
  t.deepEqual(
    wormalize([{
      id: 1,
      author: { id: 1, name: 'Bob' },
      readers: [ { id: 2, name: 'Jeff' }, { id: 3, name: 'Tom' } ],
    }, {
      id: 2,
      author: { id: 2, name: 'Jeff' },
      readers: [ { id: 3, name: 'Tom' } ],
    }], [Book]),
    {
      result: [ 1, 2 ],
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
  )
})

test('object of nested schema', (t) => {
  t.deepEqual(
    wormalize({
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
    }, { books: [Book] }),
    {
      result: { books: [ 1, 2 ], plain: 'plain' },
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
  )
})
