const app = require('./app');

app.listen(process.env.PORT || 4444, () => {
    console.log(`running app on port ${process.env.PORT || 4444}`);
})