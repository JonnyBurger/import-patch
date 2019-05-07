#!/usr/bin/env node
const got = require('got');
const path = require('path');
const fs = require('fs');

const start = async () => {
	const package = process.argv[2];
	const packageJson = require(path.join(
		process.cwd(),
		'node_modules',
		package,
		'package.json'
	));
	const version = packageJson.version;
	console.log(`Patching version ${version} of ${package}`);

	const pr = process.argv[3];
	const patch = await got(`${pr}.patch`);

	if (!fs.existsSync(path.join(process.cwd(), 'patches'))) {
		fs.mkdirSync(path.join(process.cwd(), 'patches'));
	}
	fs.writeFileSync(
		path.join(process.cwd(), 'patches', `${package}+${version}.patch`),
		patch.body
	);
};

start()
	.then(() => {
		console.log('Done');
		process.exit(0);
	})
	.catch(err => {
		console.log(err);
		process.exit(1);
	});
