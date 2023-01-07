# seattle-apartment-hunting
A quick & dirty script that I wrote to help me find cheap desirable apartments, as part of my move to Seattle.

This script automatically runs every hour for a single complex, and automatically notifies me of any units that have been taken off the market,
as well as any brought onto the market.

## Why?
Seattle is a notoriously hot real-estate market, and tenants only have to give 20 days notice to terminate their lease. As such,
you have to be *incredibly* proactive to land anything more than a 600 sqft shoebox for 2500/mo. This is just my way of being proactive :-)

## Usage
1. `cp src/constants.example.ts src/constants.ts`
2. Fill out src/constants.ts with a Discord webhook link & the sightmaps endpoint of your complex
3. `npm i`
4. `npm run build`
5. `npm run start`
6. ???
7. Land an amazing apartment
