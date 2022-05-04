/*
The simplest oEmbed provider.
*/

document.querySelectorAll('oembed[url]').forEach( element => {
	const url = element.attributes.url.value;
	let match = null;
	
	if((match = url.match(/^https?:\/\/daavgqhmwmui1\.cloudfront\.net\/(.+)\.(mp4|webm|ogg|avi|wmv|mpg|mpeg)/)) !== null) {
		let mimeType = `video/${match[match.length-1]}`;
		element.outerHTML =
			`<video width="100%" poster="${url}.png" controls>`+
			`	<source src="${url}" type="${mimeType}">`+
			`	Your browser does not support html5 videos!.`+
			`</video>`;
	} else if((match = url.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/)) !== null) {
		let youtubeVideoId = match[1];

		element.outerHTML =
			`<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeVideoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>` +
			`</iframe>`;
	}
});