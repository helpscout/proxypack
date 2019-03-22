- add a filter to make sure that the request is from the domain that is declared (the target domain of the browser)
- add a how to or other explanation
- add tests
- add logging
- add refresh
- check exit process listeners, make sure they get cleaned up, that no node processes are left hanging
- convert webpack read to cycle?
- make all the returns 203

Maybe?

- add webpack building thing to banner
- add hot module loading?
- add passing of mappings from CLI
- automatic cache invalidation for all mappings (right now you need to have the console open, check if there is a flag I can pass to the browser to auto invalidate the cache)
- server side builds, that serve to proxypack (if proxypack is used more across the orgination this might make sense as sometimes node envs can be finicky)
- make proxypack work with that browser testing program
- check if user has SSL installed
- remote builds
- make mechanism to 404 links like GA and sentry
- run tests in the cloud
