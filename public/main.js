(() => {
	const source = new EventSource("/posts/stream");

	source.addEventListener('message', e => {
		document.querySelector('ul').outerHTML = e.data;
	});

	window.addEventListener('beforeunload', () => source.close());
})();