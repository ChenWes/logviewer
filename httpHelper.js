var axios = require('axios');
const fetch = require('node-fetch');
var momenttz = require('moment-timezone')


exports.sendData = (data) => {
    return new Promise((resolve, reject) => {

        // fetch("http://localhost:8086/write?db=mydb", {
        //     method: 'POST',
        //     headers: {
        //         "Content-Type": "text/plain"
        //     },
        //     body: 'error,host=127.0.0.1 value=2',
        //     redirect: 'follow'
        // })
        //     .then(response => resolve(true))
        //     .catch(error => console.log('error', error));

        // console.log('eeee',new Date(1577808000000).toUTCString());
        // 1467085047286
        // 1588947196019000000


        let allFunction = []
        data.map(item => {
            // console.log('eeee',item);
            let ipstring = item.ipaddress[0].indexOf('TCP ') != -1 ? item.ipaddress[0].replace('TCP ', '') : 'NO-IP'
            console.log(item.dateTime[0],new Date(item.dateTime).valueOf())
            let dataString = `error,host=${ipstring} value=1 ${new Date(item.dateTime[0]).valueOf()}000000`;

            allFunction.push(

                fetch("http://localhost:8086/write?db=mydb", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: dataString,
                    redirect: 'follow'
                })

            )
        })
        return resolve(Promise.all(allFunction));

    })
}
