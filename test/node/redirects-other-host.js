'use strict';
const assert = require('assert');
const request = require('../support/client');
const express = require('../support/express');

const app = express();
const app2 = express();
const should = require('should');
let http = require('http');

if (process.env.HTTP2_TEST) {
  http = require('http2');
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

app2.all('/', (request_, res) => {
  res.set('x-received-authorization', request_.headers.authorization || '');
  res.set('x-received-cookie', request_.headers.cookie || '');
  res.send(request_.method);
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
  });
});

describe('credentials on a cross-origin redirect', () => {
  for (const code of [301, 302, 303, 307, 308]) {
    it(`should not forward Authorization or Cookie on a ${code} redirect to another host`, (done) => {
      request
        .get(`${base}/test-${code}`)
        .set('Authorization', 'Bearer secret-token')
        .set('Cookie', 'session=secret')
        .redirects(1)
        .end((error, res) => {
          res.headers['x-received-authorization'].should.eql('');
          res.headers['x-received-cookie'].should.eql('');
          done(error);
        });
    });
  }
});
