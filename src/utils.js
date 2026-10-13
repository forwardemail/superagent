/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = (string_) => string_.split(/ *; */).shift();

/**
 * Property names that must never be set from values a remote server controls
 * (header parameters, Link relations), as they would alter the prototype
 * chain or shadow constructors of the receiving object.
 */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

exports.isSafeKey = (key) => !UNSAFE_KEYS.has(key);

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = (value) => {
  const object = {};
  for (const string_ of value.split(/ *; */)) {
    const parts = string_.split(/ *= */);
    const key = parts.shift();
    const value = parts.shift();

    if (key && value && exports.isSafeKey(key)) object[key] = value;
  }

  return object;
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = (value) => {
  const object = {};
  for (const string_ of value.split(/ *, */)) {
    const parts = string_.split(/ *; */);
    const url = parts[0].slice(1, -1);
    for (const part of parts.slice(1)) {
      const [key, keyValue] = part.split(/ *= */, 2);
      if (key && key.toLowerCase() === 'rel' && keyValue) {
        const relationships = keyValue.replace(/^"|"$/g, '').split(/ +/);
        for (const relationship of relationships) {
          if (relationship && exports.isSafeKey(relationship))
            object[relationship] = url;
        }
        break;
      }
    }
  }

  return object;
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = (header, changesOrigin) => {
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header.host;
  // secuirty
  if (changesOrigin) {
    delete header.authorization;
    delete header.cookie;
  }

  return header;
};

exports.normalizeHostname = (hostname) => {
  const [, normalized] = hostname.match(/^\[([^\]]+)]$/) || [];
  return normalized || hostname;
};

/**
 * Check if `obj` is an object.
 *
 * @param {Object} object
 * @return {Boolean}
 * @api private
 */
exports.isObject = (object) => {
  return object !== null && typeof object === 'object';
};

/**
 * Object.hasOwn fallback/polyfill.
 *
 * @type {(object: object, property: string) => boolean} object
 * @api private
 */
exports.hasOwn =
  Object.hasOwn ||
  function (object, property) {
    if (object === null || object === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    return Object.prototype.hasOwnProperty.call(Object(object), property);
  };

exports.mixin = (target, source) => {
  for (const key in source) {
    if (exports.hasOwn(source, key)) {
      target[key] = source[key];
    }
  }
};

/**
 * Check if the response is compressed using Gzip or Deflate.
 * @param {Object} res
 * @return {Boolean}
 */

exports.isGzipOrDeflateEncoding = (res) => {
  // content-coding tokens are case-insensitive (RFC 9110 Section 8.4.1)
  return /^\s*(?:deflate|gzip)\s*$/i.test(res.headers['content-encoding']);
};

/**
 * Check if the response is compressed using Brotli.
 * @param {Object} res
 * @return {Boolean}
 */

exports.isBrotliEncoding = (res) => {
  return /^\s*br\s*$/i.test(res.headers['content-encoding']);
};
