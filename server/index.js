const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(morgan('tiny')); // logger
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	return res.json({
		message: 'Linkifier - Short Urls for your Hosted Projects',
	});
});

const port = process.env.port || 1337;

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
