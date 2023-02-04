import app from './src/app.js';
import config from 'config';
import { dbConnect } from './src/utils/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = config.get('port') || process.env.PORT || 80;

if (process.env.NODE_ENV === 'production') {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	app.use(express.static(path.resolve(__dirname, './public/build')));
}

dbConnect(function (err) {
	if (err) {
		console.error(err);
		process.exit();
	}
});

app.listen(PORT, function () {
	console.log(`A Node Js API is listening on port: ${PORT}`);
});
