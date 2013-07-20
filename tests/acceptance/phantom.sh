#!/bin/bash
EXIT_STATUS=0;

# Run the tests in PhantomJS
command -v phantomjs
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
fi
exit $EXIT_STATUS