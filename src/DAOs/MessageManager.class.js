
import mongoose from 'mongoose' 
import { messagesModel } from './models/messages.model'; 
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

export default class MessageManager {
  connection = mongoose.connect(
    process.env.MONGO_CONNECTION,
    )
  


  async addChat(chat) {
    let result = await messagesModel.create(chat) 
    return result;
   }


}