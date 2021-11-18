const app = require('./app');

app.listen(process.env.PORT || 4444, () => {
    console.log('hello world!');
    console.log('running app on port 3050');
})