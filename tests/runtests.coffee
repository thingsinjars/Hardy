jasmine = require 'jasmine-node'
sys = require 'sys'
for key in jasmine
  global[key] = jasmine[key]

isVerbose = true
showColors = true
coffee = true

process.argv.forEach (arg) ->
  switch arg
    when '--color' then showColors = true
    when '--noColor' then showColors = false
    when '--verbose' then isVerbose = true
    when '--coffee' then coffee = true

jasmine.executeSpecsInFolder __dirname + '/spec', ((runner, log) ->
  if runner.results().failedCount == 0
    process.exit 0
  else
    process.exit 1
), isVerbose, showColors