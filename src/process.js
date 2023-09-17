import { Command } from "commander";

const program = new Command()

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port> ', 'modo de trabajo', 'production')
    .option('--mode <mode> ', 'utusario utilizando','No se ha cdeclarado usuario')
    .requiredOption('-u <user> ', 'utusario utilizando','No se ha cdeclarado usuario')
    






program.parse()

//$ node process.js 
console.log('option', program.opts());
// option {
//     d: false,
//     p: 'production',
//     mode: 'No se ha cdeclarado usuario',
//     u: 'No se ha cdeclarado usuario'
//   }
console.log('remaining argunetrs', program.args); // 
// remaining argunetrs []


//  ENTONCES EN CONSOLA: 
// $ node .\process.js -p 3030