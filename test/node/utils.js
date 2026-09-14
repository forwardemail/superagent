'use strict';
const assert = require('assert');
const utils =
  process.env.OLD_NODE_TEST === '1'
    ? // eslint-disable-next-line node/no-missing-require
      require('../../../utils')
    : require('../../lib/utils');

describe('utils.type(str)', () => {
  it('should return the mime type', () => {
    utils
      .type('application/json; charset=utf-8')
      .should.equal('application/json');

    utils.type('application/json').should.equal('application/json');
  });
});

describe('utils.params(str)', () => {
  it('should return the field parameters', () => {
    const object = utils.params('application/json; charset=utf-8; foo  = bar');
    object.charset.should.equal('utf-8');
    object.foo.should.equal('bar');

    utils.params('application/json').should.eql({});
  });
});

describe('utils.parseLinks(str)', () => {
  it('should parse links', () => {
    const string_ =
      '<https://api.github.com/repos/visionmedia/mocha/issues?page=2>; rel="next", <https://api.github.com/repos/visionmedia/mocha/issues?page=5>; rel="last"';
    const returnValue = utils.parseLinks(string_);
    returnValue.next.should.equal(
      'https://api.github.com/repos/visionmedia/mocha/issues?page=2'
    );
    returnValue.last.should.equal(
      'https://api.github.com/repos/visionmedia/mocha/issues?page=5'
    );
  });

  it('should find rel by name when other attributes come first', () => {
    // RFC 8288 does not require `rel` to be the second segment of a link
    // value, so a link that lists other attributes ahead of it should
    // still be keyed by its actual `rel`, not by whatever happens to sit
    // in that position.
    const string_ =
      '<https://example.com/page2>; type="text/html"; rel="next"';
    const returnValue = utils.parseLinks(string_);
    returnValue.next.should.equal('https://example.com/page2');
    Object.keys(returnValue).should.eql(['next']);
  });

  it('should ignore a link entry that has no rel attribute', () => {
    const string_ = '<https://example.com/page2>; type="text/html"';
    const returnValue = utils.parseLinks(string_);
    returnValue.should.eql({});
  });
});

describe('utils.isGzipOrDeflateEncoding(res)', () => {
  it('should return true when content encoding is gzip', () => {
    utils.isGzipOrDeflateEncoding({
      headers: {
        'content-encoding': 'gzip',
      },
    }).should.equal(true);
  });
  it('should return true when content encoding is deflate', () => {
    utils.isGzipOrDeflateEncoding({
      headers: {
        'content-encoding': 'deflate',
      },
    }).should.equal(true);
  });
  it('should return false when content encoding is bla', () => {
    utils.isGzipOrDeflateEncoding({
      headers: {
        'content-encoding': 'bla',
      },
    }).should.equal(false);
  });
  
  it('should return true when content encoding has a lot of spaces followed with gzip', () => {
    utils.isGzipOrDeflateEncoding({
      headers: {
        'content-encoding': " " * 10**6 + " gzip",
      },
    }).should.equal(false);
  });
  
  it('should return true when content encoding repeates it self', () => {
    utils.isGzipOrDeflateEncoding({
      headers: {
        'content-encoding': "gzip deflate gzip deflate gzip deflate gzip deflate gzip deflate gzip deflate gzip deflate gzip deflate",
      },
    }).should.equal(false);
  });
  
  it('should return true when content encoding repeates it self wuth a lot of spaces', () => {
    utils.isGzipOrDeflateEncoding({
      headers: {
        'content-encoding': " gzip   deflate   gzip   deflate   gzip   deflate   gzip   deflate   gzip   deflate   gzip   deflate",
      },
    }).should.equal(false);
  });
  
  it('should return true when content encoding - nested patterns', () => {
    utils.isGzipOrDeflateEncoding({
      headers: {
        'content-encoding': " " * 10**5 + ("gzip deflate " * 1000)
      },
    }).should.equal(false);
  });

  
});

describe('utils.isBrotliEncoding(res)', () => {
  it('should return true when content encoding is br', () => {
    utils.isBrotliEncoding({
      headers: {
        'content-encoding': 'br',
      },
    }).should.equal(true);
  });
  it('should return false when content encoding is bla', () => {
    utils.isBrotliEncoding({
      headers: {
        'content-encoding': 'bla',
      },
    }).should.equal(false);
  });
  
  it('should return true when content encoding has a lot of spaces followed with br', () => {
    utils.isBrotliEncoding({
      headers: {
        'content-encoding': " " * 10**6 + " br",
      },
    }).should.equal(false);
  });
  
  it('should return true when content encoding repeates it self', () => {
    utils.isBrotliEncoding({
      headers: {
        'content-encoding': " br br br br br  br br br br br  br br br br br br br br br br  br br br br br  br br br br br",
      },
    }).should.equal(false);
  });
  
  it('should return true when content encoding repeates it self wuth a lot of spaces', () => {
    utils.isBrotliEncoding({
      headers: {
        'content-encoding': "br     br     br     br     br     br     br     br     br     br     br     br     br     br",
      },
    }).should.equal(false);
  });
  
  it('should return true when content encoding - nested patterns', () => {
    utils.isBrotliEncoding({
      headers: {
        'content-encoding': " " * 10**5 + ("br " * 1000)
      },
    }).should.equal(false);
  });
  
});
