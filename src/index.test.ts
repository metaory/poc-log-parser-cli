import test from 'ava'

import { init } from './index'

test.before(async t => {
  console.log('Starting tests!')
})

test('parse a log file', async t => {

  let result = await init({
    input: './tests/raw',
    output: './errors.json'
  })

  // TODO
  t.true(true)
})
