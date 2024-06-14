const { LocalStorage } = require('node-localstorage');
const fs = require('fs');

const scratchFolder = './scratch';
if (!fs.existsSync(scratchFolder)) {
  fs.mkdirSync(scratchFolder);
}

const localStorage = new LocalStorage(scratchFolder);

class RecordWorker {
    constructor() {
        this.records = this.loadRecords();
    }

    loadRecords() {
        const recordsFromStorage = localStorage.getItem("records");
        return recordsFromStorage ? JSON.parse(recordsFromStorage) : [];
    }

    saveRecords() {
        localStorage.setItem('records', JSON.stringify(this.records));
    }

    createRecord(title, description) {
        const record = {
            title, 
            description, 
            timeCreate: new Date().toISOString(),
            timeUpdate: new Date().toISOString(),
            done: false,
        };
        this.records.push(record);
        this.saveRecords();
        return record;
    }

    getRecords() {
        return this.records;
    }

    getRecord(index) {
        return this.records[index];
    }

    updateRecord(index, title, description, done) {
        const record = this.records[index];
        record.title = title;
        record.description = description;
        record.timeUpdate = new Date().toISOString();
        record.done = done;
        this.saveRecords();
        return record;
    }

    deleteRecord(index) {
        this.records.splice(index, 1);
        this.saveRecords();
    }
}

const recordWorker = new RecordWorker();

const record1 = recordWorker.createRecord("Title", "Description");
console.log("Created record: ", record1);

const records = recordWorker.getRecords();
console.log("All records: ", records);

const record = recordWorker.getRecord(0);
console.log("Record: ", record);

const updatedRecord = recordWorker.updateRecord(0, "NewTitle", "NewDescription", true);
console.log("Updated record: ", updatedRecord);

recordWorker.deleteRecord(0);
console.log("All records: ", recordWorker.getRecords());
