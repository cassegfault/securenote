# SecureNote

This is a side project of mine, don't use it in production, it may not be secure.

Try it out here: [SecureNote](https://securenote.v3x.pw/)

The securenote resources are provided by my own SecureCDN across several servers that are routed based on latency via AWS Route53. All resources are delivered with SSL.

Secure note authorizes via SRP [(Secure Remote Password)](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol) and encrypts all notes before sending them on the server. It will be served over ssl/tls as well, but this way there is no point outside the browser the data can be intercepted or modified.

The [android app](https://github.com/chris-pauley/securenote-android) is under development as well.

---

**Notes on deployment**

The javascript files are delivered via HTTPS and no secure information is transferred with less than two layers of encryption (primarily AES encrypted data shipped over SSL). There are many [concerns with client-side encryption](https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/august/javascript-cryptography-considered-harmful/) however these concerns are addressed with SSL. This is why the entirety of the securenote service is delivered over ssl, otherwise code could be injected.

For latency purposes, the files are handled by a CDN spread across the USA solely for the purpose of the service.

The next perfomance concern that should be addressed is the introduction of additional app servers and database servers for the API. 
