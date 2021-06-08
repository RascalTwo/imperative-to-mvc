const ejs = require('ejs');
const path = require('path');

const { Post } = require("../model")


const clientResponses = [];

module.exports = {
	addSSEClient: (req, res) => {
		res.status(200).set({
			'Content-Type': 'text/event-stream',
			'Connection': 'keep-alive',
			'Cache-Control': 'no-cache'
		});

		res.write(`:\n\n`);

		clientResponses.push(res);
		req.on('close', () =>
			clientResponses.splice(clientResponses.findIndex(res => res.connection.destroyed))
		);
	},
	updateSSEClients: async (req, _, next) => {
		const posts = await Post.findAll();

		for (const response of clientResponses){
			ejs.renderFile(path.join(response.app.get('views'), 'post-list.ejs'), { posts })
				.then(html => {
					html
						.trim().split('\n').filter(Boolean)
						.forEach(line => response.write(`data: ${line}\n`));
					response.write('\n');
				})
		}

		next();
	}
}
