/* require XLSX */
var XLSX = require('xlsx');
var fs = require("fs");
var path = require("path");

/**
 * 将数据转换为xlsx格式文件
 */
exports.dataToXlsx = function (data, ws_name, filePath, cb) {
    var ext = path.extname(filePath);
    if (ext == '.xlsx') {
        var wb = new Workbook();
        var ws = sheet_from_array_of_arrays(data);
        /* add worksheet to workbook */
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;
        /* write file */
        XLSX.writeFile(wb, filePath);
        cb(null);   //成功
    }else{
        cb(1);    //文件类型错误
    }
}
/**
 *通过文件路径、对象名称数组将xml封装为所需对象
 * @param filePath
 * @param titles
 */
exports.fromXlsxToObjs = function (filePath,cb) {
    xlsxToData(filePath, function (err, workbook) {
        if (err) {
            console.log(err == -1 ? '文件不存在' : '文件类型错误');
            cb(err == -1 ? '文件不存在' : '文件类型错误');
        } else {
            var result = {};
            workbook.SheetNames.forEach(function(sheetName) {
                var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if(roa.length > 0){
                    result[sheetName] = roa;
                }
            });
            cb(null,result);
        }
    });
}
/**
 * 工作簿对象
 * @returns {Workbook}
 * @constructor
 */
function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}
/**
 * 将xlsx转换为数据
 */
function  xlsxToData(filePath, cb) {
    //判断文件路径是否为合法的xlsx文件
    //判断文件是否存在
    //解析文件
    var ext = path.extname(filePath);
    if (ext == '.xlsx') {
        fs.exists(filePath, function (exist) {
            if (exist) {
                var workbook = XLSX.readFile(filePath);  //同步方法
                cb(null, workbook);
            } else {
                cb(-1);
            }
        });
    } else {
        cb(1);       //文件扩展名必须为xlsx
    }
}

function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0 }};
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C] };
            if (cell.v == null) continue;

            var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

            if (typeof cell.v === 'number') cell.t = 'n';

            else if (typeof cell.v === 'boolean') cell.t = 'b';

            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';
            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

