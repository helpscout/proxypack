TODOS:

- add a filter to make sure that the request is from the domain that is declared (the target domain of the browser passed by either webpack or CLI)
- add a how to or other explanation
- add tests
- add logging
- check exit process listeners, make sure they get cleaned up, that no node processes are left hanging
- investigate if external mappings can use cycle instead of read
- make all the returns 203

TRIAGE:

- add refresh
- add webpack building thing to banner
- add hot module loading
- add passing of mappings from CLI
- automatic cache invalidation for all mappings (right now you need to have the console open, check if there is a flag I can pass to the browser to auto invalidate the cache)
- remote builds, that serve to proxypack (if proxypack is used more across the orgination this might make sense as sometimes node envs can be finicky)
- make proxypack work with that browser browserstack proxy
- check if user has SSL installed
- make mechanism to 404 links like GA and sentry
- remote testing for jest (ie if your tests take too long to run)
