#!/usr/bin/env node

import { Command } from 'commander'
import { processLog } from './index'

const program = new Command()

console.time('Time Took')

program
  .version('0.1.0')
  .requiredOption('-i, --input <path>', 'Input file path')
  .requiredOption('-o, --output <path>', 'Output file path')
  .parse(process.argv)

processLog({
  input: program.opts().input,
  output: program.opts().output,
})
  .then(() => console.log(program.opts().output, 'written successfully.'))
  .catch(console.error)
  .finally(() => console.timeEnd('Time Took'))
