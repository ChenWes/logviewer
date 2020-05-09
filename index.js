var readline = require('readline');
var fs = require('fs');
var momenttz = require('moment-timezone')
var genExcel = require('./excel');
var sendData = require('./httpHelper');
var sendDataToDB=require('./influxDB')



// const rl = readline.createInterface({
//     input: fs.createReadStream('./Logs_20200430.txt', { encoding: 'utf-8' })
// });

// let MC_dateTime;
// let errorCount = 0;
// rl.on('line', (line) => {
//     //日期正则表达式
//     let dateTimeReg = /\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2},\d{3}/g
//     let errorReg = /can\'t connect TCP\/IP/g
//     let error2Reg = /TCP\s+d{4}.d{4}.d{4}.d{1,2}\s+23/g

//     //正则表达式检测
//     let dateTimeRes = line.match(dateTimeReg);
//     let errorRes = line.match(errorReg)
//     let error2Res = line.match(error2Reg)

//     //处理日期
//     if (dateTimeRes) MC_dateTime = dateTimeRes;

//     //有日期后，遇到错误
//     if (MC_dateTime && (errorRes || error2Res)) console.log(`${errorCount++} => ${MC_dateTime} ${error2Res || errorRes}`)
// });

// rl.on('close', () => {
//     console.log('closed')
// });


const viewChangeName = () => {
    try {
        readLog('./Logs_20200430.txt')
            .then((arr) => {
                return genExcel.genExcel(arr);
            })
            .catch((err) => {
                console.log('err', err);
            })
    } catch (e) {
        console.log('err', e);
    }
}

const viewLog = () => {
    try {
        readLogFolder('./log')
            .then((arr) => {
                let newarr = []
                arr.map(item => {
                    newarr = newarr.concat(item)
                })
                return genExcel.genExcel(newarr);
            })
            .catch((err) => {
                console.log('err', err);
            })
    } catch (e) {
        console.log('err', e);
    }
}

let MC_dateTime;
let MC_IP;
let MC_error;
let errorCount = 0;

const readLogFolder = folderPath => {
    return new Promise((resolve, reject) => {

        let allFunction = [];
        fs.readdirSync(folderPath).forEach(filePath => {
            allFunction.push(readLog(folderPath + '/' + filePath))
        })
        return resolve(Promise.all(allFunction));
    })
}

const readLog = filepath => {
    return new Promise((resolve, reject) => {
        const arr = [];
        let stats = fs.stat(filepath, function (err, stats) {
            if (stats && stats.isFile()) {
                const rl = readline.createInterface({
                    input: fs.createReadStream(filepath)
                });

                rl.on('line', (line) => {
                    //日期正则表达式
                    let dateTimeReg = /\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2}/g
                    let errorReg = /can\'t connect TCP\/IP/g
                    // let error2Reg = /TCP\s+d{1,2,3,4}\.d{1,2,3,4}\.d{1,2,3,4}\.d{1,2}/g
                    let errorIPReg = /TCP\s+\d+\.\d+\.\d+\.\d+/g

                    //正则表达式检测
                    let dateTimeRes = line.match(dateTimeReg);
                    let errorRes = line.match(errorReg)
                    let errorIPRes = line.match(errorIPReg)

                    //处理日期
                    if (dateTimeRes) {
                        //本次日期
                        MC_dateTime = dateTimeRes;
                        MC_IP = '';
                        MC_error = '';
                    }
                    if (errorIPRes) { MC_IP = errorIPRes; }
                    if (errorRes) MC_error = errorRes;

                    //有日期后，遇到错误                                        
                    if (MC_dateTime && (errorRes)) {
                        // console.log(momenttz.tz(MC_dateTime, "Asia/Shanghai").valueOf())
                        console.log(`${errorCount++} => ${MC_dateTime} ${MC_IP || '未知IP'} ${errorRes}`)

                        arr.push({
                            dateTime: MC_dateTime,
                            ipaddress: MC_IP || '未知IP',
                            errorMessage: errorRes
                        });
                    }
                });

                rl.on('close', () => {
                    resolve(arr)
                });

            } else {
                resolve(['The record is empty'])
            }
        });
    })

}

//单个文件
// viewChangeName();
//文件夹
viewLog();