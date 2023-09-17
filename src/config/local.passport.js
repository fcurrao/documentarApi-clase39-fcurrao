// import passport from "passport"; 
// import local from "passport-local";
// import userModel from "../DAOs/models/users.model.js";
// import { createHash } from "../utils.js";
// import { isValidPassword } from "../utils.js";
// import config from './config.js';

// const LocalStrategy = local.Strategy;
// export const initializePassportLocal = () => {
//   passport.use(
//     "register",
//     new LocalStrategy(
//       { passReqToCallback: true, usernameField: "email" },
//       async (req, username, password, done) => {
//         const { first_name, last_name, age, email } = req.body;
//         try {
//           let user = await userModel.findOne({ email: username });
//           if (user) {
//             console.log("user already exist");
//             return done(null, false);
//           }

//           const newUser = {
//             first_name,
//             last_name,
//             age,
//             email,
//             password: createHash(password),
//           };
//           const result = await userModel.create(newUser);
//           return done(null, result);
//         } catch (error) {
//           return done("error al registrar usuario");
//         }
//       }
//     )
//   );

//   passport.use('login' ,  new LocalStrategy({ usernameField: "email" },
//   async ( username, password, done) => {
//     try {
//         let user = await userModel.findOne({ email: username });
//         if (!user) {
//           console.log("user no exist");
//           return done(null, false);
//         }

//         if (!isValidPassword(password, user )  ) {
//             return done('Invalid password', null)
//         }
//         return done(null , user)
        
    
//     } catch (error) {
//       return done("error al logear usuario");
//     }
//   }
// )
// );






// };
