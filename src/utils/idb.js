import * as alasql from 'alasql';


export const idb = (IDDBName, IDBColumnNames, IdbVersion, setData) => {
    var IDBColumnNames1 = IDBColumnNames.split(',');
    if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    }
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    var DBOpenRequest = window.indexedDB.open(IDDBName, IdbVersion);
    // these two event handlers act on the database being opened successfully, or not
    DBOpenRequest.onerror = function (event) {
        console.log('db cannot be created');

    };

    DBOpenRequest.onsuccess = function (event) {
        console.log('db  created successfully');
        var db = DBOpenRequest.result;
        ViewData(IDDBName, `select ${IDBColumnNames} from ?`, setData)

    };

    DBOpenRequest.onupgradeneeded = function (event) {
        var db = event.target.result;
        console.log(event)
        db.onerror = function (event) {

            alert('error');
        };

        db.onsuccess = function (event) {
            //console.log('updated');

        }

        // Create an objectStore for this database
        if (event.oldVersion < 1) {
            var objectStore = db.createObjectStore(IDDBName, { keyPath: "id", autoIncrement: true });
            for (let i = 0; i < IDBColumnNames1.length; i++) {
                objectStore.createIndex(IDBColumnNames1[i].trim(), IDBColumnNames1[i].trim(), { unique: false });
            }

        } else if (event.oldVersion < IdbVersion) {
            db.deleteObjectStore(IDDBName);
            var objectStore = db.createObjectStore(IDDBName, { keyPath: "id", autoIncrement: true });
            for (let i = 0; i < IDBColumnNames1.length; i++) {
                objectStore.createIndex(IDBColumnNames1[i].trim(), IDBColumnNames1[i].trim(), { unique: false });
            }

        }

    };
}


export const AddData = (data, row, ColumHeader, idb, setId, setRows) => {
    const Output = ObjectBuilder(data, ColumHeader);
    // console.log(Output)

    var DBOpenRequest = window.indexedDB.open(idb, 2);

    DBOpenRequest.onsuccess = function (event) {
        var db = DBOpenRequest.result;

        var transaction = db.transaction(idb, "readwrite");
        // report on the success of the transaction completing, when everything is done
        transaction.oncomplete = function () {
        };
        transaction.onerror = function () {
            alert('error in transaction');
        };
        // call an object store that's already been added to the database
        var objectStore = transaction.objectStore(idb);
        var objectStoreRequest = objectStore.add(Output);
        objectStoreRequest.onsuccess = function (event) {
            console.log('success');
            setRows(row)
            setId(event.target.result);

        };

    };

}


export const UpdateData = (idb, newData, id, column) => {
    var DBOpenRequest = window.indexedDB.open(idb, 2);
    DBOpenRequest.onsuccess = function (event) {
        var db = DBOpenRequest.result;
        var transaction = db.transaction(idb, "readwrite");
        var objectStore = transaction.objectStore(idb);
        var objectStoreRequest = objectStore.get(id);
        objectStoreRequest.onsuccess = function (event) {
            var data = objectStoreRequest.result;
            if (newData != null || newData != undefined) {


                data[column] = newData;
                // data["Track"] = LastCol;

            } else if (newData == null || newData != undefined) {
                data[column] = newData;
                // data["Track"] = LastCol;
            }

            var update = objectStore.put(data);
            update.onsuccess = function () {
                console.log('updated');
            }
        };
    };
}


export const ViewData = (idb, HtSql, setData) => {
    // console.log(HTAlsqlCol);
    var Query = `SELECT * FROM  ${idb}`;
    alasql.promise('CREATE INDEXEDDB DATABASE IF NOT EXISTS ' + idb + ' ;')
        .then(function () { return alasql.promise('ATTACH INDEXEDDB DATABASE ' + idb + ' ;'); })
        .then(function () { return alasql.promise('USE ' + idb + ' ;'); })
        .then(function () { return alasql.promise(Query); })
        .then(function (res) {
            var a = res;
            var SqlStr1 = HtSql
            var DataForGraph = alasql(SqlStr1, [a]);
            setData(DataForGraph);
        })
}

export const DeleteData = (idb, id) => {
    var DBOpenRequest = window.indexedDB.open(idb, 2);
    DBOpenRequest.onsuccess = function (event) {
        var db = DBOpenRequest.result;
        var transaction = db.transaction(idb, "readwrite");
        var store = transaction.objectStore(idb);
        var request = store.delete(id);
        request.onsuccess = function () {
            console.log(`deleted ${id}`);
        }
    }
}


function ObjectBuilder(data, Key) {
    var FinalData = {};
    data.splice(0, 1);
    Key.splice(0, 1);
    var HeadKey = String(Key);
    var str_array = HeadKey.split(',');
    var KeyHeader;
    var Valuedata;
    var LengthFactor = str_array.length;
    for (var i = 0; i <= LengthFactor; i++) {
        KeyHeader = str_array[i];
        if (data[i] != null || data[i] != undefined) {
            Valuedata = data[i].replace(/[&\\\#,+()$~%'":*?<>{}]/g, "");
        } else {
            Valuedata = data[i];
        }

        FinalData[KeyHeader] = Valuedata;

    }

    //alert(JSON.stringify (FinalData));
    return FinalData;

};