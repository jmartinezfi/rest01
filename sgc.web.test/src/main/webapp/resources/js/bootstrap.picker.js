//! moment.js

;
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        global.moment = factory()
}(this, (function() {
    'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return (Object.getOwnPropertyNames(obj).length === 0);
        } else {
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function(fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function(i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !== 'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function() {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and
												// space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function(obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L'
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function(val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({ unit: u, priority: priorities[u] });
        }
        units.sort(function(a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token: 'M'
    // padded: ['MM', 2]
    // ordinal: 'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function() {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function() {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function() {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function(mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1 = /\d/; // 0 - 9
    var match2 = /\d\d/; // 00 - 99
    var match3 = /\d{3}/; // 000 - 999
    var match4 = /\d{4}/; // 0000 - 9999
    var match6 = /[+-]?\d{6}/; // -999999 - 999999
    var match1to2 = /\d\d?/; // 0 - 99
    var match3to4 = /\d\d\d\d?/; // 999 - 9999
    var match5to6 = /\d\d\d\d\d\d?/; // 99999 - 999999
    var match1to3 = /\d{1,3}/; // 0 - 999
    var match1to4 = /\d{1,4}/; // 0 - 9999
    var match1to6 = /[+-]?\d{1,6}/; // -999999 - 999999

    var matchUnsigned = /\d+/; // 0 - inf
    var matchSigned = /[+-]?\d+/; // -inf - inf

    var matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00
														// +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in
	// arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    var regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function(isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from
	// http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function(input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function(input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function() {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function() {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function(input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function(input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function(input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function(input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function makeGetSet(unit, keepTime) {
        return function(value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            } else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function() {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function(format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function(format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function(isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function(isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function(input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function(input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date = new Date(y, m, d, h, M, s, ms);

        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4
			// for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function(input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6 // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function(format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function(format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function(format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function(isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function(isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function(isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function(input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function(input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');

    function localeWeekdays(m, format) {
        if (!m) {
            return isArray(this._weekdays) ? this._weekdays :
                this._weekdays['standalone'];
        }
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');

    function localeWeekdaysShort(m) {
        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');

    function localeWeekdaysMin(m) {
        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function() {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function() {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function() {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function() {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function(input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function(input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function(input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function(input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function(input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings
		// like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the
	// list trying each
    // substring from most specific to least, but move to the next array item if
	// it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    // the next array item is better than a shallower substring
					// of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                var aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale. If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if ((typeof console !== 'undefined') && console.warn) {
                    // warn user if arguments are passed but the locale could
					// not be set
                    console.warn('Locale ' + key + ' not found. Did you forget to load it?');
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale, parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function(x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, tmpLocale, parentConfig = baseConfig;
            // MERGE
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            // short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11 ? MONTH :
                a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR] < 0 || a[HOUR] > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE :
                a[SECOND] < 0 || a[SECOND] > 59 ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the
	// lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i, date, input = [],
            currentDate, expectedWeekday, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        // compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        // if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends
			// on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or
	// 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see
	// https://tools.ietf.org/html/rfc2822#section-3.3
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10)
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces
		// with a single space
        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an indepentent
			// day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    var obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10);
            var m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i));
        if (match) {
            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function(config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function() {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function() {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent
		// circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or
		// `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            // 'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that
			// format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            // or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function(obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function(obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function() {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function() {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function() {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; // using 1000 * 60 * 60 instead of 36e5 to
									// avoid floating point rounding errors
									// https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function() {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function(input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10', '00']
    // '-1530' > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk = matches[matches.length - 1] || [];
        var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
            0 :
            parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function() {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from
	// http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign // the
																		// millisecond
																		// decimal
																		// point
																		// is
																		// included
																		// in
																		// the
																		// match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : (match[1] === '+') ? 1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign)
            };
        } else if (duration == null) { // checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = { milliseconds: 0, months: 0 };

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function(val, period) {
            var dur, tmp;
            // invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                    'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val;
                val = period;
                period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1(time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or
		// not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that,
            zoneDelta,
            output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        // check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true;
        var m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }

    /**
	 * Return a human readable representation of a moment that can also be
	 * evaluated to get a new moment which is the same
	 * 
	 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
	 */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
                createLocal(time).isValid())) {
            return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
                createLocal(time).isValid())) {
            return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance. Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function(key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    function startOf(units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf(units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function valueOf() {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function() {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function() {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function(input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function(input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function(input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function(isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
            (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
            locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function(input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function(input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function() {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function() {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function() {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function() {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function() {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function() {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function() {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function() {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports

    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds;
        var days = this._days;
        var months = this._months;
        var data = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math
			// errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function() {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds = makeAs('s');
    var asMinutes = makeAs('m');
    var asHours = makeAs('h');
    var asDays = makeAs('d');
    var asWeeks = makeAs('w');
    var asMonths = makeAs('M');
    var asYears = makeAs('y');

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function() {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds = makeGetter('seconds');
    var minutes = makeGetter('minutes');
    var hours = makeGetter('hours');
    var days = makeGetter('days');
    var months = makeGetter('months');
    var years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44, // a few seconds to seconds
        s: 45, // seconds to minute
        m: 45, // minutes to hour
        h: 22, // hours to day
        d: 26, // days to month
        M: 11 // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and
	// moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds = round(duration.as('s'));
        var minutes = round(duration.as('m'));
        var hours = round(duration.as('h'));
        var days = round(duration.as('d'));
        var months = round(duration.as('M'));
        var years = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds] ||
            seconds < thresholds.s && ['ss', seconds] ||
            minutes <= 1 && ['m'] ||
            minutes < thresholds.m && ['mm', minutes] ||
            hours <= 1 && ['h'] ||
            hours < thresholds.h && ['hh', hours] ||
            days <= 1 && ['d'] ||
            days < thresholds.d && ['dd', days] ||
            months <= 1 && ['M'] ||
            months < thresholds.M && ['MM', months] ||
            years <= 1 && ['y'] || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time
	// strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return ((x > 0) - (x < 0)) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        // * milliseconds bubble up until they become hours
        // * days do not bubble at all
        // * months bubble up until they become years
        // This is because there is no context-free conversion between hours and
		// days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days = abs$1(this._days);
        var months = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;


        // inspired by
		// https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        var totalSign = total < 0 ? '-' : '';
        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return totalSign + 'P' +
            (Y ? ymSign + Y + 'Y' : '') +
            (M ? ymSign + M + 'M' : '') +
            (D ? daysSign + D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? hmsSign + h + 'H' : '') +
            (m ? hmsSign + m + 'M' : '') +
            (s ? hmsSign + s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function(input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function(input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.22.2';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input
														// type="datetime-local"
														// step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input
														// type="datetime-local"
														// step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'YYYY-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM' // <input type="month" />
    };

    return hooks;

})));

// =====================================================================================================
// =====================================================================================================
// =====================================================================================================
// =====================================================================================================

// ! moment.js locale configuration

;
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' &&
        typeof require === 'function' ? factory(require('../moment')) :
        typeof define === 'function' && define.amd ? define(['../moment'], factory) :
        factory(global.moment)
}(this, (function(moment) {
    'use strict';


    var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
        monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

    var monthsParse = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
    var monthsRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

    var es = moment.defineLocale('es', {
        months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
        monthsShort: function(m, format) {
            if (!m) {
                return monthsShortDot;
            } else if (/-MMM-/.test(format)) {
                return monthsShort[m.month()];
            } else {
                return monthsShortDot[m.month()];
            }
        },
        monthsRegex: monthsRegex,
        monthsShortRegex: monthsRegex,
        monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
        monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
        monthsParse: monthsParse,
        longMonthsParse: monthsParse,
        shortMonthsParse: monthsParse,
        weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
        weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
        weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY H:mm',
            LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
        },
        calendar: {
            sameDay: function() {
                return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextDay: function() {
                return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextWeek: function() {
                return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastDay: function() {
                return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastWeek: function() {
                return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            sameElse: 'L'
        },
        relativeTime: {
            future: 'en %s',
            past: 'hace %s',
            s: 'unos segundos',
            ss: '%d segundos',
            m: 'un minuto',
            mm: '%d minutos',
            h: 'una hora',
            hh: '%d horas',
            d: 'un día',
            dd: '%d días',
            M: 'un mes',
            MM: '%d meses',
            y: 'un año',
            yy: '%d años'
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: '%dº',
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4 // The week that contains Jan 4th is the first week of the
					// year.
        }
    });

    return es;

})));

// =====================================================================================================
// =====================================================================================================
// =====================================================================================================
// =====================================================================================================

/*
 * @preserve Tempus Dominus Bootstrap4 v5.1.0
 * (https://tempusdominus.github.io/bootstrap-4/) Copyright 2016-2018 Jonathan
 * Peterson Licensed under MIT
 * (https://github.com/tempusdominus/bootstrap-3/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
    throw new Error('Tempus Dominus Bootstrap4\'s requires jQuery. jQuery must be included before Tempus Dominus Bootstrap4\'s JavaScript.');
}

+

function($) {
    var version = $.fn.jquery.split(' ')[0].split('.');
    if ((version[0] < 2 && version[1] < 9) || (version[0] === 1 && version[1] === 9 && version[2] < 1) || (version[0] >= 4)) {
        throw new Error('Tempus Dominus Bootstrap4\'s requires at least jQuery v3.0.0 but less than v4.0.0');
    }
}(jQuery);


if (typeof moment === 'undefined') {
    throw new Error('Tempus Dominus Bootstrap4\'s requires moment.js. Moment.js must be included before Tempus Dominus Bootstrap4\'s JavaScript.');
}

var version = moment.version.split('.')
if ((version[0] <= 2 && version[1] < 17) || (version[0] >= 3)) {
    throw new Error('Tempus Dominus Bootstrap4\'s requires at least moment.js v2.17.0 but less than v3.0.0');
}

+

function() {

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    var _createClass = function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; };
    }();

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); }
        subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    // ReSharper disable once InconsistentNaming
    var DateTimePicker = function($, moment) {
        // ReSharper disable InconsistentNaming
        var NAME = 'datetimepicker',
            DATA_KEY = '' + NAME,
            EVENT_KEY = '.' + DATA_KEY,
            DATA_API_KEY = '.data-api',
            Selector = {
                DATA_TOGGLE: '[data-toggle="' + DATA_KEY + '"]'
            },
            ClassName = {
                INPUT: NAME + '-input'
            },
            Event = {
                CHANGE: 'change' + EVENT_KEY,
                BLUR: 'blur' + EVENT_KEY,
                KEYUP: 'keyup' + EVENT_KEY,
                KEYDOWN: 'keydown' + EVENT_KEY,
                FOCUS: 'focus' + EVENT_KEY,
                CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY,
                // emitted
                UPDATE: 'update' + EVENT_KEY,
                ERROR: 'error' + EVENT_KEY,
                HIDE: 'hide' + EVENT_KEY,
                SHOW: 'show' + EVENT_KEY
            },
            DatePickerModes = [{
                CLASS_NAME: 'days',
                NAV_FUNCTION: 'M',
                NAV_STEP: 1
            }, {
                CLASS_NAME: 'months',
                NAV_FUNCTION: 'y',
                NAV_STEP: 1
            }, {
                CLASS_NAME: 'years',
                NAV_FUNCTION: 'y',
                NAV_STEP: 10
            }, {
                CLASS_NAME: 'decades',
                NAV_FUNCTION: 'y',
                NAV_STEP: 100
            }],
            KeyMap = {
                'up': 38,
                38: 'up',
                'down': 40,
                40: 'down',
                'left': 37,
                37: 'left',
                'right': 39,
                39: 'right',
                'tab': 9,
                9: 'tab',
                'escape': 27,
                27: 'escape',
                'enter': 13,
                13: 'enter',
                'pageUp': 33,
                33: 'pageUp',
                'pageDown': 34,
                34: 'pageDown',
                'shift': 16,
                16: 'shift',
                'control': 17,
                17: 'control',
                'space': 32,
                32: 'space',
                't': 84,
                84: 't',
                'delete': 46,
                46: 'delete'
            },
            ViewModes = ['times', 'days', 'months', 'years', 'decades'],
            keyState = {},
            keyPressHandled = {};

        var MinViewModeNumber = 0,
            Default = {
                timeZone: '',
                format: false,
                dayViewHeaderFormat: 'MMMM YYYY',
                extraFormats: false,
                stepping: 1,
                minDate: false,
                maxDate: false,
                useCurrent: true,
                collapse: true,
                locale: moment.locale(),
                defaultDate: false,
                disabledDates: false,
                enabledDates: false,
                icons: {
                    time: 'fa fa-clock-o',
                    date: 'fa fa-calendar',
                    up: 'fa fa-arrow-up',
                    down: 'fa fa-arrow-down',
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                    today: 'fa fa-calendar-check-o',
                    clear: 'fa fa-delete',
                    close: 'fa fa-times'
                },
                // tooltips: {
                // today: 'Go to today',
                // clear: 'Clear selection',
                // close: 'Close the picker',
                // selectMonth: 'Select Month',
                // prevMonth: 'Previous Month',
                // nextMonth: 'Next Month',
                // selectYear: 'Select Year',
                // prevYear: 'Previous Year',
                // nextYear: 'Next Year',
                // selectDecade: 'Select Decade',
                // prevDecade: 'Previous Decade',
                // nextDecade: 'Next Decade',
                // prevCentury: 'Previous Century',
                // nextCentury: 'Next Century',
                // pickHour: 'Pick Hour',
                // incrementHour: 'Increment Hour',
                // decrementHour: 'Decrement Hour',
                // pickMinute: 'Pick Minute',
                // incrementMinute: 'Increment Minute',
                // decrementMinute: 'Decrement Minute',
                // pickSecond: 'Pick Second',
                // incrementSecond: 'Increment Second',
                // decrementSecond: 'Decrement Second',
                // togglePeriod: 'Toggle Period',
                // selectTime: 'Select Time',
                // selectDate: 'Select Date'
                // },
                tooltips: {
                    today: 'Hoy',
                    clear: 'Limpiar sección',
                    close: 'Cerrar',
                    selectMonth: 'Seleccionar Mes',
                    prevMonth: 'Mes Anterior',
                    nextMonth: 'Mes Siguiente',
                    selectYear: 'Seleccionar Año',
                    prevYear: 'Año Anterior',
                    nextYear: 'Año Siguiente',
                    selectDecade: 'Seleccionar Década',
                    prevDecade: 'Década Anterior',
                    nextDecade: 'Década Siguiente',
                    prevCentury: 'Siglo Anterior',
                    nextCentury: 'Siglo Siguiente',
                    pickHour: 'Seleccionar Hora',
                    incrementHour: 'Incrementar Hora',
                    decrementHour: 'Disminuir Hora',
                    pickMinute: 'Seleccionar Minuto',
                    incrementMinute: 'Incrementar Minuto',
                    decrementMinute: 'Disminuir Minuto',
                    pickSecond: 'Seleccionar Segundo',
                    incrementSecond: 'Incrementar Segundo',
                    decrementSecond: 'Disminuir Segundo',
                    togglePeriod: 'Cambiar Perioro',
                    selectTime: 'Seleccionar Tiempo',
                    selectDate: 'Seleccionar Fecha'
                },
                useStrict: false,
                sideBySide: false,
                daysOfWeekDisabled: false,
                calendarWeeks: false,
                viewMode: 'days',
                toolbarPlacement: 'default',
                buttons: {
                    showToday: false,
                    showClear: false,
                    showClose: false
                },
                widgetPositioning: {
                    horizontal: 'auto',
                    vertical: 'auto'
                },
                widgetParent: null,
                ignoreReadonly: false,
                keepOpen: false,
                focusOnShow: true,
                inline: false,
                keepInvalid: false,
                keyBinds: {
                    up: function up() {
                        if (!this.widget) {
                            return false;
                        }
                        var d = this._dates[0] || this.getMoment();
                        if (this.widget.find('.datepicker').is(':visible')) {
                            this.date(d.clone().subtract(7, 'd'));
                        } else {
                            this.date(d.clone().add(this.stepping(), 'm'));
                        }
                        return true;
                    },
                    down: function down() {
                        if (!this.widget) {
                            this.show();
                            return false;
                        }
                        var d = this._dates[0] || this.getMoment();
                        if (this.widget.find('.datepicker').is(':visible')) {
                            this.date(d.clone().add(7, 'd'));
                        } else {
                            this.date(d.clone().subtract(this.stepping(), 'm'));
                        }
                        return true;
                    },
                    'control up': function controlUp() {
                        if (!this.widget) {
                            return false;
                        }
                        var d = this._dates[0] || this.getMoment();
                        if (this.widget.find('.datepicker').is(':visible')) {
                            this.date(d.clone().subtract(1, 'y'));
                        } else {
                            this.date(d.clone().add(1, 'h'));
                        }
                        return true;
                    },
                    'control down': function controlDown() {
                        if (!this.widget) {
                            return false;
                        }
                        var d = this._dates[0] || this.getMoment();
                        if (this.widget.find('.datepicker').is(':visible')) {
                            this.date(d.clone().add(1, 'y'));
                        } else {
                            this.date(d.clone().subtract(1, 'h'));
                        }
                        return true;
                    },
                    left: function left() {
                        if (!this.widget) {
                            return false;
                        }
                        var d = this._dates[0] || this.getMoment();
                        if (this.widget.find('.datepicker').is(':visible')) {
                            this.date(d.clone().subtract(1, 'd'));
                        }
                        return true;
                    },
                    right: function right() {
                        if (!this.widget) {
                            return false;
                        }
                        var d = this._dates[0] || this.getMoment();
                        if (this.widget.find('.datepicker').is(':visible')) {
                            this.date(d.clone().add(1, 'd'));
                        }
                        return true;
                    },
                    pageUp: function pageUp() {
                        if (!this.widget) {
                            return false;
                        }
                        var d = this._dates[0] || this.getMoment();
                        if (this.widget.find('.datepicker').is(':visible')) {
                            this.date(d.clone().subtract(1, 'M'));
                        }
                        return true;
                    },
                    pageDown: function pageDown() {
                        if (!this.widget) {
                            return false;
                        }
                        var d = this._dates[0] || this.getMoment();
                        if (this.widget.find('.datepicker').is(':visible')) {
                            this.date(d.clone().add(1, 'M'));
                        }
                        return true;
                    },
                    enter: function enter() {
                        if (!this.widget) {
                            return false;
                        }
                        this.hide();
                        return true;
                    },
                    escape: function escape() {
                        if (!this.widget) {
                            return false;
                        }
                        this.hide();
                        return true;
                    },
                    'control space': function controlSpace() {
                        if (!this.widget) {
                            return false;
                        }
                        if (this.widget.find('.timepicker').is(':visible')) {
                            this.widget.find('.btn[data-action="togglePeriod"]').click();
                        }
                        return true;
                    },
                    t: function t() {
                        if (!this.widget) {
                            return false;
                        }
                        this.date(this.getMoment());
                        return true;
                    },
                    'delete': function _delete() {
                        if (!this.widget) {
                            return false;
                        }
                        this.clear();
                        return true;
                    }
                },
                debug: false,
                allowInputToggle: false,
                disabledTimeIntervals: false,
                disabledHours: false,
                enabledHours: false,
                viewDate: false,
                allowMultidate: false,
                multidateSeparator: ','
            };

        // ReSharper restore InconsistentNaming

        // ReSharper disable once DeclarationHides
        // ReSharper disable once InconsistentNaming

        var DateTimePicker = function() {
            /** @namespace eData.dateOptions */
            /** @namespace moment.tz */

            function DateTimePicker(element, options) {
                _classCallCheck(this, DateTimePicker);

                this._options = this._getOptions(options);
                this._element = element;
                this._dates = [];
                this._datesFormatted = [];
                this._viewDate = null;
                this.unset = true;
                this.component = false;
                this.widget = false;
                this.use24Hours = null;
                this.actualFormat = null;
                this.parseFormats = null;
                this.currentViewMode = null;

                this._int();
            }

            /**
			 * @return {string}
			 */


            // private

            DateTimePicker.prototype._int = function _int() {
                var targetInput = this._element.data('target-input');
                if (this._element.is('input')) {
                    this.input = this._element;
                } else if (targetInput !== undefined) {
                    if (targetInput === 'nearest') {
                        this.input = this._element.find('input');
                    } else {
                        this.input = $(targetInput);
                    }
                }

                this._dates = [];
                this._dates[0] = this.getMoment();
                this._viewDate = this.getMoment().clone();

                $.extend(true, this._options, this._dataToOptions());

                this.options(this._options);

                this._initFormatting();

                if (this.input !== undefined && this.input.is('input') && this.input.val().trim().length !== 0) {
                    this._setValue(this._parseInputDate(this.input.val().trim()), 0);
                } else if (this._options.defaultDate && this.input !== undefined && this.input.attr('placeholder') === undefined) {
                    this._setValue(this._options.defaultDate, 0);
                }
                if (this._options.inline) {
                    this.show();
                }
            };

            DateTimePicker.prototype._update = function _update() {
                if (!this.widget) {
                    return;
                }
                this._fillDate();
                this._fillTime();
            };

            DateTimePicker.prototype._setValue = function _setValue(targetMoment, index) {
                var oldDate = this.unset ? null : this._dates[index];
                var outpValue = '';
                // case of calling setValue(null or false)
                if (!targetMoment) {
                    if (!this._options.allowMultidate || this._dates.length === 1) {
                        this.unset = true;
                        this._dates = [];
                        this._datesFormatted = [];
                    } else {
                        outpValue = this._element.data('date') + ',';
                        outpValue = outpValue.replace(oldDate.format(this.actualFormat) + ',', '').replace(',,', '').replace(/,\s*$/, '');
                        this._dates.splice(index, 1);
                        this._datesFormatted.splice(index, 1);
                    }
                    if (this.input !== undefined) {
                    	if(this.input.val() != outpValue){
                        this.input.val(outpValue);
                        // debugger;
                        this.input.trigger('input');
                        // ini:mpalacin
                        var vueAtr = this.input.attr("vue-model");
                        if(vueAtr){
                        	setterPath(vueAtr,(outpValue == ""?null:outpValue));
                        }
                        if (this.input[0].parentElement.MaterialTextfield) this.input[0].parentElement.MaterialTextfield.updateClasses_();
                        // fin:mpalacin
                    	}
                    }
                    this._element.data('date', outpValue);
                    this._notifyEvent({
                        type: DateTimePicker.Event.CHANGE,
                        date: false,
                        oldDate: oldDate
                    });
                    this._update();
                    return;
                }

                targetMoment = targetMoment.clone().locale(this._options.locale);

                if (this._hasTimeZone()) {
                    targetMoment.tz(this._options.timeZone);
                }

                if (this._options.stepping !== 1) {
                    targetMoment.minutes(Math.round(targetMoment.minutes() / this._options.stepping) * this._options.stepping).seconds(0);
                }

                if (this._isValid(targetMoment)) {
                    this._dates[index] = targetMoment;
                    this._datesFormatted[index] = targetMoment.format('YYYY-MM-DD');
                    this._viewDate = targetMoment.clone();
                    if (this._options.allowMultidate && this._dates.length > 1) {
                        for (var i = 0; i < this._dates.length; i++) {
                            outpValue += '' + this._dates[i].format(this.actualFormat) + this._options.multidateSeparator;
                        }
                        outpValue = outpValue.replace(/,\s*$/, '');
                    } else {
                        outpValue = this._dates[index].format(this.actualFormat);
                    }
                   
                    if (this.input !== undefined) {
                    	 // debugger;
                    	 // console.log("valor old:" + this.input.val() + " | valor new:"+outpValue );
                    	 if(this.input.val() != outpValue){
                    		// console.log("entro...");
	                        this.input.val(outpValue);
	                        // debugger;
	                        this.input.trigger('input');
	                        this.input.trigger('change');
	                        // ini:mpalacin
	                        var vueAtr = this.input.attr("vue-model");
	                        if(vueAtr){
	                        	var valCurrent = getterPath(vueAtr);
	                        	if(valCurrent != outpValue) setterPath(vueAtr,(outpValue == ""?null:outpValue));
	                        }
	                        if (this.input[0].parentElement.MaterialTextfield) this.input[0].parentElement.MaterialTextfield.updateClasses_();
                        // fin:mpalacin
                        }
                    }
                    this._element.data('date', outpValue);

                    this.unset = false;
					// this._update();
					// this._notifyEvent({
					// type: DateTimePicker.Event.CHANGE,
					// date: this._dates[index].clone(),
					// oldDate: oldDate
					// });
                } else {
                    if (!this._options.keepInvalid) {
                        if (this.input !== undefined) {
                        	if(this.input.val() != outpValue){
                            this.input.val('' + (this.unset ? '' : this._dates[index].format(this.actualFormat)));
                            // debugger;
                            this.input.trigger('input');
                            // ini:mpalacin
                            var vueAtr = this.input.attr("vue-model");
                            if(vueAtr){
                            	setterPath(vueAtr,(outpValue == ""?null:outpValue));
                            }
                            if (this.input[0].parentElement.MaterialTextfield) this.input[0].parentElement.MaterialTextfield.updateClasses_();
                            // fin:mpalacin
                        	}
                        }
                    } else {
                        this._notifyEvent({
                            type: DateTimePicker.Event.CHANGE,
                            date: targetMoment,
                            oldDate: oldDate
                        });
                    }
                    this._notifyEvent({
                        type: DateTimePicker.Event.ERROR,
                        date: targetMoment,
                        oldDate: oldDate
                    });
                }
            };

            DateTimePicker.prototype._change = function _change(e) {
                var val = $(e.target).val().trim(),
                    parsedDate = val ? this._parseInputDate(val) : null;
                this._setValue(parsedDate);
                e.stopImmediatePropagation();
                return false;
            };

            // noinspection JSMethodCanBeStatic


            DateTimePicker.prototype._getOptions = function _getOptions(options) {
                options = $.extend(true, {}, Default, options);
                return options;
            };

            DateTimePicker.prototype._hasTimeZone = function _hasTimeZone() {
                return moment.tz !== undefined && this._options.timeZone !== undefined && this._options.timeZone !== null && this._options.timeZone !== '';
            };

            DateTimePicker.prototype._isEnabled = function _isEnabled(granularity) {
                if (typeof granularity !== 'string' || granularity.length > 1) {
                    throw new TypeError('isEnabled expects a single character string parameter');
                }
                switch (granularity) {
                    case 'y':
                        return this.actualFormat.indexOf('Y') !== -1;
                    case 'M':
                        return this.actualFormat.indexOf('M') !== -1;
                    case 'd':
                        return this.actualFormat.toLowerCase().indexOf('d') !== -1;
                    case 'h':
                    case 'H':
                        return this.actualFormat.toLowerCase().indexOf('h') !== -1;
                    case 'm':
                        return this.actualFormat.indexOf('m') !== -1;
                    case 's':
                        return this.actualFormat.indexOf('s') !== -1;
                    case 'a':
                    case 'A':
                        return this.actualFormat.toLowerCase().indexOf('a') !== -1;
                    default:
                        return false;
                }
            };

            DateTimePicker.prototype._hasTime = function _hasTime() {
                return this._isEnabled('h') || this._isEnabled('m') || this._isEnabled('s');
            };

            DateTimePicker.prototype._hasDate = function _hasDate() {
                return this._isEnabled('y') || this._isEnabled('M') || this._isEnabled('d');
            };

            DateTimePicker.prototype._dataToOptions = function _dataToOptions() {
                var eData = this._element.data();
                var dataOptions = {};

                if (eData.dateOptions && eData.dateOptions instanceof Object) {
                    dataOptions = $.extend(true, dataOptions, eData.dateOptions);
                }

                $.each(this._options, function(key) {
                    var attributeName = 'date' + key.charAt(0).toUpperCase() + key.slice(1); // todo
																								// data
																								// api
																								// key
                    if (eData[attributeName] !== undefined) {
                        dataOptions[key] = eData[attributeName];
                    } else {
                        delete dataOptions[key];
                    }
                });
                return dataOptions;
            };

            DateTimePicker.prototype._notifyEvent = function _notifyEvent(e) {
                if (e.type === DateTimePicker.Event.CHANGE && e.date && e.date.isSame(e.oldDate) || !e.date && !e.oldDate) {
                    return;
                }
                this._element.trigger(e);
            };

            DateTimePicker.prototype._viewUpdate = function _viewUpdate(e) {
                if (e === 'y') {
                    e = 'YYYY';
                }
                this._notifyEvent({
                    type: DateTimePicker.Event.UPDATE,
                    change: e,
                    viewDate: this._viewDate.clone()
                });
            };

            DateTimePicker.prototype._showMode = function _showMode(dir) {
                if (!this.widget) {
                    return;
                }
                if (dir) {
                    this.currentViewMode = Math.max(MinViewModeNumber, Math.min(3, this.currentViewMode + dir));
                }
                this.widget.find('.datepicker > div').hide().filter('.datepicker-' + DatePickerModes[this.currentViewMode].CLASS_NAME).show();
            };

            DateTimePicker.prototype._isInDisabledDates = function _isInDisabledDates(testDate) {
                return this._options.disabledDates[testDate.format('YYYY-MM-DD')] === true;
            };

            DateTimePicker.prototype._isInEnabledDates = function _isInEnabledDates(testDate) {
                return this._options.enabledDates[testDate.format('YYYY-MM-DD')] === true;
            };

            DateTimePicker.prototype._isInDisabledHours = function _isInDisabledHours(testDate) {
                return this._options.disabledHours[testDate.format('H')] === true;
            };

            DateTimePicker.prototype._isInEnabledHours = function _isInEnabledHours(testDate) {
                return this._options.enabledHours[testDate.format('H')] === true;
            };

            DateTimePicker.prototype._isValid = function _isValid(targetMoment, granularity) {
                if (!targetMoment.isValid()) {
                    return false;
                }
                if (this._options.disabledDates && granularity === 'd' && this._isInDisabledDates(targetMoment)) {
                    return false;
                }
                if (this._options.enabledDates && granularity === 'd' && !this._isInEnabledDates(targetMoment)) {
                    return false;
                }
                if (this._options.minDate && targetMoment.isBefore(this._options.minDate, granularity)) {
                    return false;
                }
                if (this._options.maxDate && targetMoment.isAfter(this._options.maxDate, granularity)) {
                    return false;
                }
                if (this._options.daysOfWeekDisabled && granularity === 'd' && this._options.daysOfWeekDisabled.indexOf(targetMoment.day()) !== -1) {
                    return false;
                }
                if (this._options.disabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && this._isInDisabledHours(targetMoment)) {
                    return false;
                }
                if (this._options.enabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && !this._isInEnabledHours(targetMoment)) {
                    return false;
                }
                if (this._options.disabledTimeIntervals && (granularity === 'h' || granularity === 'm' || granularity === 's')) {
                    var found = false;
                    $.each(this._options.disabledTimeIntervals, function() {
                        if (targetMoment.isBetween(this[0], this[1])) {
                            found = true;
                            return false;
                        }
                    });
                    if (found) {
                        return false;
                    }
                }
                return true;
            };

            DateTimePicker.prototype._parseInputDate = function _parseInputDate(inputDate) {
                if (this._options.parseInputDate === undefined) {
                    if (!moment.isMoment(inputDate)) {
                        inputDate = this.getMoment(inputDate);
                    }
                } else {
                    inputDate = this._options.parseInputDate(inputDate);
                }
                // inputDate.locale(this.options.locale);
                return inputDate;
            };

            DateTimePicker.prototype._keydown = function _keydown(e) {
                var handler = null,
                    index = void 0,
                    index2 = void 0,
                    keyBindKeys = void 0,
                    allModifiersPressed = void 0;
                var pressedKeys = [],
                    pressedModifiers = {},
                    currentKey = e.which,
                    pressed = 'p';

                keyState[currentKey] = pressed;

                for (index in keyState) {
                    if (keyState.hasOwnProperty(index) && keyState[index] === pressed) {
                        pressedKeys.push(index);
                        if (parseInt(index, 10) !== currentKey) {
                            pressedModifiers[index] = true;
                        }
                    }
                }

                for (index in this._options.keyBinds) {
                    if (this._options.keyBinds.hasOwnProperty(index) && typeof this._options.keyBinds[index] === 'function') {
                        keyBindKeys = index.split(' ');
                        if (keyBindKeys.length === pressedKeys.length && KeyMap[currentKey] === keyBindKeys[keyBindKeys.length - 1]) {
                            allModifiersPressed = true;
                            for (index2 = keyBindKeys.length - 2; index2 >= 0; index2--) {
                                if (!(KeyMap[keyBindKeys[index2]] in pressedModifiers)) {
                                    allModifiersPressed = false;
                                    break;
                                }
                            }
                            if (allModifiersPressed) {
                                handler = this._options.keyBinds[index];
                                break;
                            }
                        }
                    }
                }

                if (handler) {
                    if (handler.call(this)) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            };

            // noinspection JSMethodCanBeStatic,SpellCheckingInspection


            DateTimePicker.prototype._keyup = function _keyup(e) {
                keyState[e.which] = 'r';
                if (keyPressHandled[e.which]) {
                    keyPressHandled[e.which] = false;
                    e.stopPropagation();
                    e.preventDefault();
                }
            };

            DateTimePicker.prototype._indexGivenDates = function _indexGivenDates(givenDatesArray) {
                // Store given enabledDates and disabledDates as keys.
                // This way we can check their existence in O(1) time instead of
				// looping through whole array.
                // (for example: options.enabledDates['2014-02-27'] === true)
                var givenDatesIndexed = {},
                    self = this;
                $.each(givenDatesArray, function() {
                    var dDate = self._parseInputDate(this);
                    if (dDate.isValid()) {
                        givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true;
                    }
                });
                return Object.keys(givenDatesIndexed).length ? givenDatesIndexed : false;
            };

            DateTimePicker.prototype._indexGivenHours = function _indexGivenHours(givenHoursArray) {
                // Store given enabledHours and disabledHours as keys.
                // This way we can check their existence in O(1) time instead of
				// looping through whole array.
                // (for example: options.enabledHours['2014-02-27'] === true)
                var givenHoursIndexed = {};
                $.each(givenHoursArray, function() {
                    givenHoursIndexed[this] = true;
                });
                return Object.keys(givenHoursIndexed).length ? givenHoursIndexed : false;
            };

            DateTimePicker.prototype._initFormatting = function _initFormatting() {
                var format = this._options.format || 'L LT',
                    self = this;

                this.actualFormat = format.replace(/(\[[^\[]*])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function(formatInput) {
                    return self._dates[0].localeData().longDateFormat(formatInput) || formatInput; // todo
																									// taking
																									// the
																									// first
																									// date
																									// should
																									// be
																									// ok
                });

                this.parseFormats = this._options.extraFormats ? this._options.extraFormats.slice() : [];
                if (this.parseFormats.indexOf(format) < 0 && this.parseFormats.indexOf(this.actualFormat) < 0) {
                    this.parseFormats.push(this.actualFormat);
                }

                this.use24Hours = this.actualFormat.toLowerCase().indexOf('a') < 1 && this.actualFormat.replace(/\[.*?]/g, '').indexOf('h') < 1;

                if (this._isEnabled('y')) {
                    MinViewModeNumber = 2;
                }
                if (this._isEnabled('M')) {
                    MinViewModeNumber = 1;
                }
                if (this._isEnabled('d')) {
                    MinViewModeNumber = 0;
                }

                this.currentViewMode = Math.max(MinViewModeNumber, this.currentViewMode);

                if (!this.unset) {
                    this._setValue(this._dates[0], 0);
                }
            };

            DateTimePicker.prototype._getLastPickedDate = function _getLastPickedDate() {
                return this._dates[this._getLastPickedDateIndex()] || moment(null);
            };

            DateTimePicker.prototype._getLastPickedDateIndex = function _getLastPickedDateIndex() {
                return this._dates.length - 1;
            };

            // public


            DateTimePicker.prototype.getMoment = function getMoment(d) {
                var returnMoment = void 0;

                if (d === undefined || d === null) {
                    returnMoment = moment(); // TODO should this use format?
												// and locale?
                } else if (this._hasTimeZone()) {
                    // There is a string to parse and a default time zone
                    // parse with the tz function which takes a default time
					// zone if it is not in the format string
                    returnMoment = moment.tz(d, this.parseFormats, this._options.locale, this._options.useStrict, this._options.timeZone);
                } else {
                    returnMoment = moment(d, this.parseFormats, this._options.locale, this._options.useStrict);
                }

                if (this._hasTimeZone()) {
                    returnMoment.tz(this._options.timeZone);
                }

                return returnMoment;
            };

            DateTimePicker.prototype.toggle = function toggle() {
                return this.widget ? this.hide() : this.show();
            };

            DateTimePicker.prototype.ignoreReadonly = function ignoreReadonly(_ignoreReadonly) {
                if (arguments.length === 0) {
                    return this._options.ignoreReadonly;
                }
                if (typeof _ignoreReadonly !== 'boolean') {
                    throw new TypeError('ignoreReadonly () expects a boolean parameter');
                }
                this._options.ignoreReadonly = _ignoreReadonly;
            };

            DateTimePicker.prototype.options = function options(newOptions) {
                if (arguments.length === 0) {
                    return $.extend(true, {}, this._options);
                }

                if (!(newOptions instanceof Object)) {
                    throw new TypeError('options() this.options parameter should be an object');
                }
                $.extend(true, this._options, newOptions);
                var self = this;
                $.each(this._options, function(key, value) {
                    if (self[key] !== undefined) {
                        self[key](value);
                    }
                });
            };

            DateTimePicker.prototype.date = function date(newDate, index) {
                index = index || 0;
                if (arguments.length === 0) {
                    if (this.unset) {
                        return null;
                    }
                    if (this._options.allowMultidate) {
                        return this._dates.join(this._options.multidateSeparator);
                    } else {
                        return this._dates[index].clone();
                    }
                }

                if (newDate !== null && typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
                    throw new TypeError('date() parameter must be one of [null, string, moment or Date]');
                }

                this._setValue(newDate === null ? null : this._parseInputDate(newDate), index);
            };

            DateTimePicker.prototype.format = function format(newFormat) {
                if (arguments.length === 0) {
                    return this._options.format;
                }

                if (typeof newFormat !== 'string' && (typeof newFormat !== 'boolean' || newFormat !== false)) {
                    throw new TypeError('format() expects a string or boolean:false parameter ' + newFormat);
                }

                this._options.format = newFormat;
                if (this.actualFormat) {
                    this._initFormatting(); // reinitialize formatting
                }
            };

            DateTimePicker.prototype.timeZone = function timeZone(newZone) {
                if (arguments.length === 0) {
                    return this._options.timeZone;
                }

                if (typeof newZone !== 'string') {
                    throw new TypeError('newZone() expects a string parameter');
                }

                this._options.timeZone = newZone;
            };

            DateTimePicker.prototype.dayViewHeaderFormat = function dayViewHeaderFormat(newFormat) {
                if (arguments.length === 0) {
                    return this._options.dayViewHeaderFormat;
                }

                if (typeof newFormat !== 'string') {
                    throw new TypeError('dayViewHeaderFormat() expects a string parameter');
                }

                this._options.dayViewHeaderFormat = newFormat;
            };

            DateTimePicker.prototype.extraFormats = function extraFormats(formats) {
                if (arguments.length === 0) {
                    return this._options.extraFormats;
                }

                if (formats !== false && !(formats instanceof Array)) {
                    throw new TypeError('extraFormats() expects an array or false parameter');
                }

                this._options.extraFormats = formats;
                if (this.parseFormats) {
                    this._initFormatting(); // reinit formatting
                }
            };

            DateTimePicker.prototype.disabledDates = function disabledDates(dates) {
                if (arguments.length === 0) {
                    return this._options.disabledDates ? $.extend({}, this._options.disabledDates) : this._options.disabledDates;
                }

                if (!dates) {
                    this._options.disabledDates = false;
                    this._update();
                    return true;
                }
                if (!(dates instanceof Array)) {
                    throw new TypeError('disabledDates() expects an array parameter');
                }
                this._options.disabledDates = this._indexGivenDates(dates);
                this._options.enabledDates = false;
                this._update();
            };

            DateTimePicker.prototype.enabledDates = function enabledDates(dates) {
                if (arguments.length === 0) {
                    return this._options.enabledDates ? $.extend({}, this._options.enabledDates) : this._options.enabledDates;
                }

                if (!dates) {
                    this._options.enabledDates = false;
                    this._update();
                    return true;
                }
                if (!(dates instanceof Array)) {
                    throw new TypeError('enabledDates() expects an array parameter');
                }
                this._options.enabledDates = this._indexGivenDates(dates);
                this._options.disabledDates = false;
                this._update();
            };

            DateTimePicker.prototype.daysOfWeekDisabled = function daysOfWeekDisabled(_daysOfWeekDisabled) {
                if (arguments.length === 0) {
                    return this._options.daysOfWeekDisabled.splice(0);
                }

                if (typeof _daysOfWeekDisabled === 'boolean' && !_daysOfWeekDisabled) {
                    this._options.daysOfWeekDisabled = false;
                    this._update();
                    return true;
                }

                if (!(_daysOfWeekDisabled instanceof Array)) {
                    throw new TypeError('daysOfWeekDisabled() expects an array parameter');
                }
                this._options.daysOfWeekDisabled = _daysOfWeekDisabled.reduce(function(previousValue, currentValue) {
                    currentValue = parseInt(currentValue, 10);
                    if (currentValue > 6 || currentValue < 0 || isNaN(currentValue)) {
                        return previousValue;
                    }
                    if (previousValue.indexOf(currentValue) === -1) {
                        previousValue.push(currentValue);
                    }
                    return previousValue;
                }, []).sort();
                if (this._options.useCurrent && !this._options.keepInvalid) {
                    for (var i = 0; i < this._dates.length; i++) {
                        var tries = 0;
                        while (!this._isValid(this._dates[i], 'd')) {
                            this._dates[i].add(1, 'd');
                            if (tries === 31) {
                                throw 'Tried 31 times to find a valid date';
                            }
                            tries++;
                        }
                        this._setValue(this._dates[i], i);
                    }
                }
                this._update();
            };

            DateTimePicker.prototype.maxDate = function maxDate(_maxDate) {
                if (arguments.length === 0) {
                    return this._options.maxDate ? this._options.maxDate.clone() : this._options.maxDate;
                }

                if (typeof _maxDate === 'boolean' && _maxDate === false) {
                    this._options.maxDate = false;
                    this._update();
                    return true;
                }

                if (typeof _maxDate === 'string') {
                    if (_maxDate === 'now' || _maxDate === 'moment') {
                        _maxDate = this.getMoment();
                    }
                }

                var parsedDate = this._parseInputDate(_maxDate);

                if (!parsedDate.isValid()) {
                    throw new TypeError('maxDate() Could not parse date parameter: ' + _maxDate);
                }
                if (this._options.minDate && parsedDate.isBefore(this._options.minDate)) {
                    throw new TypeError('maxDate() date parameter is before this.options.minDate: ' + parsedDate.format(this.actualFormat));
                }
                this._options.maxDate = parsedDate;
                for (var i = 0; i < this._dates.length; i++) {
                    if (this._options.useCurrent && !this._options.keepInvalid && this._dates[i].isAfter(_maxDate)) {
                        this._setValue(this._options.maxDate, i);
                    }
                }
                if (this._viewDate.isAfter(parsedDate)) {
                    this._viewDate = parsedDate.clone().subtract(this._options.stepping, 'm');
                }
                this._update();
            };

            DateTimePicker.prototype.minDate = function minDate(_minDate) {
                if (arguments.length === 0) {
                    return this._options.minDate ? this._options.minDate.clone() : this._options.minDate;
                }

                if (typeof _minDate === 'boolean' && _minDate === false) {
                    this._options.minDate = false;
                    this._update();
                    return true;
                }

                if (typeof _minDate === 'string') {
                    if (_minDate === 'now' || _minDate === 'moment') {
                        _minDate = this.getMoment();
                    }
                }

                var parsedDate = this._parseInputDate(_minDate);

                if (!parsedDate.isValid()) {
                    throw new TypeError('minDate() Could not parse date parameter: ' + _minDate);
                }
                if (this._options.maxDate && parsedDate.isAfter(this._options.maxDate)) {
                    throw new TypeError('minDate() date parameter is after this.options.maxDate: ' + parsedDate.format(this.actualFormat));
                }
                this._options.minDate = parsedDate;
                for (var i = 0; i < this._dates.length; i++) {
                    if (this._options.useCurrent && !this._options.keepInvalid && this._dates[i].isBefore(_minDate)) {
                        this._setValue(this._options.minDate, i);
                    }
                }
                if (this._viewDate.isBefore(parsedDate)) {
                    this._viewDate = parsedDate.clone().add(this._options.stepping, 'm');
                }
                this._update();
            };

            DateTimePicker.prototype.defaultDate = function defaultDate(_defaultDate) {
                if (arguments.length === 0) {
                    return this._options.defaultDate ? this._options.defaultDate.clone() : this._options.defaultDate;
                }
                if (!_defaultDate) {
                    this._options.defaultDate = false;
                    return true;
                }

                if (typeof _defaultDate === 'string') {
                    if (_defaultDate === 'now' || _defaultDate === 'moment') {
                        _defaultDate = this.getMoment();
                    } else {
                        _defaultDate = this.getMoment(_defaultDate);
                    }
                }

                var parsedDate = this._parseInputDate(_defaultDate);
                if (!parsedDate.isValid()) {
                    throw new TypeError('defaultDate() Could not parse date parameter: ' + _defaultDate);
                }
                if (!this._isValid(parsedDate)) {
                    throw new TypeError('defaultDate() date passed is invalid according to component setup validations');
                }

                this._options.defaultDate = parsedDate;

                if (this._options.defaultDate && this._options.inline || this.input !== undefined && this.input.val().trim() === '') {
                    this._setValue(this._options.defaultDate, 0);
                }
            };

            DateTimePicker.prototype.locale = function locale(_locale) {
                if (arguments.length === 0) {
                    return this._options.locale;
                }

                if (!moment.localeData(_locale)) {
                    throw new TypeError('locale() locale ' + _locale + ' is not loaded from moment locales!');
                }

                this._options.locale = _locale;

                for (var i = 0; i < this._dates.length; i++) {
                    this._dates[i].locale(this._options.locale);
                }
                this._viewDate.locale(this._options.locale);

                if (this.actualFormat) {
                    this._initFormatting(); // reinitialize formatting
                }
                if (this.widget) {
                    this.hide();
                    this.show();
                }
            };

            DateTimePicker.prototype.stepping = function stepping(_stepping) {
                if (arguments.length === 0) {
                    return this._options.stepping;
                }

                _stepping = parseInt(_stepping, 10);
                if (isNaN(_stepping) || _stepping < 1) {
                    _stepping = 1;
                }
                this._options.stepping = _stepping;
            };

            DateTimePicker.prototype.useCurrent = function useCurrent(_useCurrent) {
                var useCurrentOptions = ['year', 'month', 'day', 'hour', 'minute'];
                if (arguments.length === 0) {
                    return this._options.useCurrent;
                }

                if (typeof _useCurrent !== 'boolean' && typeof _useCurrent !== 'string') {
                    throw new TypeError('useCurrent() expects a boolean or string parameter');
                }
                if (typeof _useCurrent === 'string' && useCurrentOptions.indexOf(_useCurrent.toLowerCase()) === -1) {
                    throw new TypeError('useCurrent() expects a string parameter of ' + useCurrentOptions.join(', '));
                }
                this._options.useCurrent = _useCurrent;
            };

            DateTimePicker.prototype.collapse = function collapse(_collapse) {
                if (arguments.length === 0) {
                    return this._options.collapse;
                }

                if (typeof _collapse !== 'boolean') {
                    throw new TypeError('collapse() expects a boolean parameter');
                }
                if (this._options.collapse === _collapse) {
                    return true;
                }
                this._options.collapse = _collapse;
                if (this.widget) {
                    this.hide();
                    this.show();
                }
            };

            DateTimePicker.prototype.icons = function icons(_icons) {
                if (arguments.length === 0) {
                    return $.extend({}, this._options.icons);
                }

                if (!(_icons instanceof Object)) {
                    throw new TypeError('icons() expects parameter to be an Object');
                }

                $.extend(this._options.icons, _icons);

                if (this.widget) {
                    this.hide();
                    this.show();
                }
            };

            DateTimePicker.prototype.tooltips = function tooltips(_tooltips) {
                if (arguments.length === 0) {
                    return $.extend({}, this._options.tooltips);
                }

                if (!(_tooltips instanceof Object)) {
                    throw new TypeError('tooltips() expects parameter to be an Object');
                }
                $.extend(this._options.tooltips, _tooltips);
                if (this.widget) {
                    this.hide();
                    this.show();
                }
            };

            DateTimePicker.prototype.useStrict = function useStrict(_useStrict) {
                if (arguments.length === 0) {
                    return this._options.useStrict;
                }

                if (typeof _useStrict !== 'boolean') {
                    throw new TypeError('useStrict() expects a boolean parameter');
                }
                this._options.useStrict = _useStrict;
            };

            DateTimePicker.prototype.sideBySide = function sideBySide(_sideBySide) {
                if (arguments.length === 0) {
                    return this._options.sideBySide;
                }

                if (typeof _sideBySide !== 'boolean') {
                    throw new TypeError('sideBySide() expects a boolean parameter');
                }
                this._options.sideBySide = _sideBySide;
                if (this.widget) {
                    this.hide();
                    this.show();
                }
            };

            DateTimePicker.prototype.viewMode = function viewMode(_viewMode) {
                if (arguments.length === 0) {
                    return this._options.viewMode;
                }

                if (typeof _viewMode !== 'string') {
                    throw new TypeError('viewMode() expects a string parameter');
                }

                if (DateTimePicker.ViewModes.indexOf(_viewMode) === -1) {
                    throw new TypeError('viewMode() parameter must be one of (' + DateTimePicker.ViewModes.join(', ') + ') value');
                }

                this._options.viewMode = _viewMode;
                this.currentViewMode = Math.max(DateTimePicker.ViewModes.indexOf(_viewMode) - 1, DateTimePicker.MinViewModeNumber);

                this._showMode();
            };

            DateTimePicker.prototype.calendarWeeks = function calendarWeeks(_calendarWeeks) {
                if (arguments.length === 0) {
                    return this._options.calendarWeeks;
                }

                if (typeof _calendarWeeks !== 'boolean') {
                    throw new TypeError('calendarWeeks() expects parameter to be a boolean value');
                }

                this._options.calendarWeeks = _calendarWeeks;
                this._update();
            };

            DateTimePicker.prototype.buttons = function buttons(_buttons) {
                if (arguments.length === 0) {
                    return $.extend({}, this._options.buttons);
                }

                if (!(_buttons instanceof Object)) {
                    throw new TypeError('buttons() expects parameter to be an Object');
                }

                $.extend(this._options.buttons, _buttons);

                if (typeof this._options.buttons.showToday !== 'boolean') {
                    throw new TypeError('buttons.showToday expects a boolean parameter');
                }
                if (typeof this._options.buttons.showClear !== 'boolean') {
                    throw new TypeError('buttons.showClear expects a boolean parameter');
                }
                if (typeof this._options.buttons.showClose !== 'boolean') {
                    throw new TypeError('buttons.showClose expects a boolean parameter');
                }

                if (this.widget) {
                    this.hide();
                    this.show();
                }
            };

            DateTimePicker.prototype.keepOpen = function keepOpen(_keepOpen) {
                if (arguments.length === 0) {
                    return this._options.keepOpen;
                }

                if (typeof _keepOpen !== 'boolean') {
                    throw new TypeError('keepOpen() expects a boolean parameter');
                }

                this._options.keepOpen = _keepOpen;
            };

            DateTimePicker.prototype.focusOnShow = function focusOnShow(_focusOnShow) {
                if (arguments.length === 0) {
                    return this._options.focusOnShow;
                }

                if (typeof _focusOnShow !== 'boolean') {
                    throw new TypeError('focusOnShow() expects a boolean parameter');
                }

                this._options.focusOnShow = _focusOnShow;
            };

            DateTimePicker.prototype.inline = function inline(_inline) {
                if (arguments.length === 0) {
                    return this._options.inline;
                }

                if (typeof _inline !== 'boolean') {
                    throw new TypeError('inline() expects a boolean parameter');
                }

                this._options.inline = _inline;
            };

            DateTimePicker.prototype.clear = function clear() {
                this._setValue(null); // todo
            };

            DateTimePicker.prototype.keyBinds = function keyBinds(_keyBinds) {
                if (arguments.length === 0) {
                    return this._options.keyBinds;
                }

                this._options.keyBinds = _keyBinds;
            };

            DateTimePicker.prototype.debug = function debug(_debug) {
                if (typeof _debug !== 'boolean') {
                    throw new TypeError('debug() expects a boolean parameter');
                }

                this._options.debug = _debug;
            };

            DateTimePicker.prototype.allowInputToggle = function allowInputToggle(_allowInputToggle) {
                if (arguments.length === 0) {
                    return this._options.allowInputToggle;
                }

                if (typeof _allowInputToggle !== 'boolean') {
                    throw new TypeError('allowInputToggle() expects a boolean parameter');
                }

                this._options.allowInputToggle = _allowInputToggle;
            };

            DateTimePicker.prototype.keepInvalid = function keepInvalid(_keepInvalid) {
                if (arguments.length === 0) {
                    return this._options.keepInvalid;
                }

                if (typeof _keepInvalid !== 'boolean') {
                    throw new TypeError('keepInvalid() expects a boolean parameter');
                }
                this._options.keepInvalid = _keepInvalid;
            };

            DateTimePicker.prototype.datepickerInput = function datepickerInput(_datepickerInput) {
                if (arguments.length === 0) {
                    return this._options.datepickerInput;
                }

                if (typeof _datepickerInput !== 'string') {
                    throw new TypeError('datepickerInput() expects a string parameter');
                }

                this._options.datepickerInput = _datepickerInput;
            };

            DateTimePicker.prototype.parseInputDate = function parseInputDate(_parseInputDate2) {
                if (arguments.length === 0) {
                    return this._options.parseInputDate;
                }

                if (typeof _parseInputDate2 !== 'function') {
                    throw new TypeError('parseInputDate() should be as function');
                }

                this._options.parseInputDate = _parseInputDate2;
            };

            DateTimePicker.prototype.disabledTimeIntervals = function disabledTimeIntervals(_disabledTimeIntervals) {
                if (arguments.length === 0) {
                    return this._options.disabledTimeIntervals ? $.extend({}, this._options.disabledTimeIntervals) : this._options.disabledTimeIntervals;
                }

                if (!_disabledTimeIntervals) {
                    this._options.disabledTimeIntervals = false;
                    this._update();
                    return true;
                }
                if (!(_disabledTimeIntervals instanceof Array)) {
                    throw new TypeError('disabledTimeIntervals() expects an array parameter');
                }
                this._options.disabledTimeIntervals = _disabledTimeIntervals;
                this._update();
            };

            DateTimePicker.prototype.disabledHours = function disabledHours(hours) {
                if (arguments.length === 0) {
                    return this._options.disabledHours ? $.extend({}, this._options.disabledHours) : this._options.disabledHours;
                }

                if (!hours) {
                    this._options.disabledHours = false;
                    this._update();
                    return true;
                }
                if (!(hours instanceof Array)) {
                    throw new TypeError('disabledHours() expects an array parameter');
                }
                this._options.disabledHours = this._indexGivenHours(hours);
                this._options.enabledHours = false;
                if (this._options.useCurrent && !this._options.keepInvalid) {
                    for (var i = 0; i < this._dates.length; i++) {
                        var tries = 0;
                        while (!this._isValid(this._dates[i], 'h')) {
                            this._dates[i].add(1, 'h');
                            if (tries === 24) {
                                throw 'Tried 24 times to find a valid date';
                            }
                            tries++;
                        }
                        this._setValue(this._dates[i], i);
                    }
                }
                this._update();
            };

            DateTimePicker.prototype.enabledHours = function enabledHours(hours) {
                if (arguments.length === 0) {
                    return this._options.enabledHours ? $.extend({}, this._options.enabledHours) : this._options.enabledHours;
                }

                if (!hours) {
                    this._options.enabledHours = false;
                    this._update();
                    return true;
                }
                if (!(hours instanceof Array)) {
                    throw new TypeError('enabledHours() expects an array parameter');
                }
                this._options.enabledHours = this._indexGivenHours(hours);
                this._options.disabledHours = false;
                if (this._options.useCurrent && !this._options.keepInvalid) {
                    for (var i = 0; i < this._dates.length; i++) {
                        var tries = 0;
                        while (!this._isValid(this._dates[i], 'h')) {
                            this._dates[i].add(1, 'h');
                            if (tries === 24) {
                                throw 'Tried 24 times to find a valid date';
                            }
                            tries++;
                        }
                        this._setValue(this._dates[i], i);
                    }
                }
                this._update();
            };

            DateTimePicker.prototype.viewDate = function viewDate(newDate) {
                if (arguments.length === 0) {
                    return this._viewDate.clone();
                }

                if (!newDate) {
                    this._viewDate = (this._dates[0] || this.getMoment()).clone();
                    return true;
                }

                if (typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
                    throw new TypeError('viewDate() parameter must be one of [string, moment or Date]');
                }

                this._viewDate = this._parseInputDate(newDate);
                this._viewUpdate();
            };

            DateTimePicker.prototype.allowMultidate = function allowMultidate(_allowMultidate) {
                if (typeof _allowMultidate !== 'boolean') {
                    throw new TypeError('allowMultidate() expects a boolean parameter');
                }

                this._options.allowMultidate = _allowMultidate;
            };

            DateTimePicker.prototype.multidateSeparator = function multidateSeparator(_multidateSeparator) {
                if (arguments.length === 0) {
                    return this._options.multidateSeparator;
                }

                if (typeof _multidateSeparator !== 'string' || _multidateSeparator.length > 1) {
                    throw new TypeError('multidateSeparator expects a single character string parameter');
                }

                this._options.multidateSeparator = _multidateSeparator;
            };

            _createClass(DateTimePicker, null, [{
                key: 'NAME',
                get: function get() {
                    return NAME;
                }

                /**
				 * @return {string}
				 */

            }, {
                key: 'DATA_KEY',
                get: function get() {
                    return DATA_KEY;
                }

                /**
				 * @return {string}
				 */

            }, {
                key: 'EVENT_KEY',
                get: function get() {
                    return EVENT_KEY;
                }

                /**
				 * @return {string}
				 */

            }, {
                key: 'DATA_API_KEY',
                get: function get() {
                    return DATA_API_KEY;
                }
            }, {
                key: 'DatePickerModes',
                get: function get() {
                    return DatePickerModes;
                }
            }, {
                key: 'ViewModes',
                get: function get() {
                    return ViewModes;
                }

                /**
				 * @return {number}
				 */

            }, {
                key: 'MinViewModeNumber',
                get: function get() {
                    return MinViewModeNumber;
                }
            }, {
                key: 'Event',
                get: function get() {
                    return Event;
                }
            }, {
                key: 'Selector',
                get: function get() {
                    return Selector;
                }
            }, {
                key: 'Default',
                get: function get() {
                    return Default;
                },
                set: function set(value) {
                    Default = value;
                }
            }, {
                key: 'ClassName',
                get: function get() {
                    return ClassName;
                }
            }]);

            return DateTimePicker;
        }();

        return DateTimePicker;
    }(jQuery, moment);

    // noinspection JSUnusedGlobalSymbols
    /* global DateTimePicker */
    var TempusDominusBootstrap4 = function($) {
        // eslint-disable-line no-unused-vars
        // ReSharper disable once InconsistentNaming
        var JQUERY_NO_CONFLICT = $.fn[DateTimePicker.NAME],
            verticalModes = ['top', 'bottom', 'auto'],
            horizontalModes = ['left', 'right', 'auto'],
            toolbarPlacements = ['default', 'top', 'bottom'],
            getSelectorFromElement = function getSelectorFromElement($element) {
                var selector = $element.data('target'),
                    $selector = void 0;

                if (!selector) {
                    selector = $element.attr('href') || '';
                    selector = /^#[a-z]/i.test(selector) ? selector : null;
                }
                $selector = $(selector);
                if ($selector.length === 0) {
                    return $selector;
                }

                if (!$selector.data(DateTimePicker.DATA_KEY)) {
                    $.extend({}, $selector.data(), $(this).data());
                }

                return $selector;
            };

        // ReSharper disable once InconsistentNaming

        var TempusDominusBootstrap4 = function(_DateTimePicker) {
            _inherits(TempusDominusBootstrap4, _DateTimePicker);

            function TempusDominusBootstrap4(element, options) {
                _classCallCheck(this, TempusDominusBootstrap4);

                var _this = _possibleConstructorReturn(this, _DateTimePicker.call(this, element, options));

                _this._init();
                return _this;
            }

            TempusDominusBootstrap4.prototype._init = function _init() {
                if (this._element.hasClass('input-group')) {
                    var datepickerButton = this._element.find('.datepickerbutton');
                    if (datepickerButton.length === 0) {
                        this.component = this._element.find('[data-toggle="datetimepicker"]');
                    } else {
                        this.component = datepickerButton;
                    }
                }
            };

            TempusDominusBootstrap4.prototype._getDatePickerTemplate = function _getDatePickerTemplate() {
                var headTemplate = $('<thead>').append($('<tr>').append($('<th>').addClass('prev').attr('data-action', 'previous').append($('<span>').addClass(this._options.icons.previous))).append($('<th>').addClass('picker-switch').attr('data-action', 'pickerSwitch').attr('colspan', '' + (this._options.calendarWeeks ? '6' : '5'))).append($('<th>').addClass('next').attr('data-action', 'next').append($('<span>').addClass(this._options.icons.next)))),
                    contTemplate = $('<tbody>').append($('<tr>').append($('<td>').attr('colspan', '' + (this._options.calendarWeeks ? '8' : '7'))));

                return [$('<div>').addClass('datepicker-days').append($('<table>').addClass('table table-sm').append(headTemplate).append($('<tbody>'))), $('<div>').addClass('datepicker-months').append($('<table>').addClass('table-condensed').append(headTemplate.clone()).append(contTemplate.clone())), $('<div>').addClass('datepicker-years').append($('<table>').addClass('table-condensed').append(headTemplate.clone()).append(contTemplate.clone())), $('<div>').addClass('datepicker-decades').append($('<table>').addClass('table-condensed').append(headTemplate.clone()).append(contTemplate.clone()))];
            };

            TempusDominusBootstrap4.prototype._getTimePickerMainTemplate = function _getTimePickerMainTemplate() {
                var topRow = $('<tr>'),
                    middleRow = $('<tr>'),
                    bottomRow = $('<tr>');

                if (this._isEnabled('h')) {
                    topRow.append($('<td>').append($('<a>').attr({
                        href: '#',
                        tabindex: '-1',
                        'title': this._options.tooltips.incrementHour
                    }).addClass('btn').attr('data-action', 'incrementHours').append($('<span>').addClass(this._options.icons.up))));
                    middleRow.append($('<td>').append($('<span>').addClass('timepicker-hour').attr({
                        'data-time-component': 'hours',
                        'title': this._options.tooltips.pickHour
                    }).attr('data-action', 'showHours')));
                    bottomRow.append($('<td>').append($('<a>').attr({
                        href: '#',
                        tabindex: '-1',
                        'title': this._options.tooltips.decrementHour
                    }).addClass('btn').attr('data-action', 'decrementHours').append($('<span>').addClass(this._options.icons.down))));
                }
                if (this._isEnabled('m')) {
                    if (this._isEnabled('h')) {
                        topRow.append($('<td>').addClass('separator'));
                        middleRow.append($('<td>').addClass('separator').html(':'));
                        bottomRow.append($('<td>').addClass('separator'));
                    }
                    topRow.append($('<td>').append($('<a>').attr({
                        href: '#',
                        tabindex: '-1',
                        'title': this._options.tooltips.incrementMinute
                    }).addClass('btn').attr('data-action', 'incrementMinutes').append($('<span>').addClass(this._options.icons.up))));
                    middleRow.append($('<td>').append($('<span>').addClass('timepicker-minute').attr({
                        'data-time-component': 'minutes',
                        'title': this._options.tooltips.pickMinute
                    }).attr('data-action', 'showMinutes')));
                    bottomRow.append($('<td>').append($('<a>').attr({
                        href: '#',
                        tabindex: '-1',
                        'title': this._options.tooltips.decrementMinute
                    }).addClass('btn').attr('data-action', 'decrementMinutes').append($('<span>').addClass(this._options.icons.down))));
                }
                if (this._isEnabled('s')) {
                    if (this._isEnabled('m')) {
                        topRow.append($('<td>').addClass('separator'));
                        middleRow.append($('<td>').addClass('separator').html(':'));
                        bottomRow.append($('<td>').addClass('separator'));
                    }
                    topRow.append($('<td>').append($('<a>').attr({
                        href: '#',
                        tabindex: '-1',
                        'title': this._options.tooltips.incrementSecond
                    }).addClass('btn').attr('data-action', 'incrementSeconds').append($('<span>').addClass(this._options.icons.up))));
                    middleRow.append($('<td>').append($('<span>').addClass('timepicker-second').attr({
                        'data-time-component': 'seconds',
                        'title': this._options.tooltips.pickSecond
                    }).attr('data-action', 'showSeconds')));
                    bottomRow.append($('<td>').append($('<a>').attr({
                        href: '#',
                        tabindex: '-1',
                        'title': this._options.tooltips.decrementSecond
                    }).addClass('btn').attr('data-action', 'decrementSeconds').append($('<span>').addClass(this._options.icons.down))));
                }

                if (!this.use24Hours) {
                    topRow.append($('<td>').addClass('separator'));
                    middleRow.append($('<td>').append($('<button>').addClass('btn btn-primary').attr({
                        'data-action': 'togglePeriod',
                        tabindex: '-1',
                        'title': this._options.tooltips.togglePeriod
                    })));
                    bottomRow.append($('<td>').addClass('separator'));
                }

                return $('<div>').addClass('timepicker-picker').append($('<table>').addClass('table-condensed').append([topRow, middleRow, bottomRow]));
            };

            TempusDominusBootstrap4.prototype._getTimePickerTemplate = function _getTimePickerTemplate() {
                var hoursView = $('<div>').addClass('timepicker-hours').append($('<table>').addClass('table-condensed')),
                    minutesView = $('<div>').addClass('timepicker-minutes').append($('<table>').addClass('table-condensed')),
                    secondsView = $('<div>').addClass('timepicker-seconds').append($('<table>').addClass('table-condensed')),
                    ret = [this._getTimePickerMainTemplate()];

                if (this._isEnabled('h')) {
                    ret.push(hoursView);
                }
                if (this._isEnabled('m')) {
                    ret.push(minutesView);
                }
                if (this._isEnabled('s')) {
                    ret.push(secondsView);
                }

                return ret;
            };

            TempusDominusBootstrap4.prototype._getToolbar = function _getToolbar() {
                var row = [];
                if (this._options.buttons.showToday) {
                    row.push($('<td>').append($('<a>').attr({
                        href: '#',
                        tabindex: '-1',
                        'data-action': 'today',
                        'title': this._options.tooltips.today
                    }).append($('<span>').addClass(this._options.icons.today))));
                }
                if (!this._options.sideBySide && this._hasDate() && this._hasTime()) {
                    var title = void 0,
                        icon = void 0;
                    if (this._options.viewMode === 'times') {
                        title = this._options.tooltips.selectDate;
                        icon = this._options.icons.date;
                    } else {
                        title = this._options.tooltips.selectTime;
                        icon = this._options.icons.time;
                    }
                    row.push($('<td>').append($('<a>').attr({
                        href: '#',
                        tabindex: '-1',
                        'data-action': 'togglePicker',
                        'title': title
                    }).append($('<span>').addClass(icon))));
                }
                if (this._options.buttons.showClear) {
                    row.push($('<td>').append($('<a>').attr({
                        href: '#',
                        tabindex: '-1',
                        'data-action': 'clear',
                        'title': this._options.tooltips.clear
                    }).append($('<span>').addClass(this._options.icons.clear))));
                }
                if (this._options.buttons.showClose) {
                    row.push($('<td>').append($('<a>').attr({
                        href: '#',
                        tabindex: '-1',
                        'data-action': 'close',
                        'title': this._options.tooltips.close
                    }).append($('<span>').addClass(this._options.icons.close))));
                }
                return row.length === 0 ? '' : $('<table>').addClass('table-condensed').append($('<tbody>').append($('<tr>').append(row)));
            };

            TempusDominusBootstrap4.prototype._getTemplate = function _getTemplate() {
                var template = $('<div>').addClass('bootstrap-datetimepicker-widget dropdown-menu'),
                    dateView = $('<div>').addClass('datepicker').append(this._getDatePickerTemplate()),
                    timeView = $('<div>').addClass('timepicker').append(this._getTimePickerTemplate()),
                    content = $('<ul>').addClass('list-unstyled'),
                    toolbar = $('<li>').addClass('picker-switch' + (this._options.collapse ? ' accordion-toggle' : '')).append(this._getToolbar());

                if (this._options.inline) {
                    template.removeClass('dropdown-menu');
                }

                if (this.use24Hours) {
                    template.addClass('usetwentyfour');
                }
                if (this._isEnabled('s') && !this.use24Hours) {
                    template.addClass('wider');
                }

                if (this._options.sideBySide && this._hasDate() && this._hasTime()) {
                    template.addClass('timepicker-sbs');
                    if (this._options.toolbarPlacement === 'top') {
                        template.append(toolbar);
                    }
                    template.append($('<div>').addClass('row').append(dateView.addClass('col-md-6')).append(timeView.addClass('col-md-6')));
                    if (this._options.toolbarPlacement === 'bottom' || this._options.toolbarPlacement === 'default') {
                        template.append(toolbar);
                    }
                    return template;
                }

                if (this._options.toolbarPlacement === 'top') {
                    content.append(toolbar);
                }
                if (this._hasDate()) {
                    content.append($('<li>').addClass(this._options.collapse && this._hasTime() ? 'collapse' : '').addClass(this._options.collapse && this._hasTime() && this._options.viewMode === 'times' ? '' : 'show').append(dateView));
                }
                if (this._options.toolbarPlacement === 'default') {
                    content.append(toolbar);
                }
                if (this._hasTime()) {
                    content.append($('<li>').addClass(this._options.collapse && this._hasDate() ? 'collapse' : '').addClass(this._options.collapse && this._hasDate() && this._options.viewMode === 'times' ? 'show' : '').append(timeView));
                }
                if (this._options.toolbarPlacement === 'bottom') {
                    content.append(toolbar);
                }
                return template.append(content);
            };

            TempusDominusBootstrap4.prototype._place = function _place(e) {

                var self = e && e.data && e.data.picker || this,
                    vertical = self._options.widgetPositioning.vertical,
                    horizontal = self._options.widgetPositioning.horizontal,
                    parent = void 0;
                var position = (self.component && self.component.length ? self.component : self._element).position(),
                    offset = (self.component && self.component.length ? self.component : self._element).offset();
                if (self._options.widgetParent) {
                    parent = self._options.widgetParent.append(self.widget);
                } else if (self._element.is('input')) {
                    parent = self._element.after(self.widget).parent();
                } else if (self._options.inline) {
                    parent = self._element.append(self.widget);
                    return;
                } else {
                    parent = self._element;
                    self._element.children().first().after(self.widget);
                }

                // Top and bottom logic
                if (vertical === 'auto') {
                    // noinspection JSValidateTypes
                    if (offset.top + self.widget.height() * 1.5 >= $(window).height() + $(window).scrollTop() && self.widget.height() + self._element.outerHeight() < offset.top) {
                        vertical = 'top';
                    } else {
                        vertical = 'bottom';
                    }
                }

                // Left and right logic
                if (horizontal === 'auto') {
                    if (parent.width() < offset.left + self.widget.outerWidth() / 2 && offset.left + self.widget.outerWidth() > $(window).width()) {
                        horizontal = 'right';
                    } else {
                        horizontal = 'left';
                    }
                }

                if (vertical === 'top') {
                    self.widget.addClass('top').removeClass('bottom');
                } else {
                    self.widget.addClass('bottom').removeClass('top');
                }

                if (horizontal === 'right') {
                    self.widget.addClass('float-right');
                } else {
                    self.widget.removeClass('float-right');
                }

                // find the first parent element that has a relative css
				// positioning
                if (parent.css('position') !== 'relative') {
                    parent = parent.parents().filter(function() {
                        return $(this).css('position') === 'relative';
                    }).first();
                }

                if (parent.length === 0) {
                    throw new Error('datetimepicker component should be placed within a relative positioned container');
                }

                self.widget.css({
                    top: vertical === 'top' ? 'auto' : position.top + self._element.outerHeight() + 'px',
                    bottom: vertical === 'top' ? parent.outerHeight() - (parent === self._element ? 0 : position.top) + 'px' : 'auto',
                    left: horizontal === 'left' ? (parent === self._element ? 0 : position.left) + 'px' : 'auto',
                    right: horizontal === 'left' ? 'auto' : parent.outerWidth() - self._element.outerWidth() - (parent === self._element ? 0 : position.left) + 'px'
                });
            };

            TempusDominusBootstrap4.prototype._fillDow = function _fillDow() {
                var row = $('<tr>'),
                    currentDate = this._viewDate.clone().startOf('w').startOf('d');

                if (this._options.calendarWeeks === true) {
                    row.append($('<th>').addClass('cw').text('#'));
                }

                while (currentDate.isBefore(this._viewDate.clone().endOf('w'))) {
                    row.append($('<th>').addClass('dow').text(currentDate.format('dd')));
                    currentDate.add(1, 'd');
                }
                this.widget.find('.datepicker-days thead').append(row);
            };

            TempusDominusBootstrap4.prototype._fillMonths = function _fillMonths() {
                var spans = [],
                    monthsShort = this._viewDate.clone().startOf('y').startOf('d');
                while (monthsShort.isSame(this._viewDate, 'y')) {
                    spans.push($('<span>').attr('data-action', 'selectMonth').addClass('month').text(monthsShort.format('MMM')));
                    monthsShort.add(1, 'M');
                }
                this.widget.find('.datepicker-months td').empty().append(spans);
            };

            TempusDominusBootstrap4.prototype._updateMonths = function _updateMonths() {
                var monthsView = this.widget.find('.datepicker-months'),
                    monthsViewHeader = monthsView.find('th'),
                    months = monthsView.find('tbody').find('span'),
                    self = this;

                monthsViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevYear);
                monthsViewHeader.eq(1).attr('title', this._options.tooltips.selectYear);
                monthsViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextYear);

                monthsView.find('.disabled').removeClass('disabled');

                if (!this._isValid(this._viewDate.clone().subtract(1, 'y'), 'y')) {
                    monthsViewHeader.eq(0).addClass('disabled');
                }

                monthsViewHeader.eq(1).text(this._viewDate.year());

                if (!this._isValid(this._viewDate.clone().add(1, 'y'), 'y')) {
                    monthsViewHeader.eq(2).addClass('disabled');
                }

                months.removeClass('active');
                if (this._getLastPickedDate().isSame(this._viewDate, 'y') && !this.unset) {
                    months.eq(this._getLastPickedDate().month()).addClass('active');
                }

                months.each(function(index) {
                    if (!self._isValid(self._viewDate.clone().month(index), 'M')) {
                        $(this).addClass('disabled');
                    }
                });
            };

            TempusDominusBootstrap4.prototype._getStartEndYear = function _getStartEndYear(factor, year) {
                var step = factor / 10,
                    startYear = Math.floor(year / factor) * factor,
                    endYear = startYear + step * 9,
                    focusValue = Math.floor(year / step) * step;
                return [startYear, endYear, focusValue];
            };

            TempusDominusBootstrap4.prototype._updateYears = function _updateYears() {
                var yearsView = this.widget.find('.datepicker-years'),
                    yearsViewHeader = yearsView.find('th'),
                    yearCaps = this._getStartEndYear(10, this._viewDate.year()),
                    startYear = this._viewDate.clone().year(yearCaps[0]),
                    endYear = this._viewDate.clone().year(yearCaps[1]);
                var html = '';

                yearsViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevDecade);
                yearsViewHeader.eq(1).attr('title', this._options.tooltips.selectDecade);
                yearsViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextDecade);

                yearsView.find('.disabled').removeClass('disabled');

                if (this._options.minDate && this._options.minDate.isAfter(startYear, 'y')) {
                    yearsViewHeader.eq(0).addClass('disabled');
                }

                yearsViewHeader.eq(1).text(startYear.year() + '-' + endYear.year());

                if (this._options.maxDate && this._options.maxDate.isBefore(endYear, 'y')) {
                    yearsViewHeader.eq(2).addClass('disabled');
                }

                html += '<span data-action="selectYear" class="year old' + (!this._isValid(startYear, 'y') ? ' disabled' : '') + '">' + (startYear.year() - 1) + '</span>';
                while (!startYear.isAfter(endYear, 'y')) {
                    html += '<span data-action="selectYear" class="year' + (startYear.isSame(this._getLastPickedDate(), 'y') && !this.unset ? ' active' : '') + (!this._isValid(startYear, 'y') ? ' disabled' : '') + '">' + startYear.year() + '</span>';
                    startYear.add(1, 'y');
                }
                html += '<span data-action="selectYear" class="year old' + (!this._isValid(startYear, 'y') ? ' disabled' : '') + '">' + startYear.year() + '</span>';

                yearsView.find('td').html(html);
            };

            TempusDominusBootstrap4.prototype._updateDecades = function _updateDecades() {
                var decadesView = this.widget.find('.datepicker-decades'),
                    decadesViewHeader = decadesView.find('th'),
                    yearCaps = this._getStartEndYear(100, this._viewDate.year()),
                    startDecade = this._viewDate.clone().year(yearCaps[0]),
                    endDecade = this._viewDate.clone().year(yearCaps[1]);
                var minDateDecade = false,
                    maxDateDecade = false,
                    endDecadeYear = void 0,
                    html = '';

                decadesViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevCentury);
                decadesViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextCentury);

                decadesView.find('.disabled').removeClass('disabled');

                if (startDecade.year() === 0 || this._options.minDate && this._options.minDate.isAfter(startDecade, 'y')) {
                    decadesViewHeader.eq(0).addClass('disabled');
                }

                decadesViewHeader.eq(1).text(startDecade.year() + '-' + endDecade.year());

                if (this._options.maxDate && this._options.maxDate.isBefore(endDecade, 'y')) {
                    decadesViewHeader.eq(2).addClass('disabled');
                }

                if (startDecade.year() - 10 < 0) {
                    html += '<span>&nbsp;</span>';
                } else {
                    html += '<span data-action="selectDecade" class="decade old" data-selection="' + (startDecade.year() + 6) + '">' + (startDecade.year() - 10) + '</span>';
                }

                while (!startDecade.isAfter(endDecade, 'y')) {
                    endDecadeYear = startDecade.year() + 11;
                    minDateDecade = this._options.minDate && this._options.minDate.isAfter(startDecade, 'y') && this._options.minDate.year() <= endDecadeYear;
                    maxDateDecade = this._options.maxDate && this._options.maxDate.isAfter(startDecade, 'y') && this._options.maxDate.year() <= endDecadeYear;
                    html += '<span data-action="selectDecade" class="decade' + (this._getLastPickedDate().isAfter(startDecade) && this._getLastPickedDate().year() <= endDecadeYear ? ' active' : '') + (!this._isValid(startDecade, 'y') && !minDateDecade && !maxDateDecade ? ' disabled' : '') + '" data-selection="' + (startDecade.year() + 6) + '">' + startDecade.year() + '</span>';
                    startDecade.add(10, 'y');
                }
                html += '<span data-action="selectDecade" class="decade old" data-selection="' + (startDecade.year() + 6) + '">' + startDecade.year() + '</span>';

                decadesView.find('td').html(html);
            };

            TempusDominusBootstrap4.prototype._fillDate = function _fillDate() {
                var daysView = this.widget.find('.datepicker-days'),
                    daysViewHeader = daysView.find('th'),
                    html = [];
                var currentDate = void 0,
                    row = void 0,
                    clsName = void 0,
                    i = void 0;

                if (!this._hasDate()) {
                    return;
                }

                daysViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevMonth);
                daysViewHeader.eq(1).attr('title', this._options.tooltips.selectMonth);
                daysViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextMonth);

                daysView.find('.disabled').removeClass('disabled');
                daysViewHeader.eq(1).text(this._viewDate.format(this._options.dayViewHeaderFormat));

                if (!this._isValid(this._viewDate.clone().subtract(1, 'M'), 'M')) {
                    daysViewHeader.eq(0).addClass('disabled');
                }
                if (!this._isValid(this._viewDate.clone().add(1, 'M'), 'M')) {
                    daysViewHeader.eq(2).addClass('disabled');
                }

                currentDate = this._viewDate.clone().startOf('M').startOf('w').startOf('d');

                for (i = 0; i < 42; i++) {
                    // always display 42 days (should show 6 weeks)
                    if (currentDate.weekday() === 0) {
                        row = $('<tr>');
                        if (this._options.calendarWeeks) {
                            row.append('<td class="cw">' + currentDate.week() + '</td>');
                        }
                        html.push(row);
                    }
                    clsName = '';
                    if (currentDate.isBefore(this._viewDate, 'M')) {
                        clsName += ' old';
                    }
                    if (currentDate.isAfter(this._viewDate, 'M')) {
                        clsName += ' new';
                    }
                    if (this._options.allowMultidate) {
                        var index = this._datesFormatted.indexOf(currentDate.format('YYYY-MM-DD'));
                        if (index !== -1) {
                            if (currentDate.isSame(this._datesFormatted[index], 'd') && !this.unset) {
                                clsName += ' active';
                            }
                        }
                    } else {
                        if (currentDate.isSame(this._getLastPickedDate(), 'd') && !this.unset) {
                            clsName += ' active';
                        }
                    }
                    if (!this._isValid(currentDate, 'd')) {
                        clsName += ' disabled';
                    }
                    if (currentDate.isSame(this.getMoment(), 'd')) {
                        clsName += ' today';
                    }
                    if (currentDate.day() === 0 || currentDate.day() === 6) {
                        clsName += ' weekend';
                    }
                    row.append('<td data-action="selectDay" data-day="' + currentDate.format('L') + '" class="day' + clsName + '">' + currentDate.date() + '</td>');
                    currentDate.add(1, 'd');
                }

                daysView.find('tbody').empty().append(html);

                this._updateMonths();

                this._updateYears();

                this._updateDecades();
            };

            TempusDominusBootstrap4.prototype._fillHours = function _fillHours() {
                var table = this.widget.find('.timepicker-hours table'),
                    currentHour = this._viewDate.clone().startOf('d'),
                    html = [];
                var row = $('<tr>');

                if (this._viewDate.hour() > 11 && !this.use24Hours) {
                    currentHour.hour(12);
                }
                while (currentHour.isSame(this._viewDate, 'd') && (this.use24Hours || this._viewDate.hour() < 12 && currentHour.hour() < 12 || this._viewDate.hour() > 11)) {
                    if (currentHour.hour() % 4 === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectHour" class="hour' + (!this._isValid(currentHour, 'h') ? ' disabled' : '') + '">' + currentHour.format(this.use24Hours ? 'HH' : 'hh') + '</td>');
                    currentHour.add(1, 'h');
                }
                table.empty().append(html);
            };

            TempusDominusBootstrap4.prototype._fillMinutes = function _fillMinutes() {
                var table = this.widget.find('.timepicker-minutes table'),
                    currentMinute = this._viewDate.clone().startOf('h'),
                    html = [],
                    step = this._options.stepping === 1 ? 5 : this._options.stepping;
                var row = $('<tr>');

                while (this._viewDate.isSame(currentMinute, 'h')) {
                    if (currentMinute.minute() % (step * 4) === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectMinute" class="minute' + (!this._isValid(currentMinute, 'm') ? ' disabled' : '') + '">' + currentMinute.format('mm') + '</td>');
                    currentMinute.add(step, 'm');
                }
                table.empty().append(html);
            };

            TempusDominusBootstrap4.prototype._fillSeconds = function _fillSeconds() {
                var table = this.widget.find('.timepicker-seconds table'),
                    currentSecond = this._viewDate.clone().startOf('m'),
                    html = [];
                var row = $('<tr>');

                while (this._viewDate.isSame(currentSecond, 'm')) {
                    if (currentSecond.second() % 20 === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectSecond" class="second' + (!this._isValid(currentSecond, 's') ? ' disabled' : '') + '">' + currentSecond.format('ss') + '</td>');
                    currentSecond.add(5, 's');
                }

                table.empty().append(html);
            };

            TempusDominusBootstrap4.prototype._fillTime = function _fillTime() {
                var toggle = void 0,
                    newDate = void 0;
                var timeComponents = this.widget.find('.timepicker span[data-time-component]');

                if (!this.use24Hours) {
                    toggle = this.widget.find('.timepicker [data-action=togglePeriod]');
                    newDate = this._getLastPickedDate().clone().add(this._getLastPickedDate().hours() >= 12 ? -12 : 12, 'h');

                    toggle.text(this._getLastPickedDate().format('A'));

                    if (this._isValid(newDate, 'h')) {
                        toggle.removeClass('disabled');
                    } else {
                        toggle.addClass('disabled');
                    }
                }
                timeComponents.filter('[data-time-component=hours]').text(this._getLastPickedDate().format('' + (this.use24Hours ? 'HH' : 'hh')));
                timeComponents.filter('[data-time-component=minutes]').text(this._getLastPickedDate().format('mm'));
                timeComponents.filter('[data-time-component=seconds]').text(this._getLastPickedDate().format('ss'));

                this._fillHours();
                this._fillMinutes();
                this._fillSeconds();
            };

            TempusDominusBootstrap4.prototype._doAction = function _doAction(e, action) {
                var lastPicked = this._getLastPickedDate();
                if ($(e.currentTarget).is('.disabled')) {
                    return false;
                }
                action = action || $(e.currentTarget).data('action');
                switch (action) {
                    case 'next':
                        {
                            var navFnc = DateTimePicker.DatePickerModes[this.currentViewMode].NAV_FUNCTION;
                            this._viewDate.add(DateTimePicker.DatePickerModes[this.currentViewMode].NAV_STEP, navFnc);
                            this._fillDate();
                            this._viewUpdate(navFnc);
                            break;
                        }
                    case 'previous':
                        {
                            var _navFnc = DateTimePicker.DatePickerModes[this.currentViewMode].NAV_FUNCTION;
                            this._viewDate.subtract(DateTimePicker.DatePickerModes[this.currentViewMode].NAV_STEP, _navFnc);
                            this._fillDate();
                            this._viewUpdate(_navFnc);
                            break;
                        }
                    case 'pickerSwitch':
                        this._showMode(1);
                        break;
                    case 'selectMonth':
                        {
                            var month = $(e.target).closest('tbody').find('span').index($(e.target));
                            this._viewDate.month(month);
                            if (this.currentViewMode === this.MinViewModeNumber) {
                                this._setValue(lastPicked.clone().year(this._viewDate.year()).month(this._viewDate.month()), this._getLastPickedDateIndex());
                                if (!this._options.inline) {
                                    this.hide();
                                }
                            } else {
                                this._showMode(-1);
                                this._fillDate();
                            }
                            this._viewUpdate('M');
                            break;
                        }
                    case 'selectYear':
                        {
                            var year = parseInt($(e.target).text(), 10) || 0;
                            this._viewDate.year(year);
                            if (this.currentViewMode === this.MinViewModeNumber) {
                                this._setValue(lastPicked.clone().year(this._viewDate.year()), this._getLastPickedDateIndex());
                                if (!this._options.inline) {
                                    this.hide();
                                }
                            } else {
                                this._showMode(-1);
                                this._fillDate();
                            }
                            this._viewUpdate('YYYY');
                            break;
                        }
                    case 'selectDecade':
                        {
                            var _year = parseInt($(e.target).data('selection'), 10) || 0;
                            this._viewDate.year(_year);
                            if (this.currentViewMode === this.MinViewModeNumber) {
                                this._setValue(lastPicked.clone().year(this._viewDate.year()), this._getLastPickedDateIndex());
                                if (!this._options.inline) {
                                    this.hide();
                                }
                            } else {
                                this._showMode(-1);
                                this._fillDate();
                            }
                            this._viewUpdate('YYYY');
                            break;
                        }
                    case 'selectDay':
                        {
                            var day = this._viewDate.clone();
                            if ($(e.target).is('.old')) {
                                day.subtract(1, 'M');
                            }
                            if ($(e.target).is('.new')) {
                                day.add(1, 'M');
                            }

                            var selectDate = day.date(parseInt($(e.target).text(), 10)),
                                index = 0;
                            if (this._options.allowMultidate) {
                                index = this._datesFormatted.indexOf(selectDate.format('YYYY-MM-DD'));
                                if (index !== -1) {
                                    this._setValue(null, index); // deselect
																	// multidate
                                } else {
                                    this._setValue(selectDate, this._getLastPickedDateIndex() + 1);
                                }
                            } else {
                                this._setValue(selectDate, this._getLastPickedDateIndex());
                            }

                            if (!this._hasTime() && !this._options.keepOpen && !this._options.inline && !this._options.allowMultidate) {
                                this.hide();
                            }
                            break;
                        }
                    case 'incrementHours':
                        {
                            var newDate = lastPicked.clone().add(1, 'h');
                            if (this._isValid(newDate, 'h')) {
                                this._setValue(newDate, this._getLastPickedDateIndex());
                            }
                            break;
                        }
                    case 'incrementMinutes':
                        {
                            var _newDate = lastPicked.clone().add(this._options.stepping, 'm');
                            if (this._isValid(_newDate, 'm')) {
                                this._setValue(_newDate, this._getLastPickedDateIndex());
                            }
                            break;
                        }
                    case 'incrementSeconds':
                        {
                            var _newDate2 = lastPicked.clone().add(1, 's');
                            if (this._isValid(_newDate2, 's')) {
                                this._setValue(_newDate2, this._getLastPickedDateIndex());
                            }
                            break;
                        }
                    case 'decrementHours':
                        {
                            var _newDate3 = lastPicked.clone().subtract(1, 'h');
                            if (this._isValid(_newDate3, 'h')) {
                                this._setValue(_newDate3, this._getLastPickedDateIndex());
                            }
                            break;
                        }
                    case 'decrementMinutes':
                        {
                            var _newDate4 = lastPicked.clone().subtract(this._options.stepping, 'm');
                            if (this._isValid(_newDate4, 'm')) {
                                this._setValue(_newDate4, this._getLastPickedDateIndex());
                            }
                            break;
                        }
                    case 'decrementSeconds':
                        {
                            var _newDate5 = lastPicked.clone().subtract(1, 's');
                            if (this._isValid(_newDate5, 's')) {
                                this._setValue(_newDate5, this._getLastPickedDateIndex());
                            }
                            break;
                        }
                    case 'togglePeriod':
                        {
                            this._setValue(lastPicked.clone().add(lastPicked.hours() >= 12 ? -12 : 12, 'h'), this._getLastPickedDateIndex());
                            break;
                        }
                    case 'togglePicker':
                        {
                            var $this = $(e.target),
                                $link = $this.closest('a'),
                                $parent = $this.closest('ul'),
                                expanded = $parent.find('.show'),
                                closed = $parent.find('.collapse:not(.show)'),
                                $span = $this.is('span') ? $this : $this.find('span');
                            var collapseData = void 0;

                            if (expanded && expanded.length) {
                                collapseData = expanded.data('collapse');
                                if (collapseData && collapseData.transitioning) {
                                    return true;
                                }
                                if (expanded.collapse) {
                                    // if collapse plugin is available through
									// bootstrap.js then use it
                                    expanded.collapse('hide');
                                    closed.collapse('show');
                                } else {
                                    // otherwise just toggle in class on the two
									// views
                                    expanded.removeClass('show');
                                    closed.addClass('show');
                                }
                                $span.toggleClass(this._options.icons.time + ' ' + this._options.icons.date);

                                if ($span.hasClass(this._options.icons.date)) {
                                    $link.attr('title', this._options.tooltips.selectDate);
                                } else {
                                    $link.attr('title', this._options.tooltips.selectTime);
                                }
                            }
                        }
                        break;
                    case 'showPicker':
                        this.widget.find('.timepicker > div:not(.timepicker-picker)').hide();
                        this.widget.find('.timepicker .timepicker-picker').show();
                        break;
                    case 'showHours':
                        this.widget.find('.timepicker .timepicker-picker').hide();
                        this.widget.find('.timepicker .timepicker-hours').show();
                        break;
                    case 'showMinutes':
                        this.widget.find('.timepicker .timepicker-picker').hide();
                        this.widget.find('.timepicker .timepicker-minutes').show();
                        break;
                    case 'showSeconds':
                        this.widget.find('.timepicker .timepicker-picker').hide();
                        this.widget.find('.timepicker .timepicker-seconds').show();
                        break;
                    case 'selectHour':
                        {
                            var hour = parseInt($(e.target).text(), 10);

                            if (!this.use24Hours) {
                                if (lastPicked.hours() >= 12) {
                                    if (hour !== 12) {
                                        hour += 12;
                                    }
                                } else {
                                    if (hour === 12) {
                                        hour = 0;
                                    }
                                }
                            }
                            this._setValue(lastPicked.clone().hours(hour), this._getLastPickedDateIndex());
                            if (!this._isEnabled('a') && !this._isEnabled('m') && !this._options.keepOpen && !this._options.inline) {
                                this.hide();
                            } else {
                                this._doAction(e, 'showPicker');
                            }
                            break;
                        }
                    case 'selectMinute':
                        this._setValue(lastPicked.clone().minutes(parseInt($(e.target).text(), 10)), this._getLastPickedDateIndex());
                        if (!this._isEnabled('a') && !this._isEnabled('s') && !this._options.keepOpen && !this._options.inline) {
                            this.hide();
                        } else {
                            this._doAction(e, 'showPicker');
                        }
                        break;
                    case 'selectSecond':
                        this._setValue(lastPicked.clone().seconds(parseInt($(e.target).text(), 10)), this._getLastPickedDateIndex());
                        if (!this._isEnabled('a') && !this._options.keepOpen && !this._options.inline) {
                            this.hide();
                        } else {
                            this._doAction(e, 'showPicker');
                        }
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'close':
                        this.hide();
                        break;
                    case 'today':
                        {
                            var todaysDate = this.getMoment();
                            if (this._isValid(todaysDate, 'd')) {
                                this._setValue(todaysDate, this._getLastPickedDateIndex());
                            }
                            break;
                        }
                }
                return false;
            };

            // public


            TempusDominusBootstrap4.prototype.hide = function hide() {
                var transitioning = false;
                if (!this.widget) {
                    return;
                }
                // Ignore event if in the middle of a picker transition
                this.widget.find('.collapse').each(function() {
                    var collapseData = $(this).data('collapse');
                    if (collapseData && collapseData.transitioning) {
                        transitioning = true;
                        return false;
                    }
                    return true;
                });
                if (transitioning) {
                    return;
                }
                if (this.component && this.component.hasClass('btn')) {
                    this.component.toggleClass('active');
                }
                this.widget.hide();

                $(window).off('resize', this._place());
                this.widget.off('click', '[data-action]');
                this.widget.off('mousedown', false);

                this.widget.remove();
                this.widget = false;

                this._notifyEvent({
                    type: DateTimePicker.Event.HIDE,
                    date: this._getLastPickedDate().clone()
                });

                if (this.input !== undefined) {
                    this.input.blur();
                }

                this._viewDate = this._getLastPickedDate().clone();
            };

            TempusDominusBootstrap4.prototype.show = function show() {
                var currentMoment = void 0;
                var useCurrentGranularity = {
                    'year': function year(m) {
                        return m.month(0).date(1).hours(0).seconds(0).minutes(0);
                    },
                    'month': function month(m) {
                        return m.date(1).hours(0).seconds(0).minutes(0);
                    },
                    'day': function day(m) {
                        return m.hours(0).seconds(0).minutes(0);
                    },
                    'hour': function hour(m) {
                        return m.seconds(0).minutes(0);
                    },
                    'minute': function minute(m) {
                        return m.seconds(0);
                    }
                };

                if (this.input !== undefined) {
                    if (this.input.prop('disabled') || !this._options.ignoreReadonly && this.input.prop('readonly') || this.widget) {
                        return;
                    }
                    if (this.input.val() !== undefined && this.input.val().trim().length !== 0) {
                        this._setValue(this._parseInputDate(this.input.val().trim()), 0);
                    } else if (this.unset && this._options.useCurrent) {
                        currentMoment = this.getMoment();
                        if (typeof this._options.useCurrent === 'string') {
                            currentMoment = useCurrentGranularity[this._options.useCurrent](currentMoment);
                        }
                        this._setValue(currentMoment, 0);
                    }
                } else if (this.unset && this._options.useCurrent) {
                    currentMoment = this.getMoment();
                    if (typeof this._options.useCurrent === 'string') {
                        currentMoment = useCurrentGranularity[this._options.useCurrent](currentMoment);
                    }
                    this._setValue(currentMoment, 0);
                }

                this.widget = this._getTemplate();

                this._fillDow();
                this._fillMonths();

                this.widget.find('.timepicker-hours').hide();
                this.widget.find('.timepicker-minutes').hide();
                this.widget.find('.timepicker-seconds').hide();

                this._update();
                this._showMode();

                $(window).on('resize', { picker: this }, this._place);
                this.widget.on('click', '[data-action]', $.proxy(this._doAction, this)); // this
																							// handles
																							// clicks
																							// on
																							// the
																							// widget
                this.widget.on('mousedown', false);

                if (this.component && this.component.hasClass('btn')) {
                    this.component.toggleClass('active');
                }
                this._place();
                this.widget.show();
                if (this.input !== undefined && this._options.focusOnShow && !this.input.is(':focus')) {
                    this.input.focus();
                }

                this._notifyEvent({
                    type: DateTimePicker.Event.SHOW
                });
            };

            TempusDominusBootstrap4.prototype.destroy = function destroy() {
                this.hide();
                // todo doc off?
                this._element.removeData(DateTimePicker.DATA_KEY);
                this._element.removeData('date');
            };

            TempusDominusBootstrap4.prototype.disable = function disable() {
                this.hide();
                if (this.component && this.component.hasClass('btn')) {
                    this.component.addClass('disabled');
                }
                if (this.input !== undefined) {
                    this.input.prop('disabled', true); // todo disable
														// this/comp if input is
														// null
                }
            };

            TempusDominusBootstrap4.prototype.enable = function enable() {
                if (this.component && this.component.hasClass('btn')) {
                    this.component.removeClass('disabled');
                }
                if (this.input !== undefined) {
                    this.input.prop('disabled', false); // todo enable comp/this
														// if input is null
                }
            };

            TempusDominusBootstrap4.prototype.toolbarPlacement = function toolbarPlacement(_toolbarPlacement) {
                if (arguments.length === 0) {
                    return this._options.toolbarPlacement;
                }

                if (typeof _toolbarPlacement !== 'string') {
                    throw new TypeError('toolbarPlacement() expects a string parameter');
                }
                if (toolbarPlacements.indexOf(_toolbarPlacement) === -1) {
                    throw new TypeError('toolbarPlacement() parameter must be one of (' + toolbarPlacements.join(', ') + ') value');
                }
                this._options.toolbarPlacement = _toolbarPlacement;

                if (this.widget) {
                    this.hide();
                    this.show();
                }
            };

            TempusDominusBootstrap4.prototype.widgetPositioning = function widgetPositioning(_widgetPositioning) {
                if (arguments.length === 0) {
                    return $.extend({}, this._options.widgetPositioning);
                }

                if ({}.toString.call(_widgetPositioning) !== '[object Object]') {
                    throw new TypeError('widgetPositioning() expects an object variable');
                }
                if (_widgetPositioning.horizontal) {
                    if (typeof _widgetPositioning.horizontal !== 'string') {
                        throw new TypeError('widgetPositioning() horizontal variable must be a string');
                    }
                    _widgetPositioning.horizontal = _widgetPositioning.horizontal.toLowerCase();
                    if (horizontalModes.indexOf(_widgetPositioning.horizontal) === -1) {
                        throw new TypeError('widgetPositioning() expects horizontal parameter to be one of (' + horizontalModes.join(', ') + ')');
                    }
                    this._options.widgetPositioning.horizontal = _widgetPositioning.horizontal;
                }
                if (_widgetPositioning.vertical) {
                    if (typeof _widgetPositioning.vertical !== 'string') {
                        throw new TypeError('widgetPositioning() vertical variable must be a string');
                    }
                    _widgetPositioning.vertical = _widgetPositioning.vertical.toLowerCase();
                    if (verticalModes.indexOf(_widgetPositioning.vertical) === -1) {
                        throw new TypeError('widgetPositioning() expects vertical parameter to be one of (' + verticalModes.join(', ') + ')');
                    }
                    this._options.widgetPositioning.vertical = _widgetPositioning.vertical;
                }
                this._update();
            };

            TempusDominusBootstrap4.prototype.widgetParent = function widgetParent(_widgetParent) {
                if (arguments.length === 0) {
                    return this._options.widgetParent;
                }

                if (typeof _widgetParent === 'string') {
                    _widgetParent = $(_widgetParent);
                }

                if (_widgetParent !== null && typeof _widgetParent !== 'string' && !(_widgetParent instanceof $)) {
                    throw new TypeError('widgetParent() expects a string or a jQuery object parameter');
                }

                this._options.widgetParent = _widgetParent;
                if (this.widget) {
                    this.hide();
                    this.show();
                }
            };

            // static


            TempusDominusBootstrap4._jQueryHandleThis = function _jQueryHandleThis(me, option, argument) {
                var data = $(me).data(DateTimePicker.DATA_KEY);
                if ((typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object') {
                    $.extend({}, DateTimePicker.Default, option);
                }

                if (!data) {
                    data = new TempusDominusBootstrap4($(me), option);
                    $(me).data(DateTimePicker.DATA_KEY, data);
                }

                if (typeof option === 'string') {
                    if (data[option] === undefined) {
                        throw new Error('No method named "' + option + '"');
                    }
                    if (argument === undefined) {
                        return data[option]();
                    } else {
                        return data[option](argument);
                    }
                }
            };

            TempusDominusBootstrap4._jQueryInterface = function _jQueryInterface(option, argument) {
                if (this.length === 1) {
                    return TempusDominusBootstrap4._jQueryHandleThis(this[0], option, argument);
                }
                return this.each(function() {
                    TempusDominusBootstrap4._jQueryHandleThis(this, option, argument);
                });
            };

            return TempusDominusBootstrap4;
        }(DateTimePicker);

        /**
		 * ------------------------------------------------------------------------
		 * jQuery
		 * ------------------------------------------------------------------------
		 */


        $(document).on(DateTimePicker.Event.CLICK_DATA_API, DateTimePicker.Selector.DATA_TOGGLE, function() {
            var $target = getSelectorFromElement($(this));
            if ($target.length === 0) {
                return;
            }
            TempusDominusBootstrap4._jQueryInterface.call($target, 'toggle');
        }).on(DateTimePicker.Event.CHANGE, '.' + DateTimePicker.ClassName.INPUT, function(event) {
            var $target = getSelectorFromElement($(this));
            if ($target.length === 0) {
                return;
            }
            TempusDominusBootstrap4._jQueryInterface.call($target, '_change', event);
        }).on(DateTimePicker.Event.BLUR, '.' + DateTimePicker.ClassName.INPUT, function(event) {
            var $target = getSelectorFromElement($(this)),
                config = $target.data(DateTimePicker.DATA_KEY);
            if ($target.length === 0) {
                return;
            }
            if (config._options.debug || window.debug) {
                return;
            }
            TempusDominusBootstrap4._jQueryInterface.call($target, 'hide', event);
        }).on(DateTimePicker.Event.KEYDOWN, '.' + DateTimePicker.ClassName.INPUT, function(event) {
            var $target = getSelectorFromElement($(this));
            if ($target.length === 0) {
                return;
            }
            TempusDominusBootstrap4._jQueryInterface.call($target, '_keydown', event);
        }).on(DateTimePicker.Event.KEYUP, '.' + DateTimePicker.ClassName.INPUT, function(event) {
            var $target = getSelectorFromElement($(this));
            if ($target.length === 0) {
                return;
            }
            TempusDominusBootstrap4._jQueryInterface.call($target, '_keyup', event);
        }).on(DateTimePicker.Event.FOCUS, '.' + DateTimePicker.ClassName.INPUT, function(event) {
            var $target = getSelectorFromElement($(this)),
                config = $target.data(DateTimePicker.DATA_KEY);
            if ($target.length === 0) {
                return;
            }
            if (!config._options.allowInputToggle) {
                return;
            }
            TempusDominusBootstrap4._jQueryInterface.call($target, 'show', event);
        });

        $.fn[DateTimePicker.NAME] = TempusDominusBootstrap4._jQueryInterface;
        $.fn[DateTimePicker.NAME].Constructor = TempusDominusBootstrap4;
        $.fn[DateTimePicker.NAME].noConflict = function() {
            $.fn[DateTimePicker.NAME] = JQUERY_NO_CONFLICT;
            return TempusDominusBootstrap4._jQueryInterface;
        };

        return TempusDominusBootstrap4;
    }(jQuery);

}();