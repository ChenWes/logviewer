var Excel = require('exceljs');

exports.genExcel = (data) => {
    return new Promise((resolve, reject) => {
        var workbook = new Excel.Workbook();

        workbook.creator = 'WesChen';
        workbook.lastModifiedBy = 'WesChen';
        workbook.created = new Date();
        workbook.modified = new Date();
        // workbook.lastPrinted = new Date();

        var worksheet = workbook.addWorksheet('Data');

        let latestDateTime;
        data.map((item, key) => {
            let newrow = [];
            newrow[0] = item.dateTime.toString()
            newrow[1] = item.ipaddress ? item.ipaddress.toString() : ''
            newrow[2] = item.errorMessage ? item.errorMessage.toString() : ''

            if (latestDateTime != item.dateTime) {
                worksheet.addRow(newrow);

                latestDateTime = item.dateTime;
            }

        })
        worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });


        workbook.xlsx.writeFile('./data.xlsx').then(() => {
            return resolve(true);
        })
    })
}



