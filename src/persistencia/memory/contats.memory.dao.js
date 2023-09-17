export class ContactsMemoryDao {
    constructor(){
        this.contacts = []
    }
    
    async get() {
        return this.contacts
      }
    
    async create(name, phone) {
        return this.contacts.push({name, phone})
    }

}