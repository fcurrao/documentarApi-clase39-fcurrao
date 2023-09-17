import { contactModel } from "./models/contacts.model.js";

export class ContactMongoDAO {
  constructor() {}

  async get() {
    return await contactModel.find();
  }

  async create(name, phone) {
    return await contactModel.create({ name, phone });
  }
}
