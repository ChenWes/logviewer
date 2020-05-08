const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client')
const { url, token, org, bucket } = require('./env')
const { hostname } = require('os')

// console.log('*** WRITE POINTS ***')
const writeApi = new InfluxDB({ url, token }).getWriteApi(org, bucket)
// setup default tags for all writes through this API
writeApi.useDefaultTags({ location: hostname() })

const point1 = new Point('temperature')
    .tag('example', 'write.ts')
    .floatField('value', 20 + Math.round(100 * Math.random()) / 10)    
writeApi.writePoint(point1)
console.log(` ${point1}`)


// const point2 = new Point('temperature')
//     .tag('example', 'write.ts')
//     .floatField('value', 10 + Math.round(100 * Math.random()) / 10)
// writeApi.writePoint(point2)
// console.log(` ${point2}`)

const sendDataToDB = (data) => {
    return new Promise((resolve, reject) => {
        const point1 = new Point('Error')
            .tag('example', 'write.ts')
            .floatField('value', 20 + Math.round(100 * Math.random()) / 10)
        writeApi.writePoint(point1)

        return resolve(true);
    })
}

export {
    sendDataToDB
}