// Helper function for async fetches
global.waitForFetches = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, 50);
	});
};
