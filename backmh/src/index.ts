import express from 'express';

import MeatVendorList from './services/MeatVendorList';
import LocationController from './controllers/LocationController';
import BusinessController from './controllers/BusinessController';

const app: express.Application = express()

const port = process.env.MEAT_PORT || 3010

app.listen(port, (err: any) => {
  if (err) {
    return console.log(err)
  }

  let meatVendorLoader = new MeatVendorList()
  meatVendorLoader.loadMeatVendorsFromDatabase()

  let locations = new LocationController(app, meatVendorLoader)
  let butchers =  new BusinessController(app, meatVendorLoader)
  locations.registerMeatLocations()
  butchers.registerEndpoints()

  console.log(`Host name is: ${process.env.PGHOST}`)

  return console.log(`server is listening on ${port}`)
})