let baseUrl = process.env.NODE_ENV === "production" 
? `https://${process.env.GATSBY_BASE_URL}`
: `http://${process.env.GATSBY_BASE_URL}`;

export default baseUrl;