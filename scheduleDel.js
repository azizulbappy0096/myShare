var cron = require('node-cron');
let FileModel = require("./model/fileSchema")
const fs = require("fs")

const delFiles = () => {
    cron.schedule('0 * * * *', async () => {
        console.log('running a task every one hour');
        const pastTime = new Date(Date.now() - 24 * 60 * 60 * 1000)
        try {
            const files = await FileModel.find({ createdAt: { $lt: pastTime } })
            if(files.length > 0) {
                files.map(file => {
                    fs.unlinkSync(file.filePath)
                    file.remove()
                })
                console.log("Job done!")
            }
        }catch(err) {
            console.log("Error while file deleting: " + err)
        }
    });
}

module.exports = delFiles