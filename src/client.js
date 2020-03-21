import OSS from 'ali-oss'

const client = new OSS({
    region:'oss-cn-shenzhen',
    accessKeyId:'LTAIu98zxxoi0Gys',
    accessKeySecret:'YyTgYigxUgBOkGYSqUFRMuyvmZhdPY',
    bucket:'zyn2019'
})

export default client