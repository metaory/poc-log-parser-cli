#!/usr/bin/env node

import { Command } from 'commander'
import { Parser } from './index'

const program = new Command()

console.time('Time Took')

program
  .version('0.1.0')
  .requiredOption('-i, --input <path>', 'Input file path')
  .requiredOption('-o, --output <path>', 'Output file path')
  .parse(process.argv)

const parser = new Parser({
  inputPath: program.opts().input,
  outputPath: program.opts().output,
})

parser.process()
  .then(() => console.log(parser.outputPath, 'written successfully.'))
  .catch(console.error)
  .finally(() => console.timeEnd('Time Took'))
