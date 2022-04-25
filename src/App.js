import React, { useEffect, useState } from 'react';
import './App.css';
import { idb, AddData, UpdateData, DeleteData } from './utils/idb'
import HTable from './component/HTable';

function App() {

  const [data, setData] = useState([]);
  useEffect(() => {
    idb('ME', 'id,ProjectID, Requestor_Name, description ,reqn', 2, setData)
  }, [])


  return (
    <div className="App">
      <button type='button' >Clear DB</button>
      <HTable AddData={AddData} UpdateData={UpdateData} data={data} DeleteData={DeleteData} db="ME" />
    </div>
  );
}

export default App;


