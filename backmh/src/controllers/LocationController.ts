

import { Router, Request, Response, Application } from 'express';
import MeatVendorList from '../services/MeatVendorList'

export default class LocationController {
    
    nodeApp : Application 
    meatVendor : MeatVendorList
    locations = {
        suburbs : [ {  "postcode" : "3068" ,
            "name":   "Clifton Hill" },
             { "postcode" : "3070" , "name" : "Northcote" }
            ] 
    }

    constructor(app : Application, meatVendor: MeatVendorList) {
        this.nodeApp = app
        this.meatVendor = meatVendor
    }

    registerMeatLocations() {
        this.nodeApp.get('/locations',  (request: Request,  response : Response ) => {
        
            response.status(200).send(this.locations)
        })

        this.nodeApp.get('/locations/:postcode', (request: Request, response: Response) => {
            
            if (request.params.postcode != undefined) {
                for (let entry of this.locations.suburbs) {
                    if (entry.postcode == request.params.postcode) {
                        response.send(entry)
                        return;
                    }
                }    
            }
            response.status(404).send({ error: 'unable to find postcode ' + request.params.postcode })
        })
    }

    helloworld() {
        console.log('helloworld123')
    }
}