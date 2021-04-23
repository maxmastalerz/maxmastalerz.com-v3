let baseUrl = process.env.NODE_ENV === "production" 
? 'https://maxmastalerz.com'
: 'http://dev.maxmastalerz.com';

if(process.env.GATSBY_PORT !== "80") {
	baseUrl += `:${process.env.GATSBY_PORT}`;
}

export default baseUrl;