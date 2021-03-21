const ExcelJS = require('exceljs');
const fs = require('fs');

class ExcelOutput {
    workbook;
    sheets = [];
    filePath;
    constructor(filePath) {
        this.setOutputFilePath(filePath);
        this.init();
    }

    setOutputFilePath(filePath) {
        if (!filePath) {
            this.filePath = `./output/${this.getTimeStamp()}.xlsx`;
        } else {
            this.filePath = filePath;
        }
    }

    getTimeStamp() {
        const date = new Date();

        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    }

    init() {
        const workbook = this.createWorkbook();
        this.addSheet(workbook);
    }

    createWorkbook() {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Me';
        workbook.lastModifiedBy = 'Me';
        workbook.created = new Date();
        workbook.modified = new Date();
        this.workbook = workbook;
        return workbook;
    }

    addSheet(workbook) {
        const sheet = workbook.addWorksheet('Data');
        sheet.columns = [
            { header: 'Source', key: 'source', width: 20 },
            { header: 'Name', key: 'name', width: 50 },
            { header: 'Price', key: 'price', width: 10 },
            { header: 'Link', key: 'link', width: 32 },
            { header: 'Image', key: 'image', width: 32 },
        ];
        this.sheets.push(sheet);
    }

    addToResult(data) {
        for (const item of data) {
            this.addRow(item, 0);
        }
    }

    addRow(data, sheetIndex) {
        const sheet = sheetIndex ? this.sheets[sheetIndex] : this.sheets[0];

        sheet.addRow(data);
    }

    async save() {
        const folderSegments = this.filePath.split('/');
        const folder = folderSegments.slice(0, folderSegments.length - 1).join('/');
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        await this.workbook.xlsx.writeFile(this.filePath);
    }
}

module.exports = ExcelOutput;