import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
// register Handsontable's modules
registerAllModules();



const HTable = ({ AddData, UpdateData, data, DeleteData, db }) => {
  const hotTableComponent = useRef(null);
  const [id, setId] = useState(0);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    if (id > 0) {
      hotTableComponent.current.hotInstance.setDataAtCell(rows, 0, id)
    }
  }, [id, rows])

  const hotSettings = {
    data: data,
    startRows: 1,
    minSpareRows: 1,
    columns: [{ data: 'id', type: 'text', allowInvalid: false, allowEmpty: false, readOnly: true },
    { data: 'ProjectID', type: 'dropdown', source: ['STMS Creation'] },
    { data: 'Requestor_Name', type: 'dropdown', source: ['Submitted to supplier', 'Submitted for approval', 'Others'], allowInvalid: false, allowEmpty: false },
    { data: 'description', type: 'dropdown', source: ['E-mail', 'System', 'Chat'], allowInvalid: false, allowEmpty: false },
    { data: 'reqn', type: 'text', allowInvalid: false }

    ],
    colHeaders: ['id', 'ProjectID', 'Requestor_Name', 'description', 'reqn'],
    colWidths: 200,
    contextMenu: ['remove_row', 'copy'],
    wordWrap: false,
    autoRowSize: true,
    filters: true,
    manualColumnResize: true,
    dropdownMenu: ['alignment', '---------', 'filter_by_condition', 'filter_by_value', 'filter_action_bar'],
    licenseKey: '391a8-62e2b-a78e4-34928-cf54f',
    columnSorting: true,
    beforeRemoveRow: (i, amount, vi) => {
      console.log(vi);
      for (let m = 0; m < vi.length; m++) {
        const id = hotTableComponent.current.hotInstance.getDataAtCell(vi[m], 0)
        DeleteData(db, id)
      }
    },
    afterChange: (changes) => {
      if (changes) {
        changes.forEach(([row, prop, oldValue, newValue]) => {
          const rowData = hotTableComponent.current.hotInstance.getDataAtRow(row)
          var ColumHeader = hotTableComponent.current.hotInstance.getColHeader();
          if (rowData[0] === null) {
            AddData(rowData, row, ColumHeader, db, setId, setRows)
          } else if (prop !== "id") {
            UpdateData(db, newValue, rowData[0], prop)
          }
        });
      }


    }
  };

  return (
    <div id="hot-app">
      <HotTable
        ref={hotTableComponent}
        width="1000"
        height="300"
        settings={hotSettings}
      />
    </div>
  );
}

export default HTable;