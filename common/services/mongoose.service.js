const mongoose = require('mongoose');
let count = 0;

const options = {
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    // all other approaches are now deprecated by MongoDB:
    useNewUrlParser: true,
    useUnifiedTopology: true

};
const connectWithRetry = () => {
    let url = "mongodb://localhost:27017/rest-tutorial"
    if (process.env.TEST) {
        url = "mongodb://localhost:27017/rest-tutorial-test"
    }

    mongoose.connect(url, options).then(()=>{ }).catch(err=>{ setTimeout(connectWithRetry, 5000)})
};

connectWithRetry();

exports.mongoose = mongoose;
