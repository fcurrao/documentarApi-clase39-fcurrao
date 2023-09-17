
import mongoose from 'mongoose'
import { productsModel } from './models/products.model.js' 
import dotenv from 'dotenv'

import { Command } from 'commander'


const program = new Command()
program.option('--mode <mode>', 'modo/entorno de trabajo', 'dev' )
program.parse()
const mode = program.opts().mode

// dotenv.config()
dotenv.config({
  path: mode == 'dev' ? './.env.development' : './.env.production'
})
export default class ProductManager {
  connection = mongoose.connect( process.env.MONGO_CONNECTION,
    )
  



  async addProduct(product) {
   let result = await productsModel.create(product) 
   return result;
  }

  async getAllProducts() {
    let result = await productsModel.find()
    return result
  }
 
  async getProducts(limit = 5, page=1,sort=0,filtro=null,filtroVal=null) {
    let whereOptions = {}
    if(filtro != "" && filtroVal!= "" ){
      whereOptions =  {[filtro]:filtroVal}
    }
    let result = await productsModel.paginate(
      whereOptions,{limit:limit, page:page,sort:{price: sort}}
      )
    return result
  }

  async getProductById(id) {
    let result = await productsModel.findOne({_id: id})
    return result

  }

  async updateProduct(id, updatedProduct) {
    let result = await productsModel.updateOne({_id: id}, {$set: updatedProduct})
    return result;

  }

  async deleteProduct(id) {
    let result = await productsModel.deleteOne({_id: id})
    return result
  }


  
}