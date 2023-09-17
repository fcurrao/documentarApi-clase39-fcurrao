import passport from "passport";
import githubStrategy from "passport-github2";
// import userModel from "../daos/mongodb/models/Users.model.js";
import userModel from "../DAOs/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import local from "passport-local";
// import CartManager from "../daos/mongodb/classes/cartManager.class.js";
import CartManager from "../DAOs/CartManagerMongo.class.js";
import config from "./config.js";
import { v4 as uuidv4 } from 'uuid'; 

const cartManager = new CartManager();
const LocalStrategy = local.Strategy;
const githubClientId = config.githubClientId;

export const initializePassport = () => {
    passport.use('github', new githubStrategy({
        clientID: config.githubClientId,
        clientSecret: config.githubSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        let user = await userModel.findOne({ email: profile.profileUrl });
        if (!user) {
            let newUser = {
            email: profile.profileUrl ,
            age: profile.age ? profile.age : 0,
            role: "user",
            password: "",
            idCart: await cartManager.createCart()
            };
            console.log(profile._json);
            const result = await userModel.create(newUser);
            done(null, result);
        } 
        else {
            done(null, user);
        }
    }
))
passport.use('register', new LocalStrategy(
{passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
    
    const {first_name, last_name, email, age} = req.body;
    try{
        let user = await userModel.findOne({ email:username });
        if (user) {
            console.log("User already exists");
            return done (null,false)
        }
        //const newCart = await cartManager.createCart();
        //const newCart2 = newCart.toString();
        //console.log(newCart2)
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "user",
            idCart: await cartManager.createCart()
        }
        const result = await userModel.create(newUser);
        return done(null, result);
    }
    catch (error) {
        return done("Error al obtener el usuario: " + error);
    }
}
))
passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
    try{
        if (username == config.adminEmail && password == config.adminPassword) {
            console.log("Admin found");
            const user = {
                _id: "64cab0b5d25f6b2a687bc567",
                first_name: 'NombreAdmin',
                last_name: 'ApellidoAdmin',
                email: config.adminEmail,
                age: 99,
                role: 'admin',
                idCart: config.adminCart,
                __v: 0
            }
        return done(null, user);
        }
        const user = await userModel.findOne({ email:username });
        if (!user) {
            console.log("User not found");
            return done (null,false)
        }
        if (!isValidPassword(user, password)) {
            console.log("Invalid password");
            return done (null,false)
        }
        console.log("User found: " + user);
        return done(null, user);
    }
    catch (error) {
        return done("Error al obtener el usuario: " + error);
    }
}))
passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user)
})
}


 
// import local from "passport-local";
// import userService from "../model/User.js";
// import { createHash, isValidPassword } from "../utils.js";
// import GithubStrategy from 'passport-github2' 
// import userModel from "../DAOs/models/users.model.js"; 
// import passport from "passport";  
// import { environment } from "../env/environment.js";
  


 
// const cartManager = new CartManager(); 
// const LocalStrategy = local.Strategy;


// export const initializePassport = () => {
//   passport.use('github', new githubStrategy({
//     clientID:'Iv1.7b358415b5d0e860', 
//     clientSecret:'178874e9f61399ecdb0e8606c9b60ed836f3b297',
//       callbackURL: "http://localhost:8080/api/sessions/githubcallback"
//   }, async (accessToken, refreshToken, profile, done) => {
//       let user = await userModel.findOne({ email: profile.profileUrl });
//       if (!user) {
//           let newUser = {
//           email: profile.profileUrl ,
//           age: profile.age ? profile.age : 0,
//           role: "user",
//           password: "",
//           idCart: await cartManager.createCart()
//           };
//           console.log(profile._json);
//           const result = await userModel.create(newUser);
//           done(null, result);
//       } 
//       else {
//           done(null, user);
//       }
//   }

// ))

// }

  
// passport.use('register', new LocalStrategy(
//   {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
      
//       const {first_name, last_name, email, age} = req.body;
//       try{
//           let user = await userModel.findOne({ email:username });
//           if (user) {
//               console.log("User already exists");
//               return done (null,false)
//           }
//           //const newCart = await cartManager.createCart();
//           //const newCart2 = newCart.toString();
//           //console.log(newCart2)
//           const newUser = {
//               first_name,
//               last_name,
//               email,
//               age,
//               password: createHash(password),
//               role: "user",
//               idCart: await cartManager.createCart()
//           }
//           const result = await userModel.create(newUser);
//           return done(null, result);
//       }
//       catch (error) {
//           return done("Error al obtener el usuario: " + error);
//       }
//   }
//   ))
  
//   passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
//       try{
//           if (username == config.adminEmail && password == config.adminPassword) {
//               console.log("Admin found");
//               const user = {
//                   _id: "64cab0b5d25f6b2a687bc567",
//                   first_name: 'NombreAdmin',
//                   last_name: 'ApellidoAdmin',
//                   email: config.adminEmail,
//                   age: 99,
//                   role: 'admin',
//                   idCart: config.adminCart,
//                   __v: 0
//               }
//           return done(null, user);
//           }
//           const user = await userModel.findOne({ email:username });
//           if (!user) {
//               console.log("User not found");
//               return done (null,false)
//           }
//           if (!isValidPassword(user, password)) {
//               console.log("Invalid password");
//               return done (null,false)
//           }
//           console.log("User found: " + user);
//           return done(null, user);
//       }
//       catch (error) {
//           return done("Error al obtener el usuario: " + error);
//       }
//   }))
 


//   passport.serializeUser((user,done)=>{
//     done(null,user._id)
//   })

//   passport.deserializeUser(async(id,done)=>{
//     let user = await userModel(findById(id))
//     done(null,user)
//   })
  
 