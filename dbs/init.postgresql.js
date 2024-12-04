import db from './db.js'
db.raw('SELECT 1')
    .then(() => console.log('Database connected successfully'))
    .catch(error => console.error('Database connection error:', error));

export default {db}