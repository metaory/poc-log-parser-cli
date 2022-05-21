#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

import { init } from './index'
 
program
  .version('0.1.0')
  .option('-i, --input <path>', 'Input file path')
  .option('-o, --output <path>', 'Output file path')
  .parse(process.argv)

init({
  input: program.opts().input,
  output: program.opts().output,
}).then(result => console.log('>>>', result.message))
