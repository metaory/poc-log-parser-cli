import { stat, readFile } from 'fs/promises'
import test from 'ava'

import { LogItem, Parser } from './index'

const parser = new Parser({
  inputPath: './data/sample',
  outputPath: './errors.json'
})

test.before(async () => {
  console.log('Starting tests!')
})

test.serial('parser is successful', async t => {
  await parser.process()
  t.pass()
})

test.serial('output file exists', async t => {
  t.truthy(await stat(parser.outputPath))
})

test.serial('output file is JSON', async t => {
  const outputFile = await parser.readJsonFile(parser.outputPath)
  t.true(typeof outputFile === 'object')
})

test.serial('all loglevels are error', async t => {
  const outputFile = await parser.readJsonFile(parser.outputPath)
  t.true(outputFile.every((x: LogItem): boolean => x.loglevel === 'error'))
})

test.serial('timestamp is number', async t => {
  const outputFile = await parser.readJsonFile(parser.outputPath)
  t.true(outputFile.every((x: LogItem): boolean => typeof x.timestamp === 'number'))
})
