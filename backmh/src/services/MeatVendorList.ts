

import parse from 'csv-parse'
import fs from 'fs'
import { Pool, Client } from 'pg'

export interface Farmer {
    id: string,
    name: string,
    notes: string,
    produce: string,
    region: string,
    where: string,    
}

export default class MeatVendorList {
    
    farmers : Farmer[]
    client :  Client
    constructor() {
        this.farmers = []
        this.client = new Client()
    }

    getFarmers() : Farmer[] {
        return this.farmers
    }
    
    // TODO: fix the problems with looping throughFarmers
    getSingleFarmer(name: String) : Farmer | null {
        for (let i=0; i < this.farmers.length; ++i) {
            if (this.farmers[i].name == name) {
                return this.farmers[i];
            }
        }
        return null
    }

    deleteFarmer(name: String) : boolean {
        for (let i=0; i < this.farmers.length; ++i) {
            if (this.farmers[i].name == name) {
                this.farmers.splice(i, 1);
                return true;
            }
        }
        return false
    }

    updateFarmer(name : String, farmerData : any) : boolean {
        for (let farmerItem of this.farmers) {
            if (farmerItem.name == farmerData.farmer) {
                farmerItem.notes = farmerData.notes;
                farmerItem.produce = farmerData.produce;
                farmerItem.region = farmerData.region;
                farmerItem.where = farmerData.where;
                return true;
            }
        }
        return false;
    }

    async saveVendorList  () {    
        await this.client.connect()
        await this.client.query('truncate farmer')
        for (let farmer of this.farmers) {
            const line1  =  'INSERT INTO farmer(name, region, produce, location, notes) '
            const line2 =   'Values($1, $2, $3, $4, $5)'
            let values = [farmer.name, farmer.region, farmer.produce, farmer.where, farmer.notes] 
            try {
                const result = await this.client.query(line1 + line2, values)
                console.log(result.rows[0])
            } catch (err) {
                console.log(err)
            }
        }        
    }

    async loadMeatVendorsFromDatabase() {

        await this.client.connect()

        try {
            const result = await this.client.query('select * from farmer')
            this.farmers = []
            for (let singleRow of result.rows) {
                var farmerObject: Farmer = {
                    id : singleRow.id,
                    name: singleRow.name,
                    region: singleRow.region,
                    produce: singleRow.produce,
                    where: singleRow.location,
                    notes: singleRow.notes,                                
                }
                this.farmers.push(farmerObject)
            }
        }
        catch (err) {
            console.log(`loading ${err}`)
        }
    }

    loadMeatVendorsFromCsv() {
        let file_contents = fs.readFileSync('./data/Meat Market - Sheet1.csv')            
        let str_content = file_contents.toString()
        let parent = this;
        parent.farmers = []
        parse(str_content, {columns: true }, function(error, data) { 
            for (let item of data) {
                var farmerObject: Farmer = {
                    id : "csv-loaded",
                    name: item.Farmer,                    
                    produce: item.Produce,
                    region: item.Region,
                    where: item.Where,
                    notes: item.Notes
                };
                parent.farmers.push(farmerObject)
            }                                           
        })
    }

}