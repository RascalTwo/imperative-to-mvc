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
	updateSSEClients: async (_, __, next) => {
		const posts = await Post.findAll();

		for (const response of clientResponses){
			response.write(`data: ${JSON.stringify(posts)}\n\n`);
		}

		next();
	}
}
