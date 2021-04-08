const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(morgan('tiny')); // logger
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.get('/url/:id', (req, res) => {
	// TODO: get short url from id
});

app.get('/:id', (req, res) => {
	// TODO: redirect to URL

	return res.json({
		message: 'Linkifier - Short Urls for your Hosted Projects',
	});
});

app.post('/url', (req, res) => {
	// TODO: create a short URL
});

const port = process.env.port || 1337;

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
