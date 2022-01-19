//GATSBY_PROTOCOL and GATSBY_BASE_URL are available here because environment variables starting with GATSBY_ are injected into the window

let baseUrl = `${process.env.GATSBY_PROTOCOL}${process.env.GATSBY_BASE_URL}`;

export default baseUrl;