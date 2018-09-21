import { Request, Response, Application } from "express";
import MeatVendorList from "../services/MeatVendorList";
import { Farmer } from "../services/MeatVendorList";


export default class BusinessController {

    nodeApp : Application
    meatVendors : MeatVendorList
    constructor(app : Application, meatVendors : MeatVendorList) {    
        this.nodeApp = app
        this.meatVendors = meatVendors
    }

    registerEndpoints() {
        let app = this.nodeApp

        // TODO: replace to put. being lazy testing from browser.
        // app.get('/save/butchers', (request: Request, response: Response)=>{
        //     this.meatVendors.saveVendorList();
        //     response.send({"status": "much success"})
        // });

        app.get('/butchers', (request: Request, response: Response)=>{
            response.send({"status" : this.meatVendors.getFarmers()})                       
        })
        app.get('/butcher/:name', (request: Request, response: Response)=>{
             
            let farmer = this.meatVendors.getSingleFarmer(request.params.name)
            if (farmer != null) {
                response.send(farmer)

            } else {
                response.status(404).send({"response" :"no farmer found"})
            }
        })

        app.put('/butcher', (request: Request, response: Response )=> {        
            response.status(201).send()
        })        
        app.delete('/butcher/name/:name', (request: Request, response: Response) => {
            if (this.meatVendors.deleteFarmer(request.params.name)) {
                response.status(202).send({"response": "deleted"})
            }
            else {
                response.status(404).send({"response": "record not found"})
            }            
        })
        app.post('/butcher/name/:name', (request: Request, response: Response)=> {            
            if (this.meatVendors.updateFarmer(request.params.name, request.body))  {
                response.status(200)                
            }
            else {
                response.status(404)
            }
        })
                
    }
}