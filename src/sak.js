function getType(thing) {
  const typeOf = typeof thing;

  if (thing === null)
    return 'null';

  if (typeOf === 'string' || thing instanceof String)
    return 'string';

  if (typeOf === 'number' || thing instanceof Number) {
    if (Number.isNaN(thing))
      return 'NaN';
    if (thing === Infinity)
      return 'Infinity';
    if (thing === -Infinity)
      return '-Infinity';
    return 'number';
  }

  if (typeOf === 'undefined')
    return 'undefined';

  if (typeOf === 'function')
    return 'function';

  if (Array.isArray(thing))
    return 'array';

  return 'object';
}

function objectLike(thing) {
  const thingType = getType(thing);
  if (thingType === 'object' || thingType === 'function')
    return true;
  return false;
}

function has(obj, path) {
  if (!obj) return false;

  const pathType = getType(path);
  if (pathType === 'string') {
    path = path.split('.');
  }
  else if (pathType !== 'array') {
    path = [String(path)];
  }

  let curObj = obj;
  for (let p of path) {
    if (curObj != null && Object.prototype.hasOwnProperty.call(curObj, p))
      curObj = curObj[p];
    else
      return false;
  }

  return true;
}

function get(obj, path) {
  if (!obj) return false;

  const pathType = getType(path);
  if (pathType === 'string') {
    path = path.split('.');
  }
  else if (pathType !== 'array') {
    path = [String(path)];
  }

  let curObj = obj;
  for (let p of path) {
    if (curObj != null && Object.prototype.hasOwnProperty.call(curObj, p))
      curObj = curObj[p];
    else
      return undefined;
  }

  return curObj;
}

function set(obj, path, value) {
  const pathType = getType(path);

  if (pathType === 'string') {
    path = path.split('.');
  }
  else if (pathType !== 'array') {
    path = [String(path)];
  }

  if (objectLike(obj)) {
    let curObj = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (objectLike(curObj[path[i]])) {
        curObj = curObj[path[i]];
      }
      else {
        curObj = curObj[path[i]] = {};
      }
    }

    curObj[path[path.length-1]] = value;
  }

  return obj;
}

/**
 * Similar to the UNIX utility `touch`, ensures that the `path` on `obj` exists.
 * If `obj[path]` is not an object or function, the value at the `path`
 * is assigned `{}`. Otherwise, the value remains unchanged.
 */
function touch(obj, path) {
  const pathType = getType(path);

  if (pathType === 'string') {
    path = path.split('.');
  }
  else if (pathType !== 'array') {
    path = [String(path)];
  }

  if (objectLike(obj)) {
    let curObj = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (objectLike(curObj[path[i]])) {
        curObj = curObj[path[i]];
      }
      else {
        curObj = curObj[path[i]] = {};
      }
    }

    const lastPath = path[path.length-1];
    if (!objectLike(curObj[lastPath]))
      curObj[lastPath] = {};
  }

  return obj;
}

function isIterable(thing) {
  return thing && getType(thing[Symbol.iterator]) === 'function';
}

function map(iterable, iteratee) {
  const iterateeType = getType(iteratee);
  if (!isIterable(iterable)) {
    throw new Error('The first argument to `map` must be iterable');
  }
  if (!['string', 'array', 'number', 'function'].includes(iterateeType)) {
    throw new Error('The iteratee must be a string, array, or function');
  }

  const result = [];
  for (let item of iterable) {
    if (iterateeType === 'function')
      result.push(iteratee(item));
    else
      result.push(get(item, iteratee));
  }

  return result;
}

function mapKeys(obj, iteratee) {
  const iterateeType = getType(iteratee);
  if (!objectLike(obj)) {
    throw new Error('The first argument to `mapKeys` must be object-like');
  }
  if (iterateeType !== 'function') {
    throw new Error('The iteratee must be a function');
  }

  const result = [];
  for (let key of Object.keys(obj)) {
    result.push(iteratee(key));
  }

  return result;
}

function mapValues(obj, iteratee) {
  const iterateeType = getType(iteratee);
  if (!objectLike(obj)) {
    throw new Error('The first argument to `mapValues` must be object-like');
  }
  if (!['string', 'array', 'number', 'function'].includes(iterateeType)) {
    throw new Error('The iteratee must be a string, array, number, or function');
  }

  const result = [];
  for (let value of Object.values(obj)) {
    result.push(iteratee(value));
  }

  return result;
}

function mapEntries(obj, iteratee) {
  const iterateeType = getType(iteratee);
  if (!objectLike(obj)) {
    throw new Error('The first argument to `mapValues` must be object-like');
  }
  if (iterateeType !== 'function') {
    throw new Error('The iteratee must be a function');
  }

  const result = [];
  for (let [key, value] of Object.entries(obj)) {
    result.push(iteratee(key, value));
  }

  return result;
}

/**
 * Returns `true` if `thing` is not `NaN` and is of type `number` or an
 * instance of `Number`. This includes +/- `Infinity`. Better than
 * comparing to `NaN`.
 */
function isNumber(thing) {
  return !Number.isNaN(thing)
    && (typeof thing === 'number' || thing instanceof Number);
}

/**
 * @param {((key:string|number,value:any) => boolean | string[] | number[]} predicate
 */
function pick(objOrArray, predicate) {
  const predType = getType(predicate);
  const objOrArrayType = getType(objOrArray);
  if (!objectLike(objOrArray) && objOrArrayType !== 'array') {
    throw new Error('The first argument to `pick` must be an array or object-like');
  }
  if (!['function', 'array'].includes(predType)) {
    throw new Error('The predicate must be a function, string[], or number[]');
  }

  let result;
  if (objOrArrayType === 'array') {
    result = [];
    if (predType === 'function') {
      for (let i = 0; i < objOrArray.length; i++) {
        const item = objOrArray[i];
        if (predicate(i, item)) {
          result.push(item);
        }
      }
    }
    else {
      for (let index of predicate) {
        result.push(objOrArray[index]);
      }
    }
  }
  else {
    result = {};
    if (predType === 'function') {
      for (let [key, value] of Object.entries(objOrArray)) {
        if (predicate(key, value))
          result[key] = value;
      }
    }
    else {
      for (let key of predicate) {
        result[key] = objOrArray[key];
      }
    }
  }

  return result;
}

/**
 * @param {(key:number|string,value:any)=>boolean} predicate
 */
function all(objOrArray, predicate) {
  const objOrArrayType = getType(objOrArray);
  const predType = getType(predicate);
  if (!objectLike(objOrArray) && objOrArrayType !== 'array') {
    throw new Error('The first argument to `all` must be an array or object-like');
  }
  if (predType !== 'function') {
    throw new Error('The predicate must be a function');
  }

  let entries;
  if (objOrArrayType === 'array')
    entries = objOrArray.map(val => [,val]);
  else
    entries = Object.entries(objOrArray);

  for (let i = 0; i < entries.length; i++) {
    const [key, val] = entries[i];
    if (!predicate(val)) return false;
  }

  return true;
}

/**
 * If `thing` is a function, returns `thing`. Else, returns a function that
 * returns `thing`.
 */
function funkify(thing) {
  if (getType(thing) !== 'function')
    return function() { return thing; };

  return thing;
}

module.exports = {
  type: getType,
  isObjectLike: objectLike,
  has,
  get,
  set,
  touch,
  isIterable,
  map,
  mapKeys,
  mapValues,
  mapEntries,
  pick,
  all,
  isNumber,
  funkify
};
