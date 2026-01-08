const assert = require('assert');
const getSetup = require('./support/setup');

const request = require('./support/client');

describe('Agent', () => {
  let setup;
  let base;

  before(async () => {
    setup = await getSetup();
    base = setup.uri;
  });

  it('should remember defaults', () => {
    if (typeof Promise === 'undefined') {
      return;
    }

    let called = 0;
    let event_called = 0;
    const agent = request
      .agent()
      .accept('json')
      .use(() => {
        called++;
      })
      .once('request', () => {
        event_called++;
      })
      .query({ hello: 'world' })
      .set('X-test', 'testing');
    assert.equal(0, called);
    assert.equal(0, event_called);

    return agent
      .get(`${base}/echo`)
      .then((res) => {
        assert.equal(1, called);
        assert.equal(1, event_called);
        assert.equal('application/json', res.headers.accept);
        assert.equal('testing', res.headers['x-test']);

        return agent.get(`${base}/querystring`);
      })
      .then((res) => {
        assert.equal(2, called);
        assert.equal(2, event_called);
        assert.deepEqual({ hello: 'world' }, res.body);
      });
  });

  it('should assign cookies without domains correctly when following redirects', () => {
    const agent = request.agent();

    const firstUrl = new URL(base)
    firstUrl.hostname = 'first.local'
    const first = firstUrl.toString().slice(0, -1)

    const secondUrl = new URL(base)
    secondUrl.hostname = "second.local"
    const second = secondUrl.toString().slice(0, -1)

    return agent
      .get(`${first}/cookie-cross-domain-redirect`)
      .query({ first, second })
      .connect('127.0.0.1')
      .then((res) => {
        assert.equal(res.text, 'first.local=true')
      })
  })
});
