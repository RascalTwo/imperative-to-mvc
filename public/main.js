(() => {
	const source = new EventSource("/posts/stream");

	source.addEventListener('message', e => {
		let html = '';

		for (let post of JSON.parse(e.data)) html += `
			<li class="${post.done ? 'done' : ''}">
				<span>${post.id}</span>
				<span> - ${post.user} </span>
				<span> - ${post.post} </span>
			</li>
		`

		document.querySelector('ul').innerHTML = html;
	});

	window.addEventListener('beforeunload', () => source.close());
})();