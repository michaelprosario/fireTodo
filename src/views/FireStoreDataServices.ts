import db from './FirebaseConfig';

export class FireStoreDataServices {

    addRecord(recordObject: any, tableName: string) {
        return new Promise(function (resolve, reject) {            
            db.collection(tableName).add(recordObject).then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                resolve(docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                reject(error);
            });
        });
    }

    updateRecord(recordObject: any, tableName: string) {
        return new Promise(function (resolve, reject) {
            console.log("record to be saved");
            db.collection(tableName).doc(recordObject.id).set(recordObject).then(function (docRef) {
                resolve(recordObject);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                reject(error);
            });
        });
    }

    getRecord(recordID: string, tableName: string, docToRecordMap) {
        return new Promise(function (resolve, reject) {

            db.collection(tableName).doc(recordID).get().then(function (doc) {
                if (doc.exists) {
                    resolve(docToRecordMap(doc));
                } else {
                    reject("Record not found");
                }
            }).catch(function (error) {
                reject(error);
            });

        });
    }

    deleteRecord(recordID: string, tableName: string) {
        return new Promise(function (resolve, reject) {

            db.collection(tableName).doc(recordID).delete().then(function (doc) {
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    getAll(tableName: string, docToRecordMap) {
        return new Promise(function (resolve, reject) {

            var records = [];
            db.collection(tableName)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        records.push(docToRecordMap(doc));
                    });

                    resolve(records);
                });
        });
    }
}

export class TodoRecord{
    id: string = '';
    action: string = '';
    priority: string = '';
    complexity: string = '';
}

export function DocToTodoRecordMap(doc) : TodoRecord {
    var rowData = doc.data();
    var record = {
        id: doc.id,
        action: rowData.action,
        priority: rowData.priority,
        complexity: rowData.complexity
    };
    
    return record;
}

export class TodoDataServices{

    dataServices: FireStoreDataServices;
    constructor(){
        this.dataServices = new FireStoreDataServices();
    }

    Add(todo: TodoRecord){
        var data = JSON.parse(JSON.stringify(todo));  // not sure why this hack is needed
        return this.dataServices.addRecord(data, "tasks");
    }

    Delete(recordId: string){
        return this.dataServices.deleteRecord(recordId, "tasks");
    }

    GetAll(){
        return this.dataServices.getAll("tasks", DocToTodoRecordMap);
    }
}