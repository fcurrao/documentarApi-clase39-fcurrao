 ;

import { Router } from "express";
import { ErrorEnum } from "../services/enum/error.enum.js";
import { generateErrorInfo } from "../services/info.js";
import CustomError from "../services/Error/CustomError.class.js";

const users = [];
const router = Router();
router.get("/", (req, res) => {
  res.send({
    status: "success",
    payload: users,
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  if (isNaN(id)){
    CustomError.createError({
        name: 'id is not a number',
        cause: `the given id ${id} is not a number`,
        message: 'cannot get users',
        code: ErrorEnum.PARAM_ERROR
    })
  }
    res.send({
      status: "success",
      payload: users,
    });
});

router.post("/", (req, res) => {
  const { firstName, lastName, age, email } = req.body;
  if (!firstName || !lastName || !email) {
    CustomError.createError({
      name: "user creation error",
      cause: generateErrorInfo({
        firstName,
        lastName,
        email,
      }),
      message: "error trying to create user",
      code: ErrorEnum.INVALID_TYPES_ERROR,
    });
  }
  const user = {
    firstName,
    lastName,
    email,
    age,
  };
  if (users.length === 0) {
    user.id = 1;
  } else {
    user.id = users[users.length - 1].id + 1;
  }
  users.push(user);
  res.send({ status: "success", payload: user });
});

export default router;