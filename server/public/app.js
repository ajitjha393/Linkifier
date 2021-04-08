const app = new Vue({
	el: '#app',
	data: {
		url: '',
		slug: '',
		created: null,
	},
	methods: {
		async createUrl() {
			console.log(this.url, this.slug);
			const response = await fetch('/url', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					slug: this.slug,
					url: this.url,
				}),
			});

			this.created = await response.json();
		},
	},
});
