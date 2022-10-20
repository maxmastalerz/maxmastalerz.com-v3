//Environment variables starting with GATSBY_* will be injected into the browser as variables.
//The window variable does not work when building a site but just so happens to work on gatsby develop. Don't use it.

//The strapi url should no longer be needed on the frontend. We no longer have strapi running all the time to save money.
//The website can just be hosted on netlify for free. Any api requirements can be moved on to the aws api gateway.
//let strapi 		= `${process.env.GATSBY_PROTOCOL}api.${process.env.GATSBY_BASE_URL}`;
let apiGateway 		= "https://6g1ivp1uuk.execute-api.us-east-2.amazonaws.com/production";
let remark42 		= `${process.env.GATSBY_PROTOCOL}//remark42.${process.env.GATSBY_BASE_URL}`;

let usefulUrls = { apiGateway, remark42 }

export default usefulUrls;