(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  window.ReactSimpleMaps = require("react-simple-maps");
  
  },{"react-simple-maps":24}],2:[function(require,module,exports){
  // https://d3js.org/d3-array/ v2.12.1 Copyright 2021 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.d3 = global.d3 || {}));
  }(this, (function (exports) { 'use strict';
  
  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }
  
  function bisector(f) {
    let delta = f;
    let compare = f;
  
    if (f.length === 1) {
      delta = (d, x) => f(d) - x;
      compare = ascendingComparator(f);
    }
  
    function left(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    }
  
    function right(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  
    function center(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      const i = left(a, x, lo, hi - 1);
      return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
    }
  
    return {left, center, right};
  }
  
  function ascendingComparator(f) {
    return (d, x) => ascending(f(d), x);
  }
  
  function number(x) {
    return x === null ? NaN : +x;
  }
  
  function* numbers(values, valueof) {
    if (valueof === undefined) {
      for (let value of values) {
        if (value != null && (value = +value) >= value) {
          yield value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
          yield value;
        }
      }
    }
  }
  
  const ascendingBisect = bisector(ascending);
  const bisectRight = ascendingBisect.right;
  const bisectLeft = ascendingBisect.left;
  const bisectCenter = bisector(number).center;
  
  function count(values, valueof) {
    let count = 0;
    if (valueof === undefined) {
      for (let value of values) {
        if (value != null && (value = +value) >= value) {
          ++count;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
          ++count;
        }
      }
    }
    return count;
  }
  
  function length$1(array) {
    return array.length | 0;
  }
  
  function empty(length) {
    return !(length > 0);
  }
  
  function arrayify(values) {
    return typeof values !== "object" || "length" in values ? values : Array.from(values);
  }
  
  function reducer(reduce) {
    return values => reduce(...values);
  }
  
  function cross(...values) {
    const reduce = typeof values[values.length - 1] === "function" && reducer(values.pop());
    values = values.map(arrayify);
    const lengths = values.map(length$1);
    const j = values.length - 1;
    const index = new Array(j + 1).fill(0);
    const product = [];
    if (j < 0 || lengths.some(empty)) return product;
    while (true) {
      product.push(index.map((j, i) => values[i][j]));
      let i = j;
      while (++index[i] === lengths[i]) {
        if (i === 0) return reduce ? product.map(reduce) : product;
        index[i--] = 0;
      }
    }
  }
  
  function cumsum(values, valueof) {
    var sum = 0, index = 0;
    return Float64Array.from(values, valueof === undefined
      ? v => (sum += +v || 0)
      : v => (sum += +valueof(v, index++, values) || 0));
  }
  
  function descending(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }
  
  function variance(values, valueof) {
    let count = 0;
    let delta;
    let mean = 0;
    let sum = 0;
    if (valueof === undefined) {
      for (let value of values) {
        if (value != null && (value = +value) >= value) {
          delta = value - mean;
          mean += delta / ++count;
          sum += delta * (value - mean);
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
          delta = value - mean;
          mean += delta / ++count;
          sum += delta * (value - mean);
        }
      }
    }
    if (count > 1) return sum / (count - 1);
  }
  
  function deviation(values, valueof) {
    const v = variance(values, valueof);
    return v ? Math.sqrt(v) : v;
  }
  
  function extent(values, valueof) {
    let min;
    let max;
    if (valueof === undefined) {
      for (const value of values) {
        if (value != null) {
          if (min === undefined) {
            if (value >= value) min = max = value;
          } else {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null) {
          if (min === undefined) {
            if (value >= value) min = max = value;
          } else {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
    return [min, max];
  }
  
  // https://github.com/python/cpython/blob/a74eea238f5baba15797e2e8b570d153bc8690a7/Modules/mathmodule.c#L1423
  class Adder {
    constructor() {
      this._partials = new Float64Array(32);
      this._n = 0;
    }
    add(x) {
      const p = this._partials;
      let i = 0;
      for (let j = 0; j < this._n && j < 32; j++) {
        const y = p[j],
          hi = x + y,
          lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
        if (lo) p[i++] = lo;
        x = hi;
      }
      p[i] = x;
      this._n = i + 1;
      return this;
    }
    valueOf() {
      const p = this._partials;
      let n = this._n, x, y, lo, hi = 0;
      if (n > 0) {
        hi = p[--n];
        while (n > 0) {
          x = hi;
          y = p[--n];
          hi = x + y;
          lo = y - (hi - x);
          if (lo) break;
        }
        if (n > 0 && ((lo < 0 && p[n - 1] < 0) || (lo > 0 && p[n - 1] > 0))) {
          y = lo * 2;
          x = hi + y;
          if (y == x - hi) hi = x;
        }
      }
      return hi;
    }
  }
  
  function fsum(values, valueof) {
    const adder = new Adder();
    if (valueof === undefined) {
      for (let value of values) {
        if (value = +value) {
          adder.add(value);
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if (value = +valueof(value, ++index, values)) {
          adder.add(value);
        }
      }
    }
    return +adder;
  }
  
  function fcumsum(values, valueof) {
    const adder = new Adder();
    let index = -1;
    return Float64Array.from(values, valueof === undefined
        ? v => adder.add(+v || 0)
        : v => adder.add(+valueof(v, ++index, values) || 0)
    );
  }
  
  class InternMap extends Map {
    constructor(entries, key = keyof) {
      super();
      Object.defineProperties(this, {_intern: {value: new Map()}, _key: {value: key}});
      if (entries != null) for (const [key, value] of entries) this.set(key, value);
    }
    get(key) {
      return super.get(intern_get(this, key));
    }
    has(key) {
      return super.has(intern_get(this, key));
    }
    set(key, value) {
      return super.set(intern_set(this, key), value);
    }
    delete(key) {
      return super.delete(intern_delete(this, key));
    }
  }
  
  class InternSet extends Set {
    constructor(values, key = keyof) {
      super();
      Object.defineProperties(this, {_intern: {value: new Map()}, _key: {value: key}});
      if (values != null) for (const value of values) this.add(value);
    }
    has(value) {
      return super.has(intern_get(this, value));
    }
    add(value) {
      return super.add(intern_set(this, value));
    }
    delete(value) {
      return super.delete(intern_delete(this, value));
    }
  }
  
  function intern_get({_intern, _key}, value) {
    const key = _key(value);
    return _intern.has(key) ? _intern.get(key) : value;
  }
  
  function intern_set({_intern, _key}, value) {
    const key = _key(value);
    if (_intern.has(key)) return _intern.get(key);
    _intern.set(key, value);
    return value;
  }
  
  function intern_delete({_intern, _key}, value) {
    const key = _key(value);
    if (_intern.has(key)) {
      value = _intern.get(value);
      _intern.delete(key);
    }
    return value;
  }
  
  function keyof(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
  }
  
  function identity(x) {
    return x;
  }
  
  function group(values, ...keys) {
    return nest(values, identity, identity, keys);
  }
  
  function groups(values, ...keys) {
    return nest(values, Array.from, identity, keys);
  }
  
  function rollup(values, reduce, ...keys) {
    return nest(values, identity, reduce, keys);
  }
  
  function rollups(values, reduce, ...keys) {
    return nest(values, Array.from, reduce, keys);
  }
  
  function index(values, ...keys) {
    return nest(values, identity, unique, keys);
  }
  
  function indexes(values, ...keys) {
    return nest(values, Array.from, unique, keys);
  }
  
  function unique(values) {
    if (values.length !== 1) throw new Error("duplicate key");
    return values[0];
  }
  
  function nest(values, map, reduce, keys) {
    return (function regroup(values, i) {
      if (i >= keys.length) return reduce(values);
      const groups = new InternMap();
      const keyof = keys[i++];
      let index = -1;
      for (const value of values) {
        const key = keyof(value, ++index, values);
        const group = groups.get(key);
        if (group) group.push(value);
        else groups.set(key, [value]);
      }
      for (const [key, values] of groups) {
        groups.set(key, regroup(values, i));
      }
      return map(groups);
    })(values, 0);
  }
  
  function permute(source, keys) {
    return Array.from(keys, key => source[key]);
  }
  
  function sort(values, ...F) {
    if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
    values = Array.from(values);
    let [f = ascending] = F;
    if (f.length === 1 || F.length > 1) {
      const index = Uint32Array.from(values, (d, i) => i);
      if (F.length > 1) {
        F = F.map(f => values.map(f));
        index.sort((i, j) => {
          for (const f of F) {
            const c = ascending(f[i], f[j]);
            if (c) return c;
          }
        });
      } else {
        f = values.map(f);
        index.sort((i, j) => ascending(f[i], f[j]));
      }
      return permute(values, index);
    }
    return values.sort(f);
  }
  
  function groupSort(values, reduce, key) {
    return (reduce.length === 1
      ? sort(rollup(values, reduce, key), (([ak, av], [bk, bv]) => ascending(av, bv) || ascending(ak, bk)))
      : sort(group(values, key), (([ak, av], [bk, bv]) => reduce(av, bv) || ascending(ak, bk))))
      .map(([key]) => key);
  }
  
  var array = Array.prototype;
  
  var slice = array.slice;
  
  function constant(x) {
    return function() {
      return x;
    };
  }
  
  var e10 = Math.sqrt(50),
      e5 = Math.sqrt(10),
      e2 = Math.sqrt(2);
  
  function ticks(start, stop, count) {
    var reverse,
        i = -1,
        n,
        ticks,
        step;
  
    stop = +stop, start = +start, count = +count;
    if (start === stop && count > 0) return [start];
    if (reverse = stop < start) n = start, start = stop, stop = n;
    if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];
  
    if (step > 0) {
      let r0 = Math.round(start / step), r1 = Math.round(stop / step);
      if (r0 * step < start) ++r0;
      if (r1 * step > stop) --r1;
      ticks = new Array(n = r1 - r0 + 1);
      while (++i < n) ticks[i] = (r0 + i) * step;
    } else {
      step = -step;
      let r0 = Math.round(start * step), r1 = Math.round(stop * step);
      if (r0 / step < start) ++r0;
      if (r1 / step > stop) --r1;
      ticks = new Array(n = r1 - r0 + 1);
      while (++i < n) ticks[i] = (r0 + i) / step;
    }
  
    if (reverse) ticks.reverse();
  
    return ticks;
  }
  
  function tickIncrement(start, stop, count) {
    var step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log(step) / Math.LN10),
        error = step / Math.pow(10, power);
    return power >= 0
        ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
        : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
  }
  
  function tickStep(start, stop, count) {
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;
    else if (error >= e5) step1 *= 5;
    else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
  }
  
  function nice(start, stop, count) {
    let prestep;
    while (true) {
      const step = tickIncrement(start, stop, count);
      if (step === prestep || step === 0 || !isFinite(step)) {
        return [start, stop];
      } else if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      }
      prestep = step;
    }
  }
  
  function sturges(values) {
    return Math.ceil(Math.log(count(values)) / Math.LN2) + 1;
  }
  
  function bin() {
    var value = identity,
        domain = extent,
        threshold = sturges;
  
    function histogram(data) {
      if (!Array.isArray(data)) data = Array.from(data);
  
      var i,
          n = data.length,
          x,
          values = new Array(n);
  
      for (i = 0; i < n; ++i) {
        values[i] = value(data[i], i, data);
      }
  
      var xz = domain(values),
          x0 = xz[0],
          x1 = xz[1],
          tz = threshold(values, x0, x1);
  
      // Convert number of thresholds into uniform thresholds, and nice the
      // default domain accordingly.
      if (!Array.isArray(tz)) {
        const max = x1, tn = +tz;
        if (domain === extent) [x0, x1] = nice(x0, x1, tn);
        tz = ticks(x0, x1, tn);
  
        // If the last threshold is coincident with the domain’s upper bound, the
        // last bin will be zero-width. If the default domain is used, and this
        // last threshold is coincident with the maximum input value, we can
        // extend the niced upper bound by one tick to ensure uniform bin widths;
        // otherwise, we simply remove the last threshold. Note that we don’t
        // coerce values or the domain to numbers, and thus must be careful to
        // compare order (>=) rather than strict equality (===)!
        if (tz[tz.length - 1] >= x1) {
          if (max >= x1 && domain === extent) {
            const step = tickIncrement(x0, x1, tn);
            if (isFinite(step)) {
              if (step > 0) {
                x1 = (Math.floor(x1 / step) + 1) * step;
              } else if (step < 0) {
                x1 = (Math.ceil(x1 * -step) + 1) / -step;
              }
            }
          } else {
            tz.pop();
          }
        }
      }
  
      // Remove any thresholds outside the domain.
      var m = tz.length;
      while (tz[0] <= x0) tz.shift(), --m;
      while (tz[m - 1] > x1) tz.pop(), --m;
  
      var bins = new Array(m + 1),
          bin;
  
      // Initialize bins.
      for (i = 0; i <= m; ++i) {
        bin = bins[i] = [];
        bin.x0 = i > 0 ? tz[i - 1] : x0;
        bin.x1 = i < m ? tz[i] : x1;
      }
  
      // Assign data to bins by value, ignoring any outside the domain.
      for (i = 0; i < n; ++i) {
        x = values[i];
        if (x0 <= x && x <= x1) {
          bins[bisectRight(tz, x, 0, m)].push(data[i]);
        }
      }
  
      return bins;
    }
  
    histogram.value = function(_) {
      return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
    };
  
    histogram.domain = function(_) {
      return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
    };
  
    histogram.thresholds = function(_) {
      return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
    };
  
    return histogram;
  }
  
  function max(values, valueof) {
    let max;
    if (valueof === undefined) {
      for (const value of values) {
        if (value != null
            && (max < value || (max === undefined && value >= value))) {
          max = value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null
            && (max < value || (max === undefined && value >= value))) {
          max = value;
        }
      }
    }
    return max;
  }
  
  function min(values, valueof) {
    let min;
    if (valueof === undefined) {
      for (const value of values) {
        if (value != null
            && (min > value || (min === undefined && value >= value))) {
          min = value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null
            && (min > value || (min === undefined && value >= value))) {
          min = value;
        }
      }
    }
    return min;
  }
  
  // Based on https://github.com/mourner/quickselect
  // ISC license, Copyright 2018 Vladimir Agafonkin.
  function quickselect(array, k, left = 0, right = array.length - 1, compare = ascending) {
    while (right > left) {
      if (right - left > 600) {
        const n = right - left + 1;
        const m = k - left + 1;
        const z = Math.log(n);
        const s = 0.5 * Math.exp(2 * z / 3);
        const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
        const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
        const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
        quickselect(array, k, newLeft, newRight, compare);
      }
  
      const t = array[k];
      let i = left;
      let j = right;
  
      swap(array, left, k);
      if (compare(array[right], t) > 0) swap(array, left, right);
  
      while (i < j) {
        swap(array, i, j), ++i, --j;
        while (compare(array[i], t) < 0) ++i;
        while (compare(array[j], t) > 0) --j;
      }
  
      if (compare(array[left], t) === 0) swap(array, left, j);
      else ++j, swap(array, j, right);
  
      if (j <= k) left = j + 1;
      if (k <= j) right = j - 1;
    }
    return array;
  }
  
  function swap(array, i, j) {
    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
  
  function quantile(values, p, valueof) {
    values = Float64Array.from(numbers(values, valueof));
    if (!(n = values.length)) return;
    if ((p = +p) <= 0 || n < 2) return min(values);
    if (p >= 1) return max(values);
    var n,
        i = (n - 1) * p,
        i0 = Math.floor(i),
        value0 = max(quickselect(values, i0).subarray(0, i0 + 1)),
        value1 = min(values.subarray(i0 + 1));
    return value0 + (value1 - value0) * (i - i0);
  }
  
  function quantileSorted(values, p, valueof = number) {
    if (!(n = values.length)) return;
    if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
    if (p >= 1) return +valueof(values[n - 1], n - 1, values);
    var n,
        i = (n - 1) * p,
        i0 = Math.floor(i),
        value0 = +valueof(values[i0], i0, values),
        value1 = +valueof(values[i0 + 1], i0 + 1, values);
    return value0 + (value1 - value0) * (i - i0);
  }
  
  function freedmanDiaconis(values, min, max) {
    return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(count(values), -1 / 3)));
  }
  
  function scott(values, min, max) {
    return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(count(values), -1 / 3)));
  }
  
  function maxIndex(values, valueof) {
    let max;
    let maxIndex = -1;
    let index = -1;
    if (valueof === undefined) {
      for (const value of values) {
        ++index;
        if (value != null
            && (max < value || (max === undefined && value >= value))) {
          max = value, maxIndex = index;
        }
      }
    } else {
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null
            && (max < value || (max === undefined && value >= value))) {
          max = value, maxIndex = index;
        }
      }
    }
    return maxIndex;
  }
  
  function mean(values, valueof) {
    let count = 0;
    let sum = 0;
    if (valueof === undefined) {
      for (let value of values) {
        if (value != null && (value = +value) >= value) {
          ++count, sum += value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
          ++count, sum += value;
        }
      }
    }
    if (count) return sum / count;
  }
  
  function median(values, valueof) {
    return quantile(values, 0.5, valueof);
  }
  
  function* flatten(arrays) {
    for (const array of arrays) {
      yield* array;
    }
  }
  
  function merge(arrays) {
    return Array.from(flatten(arrays));
  }
  
  function minIndex(values, valueof) {
    let min;
    let minIndex = -1;
    let index = -1;
    if (valueof === undefined) {
      for (const value of values) {
        ++index;
        if (value != null
            && (min > value || (min === undefined && value >= value))) {
          min = value, minIndex = index;
        }
      }
    } else {
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null
            && (min > value || (min === undefined && value >= value))) {
          min = value, minIndex = index;
        }
      }
    }
    return minIndex;
  }
  
  function pairs(values, pairof = pair) {
    const pairs = [];
    let previous;
    let first = false;
    for (const value of values) {
      if (first) pairs.push(pairof(previous, value));
      previous = value;
      first = true;
    }
    return pairs;
  }
  
  function pair(a, b) {
    return [a, b];
  }
  
  function range(start, stop, step) {
    start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
  
    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        range = new Array(n);
  
    while (++i < n) {
      range[i] = start + i * step;
    }
  
    return range;
  }
  
  function least(values, compare = ascending) {
    let min;
    let defined = false;
    if (compare.length === 1) {
      let minValue;
      for (const element of values) {
        const value = compare(element);
        if (defined
            ? ascending(value, minValue) < 0
            : ascending(value, value) === 0) {
          min = element;
          minValue = value;
          defined = true;
        }
      }
    } else {
      for (const value of values) {
        if (defined
            ? compare(value, min) < 0
            : compare(value, value) === 0) {
          min = value;
          defined = true;
        }
      }
    }
    return min;
  }
  
  function leastIndex(values, compare = ascending) {
    if (compare.length === 1) return minIndex(values, compare);
    let minValue;
    let min = -1;
    let index = -1;
    for (const value of values) {
      ++index;
      if (min < 0
          ? compare(value, value) === 0
          : compare(value, minValue) < 0) {
        minValue = value;
        min = index;
      }
    }
    return min;
  }
  
  function greatest(values, compare = ascending) {
    let max;
    let defined = false;
    if (compare.length === 1) {
      let maxValue;
      for (const element of values) {
        const value = compare(element);
        if (defined
            ? ascending(value, maxValue) > 0
            : ascending(value, value) === 0) {
          max = element;
          maxValue = value;
          defined = true;
        }
      }
    } else {
      for (const value of values) {
        if (defined
            ? compare(value, max) > 0
            : compare(value, value) === 0) {
          max = value;
          defined = true;
        }
      }
    }
    return max;
  }
  
  function greatestIndex(values, compare = ascending) {
    if (compare.length === 1) return maxIndex(values, compare);
    let maxValue;
    let max = -1;
    let index = -1;
    for (const value of values) {
      ++index;
      if (max < 0
          ? compare(value, value) === 0
          : compare(value, maxValue) > 0) {
        maxValue = value;
        max = index;
      }
    }
    return max;
  }
  
  function scan(values, compare) {
    const index = leastIndex(values, compare);
    return index < 0 ? undefined : index;
  }
  
  var shuffle = shuffler(Math.random);
  
  function shuffler(random) {
    return function shuffle(array, i0 = 0, i1 = array.length) {
      let m = i1 - (i0 = +i0);
      while (m) {
        const i = random() * m-- | 0, t = array[m + i0];
        array[m + i0] = array[i + i0];
        array[i + i0] = t;
      }
      return array;
    };
  }
  
  function sum(values, valueof) {
    let sum = 0;
    if (valueof === undefined) {
      for (let value of values) {
        if (value = +value) {
          sum += value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if (value = +valueof(value, ++index, values)) {
          sum += value;
        }
      }
    }
    return sum;
  }
  
  function transpose(matrix) {
    if (!(n = matrix.length)) return [];
    for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
        row[j] = matrix[j][i];
      }
    }
    return transpose;
  }
  
  function length(d) {
    return d.length;
  }
  
  function zip() {
    return transpose(arguments);
  }
  
  function every(values, test) {
    if (typeof test !== "function") throw new TypeError("test is not a function");
    let index = -1;
    for (const value of values) {
      if (!test(value, ++index, values)) {
        return false;
      }
    }
    return true;
  }
  
  function some(values, test) {
    if (typeof test !== "function") throw new TypeError("test is not a function");
    let index = -1;
    for (const value of values) {
      if (test(value, ++index, values)) {
        return true;
      }
    }
    return false;
  }
  
  function filter(values, test) {
    if (typeof test !== "function") throw new TypeError("test is not a function");
    const array = [];
    let index = -1;
    for (const value of values) {
      if (test(value, ++index, values)) {
        array.push(value);
      }
    }
    return array;
  }
  
  function map(values, mapper) {
    if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
    if (typeof mapper !== "function") throw new TypeError("mapper is not a function");
    return Array.from(values, (value, index) => mapper(value, index, values));
  }
  
  function reduce(values, reducer, value) {
    if (typeof reducer !== "function") throw new TypeError("reducer is not a function");
    const iterator = values[Symbol.iterator]();
    let done, next, index = -1;
    if (arguments.length < 3) {
      ({done, value} = iterator.next());
      if (done) return;
      ++index;
    }
    while (({done, value: next} = iterator.next()), !done) {
      value = reducer(value, next, ++index, values);
    }
    return value;
  }
  
  function reverse(values) {
    if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
    return Array.from(values).reverse();
  }
  
  function difference(values, ...others) {
    values = new Set(values);
    for (const other of others) {
      for (const value of other) {
        values.delete(value);
      }
    }
    return values;
  }
  
  function disjoint(values, other) {
    const iterator = other[Symbol.iterator](), set = new Set();
    for (const v of values) {
      if (set.has(v)) return false;
      let value, done;
      while (({value, done} = iterator.next())) {
        if (done) break;
        if (Object.is(v, value)) return false;
        set.add(value);
      }
    }
    return true;
  }
  
  function set(values) {
    return values instanceof Set ? values : new Set(values);
  }
  
  function intersection(values, ...others) {
    values = new Set(values);
    others = others.map(set);
    out: for (const value of values) {
      for (const other of others) {
        if (!other.has(value)) {
          values.delete(value);
          continue out;
        }
      }
    }
    return values;
  }
  
  function superset(values, other) {
    const iterator = values[Symbol.iterator](), set = new Set();
    for (const o of other) {
      if (set.has(o)) continue;
      let value, done;
      while (({value, done} = iterator.next())) {
        if (done) return false;
        set.add(value);
        if (Object.is(o, value)) break;
      }
    }
    return true;
  }
  
  function subset(values, other) {
    return superset(other, values);
  }
  
  function union(...others) {
    const set = new Set();
    for (const other of others) {
      for (const o of other) {
        set.add(o);
      }
    }
    return set;
  }
  
  exports.Adder = Adder;
  exports.InternMap = InternMap;
  exports.InternSet = InternSet;
  exports.ascending = ascending;
  exports.bin = bin;
  exports.bisect = bisectRight;
  exports.bisectCenter = bisectCenter;
  exports.bisectLeft = bisectLeft;
  exports.bisectRight = bisectRight;
  exports.bisector = bisector;
  exports.count = count;
  exports.cross = cross;
  exports.cumsum = cumsum;
  exports.descending = descending;
  exports.deviation = deviation;
  exports.difference = difference;
  exports.disjoint = disjoint;
  exports.every = every;
  exports.extent = extent;
  exports.fcumsum = fcumsum;
  exports.filter = filter;
  exports.fsum = fsum;
  exports.greatest = greatest;
  exports.greatestIndex = greatestIndex;
  exports.group = group;
  exports.groupSort = groupSort;
  exports.groups = groups;
  exports.histogram = bin;
  exports.index = index;
  exports.indexes = indexes;
  exports.intersection = intersection;
  exports.least = least;
  exports.leastIndex = leastIndex;
  exports.map = map;
  exports.max = max;
  exports.maxIndex = maxIndex;
  exports.mean = mean;
  exports.median = median;
  exports.merge = merge;
  exports.min = min;
  exports.minIndex = minIndex;
  exports.nice = nice;
  exports.pairs = pairs;
  exports.permute = permute;
  exports.quantile = quantile;
  exports.quantileSorted = quantileSorted;
  exports.quickselect = quickselect;
  exports.range = range;
  exports.reduce = reduce;
  exports.reverse = reverse;
  exports.rollup = rollup;
  exports.rollups = rollups;
  exports.scan = scan;
  exports.shuffle = shuffle;
  exports.shuffler = shuffler;
  exports.some = some;
  exports.sort = sort;
  exports.subset = subset;
  exports.sum = sum;
  exports.superset = superset;
  exports.thresholdFreedmanDiaconis = freedmanDiaconis;
  exports.thresholdScott = scott;
  exports.thresholdSturges = sturges;
  exports.tickIncrement = tickIncrement;
  exports.tickStep = tickStep;
  exports.ticks = ticks;
  exports.transpose = transpose;
  exports.union = union;
  exports.variance = variance;
  exports.zip = zip;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  })));
  
  },{}],3:[function(require,module,exports){
  // https://d3js.org/d3-color/ v2.0.0 Copyright 2020 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}));
  }(this, function (exports) { 'use strict';
  
  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }
  
  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }
  
  function Color() {}
  
  var darker = 0.7;
  var brighter = 1 / darker;
  
  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex = /^#([0-9a-f]{3,8})$/,
      reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
      reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
      reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
      reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
      reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
      reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
  
  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };
  
  define(Color, color, {
    copy: function(channels) {
      return Object.assign(new this.constructor, this, channels);
    },
    displayable: function() {
      return this.rgb().displayable();
    },
    hex: color_formatHex, // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });
  
  function color_formatHex() {
    return this.rgb().formatHex();
  }
  
  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }
  
  function color_formatRgb() {
    return this.rgb().formatRgb();
  }
  
  function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
        : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
        : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
        : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
        : null) // invalid hex
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }
  
  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }
  
  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }
  
  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }
  
  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }
  
  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }
  
  define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (-0.5 <= this.r && this.r < 255.5)
          && (-0.5 <= this.g && this.g < 255.5)
          && (-0.5 <= this.b && this.b < 255.5)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex, // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));
  
  function rgb_formatHex() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  }
  
  function rgb_formatRgb() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(")
        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
        + (a === 1 ? ")" : ", " + a + ")");
  }
  
  function hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
  }
  
  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }
  
  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }
  
  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }
  
  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }
  
  define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "hsl(" : "hsla(")
          + (this.h || 0) + ", "
          + (this.s || 0) * 100 + "%, "
          + (this.l || 0) * 100 + "%"
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));
  
  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }
  
  const radians = Math.PI / 180;
  const degrees = 180 / Math.PI;
  
  // https://observablehq.com/@mbostock/lab-and-rgb
  const K = 18,
      Xn = 0.96422,
      Yn = 1,
      Zn = 0.82521,
      t0 = 4 / 29,
      t1 = 6 / 29,
      t2 = 3 * t1 * t1,
      t3 = t1 * t1 * t1;
  
  function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) return hcl2lab(o);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = rgb2lrgb(o.r),
        g = rgb2lrgb(o.g),
        b = rgb2lrgb(o.b),
        y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
    if (r === g && g === b) x = z = y; else {
      x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
      z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
    }
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }
  
  function gray(l, opacity) {
    return new Lab(l, 0, 0, opacity == null ? 1 : opacity);
  }
  
  function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
  }
  
  function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }
  
  define(Lab, lab, extend(Color, {
    brighter: function(k) {
      return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
      return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      x = Xn * lab2xyz(x);
      y = Yn * lab2xyz(y);
      z = Zn * lab2xyz(z);
      return new Rgb(
        lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
        lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
        lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
        this.opacity
      );
    }
  }));
  
  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }
  
  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }
  
  function lrgb2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }
  
  function rgb2lrgb(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }
  
  function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
    var h = Math.atan2(o.b, o.a) * degrees;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }
  
  function lch(l, c, h, opacity) {
    return arguments.length === 1 ? hclConvert(l) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  }
  
  function hcl(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  }
  
  function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }
  
  function hcl2lab(o) {
    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
    var h = o.h * radians;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }
  
  define(Hcl, hcl, extend(Color, {
    brighter: function(k) {
      return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
      return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
      return hcl2lab(this).rgb();
    }
  }));
  
  var A = -0.14861,
      B = +1.78277,
      C = -0.29227,
      D = -0.90649,
      E = +1.97294,
      ED = E * D,
      EB = E * B,
      BC_DA = B * C - D * A;
  
  function cubehelixConvert(o) {
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
        bl = b - l,
        k = (E * (g - l) - C * bl) / D,
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * degrees - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
  }
  
  function cubehelix(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
  }
  
  function Cubehelix(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }
  
  define(Cubehelix, cubehelix, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * radians,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb(
        255 * (l + a * (A * cosh + B * sinh)),
        255 * (l + a * (C * cosh + D * sinh)),
        255 * (l + a * (E * cosh)),
        this.opacity
      );
    }
  }));
  
  exports.color = color;
  exports.cubehelix = cubehelix;
  exports.gray = gray;
  exports.hcl = hcl;
  exports.hsl = hsl;
  exports.lab = lab;
  exports.lch = lch;
  exports.rgb = rgb;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  
  },{}],4:[function(require,module,exports){
  // https://d3js.org/d3-dispatch/ v2.0.0 Copyright 2020 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}));
  }(this, function (exports) { 'use strict';
  
  var noop = {value: () => {}};
  
  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }
  
  function Dispatch(_) {
    this._ = _;
  }
  
  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }
  
  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;
  
      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }
  
      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
      }
  
      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };
  
  function get(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }
  
  function set(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }
  
  exports.dispatch = dispatch;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  
  },{}],5:[function(require,module,exports){
  // https://d3js.org/d3-drag/ v2.0.0 Copyright 2020 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-dispatch'), require('d3-selection')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-dispatch', 'd3-selection'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}, global.d3, global.d3));
  }(this, function (exports, d3Dispatch, d3Selection) { 'use strict';
  
  function nopropagation(event) {
    event.stopImmediatePropagation();
  }
  
  function noevent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  
  function nodrag(view) {
    var root = view.document.documentElement,
        selection = d3Selection.select(view).on("dragstart.drag", noevent, true);
    if ("onselectstart" in root) {
      selection.on("selectstart.drag", noevent, true);
    } else {
      root.__noselect = root.style.MozUserSelect;
      root.style.MozUserSelect = "none";
    }
  }
  
  function yesdrag(view, noclick) {
    var root = view.document.documentElement,
        selection = d3Selection.select(view).on("dragstart.drag", null);
    if (noclick) {
      selection.on("click.drag", noevent, true);
      setTimeout(function() { selection.on("click.drag", null); }, 0);
    }
    if ("onselectstart" in root) {
      selection.on("selectstart.drag", null);
    } else {
      root.style.MozUserSelect = root.__noselect;
      delete root.__noselect;
    }
  }
  
  var constant = x => () => x;
  
  function DragEvent(type, {
    sourceEvent,
    subject,
    target,
    identifier,
    active,
    x, y, dx, dy,
    dispatch
  }) {
    Object.defineProperties(this, {
      type: {value: type, enumerable: true, configurable: true},
      sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
      subject: {value: subject, enumerable: true, configurable: true},
      target: {value: target, enumerable: true, configurable: true},
      identifier: {value: identifier, enumerable: true, configurable: true},
      active: {value: active, enumerable: true, configurable: true},
      x: {value: x, enumerable: true, configurable: true},
      y: {value: y, enumerable: true, configurable: true},
      dx: {value: dx, enumerable: true, configurable: true},
      dy: {value: dy, enumerable: true, configurable: true},
      _: {value: dispatch}
    });
  }
  
  DragEvent.prototype.on = function() {
    var value = this._.on.apply(this._, arguments);
    return value === this._ ? this : value;
  };
  
  // Ignore right-click, since that should open the context menu.
  function defaultFilter(event) {
    return !event.ctrlKey && !event.button;
  }
  
  function defaultContainer() {
    return this.parentNode;
  }
  
  function defaultSubject(event, d) {
    return d == null ? {x: event.x, y: event.y} : d;
  }
  
  function defaultTouchable() {
    return navigator.maxTouchPoints || ("ontouchstart" in this);
  }
  
  function drag() {
    var filter = defaultFilter,
        container = defaultContainer,
        subject = defaultSubject,
        touchable = defaultTouchable,
        gestures = {},
        listeners = d3Dispatch.dispatch("start", "drag", "end"),
        active = 0,
        mousedownx,
        mousedowny,
        mousemoving,
        touchending,
        clickDistance2 = 0;
  
    function drag(selection) {
      selection
          .on("mousedown.drag", mousedowned)
        .filter(touchable)
          .on("touchstart.drag", touchstarted)
          .on("touchmove.drag", touchmoved)
          .on("touchend.drag touchcancel.drag", touchended)
          .style("touch-action", "none")
          .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
  
    function mousedowned(event, d) {
      if (touchending || !filter.call(this, event, d)) return;
      var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
      if (!gesture) return;
      d3Selection.select(event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
      nodrag(event.view);
      nopropagation(event);
      mousemoving = false;
      mousedownx = event.clientX;
      mousedowny = event.clientY;
      gesture("start", event);
    }
  
    function mousemoved(event) {
      noevent(event);
      if (!mousemoving) {
        var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
        mousemoving = dx * dx + dy * dy > clickDistance2;
      }
      gestures.mouse("drag", event);
    }
  
    function mouseupped(event) {
      d3Selection.select(event.view).on("mousemove.drag mouseup.drag", null);
      yesdrag(event.view, mousemoving);
      noevent(event);
      gestures.mouse("end", event);
    }
  
    function touchstarted(event, d) {
      if (!filter.call(this, event, d)) return;
      var touches = event.changedTouches,
          c = container.call(this, event, d),
          n = touches.length, i, gesture;
  
      for (i = 0; i < n; ++i) {
        if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
          nopropagation(event);
          gesture("start", event, touches[i]);
        }
      }
    }
  
    function touchmoved(event) {
      var touches = event.changedTouches,
          n = touches.length, i, gesture;
  
      for (i = 0; i < n; ++i) {
        if (gesture = gestures[touches[i].identifier]) {
          noevent(event);
          gesture("drag", event, touches[i]);
        }
      }
    }
  
    function touchended(event) {
      var touches = event.changedTouches,
          n = touches.length, i, gesture;
  
      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
      for (i = 0; i < n; ++i) {
        if (gesture = gestures[touches[i].identifier]) {
          nopropagation(event);
          gesture("end", event, touches[i]);
        }
      }
    }
  
    function beforestart(that, container, event, d, identifier, touch) {
      var dispatch = listeners.copy(),
          p = d3Selection.pointer(touch || event, container), dx, dy,
          s;
  
      if ((s = subject.call(that, new DragEvent("beforestart", {
          sourceEvent: event,
          target: drag,
          identifier,
          active,
          x: p[0],
          y: p[1],
          dx: 0,
          dy: 0,
          dispatch
        }), d)) == null) return;
  
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
  
      return function gesture(type, event, touch) {
        var p0 = p, n;
        switch (type) {
          case "start": gestures[identifier] = gesture, n = active++; break;
          case "end": delete gestures[identifier], --active; // nobreak
          case "drag": p = d3Selection.pointer(touch || event, container), n = active; break;
        }
        dispatch.call(
          type,
          that,
          new DragEvent(type, {
            sourceEvent: event,
            subject: s,
            target: drag,
            identifier,
            active: n,
            x: p[0] + dx,
            y: p[1] + dy,
            dx: p[0] - p0[0],
            dy: p[1] - p0[1],
            dispatch
          }),
          d
        );
      };
    }
  
    drag.filter = function(_) {
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), drag) : filter;
    };
  
    drag.container = function(_) {
      return arguments.length ? (container = typeof _ === "function" ? _ : constant(_), drag) : container;
    };
  
    drag.subject = function(_) {
      return arguments.length ? (subject = typeof _ === "function" ? _ : constant(_), drag) : subject;
    };
  
    drag.touchable = function(_) {
      return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), drag) : touchable;
    };
  
    drag.on = function() {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? drag : value;
    };
  
    drag.clickDistance = function(_) {
      return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
    };
  
    return drag;
  }
  
  exports.drag = drag;
  exports.dragDisable = nodrag;
  exports.dragEnable = yesdrag;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  
  },{"d3-dispatch":4,"d3-selection":9}],6:[function(require,module,exports){
  // https://d3js.org/d3-ease/ v2.0.0 Copyright 2020 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}));
  }(this, function (exports) { 'use strict';
  
  const linear = t => +t;
  
  function quadIn(t) {
    return t * t;
  }
  
  function quadOut(t) {
    return t * (2 - t);
  }
  
  function quadInOut(t) {
    return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
  }
  
  function cubicIn(t) {
    return t * t * t;
  }
  
  function cubicOut(t) {
    return --t * t * t + 1;
  }
  
  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }
  
  var exponent = 3;
  
  var polyIn = (function custom(e) {
    e = +e;
  
    function polyIn(t) {
      return Math.pow(t, e);
    }
  
    polyIn.exponent = custom;
  
    return polyIn;
  })(exponent);
  
  var polyOut = (function custom(e) {
    e = +e;
  
    function polyOut(t) {
      return 1 - Math.pow(1 - t, e);
    }
  
    polyOut.exponent = custom;
  
    return polyOut;
  })(exponent);
  
  var polyInOut = (function custom(e) {
    e = +e;
  
    function polyInOut(t) {
      return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
    }
  
    polyInOut.exponent = custom;
  
    return polyInOut;
  })(exponent);
  
  var pi = Math.PI,
      halfPi = pi / 2;
  
  function sinIn(t) {
    return (+t === 1) ? 1 : 1 - Math.cos(t * halfPi);
  }
  
  function sinOut(t) {
    return Math.sin(t * halfPi);
  }
  
  function sinInOut(t) {
    return (1 - Math.cos(pi * t)) / 2;
  }
  
  // tpmt is two power minus ten times t scaled to [0,1]
  function tpmt(x) {
    return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
  }
  
  function expIn(t) {
    return tpmt(1 - +t);
  }
  
  function expOut(t) {
    return 1 - tpmt(t);
  }
  
  function expInOut(t) {
    return ((t *= 2) <= 1 ? tpmt(1 - t) : 2 - tpmt(t - 1)) / 2;
  }
  
  function circleIn(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
  
  function circleOut(t) {
    return Math.sqrt(1 - --t * t);
  }
  
  function circleInOut(t) {
    return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
  }
  
  var b1 = 4 / 11,
      b2 = 6 / 11,
      b3 = 8 / 11,
      b4 = 3 / 4,
      b5 = 9 / 11,
      b6 = 10 / 11,
      b7 = 15 / 16,
      b8 = 21 / 22,
      b9 = 63 / 64,
      b0 = 1 / b1 / b1;
  
  function bounceIn(t) {
    return 1 - bounceOut(1 - t);
  }
  
  function bounceOut(t) {
    return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
  }
  
  function bounceInOut(t) {
    return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
  }
  
  var overshoot = 1.70158;
  
  var backIn = (function custom(s) {
    s = +s;
  
    function backIn(t) {
      return (t = +t) * t * (s * (t - 1) + t);
    }
  
    backIn.overshoot = custom;
  
    return backIn;
  })(overshoot);
  
  var backOut = (function custom(s) {
    s = +s;
  
    function backOut(t) {
      return --t * t * ((t + 1) * s + t) + 1;
    }
  
    backOut.overshoot = custom;
  
    return backOut;
  })(overshoot);
  
  var backInOut = (function custom(s) {
    s = +s;
  
    function backInOut(t) {
      return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
    }
  
    backInOut.overshoot = custom;
  
    return backInOut;
  })(overshoot);
  
  var tau = 2 * Math.PI,
      amplitude = 1,
      period = 0.3;
  
  var elasticIn = (function custom(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  
    function elasticIn(t) {
      return a * tpmt(-(--t)) * Math.sin((s - t) / p);
    }
  
    elasticIn.amplitude = function(a) { return custom(a, p * tau); };
    elasticIn.period = function(p) { return custom(a, p); };
  
    return elasticIn;
  })(amplitude, period);
  
  var elasticOut = (function custom(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  
    function elasticOut(t) {
      return 1 - a * tpmt(t = +t) * Math.sin((t + s) / p);
    }
  
    elasticOut.amplitude = function(a) { return custom(a, p * tau); };
    elasticOut.period = function(p) { return custom(a, p); };
  
    return elasticOut;
  })(amplitude, period);
  
  var elasticInOut = (function custom(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  
    function elasticInOut(t) {
      return ((t = t * 2 - 1) < 0
          ? a * tpmt(-t) * Math.sin((s - t) / p)
          : 2 - a * tpmt(t) * Math.sin((s + t) / p)) / 2;
    }
  
    elasticInOut.amplitude = function(a) { return custom(a, p * tau); };
    elasticInOut.period = function(p) { return custom(a, p); };
  
    return elasticInOut;
  })(amplitude, period);
  
  exports.easeBack = backInOut;
  exports.easeBackIn = backIn;
  exports.easeBackInOut = backInOut;
  exports.easeBackOut = backOut;
  exports.easeBounce = bounceOut;
  exports.easeBounceIn = bounceIn;
  exports.easeBounceInOut = bounceInOut;
  exports.easeBounceOut = bounceOut;
  exports.easeCircle = circleInOut;
  exports.easeCircleIn = circleIn;
  exports.easeCircleInOut = circleInOut;
  exports.easeCircleOut = circleOut;
  exports.easeCubic = cubicInOut;
  exports.easeCubicIn = cubicIn;
  exports.easeCubicInOut = cubicInOut;
  exports.easeCubicOut = cubicOut;
  exports.easeElastic = elasticOut;
  exports.easeElasticIn = elasticIn;
  exports.easeElasticInOut = elasticInOut;
  exports.easeElasticOut = elasticOut;
  exports.easeExp = expInOut;
  exports.easeExpIn = expIn;
  exports.easeExpInOut = expInOut;
  exports.easeExpOut = expOut;
  exports.easeLinear = linear;
  exports.easePoly = polyInOut;
  exports.easePolyIn = polyIn;
  exports.easePolyInOut = polyInOut;
  exports.easePolyOut = polyOut;
  exports.easeQuad = quadInOut;
  exports.easeQuadIn = quadIn;
  exports.easeQuadInOut = quadInOut;
  exports.easeQuadOut = quadOut;
  exports.easeSin = sinInOut;
  exports.easeSinIn = sinIn;
  exports.easeSinInOut = sinInOut;
  exports.easeSinOut = sinOut;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  
  },{}],7:[function(require,module,exports){
  // https://d3js.org/d3-geo/ v2.0.2 Copyright 2021 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-array'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}, global.d3));
  }(this, function (exports, d3Array) { 'use strict';
  
  var epsilon = 1e-6;
  var epsilon2 = 1e-12;
  var pi = Math.PI;
  var halfPi = pi / 2;
  var quarterPi = pi / 4;
  var tau = pi * 2;
  
  var degrees = 180 / pi;
  var radians = pi / 180;
  
  var abs = Math.abs;
  var atan = Math.atan;
  var atan2 = Math.atan2;
  var cos = Math.cos;
  var ceil = Math.ceil;
  var exp = Math.exp;
  var hypot = Math.hypot;
  var log = Math.log;
  var pow = Math.pow;
  var sin = Math.sin;
  var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
  var sqrt = Math.sqrt;
  var tan = Math.tan;
  
  function acos(x) {
    return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
  }
  
  function asin(x) {
    return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
  }
  
  function haversin(x) {
    return (x = sin(x / 2)) * x;
  }
  
  function noop() {}
  
  function streamGeometry(geometry, stream) {
    if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
      streamGeometryType[geometry.type](geometry, stream);
    }
  }
  
  var streamObjectType = {
    Feature: function(object, stream) {
      streamGeometry(object.geometry, stream);
    },
    FeatureCollection: function(object, stream) {
      var features = object.features, i = -1, n = features.length;
      while (++i < n) streamGeometry(features[i].geometry, stream);
    }
  };
  
  var streamGeometryType = {
    Sphere: function(object, stream) {
      stream.sphere();
    },
    Point: function(object, stream) {
      object = object.coordinates;
      stream.point(object[0], object[1], object[2]);
    },
    MultiPoint: function(object, stream) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
    },
    LineString: function(object, stream) {
      streamLine(object.coordinates, stream, 0);
    },
    MultiLineString: function(object, stream) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) streamLine(coordinates[i], stream, 0);
    },
    Polygon: function(object, stream) {
      streamPolygon(object.coordinates, stream);
    },
    MultiPolygon: function(object, stream) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) streamPolygon(coordinates[i], stream);
    },
    GeometryCollection: function(object, stream) {
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) streamGeometry(geometries[i], stream);
    }
  };
  
  function streamLine(coordinates, stream, closed) {
    var i = -1, n = coordinates.length - closed, coordinate;
    stream.lineStart();
    while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
    stream.lineEnd();
  }
  
  function streamPolygon(coordinates, stream) {
    var i = -1, n = coordinates.length;
    stream.polygonStart();
    while (++i < n) streamLine(coordinates[i], stream, 1);
    stream.polygonEnd();
  }
  
  function geoStream(object, stream) {
    if (object && streamObjectType.hasOwnProperty(object.type)) {
      streamObjectType[object.type](object, stream);
    } else {
      streamGeometry(object, stream);
    }
  }
  
  var areaRingSum = new d3Array.Adder();
  
  // hello?
  
  var areaSum = new d3Array.Adder(),
      lambda00,
      phi00,
      lambda0,
      cosPhi0,
      sinPhi0;
  
  var areaStream = {
    point: noop,
    lineStart: noop,
    lineEnd: noop,
    polygonStart: function() {
      areaRingSum = new d3Array.Adder();
      areaStream.lineStart = areaRingStart;
      areaStream.lineEnd = areaRingEnd;
    },
    polygonEnd: function() {
      var areaRing = +areaRingSum;
      areaSum.add(areaRing < 0 ? tau + areaRing : areaRing);
      this.lineStart = this.lineEnd = this.point = noop;
    },
    sphere: function() {
      areaSum.add(tau);
    }
  };
  
  function areaRingStart() {
    areaStream.point = areaPointFirst;
  }
  
  function areaRingEnd() {
    areaPoint(lambda00, phi00);
  }
  
  function areaPointFirst(lambda, phi) {
    areaStream.point = areaPoint;
    lambda00 = lambda, phi00 = phi;
    lambda *= radians, phi *= radians;
    lambda0 = lambda, cosPhi0 = cos(phi = phi / 2 + quarterPi), sinPhi0 = sin(phi);
  }
  
  function areaPoint(lambda, phi) {
    lambda *= radians, phi *= radians;
    phi = phi / 2 + quarterPi; // half the angular distance from south pole
  
    // Spherical excess E for a spherical triangle with vertices: south pole,
    // previous point, current point.  Uses a formula derived from Cagnoli’s
    // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
    var dLambda = lambda - lambda0,
        sdLambda = dLambda >= 0 ? 1 : -1,
        adLambda = sdLambda * dLambda,
        cosPhi = cos(phi),
        sinPhi = sin(phi),
        k = sinPhi0 * sinPhi,
        u = cosPhi0 * cosPhi + k * cos(adLambda),
        v = k * sdLambda * sin(adLambda);
    areaRingSum.add(atan2(v, u));
  
    // Advance the previous points.
    lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
  }
  
  function area(object) {
    areaSum = new d3Array.Adder();
    geoStream(object, areaStream);
    return areaSum * 2;
  }
  
  function spherical(cartesian) {
    return [atan2(cartesian[1], cartesian[0]), asin(cartesian[2])];
  }
  
  function cartesian(spherical) {
    var lambda = spherical[0], phi = spherical[1], cosPhi = cos(phi);
    return [cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi)];
  }
  
  function cartesianDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  
  function cartesianCross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  
  // TODO return a
  function cartesianAddInPlace(a, b) {
    a[0] += b[0], a[1] += b[1], a[2] += b[2];
  }
  
  function cartesianScale(vector, k) {
    return [vector[0] * k, vector[1] * k, vector[2] * k];
  }
  
  // TODO return d
  function cartesianNormalizeInPlace(d) {
    var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l, d[1] /= l, d[2] /= l;
  }
  
  var lambda0$1, phi0, lambda1, phi1, // bounds
      lambda2, // previous lambda-coordinate
      lambda00$1, phi00$1, // first point
      p0, // previous 3D point
      deltaSum,
      ranges,
      range;
  
  var boundsStream = {
    point: boundsPoint,
    lineStart: boundsLineStart,
    lineEnd: boundsLineEnd,
    polygonStart: function() {
      boundsStream.point = boundsRingPoint;
      boundsStream.lineStart = boundsRingStart;
      boundsStream.lineEnd = boundsRingEnd;
      deltaSum = new d3Array.Adder();
      areaStream.polygonStart();
    },
    polygonEnd: function() {
      areaStream.polygonEnd();
      boundsStream.point = boundsPoint;
      boundsStream.lineStart = boundsLineStart;
      boundsStream.lineEnd = boundsLineEnd;
      if (areaRingSum < 0) lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
      else if (deltaSum > epsilon) phi1 = 90;
      else if (deltaSum < -epsilon) phi0 = -90;
      range[0] = lambda0$1, range[1] = lambda1;
    },
    sphere: function() {
      lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
    }
  };
  
  function boundsPoint(lambda, phi) {
    ranges.push(range = [lambda0$1 = lambda, lambda1 = lambda]);
    if (phi < phi0) phi0 = phi;
    if (phi > phi1) phi1 = phi;
  }
  
  function linePoint(lambda, phi) {
    var p = cartesian([lambda * radians, phi * radians]);
    if (p0) {
      var normal = cartesianCross(p0, p),
          equatorial = [normal[1], -normal[0], 0],
          inflection = cartesianCross(equatorial, normal);
      cartesianNormalizeInPlace(inflection);
      inflection = spherical(inflection);
      var delta = lambda - lambda2,
          sign = delta > 0 ? 1 : -1,
          lambdai = inflection[0] * degrees * sign,
          phii,
          antimeridian = abs(delta) > 180;
      if (antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda)) {
        phii = inflection[1] * degrees;
        if (phii > phi1) phi1 = phii;
      } else if (lambdai = (lambdai + 360) % 360 - 180, antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda)) {
        phii = -inflection[1] * degrees;
        if (phii < phi0) phi0 = phii;
      } else {
        if (phi < phi0) phi0 = phi;
        if (phi > phi1) phi1 = phi;
      }
      if (antimeridian) {
        if (lambda < lambda2) {
          if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
        } else {
          if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
        }
      } else {
        if (lambda1 >= lambda0$1) {
          if (lambda < lambda0$1) lambda0$1 = lambda;
          if (lambda > lambda1) lambda1 = lambda;
        } else {
          if (lambda > lambda2) {
            if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
          } else {
            if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
          }
        }
      }
    } else {
      ranges.push(range = [lambda0$1 = lambda, lambda1 = lambda]);
    }
    if (phi < phi0) phi0 = phi;
    if (phi > phi1) phi1 = phi;
    p0 = p, lambda2 = lambda;
  }
  
  function boundsLineStart() {
    boundsStream.point = linePoint;
  }
  
  function boundsLineEnd() {
    range[0] = lambda0$1, range[1] = lambda1;
    boundsStream.point = boundsPoint;
    p0 = null;
  }
  
  function boundsRingPoint(lambda, phi) {
    if (p0) {
      var delta = lambda - lambda2;
      deltaSum.add(abs(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
    } else {
      lambda00$1 = lambda, phi00$1 = phi;
    }
    areaStream.point(lambda, phi);
    linePoint(lambda, phi);
  }
  
  function boundsRingStart() {
    areaStream.lineStart();
  }
  
  function boundsRingEnd() {
    boundsRingPoint(lambda00$1, phi00$1);
    areaStream.lineEnd();
    if (abs(deltaSum) > epsilon) lambda0$1 = -(lambda1 = 180);
    range[0] = lambda0$1, range[1] = lambda1;
    p0 = null;
  }
  
  // Finds the left-right distance between two longitudes.
  // This is almost the same as (lambda1 - lambda0 + 360°) % 360°, except that we want
  // the distance between ±180° to be 360°.
  function angle(lambda0, lambda1) {
    return (lambda1 -= lambda0) < 0 ? lambda1 + 360 : lambda1;
  }
  
  function rangeCompare(a, b) {
    return a[0] - b[0];
  }
  
  function rangeContains(range, x) {
    return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
  }
  
  function bounds(feature) {
    var i, n, a, b, merged, deltaMax, delta;
  
    phi1 = lambda1 = -(lambda0$1 = phi0 = Infinity);
    ranges = [];
    geoStream(feature, boundsStream);
  
    // First, sort ranges by their minimum longitudes.
    if (n = ranges.length) {
      ranges.sort(rangeCompare);
  
      // Then, merge any ranges that overlap.
      for (i = 1, a = ranges[0], merged = [a]; i < n; ++i) {
        b = ranges[i];
        if (rangeContains(a, b[0]) || rangeContains(a, b[1])) {
          if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
          if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
        } else {
          merged.push(a = b);
        }
      }
  
      // Finally, find the largest gap between the merged ranges.
      // The final bounding box will be the inverse of this gap.
      for (deltaMax = -Infinity, n = merged.length - 1, i = 0, a = merged[n]; i <= n; a = b, ++i) {
        b = merged[i];
        if ((delta = angle(a[1], b[0])) > deltaMax) deltaMax = delta, lambda0$1 = b[0], lambda1 = a[1];
      }
    }
  
    ranges = range = null;
  
    return lambda0$1 === Infinity || phi0 === Infinity
        ? [[NaN, NaN], [NaN, NaN]]
        : [[lambda0$1, phi0], [lambda1, phi1]];
  }
  
  var W0, W1,
      X0, Y0, Z0,
      X1, Y1, Z1,
      X2, Y2, Z2,
      lambda00$2, phi00$2, // first point
      x0, y0, z0; // previous point
  
  var centroidStream = {
    sphere: noop,
    point: centroidPoint,
    lineStart: centroidLineStart,
    lineEnd: centroidLineEnd,
    polygonStart: function() {
      centroidStream.lineStart = centroidRingStart;
      centroidStream.lineEnd = centroidRingEnd;
    },
    polygonEnd: function() {
      centroidStream.lineStart = centroidLineStart;
      centroidStream.lineEnd = centroidLineEnd;
    }
  };
  
  // Arithmetic mean of Cartesian vectors.
  function centroidPoint(lambda, phi) {
    lambda *= radians, phi *= radians;
    var cosPhi = cos(phi);
    centroidPointCartesian(cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi));
  }
  
  function centroidPointCartesian(x, y, z) {
    ++W0;
    X0 += (x - X0) / W0;
    Y0 += (y - Y0) / W0;
    Z0 += (z - Z0) / W0;
  }
  
  function centroidLineStart() {
    centroidStream.point = centroidLinePointFirst;
  }
  
  function centroidLinePointFirst(lambda, phi) {
    lambda *= radians, phi *= radians;
    var cosPhi = cos(phi);
    x0 = cosPhi * cos(lambda);
    y0 = cosPhi * sin(lambda);
    z0 = sin(phi);
    centroidStream.point = centroidLinePoint;
    centroidPointCartesian(x0, y0, z0);
  }
  
  function centroidLinePoint(lambda, phi) {
    lambda *= radians, phi *= radians;
    var cosPhi = cos(phi),
        x = cosPhi * cos(lambda),
        y = cosPhi * sin(lambda),
        z = sin(phi),
        w = atan2(sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
    W1 += w;
    X1 += w * (x0 + (x0 = x));
    Y1 += w * (y0 + (y0 = y));
    Z1 += w * (z0 + (z0 = z));
    centroidPointCartesian(x0, y0, z0);
  }
  
  function centroidLineEnd() {
    centroidStream.point = centroidPoint;
  }
  
  // See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
  // J. Applied Mechanics 42, 239 (1975).
  function centroidRingStart() {
    centroidStream.point = centroidRingPointFirst;
  }
  
  function centroidRingEnd() {
    centroidRingPoint(lambda00$2, phi00$2);
    centroidStream.point = centroidPoint;
  }
  
  function centroidRingPointFirst(lambda, phi) {
    lambda00$2 = lambda, phi00$2 = phi;
    lambda *= radians, phi *= radians;
    centroidStream.point = centroidRingPoint;
    var cosPhi = cos(phi);
    x0 = cosPhi * cos(lambda);
    y0 = cosPhi * sin(lambda);
    z0 = sin(phi);
    centroidPointCartesian(x0, y0, z0);
  }
  
  function centroidRingPoint(lambda, phi) {
    lambda *= radians, phi *= radians;
    var cosPhi = cos(phi),
        x = cosPhi * cos(lambda),
        y = cosPhi * sin(lambda),
        z = sin(phi),
        cx = y0 * z - z0 * y,
        cy = z0 * x - x0 * z,
        cz = x0 * y - y0 * x,
        m = hypot(cx, cy, cz),
        w = asin(m), // line weight = angle
        v = m && -w / m; // area weight multiplier
    X2.add(v * cx);
    Y2.add(v * cy);
    Z2.add(v * cz);
    W1 += w;
    X1 += w * (x0 + (x0 = x));
    Y1 += w * (y0 + (y0 = y));
    Z1 += w * (z0 + (z0 = z));
    centroidPointCartesian(x0, y0, z0);
  }
  
  function centroid(object) {
    W0 = W1 =
    X0 = Y0 = Z0 =
    X1 = Y1 = Z1 = 0;
    X2 = new d3Array.Adder();
    Y2 = new d3Array.Adder();
    Z2 = new d3Array.Adder();
    geoStream(object, centroidStream);
  
    var x = +X2,
        y = +Y2,
        z = +Z2,
        m = hypot(x, y, z);
  
    // If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.
    if (m < epsilon2) {
      x = X1, y = Y1, z = Z1;
      // If the feature has zero length, fall back to arithmetic mean of point vectors.
      if (W1 < epsilon) x = X0, y = Y0, z = Z0;
      m = hypot(x, y, z);
      // If the feature still has an undefined ccentroid, then return.
      if (m < epsilon2) return [NaN, NaN];
    }
  
    return [atan2(y, x) * degrees, asin(z / m) * degrees];
  }
  
  function constant(x) {
    return function() {
      return x;
    };
  }
  
  function compose(a, b) {
  
    function compose(x, y) {
      return x = a(x, y), b(x[0], x[1]);
    }
  
    if (a.invert && b.invert) compose.invert = function(x, y) {
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };
  
    return compose;
  }
  
  function rotationIdentity(lambda, phi) {
    return [abs(lambda) > pi ? lambda + Math.round(-lambda / tau) * tau : lambda, phi];
  }
  
  rotationIdentity.invert = rotationIdentity;
  
  function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
    return (deltaLambda %= tau) ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
      : rotationLambda(deltaLambda))
      : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
      : rotationIdentity);
  }
  
  function forwardRotationLambda(deltaLambda) {
    return function(lambda, phi) {
      return lambda += deltaLambda, [lambda > pi ? lambda - tau : lambda < -pi ? lambda + tau : lambda, phi];
    };
  }
  
  function rotationLambda(deltaLambda) {
    var rotation = forwardRotationLambda(deltaLambda);
    rotation.invert = forwardRotationLambda(-deltaLambda);
    return rotation;
  }
  
  function rotationPhiGamma(deltaPhi, deltaGamma) {
    var cosDeltaPhi = cos(deltaPhi),
        sinDeltaPhi = sin(deltaPhi),
        cosDeltaGamma = cos(deltaGamma),
        sinDeltaGamma = sin(deltaGamma);
  
    function rotation(lambda, phi) {
      var cosPhi = cos(phi),
          x = cos(lambda) * cosPhi,
          y = sin(lambda) * cosPhi,
          z = sin(phi),
          k = z * cosDeltaPhi + x * sinDeltaPhi;
      return [
        atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
        asin(k * cosDeltaGamma + y * sinDeltaGamma)
      ];
    }
  
    rotation.invert = function(lambda, phi) {
      var cosPhi = cos(phi),
          x = cos(lambda) * cosPhi,
          y = sin(lambda) * cosPhi,
          z = sin(phi),
          k = z * cosDeltaGamma - y * sinDeltaGamma;
      return [
        atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
        asin(k * cosDeltaPhi - x * sinDeltaPhi)
      ];
    };
  
    return rotation;
  }
  
  function rotation(rotate) {
    rotate = rotateRadians(rotate[0] * radians, rotate[1] * radians, rotate.length > 2 ? rotate[2] * radians : 0);
  
    function forward(coordinates) {
      coordinates = rotate(coordinates[0] * radians, coordinates[1] * radians);
      return coordinates[0] *= degrees, coordinates[1] *= degrees, coordinates;
    }
  
    forward.invert = function(coordinates) {
      coordinates = rotate.invert(coordinates[0] * radians, coordinates[1] * radians);
      return coordinates[0] *= degrees, coordinates[1] *= degrees, coordinates;
    };
  
    return forward;
  }
  
  // Generates a circle centered at [0°, 0°], with a given radius and precision.
  function circleStream(stream, radius, delta, direction, t0, t1) {
    if (!delta) return;
    var cosRadius = cos(radius),
        sinRadius = sin(radius),
        step = direction * delta;
    if (t0 == null) {
      t0 = radius + direction * tau;
      t1 = radius - step / 2;
    } else {
      t0 = circleRadius(cosRadius, t0);
      t1 = circleRadius(cosRadius, t1);
      if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * tau;
    }
    for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
      point = spherical([cosRadius, -sinRadius * cos(t), -sinRadius * sin(t)]);
      stream.point(point[0], point[1]);
    }
  }
  
  // Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
  function circleRadius(cosRadius, point) {
    point = cartesian(point), point[0] -= cosRadius;
    cartesianNormalizeInPlace(point);
    var radius = acos(-point[1]);
    return ((-point[2] < 0 ? -radius : radius) + tau - epsilon) % tau;
  }
  
  function circle() {
    var center = constant([0, 0]),
        radius = constant(90),
        precision = constant(6),
        ring,
        rotate,
        stream = {point: point};
  
    function point(x, y) {
      ring.push(x = rotate(x, y));
      x[0] *= degrees, x[1] *= degrees;
    }
  
    function circle() {
      var c = center.apply(this, arguments),
          r = radius.apply(this, arguments) * radians,
          p = precision.apply(this, arguments) * radians;
      ring = [];
      rotate = rotateRadians(-c[0] * radians, -c[1] * radians, 0).invert;
      circleStream(stream, r, p, 1);
      c = {type: "Polygon", coordinates: [ring]};
      ring = rotate = null;
      return c;
    }
  
    circle.center = function(_) {
      return arguments.length ? (center = typeof _ === "function" ? _ : constant([+_[0], +_[1]]), circle) : center;
    };
  
    circle.radius = function(_) {
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), circle) : radius;
    };
  
    circle.precision = function(_) {
      return arguments.length ? (precision = typeof _ === "function" ? _ : constant(+_), circle) : precision;
    };
  
    return circle;
  }
  
  function clipBuffer() {
    var lines = [],
        line;
    return {
      point: function(x, y, m) {
        line.push([x, y, m]);
      },
      lineStart: function() {
        lines.push(line = []);
      },
      lineEnd: noop,
      rejoin: function() {
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
      },
      result: function() {
        var result = lines;
        lines = [];
        line = null;
        return result;
      }
    };
  }
  
  function pointEqual(a, b) {
    return abs(a[0] - b[0]) < epsilon && abs(a[1] - b[1]) < epsilon;
  }
  
  function Intersection(point, points, other, entry) {
    this.x = point;
    this.z = points;
    this.o = other; // another intersection
    this.e = entry; // is an entry?
    this.v = false; // visited
    this.n = this.p = null; // next & previous
  }
  
  // A generalized polygon clipping algorithm: given a polygon that has been cut
  // into its visible line segments, and rejoins the segments by interpolating
  // along the clip edge.
  function clipRejoin(segments, compareIntersection, startInside, interpolate, stream) {
    var subject = [],
        clip = [],
        i,
        n;
  
    segments.forEach(function(segment) {
      if ((n = segment.length - 1) <= 0) return;
      var n, p0 = segment[0], p1 = segment[n], x;
  
      if (pointEqual(p0, p1)) {
        if (!p0[2] && !p1[2]) {
          stream.lineStart();
          for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
          stream.lineEnd();
          return;
        }
        // handle degenerate cases by moving the point
        p1[0] += 2 * epsilon;
      }
  
      subject.push(x = new Intersection(p0, segment, null, true));
      clip.push(x.o = new Intersection(p0, null, x, false));
      subject.push(x = new Intersection(p1, segment, null, false));
      clip.push(x.o = new Intersection(p1, null, x, true));
    });
  
    if (!subject.length) return;
  
    clip.sort(compareIntersection);
    link(subject);
    link(clip);
  
    for (i = 0, n = clip.length; i < n; ++i) {
      clip[i].e = startInside = !startInside;
    }
  
    var start = subject[0],
        points,
        point;
  
    while (1) {
      // Find first unvisited intersection.
      var current = start,
          isSubject = true;
      while (current.v) if ((current = current.n) === start) return;
      points = current.z;
      stream.lineStart();
      do {
        current.v = current.o.v = true;
        if (current.e) {
          if (isSubject) {
            for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.n.x, 1, stream);
          }
          current = current.n;
        } else {
          if (isSubject) {
            points = current.p.z;
            for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.p.x, -1, stream);
          }
          current = current.p;
        }
        current = current.o;
        points = current.z;
        isSubject = !isSubject;
      } while (!current.v);
      stream.lineEnd();
    }
  }
  
  function link(array) {
    if (!(n = array.length)) return;
    var n,
        i = 0,
        a = array[0],
        b;
    while (++i < n) {
      a.n = b = array[i];
      b.p = a;
      a = b;
    }
    a.n = b = array[0];
    b.p = a;
  }
  
  function longitude(point) {
    if (abs(point[0]) <= pi)
      return point[0];
    else
      return sign(point[0]) * ((abs(point[0]) + pi) % tau - pi);
  }
  
  function polygonContains(polygon, point) {
    var lambda = longitude(point),
        phi = point[1],
        sinPhi = sin(phi),
        normal = [sin(lambda), -cos(lambda), 0],
        angle = 0,
        winding = 0;
  
    var sum = new d3Array.Adder();
  
    if (sinPhi === 1) phi = halfPi + epsilon;
    else if (sinPhi === -1) phi = -halfPi - epsilon;
  
    for (var i = 0, n = polygon.length; i < n; ++i) {
      if (!(m = (ring = polygon[i]).length)) continue;
      var ring,
          m,
          point0 = ring[m - 1],
          lambda0 = longitude(point0),
          phi0 = point0[1] / 2 + quarterPi,
          sinPhi0 = sin(phi0),
          cosPhi0 = cos(phi0);
  
      for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
        var point1 = ring[j],
            lambda1 = longitude(point1),
            phi1 = point1[1] / 2 + quarterPi,
            sinPhi1 = sin(phi1),
            cosPhi1 = cos(phi1),
            delta = lambda1 - lambda0,
            sign = delta >= 0 ? 1 : -1,
            absDelta = sign * delta,
            antimeridian = absDelta > pi,
            k = sinPhi0 * sinPhi1;
  
        sum.add(atan2(k * sign * sin(absDelta), cosPhi0 * cosPhi1 + k * cos(absDelta)));
        angle += antimeridian ? delta + sign * tau : delta;
  
        // Are the longitudes either side of the point’s meridian (lambda),
        // and are the latitudes smaller than the parallel (phi)?
        if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
          var arc = cartesianCross(cartesian(point0), cartesian(point1));
          cartesianNormalizeInPlace(arc);
          var intersection = cartesianCross(normal, arc);
          cartesianNormalizeInPlace(intersection);
          var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
          if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
            winding += antimeridian ^ delta >= 0 ? 1 : -1;
          }
        }
      }
    }
  
    // First, determine whether the South pole is inside or outside:
    //
    // It is inside if:
    // * the polygon winds around it in a clockwise direction.
    // * the polygon does not (cumulatively) wind around it, but has a negative
    //   (counter-clockwise) area.
    //
    // Second, count the (signed) number of times a segment crosses a lambda
    // from the point to the South pole.  If it is zero, then the point is the
    // same side as the South pole.
  
    return (angle < -epsilon || angle < epsilon && sum < -epsilon2) ^ (winding & 1);
  }
  
  function clip(pointVisible, clipLine, interpolate, start) {
    return function(sink) {
      var line = clipLine(sink),
          ringBuffer = clipBuffer(),
          ringSink = clipLine(ringBuffer),
          polygonStarted = false,
          polygon,
          segments,
          ring;
  
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          clip.point = pointRing;
          clip.lineStart = ringStart;
          clip.lineEnd = ringEnd;
          segments = [];
          polygon = [];
        },
        polygonEnd: function() {
          clip.point = point;
          clip.lineStart = lineStart;
          clip.lineEnd = lineEnd;
          segments = d3Array.merge(segments);
          var startInside = polygonContains(polygon, start);
          if (segments.length) {
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            clipRejoin(segments, compareIntersection, startInside, interpolate, sink);
          } else if (startInside) {
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            sink.lineStart();
            interpolate(null, null, 1, sink);
            sink.lineEnd();
          }
          if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
          segments = polygon = null;
        },
        sphere: function() {
          sink.polygonStart();
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
          sink.polygonEnd();
        }
      };
  
      function point(lambda, phi) {
        if (pointVisible(lambda, phi)) sink.point(lambda, phi);
      }
  
      function pointLine(lambda, phi) {
        line.point(lambda, phi);
      }
  
      function lineStart() {
        clip.point = pointLine;
        line.lineStart();
      }
  
      function lineEnd() {
        clip.point = point;
        line.lineEnd();
      }
  
      function pointRing(lambda, phi) {
        ring.push([lambda, phi]);
        ringSink.point(lambda, phi);
      }
  
      function ringStart() {
        ringSink.lineStart();
        ring = [];
      }
  
      function ringEnd() {
        pointRing(ring[0][0], ring[0][1]);
        ringSink.lineEnd();
  
        var clean = ringSink.clean(),
            ringSegments = ringBuffer.result(),
            i, n = ringSegments.length, m,
            segment,
            point;
  
        ring.pop();
        polygon.push(ring);
        ring = null;
  
        if (!n) return;
  
        // No intersections.
        if (clean & 1) {
          segment = ringSegments[0];
          if ((m = segment.length - 1) > 0) {
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            sink.lineStart();
            for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
            sink.lineEnd();
          }
          return;
        }
  
        // Rejoin connected segments.
        // TODO reuse ringBuffer.rejoin()?
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
  
        segments.push(ringSegments.filter(validSegment));
      }
  
      return clip;
    };
  }
  
  function validSegment(segment) {
    return segment.length > 1;
  }
  
  // Intersections are sorted along the clip edge. For both antimeridian cutting
  // and circle clipping, the same comparison is used.
  function compareIntersection(a, b) {
    return ((a = a.x)[0] < 0 ? a[1] - halfPi - epsilon : halfPi - a[1])
         - ((b = b.x)[0] < 0 ? b[1] - halfPi - epsilon : halfPi - b[1]);
  }
  
  var clipAntimeridian = clip(
    function() { return true; },
    clipAntimeridianLine,
    clipAntimeridianInterpolate,
    [-pi, -halfPi]
  );
  
  // Takes a line and cuts into visible segments. Return values: 0 - there were
  // intersections or the line was empty; 1 - no intersections; 2 - there were
  // intersections, and the first and last segments should be rejoined.
  function clipAntimeridianLine(stream) {
    var lambda0 = NaN,
        phi0 = NaN,
        sign0 = NaN,
        clean; // no intersections
  
    return {
      lineStart: function() {
        stream.lineStart();
        clean = 1;
      },
      point: function(lambda1, phi1) {
        var sign1 = lambda1 > 0 ? pi : -pi,
            delta = abs(lambda1 - lambda0);
        if (abs(delta - pi) < epsilon) { // line crosses a pole
          stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi : -halfPi);
          stream.point(sign0, phi0);
          stream.lineEnd();
          stream.lineStart();
          stream.point(sign1, phi0);
          stream.point(lambda1, phi0);
          clean = 0;
        } else if (sign0 !== sign1 && delta >= pi) { // line crosses antimeridian
          if (abs(lambda0 - sign0) < epsilon) lambda0 -= sign0 * epsilon; // handle degeneracies
          if (abs(lambda1 - sign1) < epsilon) lambda1 -= sign1 * epsilon;
          phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
          stream.point(sign0, phi0);
          stream.lineEnd();
          stream.lineStart();
          stream.point(sign1, phi0);
          clean = 0;
        }
        stream.point(lambda0 = lambda1, phi0 = phi1);
        sign0 = sign1;
      },
      lineEnd: function() {
        stream.lineEnd();
        lambda0 = phi0 = NaN;
      },
      clean: function() {
        return 2 - clean; // if intersections, rejoin first and last segments
      }
    };
  }
  
  function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
    var cosPhi0,
        cosPhi1,
        sinLambda0Lambda1 = sin(lambda0 - lambda1);
    return abs(sinLambda0Lambda1) > epsilon
        ? atan((sin(phi0) * (cosPhi1 = cos(phi1)) * sin(lambda1)
            - sin(phi1) * (cosPhi0 = cos(phi0)) * sin(lambda0))
            / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
        : (phi0 + phi1) / 2;
  }
  
  function clipAntimeridianInterpolate(from, to, direction, stream) {
    var phi;
    if (from == null) {
      phi = direction * halfPi;
      stream.point(-pi, phi);
      stream.point(0, phi);
      stream.point(pi, phi);
      stream.point(pi, 0);
      stream.point(pi, -phi);
      stream.point(0, -phi);
      stream.point(-pi, -phi);
      stream.point(-pi, 0);
      stream.point(-pi, phi);
    } else if (abs(from[0] - to[0]) > epsilon) {
      var lambda = from[0] < to[0] ? pi : -pi;
      phi = direction * lambda / 2;
      stream.point(-lambda, phi);
      stream.point(0, phi);
      stream.point(lambda, phi);
    } else {
      stream.point(to[0], to[1]);
    }
  }
  
  function clipCircle(radius) {
    var cr = cos(radius),
        delta = 6 * radians,
        smallRadius = cr > 0,
        notHemisphere = abs(cr) > epsilon; // TODO optimise for this common case
  
    function interpolate(from, to, direction, stream) {
      circleStream(stream, radius, delta, direction, from, to);
    }
  
    function visible(lambda, phi) {
      return cos(lambda) * cos(phi) > cr;
    }
  
    // Takes a line and cuts into visible segments. Return values used for polygon
    // clipping: 0 - there were intersections or the line was empty; 1 - no
    // intersections 2 - there were intersections, and the first and last segments
    // should be rejoined.
    function clipLine(stream) {
      var point0, // previous point
          c0, // code for previous point
          v0, // visibility of previous point
          v00, // visibility of first point
          clean; // no intersections
      return {
        lineStart: function() {
          v00 = v0 = false;
          clean = 1;
        },
        point: function(lambda, phi) {
          var point1 = [lambda, phi],
              point2,
              v = visible(lambda, phi),
              c = smallRadius
                ? v ? 0 : code(lambda, phi)
                : v ? code(lambda + (lambda < 0 ? pi : -pi), phi) : 0;
          if (!point0 && (v00 = v0 = v)) stream.lineStart();
          if (v !== v0) {
            point2 = intersect(point0, point1);
            if (!point2 || pointEqual(point0, point2) || pointEqual(point1, point2))
              point1[2] = 1;
          }
          if (v !== v0) {
            clean = 0;
            if (v) {
              // outside going in
              stream.lineStart();
              point2 = intersect(point1, point0);
              stream.point(point2[0], point2[1]);
            } else {
              // inside going out
              point2 = intersect(point0, point1);
              stream.point(point2[0], point2[1], 2);
              stream.lineEnd();
            }
            point0 = point2;
          } else if (notHemisphere && point0 && smallRadius ^ v) {
            var t;
            // If the codes for two points are different, or are both zero,
            // and there this segment intersects with the small circle.
            if (!(c & c0) && (t = intersect(point1, point0, true))) {
              clean = 0;
              if (smallRadius) {
                stream.lineStart();
                stream.point(t[0][0], t[0][1]);
                stream.point(t[1][0], t[1][1]);
                stream.lineEnd();
              } else {
                stream.point(t[1][0], t[1][1]);
                stream.lineEnd();
                stream.lineStart();
                stream.point(t[0][0], t[0][1], 3);
              }
            }
          }
          if (v && (!point0 || !pointEqual(point0, point1))) {
            stream.point(point1[0], point1[1]);
          }
          point0 = point1, v0 = v, c0 = c;
        },
        lineEnd: function() {
          if (v0) stream.lineEnd();
          point0 = null;
        },
        // Rejoin first and last segments if there were intersections and the first
        // and last points were visible.
        clean: function() {
          return clean | ((v00 && v0) << 1);
        }
      };
    }
  
    // Intersects the great circle between a and b with the clip circle.
    function intersect(a, b, two) {
      var pa = cartesian(a),
          pb = cartesian(b);
  
      // We have two planes, n1.p = d1 and n2.p = d2.
      // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
      var n1 = [1, 0, 0], // normal
          n2 = cartesianCross(pa, pb),
          n2n2 = cartesianDot(n2, n2),
          n1n2 = n2[0], // cartesianDot(n1, n2),
          determinant = n2n2 - n1n2 * n1n2;
  
      // Two polar points.
      if (!determinant) return !two && a;
  
      var c1 =  cr * n2n2 / determinant,
          c2 = -cr * n1n2 / determinant,
          n1xn2 = cartesianCross(n1, n2),
          A = cartesianScale(n1, c1),
          B = cartesianScale(n2, c2);
      cartesianAddInPlace(A, B);
  
      // Solve |p(t)|^2 = 1.
      var u = n1xn2,
          w = cartesianDot(A, u),
          uu = cartesianDot(u, u),
          t2 = w * w - uu * (cartesianDot(A, A) - 1);
  
      if (t2 < 0) return;
  
      var t = sqrt(t2),
          q = cartesianScale(u, (-w - t) / uu);
      cartesianAddInPlace(q, A);
      q = spherical(q);
  
      if (!two) return q;
  
      // Two intersection points.
      var lambda0 = a[0],
          lambda1 = b[0],
          phi0 = a[1],
          phi1 = b[1],
          z;
  
      if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;
  
      var delta = lambda1 - lambda0,
          polar = abs(delta - pi) < epsilon,
          meridian = polar || delta < epsilon;
  
      if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;
  
      // Check that the first point is between a and b.
      if (meridian
          ? polar
            ? phi0 + phi1 > 0 ^ q[1] < (abs(q[0] - lambda0) < epsilon ? phi0 : phi1)
            : phi0 <= q[1] && q[1] <= phi1
          : delta > pi ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
        var q1 = cartesianScale(u, (-w + t) / uu);
        cartesianAddInPlace(q1, A);
        return [q, spherical(q1)];
      }
    }
  
    // Generates a 4-bit vector representing the location of a point relative to
    // the small circle's bounding box.
    function code(lambda, phi) {
      var r = smallRadius ? radius : pi - radius,
          code = 0;
      if (lambda < -r) code |= 1; // left
      else if (lambda > r) code |= 2; // right
      if (phi < -r) code |= 4; // below
      else if (phi > r) code |= 8; // above
      return code;
    }
  
    return clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-pi, radius - pi]);
  }
  
  function clipLine(a, b, x0, y0, x1, y1) {
    var ax = a[0],
        ay = a[1],
        bx = b[0],
        by = b[1],
        t0 = 0,
        t1 = 1,
        dx = bx - ax,
        dy = by - ay,
        r;
  
    r = x0 - ax;
    if (!dx && r > 0) return;
    r /= dx;
    if (dx < 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    } else if (dx > 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    }
  
    r = x1 - ax;
    if (!dx && r < 0) return;
    r /= dx;
    if (dx < 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    } else if (dx > 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    }
  
    r = y0 - ay;
    if (!dy && r > 0) return;
    r /= dy;
    if (dy < 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    } else if (dy > 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    }
  
    r = y1 - ay;
    if (!dy && r < 0) return;
    r /= dy;
    if (dy < 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    } else if (dy > 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    }
  
    if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
    if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
    return true;
  }
  
  var clipMax = 1e9, clipMin = -clipMax;
  
  // TODO Use d3-polygon’s polygonContains here for the ring check?
  // TODO Eliminate duplicate buffering in clipBuffer and polygon.push?
  
  function clipRectangle(x0, y0, x1, y1) {
  
    function visible(x, y) {
      return x0 <= x && x <= x1 && y0 <= y && y <= y1;
    }
  
    function interpolate(from, to, direction, stream) {
      var a = 0, a1 = 0;
      if (from == null
          || (a = corner(from, direction)) !== (a1 = corner(to, direction))
          || comparePoint(from, to) < 0 ^ direction > 0) {
        do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
        while ((a = (a + direction + 4) % 4) !== a1);
      } else {
        stream.point(to[0], to[1]);
      }
    }
  
    function corner(p, direction) {
      return abs(p[0] - x0) < epsilon ? direction > 0 ? 0 : 3
          : abs(p[0] - x1) < epsilon ? direction > 0 ? 2 : 1
          : abs(p[1] - y0) < epsilon ? direction > 0 ? 1 : 0
          : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
    }
  
    function compareIntersection(a, b) {
      return comparePoint(a.x, b.x);
    }
  
    function comparePoint(a, b) {
      var ca = corner(a, 1),
          cb = corner(b, 1);
      return ca !== cb ? ca - cb
          : ca === 0 ? b[1] - a[1]
          : ca === 1 ? a[0] - b[0]
          : ca === 2 ? a[1] - b[1]
          : b[0] - a[0];
    }
  
    return function(stream) {
      var activeStream = stream,
          bufferStream = clipBuffer(),
          segments,
          polygon,
          ring,
          x__, y__, v__, // first point
          x_, y_, v_, // previous point
          first,
          clean;
  
      var clipStream = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: polygonStart,
        polygonEnd: polygonEnd
      };
  
      function point(x, y) {
        if (visible(x, y)) activeStream.point(x, y);
      }
  
      function polygonInside() {
        var winding = 0;
  
        for (var i = 0, n = polygon.length; i < n; ++i) {
          for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
            a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
            if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
            else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
          }
        }
  
        return winding;
      }
  
      // Buffer geometry within a polygon and then clip it en masse.
      function polygonStart() {
        activeStream = bufferStream, segments = [], polygon = [], clean = true;
      }
  
      function polygonEnd() {
        var startInside = polygonInside(),
            cleanInside = clean && startInside,
            visible = (segments = d3Array.merge(segments)).length;
        if (cleanInside || visible) {
          stream.polygonStart();
          if (cleanInside) {
            stream.lineStart();
            interpolate(null, null, 1, stream);
            stream.lineEnd();
          }
          if (visible) {
            clipRejoin(segments, compareIntersection, startInside, interpolate, stream);
          }
          stream.polygonEnd();
        }
        activeStream = stream, segments = polygon = ring = null;
      }
  
      function lineStart() {
        clipStream.point = linePoint;
        if (polygon) polygon.push(ring = []);
        first = true;
        v_ = false;
        x_ = y_ = NaN;
      }
  
      // TODO rather than special-case polygons, simply handle them separately.
      // Ideally, coincident intersection points should be jittered to avoid
      // clipping issues.
      function lineEnd() {
        if (segments) {
          linePoint(x__, y__);
          if (v__ && v_) bufferStream.rejoin();
          segments.push(bufferStream.result());
        }
        clipStream.point = point;
        if (v_) activeStream.lineEnd();
      }
  
      function linePoint(x, y) {
        var v = visible(x, y);
        if (polygon) ring.push([x, y]);
        if (first) {
          x__ = x, y__ = y, v__ = v;
          first = false;
          if (v) {
            activeStream.lineStart();
            activeStream.point(x, y);
          }
        } else {
          if (v && v_) activeStream.point(x, y);
          else {
            var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
                b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
            if (clipLine(a, b, x0, y0, x1, y1)) {
              if (!v_) {
                activeStream.lineStart();
                activeStream.point(a[0], a[1]);
              }
              activeStream.point(b[0], b[1]);
              if (!v) activeStream.lineEnd();
              clean = false;
            } else if (v) {
              activeStream.lineStart();
              activeStream.point(x, y);
              clean = false;
            }
          }
        }
        x_ = x, y_ = y, v_ = v;
      }
  
      return clipStream;
    };
  }
  
  function extent() {
    var x0 = 0,
        y0 = 0,
        x1 = 960,
        y1 = 500,
        cache,
        cacheStream,
        clip;
  
    return clip = {
      stream: function(stream) {
        return cache && cacheStream === stream ? cache : cache = clipRectangle(x0, y0, x1, y1)(cacheStream = stream);
      },
      extent: function(_) {
        return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [[x0, y0], [x1, y1]];
      }
    };
  }
  
  var lengthSum,
      lambda0$2,
      sinPhi0$1,
      cosPhi0$1;
  
  var lengthStream = {
    sphere: noop,
    point: noop,
    lineStart: lengthLineStart,
    lineEnd: noop,
    polygonStart: noop,
    polygonEnd: noop
  };
  
  function lengthLineStart() {
    lengthStream.point = lengthPointFirst;
    lengthStream.lineEnd = lengthLineEnd;
  }
  
  function lengthLineEnd() {
    lengthStream.point = lengthStream.lineEnd = noop;
  }
  
  function lengthPointFirst(lambda, phi) {
    lambda *= radians, phi *= radians;
    lambda0$2 = lambda, sinPhi0$1 = sin(phi), cosPhi0$1 = cos(phi);
    lengthStream.point = lengthPoint;
  }
  
  function lengthPoint(lambda, phi) {
    lambda *= radians, phi *= radians;
    var sinPhi = sin(phi),
        cosPhi = cos(phi),
        delta = abs(lambda - lambda0$2),
        cosDelta = cos(delta),
        sinDelta = sin(delta),
        x = cosPhi * sinDelta,
        y = cosPhi0$1 * sinPhi - sinPhi0$1 * cosPhi * cosDelta,
        z = sinPhi0$1 * sinPhi + cosPhi0$1 * cosPhi * cosDelta;
    lengthSum.add(atan2(sqrt(x * x + y * y), z));
    lambda0$2 = lambda, sinPhi0$1 = sinPhi, cosPhi0$1 = cosPhi;
  }
  
  function length(object) {
    lengthSum = new d3Array.Adder();
    geoStream(object, lengthStream);
    return +lengthSum;
  }
  
  var coordinates = [null, null],
      object = {type: "LineString", coordinates: coordinates};
  
  function distance(a, b) {
    coordinates[0] = a;
    coordinates[1] = b;
    return length(object);
  }
  
  var containsObjectType = {
    Feature: function(object, point) {
      return containsGeometry(object.geometry, point);
    },
    FeatureCollection: function(object, point) {
      var features = object.features, i = -1, n = features.length;
      while (++i < n) if (containsGeometry(features[i].geometry, point)) return true;
      return false;
    }
  };
  
  var containsGeometryType = {
    Sphere: function() {
      return true;
    },
    Point: function(object, point) {
      return containsPoint(object.coordinates, point);
    },
    MultiPoint: function(object, point) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) if (containsPoint(coordinates[i], point)) return true;
      return false;
    },
    LineString: function(object, point) {
      return containsLine(object.coordinates, point);
    },
    MultiLineString: function(object, point) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) if (containsLine(coordinates[i], point)) return true;
      return false;
    },
    Polygon: function(object, point) {
      return containsPolygon(object.coordinates, point);
    },
    MultiPolygon: function(object, point) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) if (containsPolygon(coordinates[i], point)) return true;
      return false;
    },
    GeometryCollection: function(object, point) {
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) if (containsGeometry(geometries[i], point)) return true;
      return false;
    }
  };
  
  function containsGeometry(geometry, point) {
    return geometry && containsGeometryType.hasOwnProperty(geometry.type)
        ? containsGeometryType[geometry.type](geometry, point)
        : false;
  }
  
  function containsPoint(coordinates, point) {
    return distance(coordinates, point) === 0;
  }
  
  function containsLine(coordinates, point) {
    var ao, bo, ab;
    for (var i = 0, n = coordinates.length; i < n; i++) {
      bo = distance(coordinates[i], point);
      if (bo === 0) return true;
      if (i > 0) {
        ab = distance(coordinates[i], coordinates[i - 1]);
        if (
          ab > 0 &&
          ao <= ab &&
          bo <= ab &&
          (ao + bo - ab) * (1 - Math.pow((ao - bo) / ab, 2)) < epsilon2 * ab
        )
          return true;
      }
      ao = bo;
    }
    return false;
  }
  
  function containsPolygon(coordinates, point) {
    return !!polygonContains(coordinates.map(ringRadians), pointRadians(point));
  }
  
  function ringRadians(ring) {
    return ring = ring.map(pointRadians), ring.pop(), ring;
  }
  
  function pointRadians(point) {
    return [point[0] * radians, point[1] * radians];
  }
  
  function contains(object, point) {
    return (object && containsObjectType.hasOwnProperty(object.type)
        ? containsObjectType[object.type]
        : containsGeometry)(object, point);
  }
  
  function graticuleX(y0, y1, dy) {
    var y = d3Array.range(y0, y1 - epsilon, dy).concat(y1);
    return function(x) { return y.map(function(y) { return [x, y]; }); };
  }
  
  function graticuleY(x0, x1, dx) {
    var x = d3Array.range(x0, x1 - epsilon, dx).concat(x1);
    return function(y) { return x.map(function(x) { return [x, y]; }); };
  }
  
  function graticule() {
    var x1, x0, X1, X0,
        y1, y0, Y1, Y0,
        dx = 10, dy = dx, DX = 90, DY = 360,
        x, y, X, Y,
        precision = 2.5;
  
    function graticule() {
      return {type: "MultiLineString", coordinates: lines()};
    }
  
    function lines() {
      return d3Array.range(ceil(X0 / DX) * DX, X1, DX).map(X)
          .concat(d3Array.range(ceil(Y0 / DY) * DY, Y1, DY).map(Y))
          .concat(d3Array.range(ceil(x0 / dx) * dx, x1, dx).filter(function(x) { return abs(x % DX) > epsilon; }).map(x))
          .concat(d3Array.range(ceil(y0 / dy) * dy, y1, dy).filter(function(y) { return abs(y % DY) > epsilon; }).map(y));
    }
  
    graticule.lines = function() {
      return lines().map(function(coordinates) { return {type: "LineString", coordinates: coordinates}; });
    };
  
    graticule.outline = function() {
      return {
        type: "Polygon",
        coordinates: [
          X(X0).concat(
          Y(Y1).slice(1),
          X(X1).reverse().slice(1),
          Y(Y0).reverse().slice(1))
        ]
      };
    };
  
    graticule.extent = function(_) {
      if (!arguments.length) return graticule.extentMinor();
      return graticule.extentMajor(_).extentMinor(_);
    };
  
    graticule.extentMajor = function(_) {
      if (!arguments.length) return [[X0, Y0], [X1, Y1]];
      X0 = +_[0][0], X1 = +_[1][0];
      Y0 = +_[0][1], Y1 = +_[1][1];
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
      return graticule.precision(precision);
    };
  
    graticule.extentMinor = function(_) {
      if (!arguments.length) return [[x0, y0], [x1, y1]];
      x0 = +_[0][0], x1 = +_[1][0];
      y0 = +_[0][1], y1 = +_[1][1];
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
      return graticule.precision(precision);
    };
  
    graticule.step = function(_) {
      if (!arguments.length) return graticule.stepMinor();
      return graticule.stepMajor(_).stepMinor(_);
    };
  
    graticule.stepMajor = function(_) {
      if (!arguments.length) return [DX, DY];
      DX = +_[0], DY = +_[1];
      return graticule;
    };
  
    graticule.stepMinor = function(_) {
      if (!arguments.length) return [dx, dy];
      dx = +_[0], dy = +_[1];
      return graticule;
    };
  
    graticule.precision = function(_) {
      if (!arguments.length) return precision;
      precision = +_;
      x = graticuleX(y0, y1, 90);
      y = graticuleY(x0, x1, precision);
      X = graticuleX(Y0, Y1, 90);
      Y = graticuleY(X0, X1, precision);
      return graticule;
    };
  
    return graticule
        .extentMajor([[-180, -90 + epsilon], [180, 90 - epsilon]])
        .extentMinor([[-180, -80 - epsilon], [180, 80 + epsilon]]);
  }
  
  function graticule10() {
    return graticule()();
  }
  
  function interpolate(a, b) {
    var x0 = a[0] * radians,
        y0 = a[1] * radians,
        x1 = b[0] * radians,
        y1 = b[1] * radians,
        cy0 = cos(y0),
        sy0 = sin(y0),
        cy1 = cos(y1),
        sy1 = sin(y1),
        kx0 = cy0 * cos(x0),
        ky0 = cy0 * sin(x0),
        kx1 = cy1 * cos(x1),
        ky1 = cy1 * sin(x1),
        d = 2 * asin(sqrt(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
        k = sin(d);
  
    var interpolate = d ? function(t) {
      var B = sin(t *= d) / k,
          A = sin(d - t) / k,
          x = A * kx0 + B * kx1,
          y = A * ky0 + B * ky1,
          z = A * sy0 + B * sy1;
      return [
        atan2(y, x) * degrees,
        atan2(z, sqrt(x * x + y * y)) * degrees
      ];
    } : function() {
      return [x0 * degrees, y0 * degrees];
    };
  
    interpolate.distance = d;
  
    return interpolate;
  }
  
  var identity = x => x;
  
  var areaSum$1 = new d3Array.Adder(),
      areaRingSum$1 = new d3Array.Adder(),
      x00,
      y00,
      x0$1,
      y0$1;
  
  var areaStream$1 = {
    point: noop,
    lineStart: noop,
    lineEnd: noop,
    polygonStart: function() {
      areaStream$1.lineStart = areaRingStart$1;
      areaStream$1.lineEnd = areaRingEnd$1;
    },
    polygonEnd: function() {
      areaStream$1.lineStart = areaStream$1.lineEnd = areaStream$1.point = noop;
      areaSum$1.add(abs(areaRingSum$1));
      areaRingSum$1 = new d3Array.Adder();
    },
    result: function() {
      var area = areaSum$1 / 2;
      areaSum$1 = new d3Array.Adder();
      return area;
    }
  };
  
  function areaRingStart$1() {
    areaStream$1.point = areaPointFirst$1;
  }
  
  function areaPointFirst$1(x, y) {
    areaStream$1.point = areaPoint$1;
    x00 = x0$1 = x, y00 = y0$1 = y;
  }
  
  function areaPoint$1(x, y) {
    areaRingSum$1.add(y0$1 * x - x0$1 * y);
    x0$1 = x, y0$1 = y;
  }
  
  function areaRingEnd$1() {
    areaPoint$1(x00, y00);
  }
  
  var x0$2 = Infinity,
      y0$2 = x0$2,
      x1 = -x0$2,
      y1 = x1;
  
  var boundsStream$1 = {
    point: boundsPoint$1,
    lineStart: noop,
    lineEnd: noop,
    polygonStart: noop,
    polygonEnd: noop,
    result: function() {
      var bounds = [[x0$2, y0$2], [x1, y1]];
      x1 = y1 = -(y0$2 = x0$2 = Infinity);
      return bounds;
    }
  };
  
  function boundsPoint$1(x, y) {
    if (x < x0$2) x0$2 = x;
    if (x > x1) x1 = x;
    if (y < y0$2) y0$2 = y;
    if (y > y1) y1 = y;
  }
  
  // TODO Enforce positive area for exterior, negative area for interior?
  
  var X0$1 = 0,
      Y0$1 = 0,
      Z0$1 = 0,
      X1$1 = 0,
      Y1$1 = 0,
      Z1$1 = 0,
      X2$1 = 0,
      Y2$1 = 0,
      Z2$1 = 0,
      x00$1,
      y00$1,
      x0$3,
      y0$3;
  
  var centroidStream$1 = {
    point: centroidPoint$1,
    lineStart: centroidLineStart$1,
    lineEnd: centroidLineEnd$1,
    polygonStart: function() {
      centroidStream$1.lineStart = centroidRingStart$1;
      centroidStream$1.lineEnd = centroidRingEnd$1;
    },
    polygonEnd: function() {
      centroidStream$1.point = centroidPoint$1;
      centroidStream$1.lineStart = centroidLineStart$1;
      centroidStream$1.lineEnd = centroidLineEnd$1;
    },
    result: function() {
      var centroid = Z2$1 ? [X2$1 / Z2$1, Y2$1 / Z2$1]
          : Z1$1 ? [X1$1 / Z1$1, Y1$1 / Z1$1]
          : Z0$1 ? [X0$1 / Z0$1, Y0$1 / Z0$1]
          : [NaN, NaN];
      X0$1 = Y0$1 = Z0$1 =
      X1$1 = Y1$1 = Z1$1 =
      X2$1 = Y2$1 = Z2$1 = 0;
      return centroid;
    }
  };
  
  function centroidPoint$1(x, y) {
    X0$1 += x;
    Y0$1 += y;
    ++Z0$1;
  }
  
  function centroidLineStart$1() {
    centroidStream$1.point = centroidPointFirstLine;
  }
  
  function centroidPointFirstLine(x, y) {
    centroidStream$1.point = centroidPointLine;
    centroidPoint$1(x0$3 = x, y0$3 = y);
  }
  
  function centroidPointLine(x, y) {
    var dx = x - x0$3, dy = y - y0$3, z = sqrt(dx * dx + dy * dy);
    X1$1 += z * (x0$3 + x) / 2;
    Y1$1 += z * (y0$3 + y) / 2;
    Z1$1 += z;
    centroidPoint$1(x0$3 = x, y0$3 = y);
  }
  
  function centroidLineEnd$1() {
    centroidStream$1.point = centroidPoint$1;
  }
  
  function centroidRingStart$1() {
    centroidStream$1.point = centroidPointFirstRing;
  }
  
  function centroidRingEnd$1() {
    centroidPointRing(x00$1, y00$1);
  }
  
  function centroidPointFirstRing(x, y) {
    centroidStream$1.point = centroidPointRing;
    centroidPoint$1(x00$1 = x0$3 = x, y00$1 = y0$3 = y);
  }
  
  function centroidPointRing(x, y) {
    var dx = x - x0$3,
        dy = y - y0$3,
        z = sqrt(dx * dx + dy * dy);
  
    X1$1 += z * (x0$3 + x) / 2;
    Y1$1 += z * (y0$3 + y) / 2;
    Z1$1 += z;
  
    z = y0$3 * x - x0$3 * y;
    X2$1 += z * (x0$3 + x);
    Y2$1 += z * (y0$3 + y);
    Z2$1 += z * 3;
    centroidPoint$1(x0$3 = x, y0$3 = y);
  }
  
  function PathContext(context) {
    this._context = context;
  }
  
  PathContext.prototype = {
    _radius: 4.5,
    pointRadius: function(_) {
      return this._radius = _, this;
    },
    polygonStart: function() {
      this._line = 0;
    },
    polygonEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line === 0) this._context.closePath();
      this._point = NaN;
    },
    point: function(x, y) {
      switch (this._point) {
        case 0: {
          this._context.moveTo(x, y);
          this._point = 1;
          break;
        }
        case 1: {
          this._context.lineTo(x, y);
          break;
        }
        default: {
          this._context.moveTo(x + this._radius, y);
          this._context.arc(x, y, this._radius, 0, tau);
          break;
        }
      }
    },
    result: noop
  };
  
  var lengthSum$1 = new d3Array.Adder(),
      lengthRing,
      x00$2,
      y00$2,
      x0$4,
      y0$4;
  
  var lengthStream$1 = {
    point: noop,
    lineStart: function() {
      lengthStream$1.point = lengthPointFirst$1;
    },
    lineEnd: function() {
      if (lengthRing) lengthPoint$1(x00$2, y00$2);
      lengthStream$1.point = noop;
    },
    polygonStart: function() {
      lengthRing = true;
    },
    polygonEnd: function() {
      lengthRing = null;
    },
    result: function() {
      var length = +lengthSum$1;
      lengthSum$1 = new d3Array.Adder();
      return length;
    }
  };
  
  function lengthPointFirst$1(x, y) {
    lengthStream$1.point = lengthPoint$1;
    x00$2 = x0$4 = x, y00$2 = y0$4 = y;
  }
  
  function lengthPoint$1(x, y) {
    x0$4 -= x, y0$4 -= y;
    lengthSum$1.add(sqrt(x0$4 * x0$4 + y0$4 * y0$4));
    x0$4 = x, y0$4 = y;
  }
  
  function PathString() {
    this._string = [];
  }
  
  PathString.prototype = {
    _radius: 4.5,
    _circle: circle$1(4.5),
    pointRadius: function(_) {
      if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
      return this;
    },
    polygonStart: function() {
      this._line = 0;
    },
    polygonEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line === 0) this._string.push("Z");
      this._point = NaN;
    },
    point: function(x, y) {
      switch (this._point) {
        case 0: {
          this._string.push("M", x, ",", y);
          this._point = 1;
          break;
        }
        case 1: {
          this._string.push("L", x, ",", y);
          break;
        }
        default: {
          if (this._circle == null) this._circle = circle$1(this._radius);
          this._string.push("M", x, ",", y, this._circle);
          break;
        }
      }
    },
    result: function() {
      if (this._string.length) {
        var result = this._string.join("");
        this._string = [];
        return result;
      } else {
        return null;
      }
    }
  };
  
  function circle$1(radius) {
    return "m0," + radius
        + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
        + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
        + "z";
  }
  
  function index(projection, context) {
    var pointRadius = 4.5,
        projectionStream,
        contextStream;
  
    function path(object) {
      if (object) {
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        geoStream(object, projectionStream(contextStream));
      }
      return contextStream.result();
    }
  
    path.area = function(object) {
      geoStream(object, projectionStream(areaStream$1));
      return areaStream$1.result();
    };
  
    path.measure = function(object) {
      geoStream(object, projectionStream(lengthStream$1));
      return lengthStream$1.result();
    };
  
    path.bounds = function(object) {
      geoStream(object, projectionStream(boundsStream$1));
      return boundsStream$1.result();
    };
  
    path.centroid = function(object) {
      geoStream(object, projectionStream(centroidStream$1));
      return centroidStream$1.result();
    };
  
    path.projection = function(_) {
      return arguments.length ? (projectionStream = _ == null ? (projection = null, identity) : (projection = _).stream, path) : projection;
    };
  
    path.context = function(_) {
      if (!arguments.length) return context;
      contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return path;
    };
  
    path.pointRadius = function(_) {
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    };
  
    return path.projection(projection).context(context);
  }
  
  function transform(methods) {
    return {
      stream: transformer(methods)
    };
  }
  
  function transformer(methods) {
    return function(stream) {
      var s = new TransformStream;
      for (var key in methods) s[key] = methods[key];
      s.stream = stream;
      return s;
    };
  }
  
  function TransformStream() {}
  
  TransformStream.prototype = {
    constructor: TransformStream,
    point: function(x, y) { this.stream.point(x, y); },
    sphere: function() { this.stream.sphere(); },
    lineStart: function() { this.stream.lineStart(); },
    lineEnd: function() { this.stream.lineEnd(); },
    polygonStart: function() { this.stream.polygonStart(); },
    polygonEnd: function() { this.stream.polygonEnd(); }
  };
  
  function fit(projection, fitBounds, object) {
    var clip = projection.clipExtent && projection.clipExtent();
    projection.scale(150).translate([0, 0]);
    if (clip != null) projection.clipExtent(null);
    geoStream(object, projection.stream(boundsStream$1));
    fitBounds(boundsStream$1.result());
    if (clip != null) projection.clipExtent(clip);
    return projection;
  }
  
  function fitExtent(projection, extent, object) {
    return fit(projection, function(b) {
      var w = extent[1][0] - extent[0][0],
          h = extent[1][1] - extent[0][1],
          k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
          x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
          y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;
      projection.scale(150 * k).translate([x, y]);
    }, object);
  }
  
  function fitSize(projection, size, object) {
    return fitExtent(projection, [[0, 0], size], object);
  }
  
  function fitWidth(projection, width, object) {
    return fit(projection, function(b) {
      var w = +width,
          k = w / (b[1][0] - b[0][0]),
          x = (w - k * (b[1][0] + b[0][0])) / 2,
          y = -k * b[0][1];
      projection.scale(150 * k).translate([x, y]);
    }, object);
  }
  
  function fitHeight(projection, height, object) {
    return fit(projection, function(b) {
      var h = +height,
          k = h / (b[1][1] - b[0][1]),
          x = -k * b[0][0],
          y = (h - k * (b[1][1] + b[0][1])) / 2;
      projection.scale(150 * k).translate([x, y]);
    }, object);
  }
  
  var maxDepth = 16, // maximum depth of subdivision
      cosMinDistance = cos(30 * radians); // cos(minimum angular distance)
  
  function resample(project, delta2) {
    return +delta2 ? resample$1(project, delta2) : resampleNone(project);
  }
  
  function resampleNone(project) {
    return transformer({
      point: function(x, y) {
        x = project(x, y);
        this.stream.point(x[0], x[1]);
      }
    });
  }
  
  function resample$1(project, delta2) {
  
    function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
      var dx = x1 - x0,
          dy = y1 - y0,
          d2 = dx * dx + dy * dy;
      if (d2 > 4 * delta2 && depth--) {
        var a = a0 + a1,
            b = b0 + b1,
            c = c0 + c1,
            m = sqrt(a * a + b * b + c * c),
            phi2 = asin(c /= m),
            lambda2 = abs(abs(c) - 1) < epsilon || abs(lambda0 - lambda1) < epsilon ? (lambda0 + lambda1) / 2 : atan2(b, a),
            p = project(lambda2, phi2),
            x2 = p[0],
            y2 = p[1],
            dx2 = x2 - x0,
            dy2 = y2 - y0,
            dz = dy * dx2 - dx * dy2;
        if (dz * dz / d2 > delta2 // perpendicular projected distance
            || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
            || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
          resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
          stream.point(x2, y2);
          resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
        }
      }
    }
    return function(stream) {
      var lambda00, x00, y00, a00, b00, c00, // first point
          lambda0, x0, y0, a0, b0, c0; // previous point
  
      var resampleStream = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
        polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
      };
  
      function point(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      }
  
      function lineStart() {
        x0 = NaN;
        resampleStream.point = linePoint;
        stream.lineStart();
      }
  
      function linePoint(lambda, phi) {
        var c = cartesian([lambda, phi]), p = project(lambda, phi);
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
        stream.point(x0, y0);
      }
  
      function lineEnd() {
        resampleStream.point = point;
        stream.lineEnd();
      }
  
      function ringStart() {
        lineStart();
        resampleStream.point = ringPoint;
        resampleStream.lineEnd = ringEnd;
      }
  
      function ringPoint(lambda, phi) {
        linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
        resampleStream.point = linePoint;
      }
  
      function ringEnd() {
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
        resampleStream.lineEnd = lineEnd;
        lineEnd();
      }
  
      return resampleStream;
    };
  }
  
  var transformRadians = transformer({
    point: function(x, y) {
      this.stream.point(x * radians, y * radians);
    }
  });
  
  function transformRotate(rotate) {
    return transformer({
      point: function(x, y) {
        var r = rotate(x, y);
        return this.stream.point(r[0], r[1]);
      }
    });
  }
  
  function scaleTranslate(k, dx, dy, sx, sy) {
    function transform(x, y) {
      x *= sx; y *= sy;
      return [dx + k * x, dy - k * y];
    }
    transform.invert = function(x, y) {
      return [(x - dx) / k * sx, (dy - y) / k * sy];
    };
    return transform;
  }
  
  function scaleTranslateRotate(k, dx, dy, sx, sy, alpha) {
    if (!alpha) return scaleTranslate(k, dx, dy, sx, sy);
    var cosAlpha = cos(alpha),
        sinAlpha = sin(alpha),
        a = cosAlpha * k,
        b = sinAlpha * k,
        ai = cosAlpha / k,
        bi = sinAlpha / k,
        ci = (sinAlpha * dy - cosAlpha * dx) / k,
        fi = (sinAlpha * dx + cosAlpha * dy) / k;
    function transform(x, y) {
      x *= sx; y *= sy;
      return [a * x - b * y + dx, dy - b * x - a * y];
    }
    transform.invert = function(x, y) {
      return [sx * (ai * x - bi * y + ci), sy * (fi - bi * x - ai * y)];
    };
    return transform;
  }
  
  function projection(project) {
    return projectionMutator(function() { return project; })();
  }
  
  function projectionMutator(projectAt) {
    var project,
        k = 150, // scale
        x = 480, y = 250, // translate
        lambda = 0, phi = 0, // center
        deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, // pre-rotate
        alpha = 0, // post-rotate angle
        sx = 1, // reflectX
        sy = 1, // reflectX
        theta = null, preclip = clipAntimeridian, // pre-clip angle
        x0 = null, y0, x1, y1, postclip = identity, // post-clip extent
        delta2 = 0.5, // precision
        projectResample,
        projectTransform,
        projectRotateTransform,
        cache,
        cacheStream;
  
    function projection(point) {
      return projectRotateTransform(point[0] * radians, point[1] * radians);
    }
  
    function invert(point) {
      point = projectRotateTransform.invert(point[0], point[1]);
      return point && [point[0] * degrees, point[1] * degrees];
    }
  
    projection.stream = function(stream) {
      return cache && cacheStream === stream ? cache : cache = transformRadians(transformRotate(rotate)(preclip(projectResample(postclip(cacheStream = stream)))));
    };
  
    projection.preclip = function(_) {
      return arguments.length ? (preclip = _, theta = undefined, reset()) : preclip;
    };
  
    projection.postclip = function(_) {
      return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
    };
  
    projection.clipAngle = function(_) {
      return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees;
    };
  
    projection.clipExtent = function(_) {
      return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipRectangle(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
    };
  
    projection.scale = function(_) {
      return arguments.length ? (k = +_, recenter()) : k;
    };
  
    projection.translate = function(_) {
      return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
    };
  
    projection.center = function(_) {
      return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees, phi * degrees];
    };
  
    projection.rotate = function(_) {
      return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
    };
  
    projection.angle = function(_) {
      return arguments.length ? (alpha = _ % 360 * radians, recenter()) : alpha * degrees;
    };
  
    projection.reflectX = function(_) {
      return arguments.length ? (sx = _ ? -1 : 1, recenter()) : sx < 0;
    };
  
    projection.reflectY = function(_) {
      return arguments.length ? (sy = _ ? -1 : 1, recenter()) : sy < 0;
    };
  
    projection.precision = function(_) {
      return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt(delta2);
    };
  
    projection.fitExtent = function(extent, object) {
      return fitExtent(projection, extent, object);
    };
  
    projection.fitSize = function(size, object) {
      return fitSize(projection, size, object);
    };
  
    projection.fitWidth = function(width, object) {
      return fitWidth(projection, width, object);
    };
  
    projection.fitHeight = function(height, object) {
      return fitHeight(projection, height, object);
    };
  
    function recenter() {
      var center = scaleTranslateRotate(k, 0, 0, sx, sy, alpha).apply(null, project(lambda, phi)),
          transform = scaleTranslateRotate(k, x - center[0], y - center[1], sx, sy, alpha);
      rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma);
      projectTransform = compose(project, transform);
      projectRotateTransform = compose(rotate, projectTransform);
      projectResample = resample(projectTransform, delta2);
      return reset();
    }
  
    function reset() {
      cache = cacheStream = null;
      return projection;
    }
  
    return function() {
      project = projectAt.apply(this, arguments);
      projection.invert = project.invert && invert;
      return recenter();
    };
  }
  
  function conicProjection(projectAt) {
    var phi0 = 0,
        phi1 = pi / 3,
        m = projectionMutator(projectAt),
        p = m(phi0, phi1);
  
    p.parallels = function(_) {
      return arguments.length ? m(phi0 = _[0] * radians, phi1 = _[1] * radians) : [phi0 * degrees, phi1 * degrees];
    };
  
    return p;
  }
  
  function cylindricalEqualAreaRaw(phi0) {
    var cosPhi0 = cos(phi0);
  
    function forward(lambda, phi) {
      return [lambda * cosPhi0, sin(phi) / cosPhi0];
    }
  
    forward.invert = function(x, y) {
      return [x / cosPhi0, asin(y * cosPhi0)];
    };
  
    return forward;
  }
  
  function conicEqualAreaRaw(y0, y1) {
    var sy0 = sin(y0), n = (sy0 + sin(y1)) / 2;
  
    // Are the parallels symmetrical around the Equator?
    if (abs(n) < epsilon) return cylindricalEqualAreaRaw(y0);
  
    var c = 1 + sy0 * (2 * n - sy0), r0 = sqrt(c) / n;
  
    function project(x, y) {
      var r = sqrt(c - 2 * n * sin(y)) / n;
      return [r * sin(x *= n), r0 - r * cos(x)];
    }
  
    project.invert = function(x, y) {
      var r0y = r0 - y,
          l = atan2(x, abs(r0y)) * sign(r0y);
      if (r0y * n < 0)
        l -= pi * sign(x) * sign(r0y);
      return [l / n, asin((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
    };
  
    return project;
  }
  
  function conicEqualArea() {
    return conicProjection(conicEqualAreaRaw)
        .scale(155.424)
        .center([0, 33.6442]);
  }
  
  function albers() {
    return conicEqualArea()
        .parallels([29.5, 45.5])
        .scale(1070)
        .translate([480, 250])
        .rotate([96, 0])
        .center([-0.6, 38.7]);
  }
  
  // The projections must have mutually exclusive clip regions on the sphere,
  // as this will avoid emitting interleaving lines and polygons.
  function multiplex(streams) {
    var n = streams.length;
    return {
      point: function(x, y) { var i = -1; while (++i < n) streams[i].point(x, y); },
      sphere: function() { var i = -1; while (++i < n) streams[i].sphere(); },
      lineStart: function() { var i = -1; while (++i < n) streams[i].lineStart(); },
      lineEnd: function() { var i = -1; while (++i < n) streams[i].lineEnd(); },
      polygonStart: function() { var i = -1; while (++i < n) streams[i].polygonStart(); },
      polygonEnd: function() { var i = -1; while (++i < n) streams[i].polygonEnd(); }
    };
  }
  
  // A composite projection for the United States, configured by default for
  // 960×500. The projection also works quite well at 960×600 if you change the
  // scale to 1285 and adjust the translate accordingly. The set of standard
  // parallels for each region comes from USGS, which is published here:
  // http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
  function albersUsa() {
    var cache,
        cacheStream,
        lower48 = albers(), lower48Point,
        alaska = conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), alaskaPoint, // EPSG:3338
        hawaii = conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), hawaiiPoint, // ESRI:102007
        point, pointStream = {point: function(x, y) { point = [x, y]; }};
  
    function albersUsa(coordinates) {
      var x = coordinates[0], y = coordinates[1];
      return point = null,
          (lower48Point.point(x, y), point)
          || (alaskaPoint.point(x, y), point)
          || (hawaiiPoint.point(x, y), point);
    }
  
    albersUsa.invert = function(coordinates) {
      var k = lower48.scale(),
          t = lower48.translate(),
          x = (coordinates[0] - t[0]) / k,
          y = (coordinates[1] - t[1]) / k;
      return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
          : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
          : lower48).invert(coordinates);
    };
  
    albersUsa.stream = function(stream) {
      return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream)]);
    };
  
    albersUsa.precision = function(_) {
      if (!arguments.length) return lower48.precision();
      lower48.precision(_), alaska.precision(_), hawaii.precision(_);
      return reset();
    };
  
    albersUsa.scale = function(_) {
      if (!arguments.length) return lower48.scale();
      lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_);
      return albersUsa.translate(lower48.translate());
    };
  
    albersUsa.translate = function(_) {
      if (!arguments.length) return lower48.translate();
      var k = lower48.scale(), x = +_[0], y = +_[1];
  
      lower48Point = lower48
          .translate(_)
          .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
          .stream(pointStream);
  
      alaskaPoint = alaska
          .translate([x - 0.307 * k, y + 0.201 * k])
          .clipExtent([[x - 0.425 * k + epsilon, y + 0.120 * k + epsilon], [x - 0.214 * k - epsilon, y + 0.234 * k - epsilon]])
          .stream(pointStream);
  
      hawaiiPoint = hawaii
          .translate([x - 0.205 * k, y + 0.212 * k])
          .clipExtent([[x - 0.214 * k + epsilon, y + 0.166 * k + epsilon], [x - 0.115 * k - epsilon, y + 0.234 * k - epsilon]])
          .stream(pointStream);
  
      return reset();
    };
  
    albersUsa.fitExtent = function(extent, object) {
      return fitExtent(albersUsa, extent, object);
    };
  
    albersUsa.fitSize = function(size, object) {
      return fitSize(albersUsa, size, object);
    };
  
    albersUsa.fitWidth = function(width, object) {
      return fitWidth(albersUsa, width, object);
    };
  
    albersUsa.fitHeight = function(height, object) {
      return fitHeight(albersUsa, height, object);
    };
  
    function reset() {
      cache = cacheStream = null;
      return albersUsa;
    }
  
    return albersUsa.scale(1070);
  }
  
  function azimuthalRaw(scale) {
    return function(x, y) {
      var cx = cos(x),
          cy = cos(y),
          k = scale(cx * cy);
          if (k === Infinity) return [2, 0];
      return [
        k * cy * sin(x),
        k * sin(y)
      ];
    }
  }
  
  function azimuthalInvert(angle) {
    return function(x, y) {
      var z = sqrt(x * x + y * y),
          c = angle(z),
          sc = sin(c),
          cc = cos(c);
      return [
        atan2(x * sc, z * cc),
        asin(z && y * sc / z)
      ];
    }
  }
  
  var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) {
    return sqrt(2 / (1 + cxcy));
  });
  
  azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) {
    return 2 * asin(z / 2);
  });
  
  function azimuthalEqualArea() {
    return projection(azimuthalEqualAreaRaw)
        .scale(124.75)
        .clipAngle(180 - 1e-3);
  }
  
  var azimuthalEquidistantRaw = azimuthalRaw(function(c) {
    return (c = acos(c)) && c / sin(c);
  });
  
  azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) {
    return z;
  });
  
  function azimuthalEquidistant() {
    return projection(azimuthalEquidistantRaw)
        .scale(79.4188)
        .clipAngle(180 - 1e-3);
  }
  
  function mercatorRaw(lambda, phi) {
    return [lambda, log(tan((halfPi + phi) / 2))];
  }
  
  mercatorRaw.invert = function(x, y) {
    return [x, 2 * atan(exp(y)) - halfPi];
  };
  
  function mercator() {
    return mercatorProjection(mercatorRaw)
        .scale(961 / tau);
  }
  
  function mercatorProjection(project) {
    var m = projection(project),
        center = m.center,
        scale = m.scale,
        translate = m.translate,
        clipExtent = m.clipExtent,
        x0 = null, y0, x1, y1; // clip extent
  
    m.scale = function(_) {
      return arguments.length ? (scale(_), reclip()) : scale();
    };
  
    m.translate = function(_) {
      return arguments.length ? (translate(_), reclip()) : translate();
    };
  
    m.center = function(_) {
      return arguments.length ? (center(_), reclip()) : center();
    };
  
    m.clipExtent = function(_) {
      return arguments.length ? ((_ == null ? x0 = y0 = x1 = y1 = null : (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1])), reclip()) : x0 == null ? null : [[x0, y0], [x1, y1]];
    };
  
    function reclip() {
      var k = pi * scale(),
          t = m(rotation(m.rotate()).invert([0, 0]));
      return clipExtent(x0 == null
          ? [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]] : project === mercatorRaw
          ? [[Math.max(t[0] - k, x0), y0], [Math.min(t[0] + k, x1), y1]]
          : [[x0, Math.max(t[1] - k, y0)], [x1, Math.min(t[1] + k, y1)]]);
    }
  
    return reclip();
  }
  
  function tany(y) {
    return tan((halfPi + y) / 2);
  }
  
  function conicConformalRaw(y0, y1) {
    var cy0 = cos(y0),
        n = y0 === y1 ? sin(y0) : log(cy0 / cos(y1)) / log(tany(y1) / tany(y0)),
        f = cy0 * pow(tany(y0), n) / n;
  
    if (!n) return mercatorRaw;
  
    function project(x, y) {
      if (f > 0) { if (y < -halfPi + epsilon) y = -halfPi + epsilon; }
      else { if (y > halfPi - epsilon) y = halfPi - epsilon; }
      var r = f / pow(tany(y), n);
      return [r * sin(n * x), f - r * cos(n * x)];
    }
  
    project.invert = function(x, y) {
      var fy = f - y, r = sign(n) * sqrt(x * x + fy * fy),
        l = atan2(x, abs(fy)) * sign(fy);
      if (fy * n < 0)
        l -= pi * sign(x) * sign(fy);
      return [l / n, 2 * atan(pow(f / r, 1 / n)) - halfPi];
    };
  
    return project;
  }
  
  function conicConformal() {
    return conicProjection(conicConformalRaw)
        .scale(109.5)
        .parallels([30, 30]);
  }
  
  function equirectangularRaw(lambda, phi) {
    return [lambda, phi];
  }
  
  equirectangularRaw.invert = equirectangularRaw;
  
  function equirectangular() {
    return projection(equirectangularRaw)
        .scale(152.63);
  }
  
  function conicEquidistantRaw(y0, y1) {
    var cy0 = cos(y0),
        n = y0 === y1 ? sin(y0) : (cy0 - cos(y1)) / (y1 - y0),
        g = cy0 / n + y0;
  
    if (abs(n) < epsilon) return equirectangularRaw;
  
    function project(x, y) {
      var gy = g - y, nx = n * x;
      return [gy * sin(nx), g - gy * cos(nx)];
    }
  
    project.invert = function(x, y) {
      var gy = g - y,
          l = atan2(x, abs(gy)) * sign(gy);
      if (gy * n < 0)
        l -= pi * sign(x) * sign(gy);
      return [l / n, g - sign(n) * sqrt(x * x + gy * gy)];
    };
  
    return project;
  }
  
  function conicEquidistant() {
    return conicProjection(conicEquidistantRaw)
        .scale(131.154)
        .center([0, 13.9389]);
  }
  
  var A1 = 1.340264,
      A2 = -0.081106,
      A3 = 0.000893,
      A4 = 0.003796,
      M = sqrt(3) / 2,
      iterations = 12;
  
  function equalEarthRaw(lambda, phi) {
    var l = asin(M * sin(phi)), l2 = l * l, l6 = l2 * l2 * l2;
    return [
      lambda * cos(l) / (M * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2))),
      l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2))
    ];
  }
  
  equalEarthRaw.invert = function(x, y) {
    var l = y, l2 = l * l, l6 = l2 * l2 * l2;
    for (var i = 0, delta, fy, fpy; i < iterations; ++i) {
      fy = l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2)) - y;
      fpy = A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2);
      l -= delta = fy / fpy, l2 = l * l, l6 = l2 * l2 * l2;
      if (abs(delta) < epsilon2) break;
    }
    return [
      M * x * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2)) / cos(l),
      asin(sin(l) / M)
    ];
  };
  
  function equalEarth() {
    return projection(equalEarthRaw)
        .scale(177.158);
  }
  
  function gnomonicRaw(x, y) {
    var cy = cos(y), k = cos(x) * cy;
    return [cy * sin(x) / k, sin(y) / k];
  }
  
  gnomonicRaw.invert = azimuthalInvert(atan);
  
  function gnomonic() {
    return projection(gnomonicRaw)
        .scale(144.049)
        .clipAngle(60);
  }
  
  function identity$1() {
    var k = 1, tx = 0, ty = 0, sx = 1, sy = 1, // scale, translate and reflect
        alpha = 0, ca, sa, // angle
        x0 = null, y0, x1, y1, // clip extent
        kx = 1, ky = 1,
        transform = transformer({
          point: function(x, y) {
            var p = projection([x, y]);
            this.stream.point(p[0], p[1]);
          }
        }),
        postclip = identity,
        cache,
        cacheStream;
  
    function reset() {
      kx = k * sx;
      ky = k * sy;
      cache = cacheStream = null;
      return projection;
    }
  
    function projection (p) {
      var x = p[0] * kx, y = p[1] * ky;
      if (alpha) {
        var t = y * ca - x * sa;
        x = x * ca + y * sa;
        y = t;
      }    
      return [x + tx, y + ty];
    }
    projection.invert = function(p) {
      var x = p[0] - tx, y = p[1] - ty;
      if (alpha) {
        var t = y * ca + x * sa;
        x = x * ca - y * sa;
        y = t;
      }
      return [x / kx, y / ky];
    };
    projection.stream = function(stream) {
      return cache && cacheStream === stream ? cache : cache = transform(postclip(cacheStream = stream));
    };
    projection.postclip = function(_) {
      return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
    };
    projection.clipExtent = function(_) {
      return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipRectangle(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
    };
    projection.scale = function(_) {
      return arguments.length ? (k = +_, reset()) : k;
    };
    projection.translate = function(_) {
      return arguments.length ? (tx = +_[0], ty = +_[1], reset()) : [tx, ty];
    };
    projection.angle = function(_) {
      return arguments.length ? (alpha = _ % 360 * radians, sa = sin(alpha), ca = cos(alpha), reset()) : alpha * degrees;
    };
    projection.reflectX = function(_) {
      return arguments.length ? (sx = _ ? -1 : 1, reset()) : sx < 0;
    };
    projection.reflectY = function(_) {
      return arguments.length ? (sy = _ ? -1 : 1, reset()) : sy < 0;
    };
    projection.fitExtent = function(extent, object) {
      return fitExtent(projection, extent, object);
    };
    projection.fitSize = function(size, object) {
      return fitSize(projection, size, object);
    };
    projection.fitWidth = function(width, object) {
      return fitWidth(projection, width, object);
    };
    projection.fitHeight = function(height, object) {
      return fitHeight(projection, height, object);
    };
  
    return projection;
  }
  
  function naturalEarth1Raw(lambda, phi) {
    var phi2 = phi * phi, phi4 = phi2 * phi2;
    return [
      lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))),
      phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)))
    ];
  }
  
  naturalEarth1Raw.invert = function(x, y) {
    var phi = y, i = 25, delta;
    do {
      var phi2 = phi * phi, phi4 = phi2 * phi2;
      phi -= delta = (phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) /
          (1.007226 + phi2 * (0.015085 * 3 + phi4 * (-0.044475 * 7 + 0.028874 * 9 * phi2 - 0.005916 * 11 * phi4)));
    } while (abs(delta) > epsilon && --i > 0);
    return [
      x / (0.8707 + (phi2 = phi * phi) * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2)))),
      phi
    ];
  };
  
  function naturalEarth1() {
    return projection(naturalEarth1Raw)
        .scale(175.295);
  }
  
  function orthographicRaw(x, y) {
    return [cos(y) * sin(x), sin(y)];
  }
  
  orthographicRaw.invert = azimuthalInvert(asin);
  
  function orthographic() {
    return projection(orthographicRaw)
        .scale(249.5)
        .clipAngle(90 + epsilon);
  }
  
  function stereographicRaw(x, y) {
    var cy = cos(y), k = 1 + cos(x) * cy;
    return [cy * sin(x) / k, sin(y) / k];
  }
  
  stereographicRaw.invert = azimuthalInvert(function(z) {
    return 2 * atan(z);
  });
  
  function stereographic() {
    return projection(stereographicRaw)
        .scale(250)
        .clipAngle(142);
  }
  
  function transverseMercatorRaw(lambda, phi) {
    return [log(tan((halfPi + phi) / 2)), -lambda];
  }
  
  transverseMercatorRaw.invert = function(x, y) {
    return [-y, 2 * atan(exp(x)) - halfPi];
  };
  
  function transverseMercator() {
    var m = mercatorProjection(transverseMercatorRaw),
        center = m.center,
        rotate = m.rotate;
  
    m.center = function(_) {
      return arguments.length ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]]);
    };
  
    m.rotate = function(_) {
      return arguments.length ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
    };
  
    return rotate([0, 0, 90])
        .scale(159.155);
  }
  
  exports.geoAlbers = albers;
  exports.geoAlbersUsa = albersUsa;
  exports.geoArea = area;
  exports.geoAzimuthalEqualArea = azimuthalEqualArea;
  exports.geoAzimuthalEqualAreaRaw = azimuthalEqualAreaRaw;
  exports.geoAzimuthalEquidistant = azimuthalEquidistant;
  exports.geoAzimuthalEquidistantRaw = azimuthalEquidistantRaw;
  exports.geoBounds = bounds;
  exports.geoCentroid = centroid;
  exports.geoCircle = circle;
  exports.geoClipAntimeridian = clipAntimeridian;
  exports.geoClipCircle = clipCircle;
  exports.geoClipExtent = extent;
  exports.geoClipRectangle = clipRectangle;
  exports.geoConicConformal = conicConformal;
  exports.geoConicConformalRaw = conicConformalRaw;
  exports.geoConicEqualArea = conicEqualArea;
  exports.geoConicEqualAreaRaw = conicEqualAreaRaw;
  exports.geoConicEquidistant = conicEquidistant;
  exports.geoConicEquidistantRaw = conicEquidistantRaw;
  exports.geoContains = contains;
  exports.geoDistance = distance;
  exports.geoEqualEarth = equalEarth;
  exports.geoEqualEarthRaw = equalEarthRaw;
  exports.geoEquirectangular = equirectangular;
  exports.geoEquirectangularRaw = equirectangularRaw;
  exports.geoGnomonic = gnomonic;
  exports.geoGnomonicRaw = gnomonicRaw;
  exports.geoGraticule = graticule;
  exports.geoGraticule10 = graticule10;
  exports.geoIdentity = identity$1;
  exports.geoInterpolate = interpolate;
  exports.geoLength = length;
  exports.geoMercator = mercator;
  exports.geoMercatorRaw = mercatorRaw;
  exports.geoNaturalEarth1 = naturalEarth1;
  exports.geoNaturalEarth1Raw = naturalEarth1Raw;
  exports.geoOrthographic = orthographic;
  exports.geoOrthographicRaw = orthographicRaw;
  exports.geoPath = index;
  exports.geoProjection = projection;
  exports.geoProjectionMutator = projectionMutator;
  exports.geoRotation = rotation;
  exports.geoStereographic = stereographic;
  exports.geoStereographicRaw = stereographicRaw;
  exports.geoStream = geoStream;
  exports.geoTransform = transform;
  exports.geoTransverseMercator = transverseMercator;
  exports.geoTransverseMercatorRaw = transverseMercatorRaw;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  
  },{"d3-array":2}],8:[function(require,module,exports){
  // https://d3js.org/d3-interpolate/ v2.0.1 Copyright 2020 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-color')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-color'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}, global.d3));
  }(this, function (exports, d3Color) { 'use strict';
  
  function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0
        + (4 - 6 * t2 + 3 * t3) * v1
        + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
        + t3 * v3) / 6;
  }
  
  function basis$1(values) {
    var n = values.length - 1;
    return function(t) {
      var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
          v1 = values[i],
          v2 = values[i + 1],
          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }
  
  function basisClosed(values) {
    var n = values.length;
    return function(t) {
      var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
          v0 = values[(i + n - 1) % n],
          v1 = values[i % n],
          v2 = values[(i + 1) % n],
          v3 = values[(i + 2) % n];
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }
  
  var constant = x => () => x;
  
  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }
  
  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }
  
  function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
  }
  
  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
    };
  }
  
  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant(isNaN(a) ? b : a);
  }
  
  var rgb = (function rgbGamma(y) {
    var color = gamma(y);
  
    function rgb(start, end) {
      var r = color((start = d3Color.rgb(start)).r, (end = d3Color.rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }
  
    rgb.gamma = rgbGamma;
  
    return rgb;
  })(1);
  
  function rgbSpline(spline) {
    return function(colors) {
      var n = colors.length,
          r = new Array(n),
          g = new Array(n),
          b = new Array(n),
          i, color;
      for (i = 0; i < n; ++i) {
        color = d3Color.rgb(colors[i]);
        r[i] = color.r || 0;
        g[i] = color.g || 0;
        b[i] = color.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color.opacity = 1;
      return function(t) {
        color.r = r(t);
        color.g = g(t);
        color.b = b(t);
        return color + "";
      };
    };
  }
  
  var rgbBasis = rgbSpline(basis$1);
  var rgbBasisClosed = rgbSpline(basisClosed);
  
  function numberArray(a, b) {
    if (!b) b = [];
    var n = a ? Math.min(b.length, a.length) : 0,
        c = b.slice(),
        i;
    return function(t) {
      for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
      return c;
    };
  }
  
  function isNumberArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
  }
  
  function array(a, b) {
    return (isNumberArray(b) ? numberArray : genericArray)(a, b);
  }
  
  function genericArray(a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(na),
        c = new Array(nb),
        i;
  
    for (i = 0; i < na; ++i) x[i] = value(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];
  
    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }
  
  function date(a, b) {
    var d = new Date;
    return a = +a, b = +b, function(t) {
      return d.setTime(a * (1 - t) + b * t), d;
    };
  }
  
  function number(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }
  
  function object(a, b) {
    var i = {},
        c = {},
        k;
  
    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};
  
    for (k in b) {
      if (k in a) {
        i[k] = value(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }
  
    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }
  
  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");
  
  function zero(b) {
    return function() {
      return b;
    };
  }
  
  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }
  
  function string(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators
  
    // Coerce inputs to strings.
    a = a + "", b = b + "";
  
    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: number(am, bm)});
      }
      bi = reB.lastIndex;
    }
  
    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
  
    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }
  
  function value(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant(b)
        : (t === "number" ? number
        : t === "string" ? ((c = d3Color.color(b)) ? (b = c, rgb) : string)
        : b instanceof d3Color.color ? rgb
        : b instanceof Date ? date
        : isNumberArray(b) ? numberArray
        : Array.isArray(b) ? genericArray
        : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
        : number)(a, b);
  }
  
  function discrete(range) {
    var n = range.length;
    return function(t) {
      return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
    };
  }
  
  function hue$1(a, b) {
    var i = hue(+a, +b);
    return function(t) {
      var x = i(t);
      return x - 360 * Math.floor(x / 360);
    };
  }
  
  function round(a, b) {
    return a = +a, b = +b, function(t) {
      return Math.round(a * (1 - t) + b * t);
    };
  }
  
  var degrees = 180 / Math.PI;
  
  var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };
  
  function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }
  
  var svgNode;
  
  /* eslint-disable no-undef */
  function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? identity : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
  }
  
  function parseSvg(value) {
    if (value == null) return identity;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }
  
  function interpolateTransform(parse, pxComma, pxParen, degParen) {
  
    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }
  
    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: number(xa, xb)}, {i: i - 2, x: number(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }
  
    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }
  
    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }
  
    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: number(xa, xb)}, {i: i - 2, x: number(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }
  
    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }
  
  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
  
  var epsilon2 = 1e-12;
  
  function cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }
  
  function sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }
  
  function tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }
  
  var zoom = (function zoomRho(rho, rho2, rho4) {
  
    // p0 = [ux0, uy0, w0]
    // p1 = [ux1, uy1, w1]
    function zoom(p0, p1) {
      var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
          ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
          dx = ux1 - ux0,
          dy = uy1 - uy0,
          d2 = dx * dx + dy * dy,
          i,
          S;
  
      // Special case for u0 ≅ u1.
      if (d2 < epsilon2) {
        S = Math.log(w1 / w0) / rho;
        i = function(t) {
          return [
            ux0 + t * dx,
            uy0 + t * dy,
            w0 * Math.exp(rho * t * S)
          ];
        };
      }
  
      // General case.
      else {
        var d1 = Math.sqrt(d2),
            b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
            b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
            r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
            r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
        S = (r1 - r0) / rho;
        i = function(t) {
          var s = t * S,
              coshr0 = cosh(r0),
              u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
          return [
            ux0 + u * dx,
            uy0 + u * dy,
            w0 * coshr0 / cosh(rho * s + r0)
          ];
        };
      }
  
      i.duration = S * 1000 * rho / Math.SQRT2;
  
      return i;
    }
  
    zoom.rho = function(_) {
      var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
      return zoomRho(_1, _2, _4);
    };
  
    return zoom;
  })(Math.SQRT2, 2, 4);
  
  function hsl(hue) {
    return function(start, end) {
      var h = hue((start = d3Color.hsl(start)).h, (end = d3Color.hsl(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }
  }
  
  var hsl$1 = hsl(hue);
  var hslLong = hsl(nogamma);
  
  function lab(start, end) {
    var l = nogamma((start = d3Color.lab(start)).l, (end = d3Color.lab(end)).l),
        a = nogamma(start.a, end.a),
        b = nogamma(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.l = l(t);
      start.a = a(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
  
  function hcl(hue) {
    return function(start, end) {
      var h = hue((start = d3Color.hcl(start)).h, (end = d3Color.hcl(end)).h),
          c = nogamma(start.c, end.c),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.c = c(t);
        start.l = l(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }
  }
  
  var hcl$1 = hcl(hue);
  var hclLong = hcl(nogamma);
  
  function cubehelix(hue) {
    return (function cubehelixGamma(y) {
      y = +y;
  
      function cubehelix(start, end) {
        var h = hue((start = d3Color.cubehelix(start)).h, (end = d3Color.cubehelix(end)).h),
            s = nogamma(start.s, end.s),
            l = nogamma(start.l, end.l),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.h = h(t);
          start.s = s(t);
          start.l = l(Math.pow(t, y));
          start.opacity = opacity(t);
          return start + "";
        };
      }
  
      cubehelix.gamma = cubehelixGamma;
  
      return cubehelix;
    })(1);
  }
  
  var cubehelix$1 = cubehelix(hue);
  var cubehelixLong = cubehelix(nogamma);
  
  function piecewise(interpolate, values) {
    if (values === undefined) values = interpolate, interpolate = value;
    var i = 0, n = values.length - 1, v = values[0], I = new Array(n < 0 ? 0 : n);
    while (i < n) I[i] = interpolate(v, v = values[++i]);
    return function(t) {
      var i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
      return I[i](t - i);
    };
  }
  
  function quantize(interpolator, n) {
    var samples = new Array(n);
    for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
    return samples;
  }
  
  exports.interpolate = value;
  exports.interpolateArray = array;
  exports.interpolateBasis = basis$1;
  exports.interpolateBasisClosed = basisClosed;
  exports.interpolateCubehelix = cubehelix$1;
  exports.interpolateCubehelixLong = cubehelixLong;
  exports.interpolateDate = date;
  exports.interpolateDiscrete = discrete;
  exports.interpolateHcl = hcl$1;
  exports.interpolateHclLong = hclLong;
  exports.interpolateHsl = hsl$1;
  exports.interpolateHslLong = hslLong;
  exports.interpolateHue = hue$1;
  exports.interpolateLab = lab;
  exports.interpolateNumber = number;
  exports.interpolateNumberArray = numberArray;
  exports.interpolateObject = object;
  exports.interpolateRgb = rgb;
  exports.interpolateRgbBasis = rgbBasis;
  exports.interpolateRgbBasisClosed = rgbBasisClosed;
  exports.interpolateRound = round;
  exports.interpolateString = string;
  exports.interpolateTransformCss = interpolateTransformCss;
  exports.interpolateTransformSvg = interpolateTransformSvg;
  exports.interpolateZoom = zoom;
  exports.piecewise = piecewise;
  exports.quantize = quantize;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  
  },{"d3-color":3}],9:[function(require,module,exports){
  // https://d3js.org/d3-selection/ v2.0.0 Copyright 2020 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}));
  }(this, function (exports) { 'use strict';
  
  var xhtml = "http://www.w3.org/1999/xhtml";
  
  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };
  
  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
  }
  
  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }
  
  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }
  
  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }
  
  function none() {}
  
  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }
  
  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);
  
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }
  
    return new Selection(subgroups, this._parents);
  }
  
  function array(x) {
    return typeof x === "object" && "length" in x
      ? x // Array, TypedArray, NodeList, array-like
      : Array.from(x); // Map, Set, iterable, string, or anything else
  }
  
  function empty() {
    return [];
  }
  
  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }
  
  function arrayAll(select) {
    return function() {
      var group = select.apply(this, arguments);
      return group == null ? [] : array(group);
    };
  }
  
  function selection_selectAll(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll(select);
  
    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }
  
    return new Selection(subgroups, parents);
  }
  
  function matcher(selector) {
    return function() {
      return this.matches(selector);
    };
  }
  
  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }
  
  var find = Array.prototype.find;
  
  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }
  
  function childFirst() {
    return this.firstElementChild;
  }
  
  function selection_selectChild(match) {
    return this.select(match == null ? childFirst
        : childFind(typeof match === "function" ? match : childMatcher(match)));
  }
  
  var filter = Array.prototype.filter;
  
  function children() {
    return this.children;
  }
  
  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }
  
  function selection_selectChildren(match) {
    return this.selectAll(match == null ? children
        : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }
  
  function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);
  
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }
  
    return new Selection(subgroups, this._parents);
  }
  
  function sparse(update) {
    return new Array(update.length);
  }
  
  function selection_enter() {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
  }
  
  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }
  
  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };
  
  function constant(x) {
    return function() {
      return x;
    };
  }
  
  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;
  
    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }
  
    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }
  
  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = new Map,
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;
  
    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }
  
    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }
  
    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
        exit[i] = node;
      }
    }
  }
  
  function datum(node) {
    return node.__data__;
  }
  
  function selection_data(value, key) {
    if (!arguments.length) return Array.from(this, datum);
  
    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;
  
    if (typeof value !== "function") value = constant(value);
  
    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = array(value.call(parent, parent && parent.__data__, j, parents)),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);
  
      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
  
      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }
  
    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }
  
  function selection_exit() {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
  }
  
  function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
    if (onupdate != null) update = onupdate(update);
    if (onexit == null) exit.remove(); else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }
  
  function selection_merge(selection) {
    if (!(selection instanceof Selection)) throw new Error("invalid merge");
  
    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }
  
    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }
  
    return new Selection(merges, this._parents);
  }
  
  function selection_order() {
  
    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
  
    return this;
  }
  
  function selection_sort(compare) {
    if (!compare) compare = ascending;
  
    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }
  
    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }
  
    return new Selection(sortgroups, this._parents).order();
  }
  
  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }
  
  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }
  
  function selection_nodes() {
    return Array.from(this);
  }
  
  function selection_node() {
  
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }
  
    return null;
  }
  
  function selection_size() {
    let size = 0;
    for (const node of this) ++size; // eslint-disable-line no-unused-vars
    return size;
  }
  
  function selection_empty() {
    return !this.node();
  }
  
  function selection_each(callback) {
  
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }
  
    return this;
  }
  
  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }
  
  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }
  
  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }
  
  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }
  
  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }
  
  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }
  
  function selection_attr(name, value) {
    var fullname = namespace(name);
  
    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }
  
    return this.each((value == null
        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)
        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
  }
  
  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }
  
  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }
  
  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }
  
  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }
  
  function selection_style(name, value, priority) {
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove : typeof value === "function"
              ? styleFunction
              : styleConstant)(name, value, priority == null ? "" : priority))
        : styleValue(this.node(), name);
  }
  
  function styleValue(node, name) {
    return node.style.getPropertyValue(name)
        || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }
  
  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }
  
  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }
  
  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }
  
  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }
  
  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }
  
  function classList(node) {
    return node.classList || new ClassList(node);
  }
  
  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }
  
  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };
  
  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }
  
  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }
  
  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }
  
  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }
  
  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }
  
  function selection_classed(name, value) {
    var names = classArray(name + "");
  
    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }
  
    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }
  
  function textRemove() {
    this.textContent = "";
  }
  
  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }
  
  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }
  
  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction
            : textConstant)(value))
        : this.node().textContent;
  }
  
  function htmlRemove() {
    this.innerHTML = "";
  }
  
  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }
  
  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }
  
  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }
  
  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }
  
  function selection_raise() {
    return this.each(raise);
  }
  
  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }
  
  function selection_lower() {
    return this.each(lower);
  }
  
  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }
  
  function constantNull() {
    return null;
  }
  
  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }
  
  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }
  
  function selection_remove() {
    return this.each(remove);
  }
  
  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }
  
  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }
  
  function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }
  
  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }
  
  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }
  
  function parseTypenames(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }
  
  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }
  
  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }
  
  function selection_on(typename, value, options) {
    var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
  
    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }
  
    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }
  
  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;
  
    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }
  
    node.dispatchEvent(event);
  }
  
  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }
  
  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }
  
  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }
  
  function* selection_iterator() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }
  
  var root = [null];
  
  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }
  
  function selection() {
    return new Selection([[document.documentElement]], root);
  }
  
  function selection_selection() {
    return this;
  }
  
  Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    selectChild: selection_selectChild,
    selectChildren: selection_selectChildren,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    selection: selection_selection,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch,
    [Symbol.iterator]: selection_iterator
  };
  
  function select(selector) {
    return typeof selector === "string"
        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
        : new Selection([[selector]], root);
  }
  
  function create(name) {
    return select(creator(name).call(document.documentElement));
  }
  
  var nextId = 0;
  
  function local() {
    return new Local;
  }
  
  function Local() {
    this._ = "@" + (++nextId).toString(36);
  }
  
  Local.prototype = local.prototype = {
    constructor: Local,
    get: function(node) {
      var id = this._;
      while (!(id in node)) if (!(node = node.parentNode)) return;
      return node[id];
    },
    set: function(node, value) {
      return node[this._] = value;
    },
    remove: function(node) {
      return this._ in node && delete node[this._];
    },
    toString: function() {
      return this._;
    }
  };
  
  function sourceEvent(event) {
    let sourceEvent;
    while (sourceEvent = event.sourceEvent) event = sourceEvent;
    return event;
  }
  
  function pointer(event, node) {
    event = sourceEvent(event);
    if (node === undefined) node = event.currentTarget;
    if (node) {
      var svg = node.ownerSVGElement || node;
      if (svg.createSVGPoint) {
        var point = svg.createSVGPoint();
        point.x = event.clientX, point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        return [point.x, point.y];
      }
      if (node.getBoundingClientRect) {
        var rect = node.getBoundingClientRect();
        return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
      }
    }
    return [event.pageX, event.pageY];
  }
  
  function pointers(events, node) {
    if (events.target) { // i.e., instanceof Event, not TouchList or iterable
      events = sourceEvent(events);
      if (node === undefined) node = events.currentTarget;
      events = events.touches || [events];
    }
    return Array.from(events, event => pointer(event, node));
  }
  
  function selectAll(selector) {
    return typeof selector === "string"
        ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
        : new Selection([selector == null ? [] : array(selector)], root);
  }
  
  exports.create = create;
  exports.creator = creator;
  exports.local = local;
  exports.matcher = matcher;
  exports.namespace = namespace;
  exports.namespaces = namespaces;
  exports.pointer = pointer;
  exports.pointers = pointers;
  exports.select = select;
  exports.selectAll = selectAll;
  exports.selection = selection;
  exports.selector = selector;
  exports.selectorAll = selectorAll;
  exports.style = styleValue;
  exports.window = defaultView;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  
  },{}],10:[function(require,module,exports){
  // https://d3js.org/d3-timer/ v2.0.0 Copyright 2020 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}));
  }(this, function (exports) { 'use strict';
  
  var frame = 0, // is an animation frame pending?
      timeout = 0, // is a timeout pending?
      interval = 0, // are any timers active?
      pokeDelay = 1000, // how frequently we check for clock skew
      taskHead,
      taskTail,
      clockLast = 0,
      clockNow = 0,
      clockSkew = 0,
      clock = typeof performance === "object" && performance.now ? performance : Date,
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };
  
  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }
  
  function clearNow() {
    clockNow = 0;
  }
  
  function Timer() {
    this._call =
    this._time =
    this._next = null;
  }
  
  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };
  
  function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  }
  
  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
      t = t._next;
    }
    --frame;
  }
  
  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }
  
  function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }
  
  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }
  
  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }
  
  function timeout$1(callback, delay, time) {
    var t = new Timer;
    delay = delay == null ? 0 : +delay;
    t.restart(elapsed => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }
  
  function interval$1(callback, delay, time) {
    var t = new Timer, total = delay;
    if (delay == null) return t.restart(callback, delay, time), t;
    t._restart = t.restart;
    t.restart = function(callback, delay, time) {
      delay = +delay, time = time == null ? now() : +time;
      t._restart(function tick(elapsed) {
        elapsed += total;
        t._restart(tick, total += delay, time);
        callback(elapsed);
      }, delay, time);
    };
    t.restart(callback, delay, time);
    return t;
  }
  
  exports.interval = interval$1;
  exports.now = now;
  exports.timeout = timeout$1;
  exports.timer = timer;
  exports.timerFlush = timerFlush;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  
  },{}],11:[function(require,module,exports){
  // https://d3js.org/d3-transition/ v2.0.0 Copyright 2020 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-dispatch'), require('d3-timer'), require('d3-interpolate'), require('d3-color'), require('d3-ease')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-dispatch', 'd3-timer', 'd3-interpolate', 'd3-color', 'd3-ease'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3));
  }(this, function (exports, d3Selection, d3Dispatch, d3Timer, d3Interpolate, d3Color, d3Ease) { 'use strict';
  
  var emptyOn = d3Dispatch.dispatch("start", "end", "cancel", "interrupt");
  var emptyTween = [];
  
  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;
  
  function schedule(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }
  
  function init(node, id) {
    var schedule = get(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }
  
  function set(node, id) {
    var schedule = get(node, id);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }
  
  function get(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
  }
  
  function create(node, id, self) {
    var schedules = node.__transition,
        tween;
  
    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = d3Timer.timer(schedule, 0, self.time);
  
    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);
  
      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    }
  
    function start(elapsed) {
      var i, j, n, o;
  
      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();
  
      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;
  
        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return d3Timer.timeout(start);
  
        // Interrupt the active transition, if any.
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
  
        // Cancel any pre-empted transitions.
        else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }
  
      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      d3Timer.timeout(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });
  
      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;
  
      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }
  
    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;
  
      while (++i < n) {
        tween[i].call(node, t);
      }
  
      // Dispatch the end event.
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }
  
    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) return; // eslint-disable-line no-unused-vars
      delete node.__transition;
    }
  }
  
  function interrupt(node, name) {
    var schedules = node.__transition,
        schedule,
        active,
        empty = true,
        i;
  
    if (!schedules) return;
  
    name = name == null ? null : name + "";
  
    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }
  
    if (empty) delete node.__transition;
  }
  
  function selection_interrupt(name) {
    return this.each(function() {
      interrupt(this, name);
    });
  }
  
  function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
      var schedule = set(this, id),
          tween = schedule.tween;
  
      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }
  
      schedule.tween = tween1;
    };
  }
  
  function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
      var schedule = set(this, id),
          tween = schedule.tween;
  
      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }
  
      schedule.tween = tween1;
    };
  }
  
  function transition_tween(name, value) {
    var id = this._id;
  
    name += "";
  
    if (arguments.length < 2) {
      var tween = get(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }
  
    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  }
  
  function tweenValue(transition, name, value) {
    var id = transition._id;
  
    transition.each(function() {
      var schedule = set(this, id);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });
  
    return function(node) {
      return get(node, id).value[name];
    };
  }
  
  function interpolate(a, b) {
    var c;
    return (typeof b === "number" ? d3Interpolate.interpolateNumber
        : b instanceof d3Color.color ? d3Interpolate.interpolateRgb
        : (c = d3Color.color(b)) ? (b = c, d3Interpolate.interpolateRgb)
        : d3Interpolate.interpolateString)(a, b);
  }
  
  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }
  
  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }
  
  function attrConstant(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  
  function attrConstantNS(fullname, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  
  function attrFunction(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  
  function attrFunctionNS(fullname, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  
  function transition_attr(name, value) {
    var fullname = d3Selection.namespace(name), i = fullname === "transform" ? d3Interpolate.interpolateTransformSvg : interpolate;
    return this.attrTween(name, typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
        : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
        : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
  }
  
  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i.call(this, t));
    };
  }
  
  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
  }
  
  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  
  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  
  function transition_attrTween(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = d3Selection.namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }
  
  function delayFunction(id, value) {
    return function() {
      init(this, id).delay = +value.apply(this, arguments);
    };
  }
  
  function delayConstant(id, value) {
    return value = +value, function() {
      init(this, id).delay = value;
    };
  }
  
  function transition_delay(value) {
    var id = this._id;
  
    return arguments.length
        ? this.each((typeof value === "function"
            ? delayFunction
            : delayConstant)(id, value))
        : get(this.node(), id).delay;
  }
  
  function durationFunction(id, value) {
    return function() {
      set(this, id).duration = +value.apply(this, arguments);
    };
  }
  
  function durationConstant(id, value) {
    return value = +value, function() {
      set(this, id).duration = value;
    };
  }
  
  function transition_duration(value) {
    var id = this._id;
  
    return arguments.length
        ? this.each((typeof value === "function"
            ? durationFunction
            : durationConstant)(id, value))
        : get(this.node(), id).duration;
  }
  
  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
      set(this, id).ease = value;
    };
  }
  
  function transition_ease(value) {
    var id = this._id;
  
    return arguments.length
        ? this.each(easeConstant(id, value))
        : get(this.node(), id).ease;
  }
  
  function easeVarying(id, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function") throw new Error;
      set(this, id).ease = v;
    };
  }
  
  function transition_easeVarying(value) {
    if (typeof value !== "function") throw new Error;
    return this.each(easeVarying(this._id, value));
  }
  
  function transition_filter(match) {
    if (typeof match !== "function") match = d3Selection.matcher(match);
  
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }
  
    return new Transition(subgroups, this._parents, this._name, this._id);
  }
  
  function transition_merge(transition) {
    if (transition._id !== this._id) throw new Error;
  
    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }
  
    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }
  
    return new Transition(merges, this._parents, this._name, this._id);
  }
  
  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }
  
  function onFunction(id, name, listener) {
    var on0, on1, sit = start(name) ? init : set;
    return function() {
      var schedule = sit(this, id),
          on = schedule.on;
  
      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
  
      schedule.on = on1;
    };
  }
  
  function transition_on(name, listener) {
    var id = this._id;
  
    return arguments.length < 2
        ? get(this.node(), id).on.on(name)
        : this.each(onFunction(id, name, listener));
  }
  
  function removeFunction(id) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id) return;
      if (parent) parent.removeChild(this);
    };
  }
  
  function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
  }
  
  function transition_select(select) {
    var name = this._name,
        id = this._id;
  
    if (typeof select !== "function") select = d3Selection.selector(select);
  
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get(node, id));
        }
      }
    }
  
    return new Transition(subgroups, this._parents, name, id);
  }
  
  function transition_selectAll(select) {
    var name = this._name,
        id = this._id;
  
    if (typeof select !== "function") select = d3Selection.selectorAll(select);
  
    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
            if (child = children[k]) {
              schedule(child, name, id, k, children, inherit);
            }
          }
          subgroups.push(children);
          parents.push(node);
        }
      }
    }
  
    return new Transition(subgroups, parents, name, id);
  }
  
  var Selection = d3Selection.selection.prototype.constructor;
  
  function transition_selection() {
    return new Selection(this._groups, this._parents);
  }
  
  function styleNull(name, interpolate) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = d3Selection.style(this, name),
          string1 = (this.style.removeProperty(name), d3Selection.style(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }
  
  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }
  
  function styleConstant(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = d3Selection.style(this, name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  
  function styleFunction(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = d3Selection.style(this, name),
          value1 = value(this),
          string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), d3Selection.style(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  
  function styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
      var schedule = set(this, id),
          on = schedule.on,
          listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;
  
      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
  
      schedule.on = on1;
    };
  }
  
  function transition_style(name, value, priority) {
    var i = (name += "") === "transform" ? d3Interpolate.interpolateTransformCss : interpolate;
    return value == null ? this
        .styleTween(name, styleNull(name, i))
        .on("end.style." + name, styleRemove(name))
      : typeof value === "function" ? this
        .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
        .each(styleMaybeRemove(this._id, name))
      : this
        .styleTween(name, styleConstant(name, i, value), priority)
        .on("end.style." + name, null);
  }
  
  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i.call(this, t), priority);
    };
  }
  
  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }
  
  function transition_styleTween(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }
  
  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }
  
  function textFunction(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }
  
  function transition_text(value) {
    return this.tween("text", typeof value === "function"
        ? textFunction(tweenValue(this, "text", value))
        : textConstant(value == null ? "" : value + ""));
  }
  
  function textInterpolate(i) {
    return function(t) {
      this.textContent = i.call(this, t);
    };
  }
  
  function textTween(value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  
  function transition_textTween(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, textTween(value));
  }
  
  function transition_transition() {
    var name = this._name,
        id0 = this._id,
        id1 = newId();
  
    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit = get(node, id0);
          schedule(node, name, id1, i, group, {
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          });
        }
      }
    }
  
    return new Transition(groups, this._parents, name, id1);
  }
  
  function transition_end() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = {value: reject},
          end = {value: function() { if (--size === 0) resolve(); }};
  
      that.each(function() {
        var schedule = set(this, id),
            on = schedule.on;
  
        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }
  
        schedule.on = on1;
      });
  
      // The selection was empty, resolve end immediately
      if (size === 0) resolve();
    });
  }
  
  var id = 0;
  
  function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  }
  
  function transition(name) {
    return d3Selection.selection().transition(name);
  }
  
  function newId() {
    return ++id;
  }
  
  var selection_prototype = d3Selection.selection.prototype;
  
  Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    textTween: transition_textTween,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease,
    easeVarying: transition_easeVarying,
    end: transition_end,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
  };
  
  var defaultTiming = {
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: d3Ease.easeCubicInOut
  };
  
  function inherit(node, id) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id} not found`);
      }
    }
    return timing;
  }
  
  function selection_transition(name) {
    var id,
        timing;
  
    if (name instanceof Transition) {
      id = name._id, name = name._name;
    } else {
      id = newId(), (timing = defaultTiming).time = d3Timer.now(), name = name == null ? null : name + "";
    }
  
    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule(node, name, id, i, group, timing || inherit(node, id));
        }
      }
    }
  
    return new Transition(groups, this._parents, name, id);
  }
  
  d3Selection.selection.prototype.interrupt = selection_interrupt;
  d3Selection.selection.prototype.transition = selection_transition;
  
  var root = [null];
  
  function active(node, name) {
    var schedules = node.__transition,
        schedule,
        i;
  
    if (schedules) {
      name = name == null ? null : name + "";
      for (i in schedules) {
        if ((schedule = schedules[i]).state > SCHEDULED && schedule.name === name) {
          return new Transition([[node]], root, name, +i);
        }
      }
    }
  
    return null;
  }
  
  exports.active = active;
  exports.interrupt = interrupt;
  exports.transition = transition;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  
  },{"d3-color":3,"d3-dispatch":4,"d3-ease":6,"d3-interpolate":8,"d3-selection":9,"d3-timer":10}],12:[function(require,module,exports){
  // https://d3js.org/d3-zoom/ v2.0.0 Copyright 2020 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-dispatch'), require('d3-drag'), require('d3-interpolate'), require('d3-selection'), require('d3-transition')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-dispatch', 'd3-drag', 'd3-interpolate', 'd3-selection', 'd3-transition'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}, global.d3, global.d3, global.d3, global.d3, global.d3));
  }(this, (function (exports, d3Dispatch, d3Drag, d3Interpolate, d3Selection, d3Transition) { 'use strict';
  
  var constant = x => () => x;
  
  function ZoomEvent(type, {
    sourceEvent,
    target,
    transform,
    dispatch
  }) {
    Object.defineProperties(this, {
      type: {value: type, enumerable: true, configurable: true},
      sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
      target: {value: target, enumerable: true, configurable: true},
      transform: {value: transform, enumerable: true, configurable: true},
      _: {value: dispatch}
    });
  }
  
  function Transform(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
  }
  
  Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
      return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
      return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point) {
      return [point[0] * this.k + this.x, point[1] * this.k + this.y];
    },
    applyX: function(x) {
      return x * this.k + this.x;
    },
    applyY: function(y) {
      return y * this.k + this.y;
    },
    invert: function(location) {
      return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
    },
    invertX: function(x) {
      return (x - this.x) / this.k;
    },
    invertY: function(y) {
      return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
      return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
      return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
      return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
  };
  
  var identity = new Transform(1, 0, 0);
  
  transform.prototype = Transform.prototype;
  
  function transform(node) {
    while (!node.__zoom) if (!(node = node.parentNode)) return identity;
    return node.__zoom;
  }
  
  function nopropagation(event) {
    event.stopImmediatePropagation();
  }
  
  function noevent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  
  // Ignore right-click, since that should open the context menu.
  // except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
  function defaultFilter(event) {
    return (!event.ctrlKey || event.type === 'wheel') && !event.button;
  }
  
  function defaultExtent() {
    var e = this;
    if (e instanceof SVGElement) {
      e = e.ownerSVGElement || e;
      if (e.hasAttribute("viewBox")) {
        e = e.viewBox.baseVal;
        return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
      }
      return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
    }
    return [[0, 0], [e.clientWidth, e.clientHeight]];
  }
  
  function defaultTransform() {
    return this.__zoom || identity;
  }
  
  function defaultWheelDelta(event) {
    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
  }
  
  function defaultTouchable() {
    return navigator.maxTouchPoints || ("ontouchstart" in this);
  }
  
  function defaultConstrain(transform, extent, translateExtent) {
    var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
        dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
        dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
        dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
    return transform.translate(
      dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
      dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
    );
  }
  
  function zoom() {
    var filter = defaultFilter,
        extent = defaultExtent,
        constrain = defaultConstrain,
        wheelDelta = defaultWheelDelta,
        touchable = defaultTouchable,
        scaleExtent = [0, Infinity],
        translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
        duration = 250,
        interpolate = d3Interpolate.interpolateZoom,
        listeners = d3Dispatch.dispatch("start", "zoom", "end"),
        touchstarting,
        touchfirst,
        touchending,
        touchDelay = 500,
        wheelDelay = 150,
        clickDistance2 = 0,
        tapDistance = 10;
  
    function zoom(selection) {
      selection
          .property("__zoom", defaultTransform)
          .on("wheel.zoom", wheeled)
          .on("mousedown.zoom", mousedowned)
          .on("dblclick.zoom", dblclicked)
        .filter(touchable)
          .on("touchstart.zoom", touchstarted)
          .on("touchmove.zoom", touchmoved)
          .on("touchend.zoom touchcancel.zoom", touchended)
          .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
  
    zoom.transform = function(collection, transform, point, event) {
      var selection = collection.selection ? collection.selection() : collection;
      selection.property("__zoom", defaultTransform);
      if (collection !== selection) {
        schedule(collection, transform, point, event);
      } else {
        selection.interrupt().each(function() {
          gesture(this, arguments)
            .event(event)
            .start()
            .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
            .end();
        });
      }
    };
  
    zoom.scaleBy = function(selection, k, p, event) {
      zoom.scaleTo(selection, function() {
        var k0 = this.__zoom.k,
            k1 = typeof k === "function" ? k.apply(this, arguments) : k;
        return k0 * k1;
      }, p, event);
    };
  
    zoom.scaleTo = function(selection, k, p, event) {
      zoom.transform(selection, function() {
        var e = extent.apply(this, arguments),
            t0 = this.__zoom,
            p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
            p1 = t0.invert(p0),
            k1 = typeof k === "function" ? k.apply(this, arguments) : k;
        return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
      }, p, event);
    };
  
    zoom.translateBy = function(selection, x, y, event) {
      zoom.transform(selection, function() {
        return constrain(this.__zoom.translate(
          typeof x === "function" ? x.apply(this, arguments) : x,
          typeof y === "function" ? y.apply(this, arguments) : y
        ), extent.apply(this, arguments), translateExtent);
      }, null, event);
    };
  
    zoom.translateTo = function(selection, x, y, p, event) {
      zoom.transform(selection, function() {
        var e = extent.apply(this, arguments),
            t = this.__zoom,
            p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
        return constrain(identity.translate(p0[0], p0[1]).scale(t.k).translate(
          typeof x === "function" ? -x.apply(this, arguments) : -x,
          typeof y === "function" ? -y.apply(this, arguments) : -y
        ), e, translateExtent);
      }, p, event);
    };
  
    function scale(transform, k) {
      k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
      return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
    }
  
    function translate(transform, p0, p1) {
      var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
      return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
    }
  
    function centroid(extent) {
      return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
    }
  
    function schedule(transition, transform, point, event) {
      transition
          .on("start.zoom", function() { gesture(this, arguments).event(event).start(); })
          .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).event(event).end(); })
          .tween("zoom", function() {
            var that = this,
                args = arguments,
                g = gesture(that, args).event(event),
                e = extent.apply(that, args),
                p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
                w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
                a = that.__zoom,
                b = typeof transform === "function" ? transform.apply(that, args) : transform,
                i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
            return function(t) {
              if (t === 1) t = b; // Avoid rounding error on end.
              else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
              g.zoom(null, t);
            };
          });
    }
  
    function gesture(that, args, clean) {
      return (!clean && that.__zooming) || new Gesture(that, args);
    }
  
    function Gesture(that, args) {
      this.that = that;
      this.args = args;
      this.active = 0;
      this.sourceEvent = null;
      this.extent = extent.apply(that, args);
      this.taps = 0;
    }
  
    Gesture.prototype = {
      event: function(event) {
        if (event) this.sourceEvent = event;
        return this;
      },
      start: function() {
        if (++this.active === 1) {
          this.that.__zooming = this;
          this.emit("start");
        }
        return this;
      },
      zoom: function(key, transform) {
        if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
        if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
        if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
        this.that.__zoom = transform;
        this.emit("zoom");
        return this;
      },
      end: function() {
        if (--this.active === 0) {
          delete this.that.__zooming;
          this.emit("end");
        }
        return this;
      },
      emit: function(type) {
        var d = d3Selection.select(this.that).datum();
        listeners.call(
          type,
          this.that,
          new ZoomEvent(type, {
            sourceEvent: this.sourceEvent,
            target: zoom,
            type,
            transform: this.that.__zoom,
            dispatch: listeners
          }),
          d
        );
      }
    };
  
    function wheeled(event, ...args) {
      if (!filter.apply(this, arguments)) return;
      var g = gesture(this, args).event(event),
          t = this.__zoom,
          k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
          p = d3Selection.pointer(event);
  
      // If the mouse is in the same location as before, reuse it.
      // If there were recent wheel events, reset the wheel idle timeout.
      if (g.wheel) {
        if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
          g.mouse[1] = t.invert(g.mouse[0] = p);
        }
        clearTimeout(g.wheel);
      }
  
      // If this wheel event won’t trigger a transform change, ignore it.
      else if (t.k === k) return;
  
      // Otherwise, capture the mouse point and location at the start.
      else {
        g.mouse = [p, t.invert(p)];
        d3Transition.interrupt(this);
        g.start();
      }
  
      noevent(event);
      g.wheel = setTimeout(wheelidled, wheelDelay);
      g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
  
      function wheelidled() {
        g.wheel = null;
        g.end();
      }
    }
  
    function mousedowned(event, ...args) {
      if (touchending || !filter.apply(this, arguments)) return;
      var g = gesture(this, args, true).event(event),
          v = d3Selection.select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
          p = d3Selection.pointer(event, currentTarget),
          currentTarget = event.currentTarget,
          x0 = event.clientX,
          y0 = event.clientY;
  
      d3Drag.dragDisable(event.view);
      nopropagation(event);
      g.mouse = [p, this.__zoom.invert(p)];
      d3Transition.interrupt(this);
      g.start();
  
      function mousemoved(event) {
        noevent(event);
        if (!g.moved) {
          var dx = event.clientX - x0, dy = event.clientY - y0;
          g.moved = dx * dx + dy * dy > clickDistance2;
        }
        g.event(event)
         .zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = d3Selection.pointer(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
      }
  
      function mouseupped(event) {
        v.on("mousemove.zoom mouseup.zoom", null);
        d3Drag.dragEnable(event.view, g.moved);
        noevent(event);
        g.event(event).end();
      }
    }
  
    function dblclicked(event, ...args) {
      if (!filter.apply(this, arguments)) return;
      var t0 = this.__zoom,
          p0 = d3Selection.pointer(event.changedTouches ? event.changedTouches[0] : event, this),
          p1 = t0.invert(p0),
          k1 = t0.k * (event.shiftKey ? 0.5 : 2),
          t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
  
      noevent(event);
      if (duration > 0) d3Selection.select(this).transition().duration(duration).call(schedule, t1, p0, event);
      else d3Selection.select(this).call(zoom.transform, t1, p0, event);
    }
  
    function touchstarted(event, ...args) {
      if (!filter.apply(this, arguments)) return;
      var touches = event.touches,
          n = touches.length,
          g = gesture(this, args, event.changedTouches.length === n).event(event),
          started, i, t, p;
  
      nopropagation(event);
      for (i = 0; i < n; ++i) {
        t = touches[i], p = d3Selection.pointer(t, this);
        p = [p, this.__zoom.invert(p), t.identifier];
        if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
        else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
      }
  
      if (touchstarting) touchstarting = clearTimeout(touchstarting);
  
      if (started) {
        if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
        d3Transition.interrupt(this);
        g.start();
      }
    }
  
    function touchmoved(event, ...args) {
      if (!this.__zooming) return;
      var g = gesture(this, args).event(event),
          touches = event.changedTouches,
          n = touches.length, i, t, p, l;
  
      noevent(event);
      for (i = 0; i < n; ++i) {
        t = touches[i], p = d3Selection.pointer(t, this);
        if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
        else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
      }
      t = g.that.__zoom;
      if (g.touch1) {
        var p0 = g.touch0[0], l0 = g.touch0[1],
            p1 = g.touch1[0], l1 = g.touch1[1],
            dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
            dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
        t = scale(t, Math.sqrt(dp / dl));
        p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
        l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
      }
      else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
      else return;
  
      g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
    }
  
    function touchended(event, ...args) {
      if (!this.__zooming) return;
      var g = gesture(this, args).event(event),
          touches = event.changedTouches,
          n = touches.length, i, t;
  
      nopropagation(event);
      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function() { touchending = null; }, touchDelay);
      for (i = 0; i < n; ++i) {
        t = touches[i];
        if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
        else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
      }
      if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
      if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
      else {
        g.end();
        // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
        if (g.taps === 2) {
          t = d3Selection.pointer(t, this);
          if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
            var p = d3Selection.select(this).on("dblclick.zoom");
            if (p) p.apply(this, arguments);
          }
        }
      }
    }
  
    zoom.wheelDelta = function(_) {
      return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant(+_), zoom) : wheelDelta;
    };
  
    zoom.filter = function(_) {
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), zoom) : filter;
    };
  
    zoom.touchable = function(_) {
      return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), zoom) : touchable;
    };
  
    zoom.extent = function(_) {
      return arguments.length ? (extent = typeof _ === "function" ? _ : constant([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
    };
  
    zoom.scaleExtent = function(_) {
      return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
    };
  
    zoom.translateExtent = function(_) {
      return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
    };
  
    zoom.constrain = function(_) {
      return arguments.length ? (constrain = _, zoom) : constrain;
    };
  
    zoom.duration = function(_) {
      return arguments.length ? (duration = +_, zoom) : duration;
    };
  
    zoom.interpolate = function(_) {
      return arguments.length ? (interpolate = _, zoom) : interpolate;
    };
  
    zoom.on = function() {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? zoom : value;
    };
  
    zoom.clickDistance = function(_) {
      return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
    };
  
    zoom.tapDistance = function(_) {
      return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
    };
  
    return zoom;
  }
  
  exports.zoom = zoom;
  exports.zoomIdentity = identity;
  exports.zoomTransform = transform;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  })));
  
  },{"d3-dispatch":4,"d3-drag":5,"d3-interpolate":8,"d3-selection":9,"d3-transition":11}],13:[function(require,module,exports){
  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  
  'use strict';
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  
  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('Object.assign cannot be called with null or undefined');
    }
  
    return Object(val);
  }
  
  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }
  
      // Detect buggy property enumeration order in older V8 versions.
  
      // https://bugs.chromium.org/p/v8/issues/detail?id=4118
      var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
      test1[5] = 'de';
      if (Object.getOwnPropertyNames(test1)[0] === '5') {
        return false;
      }
  
      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2['_' + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
        return test2[n];
      });
      if (order2.join('') !== '0123456789') {
        return false;
      }
  
      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test3 = {};
      'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join('') !==
          'abcdefghijklmnopqrst') {
        return false;
      }
  
      return true;
    } catch (err) {
      // We don't expect any of the above to throw, but better to be safe.
      return false;
    }
  }
  
  module.exports = shouldUseNative() ? Object.assign : function (target, source) {
    var from;
    var to = toObject(target);
    var symbols;
  
    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);
  
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }
  
      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }
  
    return to;
  };
  
  },{}],14:[function(require,module,exports){
  // shim for using process in browser
  var process = module.exports = {};
  
  // cached from whatever global is present so that test runners that stub it
  // don't break things.  But we need to wrap it in a try catch in case it is
  // wrapped in strict mode code which doesn't define any globals.  It's inside a
  // function because try/catches deoptimize in certain engines.
  
  var cachedSetTimeout;
  var cachedClearTimeout;
  
  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  (function () {
      try {
          if (typeof setTimeout === 'function') {
              cachedSetTimeout = setTimeout;
          } else {
              cachedSetTimeout = defaultSetTimout;
          }
      } catch (e) {
          cachedSetTimeout = defaultSetTimout;
      }
      try {
          if (typeof clearTimeout === 'function') {
              cachedClearTimeout = clearTimeout;
          } else {
              cachedClearTimeout = defaultClearTimeout;
          }
      } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
      }
  } ())
  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }
  
  
  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }
  
  
  
  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;
  
  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }
  
  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
  
      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  
  process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  };
  
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = ''; // empty string to avoid regexp issues
  process.versions = {};
  
  function noop() {}
  
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.prependListener = noop;
  process.prependOnceListener = noop;
  
  process.listeners = function (name) { return [] }
  
  process.binding = function (name) {
      throw new Error('process.binding is not supported');
  };
  
  process.cwd = function () { return '/' };
  process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
  };
  process.umask = function() { return 0; };
  
  },{}],15:[function(require,module,exports){
  (function (process){(function (){
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  
  'use strict';
  
  var printWarning = function() {};
  
  if (process.env.NODE_ENV !== 'production') {
    var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
    var loggedTypeFailures = {};
    var has = require('./lib/has');
  
    printWarning = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) { /**/ }
    };
  }
  
  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    if (process.env.NODE_ENV !== 'production') {
      for (var typeSpecName in typeSpecs) {
        if (has(typeSpecs, typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error(
                (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
                'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
              );
              err.name = 'Invariant Violation';
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning(
              (componentName || 'React class') + ': type specification of ' +
              location + ' `' + typeSpecName + '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
            );
          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;
  
            var stack = getStack ? getStack() : '';
  
            printWarning(
              'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
            );
          }
        }
      }
    }
  }
  
  /**
   * Resets warning cache when testing.
   *
   * @private
   */
  checkPropTypes.resetWarningCache = function() {
    if (process.env.NODE_ENV !== 'production') {
      loggedTypeFailures = {};
    }
  }
  
  module.exports = checkPropTypes;
  
  }).call(this)}).call(this,require('_process'))
  },{"./lib/ReactPropTypesSecret":19,"./lib/has":20,"_process":14}],16:[function(require,module,exports){
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  
  'use strict';
  
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  
  function emptyFunction() {}
  function emptyFunctionWithReset() {}
  emptyFunctionWithReset.resetWarningCache = emptyFunction;
  
  module.exports = function() {
    function shim(props, propName, componentName, location, propFullName, secret) {
      if (secret === ReactPropTypesSecret) {
        // It is still safe when called from React.
        return;
      }
      var err = new Error(
        'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
        'Use PropTypes.checkPropTypes() to call them. ' +
        'Read more at http://fb.me/use-check-prop-types'
      );
      err.name = 'Invariant Violation';
      throw err;
    };
    shim.isRequired = shim;
    function getShim() {
      return shim;
    };
    // Important!
    // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
    var ReactPropTypes = {
      array: shim,
      bigint: shim,
      bool: shim,
      func: shim,
      number: shim,
      object: shim,
      string: shim,
      symbol: shim,
  
      any: shim,
      arrayOf: getShim,
      element: shim,
      elementType: shim,
      instanceOf: getShim,
      node: shim,
      objectOf: getShim,
      oneOf: getShim,
      oneOfType: getShim,
      shape: getShim,
      exact: getShim,
  
      checkPropTypes: emptyFunctionWithReset,
      resetWarningCache: emptyFunction
    };
  
    ReactPropTypes.PropTypes = ReactPropTypes;
  
    return ReactPropTypes;
  };
  
  },{"./lib/ReactPropTypesSecret":19}],17:[function(require,module,exports){
  (function (process){(function (){
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  
  'use strict';
  
  var ReactIs = require('react-is');
  var assign = require('object-assign');
  
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  var has = require('./lib/has');
  var checkPropTypes = require('./checkPropTypes');
  
  var printWarning = function() {};
  
  if (process.env.NODE_ENV !== 'production') {
    printWarning = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }
  
  function emptyFunctionThatReturnsNull() {
    return null;
  }
  
  module.exports = function(isValidElement, throwOnDirectAccess) {
    /* global Symbol */
    var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.
  
    /**
     * Returns the iterator method function contained on the iterable object.
     *
     * Be sure to invoke the function with the iterable as context:
     *
     *     var iteratorFn = getIteratorFn(myIterable);
     *     if (iteratorFn) {
     *       var iterator = iteratorFn.call(myIterable);
     *       ...
     *     }
     *
     * @param {?object} maybeIterable
     * @return {?function}
     */
    function getIteratorFn(maybeIterable) {
      var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
      if (typeof iteratorFn === 'function') {
        return iteratorFn;
      }
    }
  
    /**
     * Collection of methods that allow declaration and validation of props that are
     * supplied to React components. Example usage:
     *
     *   var Props = require('ReactPropTypes');
     *   var MyArticle = React.createClass({
     *     propTypes: {
     *       // An optional string prop named "description".
     *       description: Props.string,
     *
     *       // A required enum prop named "category".
     *       category: Props.oneOf(['News','Photos']).isRequired,
     *
     *       // A prop named "dialog" that requires an instance of Dialog.
     *       dialog: Props.instanceOf(Dialog).isRequired
     *     },
     *     render: function() { ... }
     *   });
     *
     * A more formal specification of how these methods are used:
     *
     *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
     *   decl := ReactPropTypes.{type}(.isRequired)?
     *
     * Each and every declaration produces a function with the same signature. This
     * allows the creation of custom validation functions. For example:
     *
     *  var MyLink = React.createClass({
     *    propTypes: {
     *      // An optional string or URI prop named "href".
     *      href: function(props, propName, componentName) {
     *        var propValue = props[propName];
     *        if (propValue != null && typeof propValue !== 'string' &&
     *            !(propValue instanceof URI)) {
     *          return new Error(
     *            'Expected a string or an URI for ' + propName + ' in ' +
     *            componentName
     *          );
     *        }
     *      }
     *    },
     *    render: function() {...}
     *  });
     *
     * @internal
     */
  
    var ANONYMOUS = '<<anonymous>>';
  
    // Important!
    // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
    var ReactPropTypes = {
      array: createPrimitiveTypeChecker('array'),
      bigint: createPrimitiveTypeChecker('bigint'),
      bool: createPrimitiveTypeChecker('boolean'),
      func: createPrimitiveTypeChecker('function'),
      number: createPrimitiveTypeChecker('number'),
      object: createPrimitiveTypeChecker('object'),
      string: createPrimitiveTypeChecker('string'),
      symbol: createPrimitiveTypeChecker('symbol'),
  
      any: createAnyTypeChecker(),
      arrayOf: createArrayOfTypeChecker,
      element: createElementTypeChecker(),
      elementType: createElementTypeTypeChecker(),
      instanceOf: createInstanceTypeChecker,
      node: createNodeChecker(),
      objectOf: createObjectOfTypeChecker,
      oneOf: createEnumTypeChecker,
      oneOfType: createUnionTypeChecker,
      shape: createShapeTypeChecker,
      exact: createStrictShapeTypeChecker,
    };
  
    /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    /*eslint-disable no-self-compare*/
    function is(x, y) {
      // SameValue algorithm
      if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
      } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
      }
    }
    /*eslint-enable no-self-compare*/
  
    /**
     * We use an Error-like object for backward compatibility as people may call
     * PropTypes directly and inspect their output. However, we don't use real
     * Errors anymore. We don't inspect their stack anyway, and creating them
     * is prohibitively expensive if they are created too often, such as what
     * happens in oneOfType() for any type before the one that matched.
     */
    function PropTypeError(message, data) {
      this.message = message;
      this.data = data && typeof data === 'object' ? data: {};
      this.stack = '';
    }
    // Make `instanceof Error` still work for returned errors.
    PropTypeError.prototype = Error.prototype;
  
    function createChainableTypeChecker(validate) {
      if (process.env.NODE_ENV !== 'production') {
        var manualPropTypeCallCache = {};
        var manualPropTypeWarningCount = 0;
      }
      function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
        componentName = componentName || ANONYMOUS;
        propFullName = propFullName || propName;
  
        if (secret !== ReactPropTypesSecret) {
          if (throwOnDirectAccess) {
            // New behavior only for users of `prop-types` package
            var err = new Error(
              'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
              'Use `PropTypes.checkPropTypes()` to call them. ' +
              'Read more at http://fb.me/use-check-prop-types'
            );
            err.name = 'Invariant Violation';
            throw err;
          } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
            // Old behavior for people using React.PropTypes
            var cacheKey = componentName + ':' + propName;
            if (
              !manualPropTypeCallCache[cacheKey] &&
              // Avoid spamming the console because they are often not actionable except for lib authors
              manualPropTypeWarningCount < 3
            ) {
              printWarning(
                'You are manually calling a React.PropTypes validation ' +
                'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
                'and will throw in the standalone `prop-types` package. ' +
                'You may be seeing this warning due to a third-party PropTypes ' +
                'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
              );
              manualPropTypeCallCache[cacheKey] = true;
              manualPropTypeWarningCount++;
            }
          }
        }
        if (props[propName] == null) {
          if (isRequired) {
            if (props[propName] === null) {
              return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
            }
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
          }
          return null;
        } else {
          return validate(props, propName, componentName, location, propFullName);
        }
      }
  
      var chainedCheckType = checkType.bind(null, false);
      chainedCheckType.isRequired = checkType.bind(null, true);
  
      return chainedCheckType;
    }
  
    function createPrimitiveTypeChecker(expectedType) {
      function validate(props, propName, componentName, location, propFullName, secret) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== expectedType) {
          // `propValue` being instance of, say, date/regexp, pass the 'object'
          // check, but we can offer a more precise error message here rather than
          // 'of type `object`'.
          var preciseType = getPreciseType(propValue);
  
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
            {expectedType: expectedType}
          );
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
  
    function createAnyTypeChecker() {
      return createChainableTypeChecker(emptyFunctionThatReturnsNull);
    }
  
    function createArrayOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
        }
        var propValue = props[propName];
        if (!Array.isArray(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
        }
        for (var i = 0; i < propValue.length; i++) {
          var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
  
    function createElementTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!isValidElement(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
  
    function createElementTypeTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!ReactIs.isValidElementType(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
  
    function createInstanceTypeChecker(expectedClass) {
      function validate(props, propName, componentName, location, propFullName) {
        if (!(props[propName] instanceof expectedClass)) {
          var expectedClassName = expectedClass.name || ANONYMOUS;
          var actualClassName = getClassName(props[propName]);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
  
    function createEnumTypeChecker(expectedValues) {
      if (!Array.isArray(expectedValues)) {
        if (process.env.NODE_ENV !== 'production') {
          if (arguments.length > 1) {
            printWarning(
              'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
              'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
            );
          } else {
            printWarning('Invalid argument supplied to oneOf, expected an array.');
          }
        }
        return emptyFunctionThatReturnsNull;
      }
  
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        for (var i = 0; i < expectedValues.length; i++) {
          if (is(propValue, expectedValues[i])) {
            return null;
          }
        }
  
        var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
          var type = getPreciseType(value);
          if (type === 'symbol') {
            return String(value);
          }
          return value;
        });
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
      }
      return createChainableTypeChecker(validate);
    }
  
    function createObjectOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
        }
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
        }
        for (var key in propValue) {
          if (has(propValue, key)) {
            var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
  
    function createUnionTypeChecker(arrayOfTypeCheckers) {
      if (!Array.isArray(arrayOfTypeCheckers)) {
        process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
        return emptyFunctionThatReturnsNull;
      }
  
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (typeof checker !== 'function') {
          printWarning(
            'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
            'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
          );
          return emptyFunctionThatReturnsNull;
        }
      }
  
      function validate(props, propName, componentName, location, propFullName) {
        var expectedTypes = [];
        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
          if (checkerResult == null) {
            return null;
          }
          if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
            expectedTypes.push(checkerResult.data.expectedType);
          }
        }
        var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
      }
      return createChainableTypeChecker(validate);
    }
  
    function createNodeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        if (!isNode(props[propName])) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
  
    function invalidValidatorError(componentName, location, propFullName, key, type) {
      return new PropTypeError(
        (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
        'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
      );
    }
  
    function createShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
        }
        for (var key in shapeTypes) {
          var checker = shapeTypes[key];
          if (typeof checker !== 'function') {
            return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
          }
          var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
  
    function createStrictShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
        }
        // We need to check all keys in case some are required but missing from props.
        var allKeys = assign({}, props[propName], shapeTypes);
        for (var key in allKeys) {
          var checker = shapeTypes[key];
          if (has(shapeTypes, key) && typeof checker !== 'function') {
            return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
          }
          if (!checker) {
            return new PropTypeError(
              'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
              '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
              '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
            );
          }
          var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error) {
            return error;
          }
        }
        return null;
      }
  
      return createChainableTypeChecker(validate);
    }
  
    function isNode(propValue) {
      switch (typeof propValue) {
        case 'number':
        case 'string':
        case 'undefined':
          return true;
        case 'boolean':
          return !propValue;
        case 'object':
          if (Array.isArray(propValue)) {
            return propValue.every(isNode);
          }
          if (propValue === null || isValidElement(propValue)) {
            return true;
          }
  
          var iteratorFn = getIteratorFn(propValue);
          if (iteratorFn) {
            var iterator = iteratorFn.call(propValue);
            var step;
            if (iteratorFn !== propValue.entries) {
              while (!(step = iterator.next()).done) {
                if (!isNode(step.value)) {
                  return false;
                }
              }
            } else {
              // Iterator will provide entry [k,v] tuples rather than values.
              while (!(step = iterator.next()).done) {
                var entry = step.value;
                if (entry) {
                  if (!isNode(entry[1])) {
                    return false;
                  }
                }
              }
            }
          } else {
            return false;
          }
  
          return true;
        default:
          return false;
      }
    }
  
    function isSymbol(propType, propValue) {
      // Native Symbol.
      if (propType === 'symbol') {
        return true;
      }
  
      // falsy value can't be a Symbol
      if (!propValue) {
        return false;
      }
  
      // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
      if (propValue['@@toStringTag'] === 'Symbol') {
        return true;
      }
  
      // Fallback for non-spec compliant Symbols which are polyfilled.
      if (typeof Symbol === 'function' && propValue instanceof Symbol) {
        return true;
      }
  
      return false;
    }
  
    // Equivalent of `typeof` but with special handling for array and regexp.
    function getPropType(propValue) {
      var propType = typeof propValue;
      if (Array.isArray(propValue)) {
        return 'array';
      }
      if (propValue instanceof RegExp) {
        // Old webkits (at least until Android 4.0) return 'function' rather than
        // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
        // passes PropTypes.object.
        return 'object';
      }
      if (isSymbol(propType, propValue)) {
        return 'symbol';
      }
      return propType;
    }
  
    // This handles more types than `getPropType`. Only used for error messages.
    // See `createPrimitiveTypeChecker`.
    function getPreciseType(propValue) {
      if (typeof propValue === 'undefined' || propValue === null) {
        return '' + propValue;
      }
      var propType = getPropType(propValue);
      if (propType === 'object') {
        if (propValue instanceof Date) {
          return 'date';
        } else if (propValue instanceof RegExp) {
          return 'regexp';
        }
      }
      return propType;
    }
  
    // Returns a string that is postfixed to a warning about an invalid type.
    // For example, "undefined" or "of type array"
    function getPostfixForTypeWarning(value) {
      var type = getPreciseType(value);
      switch (type) {
        case 'array':
        case 'object':
          return 'an ' + type;
        case 'boolean':
        case 'date':
        case 'regexp':
          return 'a ' + type;
        default:
          return type;
      }
    }
  
    // Returns class name of the object, if any.
    function getClassName(propValue) {
      if (!propValue.constructor || !propValue.constructor.name) {
        return ANONYMOUS;
      }
      return propValue.constructor.name;
    }
  
    ReactPropTypes.checkPropTypes = checkPropTypes;
    ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
    ReactPropTypes.PropTypes = ReactPropTypes;
  
    return ReactPropTypes;
  };
  
  }).call(this)}).call(this,require('_process'))
  },{"./checkPropTypes":15,"./lib/ReactPropTypesSecret":19,"./lib/has":20,"_process":14,"object-assign":13,"react-is":23}],18:[function(require,module,exports){
  (function (process){(function (){
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  
  if (process.env.NODE_ENV !== 'production') {
    var ReactIs = require('react-is');
  
    // By explicitly using `prop-types` you are opting into new development behavior.
    // http://fb.me/prop-types-in-prod
    var throwOnDirectAccess = true;
    module.exports = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
  } else {
    // By explicitly using `prop-types` you are opting into new production behavior.
    // http://fb.me/prop-types-in-prod
    module.exports = require('./factoryWithThrowingShims')();
  }
  
  }).call(this)}).call(this,require('_process'))
  },{"./factoryWithThrowingShims":16,"./factoryWithTypeCheckers":17,"_process":14,"react-is":23}],19:[function(require,module,exports){
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  
  'use strict';
  
  var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
  
  module.exports = ReactPropTypesSecret;
  
  },{}],20:[function(require,module,exports){
  module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
  
  },{}],21:[function(require,module,exports){
  (function (process){(function (){
  /** @license React v16.13.1
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  
  'use strict';
  
  
  
  if (process.env.NODE_ENV !== "production") {
    (function() {
  'use strict';
  
  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var hasSymbol = typeof Symbol === 'function' && Symbol.for;
  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
  var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
  // (unstable) APIs that have been removed. Can we remove the symbols?
  
  var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
  var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
  var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
  var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
  var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
  var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
  var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
  
  function isValidElementType(type) {
    return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
  }
  
  function typeOf(object) {
    if (typeof object === 'object' && object !== null) {
      var $$typeof = object.$$typeof;
  
      switch ($$typeof) {
        case REACT_ELEMENT_TYPE:
          var type = object.type;
  
          switch (type) {
            case REACT_ASYNC_MODE_TYPE:
            case REACT_CONCURRENT_MODE_TYPE:
            case REACT_FRAGMENT_TYPE:
            case REACT_PROFILER_TYPE:
            case REACT_STRICT_MODE_TYPE:
            case REACT_SUSPENSE_TYPE:
              return type;
  
            default:
              var $$typeofType = type && type.$$typeof;
  
              switch ($$typeofType) {
                case REACT_CONTEXT_TYPE:
                case REACT_FORWARD_REF_TYPE:
                case REACT_LAZY_TYPE:
                case REACT_MEMO_TYPE:
                case REACT_PROVIDER_TYPE:
                  return $$typeofType;
  
                default:
                  return $$typeof;
              }
  
          }
  
        case REACT_PORTAL_TYPE:
          return $$typeof;
      }
    }
  
    return undefined;
  } // AsyncMode is deprecated along with isAsyncMode
  
  var AsyncMode = REACT_ASYNC_MODE_TYPE;
  var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
  var ContextConsumer = REACT_CONTEXT_TYPE;
  var ContextProvider = REACT_PROVIDER_TYPE;
  var Element = REACT_ELEMENT_TYPE;
  var ForwardRef = REACT_FORWARD_REF_TYPE;
  var Fragment = REACT_FRAGMENT_TYPE;
  var Lazy = REACT_LAZY_TYPE;
  var Memo = REACT_MEMO_TYPE;
  var Portal = REACT_PORTAL_TYPE;
  var Profiler = REACT_PROFILER_TYPE;
  var StrictMode = REACT_STRICT_MODE_TYPE;
  var Suspense = REACT_SUSPENSE_TYPE;
  var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated
  
  function isAsyncMode(object) {
    {
      if (!hasWarnedAboutDeprecatedIsAsyncMode) {
        hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint
  
        console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
      }
    }
  
    return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
  }
  function isConcurrentMode(object) {
    return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
  }
  function isContextConsumer(object) {
    return typeOf(object) === REACT_CONTEXT_TYPE;
  }
  function isContextProvider(object) {
    return typeOf(object) === REACT_PROVIDER_TYPE;
  }
  function isElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  function isForwardRef(object) {
    return typeOf(object) === REACT_FORWARD_REF_TYPE;
  }
  function isFragment(object) {
    return typeOf(object) === REACT_FRAGMENT_TYPE;
  }
  function isLazy(object) {
    return typeOf(object) === REACT_LAZY_TYPE;
  }
  function isMemo(object) {
    return typeOf(object) === REACT_MEMO_TYPE;
  }
  function isPortal(object) {
    return typeOf(object) === REACT_PORTAL_TYPE;
  }
  function isProfiler(object) {
    return typeOf(object) === REACT_PROFILER_TYPE;
  }
  function isStrictMode(object) {
    return typeOf(object) === REACT_STRICT_MODE_TYPE;
  }
  function isSuspense(object) {
    return typeOf(object) === REACT_SUSPENSE_TYPE;
  }
  
  exports.AsyncMode = AsyncMode;
  exports.ConcurrentMode = ConcurrentMode;
  exports.ContextConsumer = ContextConsumer;
  exports.ContextProvider = ContextProvider;
  exports.Element = Element;
  exports.ForwardRef = ForwardRef;
  exports.Fragment = Fragment;
  exports.Lazy = Lazy;
  exports.Memo = Memo;
  exports.Portal = Portal;
  exports.Profiler = Profiler;
  exports.StrictMode = StrictMode;
  exports.Suspense = Suspense;
  exports.isAsyncMode = isAsyncMode;
  exports.isConcurrentMode = isConcurrentMode;
  exports.isContextConsumer = isContextConsumer;
  exports.isContextProvider = isContextProvider;
  exports.isElement = isElement;
  exports.isForwardRef = isForwardRef;
  exports.isFragment = isFragment;
  exports.isLazy = isLazy;
  exports.isMemo = isMemo;
  exports.isPortal = isPortal;
  exports.isProfiler = isProfiler;
  exports.isStrictMode = isStrictMode;
  exports.isSuspense = isSuspense;
  exports.isValidElementType = isValidElementType;
  exports.typeOf = typeOf;
    })();
  }
  
  }).call(this)}).call(this,require('_process'))
  },{"_process":14}],22:[function(require,module,exports){
  /** @license React v16.13.1
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  
  'use strict';var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
  Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
  function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;
  exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isAsyncMode=function(a){return A(a)||z(a)===l};exports.isConcurrentMode=A;exports.isContextConsumer=function(a){return z(a)===k};exports.isContextProvider=function(a){return z(a)===h};exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return z(a)===n};exports.isFragment=function(a){return z(a)===e};exports.isLazy=function(a){return z(a)===t};
  exports.isMemo=function(a){return z(a)===r};exports.isPortal=function(a){return z(a)===d};exports.isProfiler=function(a){return z(a)===g};exports.isStrictMode=function(a){return z(a)===f};exports.isSuspense=function(a){return z(a)===p};
  exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};exports.typeOf=z;
  
  },{}],23:[function(require,module,exports){
  (function (process){(function (){
  'use strict';
  
  if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/react-is.production.min.js');
  } else {
    module.exports = require('./cjs/react-is.development.js');
  }
  
  }).call(this)}).call(this,require('_process'))
  },{"./cjs/react-is.development.js":21,"./cjs/react-is.production.min.js":22,"_process":14}],24:[function(require,module,exports){
  !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,window.React,require("prop-types"),require("d3-geo"),require("topojson-client"),require("d3-zoom"),require("d3-selection")):"function"==typeof define&&define.amd?define(["exports","react","prop-types","d3-geo","topojson-client","d3-zoom","d3-selection"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).reactSimpleMaps=e.reactSimpleMaps||{},e.React,e.PropTypes,e.d3,e.topojson,e.d3,e.d3)}(this,(function(e,t,r,o,n,a,u){"use strict";function s(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function l(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(r){if("default"!==r){var o=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,o.get?o:{enumerable:!0,get:function(){return e[r]}})}})),t.default=e,Object.freeze(t)}var i=s(t),c=s(r),f=l(o);function d(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?d(Object(r),!0).forEach((function(t){y(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function m(e){return m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},m(e)}function y(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function g(){return g=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},g.apply(this,arguments)}function v(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},a=Object.keys(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}function h(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var o,n,a=[],u=!0,s=!1;try{for(r=r.call(e);!(u=(o=r.next()).done)&&(a.push(o.value),!t||a.length!==t);u=!0);}catch(e){s=!0,n=e}finally{try{u||null==r.return||r.return()}finally{if(s)throw n}}return a}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return b(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return b(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,o=new Array(t);r<t;r++)o[r]=e[r];return o}var j=["width","height","projection","projectionConfig"],M=f.geoPath,E=v(f,["geoPath"]),x=t.createContext(),k=function(e){var r=e.width,o=e.height,n=e.projection,a=e.projectionConfig,u=v(e,j),s=h(a.center||[],2),l=s[0],c=s[1],f=h(a.rotate||[],3),d=f[0],p=f[1],m=f[2],y=h(a.parallels||[],2),b=y[0],k=y[1],w=a.scale||null,O=t.useMemo((function(){return function(e){var t=e.projectionConfig,r=void 0===t?{}:t,o=e.projection,n=void 0===o?"geoEqualEarth":o,a=e.width,u=void 0===a?800:a,s=e.height,l=void 0===s?600:s;if("function"==typeof n)return n;var i=E[n]().translate([u/2,l/2]);return[i.center?"center":null,i.rotate?"rotate":null,i.scale?"scale":null,i.parallels?"parallels":null].forEach((function(e){e&&(i=i[e](r[e]||i[e]()))})),i}({projectionConfig:{center:l||0===l||c||0===c?[l,c]:null,rotate:d||0===d||p||0===p?[d,p,m]:null,parallels:b||0===b||k||0===k?[b,k]:null,scale:w},projection:n,width:r,height:o})}),[r,o,n,l,c,d,p,m,b,k,w]),N=t.useCallback(O,[O]),S=t.useMemo((function(){return{width:r,height:o,projection:N,path:M().projection(N)}}),[r,o,N]);return i.default.createElement(x.Provider,g({value:S},u))};k.propTypes={width:c.default.number,height:c.default.number,projection:c.default.oneOfType([c.default.string,c.default.func]),projectionConfig:c.default.object};var w=["width","height","projection","projectionConfig","className"],O=t.forwardRef((function(e,t){var r=e.width,o=void 0===r?800:r,n=e.height,a=void 0===n?600:n,u=e.projection,s=void 0===u?"geoEqualEarth":u,l=e.projectionConfig,c=void 0===l?{}:l,f=e.className,d=void 0===f?"":f,p=v(e,w);return i.default.createElement(k,{width:o,height:a,projection:s,projectionConfig:c},i.default.createElement("svg",g({ref:t,viewBox:"0 0 ".concat(o," ").concat(a),className:"rsm-svg ".concat(d)},p)))}));function N(e,t,r){var o=(e*r.k-e)/2,n=(t*r.k-t)/2;return[e/2-(o+r.x)/r.k,t/2-(n+r.y)/r.k]}function S(e,t){if(!("Topology"===e.type))return t?t(e.features||e):e.features||e;var r=n.feature(e,e.objects[Object.keys(e.objects)[0]]).features;return t?t(r):r}function P(e){return"Topology"===e.type?{outline:n.mesh(e,e.objects[Object.keys(e.objects)[0]],(function(e,t){return e===t})),borders:n.mesh(e,e.objects[Object.keys(e.objects)[0]],(function(e,t){return e!==t}))}:null}function C(e,t){return e?e.map((function(e,r){return p(p({},e),{},{rsmKey:"geo-".concat(r),svgPath:t(e)})})):[]}function T(e){var r=e.geography,o=e.parseGeographies,n=t.useContext(x).path,a=h(t.useState({}),2),u=a[0],s=a[1];t.useEffect((function(){var e;"undefined"!==("undefined"==typeof window?"undefined":m(window))&&(r&&("string"==typeof r?(e=r,fetch(e).then((function(e){if(!e.ok)throw Error(e.statusText);return e.json()})).catch((function(e){console.log("There was a problem when fetching the data: ",e)}))).then((function(e){e&&s({geographies:S(e,o),mesh:P(e)})})):s({geographies:S(r,o),mesh:P(r)})))}),[r,o]);var l=t.useMemo((function(){var e=u.mesh||{},t=function(e,t,r){return e&&t?{outline:p(p({},e),{},{rsmKey:"outline",svgPath:r(e)}),borders:p(p({},t),{},{rsmKey:"borders",svgPath:r(t)})}:{}}(e.outline,e.borders,n);return{geographies:C(u.geographies,n),outline:t.outline,borders:t.borders}}),[u,n]);return{geographies:l.geographies,outline:l.outline,borders:l.borders}}O.displayName="ComposableMap",O.propTypes={width:c.default.number,height:c.default.number,projection:c.default.oneOfType([c.default.string,c.default.func]),projectionConfig:c.default.object,className:c.default.string};var R=["geography","children","parseGeographies","className"],Z=t.forwardRef((function(e,r){var o=e.geography,n=e.children,a=e.parseGeographies,u=e.className,s=void 0===u?"":u,l=v(e,R),c=t.useContext(x),f=c.path,d=c.projection,p=T({geography:o,parseGeographies:a}),m=p.geographies,y=p.outline,h=p.borders;return i.default.createElement("g",g({ref:r,className:"rsm-geographies ".concat(s)},l),m&&m.length>0&&n({geographies:m,outline:y,borders:h,path:f,projection:d}))}));Z.displayName="Geographies",Z.propTypes={geography:c.default.oneOfType([c.default.string,c.default.object,c.default.array]),children:c.default.func,parseGeographies:c.default.func,className:c.default.string};var z=["geography","onMouseEnter","onMouseLeave","onMouseDown","onMouseUp","onFocus","onBlur","style","className"],G=t.forwardRef((function(e,r){var o=e.geography,n=e.onMouseEnter,a=e.onMouseLeave,u=e.onMouseDown,s=e.onMouseUp,l=e.onFocus,c=e.onBlur,f=e.style,d=void 0===f?{}:f,p=e.className,m=void 0===p?"":p,y=v(e,z),b=h(t.useState(!1),2),j=b[0],M=b[1],E=h(t.useState(!1),2),x=E[0],k=E[1];return i.default.createElement("path",g({ref:r,tabIndex:"0",className:"rsm-geography ".concat(m),d:o.svgPath,onMouseEnter:function(e){k(!0),n&&n(e)},onMouseLeave:function(e){k(!1),j&&M(!1),a&&a(e)},onFocus:function(e){k(!0),l&&l(e)},onBlur:function(e){k(!1),j&&M(!1),c&&c(e)},onMouseDown:function(e){M(!0),u&&u(e)},onMouseUp:function(e){M(!1),s&&s(e)},style:d[j||x?j?"pressed":"hover":"default"]},y))}));G.displayName="Geography",G.propTypes={geography:c.default.object,onMouseEnter:c.default.func,onMouseLeave:c.default.func,onMouseDown:c.default.func,onMouseUp:c.default.func,onFocus:c.default.func,onBlur:c.default.func,style:c.default.object,className:c.default.string};var D=t.memo(G),L=["fill","stroke","step","className"],A=t.forwardRef((function(e,r){var n=e.fill,a=void 0===n?"transparent":n,u=e.stroke,s=void 0===u?"currentcolor":u,l=e.step,c=void 0===l?[10,10]:l,f=e.className,d=void 0===f?"":f,p=v(e,L),m=t.useContext(x).path;return i.default.createElement("path",g({ref:r,d:m(o.geoGraticule().step(c)()),fill:a,stroke:s,className:"rsm-graticule ".concat(d)},p))}));A.displayName="Graticule",A.propTypes={fill:c.default.string,stroke:c.default.string,step:c.default.array,className:c.default.string};var B=t.memo(A),F=["value"],U=t.createContext(),q={x:0,y:0,k:1,transformString:"translate(0 0) scale(1)"},W=function(e){var t=e.value,r=void 0===t?q:t,o=v(e,F);return i.default.createElement(U.Provider,g({value:r},o))};W.propTypes={x:c.default.number,y:c.default.number,k:c.default.number,transformString:c.default.string};function I(e){var r=e.center,o=e.filterZoomEvent,n=e.onMoveStart,s=e.onMoveEnd,l=e.onMove,i=e.translateExtent,c=void 0===i?[[-1/0,-1/0],[1/0,1/0]]:i,f=e.scaleExtent,d=void 0===f?[1,8]:f,p=e.zoom,m=void 0===p?1:p,y=t.useContext(x),g=y.width,v=y.height,b=y.projection,j=h(r,2),M=j[0],E=j[1],k=h(t.useState({x:0,y:0,k:1}),2),w=k[0],O=k[1],S=t.useRef({x:0,y:0,k:1}),P=t.useRef(),C=t.useRef(),T=t.useRef(!1),R=h(c,2),Z=R[0],z=R[1],G=h(Z,2),D=G[0],L=G[1],A=h(z,2),B=A[0],F=A[1],U=h(d,2),q=U[0],W=U[1];return t.useEffect((function(){var e=u.select(P.current);var t=a.zoom().filter((function(e){return o?o(e):!!e&&(!e.ctrlKey&&!e.button)})).scaleExtent([q,W]).translateExtent([[D,L],[B,F]]).on("start",(function(e){n&&!T.current&&n({coordinates:b.invert(N(g,v,e.transform)),zoom:e.transform.k},e)})).on("zoom",(function(e){if(!T.current){var t=e.transform,r=e.sourceEvent;O({x:t.x,y:t.y,k:t.k,dragging:r}),l&&l({x:t.x,y:t.y,zoom:t.k,dragging:r},e)}})).on("end",(function(e){if(T.current)T.current=!1;else{var t=h(b.invert(N(g,v,e.transform)),2),r=t[0],o=t[1];S.current={x:r,y:o,k:e.transform.k},s&&s({coordinates:[r,o],zoom:e.transform.k},e)}}));C.current=t,e.call(t)}),[g,v,D,L,B,F,q,W,b,n,l,s,o]),t.useEffect((function(){if(M!==S.current.x||E!==S.current.y||m!==S.current.k){var e=b([M,E]),t=e[0]*m,r=e[1]*m,o=u.select(P.current);T.current=!0,o.call(C.current.transform,a.zoomIdentity.translate(g/2-t,v/2-r).scale(m)),O({x:g/2-t,y:v/2-r,k:m}),S.current={x:M,y:E,k:m}}}),[M,E,m,g,v,b]),{mapRef:P,position:w,transformString:"translate(".concat(w.x," ").concat(w.y,") scale(").concat(w.k,")")}}var K=["center","zoom","minZoom","maxZoom","translateExtent","filterZoomEvent","onMoveStart","onMove","onMoveEnd","className"],_=t.forwardRef((function(e,r){var o=e.center,n=void 0===o?[0,0]:o,a=e.zoom,u=void 0===a?1:a,s=e.minZoom,l=void 0===s?1:s,c=e.maxZoom,f=void 0===c?8:c,d=e.translateExtent,p=e.filterZoomEvent,m=e.onMoveStart,y=e.onMove,h=e.onMoveEnd,b=e.className,j=v(e,K),M=t.useContext(x),E=M.width,k=M.height,w=I({center:n,filterZoomEvent:p,onMoveStart:m,onMove:y,onMoveEnd:h,scaleExtent:[l,f],translateExtent:d,zoom:u}),O=w.mapRef,N=w.transformString,S=w.position;return i.default.createElement(W,{value:{x:S.x,y:S.y,k:S.k,transformString:N}},i.default.createElement("g",{ref:O},i.default.createElement("rect",{width:E,height:k,fill:"transparent"}),i.default.createElement("g",g({ref:r,transform:N,className:"rsm-zoomable-group ".concat(b)},j))))}));_.displayName="ZoomableGroup",_.propTypes={center:c.default.array,zoom:c.default.number,minZoom:c.default.number,maxZoom:c.default.number,translateExtent:c.default.arrayOf(c.default.array),onMoveStart:c.default.func,onMove:c.default.func,onMoveEnd:c.default.func,className:c.default.string};var Q=["id","fill","stroke","strokeWidth","className"],$=t.forwardRef((function(e,r){var o=e.id,n=void 0===o?"rsm-sphere":o,a=e.fill,u=void 0===a?"transparent":a,s=e.stroke,l=void 0===s?"currentcolor":s,c=e.strokeWidth,f=void 0===c?.5:c,d=e.className,p=void 0===d?"":d,m=v(e,Q),y=t.useContext(x).path,h=t.useMemo((function(){return y({type:"Sphere"})}),[y]);return i.default.createElement(t.Fragment,null,i.default.createElement("defs",null,i.default.createElement("clipPath",{id:n},i.default.createElement("path",{d:h}))),i.default.createElement("path",g({ref:r,d:h,fill:u,stroke:l,strokeWidth:f,style:{pointerEvents:"none"},className:"rsm-sphere ".concat(p)},m)))}));$.displayName="Sphere",$.propTypes={id:c.default.string,fill:c.default.string,stroke:c.default.string,strokeWidth:c.default.number,className:c.default.string};var H=t.memo($),J=["coordinates","children","onMouseEnter","onMouseLeave","onMouseDown","onMouseUp","onFocus","onBlur","style","className"],V=t.forwardRef((function(e,r){var o=e.coordinates,n=e.children,a=e.onMouseEnter,u=e.onMouseLeave,s=e.onMouseDown,l=e.onMouseUp,c=e.onFocus,f=e.onBlur,d=e.style,p=void 0===d?{}:d,m=e.className,y=void 0===m?"":m,b=v(e,J),j=t.useContext(x).projection,M=h(t.useState(!1),2),E=M[0],k=M[1],w=h(t.useState(!1),2),O=w[0],N=w[1],S=h(j(o),2),P=S[0],C=S[1];return i.default.createElement("g",g({ref:r,transform:"translate(".concat(P,", ").concat(C,")"),className:"rsm-marker ".concat(y),onMouseEnter:function(e){N(!0),a&&a(e)},onMouseLeave:function(e){N(!1),E&&k(!1),u&&u(e)},onFocus:function(e){N(!0),c&&c(e)},onBlur:function(e){N(!1),E&&k(!1),f&&f(e)},onMouseDown:function(e){k(!0),s&&s(e)},onMouseUp:function(e){k(!1),l&&l(e)},style:p[E||O?E?"pressed":"hover":"default"]},b),n)}));V.displayName="Marker",V.propTypes={coordinates:c.default.array,children:c.default.oneOfType([c.default.node,c.default.arrayOf(c.default.node)]),onMouseEnter:c.default.func,onMouseLeave:c.default.func,onMouseDown:c.default.func,onMouseUp:c.default.func,onFocus:c.default.func,onBlur:c.default.func,style:c.default.object,className:c.default.string};var X=["from","to","coordinates","stroke","strokeWidth","fill","className"],Y=t.forwardRef((function(e,r){var o=e.from,n=void 0===o?[0,0]:o,a=e.to,u=void 0===a?[0,0]:a,s=e.coordinates,l=e.stroke,c=void 0===l?"currentcolor":l,f=e.strokeWidth,d=void 0===f?3:f,p=e.fill,m=void 0===p?"transparent":p,y=e.className,h=void 0===y?"":y,b=v(e,X),j=t.useContext(x).path,M={type:"LineString",coordinates:s||[n,u]};return i.default.createElement("path",g({ref:r,d:j(M),className:"rsm-line ".concat(h),stroke:c,strokeWidth:d,fill:m},b))}));Y.displayName="Line",Y.propTypes={from:c.default.array,to:c.default.array,coordinates:c.default.array,stroke:c.default.string,strokeWidth:c.default.number,fill:c.default.string,className:c.default.string};var ee=["subject","children","connectorProps","dx","dy","curve","className"],te=t.forwardRef((function(e,r){var o=e.subject,n=e.children,a=e.connectorProps,u=e.dx,s=void 0===u?30:u,l=e.dy,c=void 0===l?30:l,f=e.curve,d=void 0===f?0:f,p=e.className,m=void 0===p?"":p,y=v(e,ee),b=h((0,t.useContext(x).projection)(o),2),j=b[0],M=b[1],E=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:30,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:30,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.5,o=Array.isArray(r)?r:[r,r],n=e/2*o[0],a=t/2*o[1];return"M".concat(0,",",0," Q",-e/2-n,",").concat(-t/2+a," ").concat(-e,",").concat(-t)}(s,c,d);return i.default.createElement("g",g({ref:r,transform:"translate(".concat(j+s,", ").concat(M+c,")"),className:"rsm-annotation ".concat(m)},y),i.default.createElement("path",g({d:E,fill:"transparent",stroke:"#000"},a)),n)}));te.displayName="Annotation",te.propTypes={subject:c.default.array,children:c.default.oneOfType([c.default.node,c.default.arrayOf(c.default.node)]),dx:c.default.number,dy:c.default.number,curve:c.default.number,connectorProps:c.default.object,className:c.default.string},e.Annotation=te,e.ComposableMap=O,e.Geographies=Z,e.Geography=D,e.Graticule=B,e.Line=Y,e.MapContext=x,e.MapProvider=k,e.Marker=V,e.Sphere=H,e.ZoomPanContext=U,e.ZoomPanProvider=W,e.ZoomableGroup=_,e.useGeographies=T,e.useMapContext=function(){return t.useContext(x)},e.useZoomPan=I,e.useZoomPanContext=function(){return t.useContext(U)},Object.defineProperty(e,"__esModule",{value:!0})}));
  
  },{"d3-geo":7,"d3-selection":9,"d3-zoom":12,"prop-types":18,"react":"react","topojson-client":25}],25:[function(require,module,exports){
  // https://github.com/topojson/topojson-client v3.1.0 Copyright 2019 Mike Bostock
  (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.topojson = global.topojson || {}));
  }(this, function (exports) { 'use strict';
  
  function identity(x) {
    return x;
  }
  
  function transform(transform) {
    if (transform == null) return identity;
    var x0,
        y0,
        kx = transform.scale[0],
        ky = transform.scale[1],
        dx = transform.translate[0],
        dy = transform.translate[1];
    return function(input, i) {
      if (!i) x0 = y0 = 0;
      var j = 2, n = input.length, output = new Array(n);
      output[0] = (x0 += input[0]) * kx + dx;
      output[1] = (y0 += input[1]) * ky + dy;
      while (j < n) output[j] = input[j], ++j;
      return output;
    };
  }
  
  function bbox(topology) {
    var t = transform(topology.transform), key,
        x0 = Infinity, y0 = x0, x1 = -x0, y1 = -x0;
  
    function bboxPoint(p) {
      p = t(p);
      if (p[0] < x0) x0 = p[0];
      if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1];
      if (p[1] > y1) y1 = p[1];
    }
  
    function bboxGeometry(o) {
      switch (o.type) {
        case "GeometryCollection": o.geometries.forEach(bboxGeometry); break;
        case "Point": bboxPoint(o.coordinates); break;
        case "MultiPoint": o.coordinates.forEach(bboxPoint); break;
      }
    }
  
    topology.arcs.forEach(function(arc) {
      var i = -1, n = arc.length, p;
      while (++i < n) {
        p = t(arc[i], i);
        if (p[0] < x0) x0 = p[0];
        if (p[0] > x1) x1 = p[0];
        if (p[1] < y0) y0 = p[1];
        if (p[1] > y1) y1 = p[1];
      }
    });
  
    for (key in topology.objects) {
      bboxGeometry(topology.objects[key]);
    }
  
    return [x0, y0, x1, y1];
  }
  
  function reverse(array, n) {
    var t, j = array.length, i = j - n;
    while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
  }
  
  function feature(topology, o) {
    if (typeof o === "string") o = topology.objects[o];
    return o.type === "GeometryCollection"
        ? {type: "FeatureCollection", features: o.geometries.map(function(o) { return feature$1(topology, o); })}
        : feature$1(topology, o);
  }
  
  function feature$1(topology, o) {
    var id = o.id,
        bbox = o.bbox,
        properties = o.properties == null ? {} : o.properties,
        geometry = object(topology, o);
    return id == null && bbox == null ? {type: "Feature", properties: properties, geometry: geometry}
        : bbox == null ? {type: "Feature", id: id, properties: properties, geometry: geometry}
        : {type: "Feature", id: id, bbox: bbox, properties: properties, geometry: geometry};
  }
  
  function object(topology, o) {
    var transformPoint = transform(topology.transform),
        arcs = topology.arcs;
  
    function arc(i, points) {
      if (points.length) points.pop();
      for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) {
        points.push(transformPoint(a[k], k));
      }
      if (i < 0) reverse(points, n);
    }
  
    function point(p) {
      return transformPoint(p);
    }
  
    function line(arcs) {
      var points = [];
      for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
      if (points.length < 2) points.push(points[0]); // This should never happen per the specification.
      return points;
    }
  
    function ring(arcs) {
      var points = line(arcs);
      while (points.length < 4) points.push(points[0]); // This may happen if an arc has only two points.
      return points;
    }
  
    function polygon(arcs) {
      return arcs.map(ring);
    }
  
    function geometry(o) {
      var type = o.type, coordinates;
      switch (type) {
        case "GeometryCollection": return {type: type, geometries: o.geometries.map(geometry)};
        case "Point": coordinates = point(o.coordinates); break;
        case "MultiPoint": coordinates = o.coordinates.map(point); break;
        case "LineString": coordinates = line(o.arcs); break;
        case "MultiLineString": coordinates = o.arcs.map(line); break;
        case "Polygon": coordinates = polygon(o.arcs); break;
        case "MultiPolygon": coordinates = o.arcs.map(polygon); break;
        default: return null;
      }
      return {type: type, coordinates: coordinates};
    }
  
    return geometry(o);
  }
  
  function stitch(topology, arcs) {
    var stitchedArcs = {},
        fragmentByStart = {},
        fragmentByEnd = {},
        fragments = [],
        emptyIndex = -1;
  
    // Stitch empty arcs first, since they may be subsumed by other arcs.
    arcs.forEach(function(i, j) {
      var arc = topology.arcs[i < 0 ? ~i : i], t;
      if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
        t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
      }
    });
  
    arcs.forEach(function(i) {
      var e = ends(i),
          start = e[0],
          end = e[1],
          f, g;
  
      if (f = fragmentByEnd[start]) {
        delete fragmentByEnd[f.end];
        f.push(i);
        f.end = end;
        if (g = fragmentByStart[end]) {
          delete fragmentByStart[g.start];
          var fg = g === f ? f : f.concat(g);
          fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
        } else {
          fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
        }
      } else if (f = fragmentByStart[end]) {
        delete fragmentByStart[f.start];
        f.unshift(i);
        f.start = start;
        if (g = fragmentByEnd[start]) {
          delete fragmentByEnd[g.end];
          var gf = g === f ? f : g.concat(f);
          fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
        } else {
          fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
        }
      } else {
        f = [i];
        fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
      }
    });
  
    function ends(i) {
      var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
      if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) { p1[0] += dp[0], p1[1] += dp[1]; });
      else p1 = arc[arc.length - 1];
      return i < 0 ? [p1, p0] : [p0, p1];
    }
  
    function flush(fragmentByEnd, fragmentByStart) {
      for (var k in fragmentByEnd) {
        var f = fragmentByEnd[k];
        delete fragmentByStart[f.start];
        delete f.start;
        delete f.end;
        f.forEach(function(i) { stitchedArcs[i < 0 ? ~i : i] = 1; });
        fragments.push(f);
      }
    }
  
    flush(fragmentByEnd, fragmentByStart);
    flush(fragmentByStart, fragmentByEnd);
    arcs.forEach(function(i) { if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]); });
  
    return fragments;
  }
  
  function mesh(topology) {
    return object(topology, meshArcs.apply(this, arguments));
  }
  
  function meshArcs(topology, object, filter) {
    var arcs, i, n;
    if (arguments.length > 1) arcs = extractArcs(topology, object, filter);
    else for (i = 0, arcs = new Array(n = topology.arcs.length); i < n; ++i) arcs[i] = i;
    return {type: "MultiLineString", arcs: stitch(topology, arcs)};
  }
  
  function extractArcs(topology, object, filter) {
    var arcs = [],
        geomsByArc = [],
        geom;
  
    function extract0(i) {
      var j = i < 0 ? ~i : i;
      (geomsByArc[j] || (geomsByArc[j] = [])).push({i: i, g: geom});
    }
  
    function extract1(arcs) {
      arcs.forEach(extract0);
    }
  
    function extract2(arcs) {
      arcs.forEach(extract1);
    }
  
    function extract3(arcs) {
      arcs.forEach(extract2);
    }
  
    function geometry(o) {
      switch (geom = o, o.type) {
        case "GeometryCollection": o.geometries.forEach(geometry); break;
        case "LineString": extract1(o.arcs); break;
        case "MultiLineString": case "Polygon": extract2(o.arcs); break;
        case "MultiPolygon": extract3(o.arcs); break;
      }
    }
  
    geometry(object);
  
    geomsByArc.forEach(filter == null
        ? function(geoms) { arcs.push(geoms[0].i); }
        : function(geoms) { if (filter(geoms[0].g, geoms[geoms.length - 1].g)) arcs.push(geoms[0].i); });
  
    return arcs;
  }
  
  function planarRingArea(ring) {
    var i = -1, n = ring.length, a, b = ring[n - 1], area = 0;
    while (++i < n) a = b, b = ring[i], area += a[0] * b[1] - a[1] * b[0];
    return Math.abs(area); // Note: doubled area!
  }
  
  function merge(topology) {
    return object(topology, mergeArcs.apply(this, arguments));
  }
  
  function mergeArcs(topology, objects) {
    var polygonsByArc = {},
        polygons = [],
        groups = [];
  
    objects.forEach(geometry);
  
    function geometry(o) {
      switch (o.type) {
        case "GeometryCollection": o.geometries.forEach(geometry); break;
        case "Polygon": extract(o.arcs); break;
        case "MultiPolygon": o.arcs.forEach(extract); break;
      }
    }
  
    function extract(polygon) {
      polygon.forEach(function(ring) {
        ring.forEach(function(arc) {
          (polygonsByArc[arc = arc < 0 ? ~arc : arc] || (polygonsByArc[arc] = [])).push(polygon);
        });
      });
      polygons.push(polygon);
    }
  
    function area(ring) {
      return planarRingArea(object(topology, {type: "Polygon", arcs: [ring]}).coordinates[0]);
    }
  
    polygons.forEach(function(polygon) {
      if (!polygon._) {
        var group = [],
            neighbors = [polygon];
        polygon._ = 1;
        groups.push(group);
        while (polygon = neighbors.pop()) {
          group.push(polygon);
          polygon.forEach(function(ring) {
            ring.forEach(function(arc) {
              polygonsByArc[arc < 0 ? ~arc : arc].forEach(function(polygon) {
                if (!polygon._) {
                  polygon._ = 1;
                  neighbors.push(polygon);
                }
              });
            });
          });
        }
      }
    });
  
    polygons.forEach(function(polygon) {
      delete polygon._;
    });
  
    return {
      type: "MultiPolygon",
      arcs: groups.map(function(polygons) {
        var arcs = [], n;
  
        // Extract the exterior (unique) arcs.
        polygons.forEach(function(polygon) {
          polygon.forEach(function(ring) {
            ring.forEach(function(arc) {
              if (polygonsByArc[arc < 0 ? ~arc : arc].length < 2) {
                arcs.push(arc);
              }
            });
          });
        });
  
        // Stitch the arcs into one or more rings.
        arcs = stitch(topology, arcs);
  
        // If more than one ring is returned,
        // at most one of these rings can be the exterior;
        // choose the one with the greatest absolute area.
        if ((n = arcs.length) > 1) {
          for (var i = 1, k = area(arcs[0]), ki, t; i < n; ++i) {
            if ((ki = area(arcs[i])) > k) {
              t = arcs[0], arcs[0] = arcs[i], arcs[i] = t, k = ki;
            }
          }
        }
  
        return arcs;
      }).filter(function(arcs) {
        return arcs.length > 0;
      })
    };
  }
  
  function bisect(a, x) {
    var lo = 0, hi = a.length;
    while (lo < hi) {
      var mid = lo + hi >>> 1;
      if (a[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  
  function neighbors(objects) {
    var indexesByArc = {}, // arc index -> array of object indexes
        neighbors = objects.map(function() { return []; });
  
    function line(arcs, i) {
      arcs.forEach(function(a) {
        if (a < 0) a = ~a;
        var o = indexesByArc[a];
        if (o) o.push(i);
        else indexesByArc[a] = [i];
      });
    }
  
    function polygon(arcs, i) {
      arcs.forEach(function(arc) { line(arc, i); });
    }
  
    function geometry(o, i) {
      if (o.type === "GeometryCollection") o.geometries.forEach(function(o) { geometry(o, i); });
      else if (o.type in geometryType) geometryType[o.type](o.arcs, i);
    }
  
    var geometryType = {
      LineString: line,
      MultiLineString: polygon,
      Polygon: polygon,
      MultiPolygon: function(arcs, i) { arcs.forEach(function(arc) { polygon(arc, i); }); }
    };
  
    objects.forEach(geometry);
  
    for (var i in indexesByArc) {
      for (var indexes = indexesByArc[i], m = indexes.length, j = 0; j < m; ++j) {
        for (var k = j + 1; k < m; ++k) {
          var ij = indexes[j], ik = indexes[k], n;
          if ((n = neighbors[ij])[i = bisect(n, ik)] !== ik) n.splice(i, 0, ik);
          if ((n = neighbors[ik])[i = bisect(n, ij)] !== ij) n.splice(i, 0, ij);
        }
      }
    }
  
    return neighbors;
  }
  
  function untransform(transform) {
    if (transform == null) return identity;
    var x0,
        y0,
        kx = transform.scale[0],
        ky = transform.scale[1],
        dx = transform.translate[0],
        dy = transform.translate[1];
    return function(input, i) {
      if (!i) x0 = y0 = 0;
      var j = 2,
          n = input.length,
          output = new Array(n),
          x1 = Math.round((input[0] - dx) / kx),
          y1 = Math.round((input[1] - dy) / ky);
      output[0] = x1 - x0, x0 = x1;
      output[1] = y1 - y0, y0 = y1;
      while (j < n) output[j] = input[j], ++j;
      return output;
    };
  }
  
  function quantize(topology, transform) {
    if (topology.transform) throw new Error("already quantized");
  
    if (!transform || !transform.scale) {
      if (!((n = Math.floor(transform)) >= 2)) throw new Error("n must be ≥2");
      box = topology.bbox || bbox(topology);
      var x0 = box[0], y0 = box[1], x1 = box[2], y1 = box[3], n;
      transform = {scale: [x1 - x0 ? (x1 - x0) / (n - 1) : 1, y1 - y0 ? (y1 - y0) / (n - 1) : 1], translate: [x0, y0]};
    } else {
      box = topology.bbox;
    }
  
    var t = untransform(transform), box, key, inputs = topology.objects, outputs = {};
  
    function quantizePoint(point) {
      return t(point);
    }
  
    function quantizeGeometry(input) {
      var output;
      switch (input.type) {
        case "GeometryCollection": output = {type: "GeometryCollection", geometries: input.geometries.map(quantizeGeometry)}; break;
        case "Point": output = {type: "Point", coordinates: quantizePoint(input.coordinates)}; break;
        case "MultiPoint": output = {type: "MultiPoint", coordinates: input.coordinates.map(quantizePoint)}; break;
        default: return input;
      }
      if (input.id != null) output.id = input.id;
      if (input.bbox != null) output.bbox = input.bbox;
      if (input.properties != null) output.properties = input.properties;
      return output;
    }
  
    function quantizeArc(input) {
      var i = 0, j = 1, n = input.length, p, output = new Array(n); // pessimistic
      output[0] = t(input[0], 0);
      while (++i < n) if ((p = t(input[i], i))[0] || p[1]) output[j++] = p; // non-coincident points
      if (j === 1) output[j++] = [0, 0]; // an arc must have at least two points
      output.length = j;
      return output;
    }
  
    for (key in inputs) outputs[key] = quantizeGeometry(inputs[key]);
  
    return {
      type: "Topology",
      bbox: box,
      transform: transform,
      objects: outputs,
      arcs: topology.arcs.map(quantizeArc)
    };
  }
  
  exports.bbox = bbox;
  exports.feature = feature;
  exports.merge = merge;
  exports.mergeArcs = mergeArcs;
  exports.mesh = mesh;
  exports.meshArcs = meshArcs;
  exports.neighbors = neighbors;
  exports.quantize = quantize;
  exports.transform = transform;
  exports.untransform = untransform;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  
  },{}]},{},[1]);
  


  window.WorldGeoJSON = {
    "type": "Topology",
    "objects": {
      "world": {
        "type": "GeometryCollection",
        "geometries": [
          {
            "type": "Polygon",
            "arcs": [[0, 1, 2, 3, 4, 5]],
            "id": "AFG",
            "properties": { "name": "Afghanistan" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[6, 7, 8, 9]], [[10, 11, 12]]],
            "id": "AGO",
            "properties": { "name": "Angola" }
          },
          {
            "type": "Polygon",
            "arcs": [[13, 14, 15, 16, 17]],
            "id": "ALB",
            "properties": { "name": "Albania" }
          },
          {
            "type": "Polygon",
            "arcs": [[18, 19, 20, 21, 22]],
            "id": "ARE",
            "properties": { "name": "United Arab Emirates" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[23, 24]], [[25, 26, 27, 28, 29, 30]]],
            "id": "ARG",
            "properties": { "name": "Argentina" }
          },
          {
            "type": "Polygon",
            "arcs": [[31, 32, 33, 34, 35]],
            "id": "ARM",
            "properties": { "name": "Armenia" }
          },
          {
            "type": "Polygon",
            "arcs": [[36]],
            "id": "FRA",
            "properties": { "name": "French Southern Territories" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[37]], [[38]]],
            "id": "AUS",
            "properties": { "name": "Australia" }
          },
          {
            "type": "Polygon",
            "arcs": [[39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]],
            "id": "AUT",
            "properties": { "name": "Austria" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[50, -35]], [[51, 52, -33, 53, 54]]],
            "id": "AZE",
            "properties": { "name": "Azerbaijan" }
          },
          {
            "type": "Polygon",
            "arcs": [[55, 56, 57, 58]],
            "id": "BDI",
            "properties": { "name": "Burundi" }
          },
          {
            "type": "Polygon",
            "arcs": [[59, 60, 61, 62, 63]],
            "id": "BEL",
            "properties": { "name": "Belgium" }
          },
          {
            "type": "Polygon",
            "arcs": [[64, 65, 66, 67, 68]],
            "id": "BEN",
            "properties": { "name": "Benin" }
          },
          {
            "type": "Polygon",
            "arcs": [[69, 70, 71, -67, 72, 73]],
            "id": "BFA",
            "properties": { "name": "Burkina Faso" }
          },
          {
            "type": "Polygon",
            "arcs": [[74, 75, 76]],
            "id": "BGD",
            "properties": { "name": "Bangladesh" }
          },
          {
            "type": "Polygon",
            "arcs": [[77, 78, 79, 80, 81, 82]],
            "id": "BGR",
            "properties": { "name": "Bulgaria" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[83]], [[84]], [[85]]],
            "id": "BHS",
            "properties": { "name": "Bahamas" }
          },
          {
            "type": "Polygon",
            "arcs": [[86, 87, 88, 89]],
            "id": "BIH",
            "properties": { "name": "Bosnia and Herzegovina" }
          },
          {
            "type": "Polygon",
            "arcs": [[90, 91, 92, 93, 94, 95, 96, 97]],
            "id": "BLR",
            "properties": { "name": "Belarus" }
          },
          {
            "type": "Polygon",
            "arcs": [[98, 99, 100]],
            "id": "BLZ",
            "properties": { "name": "Belize" }
          },
          {
            "type": "Polygon",
            "arcs": [[101, 102, 103, 104, -31]],
            "id": "BOL",
            "properties": { "name": "Bolivia" }
          },
          {
            "type": "Polygon",
            "arcs": [[-27, 105, -104, 106, 107, 108, 109, 110, 111, 112, 113]],
            "id": "BRA",
            "properties": { "name": "Brazil" }
          },
          {
            "type": "Polygon",
            "arcs": [[114, 115]],
            "id": "BRN",
            "properties": { "name": "Brunei" }
          },
          {
            "type": "Polygon",
            "arcs": [[116, 117]],
            "id": "BTN",
            "properties": { "name": "Bhutan" }
          },
          {
            "type": "Polygon",
            "arcs": [[118, 119, 120, 121]],
            "id": "BWA",
            "properties": { "name": "Botswana" }
          },
          {
            "type": "Polygon",
            "arcs": [[122, 123, 124, 125, 126, 127, 128]],
            "id": "CAF",
            "properties": { "name": "Central African Republic" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [
              [[129]],
              [[130]],
              [[131]],
              [[132]],
              [[133]],
              [[134]],
              [[135]],
              [[136]],
              [[137]],
              [[138]],
              [[139, 140, 141, 142, 143, 144]],
              [[145]],
              [[146]],
              [[147]],
              [[148]],
              [[149]],
              [[150]],
              [[151]],
              [[152]],
              [[153]],
              [[154]],
              [[155]],
              [[156]],
              [[157]],
              [[158]],
              [[159]],
              [[160]],
              [[161]],
              [[162]],
              [[163]]
            ],
            "id": "CAN",
            "properties": { "name": "Canada" }
          },
          {
            "type": "Polygon",
            "arcs": [[-47, 164, 165, 166, -43, 167, 168, 169]],
            "id": "CHE",
            "properties": { "name": "Switzerland" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[-24, 170]], [[-30, 171, 172, -102]]],
            "id": "CHL",
            "properties": { "name": "Chile" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [
              [[173]],
              [
                [
                  174,
                  175,
                  176,
                  177,
                  178,
                  179,
                  180,
                  181,
                  182,
                  183,
                  184,
                  185,
                  186,
                  187,
                  -118,
                  188,
                  189,
                  190,
                  191,
                  -4,
                  192,
                  193,
                  194,
                  195,
                  196,
                  197,
                  198,
                  199,
                  200,
                  201,
                  202
                ]
              ]
            ],
            "id": "CHN",
            "properties": { "name": "China" }
          },
          {
            "type": "Polygon",
            "arcs": [[203, 204, 205, 206, -70, 207]],
            "id": "CIV",
            "properties": { "name": "Cote d'Ivoire" }
          },
          {
            "type": "Polygon",
            "arcs": [[208, 209, 210, 211, 212, 213, 214, -129, 215]],
            "id": "CMR",
            "properties": { "name": "Cameroon" }
          },
          {
            "type": "Polygon",
            "arcs": [
              [
                216,
                217,
                218,
                219,
                -56,
                220,
                221,
                222,
                -10,
                223,
                -13,
                224,
                -127,
                225,
                226
              ]
            ],
            "id": "COD",
            "properties": { "name": "Democratic Republic of Congo" }
          },
          {
            "type": "Polygon",
            "arcs": [[-12, 227, 228, -216, -128, -225]],
            "id": "COG",
            "properties": { "name": "Congo" }
          },
          {
            "type": "Polygon",
            "arcs": [[229, 230, 231, 232, 233, -108, 234]],
            "id": "COL",
            "properties": { "name": "Colombia" }
          },
          {
            "type": "Polygon",
            "arcs": [[235, 236, 237, 238]],
            "id": "CRI",
            "properties": { "name": "Costa Rica" }
          },
          {
            "type": "Polygon",
            "arcs": [[239]],
            "id": "CUB",
            "properties": { "name": "Cuba" }
          },
          {
            "type": "Polygon",
            "arcs": [[240]],
            "id": "CYP",
            "properties": { "name": "Cyprus" }
          },
          {
            "type": "Polygon",
            "arcs": [[-49, 241, 242, 243]],
            "id": "CZE",
            "properties": { "name": "Czechia" }
          },
          {
            "type": "Polygon",
            "arcs": [[244, 245, -242, -48, -170, 246, 247, -61, 248, 249, 250]],
            "id": "DEU",
            "properties": { "name": "Germany" }
          },
          {
            "type": "Polygon",
            "arcs": [[251, 252, 253, 254]],
            "id": "DJI",
            "properties": { "name": "Djibouti" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[255]], [[-251, 256]]],
            "id": "DNK",
            "properties": { "name": "Denmark" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[257]]],
            "id": "DNK",
            "properties": { "name": "Greenland" }
          },
          {
            "type": "Polygon",
            "arcs": [[258, 259]],
            "id": "DOM",
            "properties": { "name": "Dominican Republic" }
          },
          {
            "type": "Polygon",
            "arcs": [[260, 261, 262, 263, 264, 265, 266, 267]],
            "id": "DZA",
            "properties": { "name": "Algeria" }
          },
          {
            "type": "Polygon",
            "arcs": [[268, -230, 269]],
            "id": "ECU",
            "properties": { "name": "Ecuador" }
          },
          {
            "type": "Polygon",
            "arcs": [[270, 271, 272]],
            "id": "EGY",
            "properties": { "name": "Egypt" }
          },
          {
            "type": "Polygon",
            "arcs": [[273, 274, 275, 276, 277, 278, 279, -255]],
            "id": "ERI",
            "properties": { "name": "Eritrea" }
          },
          {
            "type": "Polygon",
            "arcs": [[280, 281, 282, 283]],
            "id": "ESP",
            "properties": { "name": "Spain" }
          },
          {
            "type": "Polygon",
            "arcs": [[284, 285, 286, 287]],
            "id": "EST",
            "properties": { "name": "Estonia" }
          },
          {
            "type": "Polygon",
            "arcs": [
              [288, 289, -274, -254, 290, 291, 292, 293, 294, 295, 296, 297, -277]
            ],
            "id": "ETH",
            "properties": { "name": "Ethiopia" }
          },
          {
            "type": "Polygon",
            "arcs": [[298, 299, 300, 301]],
            "id": "FIN",
            "properties": { "name": "Finland" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[302]], [[303]], [[304]]],
            "id": "FJI",
            "properties": { "name": "Fiji" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[305]], [[306, -247, -169, 307, 308, -282, 309, -63]]],
            "id": "FRA",
            "properties": { "name": "France" }
          },
          {
            "type": "Polygon",
            "arcs": [[310, 311, 312, -112]],
            "id": "FRA",
            "properties": { "name": "French Guiana" }
          },
          {
            "type": "Polygon",
            "arcs": [[313, 314, -209, -229]],
            "id": "GAB",
            "properties": { "name": "Gabon" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[315, 316]], [[317]]],
            "id": "GBR",
            "properties": { "name": "United Kingdom" }
          },
          {
            "type": "Polygon",
            "arcs": [[318, 319, 320, 321, 322, -54, -32, 323]],
            "id": "GEO",
            "properties": { "name": "Georgia" }
          },
          {
            "type": "Polygon",
            "arcs": [[324, -208, -74, 325]],
            "id": "GHA",
            "properties": { "name": "Ghana" }
          },
          {
            "type": "Polygon",
            "arcs": [[326, 327, 328, 329, 330, 331, -206]],
            "id": "GIN",
            "properties": { "name": "Guinea" }
          },
          {
            "type": "Polygon",
            "arcs": [[332, 333]],
            "id": "GMB",
            "properties": { "name": "Gambia" }
          },
          {
            "type": "Polygon",
            "arcs": [[334, 335, -330]],
            "id": "GNB",
            "properties": { "name": "Guinea-Bissau" }
          },
          {
            "type": "Polygon",
            "arcs": [[336, -210, -315]],
            "id": "GNQ",
            "properties": { "name": "Equatorial Guinea" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[337]], [[338, -14, 339, -81, 340]]],
            "id": "GRC",
            "properties": { "name": "Greece" }
          },
          {
            "type": "Polygon",
            "arcs": [[341, 342, -101, 343, 344, 345]],
            "id": "GTM",
            "properties": { "name": "Guatemala" }
          },
          {
            "type": "Polygon",
            "arcs": [[346, 347, -110, 348]],
            "id": "GUY",
            "properties": { "name": "Guyana" }
          },
          {
            "type": "Polygon",
            "arcs": [[349, 350, -345, 351, 352]],
            "id": "HND",
            "properties": { "name": "Honduras" }
          },
          {
            "type": "Polygon",
            "arcs": [[353, 354, 355, -90, 356, 357, 358]],
            "id": "HRV",
            "properties": { "name": "Croatia" }
          },
          {
            "type": "Polygon",
            "arcs": [[-260, 359]],
            "id": "HTI",
            "properties": { "name": "Haiti" }
          },
          {
            "type": "Polygon",
            "arcs": [[-40, 360, 361, 362, 363, 364, -359, 365]],
            "id": "HUN",
            "properties": { "name": "Hungary" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [
              [[366]],
              [[367, 368]],
              [[369]],
              [[370]],
              [[371]],
              [[372]],
              [[373]],
              [[374]],
              [[375, 376]],
              [[377]],
              [[378]],
              [[379, 380]],
              [[381]]
            ],
            "id": "IDN",
            "properties": { "name": "Indonesia" }
          },
          {
            "type": "Polygon",
            "arcs": [[-191, 382, -189, -117, -188, 383, -77, 384, 385]],
            "id": "IND",
            "properties": { "name": "India" }
          },
          {
            "type": "Polygon",
            "arcs": [[386, -316]],
            "id": "IRL",
            "properties": { "name": "Ireland" }
          },
          {
            "type": "Polygon",
            "arcs": [[387, -6, 388, 389, 390, 391, 392, -51, -34, -53, 393]],
            "id": "IRN",
            "properties": { "name": "Iran" }
          },
          {
            "type": "Polygon",
            "arcs": [[-391, 394, 395, 396, 397, 398, 399, 400]],
            "id": "IRQ",
            "properties": { "name": "Iraq" }
          },
          {
            "type": "Polygon",
            "arcs": [[401]],
            "id": "ISL",
            "properties": { "name": "Iceland" }
          },
          {
            "type": "Polygon",
            "arcs": [[402, 403, 404, 405, 406, 407]],
            "id": "ISR",
            "properties": { "name": "Israel" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[408]], [[409]], [[410, 411, -308, -168, -42]]],
            "id": "ITA",
            "properties": { "name": "Italy" }
          },
          {
            "type": "Polygon",
            "arcs": [[412]],
            "id": "JAM",
            "properties": { "name": "Jamaica" }
          },
          {
            "type": "Polygon",
            "arcs": [[-403, 413, -398, 414, 415, -405, 416]],
            "id": "JOR",
            "properties": { "name": "Jordan" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[417]], [[418]], [[419]]],
            "id": "JPN",
            "properties": { "name": "Japan" }
          },
          {
            "type": "Polygon",
            "arcs": [
              [
                420,
                421,
                422,
                423,
                424,
                425,
                426,
                427,
                428,
                429,
                430,
                431,
                432,
                -195,
                433
              ]
            ],
            "id": "KAZ",
            "properties": { "name": "Kazakhstan" }
          },
          {
            "type": "Polygon",
            "arcs": [[434, 435, 436, 437, -295, 438]],
            "id": "KEN",
            "properties": { "name": "Kenya" }
          },
          {
            "type": "Polygon",
            "arcs": [[-434, -194, 439, 440]],
            "id": "KGZ",
            "properties": { "name": "Kyrgyzstan" }
          },
          {
            "type": "Polygon",
            "arcs": [[441, 442, 443, 444]],
            "id": "KHM",
            "properties": { "name": "Cambodia" }
          },
          {
            "type": "Polygon",
            "arcs": [[445, 446]],
            "id": "KOR",
            "properties": { "name": "South Korea" }
          },
          {
            "type": "Polygon",
            "arcs": [[447, 448, 449, 450, 451]],
            "id": "POL",
            "properties": { "name": "Kosovo" }
          },
          {
            "type": "Polygon",
            "arcs": [[452, 453, -396]],
            "id": "KWT",
            "properties": { "name": "Kuwait" }
          },
          {
            "type": "Polygon",
            "arcs": [[454, 455, -186, 456, -443]],
            "id": "LAO",
            "properties": { "name": "Laos" }
          },
          {
            "type": "Polygon",
            "arcs": [[-407, 457, 458]],
            "id": "LBN",
            "properties": { "name": "Lebanon" }
          },
          {
            "type": "Polygon",
            "arcs": [[459, 460, -327, -205]],
            "id": "LBR",
            "properties": { "name": "Liberia" }
          },
          {
            "type": "Polygon",
            "arcs": [[461, -268, 462, 463, -272, 464, 465]],
            "id": "LBY",
            "properties": { "name": "Libya" }
          },
          {
            "type": "Polygon",
            "arcs": [[466]],
            "id": "LKA",
            "properties": { "name": "Sri Lanka" }
          },
          {
            "type": "Polygon",
            "arcs": [[467]],
            "id": "LSO",
            "properties": { "name": "Lesotho" }
          },
          {
            "type": "Polygon",
            "arcs": [[468, 469, 470, -91, 471]],
            "id": "LTU",
            "properties": { "name": "Lithuania" }
          },
          {
            "type": "Polygon",
            "arcs": [[-248, -307, -62]],
            "id": "LUX",
            "properties": { "name": "Luxembourg" }
          },
          {
            "type": "Polygon",
            "arcs": [[472, -288, 473, -92, -471]],
            "id": "LVA",
            "properties": { "name": "Latvia" }
          },
          {
            "type": "Polygon",
            "arcs": [[-265, 474, 475]],
            "id": "MAR",
            "properties": { "name": "Morocco" }
          },
          {
            "type": "Polygon",
            "arcs": [[476, 477]],
            "id": "MDA",
            "properties": { "name": "Moldova" }
          },
          {
            "type": "Polygon",
            "arcs": [[478]],
            "id": "MDG",
            "properties": { "name": "Madagascar" }
          },
          {
            "type": "Polygon",
            "arcs": [[-99, -343, 479, 480, 481]],
            "id": "MEX",
            "properties": { "name": "Mexico" }
          },
          {
            "type": "Polygon",
            "arcs": [[-452, 482, -82, -340, 483]],
            "id": "MKD",
            "properties": { "name": "North Macedonia" }
          },
          {
            "type": "Polygon",
            "arcs": [[484, -262, 485, -71, -207, -332, 486]],
            "id": "MLI",
            "properties": { "name": "Mali" }
          },
          {
            "type": "Polygon",
            "arcs": [[487, -75, -384, -187, -456, 488]],
            "id": "MMR",
            "properties": { "name": "Myanmar" }
          },
          {
            "type": "Polygon",
            "arcs": [[489, -89, 490, -450, -16]],
            "id": "MNE",
            "properties": { "name": "Montenegro" }
          },
          {
            "type": "Polygon",
            "arcs": [[491, 492, 493, 494, 495, 496, 497, 498, -197]],
            "id": "MNG",
            "properties": { "name": "Mongolia" }
          },
          {
            "type": "Polygon",
            "arcs": [[499, 500, 501, 502, 503, 504, 505, 506, 507]],
            "id": "MOZ",
            "properties": { "name": "Mozambique" }
          },
          {
            "type": "Polygon",
            "arcs": [[508, 509, 510, -263, -485]],
            "id": "MRT",
            "properties": { "name": "Mauritania" }
          },
          {
            "type": "Polygon",
            "arcs": [[-508, 511, 512, 513]],
            "id": "MWI",
            "properties": { "name": "Malawi" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[514, 515, 516, 517]], [[-380, 518, -116, 519]]],
            "id": "MYS",
            "properties": { "name": "Malaysia" }
          },
          {
            "type": "Polygon",
            "arcs": [[520, -8, 521, -120, 522]],
            "id": "NAM",
            "properties": { "name": "Namibia" }
          },
          {
            "type": "Polygon",
            "arcs": [
              [-72, -486, -261, -462, 524, 525, 526, 527, 528, -213, 529, -68]
            ],
            "id": "NER",
            "properties": { "name": "Niger" }
          },
          {
            "type": "Polygon",
            "arcs": [[530, -69, -530, -212]],
            "id": "NGA",
            "properties": { "name": "Nigeria" }
          },
          {
            "type": "Polygon",
            "arcs": [[531, -353, 532, -237]],
            "id": "NIC",
            "properties": { "name": "Nicaragua" }
          },
          {
            "type": "Polygon",
            "arcs": [[-249, -60, 533]],
            "id": "NLD",
            "properties": { "name": "Netherlands" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[-302, 534, 535]], [[536]], [[537]], [[538]]],
            "id": "NOR",
            "properties": { "name": "Norway" }
          },
          {
            "type": "Polygon",
            "arcs": [[-383, -190]],
            "id": "NPL",
            "properties": { "name": "Nepal" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[539]], [[540]]],
            "id": "NZL",
            "properties": { "name": "New Zealand" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[541, 542, -22, 543]], [[-20, 544]]],
            "id": "OMN",
            "properties": { "name": "Oman" }
          },
          {
            "type": "Polygon",
            "arcs": [[-192, -386, 545, -389, -5]],
            "id": "PAK",
            "properties": { "name": "Pakistan" }
          },
          {
            "type": "Polygon",
            "arcs": [[546, -239, 547, -232]],
            "id": "PAN",
            "properties": { "name": "Panama" }
          },
          {
            "type": "Polygon",
            "arcs": [[-173, 548, -270, -235, -107, -103]],
            "id": "PER",
            "properties": { "name": "Peru" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [
              [[549]],
              [[550]],
              [[551]],
              [[552]],
              [[553]],
              [[554]],
              [[555]]
            ],
            "id": "PHL",
            "properties": { "name": "Philippines" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[556]], [[557]], [[-376, 558]], [[559]]],
            "id": "PNG",
            "properties": { "name": "Papua New Guinea" }
          },
          {
            "type": "Polygon",
            "arcs": [[-246, 560, 561, -472, -98, 562, 563, -243]],
            "id": "POL",
            "properties": { "name": "Poland" }
          },
          {
            "type": "Polygon",
            "arcs": [[564]],
            "id": "USA",
            "properties": { "name": "Puerto Rico" }
          },
          {
            "type": "Polygon",
            "arcs": [[565, -447, 566, -183]],
            "id": "PRK",
            "properties": { "name": "North Korea" }
          },
          {
            "type": "Polygon",
            "arcs": [[-284, 567]],
            "id": "PRT",
            "properties": { "name": "Portugal" }
          },
          {
            "type": "Polygon",
            "arcs": [[-105, -106, -26]],
            "id": "PRY",
            "properties": { "name": "Paraguay" }
          },
          {
            "type": "Polygon",
            "arcs": [[568, 569]],
            "id": "QAT",
            "properties": { "name": "Qatar" }
          },
          {
            "type": "Polygon",
            "arcs": [[570, -478, 571, 572, -78, 573, -363]],
            "id": "ROU",
            "properties": { "name": "Romania" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [
              [[574]],
              [[-562, 575, -469]],
              [[576]],
              [[577]],
              [[578]],
              [[579]],
              [[580]],
              [[581]],
              [[582]],
              [
                [
                  -181,
                  583,
                  584,
                  585,
                  -177,
                  586,
                  -175,
                  587,
                  -202,
                  588,
                  -200,
                  589,
                  -198,
                  -499,
                  590,
                  591,
                  -496,
                  592,
                  -494,
                  593,
                  -492,
                  -196,
                  -433,
                  594,
                  -431,
                  595,
                  596,
                  -428,
                  597,
                  -426,
                  598,
                  599,
                  600,
                  -55,
                  601,
                  -322,
                  602,
                  -320,
                  603,
                  604,
                  605,
                  606,
                  607,
                  608,
                  609,
                  610,
                  611,
                  -95,
                  612,
                  -93,
                  -474,
                  -287,
                  613,
                  614,
                  -299,
                  615
                ]
              ],
              [[616]],
              [[617]],
              [[618]]
            ],
            "id": "RUS",
            "properties": { "name": "Russia" }
          },
          {
            "type": "Polygon",
            "arcs": [[619, 620, -57, -220, 621]],
            "id": "RWA",
            "properties": { "name": "Rwanda" }
          },
          {
            "type": "Polygon",
            "arcs": [[-475, -264, -511, 622]],
            "id": "MAR",
            "properties": { "name": "Western Sahara" }
          },
          {
            "type": "Polygon",
            "arcs": [[623, -415, -397, -454, 624, -570, 625, -23, -543, 626]],
            "id": "SAU",
            "properties": { "name": "Saudi Arabia" }
          },
          {
            "type": "Polygon",
            "arcs": [
              [627, 628, -124, 629, -465, -271, 630, -279, 631, -298, 632]
            ],
            "id": "SDN",
            "properties": { "name": "Sudan" }
          },
          {
            "type": "Polygon",
            "arcs": [[633, -296, -438, 634, 635, -226, -126, 636, -628]],
            "id": "SSD",
            "properties": { "name": "South Sudan" }
          },
          {
            "type": "Polygon",
            "arcs": [[637, -509, -487, -331, -336, 638, -334]],
            "id": "SEN",
            "properties": { "name": "Senegal" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[639]], [[640]], [[641]], [[642]], [[643]]],
            "id": "SLB",
            "properties": { "name": "Solomon Islands" }
          },
          {
            "type": "Polygon",
            "arcs": [[644, -328, -461]],
            "id": "SLE",
            "properties": { "name": "Sierra Leone" }
          },
          {
            "type": "Polygon",
            "arcs": [[645, -346, -351]],
            "id": "SLV",
            "properties": { "name": "El Salvador" }
          },
          {
            "type": "Polygon",
            "arcs": [[646, 647, -291, -253, 648, -439, -294]],
            "id": "SOM",
            "properties": { "name": "Somalia" }
          },
          {
            "type": "Polygon",
            "arcs": [[-83, -483, -451, -491, -88, 649, -355, 650, -364, -574]],
            "id": "SRB",
            "properties": { "name": "Serbia" }
          },
          {
            "type": "Polygon",
            "arcs": [[651, -312, 652, -111, -348]],
            "id": "SUR",
            "properties": { "name": "Suriname" }
          },
          {
            "type": "Polygon",
            "arcs": [[-564, 653, -361, -50, -244]],
            "id": "SVK",
            "properties": { "name": "Slovakia" }
          },
          {
            "type": "Polygon",
            "arcs": [[-41, -366, -358, 654, -411]],
            "id": "SVN",
            "properties": { "name": "Slovenia" }
          },
          {
            "type": "Polygon",
            "arcs": [[-535, -301, 655]],
            "id": "SWE",
            "properties": { "name": "Sweden" }
          },
          {
            "type": "Polygon",
            "arcs": [[656, -504]],
            "id": "SWZ",
            "properties": { "name": "Eswatini" }
          },
          {
            "type": "Polygon",
            "arcs": [[-414, -408, -459, 657, 658, -399]],
            "id": "SYR",
            "properties": { "name": "Syria" }
          },
          {
            "type": "Polygon",
            "arcs": [[-529, 659, -527, 660, -525, -466, -630, -123, -215, 661]],
            "id": "TCD",
            "properties": { "name": "Chad" }
          },
          {
            "type": "Polygon",
            "arcs": [[662, -326, -73, -66]],
            "id": "TGO",
            "properties": { "name": "Togo" }
          },
          {
            "type": "Polygon",
            "arcs": [[663, -518, 664, -489, -455, -442]],
            "id": "THA",
            "properties": { "name": "Thailand" }
          },
          {
            "type": "Polygon",
            "arcs": [[-440, -193, -3, 665]],
            "id": "TJK",
            "properties": { "name": "Tajikistan" }
          },
          {
            "type": "Polygon",
            "arcs": [[-388, 666, -422, 667, -1]],
            "id": "TKM",
            "properties": { "name": "Turkmenistan" }
          },
          {
            "type": "Polygon",
            "arcs": [[668, -368]],
            "id": "TLS",
            "properties": { "name": "Timor" }
          },
          {
            "type": "Polygon",
            "arcs": [[669]],
            "id": "TTO",
            "properties": { "name": "Trinidad and Tobago" }
          },
          {
            "type": "Polygon",
            "arcs": [[-267, 670, -463]],
            "id": "TUN",
            "properties": { "name": "Tunisia" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [
              [[-324, -36, -393, 671, -400, -659, 672]],
              [[-341, -80, 673]]
            ],
            "id": "TUR",
            "properties": { "name": "Turkey" }
          },
          {
            "type": "Polygon",
            "arcs": [[674]],
            "id": "CHN",
            "properties": { "name": "Taiwan" }
          },
          {
            "type": "Polygon",
            "arcs": [
              [
                -436,
                675,
                676,
                -500,
                677,
                678,
                679,
                680,
                -221,
                -59,
                681,
                -620,
                682
              ]
            ],
            "id": "TZA",
            "properties": { "name": "Tanzania" }
          },
          {
            "type": "Polygon",
            "arcs": [[-622, -219, 683, -217, 684, -635, -437, -683]],
            "id": "UGA",
            "properties": { "name": "Uganda" }
          },
          {
            "type": "Polygon",
            "arcs": [
              [
                685,
                -611,
                686,
                -609,
                687,
                688,
                689,
                -605,
                690,
                -572,
                -477,
                -571,
                -362,
                -654,
                -563,
                -97
              ]
            ],
            "id": "UKR",
            "properties": { "name": "Ukraine" }
          },
          {
            "type": "Polygon",
            "arcs": [[-114, 691, -28]],
            "id": "URY",
            "properties": { "name": "Uruguay" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [
              [[692]],
              [[693]],
              [[694]],
              [[695]],
              [[696]],
              [[697, -481, 698, -140]],
              [[699]],
              [[700]],
              [[701]],
              [[-144, 702, -142, 703]]
            ],
            "id": "USA",
            "properties": { "name": "United States" }
          },
          {
            "type": "Polygon",
            "arcs": [[-668, -421, -441, -666, -2]],
            "id": "UZB",
            "properties": { "name": "Uzbekistan" }
          },
          {
            "type": "Polygon",
            "arcs": [[704, -349, -109, -234]],
            "id": "VEN",
            "properties": { "name": "Venezuela" }
          },
          {
            "type": "Polygon",
            "arcs": [[705, -444, -457, -185]],
            "id": "VNM",
            "properties": { "name": "Vietnam" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[706]], [[707]]],
            "id": "VUT",
            "properties": { "name": "Vanuatu" }
          },
          {
            "type": "Polygon",
            "arcs": [[-417, -404]],
            "id": "ISR",
            "properties": { "name": "West Bank" }
          },
          {
            "type": "Polygon",
            "arcs": [[708, -627, -542]],
            "id": "YEM",
            "properties": { "name": "Yemen" }
          },
          {
            "type": "Polygon",
            "arcs": [[-523, -119, 709, -505, -657, -503, 710], [-468]],
            "id": "ZAF",
            "properties": { "name": "South Africa" }
          },
          {
            "type": "Polygon",
            "arcs": [[-512, -507, 711, -121, -522, -7, -223, 712, -680]],
            "id": "ZMB",
            "properties": { "name": "Zambia" }
          },
          {
            "type": "Polygon",
            "arcs": [[-710, -122, -712, -506]],
            "id": "ZWE",
            "properties": { "name": "Zimbabwe" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [
              [[713]],
              [[714]],
              [[715]],
              [[716]],
              [[717]],
              [[718]],
              [[719]],
              [[720]]
            ],
            "id": "CPV",
            "properties": { "name": "Cape Verde" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[721]], [[722]], [[723]]],
            "id": "COM",
            "properties": { "name": "Comoros" }
          },
          {
            "type": "Polygon",
            "arcs": [[724]],
            "id": "MUS",
            "properties": { "name": "Mauritius" }
          },
          {
            "type": "Polygon",
            "arcs": [[725]],
            "id": "SYC",
            "properties": { "name": "Seychelles" }
          },
          {
            "type": "Polygon",
            "arcs": [[726]],
            "id": "BHR",
            "properties": { "name": "Bahrain" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[727]], [[728]]],
            "id": "MDV",
            "properties": { "name": "Maldives" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[729]], [[730]]],
            "id": "MHL",
            "properties": { "name": "Marshall Islands" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[731]], [[732]], [[733]], [[734]], [[735]]],
            "id": "FSM",
            "properties": { "name": "Micronesia (country)" }
          },
          {
            "type": "Polygon",
            "arcs": [[736]],
            "id": "NRU",
            "properties": { "name": "Nauru" }
          },
          {
            "type": "Polygon",
            "arcs": [[737]],
            "id": "PLW",
            "properties": { "name": "Palau" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[738]], [[739]]],
            "id": "WSM",
            "properties": { "name": "Samoa" }
          },
          {
            "type": "Polygon",
            "arcs": [[515, 740]],
            "id": "SGP",
            "properties": { "name": "Singapore" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[741]], [[742]], [[743]]],
            "id": "TON",
            "properties": { "name": "Tonga" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [
              [[744]],
              [[745]],
              [[746]],
              [[747]],
              [[748]],
              [[749]],
              [[750]]
            ],
            "id": "TUV",
            "properties": { "name": "Tuvalu" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[751]], [[752]]],
            "id": "ATG",
            "properties": { "name": "Antigua and Barbuda" }
          },
          {
            "type": "Polygon",
            "arcs": [[753]],
            "id": "BRB",
            "properties": { "name": "Barbados" }
          },
          {
            "type": "Polygon",
            "arcs": [[754]],
            "id": "DMA",
            "properties": { "name": "Dominica" }
          },
          {
            "type": "Polygon",
            "arcs": [[755]],
            "id": "GRD",
            "properties": { "name": "Grenada" }
          },
          {
            "type": "MultiPolygon",
            "arcs": [[[756]], [[757]]],
            "id": "KNA",
            "properties": { "name": "Saint Kitts and Nevis" }
          },
          {
            "type": "Polygon",
            "arcs": [[758]],
            "id": "LCA",
            "properties": { "name": "Saint Lucia" }
          },
          {
            "type": "Polygon",
            "arcs": [[759]],
            "id": "VCT",
            "properties": { "name": "Saint Vincent and the Grenadines" }
          },
          {
            "type": "Polygon",
            "arcs": [[760]],
            "id": "AND",
            "properties": { "name": "Andorra" }
          },
          {
            "type": "Polygon",
            "arcs": [[-45, 761, -166, 762]],
            "id": "LIE",
            "properties": { "name": "Liechtenstein" }
          },
          {
            "type": "Polygon",
            "arcs": [[763]],
            "id": "MLT",
            "properties": { "name": "Malta" }
          },
          {
            "type": "Polygon",
            "arcs": [[764]],
            "id": "MCO",
            "properties": { "name": "Monaco" }
          },
          {
            "type": "Polygon",
            "arcs": [[765]],
            "id": "SMR",
            "properties": { "name": "San Marino" }
          },
          {
            "type": "Polygon",
            "arcs": [[766]],
            "id": "KIR",
            "properties": { "name": "Kiribati" }
          },
          {
            "type": "Polygon",
            "arcs": [[767]],
            "id": "STP",
            "properties": { "name": "Sao Tome and Principe" }
          }
        ]
      }
    },
    "arcs": [
      [
        [61.21, 35.65],
        [62.23, 35.27],
        [62.98, 35.4],
        [63.19, 35.86],
        [63.98, 36.01],
        [64.55, 36.31],
        [64.75, 37.11],
        [65.59, 37.31],
        [65.75, 37.66],
        [66.22, 37.39],
        [66.52, 37.36]
      ],
      [
        [66.52, 37.36],
        [67.08, 37.36],
        [67.83, 37.14]
      ],
      [
        [67.83, 37.14],
        [68.14, 37.02],
        [68.86, 37.34],
        [69.2, 37.15],
        [69.52, 37.61],
        [70.12, 37.59],
        [70.27, 37.74],
        [70.38, 38.14],
        [70.81, 38.49],
        [71.35, 38.26],
        [71.24, 37.95],
        [71.54, 37.91],
        [71.45, 37.07],
        [71.84, 36.74],
        [72.19, 36.95],
        [72.64, 37.05],
        [73.26, 37.5],
        [73.95, 37.42],
        [74.98, 37.42]
      ],
      [
        [74.98, 37.42],
        [75.16, 37.13]
      ],
      [
        [75.16, 37.13],
        [74.58, 37.02],
        [74.07, 36.84],
        [72.92, 36.72],
        [71.85, 36.51],
        [71.26, 36.07],
        [71.5, 35.65],
        [71.61, 35.15],
        [71.12, 34.73],
        [71.16, 34.35],
        [70.88, 33.99],
        [69.93, 34.02],
        [70.32, 33.36],
        [69.69, 33.11],
        [69.26, 32.5],
        [69.32, 31.9],
        [68.93, 31.62],
        [68.56, 31.71],
        [67.79, 31.58],
        [67.68, 31.3],
        [66.94, 31.3],
        [66.38, 30.74],
        [66.35, 29.89],
        [65.05, 29.47],
        [64.35, 29.56],
        [64.15, 29.34],
        [63.55, 29.47],
        [62.55, 29.32],
        [60.87, 29.83]
      ],
      [
        [60.87, 29.83],
        [61.78, 30.74],
        [61.7, 31.38],
        [60.94, 31.55],
        [60.86, 32.18],
        [60.54, 32.98],
        [60.96, 33.53],
        [60.53, 33.68],
        [60.8, 34.4],
        [61.21, 35.65]
      ],
      [
        [23.91, -10.93],
        [24.02, -11.24],
        [23.9, -11.72],
        [24.08, -12.19],
        [23.93, -12.57],
        [24.02, -12.91],
        [21.93, -12.9],
        [21.89, -16.08],
        [22.56, -16.9],
        [23.22, -17.52]
      ],
      [
        [23.22, -17.52],
        [21.38, -17.93],
        [18.96, -17.79],
        [18.26, -17.31],
        [14.21, -17.35],
        [14.06, -17.42],
        [13.46, -16.97],
        [12.81, -16.94],
        [12.22, -17.11],
        [11.73, -17.3]
      ],
      [
        [11.73, -17.3],
        [11.64, -16.67],
        [11.78, -15.79],
        [12.12, -14.88],
        [12.18, -14.45],
        [12.5, -13.55],
        [12.74, -13.14],
        [13.31, -12.48],
        [13.63, -12.04],
        [13.74, -11.3],
        [13.69, -10.73],
        [13.39, -10.37],
        [13.12, -9.77],
        [12.88, -9.17],
        [12.93, -8.96],
        [13.24, -8.56],
        [12.93, -7.6],
        [12.73, -6.93],
        [12.23, -6.29],
        [12.32, -6.1]
      ],
      [
        [12.32, -6.1],
        [12.74, -5.97],
        [13.02, -5.98],
        [13.38, -5.86],
        [16.33, -5.88],
        [16.57, -6.62],
        [16.86, -7.22],
        [17.09, -7.55],
        [17.47, -8.07],
        [18.13, -7.99],
        [18.46, -7.85],
        [19.02, -7.99],
        [19.17, -7.74],
        [19.42, -7.16],
        [20.04, -7.12],
        [20.09, -6.94],
        [20.6, -6.94],
        [20.51, -7.3],
        [21.73, -7.29],
        [21.75, -7.92],
        [21.95, -8.31],
        [21.8, -8.91],
        [21.88, -9.52],
        [22.21, -9.89],
        [22.16, -11.08],
        [22.4, -10.99],
        [22.84, -11.02],
        [23.46, -10.87],
        [23.91, -10.93]
      ],
      [
        [12.18, -5.79],
        [11.91, -5.04]
      ],
      [
        [11.91, -5.04],
        [12.32, -4.61],
        [12.62, -4.44],
        [13, -4.78]
      ],
      [
        [13, -4.78],
        [12.63, -4.99],
        [12.47, -5.25],
        [12.44, -5.68],
        [12.18, -5.79]
      ],
      [
        [21.02, 40.84],
        [21, 40.58],
        [20.67, 40.44],
        [20.62, 40.11],
        [20.15, 39.62]
      ],
      [
        [20.15, 39.62],
        [19.98, 39.69],
        [19.96, 39.92],
        [19.41, 40.25],
        [19.32, 40.73],
        [19.4, 41.41],
        [19.54, 41.72],
        [19.37, 41.88],
        [19.3, 42.2],
        [19.74, 42.69]
      ],
      [
        [19.74, 42.69],
        [19.8, 42.5],
        [20.07, 42.59]
      ],
      [
        [20.07, 42.59],
        [20.28, 42.32],
        [20.52, 42.22]
      ],
      [
        [20.52, 42.22],
        [20.59, 41.86],
        [20.46, 41.52],
        [20.61, 41.09],
        [21.02, 40.84]
      ],
      [
        [51.58, 24.25],
        [51.76, 24.29],
        [51.79, 24.02],
        [52.58, 24.18],
        [53.4, 24.15],
        [54.01, 24.12],
        [54.69, 24.8],
        [55.44, 25.44],
        [56.07, 26.06]
      ],
      [
        [56.07, 26.06],
        [56.26, 25.71]
      ],
      [
        [56.26, 25.71],
        [56.4, 24.92]
      ],
      [
        [56.4, 24.92],
        [55.89, 24.92],
        [55.8, 24.27],
        [55.98, 24.13],
        [55.53, 23.93],
        [55.53, 23.52],
        [55.23, 23.11],
        [55.21, 22.71]
      ],
      [
        [55.21, 22.71],
        [55.01, 22.5],
        [52, 23],
        [51.62, 24.01],
        [51.58, 24.25]
      ],
      [
        [-66.96, -54.9],
        [-67.56, -54.87],
        [-68.63, -54.87],
        [-68.63, -52.64]
      ],
      [
        [-68.63, -52.64],
        [-68.25, -53.1],
        [-67.75, -53.85],
        [-66.45, -54.45],
        [-65.05, -54.7],
        [-65.5, -55.2],
        [-66.45, -55.25],
        [-66.96, -54.9]
      ],
      [
        [-62.69, -22.25],
        [-60.85, -23.88],
        [-60.03, -24.03],
        [-58.81, -24.77],
        [-57.78, -25.16],
        [-57.63, -25.6],
        [-58.62, -27.12],
        [-57.61, -27.4],
        [-56.49, -27.55],
        [-55.7, -27.39],
        [-54.79, -26.62],
        [-54.63, -25.74]
      ],
      [
        [-54.63, -25.74],
        [-54.13, -25.55],
        [-53.63, -26.12],
        [-53.65, -26.92],
        [-54.49, -27.47],
        [-55.16, -27.88],
        [-56.29, -28.85],
        [-57.63, -30.22]
      ],
      [
        [-57.63, -30.22],
        [-57.87, -31.02],
        [-58.14, -32.04],
        [-58.13, -33.04],
        [-58.35, -33.26],
        [-58.43, -33.91]
      ],
      [
        [-58.43, -33.91],
        [-58.5, -34.43],
        [-57.23, -35.29],
        [-57.36, -35.98],
        [-56.74, -36.41],
        [-56.79, -36.9],
        [-57.75, -38.18],
        [-59.23, -38.72],
        [-61.24, -38.93],
        [-62.34, -38.83],
        [-62.13, -39.42],
        [-62.33, -40.17],
        [-62.15, -40.68],
        [-62.75, -41.03],
        [-63.77, -41.17],
        [-64.73, -40.8],
        [-65.12, -41.06],
        [-64.98, -42.06],
        [-64.3, -42.36],
        [-63.76, -42.04],
        [-63.46, -42.56],
        [-64.38, -42.87],
        [-65.18, -43.5],
        [-65.33, -44.5],
        [-65.57, -45.04],
        [-66.51, -45.04],
        [-67.29, -45.55],
        [-67.58, -46.3],
        [-66.6, -47.03],
        [-65.64, -47.24],
        [-65.99, -48.13],
        [-67.17, -48.7],
        [-67.82, -49.87],
        [-68.73, -50.26],
        [-69.14, -50.73],
        [-68.82, -51.77],
        [-68.15, -52.35],
        [-68.57, -52.3]
      ],
      [
        [-68.57, -52.3],
        [-69.5, -52.14],
        [-71.91, -52.01],
        [-72.33, -51.43],
        [-72.31, -50.68],
        [-72.98, -50.74],
        [-73.33, -50.38],
        [-73.42, -49.32],
        [-72.65, -48.88],
        [-72.33, -48.24],
        [-72.45, -47.74],
        [-71.92, -46.88],
        [-71.55, -45.56],
        [-71.66, -44.97],
        [-71.22, -44.78],
        [-71.33, -44.41],
        [-71.79, -44.21],
        [-71.46, -43.79],
        [-71.92, -43.41],
        [-72.15, -42.25],
        [-71.75, -42.05],
        [-71.92, -40.83],
        [-71.68, -39.81],
        [-71.41, -38.92],
        [-70.81, -38.55],
        [-71.12, -37.58],
        [-71.12, -36.66],
        [-70.36, -36.01],
        [-70.39, -35.17],
        [-69.82, -34.19],
        [-69.81, -33.27],
        [-70.07, -33.09],
        [-70.54, -31.37],
        [-69.92, -30.34],
        [-70.01, -29.37],
        [-69.66, -28.46],
        [-69, -27.52],
        [-68.3, -26.9],
        [-68.59, -26.51],
        [-68.39, -26.19],
        [-68.42, -24.52],
        [-67.33, -24.03],
        [-66.99, -22.99],
        [-67.11, -22.74]
      ],
      [
        [-67.11, -22.74],
        [-66.27, -21.83],
        [-64.96, -22.08],
        [-64.38, -22.8],
        [-63.99, -21.99],
        [-62.85, -22.03],
        [-62.69, -22.25]
      ],
      [
        [43.58, 41.09],
        [44.97, 41.25]
      ],
      [
        [44.97, 41.25],
        [45.18, 40.99],
        [45.56, 40.81],
        [45.36, 40.56],
        [45.89, 40.22],
        [45.61, 39.9],
        [46.03, 39.63],
        [46.48, 39.46],
        [46.51, 38.77]
      ],
      [
        [46.51, 38.77],
        [46.14, 38.74]
      ],
      [
        [46.14, 38.74],
        [45.74, 39.32],
        [45.74, 39.47],
        [45.3, 39.47],
        [45, 39.74],
        [44.79, 39.71]
      ],
      [
        [44.79, 39.71],
        [44.4, 40.01],
        [43.66, 40.25],
        [43.75, 40.74],
        [43.58, 41.09]
      ],
      [
        [68.94, -48.62],
        [69.58, -48.94],
        [70.53, -49.06],
        [70.56, -49.25],
        [70.28, -49.71],
        [68.75, -49.77],
        [68.72, -49.24],
        [68.87, -48.83],
        [68.94, -48.62]
      ],
      [
        [145.4, -40.79],
        [146.36, -41.14],
        [146.91, -41],
        [147.69, -40.81],
        [148.29, -40.88],
        [148.36, -42.06],
        [148.02, -42.41],
        [147.91, -43.21],
        [147.56, -42.94],
        [146.87, -43.63],
        [146.66, -43.58],
        [146.05, -43.55],
        [145.43, -42.69],
        [145.3, -42.03],
        [144.72, -41.16],
        [144.74, -40.7],
        [145.4, -40.79]
      ],
      [
        [143.56, -13.76],
        [143.92, -14.55],
        [144.56, -14.17],
        [144.89, -14.59],
        [145.37, -14.98],
        [145.27, -15.43],
        [145.49, -16.29],
        [145.64, -16.78],
        [145.89, -16.91],
        [146.16, -17.76],
        [146.06, -18.28],
        [146.39, -18.96],
        [147.47, -19.48],
        [148.18, -19.96],
        [148.85, -20.39],
        [148.72, -20.63],
        [149.29, -21.26],
        [149.68, -22.34],
        [150.08, -22.12],
        [150.48, -22.56],
        [150.73, -22.4],
        [150.9, -23.46],
        [151.61, -24.08],
        [152.07, -24.46],
        [152.86, -25.27],
        [153.14, -26.07],
        [153.16, -26.64],
        [153.09, -27.26],
        [153.57, -28.11],
        [153.51, -29],
        [153.34, -29.46],
        [153.07, -30.35],
        [153.09, -30.92],
        [152.89, -31.64],
        [152.45, -32.55],
        [151.71, -33.04],
        [151.34, -33.82],
        [151.01, -34.31],
        [150.71, -35.17],
        [150.33, -35.67],
        [150.08, -36.42],
        [149.95, -37.11],
        [150, -37.43],
        [149.42, -37.77],
        [148.3, -37.81],
        [147.38, -38.22],
        [146.92, -38.61],
        [146.32, -39.04],
        [145.49, -38.59],
        [144.88, -38.42],
        [145.03, -37.9],
        [144.49, -38.09],
        [143.61, -38.81],
        [142.75, -38.54],
        [142.18, -38.38],
        [141.61, -38.31],
        [140.64, -38.02],
        [139.99, -37.4],
        [139.81, -36.64],
        [139.57, -36.14],
        [139.08, -35.73],
        [138.12, -35.61],
        [138.45, -35.13],
        [138.21, -34.38],
        [137.72, -35.08],
        [136.83, -35.26],
        [137.35, -34.71],
        [137.5, -34.13],
        [137.89, -33.64],
        [137.81, -32.9],
        [137, -33.75],
        [136.37, -34.09],
        [135.99, -34.89],
        [135.21, -34.48],
        [135.24, -33.95],
        [134.61, -33.22],
        [134.09, -32.85],
        [134.27, -32.62],
        [132.99, -32.01],
        [132.29, -31.98],
        [131.33, -31.5],
        [129.54, -31.59],
        [128.24, -31.95],
        [127.1, -32.28],
        [126.15, -32.22],
        [125.09, -32.73],
        [124.22, -32.96],
        [124.03, -33.48],
        [123.66, -33.89],
        [122.81, -33.91],
        [122.18, -34],
        [121.3, -33.82],
        [120.58, -33.93],
        [119.89, -33.98],
        [119.3, -34.51],
        [119.01, -34.46],
        [118.51, -34.75],
        [118.02, -35.06],
        [117.3, -35.03],
        [116.63, -35.03],
        [115.56, -34.39],
        [115.03, -34.2],
        [115.05, -33.62],
        [115.55, -33.49],
        [115.71, -33.26],
        [115.68, -32.9],
        [115.8, -32.21],
        [115.69, -31.61],
        [115.16, -30.6],
        [115, -30.03],
        [115.04, -29.46],
        [114.64, -28.81],
        [114.62, -28.52],
        [114.17, -28.12],
        [114.05, -27.33],
        [113.48, -26.54],
        [113.34, -26.12],
        [113.78, -26.55],
        [113.44, -25.62],
        [113.94, -25.91],
        [114.23, -26.3],
        [114.22, -25.79],
        [113.72, -25],
        [113.63, -24.68],
        [113.39, -24.38],
        [113.5, -23.81],
        [113.71, -23.56],
        [113.84, -23.06],
        [113.74, -22.48],
        [114.15, -21.76],
        [114.23, -22.52],
        [114.65, -21.83],
        [115.46, -21.5],
        [115.95, -21.07],
        [116.71, -20.7],
        [117.17, -20.62],
        [117.44, -20.75],
        [118.23, -20.37],
        [118.84, -20.26],
        [118.99, -20.04],
        [119.25, -19.95],
        [119.81, -19.98],
        [120.86, -19.68],
        [121.4, -19.24],
        [121.66, -18.71],
        [122.24, -18.2],
        [122.29, -17.8],
        [122.31, -17.25],
        [123.01, -16.41],
        [123.43, -17.27],
        [123.86, -17.07],
        [123.5, -16.6],
        [123.82, -16.11],
        [124.26, -16.33],
        [124.38, -15.57],
        [124.93, -15.08],
        [125.17, -14.68],
        [125.67, -14.51],
        [125.69, -14.23],
        [126.13, -14.35],
        [126.14, -14.1],
        [126.58, -13.95],
        [127.07, -13.82],
        [127.8, -14.28],
        [128.36, -14.87],
        [128.99, -14.88],
        [129.62, -14.97],
        [129.41, -14.42],
        [129.89, -13.62],
        [130.34, -13.36],
        [130.18, -13.11],
        [130.62, -12.54],
        [131.22, -12.18],
        [131.74, -12.3],
        [132.58, -12.11],
        [132.56, -11.6],
        [131.82, -11.27],
        [132.36, -11.13],
        [133.02, -11.38],
        [133.55, -11.79],
        [134.39, -12.04],
        [134.68, -11.94],
        [135.3, -12.25],
        [135.88, -11.96],
        [136.26, -12.05],
        [136.49, -11.86],
        [136.95, -12.35],
        [136.69, -12.89],
        [136.31, -13.29],
        [135.96, -13.32],
        [136.08, -13.72],
        [135.78, -14.22],
        [135.43, -14.72],
        [135.5, -15],
        [136.3, -15.55],
        [137.07, -15.87],
        [137.58, -16.22],
        [138.3, -16.81],
        [138.59, -16.81],
        [139.11, -17.06],
        [139.26, -17.37],
        [140.22, -17.71],
        [140.88, -17.37],
        [141.07, -16.83],
        [141.27, -16.39],
        [141.4, -15.84],
        [141.7, -15.04],
        [141.56, -14.56],
        [141.64, -14.27],
        [141.52, -13.7],
        [141.65, -12.94],
        [141.84, -12.74],
        [141.69, -12.41],
        [141.93, -11.88],
        [142.12, -11.33],
        [142.14, -11.04],
        [142.52, -10.67],
        [142.8, -11.16],
        [142.87, -11.78],
        [143.12, -11.91],
        [143.16, -12.33],
        [143.52, -12.83],
        [143.6, -13.4],
        [143.56, -13.76]
      ],
      [
        [16.98, 48.12],
        [16.9, 47.71],
        [16.34, 47.71],
        [16.53, 47.5],
        [16.2, 46.85]
      ],
      [
        [16.2, 46.85],
        [16.01, 46.68],
        [15.14, 46.66],
        [14.63, 46.43],
        [13.81, 46.51]
      ],
      [
        [13.81, 46.51],
        [12.38, 46.77],
        [12.15, 47.12],
        [11.16, 46.94],
        [11.05, 46.75],
        [10.44, 46.89]
      ],
      [
        [10.44, 46.89],
        [9.88, 46.93],
        [9.87, 47.02]
      ],
      [
        [9.87, 47.02],
        [9.61, 47.06]
      ],
      [
        [9.61, 47.06],
        [9.64, 47.1],
        [9.62, 47.15],
        [9.56, 47.17],
        [9.58, 47.21]
      ],
      [
        [9.58, 47.21],
        [9.53, 47.27],
        [9.63, 47.36]
      ],
      [
        [9.63, 47.36],
        [9.59, 47.53]
      ],
      [
        [9.59, 47.53],
        [9.9, 47.58],
        [10.4, 47.3],
        [10.54, 47.57],
        [11.43, 47.52],
        [12.14, 47.7],
        [12.62, 47.67],
        [12.93, 47.47],
        [13.03, 47.64],
        [12.88, 48.29],
        [13.24, 48.42],
        [13.6, 48.88]
      ],
      [
        [13.6, 48.88],
        [14.34, 48.56],
        [14.9, 48.96],
        [15.25, 49.04],
        [16.03, 48.73],
        [16.5, 48.79],
        [16.96, 48.6]
      ],
      [
        [16.96, 48.6],
        [16.88, 48.47],
        [16.98, 48.12]
      ],
      [
        [46.14, 38.74],
        [45.46, 38.87],
        [44.95, 39.34],
        [44.79, 39.71]
      ],
      [
        [47.99, 41.41],
        [48.58, 41.81],
        [49.11, 41.28],
        [49.62, 40.57],
        [50.08, 40.53],
        [50.39, 40.26],
        [49.57, 40.18],
        [49.4, 39.4],
        [49.22, 39.05],
        [48.86, 38.82],
        [48.88, 38.32]
      ],
      [
        [48.88, 38.32],
        [48.63, 38.27],
        [48.01, 38.79],
        [48.36, 39.29],
        [48.06, 39.58],
        [47.69, 39.51],
        [46.51, 38.77]
      ],
      [
        [44.97, 41.25],
        [45.22, 41.41],
        [45.96, 41.12],
        [46.5, 41.06],
        [46.64, 41.18],
        [46.15, 41.72],
        [46.4, 41.86]
      ],
      [
        [46.4, 41.86],
        [46.69, 41.83],
        [47.37, 41.22],
        [47.82, 41.15],
        [47.99, 41.41]
      ],
      [
        [29.34, -4.5],
        [29.28, -3.29],
        [29.02, -2.84]
      ],
      [
        [29.02, -2.84],
        [29.63, -2.92],
        [29.94, -2.35],
        [30.47, -2.41]
      ],
      [
        [30.47, -2.41],
        [30.53, -2.81],
        [30.74, -3.03],
        [30.75, -3.36],
        [30.51, -3.57],
        [30.12, -4.09],
        [29.75, -4.45]
      ],
      [
        [29.75, -4.45],
        [29.34, -4.5]
      ],
      [
        [4.05, 51.27],
        [4.97, 51.48],
        [5.61, 51.04],
        [6.16, 50.8]
      ],
      [
        [6.16, 50.8],
        [6.04, 50.13]
      ],
      [
        [6.04, 50.13],
        [5.78, 50.09],
        [5.67, 49.53]
      ],
      [
        [5.67, 49.53],
        [4.8, 49.99],
        [4.29, 49.91],
        [3.59, 50.38],
        [3.12, 50.78],
        [2.66, 50.8],
        [2.51, 51.15]
      ],
      [
        [2.51, 51.15],
        [3.31, 51.35],
        [4.05, 51.27]
      ],
      [
        [2.69, 6.26],
        [1.87, 6.14]
      ],
      [
        [1.87, 6.14],
        [1.62, 6.83],
        [1.66, 9.13],
        [1.46, 9.33],
        [1.43, 9.83],
        [1.08, 10.18],
        [0.77, 10.47],
        [0.9, 11]
      ],
      [
        [0.9, 11],
        [1.24, 11.11],
        [1.45, 11.55],
        [1.94, 11.64],
        [2.15, 11.94]
      ],
      [
        [2.15, 11.94],
        [2.49, 12.23],
        [2.85, 12.24],
        [3.61, 11.66]
      ],
      [
        [3.61, 11.66],
        [3.57, 11.33],
        [3.8, 10.73],
        [3.6, 10.33],
        [3.71, 10.06],
        [3.22, 9.44],
        [2.91, 9.14],
        [2.72, 8.51],
        [2.75, 7.87],
        [2.69, 6.26]
      ],
      [
        [-2.83, 9.64],
        [-3.51, 9.9],
        [-3.98, 9.86],
        [-4.33, 9.61],
        [-4.78, 9.82],
        [-4.95, 10.15],
        [-5.4, 10.37]
      ],
      [
        [-5.4, 10.37],
        [-5.47, 10.95],
        [-5.2, 11.38],
        [-5.22, 11.71],
        [-4.43, 12.54],
        [-4.28, 13.23],
        [-4.01, 13.47],
        [-3.52, 13.34],
        [-3.1, 13.54],
        [-2.97, 13.8],
        [-2.19, 14.25],
        [-2, 14.56],
        [-1.07, 14.97],
        [-0.52, 15.12],
        [-0.27, 14.92],
        [0.37, 14.93]
      ],
      [
        [0.37, 14.93],
        [0.3, 14.44],
        [0.43, 13.99],
        [0.99, 13.34],
        [1.02, 12.85],
        [2.18, 12.63],
        [2.15, 11.94]
      ],
      [
        [0.9, 11],
        [0.02, 11.02]
      ],
      [
        [0.02, 11.02],
        [-0.44, 11.1],
        [-0.76, 10.94],
        [-1.2, 11.01],
        [-2.94, 10.96],
        [-2.96, 10.4],
        [-2.83, 9.64]
      ],
      [
        [92.67, 22.04],
        [92.65, 21.32],
        [92.3, 21.48],
        [92.37, 20.67]
      ],
      [
        [92.37, 20.67],
        [92.08, 21.19],
        [92.03, 21.7],
        [91.83, 22.18],
        [91.42, 22.77],
        [90.5, 22.81],
        [90.59, 22.39],
        [90.27, 21.84],
        [89.85, 22.04],
        [89.7, 21.86],
        [89.42, 21.97],
        [89.03, 22.06]
      ],
      [
        [89.03, 22.06],
        [88.88, 22.88],
        [88.53, 23.63],
        [88.7, 24.23],
        [88.08, 24.5],
        [88.31, 24.87],
        [88.93, 25.24],
        [88.21, 25.77],
        [88.56, 26.45],
        [89.36, 26.01],
        [89.83, 25.97],
        [89.92, 25.27],
        [90.87, 25.13],
        [91.8, 25.15],
        [92.38, 24.98],
        [91.92, 24.13],
        [91.47, 24.07],
        [91.16, 23.5],
        [91.71, 22.99],
        [91.87, 23.62],
        [92.15, 23.63],
        [92.67, 22.04]
      ],
      [
        [22.66, 44.23],
        [22.94, 43.82],
        [23.33, 43.9],
        [24.1, 43.74],
        [25.57, 43.69],
        [26.07, 43.94],
        [27.24, 44.18],
        [27.97, 43.81],
        [28.56, 43.71]
      ],
      [
        [28.56, 43.71],
        [28.04, 43.29],
        [27.67, 42.58],
        [28, 42.01]
      ],
      [
        [28, 42.01],
        [27.14, 42.14],
        [26.12, 41.83]
      ],
      [
        [26.12, 41.83],
        [26.11, 41.33],
        [25.2, 41.23],
        [24.49, 41.58],
        [23.69, 41.31],
        [22.95, 41.34]
      ],
      [
        [22.95, 41.34],
        [22.88, 42],
        [22.38, 42.32]
      ],
      [
        [22.38, 42.32],
        [22.55, 42.46],
        [22.44, 42.58],
        [22.6, 42.9],
        [22.99, 43.21],
        [22.5, 43.64],
        [22.41, 44.01],
        [22.66, 44.23]
      ],
      [
        [-77.53, 23.76],
        [-77.78, 23.71],
        [-78.03, 24.29],
        [-78.41, 24.58],
        [-78.19, 25.21],
        [-77.89, 25.17],
        [-77.54, 24.34],
        [-77.53, 23.76]
      ],
      [
        [-77.82, 26.58],
        [-78.91, 26.42],
        [-78.98, 26.79],
        [-78.51, 26.87],
        [-77.85, 26.84],
        [-77.82, 26.58]
      ],
      [
        [-77, 26.59],
        [-77.17, 25.88],
        [-77.36, 26.01],
        [-77.34, 26.53],
        [-77.79, 26.93],
        [-77.79, 27.04],
        [-77, 26.59]
      ],
      [
        [19.01, 44.86],
        [19.37, 44.86]
      ],
      [
        [19.37, 44.86],
        [19.12, 44.42],
        [19.6, 44.04],
        [19.45, 43.57],
        [19.22, 43.52]
      ],
      [
        [19.22, 43.52],
        [19.03, 43.43],
        [18.71, 43.2],
        [18.56, 42.65]
      ],
      [
        [18.56, 42.65],
        [17.67, 43.03],
        [17.3, 43.45],
        [16.92, 43.67],
        [16.46, 44.04],
        [16.24, 44.35],
        [15.75, 44.82],
        [15.96, 45.23],
        [16.32, 45],
        [16.53, 45.21],
        [17, 45.23],
        [17.86, 45.07],
        [18.55, 45.08],
        [19.01, 44.86]
      ],
      [
        [23.48, 53.91],
        [24.45, 53.91],
        [25.54, 54.28],
        [25.77, 54.85],
        [26.59, 55.17],
        [26.49, 55.62]
      ],
      [
        [26.49, 55.62],
        [27.1, 55.78],
        [28.18, 56.17]
      ],
      [
        [28.18, 56.17],
        [29.23, 55.92],
        [29.37, 55.67],
        [29.9, 55.79],
        [30.87, 55.55],
        [30.97, 55.08],
        [30.76, 54.81],
        [31.38, 54.16],
        [31.79, 53.97],
        [31.73, 53.79],
        [32.41, 53.62],
        [32.69, 53.35],
        [32.3, 53.13]
      ],
      [
        [32.3, 53.13],
        [31.5, 53.17],
        [31.31, 53.07]
      ],
      [
        [31.31, 53.07],
        [31.54, 52.74]
      ],
      [
        [31.54, 52.74],
        [31.79, 52.1]
      ],
      [
        [31.79, 52.1],
        [30.93, 52.04],
        [30.62, 51.82],
        [30.56, 51.32],
        [30.16, 51.42],
        [29.25, 51.37],
        [28.99, 51.6],
        [28.62, 51.43],
        [28.24, 51.57],
        [27.45, 51.59],
        [26.34, 51.83],
        [25.33, 51.91],
        [24.55, 51.89],
        [24.01, 51.62],
        [23.53, 51.58]
      ],
      [
        [23.53, 51.58],
        [23.51, 52.02],
        [23.2, 52.49],
        [23.8, 52.69],
        [23.8, 53.09],
        [23.53, 53.47],
        [23.48, 53.91]
      ],
      [
        [-89.14, 17.81],
        [-89.15, 17.96],
        [-89.03, 18],
        [-88.85, 17.88],
        [-88.49, 18.49],
        [-88.3, 18.5]
      ],
      [
        [-88.3, 18.5],
        [-88.3, 18.35],
        [-88.11, 18.35],
        [-88.12, 18.08],
        [-88.29, 17.64],
        [-88.2, 17.49],
        [-88.3, 17.13],
        [-88.24, 17.04],
        [-88.36, 16.53],
        [-88.55, 16.27],
        [-88.73, 16.23],
        [-88.93, 15.89]
      ],
      [
        [-88.93, 15.89],
        [-89.23, 15.89],
        [-89.15, 17.02],
        [-89.14, 17.81]
      ],
      [
        [-67.11, -22.74],
        [-67.83, -22.87],
        [-68.22, -21.49],
        [-68.76, -20.37],
        [-68.44, -19.41],
        [-68.97, -18.98],
        [-69.1, -18.26],
        [-69.59, -17.58]
      ],
      [
        [-69.59, -17.58],
        [-68.96, -16.5],
        [-69.39, -15.66],
        [-69.16, -15.32],
        [-69.34, -14.95],
        [-68.95, -14.45],
        [-68.93, -13.6],
        [-68.88, -12.9],
        [-68.67, -12.56],
        [-69.53, -10.95]
      ],
      [
        [-69.53, -10.95],
        [-68.79, -11.04],
        [-68.27, -11.01],
        [-68.05, -10.71],
        [-67.17, -10.31],
        [-66.65, -9.93],
        [-65.34, -9.76],
        [-65.44, -10.51],
        [-65.32, -10.9],
        [-65.4, -11.57],
        [-64.32, -12.46],
        [-63.2, -12.63],
        [-62.8, -13],
        [-62.13, -13.2],
        [-61.71, -13.49],
        [-61.08, -13.48],
        [-60.5, -13.78],
        [-60.46, -14.35],
        [-60.26, -14.65],
        [-60.25, -15.08],
        [-60.54, -15.09],
        [-60.16, -16.26],
        [-58.24, -16.3],
        [-58.39, -16.88],
        [-58.28, -17.27],
        [-57.73, -17.55],
        [-57.5, -18.17],
        [-57.68, -18.96],
        [-57.95, -19.4],
        [-57.85, -19.97],
        [-58.17, -20.18]
      ],
      [
        [-58.17, -20.18],
        [-58.18, -19.87],
        [-59.12, -19.36],
        [-60.04, -19.34],
        [-61.79, -19.63],
        [-62.27, -20.51],
        [-62.29, -21.05],
        [-62.69, -22.25]
      ],
      [
        [-54.63, -25.74],
        [-54.43, -25.16],
        [-54.29, -24.57],
        [-54.29, -24.02],
        [-54.65, -23.84],
        [-55.03, -24],
        [-55.4, -23.96],
        [-55.52, -23.57],
        [-55.61, -22.66],
        [-55.8, -22.36],
        [-56.47, -22.09],
        [-56.88, -22.28],
        [-57.94, -22.09],
        [-57.87, -20.73],
        [-58.17, -20.18]
      ],
      [
        [-69.53, -10.95],
        [-70.09, -11.12],
        [-70.55, -11.01],
        [-70.48, -9.49],
        [-71.3, -10.08],
        [-72.18, -10.05],
        [-72.56, -9.52],
        [-73.23, -9.46],
        [-73.02, -9.03],
        [-73.57, -8.42],
        [-73.99, -7.52],
        [-73.72, -7.34],
        [-73.72, -6.92],
        [-73.12, -6.63],
        [-73.22, -6.09],
        [-72.96, -5.74],
        [-72.89, -5.27],
        [-71.75, -4.59],
        [-70.93, -4.4],
        [-70.79, -4.25],
        [-69.89, -4.3]
      ],
      [
        [-69.89, -4.3],
        [-69.44, -1.56],
        [-69.42, -1.12],
        [-69.58, -0.55],
        [-70.02, -0.19],
        [-70.02, 0.54],
        [-69.45, 0.71],
        [-69.25, 0.6],
        [-69.22, 0.99],
        [-69.8, 1.09],
        [-69.82, 1.71],
        [-67.87, 1.69],
        [-67.54, 2.04],
        [-67.26, 1.72],
        [-67.07, 1.13],
        [-66.88, 1.25]
      ],
      [
        [-66.88, 1.25],
        [-66.33, 0.72],
        [-65.55, 0.79],
        [-65.35, 1.1],
        [-64.61, 1.33],
        [-64.2, 1.49],
        [-64.08, 1.92],
        [-63.37, 2.2],
        [-63.42, 2.41],
        [-64.27, 2.5],
        [-64.41, 3.13],
        [-64.37, 3.8],
        [-64.82, 4.06],
        [-64.63, 4.15],
        [-63.89, 4.02],
        [-63.09, 3.77],
        [-62.8, 4.01],
        [-62.09, 4.16],
        [-60.97, 4.54],
        [-60.6, 4.92],
        [-60.73, 5.2]
      ],
      [
        [-60.73, 5.2],
        [-60.21, 5.24],
        [-59.98, 5.01],
        [-60.11, 4.57],
        [-59.77, 4.42],
        [-59.54, 3.96],
        [-59.82, 3.61],
        [-59.97, 2.76],
        [-59.72, 2.25],
        [-59.65, 1.79],
        [-59.03, 1.32],
        [-58.54, 1.27],
        [-58.43, 1.46],
        [-58.11, 1.51],
        [-57.66, 1.68],
        [-57.34, 1.95],
        [-56.78, 1.86],
        [-56.54, 1.9]
      ],
      [
        [-56.54, 1.9],
        [-56, 1.82],
        [-55.91, 2.02],
        [-56.07, 2.22],
        [-55.97, 2.51],
        [-55.57, 2.42],
        [-55.1, 2.52],
        [-54.52, 2.31]
      ],
      [
        [-54.52, 2.31],
        [-54.09, 2.11],
        [-53.78, 2.38],
        [-53.55, 2.33],
        [-53.42, 2.05],
        [-52.94, 2.12],
        [-52.56, 2.5],
        [-52.25, 3.24],
        [-51.66, 4.16]
      ],
      [
        [-51.66, 4.16],
        [-51.32, 4.2],
        [-51.07, 3.65],
        [-50.51, 1.9],
        [-49.97, 1.74],
        [-49.95, 1.05],
        [-50.7, 0.22],
        [-50.39, -0.08],
        [-48.62, -0.24],
        [-48.58, -1.24],
        [-47.82, -0.58],
        [-46.57, -0.94],
        [-44.91, -1.55],
        [-44.42, -2.14],
        [-44.58, -2.69],
        [-43.42, -2.38],
        [-41.47, -2.91],
        [-39.98, -2.87],
        [-38.5, -3.7],
        [-37.22, -4.82],
        [-36.45, -5.11],
        [-35.6, -5.15],
        [-35.24, -5.46],
        [-34.9, -6.74],
        [-34.73, -7.34],
        [-35.13, -9],
        [-35.64, -9.65],
        [-37.05, -11.04],
        [-37.68, -12.17],
        [-38.42, -13.04],
        [-38.67, -13.06],
        [-38.95, -13.79],
        [-38.88, -15.67],
        [-39.16, -17.21],
        [-39.27, -17.87],
        [-39.58, -18.26],
        [-39.76, -19.6],
        [-40.77, -20.9],
        [-40.94, -21.94],
        [-41.75, -22.37],
        [-41.99, -22.97],
        [-43.07, -22.97],
        [-44.65, -23.35],
        [-45.35, -23.8],
        [-46.47, -24.09],
        [-47.65, -24.89],
        [-48.5, -25.88],
        [-48.64, -26.62],
        [-48.47, -27.18],
        [-48.66, -28.19],
        [-48.89, -28.67],
        [-49.59, -29.22],
        [-50.7, -30.98],
        [-51.58, -31.78],
        [-52.26, -32.25],
        [-52.71, -33.2],
        [-53.37, -33.77]
      ],
      [
        [-53.37, -33.77],
        [-53.65, -33.2],
        [-53.21, -32.73],
        [-53.79, -32.05],
        [-54.57, -31.49],
        [-55.6, -30.85],
        [-55.97, -30.88],
        [-56.98, -30.11],
        [-57.63, -30.22]
      ],
      [
        [114.2, 4.53],
        [114.6, 4.9],
        [115.45, 5.45]
      ],
      [
        [115.45, 5.45],
        [115.41, 4.96],
        [115.35, 4.32],
        [114.87, 4.35],
        [114.66, 4.01],
        [114.2, 4.53]
      ],
      [
        [91.7, 27.77],
        [92.1, 27.45],
        [92.03, 26.84],
        [91.22, 26.81],
        [90.37, 26.88],
        [89.74, 26.72],
        [88.84, 27.1],
        [88.81, 27.3]
      ],
      [
        [88.81, 27.3],
        [89.48, 28.04],
        [90.02, 28.3],
        [90.73, 28.06],
        [91.26, 28.04],
        [91.7, 27.77]
      ],
      [
        [29.43, -22.09],
        [28.02, -22.83],
        [27.12, -23.57],
        [26.79, -24.24],
        [26.49, -24.62],
        [25.94, -24.7],
        [25.77, -25.17],
        [25.66, -25.49],
        [25.03, -25.72],
        [24.21, -25.67],
        [23.73, -25.39],
        [23.31, -25.27],
        [22.82, -25.5],
        [22.58, -25.98],
        [22.11, -26.28],
        [21.61, -26.73],
        [20.89, -26.83],
        [20.67, -26.48],
        [20.76, -25.87],
        [20.17, -24.92],
        [19.9, -24.77]
      ],
      [
        [19.9, -24.77],
        [19.9, -21.85],
        [20.88, -21.81],
        [20.91, -18.25],
        [21.66, -18.22],
        [23.2, -17.87],
        [23.58, -18.28],
        [24.22, -17.89],
        [24.52, -17.89],
        [25.08, -17.66]
      ],
      [
        [25.08, -17.66],
        [25.26, -17.74]
      ],
      [
        [25.26, -17.74],
        [25.65, -18.54],
        [25.85, -18.71],
        [26.16, -19.29],
        [27.3, -20.39],
        [27.72, -20.5],
        [27.73, -20.85],
        [28.02, -21.49],
        [28.79, -21.64],
        [29.43, -22.09]
      ],
      [
        [15.28, 7.42],
        [16.11, 7.5],
        [16.29, 7.75],
        [16.46, 7.73],
        [16.71, 7.51],
        [17.96, 7.89],
        [18.39, 8.28],
        [18.91, 8.63],
        [18.81, 8.98],
        [19.09, 9.07],
        [20.06, 9.01],
        [21, 9.48],
        [21.72, 10.57],
        [22.23, 10.97],
        [22.86, 11.14]
      ],
      [
        [22.86, 11.14],
        [22.98, 10.71],
        [23.55, 10.09],
        [23.56, 9.68],
        [23.39, 9.27],
        [23.46, 8.95],
        [23.81, 8.67]
      ],
      [
        [23.81, 8.67],
        [24.57, 8.23]
      ],
      [
        [24.57, 8.23],
        [25.11, 7.83],
        [25.12, 7.5],
        [25.8, 6.98],
        [26.21, 6.55],
        [26.47, 5.95],
        [27.21, 5.55],
        [27.37, 5.23]
      ],
      [
        [27.37, 5.23],
        [27.04, 5.13],
        [26.4, 5.15],
        [25.65, 5.26],
        [25.28, 5.17],
        [25.13, 4.93],
        [24.81, 4.9],
        [24.41, 5.11],
        [23.3, 4.61],
        [22.84, 4.71],
        [22.7, 4.63],
        [22.41, 4.03],
        [21.66, 4.22],
        [20.93, 4.32],
        [20.29, 4.69],
        [19.47, 5.03],
        [18.93, 4.71],
        [18.54, 4.2],
        [18.45, 3.5]
      ],
      [
        [18.45, 3.5],
        [17.81, 3.56],
        [17.13, 3.73],
        [16.54, 3.2],
        [16.01, 2.27]
      ],
      [
        [16.01, 2.27],
        [15.91, 2.56],
        [15.86, 3.01],
        [15.41, 3.34],
        [15.04, 3.85],
        [14.95, 4.21],
        [14.48, 4.73],
        [14.56, 5.03],
        [14.46, 5.45],
        [14.54, 6.23],
        [14.78, 6.41],
        [15.28, 7.42]
      ],
      [
        [-63.66, 46.55],
        [-62.94, 46.42],
        [-62.01, 46.44],
        [-62.5, 46.03],
        [-62.87, 45.97],
        [-64.14, 46.39],
        [-64.39, 46.73],
        [-64.01, 47.04],
        [-63.66, 46.55]
      ],
      [
        [-61.81, 49.11],
        [-62.29, 49.09],
        [-63.59, 49.4],
        [-64.52, 49.87],
        [-64.17, 49.96],
        [-62.86, 49.71],
        [-61.84, 49.29],
        [-61.81, 49.11]
      ],
      [
        [-123.51, 48.51],
        [-124.01, 48.37],
        [-125.66, 48.83],
        [-125.95, 49.18],
        [-126.85, 49.53],
        [-127.03, 49.81],
        [-128.06, 49.99],
        [-128.44, 50.54],
        [-128.36, 50.77],
        [-127.31, 50.55],
        [-126.7, 50.4],
        [-125.76, 50.3],
        [-125.42, 49.95],
        [-124.92, 49.48],
        [-123.92, 49.06],
        [-123.51, 48.51]
      ],
      [
        [-56.13, 50.69],
        [-56.8, 49.81],
        [-56.14, 50.15],
        [-55.47, 49.94],
        [-55.82, 49.59],
        [-54.94, 49.31],
        [-54.47, 49.56],
        [-53.48, 49.25],
        [-53.79, 48.52],
        [-53.09, 48.69],
        [-52.96, 48.16],
        [-52.65, 47.54],
        [-53.07, 46.66],
        [-53.52, 46.62],
        [-54.18, 46.81],
        [-53.96, 47.63],
        [-54.24, 47.75],
        [-55.4, 46.88],
        [-56, 46.92],
        [-55.29, 47.39],
        [-56.25, 47.63],
        [-57.33, 47.57],
        [-59.27, 47.6],
        [-59.42, 47.9],
        [-58.8, 48.25],
        [-59.23, 48.52],
        [-58.39, 49.13],
        [-57.36, 50.72],
        [-56.74, 51.29],
        [-55.87, 51.63],
        [-55.41, 51.59],
        [-55.6, 51.32],
        [-56.13, 50.69]
      ],
      [
        [-132.71, 54.04],
        [-132.71, 54.04],
        [-132.71, 54.04],
        [-132.71, 54.04],
        [-131.75, 54.12],
        [-132.05, 52.98],
        [-131.18, 52.18],
        [-131.58, 52.18],
        [-132.18, 52.64],
        [-132.55, 53.1],
        [-133.05, 53.41],
        [-133.24, 53.85],
        [-133.18, 54.17],
        [-132.71, 54.04]
      ],
      [
        [-79.27, 62.16],
        [-79.66, 61.63],
        [-80.1, 61.72],
        [-80.36, 62.02],
        [-80.32, 62.09],
        [-79.93, 62.39],
        [-79.52, 62.36],
        [-79.27, 62.16]
      ],
      [
        [-81.9, 62.71],
        [-83.07, 62.16],
        [-83.77, 62.18],
        [-83.99, 62.45],
        [-83.25, 62.91],
        [-81.88, 62.9],
        [-81.9, 62.71]
      ],
      [
        [-85.16, 65.66],
        [-84.98, 65.22],
        [-84.46, 65.37],
        [-83.88, 65.11],
        [-82.79, 64.77],
        [-81.64, 64.46],
        [-81.55, 63.98],
        [-80.82, 64.06],
        [-80.1, 63.73],
        [-80.99, 63.41],
        [-82.55, 63.65],
        [-83.11, 64.1],
        [-84.1, 63.57],
        [-85.52, 63.05],
        [-85.87, 63.64],
        [-87.22, 63.54],
        [-86.35, 64.04],
        [-86.22, 64.82],
        [-85.88, 65.74],
        [-85.16, 65.66]
      ],
      [
        [-75.87, 67.15],
        [-76.99, 67.1],
        [-77.24, 67.59],
        [-76.81, 68.15],
        [-75.9, 68.29],
        [-75.11, 68.01],
        [-75.1, 67.58],
        [-75.22, 67.44],
        [-75.87, 67.15]
      ],
      [
        [-95.65, 69.11],
        [-96.27, 68.76],
        [-97.62, 69.06],
        [-98.43, 68.95],
        [-99.8, 69.4],
        [-98.92, 69.71],
        [-98.22, 70.14],
        [-97.16, 69.86],
        [-96.56, 69.68],
        [-96.26, 69.49],
        [-95.65, 69.11]
      ],
      [
        [-67.14, 45.14],
        [-67.79, 45.7],
        [-67.79, 47.07],
        [-68.23, 47.35],
        [-68.9, 47.19],
        [-69.24, 47.45],
        [-70, 46.69],
        [-70.31, 45.92],
        [-70.66, 45.46],
        [-71.08, 45.31],
        [-71.4, 45.26],
        [-71.51, 45.01],
        [-73.35, 45.01],
        [-74.87, 45],
        [-75.32, 44.82],
        [-76.37, 44.1],
        [-76.5, 44.02],
        [-76.82, 43.63],
        [-77.74, 43.63],
        [-78.72, 43.63],
        [-79.17, 43.47],
        [-79.01, 43.27],
        [-78.92, 42.97],
        [-78.94, 42.86],
        [-80.25, 42.37],
        [-81.28, 42.21],
        [-82.44, 41.68],
        [-82.69, 41.68],
        [-83.03, 41.83],
        [-83.14, 41.98],
        [-83.12, 42.08],
        [-82.9, 42.43],
        [-82.43, 42.98],
        [-82.14, 43.57],
        [-82.34, 44.44],
        [-82.55, 45.35],
        [-83.59, 45.82],
        [-83.47, 45.99],
        [-83.62, 46.12],
        [-83.89, 46.12],
        [-84.09, 46.28],
        [-84.14, 46.51],
        [-84.34, 46.41],
        [-84.6, 46.44],
        [-84.54, 46.54],
        [-84.78, 46.64],
        [-84.88, 46.9],
        [-85.65, 47.22],
        [-86.46, 47.55],
        [-87.44, 47.94],
        [-88.38, 48.3],
        [-89.27, 48.02],
        [-89.6, 48.01],
        [-90.83, 48.27],
        [-91.64, 48.14],
        [-92.61, 48.45],
        [-93.63, 48.61],
        [-94.33, 48.67],
        [-94.64, 48.84],
        [-94.82, 49.39],
        [-95.16, 49.38],
        [-95.16, 49],
        [-97.23, 49],
        [-100.65, 49],
        [-104.05, 49],
        [-107.05, 49],
        [-110.05, 49],
        [-113, 49],
        [-116.05, 49],
        [-117.03, 49],
        [-120, 49],
        [-122.84, 49]
      ],
      [
        [-122.84, 49],
        [-122.97, 49],
        [-124.91, 49.98],
        [-125.62, 50.42],
        [-127.44, 50.83],
        [-127.99, 51.72],
        [-127.85, 52.33],
        [-129.13, 52.76],
        [-129.31, 53.56],
        [-130.51, 54.29],
        [-130.54, 54.8],
        [-129.98, 55.29],
        [-130.01, 55.92]
      ],
      [
        [-130.01, 55.92],
        [-131.71, 56.55],
        [-132.73, 57.69]
      ],
      [
        [-132.73, 57.69],
        [-133.36, 58.41],
        [-134.27, 58.86]
      ],
      [
        [-134.27, 58.86],
        [-134.94, 59.27],
        [-135.48, 59.79],
        [-136.48, 59.46],
        [-137.45, 58.91],
        [-138.34, 59.56]
      ],
      [
        [-138.34, 59.56],
        [-139.04, 60],
        [-140.01, 60.28],
        [-141, 60.31],
        [-140.99, 66],
        [-140.99, 69.71],
        [-139.12, 69.47],
        [-137.55, 68.99],
        [-136.5, 68.9],
        [-135.63, 69.32],
        [-134.41, 69.63],
        [-132.93, 69.51],
        [-131.43, 69.94],
        [-129.79, 70.19],
        [-129.11, 69.78],
        [-128.36, 70.01],
        [-128.14, 70.48],
        [-127.45, 70.38],
        [-125.76, 69.48],
        [-124.42, 70.16],
        [-124.29, 69.4],
        [-123.06, 69.56],
        [-122.68, 69.86],
        [-121.47, 69.8],
        [-119.94, 69.38],
        [-117.6, 69.01],
        [-116.23, 68.84],
        [-115.25, 68.91],
        [-113.9, 68.4],
        [-115.3, 67.9],
        [-113.5, 67.69],
        [-110.8, 67.81],
        [-109.95, 67.98],
        [-108.88, 67.38],
        [-107.79, 67.89],
        [-108.81, 68.31],
        [-108.17, 68.65],
        [-106.95, 68.7],
        [-106.15, 68.8],
        [-105.34, 68.56],
        [-104.34, 68.02],
        [-103.22, 68.1],
        [-101.45, 67.65],
        [-99.9, 67.81],
        [-98.44, 67.78],
        [-98.56, 68.4],
        [-97.67, 68.58],
        [-96.12, 68.24],
        [-96.13, 67.29],
        [-95.49, 68.09],
        [-94.68, 68.06],
        [-94.23, 69.07],
        [-95.3, 69.69],
        [-96.47, 70.09],
        [-96.39, 71.19],
        [-95.21, 71.92],
        [-93.89, 71.76],
        [-92.88, 71.32],
        [-91.52, 70.19],
        [-92.41, 69.7],
        [-90.55, 69.5],
        [-90.55, 68.47],
        [-89.22, 69.26],
        [-88.02, 68.62],
        [-88.32, 67.87],
        [-87.35, 67.2],
        [-86.31, 67.92],
        [-85.58, 68.78],
        [-85.52, 69.88],
        [-84.1, 69.81],
        [-82.62, 69.66],
        [-81.28, 69.16],
        [-81.22, 68.67],
        [-81.96, 68.13],
        [-81.26, 67.6],
        [-81.39, 67.11],
        [-83.34, 66.41],
        [-84.74, 66.26],
        [-85.77, 66.56],
        [-86.07, 66.06],
        [-87.03, 65.21],
        [-87.32, 64.78],
        [-88.48, 64.1],
        [-89.91, 64.03],
        [-90.7, 63.61],
        [-90.77, 62.96],
        [-91.93, 62.84],
        [-93.16, 62.02],
        [-94.24, 60.9],
        [-94.63, 60.11],
        [-94.68, 58.95],
        [-93.22, 58.78],
        [-92.76, 57.85],
        [-92.3, 57.09],
        [-90.9, 57.28],
        [-89.04, 56.85],
        [-88.04, 56.47],
        [-87.32, 56],
        [-86.07, 55.72],
        [-85.01, 55.3],
        [-83.36, 55.24],
        [-82.27, 55.15],
        [-82.44, 54.28],
        [-82.13, 53.28],
        [-81.4, 52.16],
        [-79.91, 51.21],
        [-79.14, 51.53],
        [-78.6, 52.56],
        [-79.12, 54.14],
        [-79.83, 54.67],
        [-78.23, 55.14],
        [-77.1, 55.84],
        [-76.54, 56.53],
        [-76.62, 57.2],
        [-77.3, 58.05],
        [-78.52, 58.8],
        [-77.34, 59.85],
        [-77.77, 60.76],
        [-78.11, 62.32],
        [-77.41, 62.55],
        [-75.7, 62.28],
        [-74.67, 62.18],
        [-73.84, 62.44],
        [-72.91, 62.11],
        [-71.68, 61.53],
        [-71.37, 61.14],
        [-69.59, 61.06],
        [-69.62, 60.22],
        [-69.29, 58.96],
        [-68.37, 58.8],
        [-67.65, 58.21],
        [-66.2, 58.77],
        [-65.25, 59.87],
        [-64.58, 60.34],
        [-63.8, 59.44],
        [-62.5, 58.17],
        [-61.4, 56.97],
        [-61.8, 56.34],
        [-60.47, 55.78],
        [-59.57, 55.2],
        [-57.98, 54.95],
        [-57.33, 54.63],
        [-56.94, 53.78],
        [-56.16, 53.65],
        [-55.76, 53.27],
        [-55.68, 52.15],
        [-56.41, 51.77],
        [-57.13, 51.42],
        [-58.77, 51.06],
        [-60.03, 50.24],
        [-61.72, 50.08],
        [-63.86, 50.29],
        [-65.36, 50.3],
        [-66.4, 50.23],
        [-67.24, 49.51],
        [-68.51, 49.07],
        [-69.95, 47.74],
        [-71.1, 46.82],
        [-70.26, 46.99],
        [-68.65, 48.3],
        [-66.55, 49.13],
        [-65.06, 49.23],
        [-64.17, 48.74],
        [-65.12, 48.07],
        [-64.8, 46.99],
        [-64.47, 46.24],
        [-63.17, 45.74],
        [-61.52, 45.88],
        [-60.52, 47.01],
        [-60.45, 46.28],
        [-59.8, 45.92],
        [-61.04, 45.27],
        [-63.25, 44.67],
        [-64.25, 44.27],
        [-65.36, 43.55],
        [-66.12, 43.62],
        [-66.16, 44.47],
        [-64.43, 45.29],
        [-66.03, 45.26],
        [-67.14, 45.14]
      ],
      [
        [-114.17, 73.12],
        [-114.67, 72.65],
        [-112.44, 72.96],
        [-111.05, 72.45],
        [-109.92, 72.96],
        [-109.01, 72.63],
        [-108.19, 71.65],
        [-107.69, 72.07],
        [-108.4, 73.09],
        [-107.52, 73.24],
        [-106.52, 73.08],
        [-105.4, 72.67],
        [-104.77, 71.7],
        [-104.46, 70.99],
        [-102.79, 70.5],
        [-100.98, 70.02],
        [-101.09, 69.58],
        [-102.73, 69.5],
        [-102.09, 69.12],
        [-102.43, 68.75],
        [-104.24, 68.91],
        [-105.96, 69.18],
        [-107.12, 69.12],
        [-109, 68.78],
        [-111.53, 68.63],
        [-113.31, 68.54],
        [-113.85, 69.01],
        [-115.22, 69.28],
        [-116.11, 69.17],
        [-117.34, 69.96],
        [-116.67, 70.07],
        [-115.13, 70.24],
        [-113.72, 70.19],
        [-112.42, 70.37],
        [-114.35, 70.6],
        [-116.49, 70.52],
        [-117.9, 70.54],
        [-118.43, 70.91],
        [-116.11, 71.31],
        [-117.66, 71.3],
        [-119.4, 71.56],
        [-118.56, 72.31],
        [-117.87, 72.71],
        [-115.19, 73.31],
        [-114.17, 73.12]
      ],
      [
        [-104.5, 73.42],
        [-105.38, 72.76],
        [-106.94, 73.46],
        [-106.6, 73.6],
        [-105.26, 73.64],
        [-104.5, 73.42]
      ],
      [
        [-76.34, 73.1],
        [-76.25, 72.83],
        [-77.31, 72.86],
        [-78.39, 72.88],
        [-79.49, 72.74],
        [-79.78, 72.8],
        [-80.88, 73.33],
        [-80.83, 73.69],
        [-80.35, 73.76],
        [-78.06, 73.65],
        [-76.34, 73.1]
      ],
      [
        [-86.56, 73.16],
        [-85.77, 72.53],
        [-84.85, 73.34],
        [-82.32, 73.75],
        [-80.6, 72.72],
        [-80.75, 72.06],
        [-78.77, 72.35],
        [-77.82, 72.75],
        [-75.61, 72.24],
        [-74.23, 71.77],
        [-74.1, 71.33],
        [-72.24, 71.56],
        [-71.2, 70.92],
        [-68.79, 70.53],
        [-67.91, 70.12],
        [-66.97, 69.19],
        [-68.81, 68.72],
        [-66.45, 68.07],
        [-64.86, 67.85],
        [-63.42, 66.93],
        [-61.85, 66.86],
        [-62.16, 66.16],
        [-63.92, 65],
        [-65.15, 65.43],
        [-66.72, 66.39],
        [-68.02, 66.26],
        [-68.14, 65.69],
        [-67.09, 65.11],
        [-65.73, 64.65],
        [-65.32, 64.38],
        [-64.67, 63.39],
        [-65.01, 62.67],
        [-66.28, 62.95],
        [-68.78, 63.75],
        [-67.37, 62.88],
        [-66.33, 62.28],
        [-66.17, 61.93],
        [-68.88, 62.33],
        [-71.02, 62.91],
        [-72.24, 63.4],
        [-71.89, 63.68],
        [-73.38, 64.19],
        [-74.83, 64.68],
        [-74.82, 64.39],
        [-77.71, 64.23],
        [-78.56, 64.57],
        [-77.9, 65.31],
        [-76.02, 65.33],
        [-73.96, 65.45],
        [-74.29, 65.81],
        [-73.94, 66.31],
        [-72.65, 67.28],
        [-72.93, 67.73],
        [-73.31, 68.07],
        [-74.84, 68.55],
        [-76.87, 68.89],
        [-76.23, 69.15],
        [-77.29, 69.77],
        [-78.17, 69.83],
        [-78.96, 70.17],
        [-79.49, 69.87],
        [-81.31, 69.74],
        [-84.94, 69.97],
        [-87.06, 70.26],
        [-88.68, 70.41],
        [-89.51, 70.76],
        [-88.47, 71.22],
        [-89.89, 71.22],
        [-90.21, 72.24],
        [-89.44, 73.13],
        [-88.41, 73.54],
        [-85.83, 73.8],
        [-86.56, 73.16]
      ],
      [
        [-100.36, 73.84],
        [-99.16, 73.63],
        [-97.38, 73.76],
        [-97.12, 73.47],
        [-98.05, 72.99],
        [-96.54, 72.56],
        [-96.72, 71.66],
        [-98.36, 71.27],
        [-99.32, 71.36],
        [-100.01, 71.74],
        [-102.5, 72.51],
        [-102.48, 72.83],
        [-100.44, 72.71],
        [-101.54, 73.36],
        [-100.36, 73.84]
      ],
      [
        [-93.2, 72.77],
        [-94.27, 72.02],
        [-95.41, 72.06],
        [-96.03, 72.94],
        [-96.02, 73.44],
        [-95.5, 73.86],
        [-94.5, 74.13],
        [-92.42, 74.1],
        [-90.51, 73.86],
        [-92, 72.97],
        [-93.2, 72.77]
      ],
      [
        [-120.46, 71.38],
        [-123.09, 70.9],
        [-123.62, 71.34],
        [-125.93, 71.87],
        [-125.5, 72.29],
        [-124.81, 73.02],
        [-123.94, 73.68],
        [-124.92, 74.29],
        [-121.54, 74.45],
        [-120.11, 74.24],
        [-117.56, 74.19],
        [-116.58, 73.9],
        [-115.51, 73.48],
        [-116.77, 73.22],
        [-119.22, 72.52],
        [-120.46, 71.82],
        [-120.46, 71.38]
      ],
      [
        [-93.61, 74.98],
        [-94.16, 74.59],
        [-95.61, 74.67],
        [-96.82, 74.93],
        [-96.29, 75.38],
        [-94.85, 75.65],
        [-93.98, 75.3],
        [-93.61, 74.98]
      ],
      [
        [-98.5, 76.72],
        [-97.74, 76.26],
        [-97.7, 75.74],
        [-98.16, 75],
        [-99.81, 74.9],
        [-100.88, 75.06],
        [-100.86, 75.64],
        [-102.5, 75.56],
        [-102.57, 76.34],
        [-101.49, 76.31],
        [-99.98, 76.65],
        [-98.58, 76.59],
        [-98.5, 76.72]
      ],
      [
        [-108.21, 76.2],
        [-107.82, 75.85],
        [-106.93, 76.01],
        [-105.88, 75.97],
        [-105.7, 75.48],
        [-106.31, 75.01],
        [-109.7, 74.85],
        [-112.22, 74.42],
        [-113.74, 74.39],
        [-113.87, 74.72],
        [-111.79, 75.16],
        [-116.31, 75.04],
        [-117.71, 75.22],
        [-116.35, 76.2],
        [-115.4, 76.48],
        [-112.59, 76.14],
        [-110.81, 75.55],
        [-109.07, 75.47],
        [-110.5, 76.43],
        [-109.58, 76.79],
        [-108.55, 76.68],
        [-108.21, 76.2]
      ],
      [
        [-94.68, 77.1],
        [-93.57, 76.78],
        [-91.61, 76.78],
        [-90.74, 76.45],
        [-90.97, 76.07],
        [-89.82, 75.85],
        [-89.19, 75.61],
        [-87.84, 75.57],
        [-86.38, 75.48],
        [-84.79, 75.7],
        [-82.75, 75.78],
        [-81.13, 75.71],
        [-80.06, 75.34],
        [-79.83, 74.92],
        [-80.46, 74.66],
        [-81.95, 74.44],
        [-83.23, 74.56],
        [-86.1, 74.41],
        [-88.15, 74.39],
        [-89.76, 74.52],
        [-92.42, 74.84],
        [-92.77, 75.39],
        [-92.89, 75.88],
        [-93.89, 76.32],
        [-95.96, 76.44],
        [-97.12, 76.75],
        [-96.75, 77.16],
        [-94.68, 77.1]
      ],
      [
        [-116.2, 77.65],
        [-116.34, 76.88],
        [-117.11, 76.53],
        [-118.04, 76.48],
        [-119.9, 76.05],
        [-121.5, 75.9],
        [-122.85, 76.12],
        [-122.85, 76.12],
        [-121.16, 76.86],
        [-119.1, 77.51],
        [-117.57, 77.5],
        [-116.2, 77.65]
      ],
      [
        [-93.84, 77.52],
        [-94.3, 77.49],
        [-96.17, 77.56],
        [-96.44, 77.83],
        [-94.42, 77.82],
        [-93.72, 77.63],
        [-93.84, 77.52]
      ],
      [
        [-110.19, 77.7],
        [-112.05, 77.41],
        [-113.53, 77.73],
        [-112.72, 78.05],
        [-111.26, 78.15],
        [-109.85, 78],
        [-110.19, 77.7]
      ],
      [
        [-109.66, 78.6],
        [-110.88, 78.41],
        [-112.54, 78.41],
        [-112.53, 78.55],
        [-111.5, 78.85],
        [-110.96, 78.8],
        [-109.66, 78.6]
      ],
      [
        [-95.83, 78.06],
        [-97.31, 77.85],
        [-98.12, 78.08],
        [-98.55, 78.46],
        [-98.63, 78.87],
        [-97.34, 78.83],
        [-96.75, 78.77],
        [-95.56, 78.42],
        [-95.83, 78.06]
      ],
      [
        [-100.06, 78.32],
        [-99.67, 77.91],
        [-101.3, 78.02],
        [-102.95, 78.34],
        [-105.18, 78.38],
        [-104.21, 78.68],
        [-105.42, 78.92],
        [-105.49, 79.3],
        [-103.53, 79.17],
        [-100.83, 78.8],
        [-100.06, 78.32]
      ],
      [
        [-87.02, 79.66],
        [-85.81, 79.34],
        [-87.19, 79.04],
        [-89.04, 78.29],
        [-90.8, 78.22],
        [-92.88, 78.34],
        [-93.95, 78.75],
        [-93.94, 79.11],
        [-93.15, 79.38],
        [-94.97, 79.37],
        [-96.08, 79.71],
        [-96.71, 80.16],
        [-96.02, 80.6],
        [-95.32, 80.91],
        [-94.3, 80.98],
        [-94.74, 81.21],
        [-92.41, 81.26],
        [-91.13, 80.72],
        [-89.45, 80.51],
        [-87.81, 80.32],
        [-87.02, 79.66]
      ],
      [
        [-68.5, 83.11],
        [-65.83, 83.03],
        [-63.68, 82.9],
        [-61.85, 82.63],
        [-61.89, 82.36],
        [-64.33, 81.93],
        [-66.75, 81.73],
        [-67.66, 81.5],
        [-65.48, 81.51],
        [-67.84, 80.9],
        [-69.47, 80.62],
        [-71.18, 79.8],
        [-73.24, 79.63],
        [-73.88, 79.43],
        [-76.91, 79.32],
        [-75.53, 79.2],
        [-76.22, 79.02],
        [-75.39, 78.53],
        [-76.34, 78.18],
        [-77.89, 77.9],
        [-78.36, 77.51],
        [-79.76, 77.21],
        [-79.62, 76.98],
        [-77.91, 77.02],
        [-77.89, 76.78],
        [-80.56, 76.18],
        [-83.17, 76.45],
        [-86.11, 76.3],
        [-87.6, 76.42],
        [-89.49, 76.47],
        [-89.62, 76.95],
        [-87.77, 77.18],
        [-88.26, 77.9],
        [-87.65, 77.97],
        [-84.98, 77.54],
        [-86.34, 78.18],
        [-87.96, 78.37],
        [-87.15, 78.76],
        [-85.38, 79],
        [-85.09, 79.35],
        [-86.51, 79.74],
        [-86.93, 80.25],
        [-84.2, 80.21],
        [-83.41, 80.1],
        [-81.85, 80.46],
        [-84.1, 80.58],
        [-87.6, 80.52],
        [-89.37, 80.86],
        [-90.2, 81.26],
        [-91.37, 81.55],
        [-91.59, 81.89],
        [-90.1, 82.09],
        [-88.93, 82.12],
        [-86.97, 82.28],
        [-85.5, 82.65],
        [-84.26, 82.6],
        [-83.18, 82.32],
        [-82.42, 82.86],
        [-81.1, 83.02],
        [-79.31, 83.13],
        [-76.25, 83.17],
        [-75.72, 83.06],
        [-72.83, 83.23],
        [-70.67, 83.17],
        [-68.5, 83.11]
      ],
      [
        [9.63, 47.36],
        [9.53, 47.27],
        [9.49, 47.18]
      ],
      [
        [9.49, 47.18],
        [9.51, 47.09],
        [9.47, 47.06],
        [9.56, 47.05]
      ],
      [
        [9.56, 47.05],
        [9.61, 47.06],
        [9.87, 47.02]
      ],
      [
        [10.44, 46.89],
        [10.36, 46.48],
        [9.92, 46.31],
        [9.18, 46.44],
        [8.97, 46.04],
        [8.49, 46.01],
        [8.32, 46.16],
        [7.76, 45.82],
        [7.27, 45.78],
        [6.84, 45.99]
      ],
      [
        [6.84, 45.99],
        [6.5, 46.43],
        [6.02, 46.27],
        [6.04, 46.73],
        [6.77, 47.29],
        [6.74, 47.54],
        [7.19, 47.45],
        [7.47, 47.62]
      ],
      [
        [7.47, 47.62],
        [8.32, 47.61],
        [8.52, 47.83],
        [9.59, 47.53]
      ],
      [
        [-66.96, -54.9],
        [-67.29, -55.3],
        [-68.15, -55.61],
        [-68.64, -55.58],
        [-69.23, -55.5],
        [-69.96, -55.2],
        [-71.01, -55.05],
        [-72.26, -54.5],
        [-73.29, -53.96],
        [-74.66, -52.84],
        [-73.84, -53.05],
        [-72.43, -53.72],
        [-71.11, -54.07],
        [-70.59, -53.62],
        [-70.27, -52.93],
        [-69.35, -52.52],
        [-68.63, -52.64]
      ],
      [
        [-68.57, -52.3],
        [-69.46, -52.29],
        [-69.94, -52.54],
        [-70.85, -52.9],
        [-71.01, -53.83],
        [-71.43, -53.86],
        [-72.56, -53.53],
        [-73.7, -52.84],
        [-73.7, -52.84],
        [-74.95, -52.26],
        [-75.26, -51.63],
        [-74.98, -51.04],
        [-75.48, -50.38],
        [-75.61, -48.67],
        [-75.18, -47.71],
        [-74.13, -46.94],
        [-75.64, -46.65],
        [-74.69, -45.76],
        [-74.35, -44.1],
        [-73.24, -44.45],
        [-72.72, -42.38],
        [-73.39, -42.12],
        [-73.7, -43.37],
        [-74.33, -43.22],
        [-74.02, -41.79],
        [-73.68, -39.94],
        [-73.22, -39.26],
        [-73.51, -38.28],
        [-73.59, -37.16],
        [-73.17, -37.12],
        [-72.55, -35.51],
        [-71.86, -33.91],
        [-71.44, -32.42],
        [-71.67, -30.92],
        [-71.37, -30.1],
        [-71.49, -28.86],
        [-70.91, -27.64],
        [-70.72, -25.71],
        [-70.4, -23.63],
        [-70.09, -21.39],
        [-70.16, -19.76],
        [-70.37, -18.35]
      ],
      [
        [-70.37, -18.35],
        [-69.86, -18.09],
        [-69.59, -17.58]
      ],
      [
        [110.34, 18.68],
        [109.48, 18.2],
        [108.66, 18.51],
        [108.63, 19.37],
        [109.12, 19.82],
        [110.21, 20.1],
        [110.79, 20.08],
        [111.01, 19.7],
        [110.57, 19.26],
        [110.34, 18.68]
      ],
      [
        [129.4, 49.44],
        [130.58, 48.73]
      ],
      [
        [130.58, 48.73],
        [130.99, 47.79],
        [132.51, 47.79],
        [133.37, 48.18]
      ],
      [
        [133.37, 48.18],
        [135.03, 48.48]
      ],
      [
        [135.03, 48.48],
        [134.5, 47.58],
        [134.11, 47.21],
        [133.77, 46.12]
      ],
      [
        [133.77, 46.12],
        [133.1, 45.14],
        [131.88, 45.32]
      ],
      [
        [131.88, 45.32],
        [131.03, 44.97],
        [131.29, 44.11]
      ],
      [
        [131.29, 44.11],
        [131.14, 42.93],
        [130.63, 42.9]
      ],
      [
        [130.63, 42.9],
        [130.64, 42.4]
      ],
      [
        [130.64, 42.4],
        [129.99, 42.99],
        [129.6, 42.42],
        [128.05, 41.99],
        [128.21, 41.47],
        [127.34, 41.5],
        [126.87, 41.82],
        [126.18, 41.11],
        [125.08, 40.57],
        [124.27, 39.93]
      ],
      [
        [124.27, 39.93],
        [122.87, 39.64],
        [122.13, 39.17],
        [121.05, 38.9],
        [121.59, 39.36],
        [121.38, 39.75],
        [122.17, 40.42],
        [121.64, 40.95],
        [120.77, 40.59],
        [119.64, 39.9],
        [119.02, 39.25],
        [118.04, 39.2],
        [117.53, 38.74],
        [118.06, 38.06],
        [118.88, 37.9],
        [118.91, 37.45],
        [119.7, 37.16],
        [120.82, 37.87],
        [121.71, 37.48],
        [122.36, 37.45],
        [122.52, 36.93],
        [121.1, 36.65],
        [120.64, 36.11],
        [119.66, 35.61],
        [119.15, 34.91],
        [120.23, 34.36],
        [120.62, 33.38],
        [121.23, 32.46],
        [121.91, 31.69],
        [121.89, 30.95],
        [121.26, 30.68],
        [121.5, 30.14],
        [122.09, 29.83],
        [121.94, 29.02],
        [121.68, 28.23],
        [121.13, 28.14],
        [120.4, 27.05],
        [119.59, 25.74],
        [118.66, 24.55],
        [117.28, 23.62],
        [115.89, 22.78],
        [114.76, 22.67],
        [114.15, 22.22],
        [113.81, 22.55],
        [113.24, 22.05],
        [111.84, 21.55],
        [110.79, 21.4],
        [110.44, 20.34],
        [109.89, 20.28],
        [109.63, 21.01],
        [109.86, 21.4],
        [108.52, 21.72],
        [108.05, 21.55]
      ],
      [
        [108.05, 21.55],
        [107.04, 21.81],
        [106.57, 22.22],
        [106.73, 22.79],
        [105.81, 22.98],
        [105.33, 23.35],
        [104.48, 22.82],
        [103.5, 22.7],
        [102.71, 22.71],
        [102.17, 22.46]
      ],
      [
        [102.17, 22.46],
        [101.65, 22.32],
        [101.8, 21.17],
        [101.27, 21.2],
        [101.18, 21.44]
      ],
      [
        [101.18, 21.44],
        [101.15, 21.85],
        [100.42, 21.56],
        [99.98, 21.74],
        [99.24, 22.12],
        [99.53, 22.95],
        [98.9, 23.14],
        [98.66, 24.06],
        [97.6, 23.9],
        [97.72, 25.08],
        [98.67, 25.92],
        [98.71, 26.74],
        [98.68, 27.51],
        [98.25, 27.75],
        [97.91, 28.34],
        [97.33, 28.26]
      ],
      [
        [97.33, 28.26],
        [96.25, 28.41],
        [96.59, 28.83],
        [96.12, 29.45],
        [95.4, 29.03],
        [94.57, 29.28],
        [93.41, 28.64],
        [92.5, 27.9],
        [91.7, 27.77]
      ],
      [
        [88.81, 27.3],
        [88.73, 28.09],
        [88.12, 27.88]
      ],
      [
        [88.12, 27.88],
        [86.95, 27.97],
        [85.82, 28.2],
        [85.01, 28.64],
        [84.23, 28.84],
        [83.9, 29.32],
        [83.34, 29.46],
        [82.33, 30.12],
        [81.53, 30.42],
        [81.11, 30.18]
      ],
      [
        [81.11, 30.18],
        [79.72, 30.88],
        [78.74, 31.52],
        [78.46, 32.62],
        [79.18, 32.48],
        [79.21, 32.99],
        [78.81, 33.51],
        [78.91, 34.32],
        [77.84, 35.49]
      ],
      [
        [77.84, 35.49],
        [76.19, 35.9],
        [75.9, 36.67],
        [75.16, 37.13]
      ],
      [
        [74.98, 37.42],
        [74.83, 37.99],
        [74.86, 38.38],
        [74.26, 38.61],
        [73.93, 38.51],
        [73.68, 39.43]
      ],
      [
        [73.68, 39.43],
        [73.96, 39.66],
        [73.82, 39.89],
        [74.78, 40.37],
        [75.47, 40.56],
        [76.53, 40.43],
        [76.9, 41.07],
        [78.19, 41.19],
        [78.54, 41.58],
        [80.12, 42.12],
        [80.26, 42.35]
      ],
      [
        [80.26, 42.35],
        [80.18, 42.92],
        [80.87, 43.18],
        [79.97, 44.92],
        [81.95, 45.32],
        [82.46, 45.54],
        [83.18, 47.33],
        [85.16, 47],
        [85.72, 47.45],
        [85.77, 48.46],
        [86.6, 48.55],
        [87.36, 49.21]
      ],
      [
        [87.36, 49.21],
        [87.75, 49.3]
      ],
      [
        [87.75, 49.3],
        [88.01, 48.6],
        [88.85, 48.07],
        [90.28, 47.69],
        [90.97, 46.89],
        [90.59, 45.72],
        [90.95, 45.29],
        [92.13, 45.12],
        [93.48, 44.98],
        [94.69, 44.35],
        [95.31, 44.24],
        [95.76, 43.32],
        [96.35, 42.73],
        [97.45, 42.75],
        [99.52, 42.52],
        [100.85, 42.66],
        [101.83, 42.51],
        [103.31, 41.91],
        [104.52, 41.91],
        [104.96, 41.6],
        [106.13, 42.13],
        [107.74, 42.48],
        [109.24, 42.52],
        [110.41, 42.87],
        [111.13, 43.41],
        [111.83, 43.74],
        [111.67, 44.07],
        [111.35, 44.46],
        [111.87, 45.1],
        [112.44, 45.01],
        [113.46, 44.81],
        [114.46, 45.34],
        [115.99, 45.73],
        [116.72, 46.39],
        [117.42, 46.67],
        [118.87, 46.81],
        [119.66, 46.69],
        [119.77, 47.05],
        [118.87, 47.75],
        [118.06, 48.07],
        [117.3, 47.7],
        [116.31, 47.85],
        [115.74, 47.73],
        [115.49, 48.14],
        [116.19, 49.13],
        [116.68, 49.89]
      ],
      [
        [116.68, 49.89],
        [117.88, 49.51],
        [119.29, 50.14]
      ],
      [
        [119.29, 50.14],
        [119.28, 50.58],
        [120.18, 51.64],
        [120.74, 51.96],
        [120.73, 52.52]
      ],
      [
        [120.73, 52.52],
        [120.18, 52.75],
        [121, 53.25],
        [122.25, 53.43]
      ],
      [
        [122.25, 53.43],
        [123.57, 53.46],
        [125.07, 53.16]
      ],
      [
        [125.07, 53.16],
        [125.95, 52.79],
        [126.56, 51.78],
        [126.94, 51.35],
        [127.29, 50.74]
      ],
      [
        [127.29, 50.74],
        [127.66, 49.76],
        [129.4, 49.44]
      ],
      [
        [-2.86, 4.99],
        [-3.31, 4.98],
        [-4.01, 5.18],
        [-4.65, 5.17],
        [-5.83, 4.99],
        [-6.53, 4.71],
        [-7.52, 4.34],
        [-7.71, 4.36]
      ],
      [
        [-7.71, 4.36],
        [-7.64, 5.19],
        [-7.54, 5.31],
        [-7.57, 5.71],
        [-7.99, 6.13],
        [-8.31, 6.19],
        [-8.6, 6.47],
        [-8.39, 6.91],
        [-8.49, 7.4],
        [-8.44, 7.69]
      ],
      [
        [-8.44, 7.69],
        [-8.28, 7.69],
        [-8.22, 8.12],
        [-8.3, 8.32],
        [-8.2, 8.46],
        [-7.83, 8.58],
        [-8.08, 9.38],
        [-8.31, 9.79],
        [-8.23, 10.13],
        [-8.03, 10.21]
      ],
      [
        [-8.03, 10.21],
        [-7.9, 10.3],
        [-7.62, 10.15],
        [-6.85, 10.14],
        [-6.67, 10.43],
        [-6.49, 10.41],
        [-6.21, 10.52],
        [-6.05, 10.1],
        [-5.82, 10.22],
        [-5.4, 10.37]
      ],
      [
        [-2.83, 9.64],
        [-2.56, 8.22],
        [-2.98, 7.38],
        [-3.24, 6.25],
        [-2.81, 5.39],
        [-2.86, 4.99]
      ],
      [
        [13.08, 2.27],
        [12.95, 2.32],
        [12.36, 2.19],
        [11.75, 2.33],
        [11.28, 2.26]
      ],
      [
        [11.28, 2.26],
        [9.65, 2.28]
      ],
      [
        [9.65, 2.28],
        [9.8, 3.07],
        [9.4, 3.73],
        [8.95, 3.9],
        [8.74, 4.35],
        [8.49, 4.5],
        [8.5, 4.77]
      ],
      [
        [8.5, 4.77],
        [8.76, 5.48],
        [9.23, 6.44],
        [9.52, 6.45],
        [10.12, 7.04],
        [10.5, 7.06],
        [11.06, 6.64],
        [11.75, 6.98],
        [11.84, 7.4],
        [12.06, 7.8],
        [12.22, 8.31],
        [12.75, 8.72],
        [12.96, 9.42],
        [13.17, 9.64],
        [13.31, 10.16],
        [13.57, 10.8],
        [14.42, 11.57],
        [14.47, 11.9],
        [14.58, 12.09],
        [14.18, 12.48]
      ],
      [
        [14.18, 12.48],
        [14.21, 12.8],
        [14.5, 12.86]
      ],
      [
        [14.5, 12.86],
        [14.89, 12.22],
        [14.96, 11.56]
      ],
      [
        [14.96, 11.56],
        [14.92, 10.89],
        [15.47, 9.98],
        [14.91, 9.99],
        [14.63, 9.92],
        [14.17, 10.02],
        [13.95, 9.55],
        [14.54, 8.97],
        [14.98, 8.8],
        [15.12, 8.38],
        [15.44, 7.69],
        [15.28, 7.42]
      ],
      [
        [16.01, 2.27],
        [15.94, 1.73],
        [15.15, 1.96],
        [14.34, 2.23],
        [13.08, 2.27]
      ],
      [
        [31.17, 2.2],
        [30.85, 1.85],
        [30.47, 1.58],
        [30.09, 1.06],
        [29.88, 0.6]
      ],
      [
        [29.88, 0.6],
        [29.82, -0.21],
        [29.59, -0.59]
      ],
      [
        [29.59, -0.59],
        [29.58, -1.34]
      ],
      [
        [29.58, -1.34],
        [29.29, -1.62],
        [29.25, -2.22],
        [29.12, -2.29],
        [29.02, -2.84]
      ],
      [
        [29.34, -4.5],
        [29.52, -5.42],
        [29.42, -5.94]
      ],
      [
        [29.42, -5.94],
        [29.62, -6.52],
        [30.2, -7.08],
        [30.74, -8.34]
      ],
      [
        [30.74, -8.34],
        [30.35, -8.24],
        [29, -8.41],
        [28.73, -8.53],
        [28.45, -9.16],
        [28.67, -9.61],
        [28.5, -10.79],
        [28.37, -11.79],
        [28.64, -11.97],
        [29.34, -12.36],
        [29.62, -12.18],
        [29.7, -13.26],
        [28.93, -13.25],
        [28.52, -12.7],
        [28.16, -12.27],
        [27.39, -12.13],
        [27.16, -11.61],
        [26.55, -11.92],
        [25.75, -11.78],
        [25.42, -11.33],
        [24.78, -11.24],
        [24.31, -11.26],
        [24.26, -10.95],
        [23.91, -10.93]
      ],
      [
        [12.32, -6.1],
        [12.18, -5.79]
      ],
      [
        [13, -4.78],
        [13.26, -4.88],
        [13.6, -4.5],
        [14.14, -4.51],
        [14.21, -4.79],
        [14.58, -4.97],
        [15.17, -4.34],
        [15.75, -3.86],
        [16.01, -3.54],
        [15.97, -2.71],
        [16.41, -1.74],
        [16.87, -1.23],
        [17.52, -0.74],
        [17.64, -0.42],
        [17.66, -0.06],
        [17.83, 0.29],
        [17.77, 0.86],
        [17.9, 1.74],
        [18.09, 2.37],
        [18.39, 2.9],
        [18.45, 3.5]
      ],
      [
        [27.37, 5.23],
        [27.98, 4.41],
        [28.43, 4.29],
        [28.7, 4.46],
        [29.16, 4.39],
        [29.72, 4.6]
      ],
      [
        [29.72, 4.6],
        [29.95, 4.17],
        [30.83, 3.51],
        [30.77, 2.34],
        [31.17, 2.2]
      ],
      [
        [11.91, -5.04],
        [11.09, -3.98]
      ],
      [
        [11.09, -3.98],
        [11.86, -3.43],
        [11.48, -2.77],
        [11.82, -2.51],
        [12.5, -2.39],
        [12.58, -1.95],
        [13.11, -2.43],
        [13.99, -2.47],
        [14.3, -2],
        [14.43, -1.33],
        [14.32, -0.55],
        [13.84, 0.04],
        [14.28, 1.2],
        [14.03, 1.4],
        [13.28, 1.31],
        [13, 1.83],
        [13.08, 2.27]
      ],
      [
        [-75.37, -0.15],
        [-75.8, 0.08],
        [-76.29, 0.42],
        [-76.58, 0.26],
        [-77.42, 0.4],
        [-77.67, 0.83],
        [-77.86, 0.81],
        [-78.86, 1.38]
      ],
      [
        [-78.86, 1.38],
        [-78.99, 1.69],
        [-78.62, 1.77],
        [-78.66, 2.27],
        [-78.43, 2.63],
        [-77.93, 2.7],
        [-77.51, 3.33],
        [-77.13, 3.85],
        [-77.5, 4.09],
        [-77.31, 4.67],
        [-77.53, 5.58],
        [-77.32, 5.85],
        [-77.48, 6.69],
        [-77.88, 7.22]
      ],
      [
        [-77.88, 7.22],
        [-77.75, 7.71],
        [-77.43, 7.64],
        [-77.24, 7.94],
        [-77.47, 8.52],
        [-77.35, 8.67]
      ],
      [
        [-77.35, 8.67],
        [-76.84, 8.64],
        [-76.09, 9.34],
        [-75.67, 9.44],
        [-75.66, 9.77],
        [-75.48, 10.62],
        [-74.91, 11.08],
        [-74.28, 11.1],
        [-74.2, 11.31],
        [-73.41, 11.23],
        [-72.63, 11.73],
        [-72.24, 11.96],
        [-71.75, 12.44],
        [-71.4, 12.38],
        [-71.14, 12.11],
        [-71.33, 11.78]
      ],
      [
        [-71.33, 11.78],
        [-71.97, 11.61],
        [-72.23, 11.11],
        [-72.61, 10.82],
        [-72.91, 10.45],
        [-73.03, 9.74],
        [-73.3, 9.15],
        [-72.79, 9.09],
        [-72.66, 8.63],
        [-72.44, 8.41],
        [-72.36, 8],
        [-72.48, 7.63],
        [-72.44, 7.42],
        [-72.2, 7.34],
        [-71.96, 6.99],
        [-70.67, 7.09],
        [-70.09, 6.96],
        [-69.39, 6.1],
        [-68.99, 6.21],
        [-68.27, 6.15],
        [-67.7, 6.27],
        [-67.34, 6.1],
        [-67.52, 5.56],
        [-67.74, 5.22],
        [-67.82, 4.5],
        [-67.62, 3.84],
        [-67.34, 3.54],
        [-67.3, 3.32],
        [-67.81, 2.82],
        [-67.45, 2.6],
        [-67.18, 2.25],
        [-66.88, 1.25]
      ],
      [
        [-69.89, -4.3],
        [-70.39, -3.77],
        [-70.69, -3.74],
        [-70.05, -2.73],
        [-70.81, -2.26],
        [-71.41, -2.34],
        [-71.77, -2.17],
        [-72.33, -2.43],
        [-73.07, -2.31],
        [-73.66, -1.26],
        [-74.12, -1],
        [-74.44, -0.53],
        [-75.11, -0.06],
        [-75.37, -0.15]
      ],
      [
        [-82.97, 8.23],
        [-83.51, 8.45],
        [-83.71, 8.66],
        [-83.6, 8.83],
        [-83.63, 9.05],
        [-83.91, 9.29],
        [-84.3, 9.49],
        [-84.65, 9.62],
        [-84.71, 9.91],
        [-84.98, 10.09],
        [-84.91, 9.8],
        [-85.11, 9.56],
        [-85.34, 9.83],
        [-85.66, 9.93],
        [-85.8, 10.13],
        [-85.79, 10.44],
        [-85.66, 10.75],
        [-85.94, 10.9],
        [-85.71, 11.09]
      ],
      [
        [-85.71, 11.09],
        [-85.56, 11.22],
        [-84.9, 10.95],
        [-84.67, 11.08],
        [-84.36, 11],
        [-84.19, 10.79],
        [-83.9, 10.73],
        [-83.66, 10.94]
      ],
      [
        [-83.66, 10.94],
        [-83.4, 10.4],
        [-83.02, 9.99],
        [-82.55, 9.57]
      ],
      [
        [-82.55, 9.57],
        [-82.93, 9.48],
        [-82.93, 9.07],
        [-82.72, 8.93],
        [-82.87, 8.81],
        [-82.83, 8.63],
        [-82.91, 8.42],
        [-82.97, 8.23]
      ],
      [
        [-82.27, 23.19],
        [-81.4, 23.12],
        [-80.62, 23.11],
        [-79.68, 22.77],
        [-79.28, 22.4],
        [-78.35, 22.51],
        [-77.99, 22.28],
        [-77.15, 21.66],
        [-76.52, 21.21],
        [-76.19, 21.22],
        [-75.6, 21.02],
        [-75.67, 20.74],
        [-74.93, 20.69],
        [-74.18, 20.28],
        [-74.3, 20.05],
        [-74.96, 19.92],
        [-75.63, 19.87],
        [-76.32, 19.95],
        [-77.76, 19.86],
        [-77.09, 20.41],
        [-77.49, 20.67],
        [-78.14, 20.74],
        [-78.48, 21.03],
        [-78.72, 21.6],
        [-79.28, 21.56],
        [-80.22, 21.83],
        [-80.52, 22.04],
        [-81.82, 22.19],
        [-82.17, 22.39],
        [-81.8, 22.64],
        [-82.78, 22.69],
        [-83.49, 22.17],
        [-83.91, 22.15],
        [-84.05, 21.91],
        [-84.55, 21.8],
        [-84.97, 21.9],
        [-84.45, 22.2],
        [-84.23, 22.57],
        [-83.78, 22.79],
        [-83.27, 22.98],
        [-82.51, 23.08],
        [-82.27, 23.19]
      ],
      [
        [32.73, 35.14],
        [32.8, 35.15],
        [32.95, 35.39],
        [33.67, 35.37],
        [34.58, 35.67],
        [33.9, 35.25],
        [33.97, 35.06],
        [34, 34.98],
        [32.98, 34.57],
        [32.49, 34.7],
        [32.26, 35.1],
        [32.73, 35.14]
      ],
      [
        [13.6, 48.88],
        [13.03, 49.31],
        [12.52, 49.55],
        [12.42, 49.97],
        [12.24, 50.27],
        [12.97, 50.48],
        [13.34, 50.73],
        [14.06, 50.93],
        [14.31, 51.12],
        [14.57, 51],
        [15.02, 51.11]
      ],
      [
        [15.02, 51.11],
        [15.49, 50.78],
        [16.24, 50.7],
        [16.18, 50.42],
        [16.72, 50.22],
        [16.87, 50.47],
        [17.55, 50.36],
        [17.65, 50.05],
        [18.39, 49.99],
        [18.85, 49.5]
      ],
      [
        [18.85, 49.5],
        [18.55, 49.5],
        [18.4, 49.32],
        [18.17, 49.27],
        [18.1, 49.04],
        [17.91, 49],
        [17.89, 48.9],
        [17.55, 48.8],
        [17.1, 48.82],
        [16.96, 48.6]
      ],
      [
        [9.92, 54.98],
        [9.94, 54.6],
        [10.95, 54.36],
        [10.94, 54.01],
        [11.96, 54.2],
        [12.52, 54.47],
        [13.65, 54.08],
        [14.12, 53.76]
      ],
      [
        [14.12, 53.76],
        [14.35, 53.25],
        [14.07, 52.98],
        [14.44, 52.62],
        [14.69, 52.09],
        [14.61, 51.75],
        [15.02, 51.11]
      ],
      [
        [7.47, 47.62],
        [7.59, 48.33],
        [8.1, 49.02],
        [6.66, 49.2],
        [6.19, 49.46]
      ],
      [
        [6.19, 49.46],
        [6.24, 49.9],
        [6.04, 50.13]
      ],
      [
        [6.16, 50.8],
        [5.99, 51.85],
        [6.59, 51.85],
        [6.84, 52.23],
        [7.09, 53.14],
        [6.91, 53.48]
      ],
      [
        [6.91, 53.48],
        [7.1, 53.69],
        [7.94, 53.75],
        [8.12, 53.53],
        [8.8, 54.02],
        [8.57, 54.4],
        [8.53, 54.96]
      ],
      [
        [8.53, 54.96],
        [9.28, 54.83],
        [9.92, 54.98]
      ],
      [
        [43.08, 12.7],
        [43.32, 12.39],
        [43.29, 11.97],
        [42.72, 11.74],
        [43.15, 11.46]
      ],
      [
        [43.15, 11.46],
        [42.78, 10.93]
      ],
      [
        [42.78, 10.93],
        [42.55, 11.11],
        [42.31, 11.03],
        [41.76, 11.05],
        [41.74, 11.36],
        [41.66, 11.63],
        [42, 12.1],
        [42.35, 12.54]
      ],
      [
        [42.35, 12.54],
        [42.78, 12.46],
        [43.08, 12.7]
      ],
      [
        [12.69, 55.61],
        [12.09, 54.8],
        [11.04, 55.36],
        [10.9, 55.78],
        [12.37, 56.11],
        [12.69, 55.61]
      ],
      [
        [8.53, 54.96],
        [8.12, 55.52],
        [8.09, 56.54],
        [8.26, 56.81],
        [8.54, 57.11],
        [9.42, 57.17],
        [9.78, 57.45],
        [10.58, 57.73],
        [10.55, 57.22],
        [10.25, 56.89],
        [10.37, 56.61],
        [10.91, 56.46],
        [10.67, 56.08],
        [10.37, 56.19],
        [9.65, 55.47],
        [9.92, 54.98]
      ],
      [
        [-46.76, 82.63],
        [-43.41, 83.23],
        [-39.9, 83.18],
        [-38.62, 83.55],
        [-35.09, 83.65],
        [-27.1, 83.52],
        [-20.85, 82.73],
        [-22.69, 82.34],
        [-26.52, 82.3],
        [-31.9, 82.2],
        [-31.4, 82.02],
        [-27.86, 82.13],
        [-24.84, 81.79],
        [-22.9, 82.09],
        [-22.07, 81.73],
        [-23.17, 81.15],
        [-20.62, 81.52],
        [-15.77, 81.91],
        [-12.77, 81.72],
        [-12.21, 81.29],
        [-16.29, 80.58],
        [-16.85, 80.35],
        [-20.05, 80.18],
        [-17.73, 80.13],
        [-18.9, 79.4],
        [-19.7, 78.75],
        [-19.67, 77.64],
        [-18.47, 76.99],
        [-20.04, 76.94],
        [-21.68, 76.63],
        [-19.83, 76.1],
        [-19.6, 75.25],
        [-20.67, 75.16],
        [-19.37, 74.3],
        [-21.59, 74.22],
        [-20.43, 73.82],
        [-20.76, 73.46],
        [-22.17, 73.31],
        [-23.57, 73.31],
        [-22.31, 72.63],
        [-22.3, 72.18],
        [-24.28, 72.6],
        [-24.79, 72.33],
        [-23.44, 72.08],
        [-22.13, 71.47],
        [-21.75, 70.66],
        [-23.54, 70.47],
        [-24.31, 70.86],
        [-25.54, 71.43],
        [-25.2, 70.75],
        [-26.36, 70.23],
        [-23.73, 70.18],
        [-22.35, 70.13],
        [-25.03, 69.26],
        [-27.75, 68.47],
        [-30.67, 68.13],
        [-31.78, 68.12],
        [-32.81, 67.74],
        [-34.2, 66.68],
        [-36.35, 65.98],
        [-37.04, 65.94],
        [-38.38, 65.69],
        [-39.81, 65.46],
        [-40.67, 64.84],
        [-40.68, 64.14],
        [-41.19, 63.48],
        [-42.82, 62.68],
        [-42.42, 61.9],
        [-42.87, 61.07],
        [-43.38, 60.1],
        [-44.79, 60.04],
        [-46.26, 60.85],
        [-48.26, 60.86],
        [-49.23, 61.41],
        [-49.9, 62.38],
        [-51.63, 63.63],
        [-52.14, 64.28],
        [-52.28, 65.18],
        [-53.66, 66.1],
        [-53.3, 66.84],
        [-53.97, 67.19],
        [-52.98, 68.36],
        [-51.48, 68.73],
        [-51.08, 69.15],
        [-50.87, 69.93],
        [-52.01, 69.57],
        [-52.56, 69.43],
        [-53.46, 69.28],
        [-54.68, 69.61],
        [-54.75, 70.29],
        [-54.36, 70.82],
        [-53.43, 70.84],
        [-51.39, 70.57],
        [-53.11, 71.2],
        [-54, 71.55],
        [-55, 71.41],
        [-55.83, 71.65],
        [-54.72, 72.59],
        [-55.33, 72.96],
        [-56.12, 73.65],
        [-57.32, 74.71],
        [-58.6, 75.1],
        [-58.59, 75.52],
        [-61.27, 76.1],
        [-63.39, 76.18],
        [-66.06, 76.13],
        [-68.5, 76.06],
        [-69.66, 76.38],
        [-71.4, 77.01],
        [-68.78, 77.32],
        [-66.76, 77.38],
        [-71.04, 77.64],
        [-73.3, 78.04],
        [-73.16, 78.43],
        [-69.37, 78.91],
        [-65.71, 79.39],
        [-65.32, 79.76],
        [-68.02, 80.12],
        [-67.15, 80.52],
        [-63.69, 81.21],
        [-62.23, 81.32],
        [-62.65, 81.77],
        [-60.28, 82.03],
        [-57.21, 82.19],
        [-54.13, 82.2],
        [-53.04, 81.89],
        [-50.39, 82.44],
        [-48, 82.06],
        [-46.6, 81.99],
        [-44.52, 81.66],
        [-46.9, 82.2],
        [-46.76, 82.63]
      ],
      [
        [-71.71, 19.71],
        [-71.59, 19.88],
        [-70.81, 19.88],
        [-70.21, 19.62],
        [-69.95, 19.65],
        [-69.77, 19.29],
        [-69.22, 19.31],
        [-69.25, 19.02],
        [-68.81, 18.98],
        [-68.32, 18.61],
        [-68.69, 18.21],
        [-69.16, 18.42],
        [-69.62, 18.38],
        [-69.95, 18.43],
        [-70.13, 18.25],
        [-70.52, 18.18],
        [-70.67, 18.43],
        [-71, 18.28],
        [-71.4, 17.6],
        [-71.66, 17.76],
        [-71.71, 18.04]
      ],
      [
        [-71.71, 18.04],
        [-71.69, 18.32],
        [-71.95, 18.62],
        [-71.7, 18.79],
        [-71.62, 19.17],
        [-71.71, 19.71]
      ],
      [
        [12, 23.47],
        [8.57, 21.57],
        [5.68, 19.6],
        [4.27, 19.16]
      ],
      [
        [4.27, 19.16],
        [3.16, 19.06],
        [3.15, 19.69],
        [2.68, 19.86],
        [2.06, 20.14],
        [1.82, 20.61],
        [-1.55, 22.79],
        [-4.92, 24.97]
      ],
      [
        [-4.92, 24.97],
        [-8.68, 27.4]
      ],
      [
        [-8.68, 27.4],
        [-8.67, 27.59],
        [-8.67, 27.6]
      ],
      [
        [-8.67, 27.6],
        [-8.67, 28.84],
        [-7.06, 29.58],
        [-6.06, 29.73],
        [-5.24, 30],
        [-4.86, 30.5],
        [-3.69, 30.9],
        [-3.65, 31.64],
        [-3.07, 31.72],
        [-2.62, 32.09],
        [-1.31, 32.26],
        [-1.12, 32.65],
        [-1.39, 32.86],
        [-1.73, 33.92],
        [-1.79, 34.53],
        [-2.17, 35.17]
      ],
      [
        [-2.17, 35.17],
        [-1.21, 35.71],
        [-0.13, 35.89],
        [0.5, 36.3],
        [1.47, 36.61],
        [3.16, 36.78],
        [4.82, 36.87],
        [5.32, 36.72],
        [6.26, 37.11],
        [7.33, 37.12],
        [7.74, 36.89],
        [8.42, 36.95]
      ],
      [
        [8.42, 36.95],
        [8.22, 36.43],
        [8.38, 35.48],
        [8.14, 34.66],
        [7.52, 34.1],
        [7.61, 33.34],
        [8.43, 32.75],
        [8.44, 32.51],
        [9.06, 32.1],
        [9.48, 30.31]
      ],
      [
        [9.48, 30.31],
        [9.81, 29.42],
        [9.86, 28.96],
        [9.68, 28.14],
        [9.76, 27.69],
        [9.63, 27.14],
        [9.72, 26.51],
        [9.32, 26.09],
        [9.91, 25.37],
        [9.95, 24.94],
        [10.3, 24.38],
        [10.77, 24.56],
        [11.56, 24.1],
        [12, 23.47]
      ],
      [
        [-80.3, -3.4],
        [-79.77, -2.66],
        [-79.99, -2.22],
        [-80.37, -2.69],
        [-80.97, -2.25],
        [-80.76, -1.97],
        [-80.93, -1.06],
        [-80.58, -0.91],
        [-80.4, -0.28],
        [-80.02, 0.36],
        [-80.09, 0.77],
        [-79.54, 0.98],
        [-78.86, 1.38]
      ],
      [
        [-75.37, -0.15],
        [-75.23, -0.91],
        [-75.54, -1.56],
        [-76.64, -2.61],
        [-77.84, -3],
        [-78.45, -3.87],
        [-78.64, -4.55],
        [-79.21, -4.96],
        [-79.62, -4.45],
        [-80.03, -4.35],
        [-80.44, -4.43],
        [-80.47, -4.06],
        [-80.18, -3.82],
        [-80.3, -3.4]
      ],
      [
        [36.87, 22],
        [32.9, 22],
        [29.02, 22],
        [25, 22]
      ],
      [
        [25, 22],
        [25, 25.68],
        [25, 29.24],
        [24.7, 30.04],
        [24.96, 30.66],
        [24.8, 31.09],
        [25.16, 31.57]
      ],
      [
        [25.16, 31.57],
        [26.5, 31.59],
        [27.46, 31.32],
        [28.45, 31.03],
        [28.91, 30.87],
        [29.68, 31.19],
        [30.1, 31.47],
        [30.98, 31.56],
        [31.69, 31.43],
        [31.96, 30.93],
        [32.19, 31.26],
        [32.99, 31.02],
        [33.77, 30.97],
        [34.27, 31.22],
        [34.92, 29.5],
        [34.64, 29.1],
        [34.43, 28.34],
        [34.15, 27.82],
        [33.92, 27.65],
        [33.59, 27.97],
        [33.14, 28.42],
        [32.42, 29.85],
        [32.32, 29.76],
        [32.73, 28.71],
        [33.35, 27.7],
        [34.1, 26.14],
        [34.47, 25.6],
        [34.8, 25.03],
        [35.69, 23.93],
        [35.49, 23.75],
        [35.53, 23.1],
        [36.69, 22.2],
        [36.87, 22]
      ],
      [
        [42.35, 12.54],
        [42.01, 12.87],
        [41.6, 13.45]
      ],
      [
        [41.6, 13.45],
        [41.16, 13.77],
        [40.9, 14.12]
      ],
      [
        [40.9, 14.12],
        [40.03, 14.52],
        [39.34, 14.53]
      ],
      [
        [39.34, 14.53],
        [39.1, 14.74],
        [38.51, 14.51],
        [37.91, 14.96],
        [37.59, 14.21],
        [36.43, 14.42]
      ],
      [
        [36.43, 14.42],
        [36.32, 14.82],
        [36.75, 16.29],
        [36.85, 16.96]
      ],
      [
        [36.85, 16.96],
        [37.17, 17.26],
        [37.9, 17.43],
        [38.41, 18]
      ],
      [
        [38.41, 18],
        [38.99, 16.84],
        [39.27, 15.92],
        [39.81, 15.44],
        [41.18, 14.49],
        [41.73, 13.92],
        [42.28, 13.34],
        [42.59, 13],
        [43.08, 12.7]
      ],
      [
        [-9.03, 41.88],
        [-8.98, 42.59],
        [-9.39, 43.03],
        [-7.98, 43.75],
        [-6.75, 43.57],
        [-5.41, 43.57],
        [-4.35, 43.4],
        [-3.52, 43.46],
        [-1.9, 43.42]
      ],
      [
        [-1.9, 43.42],
        [-1.5, 43.03],
        [0.34, 42.58],
        [0.7, 42.8],
        [1.83, 42.34],
        [2.99, 42.47]
      ],
      [
        [2.99, 42.47],
        [3.04, 41.89],
        [2.09, 41.23],
        [0.81, 41.01],
        [0.72, 40.68],
        [0.11, 40.12],
        [-0.28, 39.31],
        [0.11, 38.74],
        [-0.47, 38.29],
        [-0.68, 37.64],
        [-1.44, 37.44],
        [-2.15, 36.67],
        [-3.42, 36.66],
        [-4.37, 36.68],
        [-5, 36.32],
        [-5.38, 35.95],
        [-5.87, 36.03],
        [-6.24, 36.37],
        [-6.52, 36.94],
        [-7.45, 37.1]
      ],
      [
        [-7.45, 37.1],
        [-7.54, 37.43],
        [-7.17, 37.8],
        [-7.03, 38.08],
        [-7.37, 38.37],
        [-7.1, 39.03],
        [-7.5, 39.63],
        [-7.07, 39.71],
        [-7.03, 40.18],
        [-6.86, 40.33],
        [-6.85, 41.11],
        [-6.39, 41.38],
        [-6.67, 41.88],
        [-7.25, 41.92],
        [-7.42, 41.79],
        [-8.01, 41.79],
        [-8.26, 42.28],
        [-8.67, 42.13],
        [-9.03, 41.88]
      ],
      [
        [24.31, 57.79],
        [24.43, 58.38],
        [24.06, 58.26],
        [23.43, 58.61],
        [23.34, 59.19],
        [24.6, 59.47],
        [25.86, 59.61],
        [26.95, 59.45],
        [27.98, 59.48],
        [28.13, 59.3]
      ],
      [
        [28.13, 59.3],
        [27.42, 58.72],
        [27.72, 57.79]
      ],
      [
        [27.72, 57.79],
        [27.29, 57.47]
      ],
      [
        [27.29, 57.47],
        [26.46, 57.48],
        [25.6, 57.85],
        [25.16, 57.97],
        [24.31, 57.79]
      ],
      [
        [39.34, 14.53],
        [40.03, 14.52],
        [40.9, 14.12]
      ],
      [
        [40.9, 14.12],
        [41.16, 13.77],
        [41.6, 13.45]
      ],
      [
        [42.78, 10.93],
        [42.56, 10.57],
        [42.93, 10.02]
      ],
      [
        [42.93, 10.02],
        [43.3, 9.54],
        [43.68, 9.18]
      ],
      [
        [43.68, 9.18],
        [46.95, 8],
        [47.79, 8]
      ],
      [
        [47.79, 8],
        [44.96, 5],
        [43.66, 4.96],
        [42.77, 4.25],
        [42.13, 4.23],
        [41.86, 3.92]
      ],
      [
        [41.86, 3.92],
        [41.17, 3.92],
        [40.77, 4.26],
        [39.85, 3.84],
        [39.56, 3.42],
        [38.89, 3.5],
        [38.67, 3.62],
        [38.44, 3.59],
        [38.12, 3.6],
        [36.86, 4.45],
        [36.16, 4.45],
        [35.82, 4.78],
        [35.82, 5.34],
        [35.3, 5.51]
      ],
      [
        [35.3, 5.51],
        [34.71, 6.59],
        [34.25, 6.83],
        [34.08, 7.23],
        [33.57, 7.71],
        [32.95, 7.78],
        [33.29, 8.35],
        [33.83, 8.38],
        [33.97, 8.68]
      ],
      [
        [33.97, 8.68],
        [33.96, 9.58]
      ],
      [
        [33.96, 9.58],
        [34.26, 10.63],
        [34.73, 10.91],
        [34.83, 11.32],
        [35.26, 12.08],
        [35.86, 12.58],
        [36.27, 13.56],
        [36.43, 14.42]
      ],
      [
        [28.59, 69.06],
        [28.45, 68.36],
        [29.98, 67.7],
        [29.05, 66.94],
        [30.22, 65.81],
        [29.54, 64.95],
        [30.44, 64.2],
        [30.04, 63.55],
        [31.52, 62.87],
        [31.14, 62.36],
        [30.21, 61.78]
      ],
      [
        [30.21, 61.78],
        [28.07, 60.5],
        [26.26, 60.42],
        [24.5, 60.06],
        [22.87, 59.85],
        [22.29, 60.39],
        [21.32, 60.72],
        [21.54, 61.71],
        [21.06, 62.61],
        [21.54, 63.19],
        [22.44, 63.82],
        [24.73, 64.9],
        [25.4, 65.11],
        [25.29, 65.53],
        [23.9, 66.01]
      ],
      [
        [23.9, 66.01],
        [23.57, 66.4],
        [23.54, 67.94],
        [21.98, 68.62],
        [20.65, 69.11]
      ],
      [
        [20.65, 69.11],
        [21.24, 69.37],
        [22.36, 68.84],
        [23.66, 68.89],
        [24.74, 68.65],
        [25.69, 69.09],
        [26.18, 69.83],
        [27.73, 70.16],
        [29.02, 69.77],
        [28.59, 69.06]
      ],
      [
        [178.37, -17.34],
        [178.72, -17.63],
        [178.55, -18.15],
        [177.93, -18.29],
        [177.38, -18.16],
        [177.29, -17.72],
        [177.67, -17.38],
        [178.13, -17.5],
        [178.37, -17.34]
      ],
      [
        [179.36, -16.8],
        [178.73, -17.01],
        [178.6, -16.64],
        [179.1, -16.43],
        [179.41, -16.38],
        [180, -16.07],
        [180, -16.56],
        [179.36, -16.8]
      ],
      [
        [-179.92, -16.5],
        [-180, -16.56],
        [-180, -16.07],
        [-179.79, -16.02],
        [-179.92, -16.5]
      ],
      [
        [9.56, 42.15],
        [9.23, 41.38],
        [8.78, 41.58],
        [8.54, 42.26],
        [8.75, 42.63],
        [9.39, 43.01],
        [9.56, 42.15]
      ],
      [
        [5.67, 49.53],
        [5.9, 49.44],
        [6.19, 49.46]
      ],
      [
        [6.84, 45.99],
        [6.8, 45.71],
        [7.1, 45.33],
        [6.75, 45.03],
        [7.01, 44.25],
        [7.55, 44.13],
        [7.44, 43.69]
      ],
      [
        [7.44, 43.69],
        [6.53, 43.13],
        [4.56, 43.4],
        [3.1, 43.08],
        [2.99, 42.47]
      ],
      [
        [-1.9, 43.42],
        [-1.38, 44.02],
        [-1.19, 46.01],
        [-2.23, 47.06],
        [-2.96, 47.57],
        [-4.49, 47.95],
        [-4.59, 48.68],
        [-3.3, 48.9],
        [-1.62, 48.64],
        [-1.93, 49.78],
        [-0.99, 49.35],
        [1.34, 50.13],
        [1.64, 50.95],
        [2.51, 51.15]
      ],
      [
        [-54.52, 2.31],
        [-54.27, 2.74],
        [-54.18, 3.19],
        [-54.01, 3.62],
        [-54.4, 4.21]
      ],
      [
        [-54.4, 4.21],
        [-54.48, 4.9],
        [-53.96, 5.76]
      ],
      [
        [-53.96, 5.76],
        [-53.62, 5.65],
        [-52.88, 5.41],
        [-51.82, 4.57],
        [-51.66, 4.16]
      ],
      [
        [11.09, -3.98],
        [10.07, -2.97],
        [9.41, -2.14],
        [8.8, -1.11],
        [8.83, -0.78],
        [9.05, -0.46],
        [9.29, 0.27],
        [9.49, 1.01]
      ],
      [
        [9.49, 1.01],
        [9.83, 1.07],
        [11.29, 1.06],
        [11.28, 2.26]
      ],
      [
        [-6.2, 53.87],
        [-6.95, 54.07],
        [-7.57, 54.06],
        [-7.37, 54.6],
        [-7.57, 55.13]
      ],
      [
        [-7.57, 55.13],
        [-6.73, 55.17],
        [-5.66, 54.55],
        [-6.2, 53.87]
      ],
      [
        [-3.01, 58.64],
        [-4.07, 57.55],
        [-3.06, 57.69],
        [-1.96, 57.68],
        [-2.22, 56.87],
        [-3.12, 55.97],
        [-2.09, 55.91],
        [-2.01, 55.8],
        [-1.11, 54.62],
        [-0.43, 54.46],
        [0.18, 53.33],
        [0.47, 52.93],
        [1.68, 52.74],
        [1.56, 52.1],
        [1.05, 51.81],
        [1.45, 51.29],
        [0.55, 50.77],
        [-0.79, 50.77],
        [-2.49, 50.5],
        [-2.96, 50.7],
        [-3.62, 50.23],
        [-4.54, 50.34],
        [-5.25, 49.96],
        [-5.78, 50.16],
        [-4.31, 51.21],
        [-3.41, 51.43],
        [-3.42, 51.43],
        [-4.98, 51.59],
        [-5.27, 51.99],
        [-4.22, 52.3],
        [-4.77, 52.84],
        [-4.58, 53.5],
        [-3.09, 53.4],
        [-3.09, 53.4],
        [-2.95, 53.99],
        [-3.61, 54.6],
        [-3.63, 54.62],
        [-4.84, 54.79],
        [-5.08, 55.06],
        [-4.72, 55.51],
        [-5.05, 55.78],
        [-5.59, 55.31],
        [-5.64, 56.28],
        [-6.15, 56.79],
        [-5.79, 57.82],
        [-5.01, 58.63],
        [-4.21, 58.55],
        [-3.01, 58.64]
      ],
      [
        [41.55, 41.54],
        [41.7, 41.96],
        [41.45, 42.65],
        [40.88, 43.01],
        [40.32, 43.13],
        [39.96, 43.43]
      ],
      [
        [39.96, 43.43],
        [40.08, 43.55]
      ],
      [
        [40.08, 43.55],
        [40.92, 43.38],
        [42.39, 43.22],
        [43.76, 42.74],
        [43.93, 42.55],
        [44.54, 42.71]
      ],
      [
        [44.54, 42.71],
        [45.47, 42.5]
      ],
      [
        [45.47, 42.5],
        [45.78, 42.09],
        [46.4, 41.86]
      ],
      [
        [43.58, 41.09],
        [42.62, 41.58],
        [41.55, 41.54]
      ],
      [
        [1.06, 5.93],
        [-0.51, 5.34],
        [-1.06, 5],
        [-1.96, 4.71],
        [-2.86, 4.99]
      ],
      [
        [0.02, 11.02],
        [-0.05, 10.71],
        [0.37, 10.19],
        [0.37, 9.47],
        [0.46, 8.68],
        [0.71, 8.31],
        [0.49, 7.41],
        [0.57, 6.91],
        [0.84, 6.28],
        [1.06, 5.93]
      ],
      [
        [-8.44, 7.69],
        [-8.72, 7.71],
        [-8.93, 7.31],
        [-9.21, 7.31],
        [-9.4, 7.53],
        [-9.34, 7.93],
        [-9.76, 8.54],
        [-10.02, 8.43],
        [-10.23, 8.41]
      ],
      [
        [-10.23, 8.41],
        [-10.51, 8.35],
        [-10.49, 8.72],
        [-10.65, 8.98],
        [-10.62, 9.27],
        [-10.84, 9.69],
        [-11.12, 10.05],
        [-11.92, 10.05],
        [-12.15, 9.86],
        [-12.43, 9.84],
        [-12.6, 9.62],
        [-12.71, 9.34],
        [-13.25, 8.9]
      ],
      [
        [-13.25, 8.9],
        [-13.69, 9.49],
        [-14.07, 9.89],
        [-14.33, 10.02],
        [-14.58, 10.21],
        [-14.69, 10.66],
        [-14.84, 10.88],
        [-15.13, 11.04]
      ],
      [
        [-15.13, 11.04],
        [-14.69, 11.53],
        [-14.38, 11.51],
        [-14.12, 11.68],
        [-13.9, 11.68],
        [-13.74, 11.81],
        [-13.83, 12.14],
        [-13.72, 12.25],
        [-13.7, 12.59]
      ],
      [
        [-13.7, 12.59],
        [-13.22, 12.58],
        [-12.5, 12.33],
        [-12.28, 12.35],
        [-12.2, 12.47],
        [-11.66, 12.39],
        [-11.51, 12.44]
      ],
      [
        [-11.51, 12.44],
        [-11.46, 12.08],
        [-11.3, 12.08],
        [-11.04, 12.21],
        [-10.87, 12.18],
        [-10.59, 11.92],
        [-10.17, 11.84],
        [-9.89, 12.06],
        [-9.57, 12.19],
        [-9.33, 12.33],
        [-9.13, 12.31],
        [-8.91, 12.09],
        [-8.79, 11.81],
        [-8.38, 11.39],
        [-8.58, 11.14],
        [-8.62, 10.81],
        [-8.41, 10.91],
        [-8.28, 10.79],
        [-8.34, 10.49],
        [-8.03, 10.21]
      ],
      [
        [-16.84, 13.15],
        [-16.71, 13.59]
      ],
      [
        [-16.71, 13.59],
        [-15.62, 13.62],
        [-15.4, 13.86],
        [-15.08, 13.88],
        [-14.69, 13.63],
        [-14.38, 13.63],
        [-14.05, 13.79],
        [-13.84, 13.51],
        [-14.28, 13.28],
        [-14.71, 13.3],
        [-15.14, 13.51],
        [-15.51, 13.28],
        [-15.69, 13.27],
        [-15.93, 13.13],
        [-16.84, 13.15]
      ],
      [
        [-15.13, 11.04],
        [-15.66, 11.46],
        [-16.09, 11.52],
        [-16.31, 11.81],
        [-16.31, 11.96],
        [-16.61, 12.17],
        [-16.68, 12.38]
      ],
      [
        [-16.68, 12.38],
        [-16.15, 12.55],
        [-15.82, 12.52],
        [-15.55, 12.63],
        [-13.7, 12.59]
      ],
      [
        [9.49, 1.01],
        [9.31, 1.16],
        [9.65, 2.28]
      ],
      [
        [23.7, 35.71],
        [24.25, 35.37],
        [25.03, 35.42],
        [25.77, 35.35],
        [25.75, 35.18],
        [26.29, 35.3],
        [26.16, 35],
        [24.72, 34.92],
        [24.74, 35.08],
        [23.51, 35.28],
        [23.7, 35.71]
      ],
      [
        [26.06, 40.82],
        [25.45, 40.85],
        [24.93, 40.95],
        [23.71, 40.69],
        [24.41, 40.12],
        [23.9, 39.96],
        [23.34, 39.96],
        [22.81, 40.48],
        [22.63, 40.26],
        [22.85, 39.66],
        [23.35, 39.19],
        [22.97, 38.97],
        [23.53, 38.51],
        [24.03, 38.22],
        [24.04, 37.66],
        [23.12, 37.92],
        [23.41, 37.41],
        [22.77, 37.31],
        [23.15, 36.42],
        [22.49, 36.41],
        [21.67, 36.84],
        [21.3, 37.64],
        [21.12, 38.31],
        [20.73, 38.77],
        [20.22, 39.34],
        [20.15, 39.62]
      ],
      [
        [21.02, 40.84],
        [21.67, 40.93],
        [22.06, 41.15],
        [22.6, 41.13],
        [22.76, 41.3],
        [22.95, 41.34]
      ],
      [
        [26.12, 41.83],
        [26.6, 41.56],
        [26.29, 40.94],
        [26.06, 40.82]
      ],
      [
        [-90.1, 13.74],
        [-90.61, 13.91],
        [-91.23, 13.93],
        [-91.69, 14.13],
        [-92.23, 14.54]
      ],
      [
        [-92.23, 14.54],
        [-92.2, 14.83],
        [-92.09, 15.06],
        [-92.23, 15.25],
        [-91.75, 16.07],
        [-90.46, 16.07],
        [-90.44, 16.41],
        [-90.6, 16.47],
        [-90.71, 16.69],
        [-91.08, 16.92],
        [-91.45, 17.25],
        [-91, 17.25],
        [-91, 17.82],
        [-90.07, 17.82],
        [-89.14, 17.81]
      ],
      [
        [-88.93, 15.89],
        [-88.6, 15.71],
        [-88.52, 15.86],
        [-88.23, 15.73]
      ],
      [
        [-88.23, 15.73],
        [-88.68, 15.35],
        [-89.15, 15.07],
        [-89.23, 14.87],
        [-89.15, 14.68],
        [-89.35, 14.42]
      ],
      [
        [-89.35, 14.42],
        [-89.59, 14.36],
        [-89.53, 14.24],
        [-89.72, 14.13],
        [-90.06, 13.88],
        [-90.1, 13.74]
      ],
      [
        [-59.76, 8.37],
        [-59.1, 8],
        [-58.48, 7.35],
        [-58.45, 6.83],
        [-58.08, 6.81],
        [-57.54, 6.32],
        [-57.15, 5.97]
      ],
      [
        [-57.15, 5.97],
        [-57.31, 5.07],
        [-57.91, 4.81],
        [-57.86, 4.58],
        [-58.04, 4.06],
        [-57.6, 3.33],
        [-57.28, 3.33],
        [-57.15, 2.77],
        [-56.54, 1.9]
      ],
      [
        [-60.73, 5.2],
        [-61.41, 5.96],
        [-61.14, 6.23],
        [-61.16, 6.7],
        [-60.54, 6.86],
        [-60.3, 7.04],
        [-60.64, 7.42],
        [-60.55, 7.78],
        [-59.76, 8.37]
      ],
      [
        [-87.32, 12.98],
        [-87.49, 13.3],
        [-87.79, 13.38]
      ],
      [
        [-87.79, 13.38],
        [-87.72, 13.79],
        [-87.86, 13.89],
        [-88.07, 13.96],
        [-88.5, 13.85],
        [-88.54, 13.98],
        [-88.84, 14.14],
        [-89.06, 14.34],
        [-89.35, 14.42]
      ],
      [
        [-88.23, 15.73],
        [-88.12, 15.69],
        [-87.9, 15.86],
        [-87.62, 15.88],
        [-87.52, 15.8],
        [-87.37, 15.85],
        [-86.9, 15.76],
        [-86.44, 15.78],
        [-86.12, 15.89],
        [-86, 16.01],
        [-85.68, 15.95],
        [-85.44, 15.89],
        [-85.18, 15.91],
        [-84.98, 16],
        [-84.53, 15.86],
        [-84.37, 15.84],
        [-84.06, 15.65],
        [-83.77, 15.42],
        [-83.41, 15.27],
        [-83.15, 15]
      ],
      [
        [-83.15, 15],
        [-83.49, 15.02],
        [-83.63, 14.88],
        [-83.98, 14.75],
        [-84.23, 14.75],
        [-84.45, 14.62],
        [-84.65, 14.67],
        [-84.82, 14.82],
        [-84.92, 14.79],
        [-85.05, 14.55],
        [-85.15, 14.56],
        [-85.17, 14.35],
        [-85.51, 14.08],
        [-85.7, 13.96],
        [-85.8, 13.84],
        [-86.1, 14.04],
        [-86.31, 13.77],
        [-86.52, 13.78],
        [-86.76, 13.75],
        [-86.73, 13.26],
        [-86.88, 13.25],
        [-87.01, 13.03],
        [-87.32, 12.98]
      ],
      [
        [18.83, 45.91],
        [19.07, 45.52]
      ],
      [
        [19.07, 45.52],
        [19.39, 45.24]
      ],
      [
        [19.39, 45.24],
        [19.01, 44.86]
      ],
      [
        [18.56, 42.65],
        [18.45, 42.48],
        [17.51, 42.85],
        [16.93, 43.21],
        [16.02, 43.51],
        [15.17, 44.24],
        [15.38, 44.32],
        [14.92, 44.74],
        [14.9, 45.08],
        [14.26, 45.23],
        [13.95, 44.8],
        [13.66, 45.14],
        [13.68, 45.48],
        [13.72, 45.5]
      ],
      [
        [13.72, 45.5],
        [14.41, 45.47],
        [14.6, 45.63],
        [14.94, 45.47],
        [15.33, 45.45],
        [15.32, 45.73],
        [15.67, 45.83],
        [15.77, 46.24],
        [16.56, 46.5]
      ],
      [
        [16.56, 46.5],
        [16.88, 46.38],
        [17.63, 45.95],
        [18.46, 45.76],
        [18.83, 45.91]
      ],
      [
        [-71.71, 18.04],
        [-72.37, 18.21],
        [-72.84, 18.15],
        [-73.45, 18.22],
        [-73.92, 18.03],
        [-74.46, 18.34],
        [-74.37, 18.66],
        [-73.45, 18.53],
        [-72.69, 18.45],
        [-72.33, 18.67],
        [-72.79, 19.1],
        [-72.78, 19.48],
        [-73.42, 19.64],
        [-73.19, 19.92],
        [-72.58, 19.87],
        [-71.71, 19.71]
      ],
      [
        [16.98, 48.12],
        [17.49, 47.87],
        [17.86, 47.76],
        [18.7, 47.88],
        [18.78, 48.08],
        [19.17, 48.11],
        [19.66, 48.27],
        [19.77, 48.2],
        [20.24, 48.33],
        [20.47, 48.56],
        [20.8, 48.62],
        [21.87, 48.32],
        [22.09, 48.42]
      ],
      [
        [22.09, 48.42],
        [22.64, 48.15],
        [22.71, 47.88]
      ],
      [
        [22.71, 47.88],
        [22.1, 47.67],
        [21.63, 46.99],
        [21.02, 46.32],
        [20.22, 46.13]
      ],
      [
        [20.22, 46.13],
        [19.6, 46.17]
      ],
      [
        [19.6, 46.17],
        [18.83, 45.91]
      ],
      [
        [16.56, 46.5],
        [16.37, 46.84],
        [16.2, 46.85]
      ],
      [
        [120.72, -10.24],
        [120.3, -10.26],
        [118.97, -9.56],
        [119.9, -9.36],
        [120.43, -9.67],
        [120.78, -9.97],
        [120.72, -10.24]
      ],
      [
        [124.97, -8.89],
        [125.07, -9.09],
        [125.09, -9.39]
      ],
      [
        [125.09, -9.39],
        [124.44, -10.14],
        [123.58, -10.36],
        [123.46, -10.24],
        [123.55, -9.9],
        [123.98, -9.29],
        [124.97, -8.89]
      ],
      [
        [117.9, -8.1],
        [118.26, -8.36],
        [118.88, -8.28],
        [119.13, -8.71],
        [117.97, -8.91],
        [117.28, -9.04],
        [116.74, -9.03],
        [117.08, -8.46],
        [117.63, -8.45],
        [117.9, -8.1]
      ],
      [
        [122.9, -8.09],
        [122.76, -8.65],
        [121.25, -8.93],
        [119.92, -8.81],
        [119.92, -8.44],
        [120.72, -8.24],
        [121.34, -8.54],
        [122.01, -8.46],
        [122.9, -8.09]
      ],
      [
        [108.62, -6.78],
        [110.54, -6.88],
        [110.76, -6.47],
        [112.61, -6.95],
        [112.98, -7.59],
        [114.48, -7.78],
        [115.71, -8.37],
        [114.56, -8.75],
        [113.46, -8.35],
        [112.56, -8.38],
        [111.52, -8.3],
        [110.59, -8.12],
        [109.43, -7.74],
        [108.69, -7.64],
        [108.28, -7.77],
        [106.45, -7.35],
        [106.28, -6.92],
        [105.37, -6.85],
        [106.05, -5.9],
        [107.27, -5.95],
        [108.07, -6.35],
        [108.49, -6.42],
        [108.62, -6.78]
      ],
      [
        [134.72, -6.21],
        [134.21, -6.9],
        [134.11, -6.14],
        [134.29, -5.78],
        [134.5, -5.45],
        [134.73, -5.74],
        [134.72, -6.21]
      ],
      [
        [127.25, -3.46],
        [126.87, -3.79],
        [126.18, -3.61],
        [125.99, -3.18],
        [127, -3.13],
        [127.25, -3.46]
      ],
      [
        [130.47, -3.09],
        [130.83, -3.86],
        [129.99, -3.45],
        [129.16, -3.36],
        [128.59, -3.43],
        [127.9, -3.39],
        [128.14, -2.84],
        [129.37, -2.8],
        [130.47, -3.09]
      ],
      [
        [141, -2.6],
        [141.02, -5.86],
        [141.03, -9.12]
      ],
      [
        [141.03, -9.12],
        [140.14, -8.3],
        [139.13, -8.1],
        [138.88, -8.38],
        [137.61, -8.41],
        [138.04, -7.6],
        [138.67, -7.32],
        [138.41, -6.23],
        [137.93, -5.39],
        [135.99, -4.55],
        [135.16, -4.46],
        [133.66, -3.54],
        [133.37, -4.02],
        [132.98, -4.11],
        [132.76, -3.75],
        [132.75, -3.31],
        [131.99, -2.82],
        [133.07, -2.46],
        [133.78, -2.48],
        [133.7, -2.21],
        [132.23, -2.21],
        [131.84, -1.62],
        [130.94, -1.43],
        [130.52, -0.94],
        [131.87, -0.7],
        [132.38, -0.37],
        [133.99, -0.78],
        [134.14, -1.15],
        [134.42, -2.77],
        [135.46, -3.37],
        [136.29, -2.31],
        [137.44, -1.7],
        [138.33, -1.7],
        [139.18, -2.05],
        [139.93, -2.41],
        [141, -2.6]
      ],
      [
        [125.24, 1.42],
        [124.44, 0.43],
        [123.69, 0.24],
        [122.72, 0.43],
        [121.06, 0.38],
        [120.18, 0.24],
        [120.04, -0.52],
        [120.94, -1.41],
        [121.48, -0.96],
        [123.34, -0.62],
        [123.26, -1.08],
        [122.82, -0.93],
        [122.39, -1.52],
        [121.51, -1.9],
        [122.45, -3.19],
        [122.27, -3.53],
        [123.17, -4.68],
        [123.16, -5.34],
        [122.63, -5.63],
        [122.24, -5.28],
        [122.72, -4.46],
        [121.74, -4.85],
        [121.49, -4.57],
        [121.62, -4.19],
        [120.9, -3.6],
        [120.97, -2.63],
        [120.31, -2.93],
        [120.39, -4.1],
        [120.43, -5.53],
        [119.8, -5.67],
        [119.37, -5.38],
        [119.65, -4.46],
        [119.5, -3.49],
        [119.08, -3.49],
        [118.77, -2.8],
        [119.18, -2.15],
        [119.32, -1.35],
        [119.83, 0.15],
        [120.04, 0.57],
        [120.89, 1.31],
        [121.67, 1.01],
        [122.93, 0.88],
        [124.08, 0.92],
        [125.07, 1.64],
        [125.24, 1.42]
      ],
      [
        [128.69, 1.13],
        [128.64, 0.26],
        [128.12, 0.36],
        [127.97, -0.25],
        [128.38, -0.78],
        [128.1, -0.9],
        [127.7, -0.27],
        [127.4, 1.01],
        [127.6, 1.81],
        [127.93, 2.17],
        [128, 1.63],
        [128.59, 1.54],
        [128.69, 1.13]
      ],
      [
        [109.66, 2.01],
        [109.83, 1.34],
        [110.51, 0.77],
        [111.16, 0.98],
        [111.8, 0.9],
        [112.38, 1.41],
        [112.86, 1.5],
        [113.81, 1.22],
        [114.62, 1.43],
        [115.13, 2.82],
        [115.52, 3.17],
        [115.87, 4.31],
        [117.02, 4.31],
        [117.88, 4.14]
      ],
      [
        [117.88, 4.14],
        [117.31, 3.23],
        [118.05, 2.29],
        [117.88, 1.83],
        [119, 0.9],
        [117.81, 0.78],
        [117.48, 0.1],
        [117.52, -0.8],
        [116.56, -1.49],
        [116.53, -2.48],
        [116.15, -4.01],
        [116, -3.66],
        [114.86, -4.11],
        [114.47, -3.5],
        [113.76, -3.44],
        [113.26, -3.12],
        [112.07, -3.48],
        [111.7, -2.99],
        [111.05, -3.05],
        [110.22, -2.93],
        [110.07, -1.59],
        [109.57, -1.31],
        [109.09, -0.46],
        [108.95, 0.42],
        [109.07, 1.34],
        [109.66, 2.01]
      ],
      [
        [105.82, -5.85],
        [104.71, -5.87],
        [103.87, -5.04],
        [102.58, -4.22],
        [102.16, -3.61],
        [101.4, -2.8],
        [100.9, -2.05],
        [100.14, -0.65],
        [99.26, 0.18],
        [98.97, 1.04],
        [98.6, 1.82],
        [97.7, 2.45],
        [97.18, 3.31],
        [96.42, 3.87],
        [95.38, 4.97],
        [95.29, 5.48],
        [95.94, 5.44],
        [97.48, 5.25],
        [98.37, 4.27],
        [99.14, 3.59],
        [99.69, 3.17],
        [100.64, 2.1],
        [101.66, 2.08],
        [102.5, 1.4],
        [103.08, 0.56],
        [103.84, 0.1],
        [103.44, -0.71],
        [104.01, -1.06],
        [104.37, -1.08],
        [104.54, -1.78],
        [104.89, -2.34],
        [105.62, -2.43],
        [106.11, -3.06],
        [105.86, -4.31],
        [105.82, -5.85]
      ],
      [
        [81.11, 30.18],
        [80.48, 29.73],
        [80.09, 28.79],
        [81.06, 28.42],
        [82, 27.93],
        [83.3, 27.36],
        [84.68, 27.23],
        [85.25, 26.73],
        [86.02, 26.63],
        [87.23, 26.4],
        [88.06, 26.41],
        [88.17, 26.81],
        [88.04, 27.45],
        [88.12, 27.88]
      ],
      [
        [97.33, 28.26],
        [97.4, 27.88],
        [97.05, 27.7],
        [97.13, 27.08],
        [96.42, 27.26],
        [95.12, 26.57],
        [95.16, 26],
        [94.6, 25.16],
        [94.55, 24.68],
        [94.11, 23.85],
        [93.33, 24.08],
        [93.29, 23.04],
        [93.06, 22.7],
        [93.17, 22.28],
        [92.67, 22.04]
      ],
      [
        [89.03, 22.06],
        [88.89, 21.69],
        [88.21, 21.7],
        [86.98, 21.5],
        [87.03, 20.74],
        [86.5, 20.15],
        [85.06, 19.48],
        [83.94, 18.3],
        [83.19, 17.67],
        [82.19, 17.02],
        [82.19, 16.56],
        [81.69, 16.31],
        [80.79, 15.95],
        [80.32, 15.9],
        [80.03, 15.14],
        [80.23, 13.84],
        [80.29, 13.01],
        [79.86, 12.06],
        [79.86, 10.36],
        [79.34, 10.31],
        [78.89, 9.55],
        [79.19, 9.22],
        [78.28, 8.93],
        [77.94, 8.25],
        [77.54, 7.97],
        [76.59, 8.9],
        [76.13, 10.3],
        [75.75, 11.31],
        [75.4, 11.78],
        [74.86, 12.74],
        [74.62, 13.99],
        [74.44, 14.62],
        [73.53, 15.99],
        [73.12, 17.93],
        [72.82, 19.21],
        [72.82, 20.42],
        [72.63, 21.36],
        [71.18, 20.76],
        [70.47, 20.88],
        [69.16, 22.09],
        [69.64, 22.45],
        [69.35, 22.84],
        [68.18, 23.69]
      ],
      [
        [68.18, 23.69],
        [68.84, 24.36],
        [71.04, 24.36],
        [70.84, 25.22],
        [70.28, 25.72],
        [70.17, 26.49],
        [69.51, 26.94],
        [70.62, 27.99],
        [71.78, 27.91],
        [72.82, 28.96],
        [73.45, 29.98],
        [74.42, 30.98],
        [74.41, 31.69],
        [75.26, 32.27],
        [74.45, 32.76],
        [74.1, 33.44],
        [73.75, 34.32],
        [74.24, 34.75],
        [75.76, 34.5],
        [76.87, 34.65],
        [77.84, 35.49]
      ],
      [
        [-6.2, 53.87],
        [-6.03, 53.15],
        [-6.79, 52.26],
        [-8.56, 51.67],
        [-9.98, 51.82],
        [-9.17, 52.86],
        [-9.69, 53.88],
        [-8.33, 54.66],
        [-7.57, 55.13]
      ],
      [
        [53.92, 37.2],
        [54.8, 37.39],
        [55.51, 37.96],
        [56.18, 37.94],
        [56.62, 38.12],
        [57.33, 38.03],
        [58.44, 37.52],
        [59.23, 37.41],
        [60.38, 36.53],
        [61.12, 36.49],
        [61.21, 35.65]
      ],
      [
        [60.87, 29.83],
        [61.37, 29.3],
        [61.77, 28.7],
        [62.73, 28.26],
        [62.76, 27.38],
        [63.23, 27.22],
        [63.32, 26.76],
        [61.87, 26.24],
        [61.5, 25.08]
      ],
      [
        [61.5, 25.08],
        [59.62, 25.38],
        [58.53, 25.61],
        [57.4, 25.74],
        [56.97, 26.97],
        [56.49, 27.14],
        [55.72, 26.96],
        [54.72, 26.48],
        [53.49, 26.81],
        [52.48, 27.58],
        [51.52, 27.87],
        [50.85, 28.81],
        [50.12, 30.15],
        [49.58, 29.99],
        [48.94, 30.32],
        [48.57, 29.93]
      ],
      [
        [48.57, 29.93],
        [48.01, 30.45],
        [48, 30.99],
        [47.69, 30.98],
        [47.85, 31.71],
        [47.33, 32.47],
        [46.11, 33.02],
        [45.42, 33.97],
        [45.65, 34.75],
        [46.15, 35.09],
        [46.08, 35.68],
        [45.42, 35.98]
      ],
      [
        [45.42, 35.98],
        [44.77, 37.17],
        [44.23, 37.97]
      ],
      [
        [44.23, 37.97],
        [44.42, 38.28],
        [44.11, 39.43],
        [44.79, 39.71]
      ],
      [
        [48.88, 38.32],
        [49.2, 37.58],
        [50.15, 37.37],
        [50.84, 36.87],
        [52.26, 36.7],
        [53.83, 36.97],
        [53.92, 37.2]
      ],
      [
        [48.57, 29.93],
        [47.97, 29.98]
      ],
      [
        [47.97, 29.98],
        [47.3, 30.06],
        [46.57, 29.1]
      ],
      [
        [46.57, 29.1],
        [44.71, 29.18],
        [41.89, 31.19],
        [40.4, 31.89],
        [39.2, 32.16]
      ],
      [
        [39.2, 32.16],
        [38.79, 33.38]
      ],
      [
        [38.79, 33.38],
        [41.01, 34.42],
        [41.38, 35.63],
        [41.29, 36.36],
        [41.84, 36.61],
        [42.35, 37.23]
      ],
      [
        [42.35, 37.23],
        [42.78, 37.39],
        [43.94, 37.26],
        [44.29, 37],
        [44.77, 37.17]
      ],
      [
        [44.77, 37.17],
        [45.42, 35.98]
      ],
      [
        [-14.51, 66.46],
        [-14.74, 65.81],
        [-13.61, 65.13],
        [-14.91, 64.36],
        [-17.79, 63.68],
        [-18.66, 63.5],
        [-19.97, 63.64],
        [-22.76, 63.96],
        [-21.78, 64.4],
        [-23.96, 64.89],
        [-22.18, 65.08],
        [-22.23, 65.38],
        [-24.33, 65.61],
        [-23.65, 66.26],
        [-22.13, 66.41],
        [-20.58, 65.73],
        [-19.06, 66.28],
        [-17.8, 65.99],
        [-16.17, 66.53],
        [-14.51, 66.46]
      ],
      [
        [35.72, 32.71],
        [35.55, 32.39]
      ],
      [
        [35.55, 32.39],
        [35.18, 32.53],
        [34.97, 31.87],
        [35.23, 31.75],
        [34.97, 31.62],
        [34.93, 31.35],
        [35.4, 31.49]
      ],
      [
        [35.4, 31.49],
        [35.42, 31.1],
        [34.92, 29.5]
      ],
      [
        [34.92, 29.5],
        [34.27, 31.22],
        [34.56, 31.55],
        [34.49, 31.61],
        [34.75, 32.07],
        [34.96, 32.83],
        [35.1, 33.08],
        [35.13, 33.09]
      ],
      [
        [35.13, 33.09],
        [35.46, 33.09],
        [35.55, 33.26],
        [35.82, 33.28]
      ],
      [
        [35.82, 33.28],
        [35.84, 32.87],
        [35.7, 32.72],
        [35.72, 32.71]
      ],
      [
        [15.52, 38.23],
        [15.16, 37.44],
        [15.31, 37.13],
        [15.1, 36.62],
        [14.34, 37],
        [13.83, 37.1],
        [12.43, 37.61],
        [12.57, 38.13],
        [13.74, 38.03],
        [14.76, 38.14],
        [15.52, 38.23]
      ],
      [
        [9.21, 41.21],
        [9.81, 40.5],
        [9.67, 39.18],
        [9.21, 39.24],
        [8.81, 38.91],
        [8.43, 39.17],
        [8.39, 40.38],
        [8.16, 40.95],
        [8.71, 40.9],
        [9.21, 41.21]
      ],
      [
        [13.81, 46.51],
        [13.7, 46.02],
        [13.94, 45.59]
      ],
      [
        [13.94, 45.59],
        [13.14, 45.74],
        [12.33, 45.38],
        [12.38, 44.89],
        [12.26, 44.6],
        [12.59, 44.09],
        [13.53, 43.59],
        [14.03, 42.76],
        [15.14, 41.96],
        [15.93, 41.96],
        [16.17, 41.74],
        [15.89, 41.54],
        [16.79, 41.18],
        [17.52, 40.88],
        [18.38, 40.36],
        [18.48, 40.17],
        [18.29, 39.81],
        [17.74, 40.28],
        [16.87, 40.44],
        [16.45, 39.8],
        [17.17, 39.42],
        [17.05, 38.9],
        [16.64, 38.84],
        [16.1, 37.99],
        [15.68, 37.91],
        [15.69, 38.21],
        [15.89, 38.75],
        [16.11, 38.96],
        [15.72, 39.54],
        [15.41, 40.05],
        [15, 40.17],
        [14.7, 40.6],
        [14.06, 40.79],
        [13.63, 41.19],
        [12.89, 41.25],
        [12.11, 41.7],
        [11.19, 42.36],
        [10.51, 42.93],
        [10.2, 43.92],
        [9.7, 44.04],
        [8.89, 44.37],
        [8.43, 44.23],
        [7.85, 43.77],
        [7.44, 43.69]
      ],
      [
        [-77.57, 18.49],
        [-76.9, 18.4],
        [-76.37, 18.16],
        [-76.2, 17.89],
        [-76.9, 17.87],
        [-77.21, 17.7],
        [-77.77, 17.86],
        [-78.34, 18.23],
        [-78.22, 18.45],
        [-77.8, 18.52],
        [-77.57, 18.49]
      ],
      [
        [35.72, 32.71],
        [36.83, 32.31],
        [38.79, 33.38]
      ],
      [
        [39.2, 32.16],
        [39, 32.01],
        [37, 31.51],
        [38, 30.51],
        [37.67, 30.34],
        [37.5, 30],
        [36.74, 29.87],
        [36.5, 29.51],
        [36.07, 29.2],
        [34.96, 29.36]
      ],
      [
        [34.96, 29.36],
        [34.92, 29.5]
      ],
      [
        [35.4, 31.49],
        [35.55, 31.78],
        [35.55, 32.39]
      ],
      [
        [134.64, 34.15],
        [134.77, 33.81],
        [134.2, 33.2],
        [133.79, 33.52],
        [133.28, 33.29],
        [133.01, 32.7],
        [132.36, 32.99],
        [132.37, 33.46],
        [132.92, 34.06],
        [133.49, 33.94],
        [133.9, 34.36],
        [134.64, 34.15]
      ],
      [
        [140.98, 37.14],
        [140.6, 36.34],
        [140.77, 35.84],
        [140.25, 35.14],
        [138.98, 34.67],
        [137.22, 34.61],
        [135.79, 33.46],
        [135.12, 33.85],
        [135.08, 34.6],
        [133.34, 34.38],
        [132.16, 33.9],
        [130.99, 33.89],
        [132, 33.15],
        [131.33, 31.45],
        [130.69, 31.03],
        [130.2, 31.42],
        [130.45, 32.32],
        [129.81, 32.61],
        [129.41, 33.3],
        [130.35, 33.6],
        [130.88, 34.23],
        [131.88, 34.75],
        [132.62, 35.43],
        [134.61, 35.73],
        [135.68, 35.53],
        [136.72, 37.3],
        [137.39, 36.83],
        [138.86, 37.83],
        [139.43, 38.22],
        [140.05, 39.44],
        [139.88, 40.56],
        [140.31, 41.2],
        [141.37, 41.38],
        [141.91, 39.99],
        [141.88, 39.18],
        [140.96, 38.17],
        [140.98, 37.14]
      ],
      [
        [143.91, 44.17],
        [144.61, 43.96],
        [145.32, 44.38],
        [145.54, 43.26],
        [144.06, 42.99],
        [143.18, 42],
        [141.61, 42.68],
        [141.07, 41.58],
        [139.96, 41.57],
        [139.82, 42.56],
        [140.31, 43.33],
        [141.38, 43.39],
        [141.67, 44.77],
        [141.97, 45.55],
        [143.14, 44.51],
        [143.91, 44.17]
      ],
      [
        [70.96, 42.27],
        [70.39, 42.08],
        [69.07, 41.38],
        [68.63, 40.67],
        [68.26, 40.66],
        [67.99, 41.14],
        [66.71, 41.17],
        [66.51, 41.99],
        [66.02, 41.99],
        [66.1, 43],
        [64.9, 43.73],
        [63.19, 43.65],
        [62.01, 43.5],
        [61.06, 44.41],
        [60.24, 44.78],
        [58.69, 45.5],
        [58.5, 45.59],
        [55.93, 45],
        [55.97, 41.31]
      ],
      [
        [55.97, 41.31],
        [55.46, 41.26],
        [54.76, 42.04],
        [54.08, 42.32],
        [52.94, 42.12],
        [52.5, 41.78]
      ],
      [
        [52.5, 41.78],
        [52.45, 42.03],
        [52.69, 42.44],
        [52.5, 42.79],
        [51.34, 43.13],
        [50.89, 44.03],
        [50.34, 44.28],
        [50.31, 44.61],
        [51.28, 44.51],
        [51.32, 45.25],
        [52.17, 45.41],
        [53.04, 45.26],
        [53.22, 46.23],
        [53.04, 46.85],
        [52.04, 46.8],
        [51.19, 47.05],
        [50.03, 46.61],
        [49.1, 46.4]
      ],
      [
        [49.1, 46.4],
        [48.59, 46.56],
        [48.69, 47.08]
      ],
      [
        [48.69, 47.08],
        [48.06, 47.74],
        [47.32, 47.72],
        [46.47, 48.39]
      ],
      [
        [46.47, 48.39],
        [47.04, 49.15],
        [46.75, 49.36],
        [47.55, 50.45],
        [48.58, 49.87],
        [48.7, 50.61],
        [50.77, 51.69],
        [52.33, 51.72],
        [54.53, 51.03]
      ],
      [
        [54.53, 51.03],
        [55.72, 50.62],
        [56.78, 51.04],
        [58.36, 51.06],
        [59.64, 50.55]
      ],
      [
        [59.64, 50.55],
        [59.93, 50.84],
        [61.34, 50.8],
        [61.59, 51.27],
        [59.97, 51.96],
        [60.93, 52.45],
        [60.74, 52.72],
        [61.7, 52.98],
        [60.98, 53.66]
      ],
      [
        [60.98, 53.66],
        [61.44, 54.01],
        [65.18, 54.35]
      ],
      [
        [65.18, 54.35],
        [65.67, 54.6],
        [68.17, 54.97]
      ],
      [
        [68.17, 54.97],
        [69.07, 55.39],
        [70.87, 55.17],
        [71.18, 54.13],
        [72.22, 54.38],
        [73.51, 54.04],
        [73.43, 53.49]
      ],
      [
        [73.43, 53.49],
        [74.38, 53.55],
        [76.89, 54.49]
      ],
      [
        [76.89, 54.49],
        [76.53, 54.18],
        [77.8, 53.4],
        [80.04, 50.86],
        [80.57, 51.39],
        [81.95, 50.81],
        [83.38, 51.07],
        [83.94, 50.89],
        [84.42, 50.31],
        [85.12, 50.12],
        [85.54, 49.69],
        [86.83, 49.83],
        [87.36, 49.21]
      ],
      [
        [80.26, 42.35],
        [79.64, 42.5],
        [79.14, 42.86],
        [77.66, 42.96],
        [76, 42.99],
        [75.64, 42.88],
        [74.21, 43.3],
        [73.65, 43.09],
        [73.49, 42.5],
        [71.84, 42.85],
        [71.19, 42.7],
        [70.96, 42.27]
      ],
      [
        [41.59, -1.68],
        [40.88, -2.08],
        [40.64, -2.5],
        [40.26, -2.57],
        [40.12, -3.28],
        [39.8, -3.68],
        [39.6, -4.35],
        [39.2, -4.68]
      ],
      [
        [39.2, -4.68],
        [37.77, -3.68],
        [37.7, -3.1],
        [34.07, -1.06],
        [33.9, -0.95]
      ],
      [
        [33.9, -0.95],
        [33.89, 0.11],
        [34.18, 0.52],
        [34.67, 1.18],
        [35.04, 1.91],
        [34.6, 3.05],
        [34.48, 3.56],
        [34.01, 4.25]
      ],
      [
        [34.01, 4.25],
        [34.62, 4.85],
        [35.3, 5.51]
      ],
      [
        [41.86, 3.92],
        [40.98, 2.78],
        [40.99, -0.86],
        [41.59, -1.68]
      ],
      [
        [73.68, 39.43],
        [71.78, 39.28],
        [70.55, 39.6],
        [69.46, 39.53],
        [69.56, 40.1],
        [70.65, 39.94],
        [71.01, 40.24]
      ],
      [
        [71.01, 40.24],
        [71.77, 40.15],
        [73.06, 40.87],
        [71.87, 41.39],
        [71.16, 41.14],
        [70.42, 41.52],
        [71.26, 42.17],
        [70.96, 42.27]
      ],
      [
        [102.58, 12.19],
        [102.35, 13.39],
        [102.99, 14.23],
        [104.28, 14.42],
        [105.22, 14.27]
      ],
      [
        [105.22, 14.27],
        [106.04, 13.88],
        [106.5, 14.57],
        [107.38, 14.2]
      ],
      [
        [107.38, 14.2],
        [107.61, 13.54],
        [107.49, 12.34],
        [105.81, 11.57],
        [106.25, 10.96],
        [105.2, 10.89],
        [104.33, 10.49]
      ],
      [
        [104.33, 10.49],
        [103.5, 10.63],
        [103.09, 11.15],
        [102.58, 12.19]
      ],
      [
        [128.35, 38.61],
        [129.21, 37.43],
        [129.46, 36.78],
        [129.47, 35.63],
        [129.09, 35.08],
        [128.19, 34.89],
        [127.39, 34.48],
        [126.49, 34.39],
        [126.37, 34.93],
        [126.56, 35.68],
        [126.12, 36.73],
        [126.86, 36.89],
        [126.17, 37.75]
      ],
      [
        [126.17, 37.75],
        [126.24, 37.84],
        [126.68, 37.8],
        [127.07, 38.26],
        [127.78, 38.3],
        [128.21, 38.37],
        [128.35, 38.61]
      ],
      [
        [20.59, 41.86],
        [20.52, 42.22]
      ],
      [
        [20.52, 42.22],
        [20.28, 42.32],
        [20.07, 42.59]
      ],
      [
        [20.07, 42.59],
        [20.26, 42.81]
      ],
      [
        [20.26, 42.81],
        [20.5, 42.88],
        [20.64, 43.22],
        [20.81, 43.27],
        [20.96, 43.13],
        [21.14, 43.07],
        [21.27, 42.91],
        [21.44, 42.86],
        [21.63, 42.68],
        [21.78, 42.68],
        [21.66, 42.44],
        [21.54, 42.32],
        [21.58, 42.25]
      ],
      [
        [21.58, 42.25],
        [21.35, 42.21],
        [20.76, 42.05],
        [20.72, 41.85],
        [20.59, 41.86]
      ],
      [
        [47.97, 29.98],
        [48.18, 29.53],
        [48.09, 29.31],
        [48.42, 28.55]
      ],
      [
        [48.42, 28.55],
        [47.71, 28.53],
        [47.46, 29],
        [46.57, 29.1]
      ],
      [
        [105.22, 14.27],
        [105.54, 14.72],
        [105.59, 15.57],
        [104.78, 16.44],
        [104.72, 17.43],
        [103.96, 18.24],
        [103.2, 18.31],
        [103, 17.96],
        [102.41, 17.93],
        [102.11, 18.11],
        [101.06, 17.51],
        [101.04, 18.41],
        [101.28, 19.46],
        [100.61, 19.51],
        [100.55, 20.11],
        [100.12, 20.42]
      ],
      [
        [100.12, 20.42],
        [100.33, 20.79],
        [101.18, 21.44]
      ],
      [
        [102.17, 22.46],
        [102.75, 21.68],
        [103.2, 20.77],
        [104.44, 20.76],
        [104.82, 19.89],
        [104.18, 19.62],
        [103.9, 19.27],
        [105.09, 18.67],
        [105.93, 17.49],
        [106.56, 16.6],
        [107.31, 15.91],
        [107.56, 15.2],
        [107.38, 14.2]
      ],
      [
        [35.13, 33.09],
        [35.48, 33.91],
        [35.98, 34.61],
        [36, 34.64]
      ],
      [
        [36, 34.64],
        [36.45, 34.59],
        [36.61, 34.2],
        [36.07, 33.82],
        [35.82, 33.28]
      ],
      [
        [-7.71, 4.36],
        [-7.97, 4.36],
        [-9, 4.83],
        [-9.91, 5.59],
        [-10.77, 6.14],
        [-11.44, 6.79]
      ],
      [
        [-11.44, 6.79],
        [-11.2, 7.11],
        [-11.15, 7.4],
        [-10.7, 7.94],
        [-10.23, 8.41]
      ],
      [
        [14.85, 22.86],
        [14.14, 22.49],
        [13.58, 23.04],
        [12, 23.47]
      ],
      [
        [9.48, 30.31],
        [9.97, 30.54],
        [10.06, 30.96],
        [9.95, 31.38],
        [10.64, 31.76],
        [10.94, 32.08],
        [11.43, 32.37],
        [11.49, 33.14]
      ],
      [
        [11.49, 33.14],
        [12.66, 32.79],
        [13.08, 32.88],
        [13.92, 32.71],
        [15.25, 32.27],
        [15.71, 31.38],
        [16.61, 31.18],
        [18.02, 30.76],
        [19.09, 30.27],
        [19.57, 30.53],
        [20.05, 30.99],
        [19.82, 31.75],
        [20.13, 32.24],
        [20.85, 32.71],
        [21.54, 32.84],
        [22.9, 32.64],
        [23.24, 32.19],
        [23.61, 32.19],
        [23.93, 32.02],
        [24.92, 31.9],
        [25.16, 31.57]
      ],
      [
        [25, 22],
        [25, 20],
        [23.85, 20],
        [23.84, 19.58]
      ],
      [
        [23.84, 19.58],
        [19.85, 21.5],
        [15.86, 23.41],
        [14.85, 22.86]
      ],
      [
        [81.79, 7.52],
        [81.64, 6.48],
        [81.22, 6.2],
        [80.35, 5.97],
        [79.87, 6.76],
        [79.7, 8.2],
        [80.15, 9.82],
        [80.84, 9.27],
        [81.3, 8.56],
        [81.79, 7.52]
      ],
      [
        [28.98, -28.96],
        [29.33, -29.26],
        [29.02, -29.74],
        [28.85, -30.07],
        [28.29, -30.23],
        [28.11, -30.55],
        [27.75, -30.65],
        [27, -29.88],
        [27.53, -29.24],
        [28.07, -28.85],
        [28.54, -28.65],
        [28.98, -28.96]
      ],
      [
        [22.73, 54.33],
        [22.65, 54.58],
        [22.76, 54.86],
        [22.32, 55.02],
        [21.27, 55.19]
      ],
      [
        [21.27, 55.19],
        [21.06, 56.03]
      ],
      [
        [21.06, 56.03],
        [22.2, 56.34],
        [23.88, 56.27],
        [24.86, 56.37],
        [25, 56.16],
        [25.53, 56.1],
        [26.49, 55.62]
      ],
      [
        [23.48, 53.91],
        [23.24, 54.22],
        [22.73, 54.33]
      ],
      [
        [21.06, 56.03],
        [21.09, 56.78],
        [21.58, 57.41],
        [22.52, 57.75],
        [23.32, 57.01],
        [24.12, 57.03],
        [24.31, 57.79]
      ],
      [
        [27.29, 57.47],
        [27.77, 57.24],
        [27.86, 56.76],
        [28.18, 56.17]
      ],
      [
        [-8.67, 27.6],
        [-13.1, 27.6]
      ],
      [
        [-13.1, 27.6],
        [-12.36, 28.16],
        [-10.9, 28.83],
        [-10.4, 29.1],
        [-9.56, 29.93],
        [-9.81, 31.18],
        [-9.43, 32.04],
        [-9.3, 32.56],
        [-8.66, 33.24],
        [-7.65, 33.7],
        [-6.91, 34.11],
        [-6.24, 35.15],
        [-5.93, 35.76],
        [-5.19, 35.76],
        [-4.59, 35.33],
        [-3.64, 35.4],
        [-2.6, 35.18],
        [-2.17, 35.17]
      ],
      [
        [26.62, 48.22],
        [26.86, 48.37],
        [27.52, 48.47],
        [28.26, 48.16],
        [28.67, 48.12],
        [29.12, 47.85],
        [29.05, 47.51],
        [29.42, 47.35],
        [29.56, 46.93],
        [29.91, 46.67],
        [29.84, 46.53],
        [30.02, 46.42],
        [29.76, 46.35],
        [29.17, 46.38],
        [29.07, 46.52],
        [28.86, 46.44],
        [28.93, 46.26],
        [28.66, 45.94],
        [28.49, 45.6],
        [28.23, 45.49]
      ],
      [
        [28.23, 45.49],
        [28.05, 45.94],
        [28.16, 46.37],
        [28.13, 46.81],
        [27.55, 47.41],
        [27.23, 47.83],
        [26.92, 48.12],
        [26.62, 48.22]
      ],
      [
        [49.54, -12.47],
        [49.81, -12.9],
        [50.06, -13.56],
        [50.22, -14.76],
        [50.48, -15.23],
        [50.38, -15.71],
        [50.2, -16],
        [49.86, -15.41],
        [49.67, -15.71],
        [49.86, -16.45],
        [49.77, -16.88],
        [49.5, -17.11],
        [49.44, -17.95],
        [49.04, -19.12],
        [48.55, -20.5],
        [47.93, -22.39],
        [47.55, -23.78],
        [47.1, -24.94],
        [46.28, -25.18],
        [45.41, -25.6],
        [44.83, -25.35],
        [44.04, -24.99],
        [43.76, -24.46],
        [43.7, -23.57],
        [43.35, -22.78],
        [43.25, -22.06],
        [43.43, -21.34],
        [43.89, -21.16],
        [43.9, -20.83],
        [44.37, -20.07],
        [44.46, -19.44],
        [44.23, -18.96],
        [44.04, -18.33],
        [43.96, -17.41],
        [44.31, -16.85],
        [44.45, -16.22],
        [44.94, -16.18],
        [45.5, -15.97],
        [45.87, -15.79],
        [46.31, -15.78],
        [46.88, -15.21],
        [47.71, -14.59],
        [48.01, -14.09],
        [47.87, -13.66],
        [48.29, -13.78],
        [48.85, -13.09],
        [48.86, -12.49],
        [49.19, -12.04],
        [49.54, -12.47]
      ],
      [
        [-92.23, 14.54],
        [-93.36, 15.62],
        [-93.88, 15.94],
        [-94.69, 16.2],
        [-95.25, 16.13],
        [-96.05, 15.75],
        [-96.56, 15.65],
        [-97.26, 15.92],
        [-98.01, 16.11],
        [-98.95, 16.57],
        [-99.7, 16.71],
        [-100.83, 17.17],
        [-101.67, 17.65],
        [-101.92, 17.92],
        [-102.48, 17.98],
        [-103.5, 18.29],
        [-103.92, 18.75],
        [-104.99, 19.32],
        [-105.49, 19.95],
        [-105.73, 20.43],
        [-105.4, 20.53],
        [-105.5, 20.82],
        [-105.27, 21.08],
        [-105.27, 21.42],
        [-105.6, 21.87],
        [-105.69, 22.27],
        [-106.03, 22.77],
        [-106.91, 23.77],
        [-107.92, 24.55],
        [-108.4, 25.17],
        [-109.26, 25.58],
        [-109.44, 25.82],
        [-109.29, 26.44],
        [-109.8, 26.68],
        [-110.39, 27.16],
        [-110.64, 27.86],
        [-111.18, 27.94],
        [-111.76, 28.47],
        [-112.23, 28.95],
        [-112.27, 29.27],
        [-112.81, 30.02],
        [-113.16, 30.79],
        [-113.15, 31.17],
        [-113.87, 31.57],
        [-114.21, 31.52],
        [-114.78, 31.8],
        [-114.94, 31.39],
        [-114.77, 30.91],
        [-114.67, 30.16],
        [-114.33, 29.75],
        [-113.59, 29.06],
        [-113.42, 28.83],
        [-113.27, 28.75],
        [-113.14, 28.41],
        [-112.96, 28.43],
        [-112.76, 27.78],
        [-112.46, 27.53],
        [-112.24, 27.17],
        [-111.62, 26.66],
        [-111.28, 25.73],
        [-110.99, 25.29],
        [-110.71, 24.83],
        [-110.66, 24.3],
        [-110.17, 24.27],
        [-109.77, 23.81],
        [-109.41, 23.36],
        [-109.43, 23.19],
        [-109.85, 22.82],
        [-110.03, 22.82],
        [-110.3, 23.43],
        [-110.95, 24],
        [-111.67, 24.48],
        [-112.18, 24.74],
        [-112.15, 25.47],
        [-112.3, 26.01],
        [-112.78, 26.32],
        [-113.46, 26.77],
        [-113.6, 26.64],
        [-113.85, 26.9],
        [-114.47, 27.14],
        [-115.06, 27.72],
        [-114.98, 27.8],
        [-114.57, 27.74],
        [-114.2, 28.12],
        [-114.16, 28.57],
        [-114.93, 29.28],
        [-115.52, 29.56],
        [-115.89, 30.18],
        [-116.26, 30.84],
        [-116.72, 31.64],
        [-117.13, 32.54]
      ],
      [
        [-117.13, 32.54],
        [-115.99, 32.61],
        [-114.72, 32.72],
        [-114.81, 32.53],
        [-113.3, 32.04],
        [-111.02, 31.33],
        [-109.03, 31.34],
        [-108.24, 31.34],
        [-108.24, 31.75],
        [-106.51, 31.75],
        [-106.14, 31.4],
        [-105.63, 31.08],
        [-105.04, 30.64],
        [-104.71, 30.12],
        [-104.46, 29.57],
        [-103.94, 29.27],
        [-103.11, 28.97],
        [-102.48, 29.76],
        [-101.66, 29.78],
        [-100.96, 29.38],
        [-100.46, 28.7],
        [-100.11, 28.11],
        [-99.52, 27.54],
        [-99.3, 26.84],
        [-99.02, 26.37],
        [-98.24, 26.06],
        [-97.53, 25.84]
      ],
      [
        [-97.53, 25.84],
        [-97.14, 25.87],
        [-97.53, 24.99],
        [-97.7, 24.27],
        [-97.78, 22.93],
        [-97.87, 22.44],
        [-97.7, 21.9],
        [-97.39, 21.41],
        [-97.19, 20.64],
        [-96.53, 19.89],
        [-96.29, 19.32],
        [-95.9, 18.83],
        [-94.84, 18.56],
        [-94.43, 18.14],
        [-93.55, 18.42],
        [-92.79, 18.52],
        [-92.04, 18.7],
        [-91.41, 18.88],
        [-90.77, 19.28],
        [-90.53, 19.87],
        [-90.45, 20.71],
        [-90.28, 21],
        [-89.6, 21.26],
        [-88.54, 21.49],
        [-87.66, 21.46],
        [-87.05, 21.54],
        [-86.81, 21.33],
        [-86.85, 20.85],
        [-87.38, 20.26],
        [-87.62, 19.65],
        [-87.44, 19.47],
        [-87.59, 19.04],
        [-87.84, 18.26],
        [-88.09, 18.52],
        [-88.3, 18.5]
      ],
      [
        [21.58, 42.25],
        [21.92, 42.3],
        [22.38, 42.32]
      ],
      [
        [21.02, 40.84],
        [20.61, 41.09],
        [20.46, 41.52],
        [20.59, 41.86]
      ],
      [
        [-12.17, 14.62],
        [-11.83, 14.8],
        [-11.67, 15.39],
        [-11.35, 15.41],
        [-10.65, 15.13],
        [-10.09, 15.33],
        [-9.7, 15.26],
        [-9.55, 15.49],
        [-5.54, 15.5],
        [-5.32, 16.2],
        [-5.49, 16.33],
        [-5.97, 20.64],
        [-6.45, 24.96],
        [-4.92, 24.97]
      ],
      [
        [4.27, 19.16],
        [4.27, 16.85],
        [3.72, 16.18],
        [3.64, 15.57],
        [2.75, 15.41],
        [1.39, 15.32],
        [1.02, 14.97],
        [0.37, 14.93]
      ],
      [
        [-11.51, 12.44],
        [-11.47, 12.75],
        [-11.55, 13.14],
        [-11.93, 13.42],
        [-12.12, 13.99],
        [-12.17, 14.62]
      ],
      [
        [98.55, 9.93],
        [98.46, 10.68],
        [98.76, 11.44],
        [98.43, 12.03],
        [98.51, 13.12],
        [98.1, 13.64],
        [97.78, 14.84],
        [97.6, 16.1],
        [97.16, 16.93],
        [96.51, 16.43],
        [95.37, 15.71],
        [94.81, 15.8],
        [94.19, 16.04],
        [94.53, 17.28],
        [94.32, 18.21],
        [93.54, 19.37],
        [93.66, 19.73],
        [93.08, 19.86],
        [92.37, 20.67]
      ],
      [
        [100.12, 20.42],
        [99.54, 20.19],
        [98.96, 19.75],
        [98.25, 19.71],
        [97.8, 18.63],
        [97.38, 18.45],
        [97.86, 17.57],
        [98.49, 16.84],
        [98.9, 16.18],
        [98.54, 15.31],
        [98.19, 15.12],
        [98.43, 14.62],
        [99.1, 13.83],
        [99.21, 13.27],
        [99.2, 12.8],
        [99.59, 11.89],
        [99.04, 10.96],
        [98.55, 9.93]
      ],
      [
        [19.74, 42.69],
        [19.3, 42.2],
        [19.37, 41.88],
        [19.16, 41.96],
        [18.88, 42.28],
        [18.45, 42.48],
        [18.56, 42.65]
      ],
      [
        [19.22, 43.52],
        [19.48, 43.35],
        [19.63, 43.21],
        [19.96, 43.11],
        [20.34, 42.9],
        [20.26, 42.81]
      ],
      [
        [87.75, 49.3],
        [88.81, 49.47],
        [90.71, 50.33],
        [92.23, 50.8]
      ],
      [
        [92.23, 50.8],
        [93.1, 50.5],
        [94.15, 50.48]
      ],
      [
        [94.15, 50.48],
        [94.82, 50.01]
      ],
      [
        [94.82, 50.01],
        [95.81, 49.98],
        [97.26, 49.73],
        [98.23, 50.42]
      ],
      [
        [98.23, 50.42],
        [97.83, 51.01],
        [98.86, 52.05],
        [99.98, 51.63],
        [100.89, 51.52]
      ],
      [
        [100.89, 51.52],
        [102.07, 51.26],
        [102.26, 50.51],
        [103.68, 50.09]
      ],
      [
        [103.68, 50.09],
        [104.62, 50.28],
        [105.89, 50.41]
      ],
      [
        [105.89, 50.41],
        [106.89, 50.27],
        [107.87, 49.79],
        [108.48, 49.28],
        [109.4, 49.29],
        [110.66, 49.13],
        [111.58, 49.38],
        [112.9, 49.54],
        [114.36, 50.25],
        [114.96, 50.14],
        [115.49, 49.81],
        [116.68, 49.89]
      ],
      [
        [34.56, -11.52],
        [35.31, -11.44],
        [36.51, -11.72],
        [36.78, -11.59]
      ],
      [
        [36.78, -11.59],
        [37.47, -11.57],
        [37.83, -11.27],
        [38.43, -11.29]
      ],
      [
        [38.43, -11.29],
        [39.52, -10.9],
        [40.32, -10.32],
        [40.48, -10.77],
        [40.44, -11.76],
        [40.56, -12.64],
        [40.6, -14.2],
        [40.78, -14.69],
        [40.48, -15.41],
        [40.09, -16.1],
        [39.45, -16.72],
        [38.54, -17.1],
        [37.41, -17.59],
        [36.28, -18.66],
        [35.9, -18.84],
        [35.2, -19.55],
        [34.79, -19.78],
        [34.7, -20.5],
        [35.18, -21.25],
        [35.37, -21.84],
        [35.39, -22.14],
        [35.56, -22.09],
        [35.53, -23.07],
        [35.37, -23.54],
        [35.61, -23.71],
        [35.46, -24.12],
        [35.04, -24.48],
        [34.22, -24.82],
        [33.01, -25.36],
        [32.57, -25.73],
        [32.66, -26.15],
        [32.92, -26.22],
        [32.83, -26.74]
      ],
      [
        [32.83, -26.74],
        [32.07, -26.73]
      ],
      [
        [32.07, -26.73],
        [31.99, -26.29],
        [31.84, -25.84]
      ],
      [
        [31.84, -25.84],
        [31.75, -25.48],
        [31.93, -24.37],
        [31.67, -23.66],
        [31.19, -22.25]
      ],
      [
        [31.19, -22.25],
        [32.24, -21.12],
        [32.51, -20.4],
        [32.66, -20.3],
        [32.77, -19.72],
        [32.61, -19.42],
        [32.65, -18.67],
        [32.85, -17.98],
        [32.85, -16.71],
        [32.33, -16.39],
        [31.85, -16.32],
        [31.64, -16.07],
        [31.17, -15.86],
        [30.34, -15.88],
        [30.27, -15.51]
      ],
      [
        [30.27, -15.51],
        [30.18, -14.8],
        [33.21, -13.97]
      ],
      [
        [33.21, -13.97],
        [33.79, -14.45],
        [34.06, -14.36],
        [34.46, -14.61],
        [34.52, -15.01],
        [34.31, -15.48],
        [34.38, -16.18],
        [35.03, -16.8],
        [35.34, -16.11],
        [35.77, -15.9],
        [35.69, -14.61],
        [35.27, -13.89],
        [34.91, -13.57],
        [34.56, -13.58],
        [34.28, -12.28],
        [34.56, -11.52]
      ],
      [
        [-12.17, 14.62],
        [-12.83, 15.3],
        [-13.44, 16.04],
        [-14.1, 16.3],
        [-14.58, 16.6],
        [-15.14, 16.59],
        [-15.62, 16.37],
        [-16.12, 16.46],
        [-16.46, 16.14]
      ],
      [
        [-16.46, 16.14],
        [-16.55, 16.67],
        [-16.27, 17.17],
        [-16.15, 18.11],
        [-16.26, 19.1],
        [-16.38, 19.59],
        [-16.28, 20.09],
        [-16.54, 20.57],
        [-17.06, 21]
      ],
      [
        [-17.06, 21],
        [-16.85, 21.33],
        [-12.93, 21.33],
        [-13.12, 22.77],
        [-12.87, 23.28],
        [-11.94, 23.37],
        [-11.97, 25.93],
        [-8.69, 25.88],
        [-8.68, 27.4]
      ],
      [
        [33.21, -13.97],
        [32.69, -13.71],
        [32.99, -12.78],
        [33.31, -12.44],
        [33.11, -11.61],
        [33.32, -10.8],
        [33.49, -10.53],
        [33.23, -9.68],
        [32.76, -9.23]
      ],
      [
        [32.76, -9.23],
        [33.74, -9.42],
        [33.94, -9.69]
      ],
      [
        [33.94, -9.69],
        [34.28, -10.16],
        [34.56, -11.52]
      ],
      [
        [102.14, 6.22],
        [102.37, 6.13],
        [102.96, 5.52],
        [103.38, 4.86],
        [103.44, 4.18],
        [103.33, 3.73],
        [103.43, 3.38],
        [103.5, 2.79],
        [103.85, 2.52],
        [104.25, 1.63],
        [104.29, 1.37],
        [104.13, 1.27]
      ],
      [
        [104.13, 1.27],
        [103.74, 1.13],
        [103.56, 1.19]
      ],
      [
        [103.56, 1.19],
        [102.57, 1.97],
        [101.39, 2.76],
        [101.27, 3.27],
        [100.7, 3.94],
        [100.56, 4.77],
        [100.2, 5.31],
        [100.31, 6.04],
        [100.09, 6.46]
      ],
      [
        [100.09, 6.46],
        [100.26, 6.64],
        [101.08, 6.2],
        [101.15, 5.69],
        [101.81, 5.81],
        [102.14, 6.22]
      ],
      [
        [109.66, 2.01],
        [110.4, 1.66],
        [111.17, 1.85],
        [111.37, 2.7],
        [111.8, 2.89],
        [113, 3.1],
        [113.71, 3.89],
        [114.2, 4.53]
      ],
      [
        [115.45, 5.45],
        [116.22, 6.14],
        [116.73, 6.92],
        [117.13, 6.93],
        [117.64, 6.42],
        [117.69, 5.99],
        [118.35, 5.71],
        [119.18, 5.41],
        [119.11, 5.02],
        [118.44, 4.97],
        [118.62, 4.48],
        [117.88, 4.14]
      ],
      [
        [16.34, -28.58],
        [15.6, -27.82],
        [15.21, -27.09],
        [14.99, -26.12],
        [14.74, -25.39],
        [14.41, -23.85],
        [14.39, -22.66],
        [14.26, -22.11],
        [13.87, -21.7],
        [13.35, -20.87],
        [12.83, -19.67],
        [12.61, -19.05],
        [11.79, -18.07],
        [11.73, -17.3]
      ],
      [
        [23.22, -17.52],
        [24.03, -17.3],
        [24.68, -17.35],
        [25.08, -17.58],
        [25.08, -17.66]
      ],
      [
        [19.9, -24.77],
        [19.89, -28.46],
        [19, -28.97],
        [18.46, -29.05],
        [17.84, -28.86],
        [17.39, -28.78],
        [17.22, -28.36],
        [16.82, -28.08],
        [16.34, -28.58]
      ],
      [
        [165.78, -21.08],
        [166.6, -21.7],
        [167.12, -22.16],
        [166.74, -22.4],
        [166.19, -22.13],
        [165.47, -21.68],
        [164.83, -21.15],
        [164.17, -20.44],
        [164.03, -20.11],
        [164.46, -20.12],
        [165.02, -20.46],
        [165.46, -20.8],
        [165.78, -21.08]
      ],
      [
        [14.85, 22.86],
        [15.1, 21.31]
      ],
      [
        [15.1, 21.31],
        [15.47, 21.05],
        [15.49, 20.73]
      ],
      [
        [15.49, 20.73],
        [15.9, 20.39],
        [15.69, 19.96],
        [15.3, 17.93],
        [15.25, 16.63]
      ],
      [
        [15.25, 16.63],
        [13.97, 15.68],
        [13.54, 14.37]
      ],
      [
        [13.54, 14.37],
        [13.96, 14],
        [13.95, 13.35],
        [14.6, 13.33],
        [14.5, 12.86]
      ],
      [
        [14.18, 12.48],
        [14, 12.46],
        [13.32, 13.56],
        [13.08, 13.6],
        [12.3, 13.04],
        [11.53, 13.33],
        [10.99, 13.39],
        [10.7, 13.25],
        [10.11, 13.28],
        [9.52, 12.85],
        [9.01, 12.83],
        [7.8, 13.34],
        [7.33, 13.1],
        [6.82, 13.12],
        [6.45, 13.49],
        [5.44, 13.87],
        [4.37, 13.75],
        [4.11, 13.53],
        [3.97, 12.96],
        [3.68, 12.55],
        [3.61, 11.66]
      ],
      [
        [8.5, 4.77],
        [7.46, 4.41],
        [7.08, 4.46],
        [6.7, 4.24],
        [5.9, 4.26],
        [5.36, 4.89],
        [5.03, 5.61],
        [4.33, 6.27],
        [3.57, 6.26],
        [2.69, 6.26]
      ],
      [
        [-85.71, 11.09],
        [-86.06, 11.4],
        [-86.53, 11.81],
        [-86.75, 12.14],
        [-87.17, 12.46],
        [-87.67, 12.91],
        [-87.56, 13.06],
        [-87.39, 12.91],
        [-87.32, 12.98]
      ],
      [
        [-83.15, 15],
        [-83.23, 14.9],
        [-83.28, 14.68],
        [-83.18, 14.31],
        [-83.41, 13.97],
        [-83.52, 13.57],
        [-83.55, 13.13],
        [-83.5, 12.87],
        [-83.47, 12.42],
        [-83.63, 12.32],
        [-83.72, 11.89],
        [-83.65, 11.63],
        [-83.86, 11.37],
        [-83.81, 11.1],
        [-83.66, 10.94]
      ],
      [
        [4.05, 51.27],
        [3.31, 51.35],
        [3.83, 51.62],
        [4.71, 53.09],
        [6.07, 53.51],
        [6.91, 53.48]
      ],
      [
        [20.65, 69.11],
        [20.03, 69.07],
        [19.88, 68.41],
        [17.99, 68.57],
        [17.73, 68.01],
        [16.77, 68.01],
        [16.11, 67.3],
        [15.11, 66.19],
        [13.56, 64.79],
        [13.92, 64.45],
        [13.57, 64.05],
        [12.58, 64.07],
        [11.93, 63.13],
        [11.99, 61.8],
        [12.63, 61.29],
        [12.3, 60.12],
        [11.47, 59.43],
        [11.03, 58.86]
      ],
      [
        [11.03, 58.86],
        [10.36, 59.47],
        [8.38, 58.31],
        [7.05, 58.08],
        [5.67, 58.59],
        [5.31, 59.66],
        [4.99, 61.97],
        [5.91, 62.61],
        [8.55, 63.45],
        [10.53, 64.49],
        [12.36, 65.88],
        [14.76, 67.81],
        [16.44, 68.56],
        [19.18, 69.82],
        [21.38, 70.26],
        [23.02, 70.2],
        [24.55, 71.03],
        [26.37, 70.99],
        [28.17, 71.19],
        [31.29, 70.45],
        [30.01, 70.19],
        [31.1, 69.56],
        [29.4, 69.16],
        [28.59, 69.06]
      ],
      [
        [24.72, 77.85],
        [22.49, 77.44],
        [20.73, 77.68],
        [21.42, 77.94],
        [20.81, 78.25],
        [22.88, 78.45],
        [23.28, 78.08],
        [24.72, 77.85]
      ],
      [
        [18.25, 79.7],
        [21.54, 78.96],
        [19.03, 78.56],
        [18.47, 77.83],
        [17.59, 77.64],
        [17.12, 76.81],
        [15.91, 76.77],
        [13.76, 77.38],
        [14.67, 77.74],
        [13.17, 78.02],
        [11.22, 78.87],
        [10.44, 79.65],
        [13.17, 80.01],
        [13.72, 79.66],
        [15.14, 79.67],
        [15.52, 80.02],
        [16.99, 80.05],
        [18.25, 79.7]
      ],
      [
        [25.45, 80.41],
        [27.41, 80.06],
        [25.92, 79.52],
        [23.02, 79.4],
        [20.08, 79.57],
        [19.9, 79.84],
        [18.46, 79.86],
        [17.37, 80.32],
        [20.46, 80.6],
        [21.91, 80.36],
        [22.92, 80.66],
        [25.45, 80.41]
      ],
      [
        [173.02, -40.92],
        [173.25, -41.33],
        [173.96, -40.93],
        [174.25, -41.35],
        [174.25, -41.77],
        [173.88, -42.23],
        [173.22, -42.97],
        [172.71, -43.37],
        [173.08, -43.85],
        [172.31, -43.87],
        [171.45, -44.24],
        [171.19, -44.9],
        [170.62, -45.91],
        [169.83, -46.36],
        [169.33, -46.64],
        [168.41, -46.62],
        [167.76, -46.29],
        [166.68, -46.22],
        [166.51, -45.85],
        [167.05, -45.11],
        [168.3, -44.12],
        [168.95, -43.94],
        [169.67, -43.56],
        [170.52, -43.03],
        [171.13, -42.51],
        [171.57, -41.77],
        [171.95, -41.51],
        [172.1, -40.96],
        [172.8, -40.49],
        [173.02, -40.92]
      ],
      [
        [174.61, -36.16],
        [175.34, -37.21],
        [175.36, -36.53],
        [175.81, -36.8],
        [175.96, -37.56],
        [176.76, -37.88],
        [177.44, -37.96],
        [178.01, -37.58],
        [178.52, -37.7],
        [178.27, -38.58],
        [177.97, -39.17],
        [177.21, -39.15],
        [176.94, -39.45],
        [177.03, -39.88],
        [176.89, -40.07],
        [176.51, -40.6],
        [176.01, -41.29],
        [175.24, -41.69],
        [175.07, -41.43],
        [174.65, -41.28],
        [175.23, -40.46],
        [174.9, -39.91],
        [173.82, -39.51],
        [173.85, -39.15],
        [174.57, -38.8],
        [174.74, -38.03],
        [174.7, -37.38],
        [174.29, -36.71],
        [174.32, -36.53],
        [173.84, -36.12],
        [173.05, -35.24],
        [172.64, -34.53],
        [173.01, -34.45],
        [173.55, -35.01],
        [174.33, -35.27],
        [174.61, -36.16]
      ],
      [
        [53.11, 16.65],
        [52.78, 17.35],
        [52, 19]
      ],
      [
        [52, 19],
        [55, 20],
        [55.67, 22],
        [55.21, 22.71]
      ],
      [
        [56.4, 24.92],
        [56.85, 24.24],
        [57.4, 23.88],
        [58.14, 23.75],
        [58.73, 23.57],
        [59.18, 22.99],
        [59.45, 22.66],
        [59.81, 22.53],
        [59.81, 22.31],
        [59.44, 21.71],
        [59.28, 21.43],
        [58.86, 21.11],
        [58.49, 20.43],
        [58.03, 20.48],
        [57.83, 20.24],
        [57.67, 19.74],
        [57.79, 19.07],
        [57.69, 18.94],
        [57.23, 18.95],
        [56.61, 18.57],
        [56.51, 18.09],
        [56.28, 17.88],
        [55.66, 17.88],
        [55.27, 17.63],
        [55.27, 17.23],
        [54.79, 16.95],
        [54.24, 17.04],
        [53.57, 16.71],
        [53.11, 16.65]
      ],
      [
        [56.07, 26.06],
        [56.36, 26.4],
        [56.49, 26.31],
        [56.39, 25.9],
        [56.26, 25.71]
      ],
      [
        [68.18, 23.69],
        [67.44, 23.94],
        [67.15, 24.66],
        [66.37, 25.43],
        [64.53, 25.24],
        [62.91, 25.22],
        [61.5, 25.08]
      ],
      [
        [-77.88, 7.22],
        [-78.21, 7.51],
        [-78.43, 8.05],
        [-78.18, 8.32],
        [-78.44, 8.39],
        [-78.62, 8.72],
        [-79.12, 9],
        [-79.56, 8.93],
        [-79.76, 8.58],
        [-80.16, 8.33],
        [-80.38, 8.3],
        [-80.48, 8.09],
        [-80, 7.55],
        [-80.28, 7.42],
        [-80.42, 7.27],
        [-80.89, 7.22],
        [-81.06, 7.82],
        [-81.19, 7.65],
        [-81.52, 7.71],
        [-81.72, 8.11],
        [-82.13, 8.18],
        [-82.39, 8.29],
        [-82.82, 8.29],
        [-82.85, 8.07],
        [-82.97, 8.23]
      ],
      [
        [-82.55, 9.57],
        [-82.19, 9.21],
        [-82.21, 9],
        [-81.81, 8.95],
        [-81.71, 9.03],
        [-81.44, 8.79],
        [-80.95, 8.86],
        [-80.52, 9.11],
        [-79.91, 9.31],
        [-79.57, 9.61],
        [-79.02, 9.55],
        [-79.06, 9.45],
        [-78.5, 9.42],
        [-78.06, 9.25],
        [-77.73, 8.95],
        [-77.35, 8.67]
      ],
      [
        [-70.37, -18.35],
        [-71.38, -17.77],
        [-71.46, -17.36],
        [-73.44, -16.36],
        [-75.24, -15.27],
        [-76.01, -14.65],
        [-76.42, -13.82],
        [-76.26, -13.54],
        [-77.11, -12.22],
        [-78.09, -10.38],
        [-79.04, -8.39],
        [-79.45, -7.93],
        [-79.76, -7.19],
        [-80.54, -6.54],
        [-81.25, -6.14],
        [-80.93, -5.69],
        [-81.41, -4.74],
        [-81.1, -4.04],
        [-80.3, -3.4]
      ],
      [
        [126.38, 8.41],
        [126.48, 7.75],
        [126.54, 7.19],
        [126.2, 6.27],
        [125.83, 7.29],
        [125.36, 6.79],
        [125.68, 6.05],
        [125.4, 5.58],
        [124.22, 6.16],
        [123.94, 6.89],
        [124.24, 7.36],
        [123.61, 7.83],
        [123.3, 7.42],
        [122.83, 7.46],
        [122.09, 6.9],
        [121.92, 7.19],
        [122.31, 8.03],
        [122.94, 8.32],
        [123.49, 8.69],
        [123.84, 8.24],
        [124.6, 8.51],
        [124.76, 8.96],
        [125.47, 8.99],
        [125.41, 9.76],
        [126.22, 9.29],
        [126.31, 8.78],
        [126.38, 8.41]
      ],
      [
        [123.98, 10.28],
        [123.62, 9.95],
        [123.31, 9.32],
        [123, 9.02],
        [122.38, 9.71],
        [122.59, 9.98],
        [122.84, 10.26],
        [122.95, 10.88],
        [123.5, 10.94],
        [123.34, 10.27],
        [124.08, 11.23],
        [123.98, 10.28]
      ],
      [
        [118.5, 9.32],
        [117.17, 8.37],
        [117.66, 9.07],
        [118.39, 9.68],
        [118.99, 10.38],
        [119.51, 11.37],
        [119.69, 10.55],
        [119.03, 10],
        [118.5, 9.32]
      ],
      [
        [121.88, 11.89],
        [122.48, 11.58],
        [123.12, 11.58],
        [123.1, 11.17],
        [122.64, 10.74],
        [122, 10.44],
        [121.97, 10.91],
        [122.04, 11.42],
        [121.88, 11.89]
      ],
      [
        [125.5, 12.16],
        [125.78, 11.05],
        [125.01, 11.31],
        [125.03, 10.98],
        [125.28, 10.36],
        [124.8, 10.13],
        [124.76, 10.84],
        [124.46, 10.89],
        [124.3, 11.5],
        [124.89, 11.42],
        [124.88, 11.79],
        [124.27, 12.56],
        [125.23, 12.54],
        [125.5, 12.16]
      ],
      [
        [121.53, 13.07],
        [121.26, 12.21],
        [120.83, 12.7],
        [120.32, 13.47],
        [121.18, 13.43],
        [121.53, 13.07]
      ],
      [
        [121.32, 18.5],
        [121.94, 18.22],
        [122.25, 18.48],
        [122.34, 18.22],
        [122.17, 17.81],
        [122.52, 17.09],
        [122.25, 16.26],
        [121.66, 15.93],
        [121.51, 15.12],
        [121.73, 14.33],
        [122.26, 14.22],
        [122.7, 14.34],
        [123.95, 13.78],
        [123.86, 13.24],
        [124.18, 13],
        [124.08, 12.54],
        [123.3, 13.03],
        [122.93, 13.55],
        [122.67, 13.19],
        [122.03, 13.78],
        [121.13, 13.64],
        [120.63, 13.86],
        [120.68, 14.27],
        [120.99, 14.53],
        [120.69, 14.76],
        [120.56, 14.4],
        [120.07, 14.97],
        [119.92, 15.41],
        [119.88, 16.36],
        [120.29, 16.03],
        [120.39, 17.6],
        [120.72, 18.51],
        [121.32, 18.5]
      ],
      [
        [155.88, -6.82],
        [155.6, -6.92],
        [155.17, -6.54],
        [154.73, -5.9],
        [154.51, -5.14],
        [154.65, -5.04],
        [154.76, -5.34],
        [155.06, -5.57],
        [155.55, -6.2],
        [156.02, -6.54],
        [155.88, -6.82]
      ],
      [
        [151.98, -5.48],
        [151.46, -5.56],
        [151.3, -5.84],
        [150.75, -6.08],
        [150.24, -6.32],
        [149.71, -6.32],
        [148.89, -6.03],
        [148.32, -5.75],
        [148.4, -5.44],
        [149.3, -5.58],
        [149.85, -5.51],
        [150, -5.03],
        [150.14, -5],
        [150.24, -5.53],
        [150.81, -5.46],
        [151.09, -5.11],
        [151.65, -4.76],
        [151.54, -4.17],
        [152.14, -4.15],
        [152.34, -4.31],
        [152.32, -4.87],
        [151.98, -5.48]
      ],
      [
        [141, -2.6],
        [142.74, -3.29],
        [144.58, -3.86],
        [145.27, -4.37],
        [145.83, -4.88],
        [145.98, -5.47],
        [147.65, -6.08],
        [147.89, -6.61],
        [146.97, -6.72],
        [147.19, -7.39],
        [148.08, -8.04],
        [148.73, -9.1],
        [149.31, -9.07],
        [149.27, -9.51],
        [150.04, -9.68],
        [149.74, -9.87],
        [150.8, -10.29],
        [150.69, -10.58],
        [150.03, -10.65],
        [149.78, -10.39],
        [148.92, -10.28],
        [147.91, -10.13],
        [147.14, -9.49],
        [146.57, -8.94],
        [146.05, -8.07],
        [144.74, -7.63],
        [143.9, -7.92],
        [143.29, -8.25],
        [143.41, -8.98],
        [142.63, -9.33],
        [142.07, -9.16],
        [141.03, -9.12]
      ],
      [
        [153.14, -4.5],
        [152.83, -4.77],
        [152.64, -4.18],
        [152.41, -3.79],
        [151.95, -3.46],
        [151.38, -3.04],
        [150.66, -2.74],
        [150.94, -2.5],
        [151.48, -2.78],
        [151.82, -3],
        [152.24, -3.24],
        [152.64, -3.66],
        [153.02, -3.98],
        [153.14, -4.5]
      ],
      [
        [14.12, 53.76],
        [14.8, 54.05],
        [16.36, 54.51],
        [17.62, 54.85],
        [18.62, 54.68],
        [18.7, 54.44],
        [19.66, 54.43]
      ],
      [
        [19.66, 54.43],
        [20.89, 54.31],
        [22.73, 54.33]
      ],
      [
        [23.53, 51.58],
        [24.03, 50.71],
        [23.92, 50.42],
        [23.43, 50.31],
        [22.52, 49.48],
        [22.78, 49.03],
        [22.56, 49.09]
      ],
      [
        [22.56, 49.09],
        [21.61, 49.47],
        [20.89, 49.33],
        [20.42, 49.43],
        [19.83, 49.22],
        [19.32, 49.57],
        [18.91, 49.44],
        [18.85, 49.5]
      ],
      [
        [-66.28, 18.51],
        [-65.77, 18.43],
        [-65.59, 18.23],
        [-65.85, 17.98],
        [-66.6, 17.98],
        [-67.18, 17.95],
        [-67.24, 18.37],
        [-67.1, 18.52],
        [-66.28, 18.51]
      ],
      [
        [130.64, 42.4],
        [130.78, 42.22],
        [130.4, 42.28],
        [129.97, 41.94],
        [129.67, 41.6],
        [129.71, 40.88],
        [129.19, 40.66],
        [129.01, 40.49],
        [128.63, 40.19],
        [127.97, 40.03],
        [127.53, 39.76],
        [127.5, 39.32],
        [127.39, 39.21],
        [127.78, 39.05],
        [128.35, 38.61]
      ],
      [
        [126.17, 37.75],
        [125.69, 37.94],
        [125.57, 37.75],
        [125.28, 37.67],
        [125.24, 37.86],
        [124.98, 37.95],
        [124.71, 38.11],
        [124.99, 38.55],
        [125.22, 38.67],
        [125.13, 38.85],
        [125.39, 39.39],
        [125.32, 39.55],
        [124.74, 39.66],
        [124.27, 39.93]
      ],
      [
        [-7.45, 37.1],
        [-7.86, 36.84],
        [-8.38, 36.98],
        [-8.9, 36.87],
        [-8.75, 37.65],
        [-8.84, 38.27],
        [-9.29, 38.36],
        [-9.53, 38.74],
        [-9.45, 39.39],
        [-9.05, 39.76],
        [-8.98, 40.16],
        [-8.77, 40.76],
        [-8.79, 41.18],
        [-8.99, 41.54],
        [-9.03, 41.88]
      ],
      [
        [50.81, 24.75],
        [50.74, 25.48],
        [51.01, 26.01],
        [51.29, 26.11],
        [51.59, 25.8],
        [51.61, 25.22],
        [51.39, 24.63]
      ],
      [
        [51.39, 24.63],
        [51.11, 24.56],
        [50.81, 24.75]
      ],
      [
        [22.71, 47.88],
        [23.14, 48.1],
        [23.76, 47.99],
        [24.4, 47.98],
        [24.87, 47.74],
        [25.21, 47.89],
        [25.95, 47.99],
        [26.2, 48.22],
        [26.62, 48.22]
      ],
      [
        [28.23, 45.49],
        [28.68, 45.3],
        [29.15, 45.46],
        [29.6, 45.29]
      ],
      [
        [29.6, 45.29],
        [29.63, 45.04],
        [29.14, 44.82],
        [28.84, 44.91],
        [28.56, 43.71]
      ],
      [
        [22.66, 44.23],
        [22.47, 44.41],
        [22.71, 44.58],
        [22.46, 44.7],
        [22.15, 44.48],
        [21.56, 44.77],
        [21.48, 45.18],
        [20.87, 45.42],
        [20.76, 45.73],
        [20.22, 46.13]
      ],
      [
        [143.65, 50.75],
        [144.65, 48.98],
        [143.17, 49.31],
        [142.56, 47.86],
        [143.53, 46.84],
        [143.51, 46.14],
        [142.75, 46.74],
        [142.09, 45.97],
        [141.91, 46.81],
        [142.02, 47.78],
        [141.9, 48.86],
        [142.14, 49.62],
        [142.18, 50.95],
        [141.59, 51.94],
        [141.68, 53.3],
        [142.61, 53.76],
        [142.21, 54.23],
        [142.65, 54.37],
        [142.91, 53.7],
        [143.26, 52.74],
        [143.24, 51.76],
        [143.65, 50.75]
      ],
      [
        [19.66, 54.43],
        [19.89, 54.87],
        [21.27, 55.19]
      ],
      [
        [-175.01, 66.58],
        [-174.34, 66.34],
        [-174.57, 67.06],
        [-171.86, 66.91],
        [-169.9, 65.98],
        [-170.89, 65.54],
        [-172.53, 65.44],
        [-172.55, 64.46],
        [-172.96, 64.25],
        [-173.89, 64.28],
        [-174.65, 64.63],
        [-175.98, 64.92],
        [-176.21, 65.36],
        [-177.22, 65.52],
        [-178.36, 65.39],
        [-178.9, 65.74],
        [-178.69, 66.11],
        [-179.88, 65.87],
        [-179.43, 65.4],
        [-180, 64.98],
        [-180, 68.96],
        [-177.55, 68.2],
        [-174.93, 67.21],
        [-175.01, 66.58]
      ],
      [
        [180, 70.83],
        [178.9, 70.78],
        [178.73, 71.1],
        [180, 71.52],
        [180, 70.83]
      ],
      [
        [-178.69, 70.89],
        [-180, 70.83],
        [-180, 71.52],
        [-179.87, 71.56],
        [-179.02, 71.56],
        [-177.58, 71.27],
        [-177.66, 71.13],
        [-178.69, 70.89]
      ],
      [
        [143.6, 73.21],
        [142.09, 73.21],
        [140.04, 73.32],
        [139.86, 73.37],
        [140.81, 73.77],
        [142.06, 73.86],
        [143.48, 73.48],
        [143.6, 73.21]
      ],
      [
        [150.73, 75.08],
        [149.58, 74.69],
        [147.98, 74.78],
        [146.12, 75.17],
        [146.36, 75.5],
        [148.22, 75.35],
        [150.73, 75.08]
      ],
      [
        [145.09, 75.56],
        [144.3, 74.82],
        [140.61, 74.85],
        [138.96, 74.61],
        [136.97, 75.26],
        [137.51, 75.95],
        [138.83, 76.14],
        [141.47, 76.09],
        [145.09, 75.56]
      ],
      [
        [57.54, 70.72],
        [56.94, 70.63],
        [53.68, 70.76],
        [53.41, 71.21],
        [51.6, 71.47],
        [51.46, 72.01],
        [52.48, 72.23],
        [52.44, 72.77],
        [54.43, 73.63],
        [53.51, 73.75],
        [55.9, 74.63],
        [55.63, 75.08],
        [57.87, 75.61],
        [61.17, 76.25],
        [64.5, 76.44],
        [66.21, 76.81],
        [68.16, 76.94],
        [68.85, 76.54],
        [68.18, 76.23],
        [64.64, 75.74],
        [61.58, 75.26],
        [58.48, 74.31],
        [56.99, 73.33],
        [55.42, 72.37],
        [55.62, 71.54],
        [57.54, 70.72]
      ],
      [
        [131.29, 44.11],
        [131.03, 44.97],
        [131.88, 45.32]
      ],
      [
        [131.88, 45.32],
        [133.1, 45.14],
        [133.77, 46.12]
      ],
      [
        [133.77, 46.12],
        [134.11, 47.21],
        [134.5, 47.58],
        [135.03, 48.48]
      ],
      [
        [133.37, 48.18],
        [132.51, 47.79],
        [130.99, 47.79],
        [130.58, 48.73]
      ],
      [
        [129.4, 49.44],
        [127.66, 49.76],
        [127.29, 50.74]
      ],
      [
        [125.07, 53.16],
        [123.57, 53.46],
        [122.25, 53.43]
      ],
      [
        [120.73, 52.52],
        [120.74, 51.96],
        [120.18, 51.64],
        [119.28, 50.58],
        [119.29, 50.14]
      ],
      [
        [105.89, 50.41],
        [104.62, 50.28],
        [103.68, 50.09]
      ],
      [
        [103.68, 50.09],
        [102.26, 50.51],
        [102.07, 51.26],
        [100.89, 51.52]
      ],
      [
        [98.23, 50.42],
        [97.26, 49.73],
        [95.81, 49.98],
        [94.82, 50.01]
      ],
      [
        [94.15, 50.48],
        [93.1, 50.5],
        [92.23, 50.8]
      ],
      [
        [76.89, 54.49],
        [74.38, 53.55],
        [73.43, 53.49]
      ],
      [
        [68.17, 54.97],
        [65.67, 54.6],
        [65.18, 54.35]
      ],
      [
        [65.18, 54.35],
        [61.44, 54.01],
        [60.98, 53.66]
      ],
      [
        [59.64, 50.55],
        [58.36, 51.06],
        [56.78, 51.04],
        [55.72, 50.62],
        [54.53, 51.03]
      ],
      [
        [46.47, 48.39],
        [47.32, 47.72],
        [48.06, 47.74],
        [48.69, 47.08]
      ],
      [
        [48.69, 47.08],
        [48.59, 46.56],
        [49.1, 46.4]
      ],
      [
        [49.1, 46.4],
        [48.65, 45.81],
        [47.68, 45.64],
        [46.68, 44.61],
        [47.59, 43.66],
        [47.49, 42.99],
        [48.58, 41.81],
        [47.99, 41.41]
      ],
      [
        [46.4, 41.86],
        [45.78, 42.09],
        [45.47, 42.5]
      ],
      [
        [44.54, 42.71],
        [43.93, 42.55],
        [43.76, 42.74],
        [42.39, 43.22],
        [40.92, 43.38],
        [40.08, 43.55]
      ],
      [
        [39.96, 43.43],
        [38.68, 44.28],
        [37.54, 44.66],
        [36.68, 45.24],
        [37.4, 45.4],
        [38.23, 46.24],
        [37.67, 46.64],
        [39.15, 47.04],
        [39.12, 47.26],
        [38.22, 47.1]
      ],
      [
        [38.22, 47.1],
        [38.26, 47.55]
      ],
      [
        [38.26, 47.55],
        [38.77, 47.83],
        [39.74, 47.9]
      ],
      [
        [39.74, 47.9],
        [39.9, 48.23],
        [39.67, 48.78],
        [40.08, 49.31]
      ],
      [
        [40.08, 49.31],
        [40.07, 49.6],
        [38.59, 49.93]
      ],
      [
        [38.59, 49.93],
        [38.01, 49.92],
        [37.39, 50.38],
        [36.63, 50.23],
        [35.36, 50.58]
      ],
      [
        [35.36, 50.58],
        [35.38, 50.77],
        [35.02, 51.21]
      ],
      [
        [35.02, 51.21],
        [34.22, 51.26],
        [34.14, 51.57],
        [34.39, 51.77],
        [33.75, 52.34],
        [32.72, 52.24],
        [32.41, 52.29]
      ],
      [
        [32.41, 52.29],
        [32.16, 52.06],
        [31.79, 52.1],
        [31.54, 52.74]
      ],
      [
        [31.31, 53.07],
        [31.5, 53.17],
        [32.3, 53.13]
      ],
      [
        [27.72, 57.79],
        [27.42, 58.72],
        [28.13, 59.3]
      ],
      [
        [28.13, 59.3],
        [27.98, 59.48],
        [29.12, 60.03],
        [28.07, 60.5],
        [30.21, 61.78]
      ],
      [
        [28.59, 69.06],
        [29.4, 69.16],
        [31.1, 69.56],
        [32.13, 69.91],
        [33.78, 69.3],
        [36.51, 69.06],
        [40.29, 67.93],
        [41.06, 67.46],
        [41.13, 66.79],
        [40.02, 66.27],
        [38.38, 66],
        [33.92, 66.76],
        [33.18, 66.63],
        [34.81, 65.9],
        [34.88, 65.44],
        [34.94, 64.41],
        [36.23, 64.11],
        [37.01, 63.85],
        [37.14, 64.33],
        [36.54, 64.76],
        [37.18, 65.14],
        [39.59, 64.52],
        [40.44, 64.76],
        [39.76, 65.5],
        [42.09, 66.48],
        [43.02, 66.42],
        [43.95, 66.07],
        [44.53, 66.76],
        [43.7, 67.35],
        [44.19, 67.95],
        [43.45, 68.57],
        [46.25, 68.25],
        [46.82, 67.69],
        [45.56, 67.57],
        [45.56, 67.01],
        [46.35, 66.67],
        [47.89, 66.88],
        [48.14, 67.52],
        [50.23, 68],
        [53.72, 68.86],
        [54.47, 68.81],
        [53.49, 68.2],
        [54.73, 68.1],
        [55.44, 68.44],
        [57.32, 68.47],
        [58.8, 68.88],
        [59.94, 68.28],
        [61.08, 68.94],
        [60.03, 69.52],
        [60.55, 69.85],
        [63.5, 69.55],
        [64.89, 69.23],
        [68.51, 68.09],
        [69.18, 68.62],
        [68.16, 69.14],
        [68.14, 69.36],
        [66.93, 69.45],
        [67.26, 69.93],
        [66.72, 70.71],
        [66.69, 71.03],
        [68.54, 71.93],
        [69.2, 72.84],
        [69.94, 73.04],
        [72.59, 72.78],
        [72.8, 72.22],
        [71.85, 71.41],
        [72.47, 71.09],
        [72.79, 70.39],
        [72.56, 69.02],
        [73.67, 68.41],
        [73.24, 67.74],
        [71.28, 66.32],
        [72.42, 66.17],
        [72.82, 66.53],
        [73.92, 66.79],
        [74.19, 67.28],
        [75.05, 67.76],
        [74.47, 68.33],
        [74.94, 68.99],
        [73.84, 69.07],
        [73.6, 69.63],
        [74.4, 70.63],
        [73.1, 71.45],
        [74.89, 72.12],
        [74.66, 72.83],
        [75.16, 72.85],
        [75.68, 72.3],
        [75.29, 71.34],
        [76.36, 71.15],
        [75.9, 71.87],
        [77.58, 72.27],
        [79.65, 72.32],
        [81.5, 71.75],
        [80.61, 72.58],
        [80.51, 73.65],
        [82.25, 73.85],
        [84.66, 73.81],
        [86.82, 73.94],
        [86.01, 74.46],
        [87.17, 75.12],
        [88.32, 75.14],
        [90.26, 75.64],
        [92.9, 75.77],
        [93.23, 76.05],
        [95.86, 76.14],
        [96.68, 75.92],
        [98.92, 76.45],
        [100.76, 76.43],
        [101.04, 76.86],
        [101.99, 77.29],
        [104.35, 77.7],
        [106.07, 77.37],
        [104.71, 77.13],
        [106.97, 76.97],
        [107.24, 76.48],
        [108.15, 76.72],
        [111.08, 76.71],
        [113.33, 76.22],
        [114.13, 75.85],
        [113.89, 75.33],
        [112.78, 75.03],
        [110.15, 74.48],
        [109.4, 74.18],
        [110.64, 74.04],
        [112.12, 73.79],
        [113.02, 73.98],
        [113.53, 73.34],
        [113.97, 73.59],
        [115.57, 73.75],
        [118.78, 73.59],
        [119.02, 73.12],
        [123.2, 72.97],
        [123.26, 73.74],
        [125.38, 73.56],
        [126.98, 73.57],
        [128.59, 73.04],
        [129.05, 72.4],
        [128.46, 71.98],
        [129.72, 71.19],
        [131.29, 70.79],
        [132.25, 71.84],
        [133.86, 71.39],
        [135.56, 71.66],
        [137.5, 71.35],
        [138.23, 71.63],
        [139.87, 71.49],
        [139.15, 72.42],
        [140.47, 72.85],
        [149.5, 72.2],
        [150.35, 71.61],
        [152.97, 70.84],
        [157.01, 71.03],
        [159, 70.87],
        [159.83, 70.45],
        [159.71, 69.72],
        [160.94, 69.44],
        [162.28, 69.64],
        [164.05, 69.67],
        [165.94, 69.47],
        [167.84, 69.58],
        [169.58, 68.69],
        [170.82, 69.01],
        [170.01, 69.65],
        [170.45, 70.1],
        [173.64, 69.82],
        [175.72, 69.88],
        [178.6, 69.4],
        [180, 68.96],
        [180, 64.98],
        [179.99, 64.97],
        [178.71, 64.53],
        [177.41, 64.61],
        [178.31, 64.08],
        [178.91, 63.25],
        [179.37, 62.98],
        [179.49, 62.57],
        [179.23, 62.3],
        [177.36, 62.52],
        [174.57, 61.77],
        [173.68, 61.65],
        [172.15, 60.95],
        [170.7, 60.34],
        [170.33, 59.88],
        [168.9, 60.57],
        [166.29, 59.79],
        [165.84, 60.16],
        [164.88, 59.73],
        [163.54, 59.87],
        [163.22, 59.21],
        [162.02, 58.24],
        [162.05, 57.84],
        [163.19, 57.62],
        [163.06, 56.16],
        [162.13, 56.12],
        [161.7, 55.29],
        [162.12, 54.86],
        [160.37, 54.34],
        [160.02, 53.2],
        [158.53, 52.96],
        [158.23, 51.94],
        [156.79, 51.01],
        [156.42, 51.7],
        [155.99, 53.16],
        [155.43, 55.38],
        [155.91, 56.77],
        [156.76, 57.36],
        [156.81, 57.83],
        [158.36, 58.06],
        [160.15, 59.31],
        [161.87, 60.34],
        [163.67, 61.14],
        [164.47, 62.55],
        [163.26, 62.47],
        [162.66, 61.64],
        [160.12, 60.54],
        [159.3, 61.77],
        [156.72, 61.43],
        [154.22, 59.76],
        [155.04, 59.14],
        [152.81, 58.88],
        [151.27, 58.78],
        [151.34, 59.5],
        [149.78, 59.66],
        [148.54, 59.16],
        [145.49, 59.34],
        [142.2, 59.04],
        [138.96, 57.09],
        [135.13, 54.73],
        [136.7, 54.6],
        [137.19, 53.98],
        [138.16, 53.76],
        [138.8, 54.25],
        [139.9, 54.19],
        [141.35, 53.09],
        [141.38, 52.24],
        [140.6, 51.24],
        [140.51, 50.05],
        [140.06, 48.45],
        [138.55, 47],
        [138.22, 46.31],
        [136.86, 45.14],
        [135.52, 43.99],
        [134.87, 43.4],
        [133.54, 42.81],
        [132.91, 42.8],
        [132.28, 43.28],
        [130.94, 42.55],
        [130.78, 42.22],
        [130.64, 42.4],
        [130.63, 42.9]
      ],
      [
        [105.08, 78.31],
        [99.44, 77.92],
        [101.26, 79.23],
        [102.09, 79.35],
        [102.84, 79.28],
        [105.37, 78.71],
        [105.08, 78.31]
      ],
      [
        [51.14, 80.55],
        [49.79, 80.42],
        [48.89, 80.34],
        [48.75, 80.18],
        [47.59, 80.01],
        [46.5, 80.25],
        [47.07, 80.56],
        [44.85, 80.59],
        [46.8, 80.77],
        [48.32, 80.78],
        [48.52, 80.51],
        [49.1, 80.75],
        [50.04, 80.92],
        [51.52, 80.7],
        [51.14, 80.55]
      ],
      [
        [99.94, 78.88],
        [97.76, 78.76],
        [94.97, 79.04],
        [93.31, 79.43],
        [92.55, 80.14],
        [91.18, 80.34],
        [93.78, 81.02],
        [95.94, 81.25],
        [97.88, 80.75],
        [100.19, 79.78],
        [99.94, 78.88]
      ],
      [
        [30.42, -1.13],
        [30.82, -1.7],
        [30.76, -2.29]
      ],
      [
        [30.76, -2.29],
        [30.47, -2.41]
      ],
      [
        [29.58, -1.34],
        [29.82, -1.44],
        [30.42, -1.13]
      ],
      [
        [-17.06, 21],
        [-17.02, 21.41],
        [-16.98, 21.89],
        [-16.58, 22.16],
        [-16.26, 22.68],
        [-16.33, 23.02],
        [-15.99, 23.73],
        [-15.43, 24.36],
        [-15.09, 24.52],
        [-14.83, 25.1],
        [-14.8, 25.64],
        [-14.44, 26.25],
        [-13.78, 26.62],
        [-13.41, 27.2],
        [-13.26, 27.44],
        [-13.1, 27.6]
      ],
      [
        [42.78, 16.35],
        [42.65, 16.77],
        [42.35, 17.08],
        [42.27, 17.47],
        [41.75, 17.83],
        [41.22, 18.67],
        [40.94, 19.49],
        [40.25, 20.17],
        [39.8, 20.34],
        [39.14, 21.29],
        [39.02, 21.99],
        [39.07, 22.58],
        [38.49, 23.69],
        [38.02, 24.08],
        [37.48, 24.29],
        [37.15, 24.86],
        [37.21, 25.08],
        [36.93, 25.6],
        [36.64, 25.83],
        [36.25, 26.57],
        [35.64, 27.38],
        [35.13, 28.06],
        [34.63, 28.06],
        [34.79, 28.61],
        [34.83, 28.96],
        [34.96, 29.36]
      ],
      [
        [48.42, 28.55],
        [48.81, 27.69],
        [49.3, 27.46],
        [49.47, 27.11],
        [50.15, 26.69],
        [50.21, 26.28],
        [50.11, 25.94],
        [50.24, 25.61],
        [50.53, 25.33],
        [50.66, 25],
        [50.81, 24.75]
      ],
      [
        [51.39, 24.63],
        [51.58, 24.25]
      ],
      [
        [52, 19],
        [49.12, 18.62],
        [48.18, 18.17],
        [47.47, 17.12],
        [47, 16.95],
        [46.75, 17.28],
        [46.37, 17.23],
        [45.4, 17.33],
        [45.22, 17.43],
        [44.06, 17.41],
        [43.79, 17.32],
        [43.38, 17.58],
        [43.12, 17.09],
        [43.22, 16.67],
        [42.78, 16.35]
      ],
      [
        [33.96, 9.46],
        [33.82, 9.48],
        [33.84, 9.98],
        [33.72, 10.33],
        [33.21, 10.72],
        [33.09, 11.44],
        [33.21, 12.18],
        [32.74, 12.25],
        [32.67, 12.02],
        [32.07, 11.97],
        [32.31, 11.68],
        [32.4, 11.08],
        [31.85, 10.53],
        [31.35, 9.81],
        [30.84, 9.71],
        [30, 10.29],
        [29.62, 10.08],
        [29.52, 9.79],
        [29, 9.6],
        [28.97, 9.4],
        [27.97, 9.4],
        [27.83, 9.6],
        [27.11, 9.64],
        [26.75, 9.47],
        [26.48, 9.55],
        [25.96, 10.14],
        [25.79, 10.41],
        [25.07, 10.27],
        [24.79, 9.81],
        [24.54, 8.92],
        [24.19, 8.73],
        [23.89, 8.62]
      ],
      [
        [23.89, 8.62],
        [23.81, 8.67]
      ],
      [
        [22.86, 11.14],
        [22.88, 11.38],
        [22.51, 11.68],
        [22.5, 12.26],
        [22.29, 12.65],
        [21.94, 12.59],
        [22.04, 12.96],
        [22.3, 13.37],
        [22.18, 13.79],
        [22.51, 14.09],
        [22.3, 14.33],
        [22.57, 14.94],
        [23.02, 15.68],
        [23.89, 15.61],
        [23.84, 19.58]
      ],
      [
        [36.87, 22],
        [37.19, 21.02],
        [36.97, 20.84],
        [37.11, 19.81],
        [37.48, 18.61],
        [37.86, 18.37],
        [38.41, 18]
      ],
      [
        [36.85, 16.96],
        [36.75, 16.29],
        [36.32, 14.82],
        [36.43, 14.42]
      ],
      [
        [33.96, 9.58],
        [33.96, 9.46]
      ],
      [
        [33.96, 9.46],
        [33.97, 8.68]
      ],
      [
        [34.01, 4.25],
        [33.39, 3.79],
        [32.69, 3.79],
        [31.88, 3.56],
        [31.25, 3.78],
        [30.83, 3.51]
      ],
      [
        [30.83, 3.51],
        [29.95, 4.17],
        [29.72, 4.6]
      ],
      [
        [24.57, 8.23],
        [23.89, 8.62]
      ],
      [
        [-16.71, 13.59],
        [-17.13, 14.37],
        [-17.63, 14.73],
        [-17.19, 14.92],
        [-16.7, 15.62],
        [-16.46, 16.14]
      ],
      [
        [-16.68, 12.38],
        [-16.84, 13.15]
      ],
      [
        [162.12, -10.48],
        [162.4, -10.83],
        [161.7, -10.82],
        [161.32, -10.2],
        [161.92, -10.45],
        [162.12, -10.48]
      ],
      [
        [160.85, -9.87],
        [160.46, -9.9],
        [159.85, -9.79],
        [159.64, -9.64],
        [159.7, -9.24],
        [160.36, -9.4],
        [160.69, -9.61],
        [160.85, -9.87]
      ],
      [
        [161.68, -9.6],
        [161.53, -9.78],
        [160.79, -8.92],
        [160.58, -8.32],
        [160.92, -8.32],
        [161.28, -9.12],
        [161.68, -9.6]
      ],
      [
        [159.88, -8.34],
        [159.92, -8.54],
        [159.13, -8.11],
        [158.59, -7.75],
        [158.21, -7.42],
        [158.36, -7.32],
        [158.82, -7.56],
        [159.64, -8.02],
        [159.88, -8.34]
      ],
      [
        [157.54, -7.35],
        [157.34, -7.4],
        [156.9, -7.18],
        [156.49, -6.77],
        [156.54, -6.6],
        [157.14, -7.02],
        [157.54, -7.35]
      ],
      [
        [-11.44, 6.79],
        [-11.71, 6.86],
        [-12.43, 7.26],
        [-12.95, 7.8],
        [-13.12, 8.16],
        [-13.25, 8.9]
      ],
      [
        [-87.79, 13.38],
        [-87.9, 13.15],
        [-88.48, 13.16],
        [-88.84, 13.26],
        [-89.26, 13.46],
        [-89.81, 13.52],
        [-90.1, 13.74]
      ],
      [
        [47.79, 8],
        [46.95, 8],
        [43.68, 9.18]
      ],
      [
        [43.68, 9.18],
        [43.3, 9.54],
        [42.93, 10.02]
      ],
      [
        [43.15, 11.46],
        [43.47, 11.28],
        [43.67, 10.86],
        [44.12, 10.45],
        [44.61, 10.44],
        [45.56, 10.7],
        [46.65, 10.82],
        [47.53, 11.13],
        [48.02, 11.19],
        [48.38, 11.38],
        [48.95, 11.41],
        [48.94, 11.39],
        [48.95, 11.41],
        [49.27, 11.43],
        [49.73, 11.58],
        [50.26, 11.68],
        [50.73, 12.02],
        [51.11, 12.02],
        [51.13, 11.75],
        [51.04, 11.17],
        [51.05, 10.64],
        [50.83, 10.28],
        [50.55, 9.2],
        [50.07, 8.08],
        [49.45, 6.8],
        [48.59, 5.34],
        [47.74, 4.22],
        [46.56, 2.86],
        [45.56, 2.05],
        [44.07, 1.05],
        [43.14, 0.29],
        [42.04, -0.92],
        [41.81, -1.45],
        [41.59, -1.68]
      ],
      [
        [19.37, 44.86],
        [19.01, 44.86],
        [19.39, 45.24]
      ],
      [
        [19.07, 45.52],
        [18.83, 45.91],
        [19.6, 46.17]
      ],
      [
        [-57.15, 5.97],
        [-55.95, 5.77],
        [-55.84, 5.95],
        [-55.03, 6.03],
        [-53.96, 5.76]
      ],
      [
        [-54.4, 4.21],
        [-54.01, 3.62],
        [-54.18, 3.19],
        [-54.27, 2.73],
        [-54.52, 2.31]
      ],
      [
        [22.56, 49.09],
        [22.28, 48.83],
        [22.09, 48.42]
      ],
      [
        [13.72, 45.5],
        [13.94, 45.59]
      ],
      [
        [23.9, 66.01],
        [22.18, 65.72],
        [21.21, 65.03],
        [21.37, 64.41],
        [19.78, 63.61],
        [17.85, 62.75],
        [17.12, 61.34],
        [17.83, 60.64],
        [18.79, 60.08],
        [17.87, 58.95],
        [16.83, 58.72],
        [16.45, 57.04],
        [15.88, 56.1],
        [14.67, 56.2],
        [14.1, 55.41],
        [12.94, 55.36],
        [12.63, 56.31],
        [11.79, 57.44],
        [11.03, 58.86]
      ],
      [
        [32.07, -26.73],
        [31.87, -27.18],
        [31.28, -27.29],
        [30.69, -26.74],
        [30.68, -26.4],
        [30.95, -26.02],
        [31.04, -25.73],
        [31.33, -25.66],
        [31.84, -25.84]
      ],
      [
        [36, 34.64],
        [35.91, 35.41],
        [36.15, 35.82]
      ],
      [
        [36.15, 35.82],
        [36.42, 36.04],
        [36.69, 36.26],
        [36.74, 36.82],
        [37.07, 36.62],
        [38.17, 36.9],
        [38.7, 36.71],
        [39.52, 36.72],
        [40.67, 37.09],
        [41.21, 37.07],
        [42.35, 37.23]
      ],
      [
        [13.54, 14.37],
        [13.97, 15.68],
        [15.25, 16.63]
      ],
      [
        [15.49, 20.73],
        [15.47, 21.05],
        [15.1, 21.31]
      ],
      [
        [14.96, 11.56],
        [14.89, 12.22],
        [14.5, 12.86]
      ],
      [
        [1.87, 6.14],
        [1.06, 5.93]
      ],
      [
        [102.58, 12.19],
        [101.69, 12.65],
        [100.83, 12.63],
        [100.98, 13.41],
        [100.1, 13.41],
        [100.02, 12.31],
        [99.48, 10.85],
        [99.15, 9.96],
        [99.22, 9.24],
        [99.87, 9.21],
        [100.28, 8.3],
        [100.46, 7.43],
        [101.02, 6.86],
        [101.62, 6.74],
        [102.14, 6.22]
      ],
      [
        [100.09, 6.46],
        [99.69, 6.85],
        [99.52, 7.34],
        [98.99, 7.91],
        [98.5, 8.38],
        [98.34, 7.79],
        [98.15, 8.35],
        [98.26, 8.97],
        [98.55, 9.93]
      ],
      [
        [67.83, 37.14],
        [68.39, 38.16],
        [68.18, 38.9],
        [67.44, 39.14],
        [67.7, 39.58],
        [68.54, 39.53],
        [69.01, 40.09],
        [69.33, 40.73],
        [70.67, 40.96],
        [70.46, 40.5],
        [70.6, 40.22],
        [71.01, 40.24]
      ],
      [
        [53.92, 37.2],
        [53.74, 37.91],
        [53.88, 38.95],
        [53.1, 39.29],
        [53.36, 39.98],
        [52.69, 40.03],
        [52.92, 40.88],
        [53.86, 40.63],
        [54.74, 40.95],
        [54.01, 41.55],
        [53.72, 42.12],
        [52.92, 41.87],
        [52.81, 41.14],
        [52.5, 41.78]
      ],
      [
        [55.97, 41.31],
        [57.1, 41.32],
        [56.93, 41.83],
        [57.79, 42.17],
        [58.63, 42.75],
        [59.98, 42.22],
        [60.08, 41.43],
        [60.47, 41.22],
        [61.55, 41.27],
        [61.88, 41.08],
        [62.37, 40.05],
        [63.52, 39.36],
        [64.17, 38.89],
        [65.22, 38.4],
        [66.55, 37.97],
        [66.52, 37.36]
      ],
      [
        [124.97, -8.89],
        [125.09, -8.66],
        [125.95, -8.43],
        [126.64, -8.4],
        [126.96, -8.27],
        [127.34, -8.4],
        [126.97, -8.67],
        [125.93, -9.11],
        [125.09, -9.39]
      ],
      [
        [-61.68, 10.76],
        [-61.1, 10.89],
        [-60.89, 10.86],
        [-60.93, 10.11],
        [-61.77, 10],
        [-61.95, 10.09],
        [-61.66, 10.37],
        [-61.68, 10.76]
      ],
      [
        [8.42, 36.95],
        [9.51, 37.35],
        [10.21, 37.23],
        [10.18, 36.72],
        [11.03, 37.09],
        [11.1, 36.9],
        [10.6, 36.41],
        [10.59, 35.95],
        [10.94, 35.7],
        [10.81, 34.83],
        [10.15, 34.33],
        [10.34, 33.79],
        [10.86, 33.77],
        [11.11, 33.29],
        [11.49, 33.14]
      ],
      [
        [44.23, 37.97],
        [44.77, 37.17]
      ],
      [
        [36.15, 35.82],
        [35.78, 36.27],
        [36.16, 36.65],
        [35.55, 36.57],
        [34.71, 36.8],
        [34.03, 36.22],
        [32.51, 36.11],
        [31.7, 36.64],
        [30.62, 36.68],
        [30.39, 36.26],
        [29.7, 36.14],
        [28.73, 36.68],
        [27.64, 36.66],
        [27.05, 37.65],
        [26.32, 38.21],
        [26.8, 38.99],
        [26.17, 39.46],
        [27.28, 40.42],
        [28.82, 40.46],
        [29.24, 41.22],
        [31.15, 41.09],
        [32.35, 41.74],
        [33.51, 42.02],
        [35.17, 42.04],
        [36.91, 41.34],
        [38.35, 40.95],
        [39.51, 41.1],
        [40.37, 41.01],
        [41.55, 41.54]
      ],
      [
        [28, 42.01],
        [28.12, 41.62],
        [28.99, 41.3],
        [28.81, 41.05],
        [27.62, 41],
        [27.19, 40.69],
        [26.36, 40.15],
        [26.04, 40.62],
        [26.06, 40.82]
      ],
      [
        [121.78, 24.39],
        [121.18, 22.79],
        [120.75, 21.97],
        [120.22, 22.81],
        [120.11, 23.56],
        [120.69, 24.54],
        [121.5, 25.3],
        [121.95, 25],
        [121.78, 24.39]
      ],
      [
        [39.2, -4.68],
        [38.74, -5.91],
        [38.8, -6.48],
        [39.44, -6.84],
        [39.47, -7.1],
        [39.19, -7.7],
        [39.25, -8.01],
        [39.19, -8.49],
        [39.54, -9.11],
        [39.95, -10.1],
        [40.32, -10.32],
        [39.52, -10.9],
        [38.43, -11.29]
      ],
      [
        [38.43, -11.29],
        [37.83, -11.27],
        [37.47, -11.57],
        [36.78, -11.59]
      ],
      [
        [34.56, -11.52],
        [34.28, -10.16],
        [33.94, -9.69]
      ],
      [
        [33.94, -9.69],
        [33.74, -9.42],
        [32.76, -9.23]
      ],
      [
        [32.76, -9.23],
        [32.19, -8.93],
        [31.56, -8.76],
        [31.16, -8.59]
      ],
      [
        [31.16, -8.59],
        [30.74, -8.34],
        [30.2, -7.08],
        [29.62, -6.52],
        [29.42, -5.94]
      ],
      [
        [29.75, -4.45],
        [30.12, -4.09],
        [30.51, -3.57],
        [30.75, -3.36],
        [30.74, -3.03],
        [30.53, -2.81],
        [30.47, -2.41],
        [30.76, -2.29]
      ],
      [
        [30.42, -1.13],
        [30.77, -1.01],
        [31.87, -1.03],
        [33.9, -0.95]
      ],
      [
        [29.59, -0.59],
        [29.82, -0.21],
        [29.88, 0.6]
      ],
      [
        [31.17, 2.2],
        [30.77, 2.34],
        [30.83, 3.51]
      ],
      [
        [31.79, 52.1],
        [32.16, 52.06],
        [32.41, 52.29]
      ],
      [
        [35.02, 51.21],
        [35.38, 50.77],
        [35.36, 50.58]
      ],
      [
        [38.59, 49.93],
        [40.07, 49.6],
        [40.08, 49.31]
      ],
      [
        [40.08, 49.31],
        [39.67, 48.78],
        [39.9, 48.23],
        [39.74, 47.9]
      ],
      [
        [39.74, 47.9],
        [38.77, 47.83],
        [38.26, 47.55]
      ],
      [
        [38.22, 47.1],
        [37.43, 47.02],
        [36.76, 46.7],
        [35.82, 46.65],
        [34.96, 46.27],
        [35.02, 45.65],
        [35.51, 45.41],
        [36.53, 45.47],
        [36.33, 45.11],
        [35.24, 44.94],
        [33.88, 44.36],
        [33.33, 44.56],
        [33.55, 45.03],
        [32.45, 45.33],
        [32.63, 45.52],
        [33.59, 45.85],
        [33.3, 46.08],
        [31.74, 46.33],
        [31.68, 46.71],
        [30.75, 46.58],
        [30.38, 46.03],
        [29.6, 45.29]
      ],
      [
        [-53.37, -33.77],
        [-53.81, -34.4],
        [-54.94, -34.95],
        [-55.67, -34.75],
        [-56.22, -34.86],
        [-57.14, -34.43],
        [-57.82, -34.46],
        [-58.43, -33.91]
      ],
      [
        [-155.54, 19.08],
        [-155.69, 18.92],
        [-155.94, 19.06],
        [-155.91, 19.34],
        [-156.07, 19.7],
        [-156.02, 19.81],
        [-155.85, 19.98],
        [-155.92, 20.17],
        [-155.86, 20.27],
        [-155.79, 20.25],
        [-155.4, 20.08],
        [-155.22, 19.99],
        [-155.06, 19.86],
        [-154.81, 19.51],
        [-154.83, 19.45],
        [-155.22, 19.24],
        [-155.54, 19.08]
      ],
      [
        [-156.08, 20.64],
        [-156.41, 20.57],
        [-156.59, 20.78],
        [-156.7, 20.86],
        [-156.71, 20.93],
        [-156.61, 21.01],
        [-156.26, 20.92],
        [-156, 20.76],
        [-156.08, 20.64]
      ],
      [
        [-156.76, 21.18],
        [-156.79, 21.07],
        [-157.33, 21.1],
        [-157.25, 21.22],
        [-156.76, 21.18]
      ],
      [
        [-157.65, 21.32],
        [-157.71, 21.26],
        [-157.78, 21.28],
        [-158.13, 21.31],
        [-158.25, 21.54],
        [-158.29, 21.58],
        [-158.03, 21.72],
        [-157.94, 21.65],
        [-157.65, 21.32]
      ],
      [
        [-159.35, 21.98],
        [-159.46, 21.88],
        [-159.8, 22.07],
        [-159.75, 22.14],
        [-159.6, 22.24],
        [-159.37, 22.21],
        [-159.35, 21.98]
      ],
      [
        [-67.14, 45.14],
        [-66.96, 44.81],
        [-68.03, 44.33],
        [-69.06, 43.98],
        [-70.12, 43.68],
        [-70.65, 43.09],
        [-70.81, 42.87],
        [-70.82, 42.34],
        [-70.49, 41.81],
        [-70.08, 41.78],
        [-70.18, 42.15],
        [-69.88, 41.92],
        [-69.97, 41.64],
        [-70.64, 41.48],
        [-71.12, 41.49],
        [-71.86, 41.32],
        [-72.29, 41.27],
        [-72.88, 41.22],
        [-73.71, 40.93],
        [-72.24, 41.12],
        [-71.94, 40.93],
        [-73.34, 40.63],
        [-73.98, 40.63],
        [-73.95, 40.75],
        [-74.26, 40.47],
        [-73.96, 40.43],
        [-74.18, 39.71],
        [-74.91, 38.94],
        [-74.98, 39.2],
        [-75.2, 39.25],
        [-75.53, 39.5],
        [-75.32, 38.96],
        [-75.07, 38.78],
        [-75.06, 38.4],
        [-75.38, 38.02],
        [-75.94, 37.22],
        [-76.03, 37.26],
        [-75.72, 37.94],
        [-76.23, 38.32],
        [-76.35, 39.15],
        [-76.54, 38.72],
        [-76.33, 38.08],
        [-76.99, 38.24],
        [-76.3, 37.92],
        [-76.26, 36.97],
        [-75.97, 36.9],
        [-75.87, 36.55],
        [-75.73, 35.55],
        [-76.36, 34.81],
        [-77.4, 34.51],
        [-78.05, 33.93],
        [-78.55, 33.86],
        [-79.06, 33.49],
        [-79.2, 33.16],
        [-80.3, 32.51],
        [-80.86, 32.03],
        [-81.34, 31.44],
        [-81.49, 30.73],
        [-81.31, 30.04],
        [-80.98, 29.18],
        [-80.54, 28.47],
        [-80.53, 28.04],
        [-80.06, 26.88],
        [-80.09, 26.21],
        [-80.13, 25.82],
        [-80.38, 25.21],
        [-80.68, 25.08],
        [-81.17, 25.2],
        [-81.33, 25.64],
        [-81.71, 25.87],
        [-82.24, 26.73],
        [-82.71, 27.5],
        [-82.86, 27.89],
        [-82.65, 28.55],
        [-82.93, 29.1],
        [-83.71, 29.94],
        [-84.1, 30.09],
        [-85.11, 29.64],
        [-85.29, 29.69],
        [-85.77, 30.15],
        [-86.4, 30.4],
        [-87.53, 30.27],
        [-88.42, 30.38],
        [-89.18, 30.32],
        [-89.59, 30.16],
        [-89.41, 29.89],
        [-89.43, 29.49],
        [-89.22, 29.29],
        [-89.41, 29.16],
        [-89.78, 29.31],
        [-90.15, 29.12],
        [-90.88, 29.15],
        [-91.63, 29.68],
        [-92.5, 29.55],
        [-93.23, 29.78],
        [-93.85, 29.71],
        [-94.69, 29.48],
        [-95.6, 28.74],
        [-96.59, 28.31],
        [-97.14, 27.83],
        [-97.37, 27.38],
        [-97.38, 26.69],
        [-97.33, 26.21],
        [-97.14, 25.87],
        [-97.53, 25.84]
      ],
      [
        [-117.13, 32.54],
        [-117.3, 33.05],
        [-117.94, 33.62],
        [-118.41, 33.74],
        [-118.52, 34.03],
        [-119.08, 34.08],
        [-119.44, 34.35],
        [-120.37, 34.45],
        [-120.62, 34.61],
        [-120.74, 35.16],
        [-121.71, 36.16],
        [-122.55, 37.55],
        [-122.51, 37.78],
        [-122.95, 38.11],
        [-123.73, 38.95],
        [-123.87, 39.77],
        [-124.4, 40.31],
        [-124.18, 41.14],
        [-124.21, 42],
        [-124.53, 42.77],
        [-124.14, 43.71],
        [-124.02, 44.62],
        [-123.9, 45.52],
        [-124.08, 46.86],
        [-124.4, 47.72],
        [-124.69, 48.18],
        [-124.57, 48.38],
        [-123.12, 48.04],
        [-122.59, 47.1],
        [-122.34, 47.36],
        [-122.5, 48.18],
        [-122.84, 49]
      ],
      [
        [-153.01, 57.12],
        [-154.01, 56.73],
        [-154.52, 56.99],
        [-154.67, 57.46],
        [-153.76, 57.82],
        [-153.23, 57.97],
        [-152.56, 57.9],
        [-152.14, 57.59],
        [-153.01, 57.12]
      ],
      [
        [-165.58, 59.91],
        [-166.19, 59.75],
        [-166.85, 59.94],
        [-167.46, 60.21],
        [-166.47, 60.38],
        [-165.67, 60.29],
        [-165.58, 59.91]
      ],
      [
        [-171.73, 63.78],
        [-171.11, 63.59],
        [-170.49, 63.69],
        [-169.68, 63.43],
        [-168.69, 63.3],
        [-168.77, 63.19],
        [-169.53, 62.98],
        [-170.29, 63.19],
        [-170.67, 63.38],
        [-171.55, 63.32],
        [-171.79, 63.41],
        [-171.73, 63.78]
      ],
      [
        [-134.27, 58.86],
        [-133.36, 58.41],
        [-132.73, 57.69]
      ],
      [
        [-130.01, 55.92],
        [-129.98, 55.28],
        [-130.54, 54.8],
        [-131.09, 55.18],
        [-131.97, 55.5],
        [-132.25, 56.37],
        [-133.54, 57.18],
        [-134.08, 58.12],
        [-135.04, 58.19],
        [-136.63, 58.21],
        [-137.8, 58.5],
        [-139.87, 59.54],
        [-140.83, 59.73],
        [-142.57, 60.08],
        [-143.96, 60],
        [-145.93, 60.46],
        [-147.11, 60.88],
        [-148.22, 60.67],
        [-148.02, 59.98],
        [-148.57, 59.91],
        [-149.73, 59.71],
        [-150.61, 59.37],
        [-151.72, 59.16],
        [-151.86, 59.74],
        [-151.41, 60.73],
        [-150.35, 61.03],
        [-150.62, 61.28],
        [-151.9, 60.73],
        [-152.58, 60.06],
        [-154.02, 59.35],
        [-153.29, 58.86],
        [-154.23, 58.15],
        [-155.31, 57.73],
        [-156.31, 57.42],
        [-156.56, 56.98],
        [-158.12, 56.46],
        [-158.43, 55.99],
        [-159.6, 55.57],
        [-160.29, 55.64],
        [-161.22, 55.36],
        [-162.24, 55.02],
        [-163.07, 54.69],
        [-164.79, 54.4],
        [-164.94, 54.57],
        [-163.85, 55.04],
        [-162.87, 55.35],
        [-161.8, 55.89],
        [-160.56, 56.01],
        [-160.07, 56.42],
        [-158.68, 57.02],
        [-158.46, 57.22],
        [-157.72, 57.57],
        [-157.55, 58.33],
        [-157.04, 58.92],
        [-158.19, 58.62],
        [-158.52, 58.79],
        [-159.06, 58.42],
        [-159.71, 58.93],
        [-159.98, 58.57],
        [-160.36, 59.07],
        [-161.36, 58.67],
        [-161.97, 58.67],
        [-162.05, 59.27],
        [-161.87, 59.63],
        [-162.52, 59.99],
        [-163.82, 59.8],
        [-164.66, 60.27],
        [-165.35, 60.51],
        [-165.35, 61.07],
        [-166.12, 61.5],
        [-165.73, 62.07],
        [-164.92, 62.63],
        [-164.56, 63.15],
        [-163.75, 63.22],
        [-163.07, 63.06],
        [-162.26, 63.54],
        [-161.53, 63.46],
        [-160.77, 63.77],
        [-160.96, 64.22],
        [-161.52, 64.4],
        [-160.78, 64.79],
        [-161.39, 64.78],
        [-162.45, 64.56],
        [-162.76, 64.34],
        [-163.55, 64.56],
        [-164.96, 64.45],
        [-166.43, 64.69],
        [-166.85, 65.09],
        [-168.11, 65.67],
        [-166.71, 66.09],
        [-164.47, 66.58],
        [-163.65, 66.58],
        [-163.79, 66.08],
        [-161.68, 66.12],
        [-162.49, 66.74],
        [-163.72, 67.12],
        [-164.43, 67.62],
        [-165.39, 68.04],
        [-166.76, 68.36],
        [-166.2, 68.88],
        [-164.43, 68.92],
        [-163.17, 69.37],
        [-162.93, 69.86],
        [-161.91, 70.33],
        [-160.93, 70.45],
        [-159.04, 70.89],
        [-158.12, 70.82],
        [-156.58, 71.36],
        [-155.07, 71.15],
        [-154.34, 70.7],
        [-153.9, 70.89],
        [-152.21, 70.83],
        [-152.27, 70.6],
        [-150.74, 70.43],
        [-149.72, 70.53],
        [-147.61, 70.21],
        [-145.69, 70.12],
        [-144.92, 69.99],
        [-143.59, 70.15],
        [-142.07, 69.85],
        [-140.99, 69.71],
        [-140.99, 69.71],
        [-140.99, 66],
        [-141, 60.31],
        [-140.01, 60.28],
        [-139.04, 60],
        [-138.34, 59.56]
      ],
      [
        [-71.33, 11.78],
        [-71.36, 11.54],
        [-71.95, 11.42],
        [-71.62, 10.97],
        [-71.63, 10.45],
        [-72.07, 9.87],
        [-71.7, 9.07],
        [-71.26, 9.14],
        [-71.04, 9.86],
        [-71.35, 10.21],
        [-71.4, 10.97],
        [-70.16, 11.38],
        [-70.29, 11.85],
        [-69.94, 12.16],
        [-69.58, 11.46],
        [-68.88, 11.44],
        [-68.23, 10.89],
        [-68.19, 10.55],
        [-67.3, 10.55],
        [-66.23, 10.65],
        [-65.66, 10.2],
        [-64.89, 10.08],
        [-64.33, 10.39],
        [-64.32, 10.64],
        [-63.08, 10.7],
        [-61.88, 10.72],
        [-62.73, 10.42],
        [-62.39, 9.95],
        [-61.59, 9.87],
        [-60.83, 9.38],
        [-60.67, 8.58],
        [-60.15, 8.6],
        [-59.76, 8.37]
      ],
      [
        [108.05, 21.55],
        [106.72, 20.7],
        [105.88, 19.75],
        [105.66, 19.06],
        [106.43, 18],
        [107.36, 16.7],
        [108.27, 16.08],
        [108.88, 15.28],
        [109.34, 13.43],
        [109.2, 11.67],
        [108.37, 11.01],
        [107.22, 10.36],
        [106.41, 9.53],
        [105.16, 8.6],
        [104.8, 9.24],
        [105.08, 9.92],
        [104.33, 10.49]
      ],
      [
        [167.84, -16.47],
        [167.52, -16.6],
        [167.18, -16.16],
        [167.22, -15.89],
        [167.84, -16.47]
      ],
      [
        [167.11, -14.93],
        [167.27, -15.74],
        [167, -15.61],
        [166.79, -15.67],
        [166.65, -15.39],
        [166.63, -14.63],
        [167.11, -14.93]
      ],
      [
        [53.11, 16.65],
        [52.39, 16.38],
        [52.19, 15.94],
        [52.17, 15.6],
        [51.17, 15.18],
        [49.57, 14.71],
        [48.68, 14],
        [48.24, 13.95],
        [47.94, 14.01],
        [47.35, 13.59],
        [46.72, 13.4],
        [45.88, 13.35],
        [45.63, 13.29],
        [45.41, 13.03],
        [45.14, 12.95],
        [44.99, 12.7],
        [44.49, 12.72],
        [44.18, 12.59],
        [43.48, 12.64],
        [43.22, 13.22],
        [43.25, 13.77],
        [43.09, 14.06],
        [42.89, 14.8],
        [42.6, 15.21],
        [42.81, 15.26],
        [42.7, 15.72],
        [42.82, 15.91],
        [42.78, 16.35]
      ],
      [
        [29.43, -22.09],
        [29.84, -22.1],
        [30.32, -22.27],
        [30.66, -22.15],
        [31.19, -22.25]
      ],
      [
        [32.83, -26.74],
        [32.58, -27.47],
        [32.46, -28.3],
        [32.2, -28.75],
        [31.52, -29.26],
        [31.33, -29.4],
        [30.9, -29.91],
        [30.62, -30.42],
        [30.06, -31.14],
        [28.93, -32.17],
        [28.22, -32.77],
        [27.46, -33.23],
        [26.42, -33.61],
        [25.91, -33.67],
        [25.78, -33.94],
        [25.17, -33.8],
        [24.68, -33.99],
        [23.59, -33.79],
        [22.99, -33.92],
        [22.57, -33.86],
        [21.54, -34.26],
        [20.69, -34.42],
        [20.07, -34.8],
        [19.62, -34.82],
        [19.19, -34.46],
        [18.86, -34.44],
        [18.42, -34],
        [18.38, -34.14],
        [18.24, -33.87],
        [18.25, -33.28],
        [17.93, -32.61],
        [18.25, -32.43],
        [18.22, -31.66],
        [17.57, -30.73],
        [17.06, -29.88],
        [17.06, -29.88],
        [16.34, -28.58]
      ],
      [
        [30.27, -15.51],
        [29.52, -15.64],
        [28.95, -16.04],
        [28.83, -16.39],
        [28.47, -16.47],
        [27.6, -17.29],
        [27.04, -17.94],
        [26.71, -17.96],
        [26.38, -17.85],
        [25.26, -17.74]
      ],
      [
        [30.74, -8.34],
        [31.16, -8.59]
      ],
      [
        [-24.32, 14.85],
        [-24.39, 14.81],
        [-24.46, 14.83],
        [-24.54, 14.92],
        [-24.5, 14.97],
        [-24.39, 15.02],
        [-24.36, 15],
        [-24.32, 14.92],
        [-24.32, 14.85]
      ],
      [
        [-23.2, 15.13],
        [-23.24, 15.13],
        [-23.28, 15.18],
        [-23.28, 15.25],
        [-23.24, 15.32],
        [-23.17, 15.32],
        [-23.13, 15.26],
        [-23.13, 15.16],
        [-23.2, 15.13]
      ],
      [
        [-23.46, 15],
        [-23.53, 14.9],
        [-23.67, 14.92],
        [-23.82, 15.07],
        [-23.82, 15.16],
        [-23.78, 15.23],
        [-23.78, 15.32],
        [-23.71, 15.32],
        [-23.71, 15.26],
        [-23.56, 15.13],
        [-23.46, 15]
      ],
      [
        [-22.95, 16.24],
        [-22.84, 16.2],
        [-22.77, 16.22],
        [-22.7, 16.17],
        [-22.7, 16.1],
        [-22.74, 16.03],
        [-22.84, 15.98],
        [-22.92, 15.98],
        [-22.99, 16.03],
        [-22.92, 16.13],
        [-22.95, 16.24]
      ],
      [
        [-24.1, 16.62],
        [-24.07, 16.57],
        [-24.1, 16.55],
        [-24.25, 16.58],
        [-24.28, 16.57],
        [-24.36, 16.48],
        [-24.43, 16.6],
        [-24.43, 16.65],
        [-24.39, 16.67],
        [-24.28, 16.64],
        [-24.1, 16.62]
      ],
      [
        [-22.92, 16.65],
        [-22.95, 16.6],
        [-22.99, 16.67],
        [-23.02, 16.79],
        [-22.95, 16.83],
        [-22.92, 16.83],
        [-22.92, 16.65]
      ],
      [
        [-24.9, 16.81],
        [-25.04, 16.79],
        [-25.11, 16.83],
        [-25.08, 16.86],
        [-24.97, 16.91],
        [-24.9, 16.84],
        [-24.9, 16.81]
      ],
      [
        [-25.18, 16.93],
        [-25.29, 16.91],
        [-25.33, 16.93],
        [-25.33, 17],
        [-25.36, 17.05],
        [-25.36, 17.09],
        [-25.15, 17.19],
        [-25.04, 17.17],
        [-25, 17.09],
        [-25.04, 17.04],
        [-25.18, 16.93]
      ],
      [
        [43.76, -12.32],
        [43.65, -12.36],
        [43.62, -12.29],
        [43.62, -12.25],
        [43.69, -12.27],
        [43.76, -12.32]
      ],
      [
        [44.45, -12.1],
        [44.52, -12.24],
        [44.52, -12.34],
        [44.48, -12.36],
        [44.45, -12.34],
        [44.37, -12.25],
        [44.19, -12.18],
        [44.27, -12.17],
        [44.3, -12.18],
        [44.37, -12.17],
        [44.37, -12.13],
        [44.41, -12.1],
        [44.45, -12.1]
      ],
      [
        [43.44, -11.91],
        [43.44, -11.92],
        [43.29, -11.85],
        [43.22, -11.77],
        [43.22, -11.44],
        [43.26, -11.4],
        [43.33, -11.39],
        [43.37, -11.42],
        [43.37, -11.63],
        [43.44, -11.77],
        [43.47, -11.87],
        [43.44, -11.91]
      ],
      [
        [57.62, -20.5],
        [57.52, -20.52],
        [57.37, -20.52],
        [57.3, -20.47],
        [57.34, -20.41],
        [57.34, -20.34],
        [57.37, -20.24],
        [57.41, -20.19],
        [57.48, -20.15],
        [57.48, -20.07],
        [57.55, -20.01],
        [57.62, -20],
        [57.73, -20.1],
        [57.77, -20.22],
        [57.77, -20.34],
        [57.7, -20.38],
        [57.7, -20.45],
        [57.62, -20.5]
      ],
      [
        [55.54, -4.7],
        [55.54, -4.79],
        [55.46, -4.77],
        [55.46, -4.7],
        [55.39, -4.67],
        [55.36, -4.61],
        [55.43, -4.56],
        [55.54, -4.7]
      ],
      [
        [50.6, 25.87],
        [50.57, 25.8],
        [50.53, 25.82],
        [50.46, 25.96],
        [50.46, 26.05],
        [50.42, 26.18],
        [50.46, 26.22],
        [50.57, 26.24],
        [50.53, 26.18],
        [50.6, 26.12],
        [50.6, 25.87]
      ],
      [
        [73.39, 3.22],
        [73.36, 3.23],
        [73.36, 3.27],
        [73.39, 3.28],
        [73.43, 3.27],
        [73.43, 3.23],
        [73.39, 3.22]
      ],
      [
        [73.5, 4.15],
        [73.47, 4.15],
        [73.47, 4.21],
        [73.5, 4.22],
        [73.5, 4.15]
      ],
      [
        [169.63, 5.82],
        [169.59, 5.85],
        [169.63, 5.94],
        [169.67, 5.92],
        [169.63, 5.82]
      ],
      [
        [171.07, 7.12],
        [171.22, 7.07],
        [171.36, 7.1],
        [171.36, 7.09],
        [171.25, 7.05],
        [171.22, 7.05],
        [171.07, 7.1],
        [171.07, 7.12]
      ],
      [
        [162.97, 5.32],
        [162.97, 5.26],
        [162.9, 5.3],
        [162.93, 5.33],
        [162.97, 5.32]
      ],
      [
        [158.29, 6.81],
        [158.25, 6.77],
        [158.18, 6.79],
        [158.15, 6.88],
        [158.11, 6.9],
        [158.11, 6.93],
        [158.18, 6.97],
        [158.29, 6.95],
        [158.33, 6.88],
        [158.29, 6.84],
        [158.29, 6.81]
      ],
      [
        [151.63, 7.33],
        [151.59, 7.35],
        [151.59, 7.38],
        [151.63, 7.38],
        [151.63, 7.33]
      ],
      [
        [151.88, 7.42],
        [151.85, 7.42],
        [151.85, 7.45],
        [151.88, 7.45],
        [151.88, 7.42]
      ],
      [
        [138.13, 9.5],
        [138.13, 9.57],
        [138.16, 9.59],
        [138.2, 9.54],
        [138.16, 9.5],
        [138.13, 9.5]
      ],
      [
        [166.89, -0.52],
        [166.93, -0.5],
        [166.97, -0.52],
        [166.97, -0.55],
        [166.93, -0.55],
        [166.89, -0.55],
        [166.89, -0.53],
        [166.89, -0.52]
      ],
      [
        [134.56, 7.36],
        [134.53, 7.35],
        [134.49, 7.43],
        [134.49, 7.52],
        [134.53, 7.59],
        [134.6, 7.61],
        [134.6, 7.49],
        [134.56, 7.43],
        [134.56, 7.36]
      ],
      [
        [-171.47, -14.06],
        [-171.76, -14.06],
        [-171.9, -14.01],
        [-171.94, -14.01],
        [-172.04, -13.92],
        [-172.08, -13.87],
        [-172.01, -13.83],
        [-171.86, -13.82],
        [-171.61, -13.89],
        [-171.58, -13.96],
        [-171.54, -13.96],
        [-171.47, -13.99],
        [-171.47, -14.06]
      ],
      [
        [-172.37, -13.47],
        [-172.22, -13.57],
        [-172.19, -13.69],
        [-172.26, -13.82],
        [-172.33, -13.78],
        [-172.51, -13.82],
        [-172.55, -13.8],
        [-172.76, -13.59],
        [-172.8, -13.52],
        [-172.69, -13.54],
        [-172.51, -13.49],
        [-172.37, -13.47]
      ],
      [
        [103.56, 1.19],
        [103.67, 1.42],
        [103.72, 1.46],
        [103.86, 1.47],
        [104, 1.42],
        [104.08, 1.43],
        [104.08, 1.36],
        [104.13, 1.27]
      ],
      [
        [-174.92, -21.32],
        [-174.92, -21.46],
        [-175, -21.39],
        [-175, -21.35],
        [-174.92, -21.32]
      ],
      [
        [-175.18, -21.18],
        [-175.14, -21.14],
        [-175.1, -21.18],
        [-175.18, -21.26],
        [-175.21, -21.23],
        [-175.36, -21.16],
        [-175.32, -21.13],
        [-175.25, -21.13],
        [-175.18, -21.18]
      ],
      [
        [-173.99, -18.64],
        [-174.02, -18.71],
        [-174.1, -18.64],
        [-174.02, -18.57],
        [-173.95, -18.59],
        [-173.95, -18.63],
        [-173.99, -18.64]
      ],
      [
        [178.31, -8.03],
        [178.38, -7.93],
        [178.45, -7.97],
        [178.38, -8.09],
        [178.31, -8.03]
      ],
      [
        [178.67, -7.46],
        [178.7, -7.48],
        [178.67, -7.5],
        [178.67, -7.46]
      ],
      [
        [179.14, -8.42],
        [179.17, -8.43],
        [179.21, -8.52],
        [179.1, -8.59],
        [179.1, -8.63],
        [179.06, -8.64],
        [179.06, -8.59],
        [179.03, -8.52],
        [179.1, -8.43],
        [179.14, -8.42]
      ],
      [
        [179.86, -9.35],
        [179.86, -9.37],
        [179.89, -9.39],
        [179.86, -9.44],
        [179.86, -9.42],
        [179.82, -9.37],
        [179.82, -9.35],
        [179.86, -9.35]
      ],
      [
        [176.98, -12.46],
        [177.16, -12.48],
        [177.16, -12.53],
        [177.01, -12.51],
        [176.98, -12.46]
      ],
      [
        [177.16, -7.25],
        [177.12, -7.18],
        [177.16, -7.2],
        [177.16, -7.25]
      ],
      [
        [176.08, -5.64],
        [176.11, -5.66],
        [176.15, -5.71],
        [176.11, -5.67],
        [176.04, -5.64],
        [176.08, -5.64]
      ],
      [
        [-61.73, 17.04],
        [-61.76, 16.98],
        [-61.87, 17],
        [-61.91, 17.05],
        [-61.91, 17.09],
        [-61.84, 17.16],
        [-61.69, 17.09],
        [-61.69, 17.05],
        [-61.73, 17.04]
      ],
      [
        [-61.76, 17.57],
        [-61.76, 17.54],
        [-61.87, 17.59],
        [-61.87, 17.71],
        [-61.76, 17.66],
        [-61.76, 17.57]
      ],
      [
        [-59.5, 13.08],
        [-59.53, 13.06],
        [-59.64, 13.09],
        [-59.68, 13.15],
        [-59.68, 13.3],
        [-59.6, 13.3],
        [-59.46, 13.15],
        [-59.5, 13.08]
      ],
      [
        [-61.3, 15.25],
        [-61.4, 15.21],
        [-61.44, 15.39],
        [-61.51, 15.52],
        [-61.48, 15.59],
        [-61.48, 15.63],
        [-61.33, 15.58],
        [-61.3, 15.52],
        [-61.26, 15.37],
        [-61.3, 15.25]
      ],
      [
        [-61.73, 12],
        [-61.76, 12.04],
        [-61.76, 12.1],
        [-61.69, 12.23],
        [-61.62, 12.21],
        [-61.66, 12.05],
        [-61.73, 12]
      ],
      [
        [-62.56, 17.1],
        [-62.59, 17.09],
        [-62.63, 17.12],
        [-62.63, 17.19],
        [-62.59, 17.19],
        [-62.56, 17.16],
        [-62.56, 17.1]
      ],
      [
        [-62.66, 17.23],
        [-62.74, 17.28],
        [-62.81, 17.3],
        [-62.84, 17.33],
        [-62.84, 17.38],
        [-62.81, 17.4],
        [-62.74, 17.35],
        [-62.7, 17.28],
        [-62.66, 17.26],
        [-62.66, 17.23]
      ],
      [
        [-60.9, 13.81],
        [-60.97, 13.7],
        [-61.08, 13.77],
        [-61.08, 13.91],
        [-61.01, 14],
        [-60.97, 14.07],
        [-60.94, 14.08],
        [-60.9, 14],
        [-60.9, 13.81]
      ],
      [
        [-61.19, 13.15],
        [-61.22, 13.13],
        [-61.3, 13.2],
        [-61.3, 13.29],
        [-61.22, 13.32],
        [-61.19, 13.35],
        [-61.15, 13.35],
        [-61.15, 13.2],
        [-61.19, 13.15]
      ],
      [
        [1.42, 42.59],
        [1.49, 42.63],
        [1.57, 42.63],
        [1.71, 42.57],
        [1.71, 42.52],
        [1.67, 42.49],
        [1.46, 42.42],
        [1.42, 42.44],
        [1.42, 42.49],
        [1.39, 42.52],
        [1.42, 42.59]
      ],
      [
        [9.61, 47.06],
        [9.56, 47.05]
      ],
      [
        [9.49, 47.18],
        [9.53, 47.27],
        [9.58, 47.21]
      ],
      [
        [14.56, 35.84],
        [14.53, 35.8],
        [14.42, 35.82],
        [14.35, 35.86],
        [14.35, 35.98],
        [14.53, 35.87],
        [14.56, 35.84]
      ],
      [
        [7.43, 43.74],
        [7.36, 43.72],
        [7.36, 43.75],
        [7.43, 43.74]
      ],
      [
        [12.37, 43.93],
        [12.44, 43.98],
        [12.51, 43.95],
        [12.48, 43.89],
        [12.4, 43.89],
        [12.37, 43.93]
      ],
      [
        [-157.42, 2.02],
        [-157.39, 1.99],
        [-157.32, 1.97],
        [-157.31, 1.97],
        [-157.31, 1.96],
        [-157.32, 1.95],
        [-157.32, 1.95],
        [-157.34, 1.94],
        [-157.34, 1.93],
        [-157.34, 1.91],
        [-157.35, 1.86],
        [-157.33, 1.84],
        [-157.29, 1.82],
        [-157.25, 1.8],
        [-157.24, 1.78],
        [-157.22, 1.77],
        [-157.21, 1.77],
        [-157.19, 1.76],
        [-157.18, 1.75],
        [-157.17, 1.73],
        [-157.18, 1.72],
        [-157.19, 1.72],
        [-157.2, 1.72],
        [-157.21, 1.71],
        [-157.22, 1.71],
        [-157.24, 1.71],
        [-157.25, 1.71],
        [-157.25, 1.72],
        [-157.26, 1.73],
        [-157.27, 1.73],
        [-157.28, 1.75],
        [-157.29, 1.75],
        [-157.31, 1.75],
        [-157.41, 1.78],
        [-157.45, 1.8],
        [-157.48, 1.83],
        [-157.51, 1.85],
        [-157.53, 1.86],
        [-157.54, 1.86],
        [-157.55, 1.86],
        [-157.57, 1.86],
        [-157.58, 1.88],
        [-157.58, 1.91],
        [-157.57, 1.91],
        [-157.54, 1.93],
        [-157.53, 1.93],
        [-157.52, 1.93],
        [-157.52, 1.92],
        [-157.52, 1.92],
        [-157.53, 1.92],
        [-157.55, 1.9],
        [-157.55, 1.88],
        [-157.54, 1.87],
        [-157.53, 1.86],
        [-157.51, 1.87],
        [-157.5, 1.87],
        [-157.5, 1.86],
        [-157.49, 1.85],
        [-157.48, 1.85],
        [-157.45, 1.85],
        [-157.43, 1.84],
        [-157.43, 1.84],
        [-157.44, 1.85],
        [-157.45, 1.86],
        [-157.46, 1.86],
        [-157.47, 1.87],
        [-157.48, 1.88],
        [-157.46, 1.88],
        [-157.45, 1.88],
        [-157.45, 1.88],
        [-157.45, 1.9],
        [-157.44, 1.89],
        [-157.43, 1.88],
        [-157.43, 1.87],
        [-157.42, 1.86],
        [-157.41, 1.86],
        [-157.41, 1.87],
        [-157.41, 1.88],
        [-157.42, 1.9],
        [-157.43, 1.91],
        [-157.42, 1.92],
        [-157.42, 1.93],
        [-157.41, 1.92],
        [-157.4, 1.92],
        [-157.41, 1.94],
        [-157.39, 1.94],
        [-157.39, 1.93],
        [-157.4, 1.92],
        [-157.39, 1.91],
        [-157.38, 1.9],
        [-157.38, 1.91],
        [-157.37, 1.91],
        [-157.36, 1.92],
        [-157.36, 1.92],
        [-157.35, 1.93],
        [-157.35, 1.94],
        [-157.36, 1.95],
        [-157.36, 1.95],
        [-157.38, 1.96],
        [-157.41, 1.97],
        [-157.45, 1.99],
        [-157.45, 2],
        [-157.46, 2],
        [-157.47, 2.01],
        [-157.48, 2.02],
        [-157.48, 2.01],
        [-157.49, 2],
        [-157.5, 2],
        [-157.51, 2.01],
        [-157.51, 2.02],
        [-157.5, 2.03],
        [-157.47, 2.03],
        [-157.42, 2.02]
      ],
      [
        [6.66, 0.42],
        [6.77, 0.28],
        [6.66, 0.12],
        [6.53, 0.02],
        [6.46, 0.21],
        [6.49, 0.31],
        [6.66, 0.42]
      ]
    ],
    "bbox": [-180, -55.61183, 180, 83.64513]
  }
  ;