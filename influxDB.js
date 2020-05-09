const Influx = require('influx'); //导包

const client = new Influx.InfluxDB({
    database: 'mydb',
    username: '',
    password: '',
    hosts: [{ host: 'localhost' }],
    schema: [
        {
            measurement: 'error', //类似于数据表的概念
            fields: { //数据表的字段，定义类型，FLOAT/INTEGER/STRING/BOOLEAN
                value: Influx.FieldType.INTEGER,
            }, // tag 也是里面的字段，是自带索引光环。查询速度杠杠的。
            tags: ['tag1', 'tag2']
        }
    ]
});

exports.sendDataToDB = (data) => {
    return new Promise((resolve, reject) => {

        let allFunction = []
        data.map(item => {
            // 定义数据库连接和数据格式，创建client
            // 插入数据
            allFunction.push(
                client.writePoints([
                    {
                        measurement: 'error',
                        fields: {
                            value: 1,
                        },
                        tags: {
                            tag1: 14233
                        }
                    }
                ])

            )

        })

        return resolve(Promise.all(allFunction));
    })
}