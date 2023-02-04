import app from './src/app.js';
import config from 'config';
import { dbConnect } from './src/utils/db.js';

const PORT = config.get('port');

dbConnect(function (err) {
	if (err) {
		console.error(err);
		process.exit();
	}
});

app.listen(PORT, function () {
	console.log(`A Node Js API is listening on port: ${PORT}`);
});
