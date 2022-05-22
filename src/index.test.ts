import { stat, readFile } from 'fs/promises'
import test from 'ava'

import { processLog } from './index'

interface LogItem {
  timestamp: number
  loglevel: string
  transactionId: string
  details: string
}

const input = './data/raw'
const output = './errors.json'

const readJson = async (path) => JSON.parse(await readFile(path, { encoding: 'utf8' }))

test.before(async t => {
  console.log('Starting tests!')
})

test.serial('parser is successful', async t => {
  await processLog({ input, output })
  t.pass()
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
  t.true(outputFile.every((x : LogItem): boolean => x.loglevel === 'error'))
})

test.serial('timestamp is number', async t => {
  const outputFile = await readJson(output)
  t.true(outputFile.every((x : LogItem): boolean => typeof x.timestamp === 'number'))
})
