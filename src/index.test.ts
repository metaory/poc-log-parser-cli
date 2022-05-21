import { stat, readFile } from 'fs/promises'
import test from 'ava'

import { init } from './index'

const input = './data/raw'
const output = './errors.json'

const readJson = async (path) => JSON.parse(await readFile(path, { encoding: 'utf8' }))

test.before(async t => {
  console.log('Starting tests!')
  await init({ input, output })
})

test.serial('output file exists', async t => {
  t.truthy(await stat(output))
})

test.serial('output file is JSON', async t => {
  const outputFile = await readJson(output)
  t.true(typeof outputFile === 'object')
})

test.serial('all loglevels are error', async t => {
  const outputFile = await readJson(output)
  t.true(outputFile.every(x => x.loglevel === 'error'))
})

test.serial('timestamp is epoch', async t => {
  const outputFile = await readJson(output)
  t.true(outputFile.every(x => typeof x.timestamp === 'number'))
})
