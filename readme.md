# SecureNote

This is a side project of mine, don't use it in production, it may not be secure.

Try it out here: (SecureNote)[https://securenote.v3x.pw/]

The securenote resources are provided by my own SecureCDN across several servers that are routed based on latency via AWS Route53. All resources are delivered with SSL.

Secure note authorizes via SRP [(Secure Remote Password)](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol) and encrypts all notes before sending them on the server. It will be served over ssl/tls as well, but this way there is no point outside the browser the data can be intercepted or modified.

## Todo:
- wrap up frontend
- look into quick android port
