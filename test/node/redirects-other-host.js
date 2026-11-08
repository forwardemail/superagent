'use strict';
const assert = require('node:assert');
const request = require('../support/client');
const express = require('../support/express');

const app = express();
const app2 = express();
const should = require('should');
let http = require('node:http');

if (process.env.HTTP2_TEST) {
  http = require('node:http2');
}

let base = 'http://localhost';
let server;
before(function listen(done) {
  server = http.createServer(app);
  server = server.listen(0, function listening() {
    base += `:${server.address().port}`;
    done();
  });
});

let base2 = 'http://localhost';
let server2;
before(function listen(done) {
  server2 = http.createServer(app2);
  server2 = server2.listen(0, function listening() {
    base2 += `:${server2.address().port}`;
    done();
  });
});

app.all('/test-301', (request_, res) => {
  res.redirect(301, `${base2}/`);
});
app.all('/test-302', (request_, res) => {
  res.redirect(302, `${base2}/`);
});
app.all('/test-303', (request_, res) => {
  res.redirect(303, `${base2}/`);
});
app.all('/test-307', (request_, res) => {
  res.redirect(307, `${base2}/`);
});
app.all('/test-308', (request_, res) => {
  res.redirect(308, `${base2}/`);
});
app.all('/test-302-credentials', (request_, res) => {
  res.redirect(302, `${base2}/credentials`);
});
app.all('/test-307-credentials', (request_, res) => {
  res.redirect(307, `${base2}/credentials`);
});
app.all('/test-308-credentials', (request_, res) => {
  res.redirect(308, `${base2}/credentials`);
});
app.all('/test-307-same-origin-credentials', (request_, res) => {
  res.redirect(307, `${base}/credentials`);
});

app2.all('/', (request_, res) => {
  res.send(request_.method);
});
app2.all('/credentials', (request_, res) => {
  res.json({
    method: request_.method,
    authorization: request_.headers.authorization,
    cookie: request_.headers.cookie,
    proxyAuthorization: request_.headers['proxy-authorization']
  });
});
app.all('/credentials', (request_, res) => {
  res.json({
    method: request_.method,
    authorization: request_.headers.authorization,
    cookie: request_.headers.cookie,
    proxyAuthorization: request_.headers['proxy-authorization']
  });
});

describe('request.get', () => {
  describe('on 301 redirect', () => {
    it('should follow Location with a GET request', (done) => {
      const request_ = request.get(`${base}/test-301`).redirects(1);
      request_.end((error, res) => {
        const headers = request_.req.getHeaders
          ? request_.req.getHeaders()
          : request_.req._headers;
        headers.host.should.eql(`localhost:${server2.address().port}`);
        res.status.should.eql(200);
        res.text.should.eql('GET');
        done();
      });
    });
  });
  describe('on 302 redirect', () => {
    it('should follow Location with a GET request', (done) => {
      const request_ = request.get(`${base}/test-302`).redirects(1);
      request_.end((error, res) => {
        const headers = request_.req.getHeaders
          ? request_.req.getHeaders()
          : request_.req._headers;
        res.status.should.eql(200);
        res.text.should.eql('GET');
        done();
      });
    });
  });
  describe('on 303 redirect', () => {
    it('should follow Location with a GET request', (done) => {
      const request_ = request.get(`${base}/test-303`).redirects(1);
      request_.end((error, res) => {
        const headers = request_.req.getHeaders
          ? request_.req.getHeaders()
          : request_.req._headers;
        headers.host.should.eql(`localhost:${server2.address().port}`);
        res.status.should.eql(200);
        res.text.should.eql('GET');
        done();
      });
    });
  });
  describe('on 307 redirect', () => {
    it('should follow Location with a GET request', (done) => {
      const request_ = request.get(`${base}/test-307`).redirects(1);
      request_.end((error, res) => {
        const headers = request_.req.getHeaders
          ? request_.req.getHeaders()
          : request_.req._headers;
        headers.host.should.eql(`localhost:${server2.address().port}`);
        res.status.should.eql(200);
        res.text.should.eql('GET');
        done();
      });
    });
  });
  describe('on 308 redirect', () => {
    it('should follow Location with a GET request', (done) => {
      const request_ = request.get(`${base}/test-308`).redirects(1);
      request_.end((error, res) => {
        const headers = request_.req.getHeaders
          ? request_.req.getHeaders()
          : request_.req._headers;
        headers.host.should.eql(`localhost:${server2.address().port}`);
        res.status.should.eql(200);
        res.text.should.eql('GET');
        done();
      });
    });
  });
});

