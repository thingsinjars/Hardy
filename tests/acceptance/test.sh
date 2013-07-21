#!/bin/bash
EXIT_STATUS=0;

# Run the tests in Firefox
echo -n "Running tests in Firefox..."
ffout="`../../bin/hardy .`"

needle='# Scenario: Missing page'
if [[ "$ffout" != *"$needle"* ]]; then
	EXIT_STATUS=1;
fi
needle='# Scenario: Missing element'
if [[ "$ffout" != *"$needle"* ]]; then
	EXIT_STATUS=1;
fi
needle='# Scenario: Failing comparison'
if [[ "$ffout" != *"$needle"* ]]; then
	EXIT_STATUS=1;
fi
needle='8 scenarios (3 failed, 5 passed)'
if [[ "$ffout" != *"$needle"* ]]; then
	EXIT_STATUS=1;
fi

if [ "$EXIT_STATUS" -eq 0 ]; then
	echo "..passed"
else
	echo "..failed"
	echo $ffout;
fi

# Run the tests in our PhantomJS
command -v phantomjs >/dev/null 2>&1 || { echo >&2 "PhantomJS not installed. Skipping PhantomJS tests."; exit 1; }
echo -n "Running tests in PhantomJS..."
pout="`../../bin/hardy --browser=phantomjs .`"

needle='# Scenario: Missing page'
if [[ "$pout" != *"$needle"* ]]; then
	EXIT_STATUS=1;
fi
needle='# Scenario: Missing element'
if [[ "$pout" != *"$needle"* ]]; then
	EXIT_STATUS=1;
fi
needle='# Scenario: Failing comparison'
if [[ "$pout" != *"$needle"* ]]; then
	EXIT_STATUS=1;
fi
needle='8 scenarios (3 failed, 5 passed)'
if [[ "$pout" != *"$needle"* ]]; then
	EXIT_STATUS=1;
fi

if [ "$EXIT_STATUS" -eq 0 ]; then
	echo "passed"
else
	echo "failed"
	echo $pout;
fi
exit $EXIT_STATUS