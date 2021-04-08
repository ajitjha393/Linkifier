const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const yup = require('yup');
const { nanoid } = require('nanoid');
const monk = require('monk').default;

require('dotenv').config();

const db = monk(process.env.MONGO_URI);
const urls = db.get('urls');
urls.createIndex({ slug: 1 }, { unique: true });

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
		} else {
			const existing = await urls.findOne({ slug });
			if (existing) {
				throw new Error('Slug In use. 🍔');
			}
		}

		slug = slug.toLowerCase();

		const newUrl = {
			slug,
			url,
		};

		const created = await urls.insert(newUrl);

		return res.json(created);
	} catch (err) {
		next(err);
	}
});

app.get('/:id', async (req, res) => {
	const { id: slug } = req.params;

	try {
		const url = await urls.findOne({ slug });
		if (url) {
			return res.redirect(url.url);
		}

		return res.redirect(`/?error=${slug} not found`);
	} catch (err) {
		return res.redirect(`/?error=Link not found`);
	}
});

// app.get('/url/:id', (req, res) => {
// 	// TODO: get short url from id
// });

const port = process.env.PORT || 1337;

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
