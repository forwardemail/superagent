
/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = (string_) => string_.split(/ *; */).shift();

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

    if (key && value) object[key] = value;
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
    // The `rel` attribute isn't guaranteed to be the second segment; a link
    // can carry other attributes (`type`, `title`, ...) before or after it,
    // so look it up by name instead of assuming its position.
    for (const part of parts.slice(1)) {
      const [key, keyValue] = part.split(/ *= */);
      if (key === 'rel' && keyValue) {
        object[keyValue.slice(1, -1)] = url;
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
  const [,normalized] = hostname.match(/^\[([^\]]+)\]$/) || [];
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
    if (object == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    return Object.prototype.hasOwnProperty.call(new Object(object), property);
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
  return new RegExp(/^\s*(?:deflate|gzip)\s*$/).test(res.headers['content-encoding']);
};

/**
 * Check if the response is compressed using Brotli.
 * @param {Object} res
 * @return {Boolean}
 */

exports.isBrotliEncoding = (res) => {
  return new RegExp(/^\s*(?:br)\s*$/).test(res.headers['content-encoding']);
};