describe('request.post', () => {
  describe('on 301 redirect', () => {
    it('should follow Location with a GET request', (done) => {
      const request_ = request.post(`${base}/test-301`).redirects(1);
      request_.end((error, res) => {
        const headers = request_.req.getHeaders
          ? request_.req.getHeaders()
          : request_.req._headers;
        headers.host.should.eql(`localhost:${server2.address().port}`);
        res.status.should.eql(200);
        res.text.should.eql('GET');
        done();
      });
    });
  });
  describe('on 302 redirect', () => {
    it('should follow Location with a GET request', (done) => {
      const request_ = request.post(`${base}/test-302`).redirects(1);
      request_.end((error, res) => {
        const headers = request_.req.getHeaders
          ? request_.req.getHeaders()
          : request_.req._headers;
        headers.host.should.eql(`localhost:${server2.address().port}`);
        res.status.should.eql(200);
        res.text.should.eql('GET');
        done();
      });
    });
  });
  describe('on 303 redirect', () => {
    it('should follow Location with a GET request', (done) => {
      const request_ = request.post(`${base}/test-303`).redirects(1);
      request_.end((error, res) => {
        const headers = request_.req.getHeaders
          ? request_.req.getHeaders()
          : request_.req._headers;
        headers.host.should.eql(`localhost:${server2.address().port}`);
        res.status.should.eql(200);
        res.text.should.eql('GET');
        done();
      });
    });
  });
  describe('on 307 redirect', () => {
    it('should follow Location with a POST request', (done) => {
      const request_ = request.post(`${base}/test-307`).redirects(1);
      request_.end((error, res) => {
        const headers = request_.req.getHeaders
          ? request_.req.getHeaders()
          : request_.req._headers;
        headers.host.should.eql(`localhost:${server2.address().port}`);
        res.status.should.eql(200);
        res.text.should.eql('POST');
        done();
      });
    });

    it('should strip credentials on a cross-origin redirect', () =>
      request
        .post(`${base}/test-307-credentials`)
        .set('Authorization', 'Bearer secret-token')
        .set('Cookie', 'sid=123456')
        .set('Proxy-Authorization', 'Basic dXNlcjpwYXNz')
        .redirects(1)
        .then((res) => {
          res.body.should.eql({ method: 'POST' });
        }));

    it('should preserve credentials on a same-origin redirect', () =>
      request
        .post(`${base}/test-307-same-origin-credentials`)
        .set('Authorization', 'Bearer secret-token')
        .set('Cookie', 'sid=123456')
        .set('Proxy-Authorization', 'Basic dXNlcjpwYXNz')
        .redirects(1)
        .then((res) => {
          res.body.should.eql({
            method: 'POST',
            authorization: 'Bearer secret-token',
            cookie: 'sid=123456',
            proxyAuthorization: 'Basic dXNlcjpwYXNz'
          });
        }));
  });
  describe('on 308 redirect', () => {
    it('should follow Location with a POST request', (done) => {
      const request_ = request.post(`${base}/test-308`).redirects(1);
      request_.end((error, res) => {
        const headers = request_.req.getHeaders
          ? request_.req.getHeaders()
          : request_.req._headers;
        headers.host.should.eql(`localhost:${server2.address().port}`);
        res.status.should.eql(200);
        res.text.should.eql('POST');
        done();
      });
    });

    it('should strip credentials on a cross-origin redirect', () =>
      request
        .post(`${base}/test-308-credentials`)
        .set('Authorization', 'Bearer secret-token')
        .set('Cookie', 'sid=123456')
        .set('Proxy-Authorization', 'Basic dXNlcjpwYXNz')
        .redirects(1)
        .then((res) => {
          res.body.should.eql({ method: 'POST' });
        }));

    it('should strip credentials on a 302 cross-origin redirect', () =>
      request
        .get(`${base}/test-302-credentials`)
        .set('Authorization', 'Bearer secret-token')
        .set('Cookie', 'sid=123456')
        .set('Proxy-Authorization', 'Basic dXNlcjpwYXNz')
        .redirects(1)
        .then((res) => {
          res.body.should.eql({ method: 'GET' });
        }));
  });
});
