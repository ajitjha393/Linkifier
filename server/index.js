const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const yup = require('yup');
const { nanoid } = require('nanoid');

const app = express();

app.use(helmet());
app.use(morgan('tiny')); // logger
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

// Error Handler
app.use((error, req, res, next) => {
	if (error.status) {
		res.status(error.status);
	} else {
		res.status(error.status(500));
	}

	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
	});
});

const schema = yup.object().shape({
	slug: yup
		.string()
		.trim()
		.matches(/[\w\-]/i),

	url: yup.string().trim().url().required(),
});

app.post('/url', async (req, res, next) => {
	let { slug, url } = req.body;
	try {
		await schema.validate({
			slug,
			url,
		});

		if (!slug) {
			slug = nanoid(6);
		}

		slug = slug.toLowerCase();

		return res.json({
			url,
			slug,
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
});

// app.get('/url/:id', (req, res) => {
// 	// TODO: get short url from id
// });

// app.get('/:id', (req, res) => {
// 	// TODO: redirect to URL

// 	return res.json({
// 		message: 'Linkifier.sh - Short Urls for your Hosted Projects',
// 	});
// });

const port = process.env.PORT || 1337;

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
