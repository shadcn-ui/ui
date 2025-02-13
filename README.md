[![Build Status](https://github.com/w3c/specberus/workflows/Specberus%20tests/badge.svg)](https://github.com/w3c/specberus/actions)
[![Coverage Status](https://coveralls.io/repos/w3c/specberus/badge.svg)](https://coveralls.io/r/w3c/specberus)
[![Dependency Status](https://david-dm.org/w3c/specberus.svg)](https://david-dm.org/w3c/specberus)
[![devDependency Status](https://david-dm.org/w3c/specberus/dev-status.svg)](https://david-dm.org/w3c/specberus#info=devDependencies)

# Specberus

Specberus is a checker used at [W3C](https://www.w3.org/) to validate the compliance of [Technical Reports](https://www.w3.org/TR/) with publication rules.

1. [Installation](#1-installation)
1. [Running](#2-running)
1. [Testing](#3-testing)
1. [JS API](#4-js-api)
1. [REST API](#5-rest-api)
1. [Profiles](#6-profiles)
1. [Validation events](#7-validation-events)
1. [Writing rules](#8-writing-rules)

## 1. Installation

Specberus is a [Node.js](https://nodejs.org/en/) application, [distributed through npm](https://www.npmjs.com/package/specberus).
Alternatively, you can clone [the repository](https://github.com/w3c/specberus) and run:

```bash
$ npm install -d
```

In order to get all the dependencies installed. Naturally, this requires that you have a reasonably
recent version of Node.js installed.

## 2. Running

Currently there is no shell to run Specberus. Later we will add both Web and CLI interfaces based
on the same core library.

### Syntax and command-line parameters

```bash
$ npm start [PORT]
```

Meaning of positional parameters:

1. `PORT`: where Specberus will be listening for HTTP connections.
   (Default `80`.)

Examples:

```bash
$ npm start
$ npm start 3001
```

![running specberus](doc/running.jpg)

Set the environment variable `DEBUG` to run in _debug mode_ instead:

```bash
$ DEBUG=true npm run start
```

This modifies the behaviour of certain parts of the application to facilitate debugging.
eg, CSS and JS resources will _not_ be loaded in their minified/uglified forms
(the web UI will load `bootstrap.css`, `bootstrap.js` and `jquery.js` instead of `bootstrap.min.css`, `bootstrap.min.js` and `jquery.min.js`).

If Specberus is _not_ going to be served from the root directory of a domain, or if it will be served through a proxy,
set also `BASE_URI` pointing to the public root URI of Specberus; eg

```bash
$ BASE_URI=https://spec-store.com/check/ npm start
$ BASE_URI=/hostname/can/be/omitted/ npm start 88
```

2. Auto reload when developing

Run `npm run live` when developing. The app will automatically reload when changes happen.

```bash
$ npm run live

$ npm run live 3001
```

## 3. Testing

#### 1. Simple test

Testing is done using mocha. Simply run:

```bash
$ mocha
```

from the root and you will be running the test suite. Mocha can be installed with:

```bash
$ npm install -g mocha
```

#### 2. SKIP_NETWORK

Some of the tests can on occasion take a long time, or fail outright because a remote service is
unavailable. To work around this, you can set SKIP_NETWORK:

```bash
$ SKIP_NETWORK=1 mocha
```

#### 3. Run testserver

The testcase document can run independently

```bash
$ npm run testserver
```

#### 4. Run certain test

Add process env before `npm run test` and `describe.only()` to run single test.

```
// test/rules.js
describe.only('Making sure Specberus is not broken...', () => {
```

The following example only run test for the http://localhost:8001/doc-views/TR/Recommendation/WD?rule=copyright&type=noCopyright document.

```bash
$ RULE=copyright TYPE=noCopyright PROFILE=WD npm run test
```

The following example run tests to all the documents, but limit to `copyright` rule and using the `noCopyright` data.

```bash
$ RULE=copyright TYPE=noCopyright npm run test
```

-   http://localhost:8001/doc-views/TR/Recommendation/WD?rule=copyright&type=noCopyright
-   http://localhost:8001/doc-views/TR/Registry/CRYD/?rule=copyright&type=noCopyright
-   http://localhost:8001/doc-views/TR/Note/DNOTE-Echidna?rule=copyright&type=noCopyright
-   ... and all profiles

## 4. JS API

The interface you get when you `require("specberus")` is that from `lib/validator`. It returns a
`Specberus` instance that is properly configured for operation in the Node.js environment
(there is nominal support for running Specberus under other environments, but it isn't usable at this time).

(See also [the REST API](#5-rest-api).)

## Creating a Validator instance

```js
const { Specberus } = require('specberus');
const specberus = new Specberus(apiKey);
// specberus.validate(...)
// specberus.extractMetadata(...)
```

### `validate(options)`

This method takes an object with the following fields:

-   `url`: URL of the content to check. One of `url`, `source`, `file`, or `document` must be
    specified and if several are they will be used in this order.
-   `source`: A `String` with the content to check.
-   `file`: A file system path to the content to check.
-   `document`: A DOM `Document` object to be checked.
-   `profile`: A profile object which defines the validation. Required. See below.
-   `events`: An event sink which supports the same interface as the Node.js `EventEmitter`. Required. See
    below for the events that get generated.

### `extractMetadata(options)`

This method eventually extends `this` with metadata inferred from the document.
Once the [event `end-all`](#validation-events) is emitted, the metadata should be available in a new property called `meta`.

The `options` accepted are equal to those in `validate()`, except that a `profile` is not necessary and will be ignored (finding out the profile is one of the
goals of this method).

`this.meta` will be an `Object` and may include up to 16 properties described below:

-   `profile`
-   `title`: The (possible) title of the document.
-   `docDate`: The date associated to the document.
-   `thisVersion`: URL of this version of the document.
-   `latestVersion`: URL of the latest version of the document.
-   `previousVersion`: URL of the previous version of the document (the last one, if multiple are shown).
-   `editorsDraft`: URL of the latest editor's draft.
-   `delivererIDs`: ID(s) of the deliverer(s); an `Array` of `Number`s.
-   `editorIDs`: ID(s) of the editor(s) responsible for the document; an `Array` of `Number`s.
-   `informative`: Whether the document in informative or not.
-   `process`: The process rules link.
-   `sameWorkAs`: The previous shortlink if any.
-   `implementationFeedbackDue`: The implementation review date for CRs.
-   `prReviewsDue`: The review date for PRs.
-   `implementationReport`: Implementation report link for CRs, PRs and RECs.
-   `errata`: The errata link of the document.
-   `substantiveChanges`: Whether the document is a REC and has proposed amendments
-   `newFeatures`: Whether the document is a REC and has proposed additions

If some of these pieces of metadata cannot be deduced, that key will not exist, or its value will not be defined.

This is an example of the value of `Specberus.meta` after the execution of `Specberus.extractMetadata()`:

```json
{
    "profile": "WD",
    "title": "Title of the spec",
    "docDate": "2016-2-3",
    "thisVersion": "https://www.w3.org/TR/2016/WD-foobar-20160203/",
    "latestVersion": "https://www.w3.org/TR/foobar/",
    "previousVersion": "https://www.w3.org/TR/2015/WD-foobar-20150101/",
    "editorsDraft": "https://w3c.github.io/foobar/",
    "delivererIDs": [123, 456],
    "editorIDs": [12345],
    "informative": false,
    "process": "https://www.w3.org/2015/Process-20150901/"
}
```

## 5. REST API

Similar to the [JS API](#4-js-api), Specberus exposes a REST API via HTTP too.

The endpoint is `<host>/api/`.
Use either `url` or `file` to pass along the document (neither `source` nor `document` are allowed).

Note: If you want to use the public W3C instance of Specberus, you can replace `<host>` with `https://www.w3.org/pubrules`.

There are three `GET` methods available.

### `version`

Returns the version string, eg `1.5.3`.

### `metadata`

Extract all known metadata from a document; see [below](#return-values) for information about the return value.

### `validate`

Check the document ([syntax](#validateoptions)).
Many of [the options understood by the JS method `validate`](#validateoptions) are accepted.

The special profile `auto` is also available.

### Examples

#### 1. Get API version of Pubrules

`https://www.w3.org/pubrules/api/version`

e.g. https://www.w3.org/pubrules/api/version

#### 2. Get metadata of one document.

`https://www.w3.org/pubrules/api/metadata?url=https://example.com/doc.html`

Metadata is a bunch of data extracted from the document. It includes the type (profile) of the document, publish date, editors' names, Patent Policy version the document is under, etc...

e.g. https://www.w3.org/pubrules/api/metadata?url=https://www.w3.org/TR/2021/WD-i18n-glossary-20210708/

#### 3. Validate the document using profile: auto

`https://www.w3.org/pubrules/api/validate?url=https://example.com/doc.html&profile=auto`

`auto` profile is the easiest way to validate a document. The validation relies on the automatically extracted data.

The validation result contains both the **metadata** and the **errors**/**warnings** regarding the document.

e.g. https://www.w3.org/pubrules/api/validate?url=https://www.w3.org/TR/2021/WD-i18n-glossary-20210708/&profile=auto

#### 4. Validate the document using manual configs

`https://www.w3.org/pubrules/api/validate?url=https://example.com/doc.html&profile=WD&validation=simple-validation&patentPolicy=pp2020`

Pubrules supports advanced configs to make the validation more accurate.

| Config          | Explanation                                                             | Supported value                             |
| --------------- | ----------------------------------------------------------------------- | ------------------------------------------- |
| validation      | Recursively validate multipart documents                                | no-validation, simple-validation, recursive |
| informativeOnly | If the document is informative                                          | true, false                                 |
| echidnaReady    | Check that the document is valid for automatic publication with Echidna | true, false                                 |
| patentPolicy    | Patent Policy version                                                   | pp2020, pp2004                              |

e.g. https://www.w3.org/pubrules/api/validate?url=https://www.w3.org/TR/2021/WD-i18n-glossary-20210708/&profile=WD&validation=simple-validation

### Return values

Methods `metadata` and `validate` return a JSON object with these properties:

-   `success` (`boolean`): whether the operation succeeded, or not.
-   `errors` (`array`): all errors found.
-   `warnings` (`array`): all warnings.
-   `info` (`array`): additional, informative messages.
-   `metadata` (`object`): extracted metadata; [see structure here](#extractmetadataoptions).

If there is an internal error, the document cannot be retrieved or is not recognised, or validation fails, both methods would return HTTP status code `400`.
Also, in the case of `validate`, `success` would be `false` and `errors.length > 0`.

This is an example of a successful validation of a document, with profile `auto`:

```json
{
    "success": true,
    "errors": [],
    "warnings": [
        "headers.ol-toc",
        "links.linkchecker",
        "links.compound",
        "headers.dl"
    ],
    "info": [
        "structure.display-only",
        "structure.display-only",
        "structure.display-only",
        "validation.wcag"
    ],
    "metadata": {
        "profile": "WD",
        "title": "Character Model for the World Wide Web: String Matching and Searching",
        "docDate": "2016-4-7",
        "thisVersion": "https://www.w3.org/TR/2016/WD-charmod-norm-20160407/",
        "latestVersion": "https://www.w3.org/TR/charmod-norm/",
        "previousVersion": "https://www.w3.org/TR/2015/WD-charmod-norm-20151119/",
        "editorsDraft": "https://w3c.github.io/charmod-norm/",
        "delivererIDs": [32113],
        "editorIDs": [33573],
        "informative": false,
        "process": "https://www.w3.org/2015/Process-20150901/",
        "url": "https://www.w3.org/TR/2016/WD-charmod-norm-20160407/"
    }
}
```

When the profile is given by the user (instead of being set to `auto`), fewer items of metadata are returned.

`metadata` returns a similar structure, where all values are empty arrays, except for the key `metadata` which contains the metadata object.

## 6. Profiles

Profiles are simple objects that support the following API:

-   name: A `String` being the name of this profile.
-   rules: An `Array` of rule objects which are checked in this profile.

A profile is basically a configuration of what to check. You can load a specific profile from under
`lib/profiles` or create your own.

Here follows the current hierarchy of profiles. Each profile inherits all rules from its parent profile.
Profiles that are identical to its parent profile, ie that do not add any new rules, are marked too.

-   `base`
    -   `TR`
        -   `WD`
            -   `WD-Echidna`
        -   `FPWD` (identical)
        -   `PR`
        -   `CR`
            -   `CR-Echidna`
        -   `CRD`
            -   `CRD-Echidna`
        -   `REC`
        -   `REC-OBSOLETE`
        -   `REC-RSCND`
        -   `REC-SUPERSEDED`
        -   `DNOTE`
        -   `DNOTE-Echidna`
        -   `NOTE`
        -   `NOTE-Echidna`
        -   `STMT`
        -   `DRY`
        -   `CRY`
        -   `CRYD`
        -   `RY`
    -   `Submission`
        -   `SUBM`
        -   `MEM-SUBM`

## 7. Validation events

For a given checking run, the event sink you specify will be receiving a bunch of events as
indicated below. Events are shown as having parameters since those are passed to the event handler.

-   `start-all(profile-name)`: Fired first to indicate that the profile's checking has started.
-   `end-all(profile-name)`: Fired last to indicate that the profile's checking has completed. When
    you receive this you are promised that all testing operations, including asynchronous ones, have
    terminated.
-   `done(rule-name)`: Fired when a specific rule has finished processing, including its asynchronous
    tasks.
-   `ok(rule-name)`: Fired to indicate that a rule has succeeded. There is only one `ok` per rule.
    There cannot also be `err` events but there can be `warning` events.
-   `err(error-name, data)`: Fired when an error is detected. The `data` contains further details,
    that depend on the error but _should_ feature a `message` field. There can be multiple errors for
    a given rule. There cannot also be `ok` events but there can be `warning`s.
-   `warning(warnings-name, data)`: Fired for non-fatal problems with the document that may
    nevertheless require investigation. There may be several for a rule.
-   `info(info-name, data)`: Fired for additional information items detected by the validator.
-   `metadata(key, value)`: Fired for every piece of document metadata found by the validator.
-   `exception(message)`: Fired when there is a system error, such as a _File not found_ error. `message`
    contains details about this error. All exceptions are displayed on the error console in addition to
    this event being fired.

## 8. Writing rules

Rules are simple modules that just expose a `check(sr, cb)` method. They receive a Specberus object
and a callback, use the Specberus object to fire validation events and call the callback when
they're done.

The Specberus object exposes the following API that's useful for validation:

-   `loader`. The loader object that loaded the content, which exposes the content's `url` and
    `source` if they are known.
-   `sink`. The event target on which to fire validation events.
-   `version`. The Specberus version.
-   `checkSelector(selector, rule-name, cb)`. Some rules need to do nothing other than to check that a
    selector returns some content. For this case, the rule can just call this method with the selector
    and its callback, and Specberus will conveniently take care of all the rest.
-   `norm(text)`. Returns a whitespace-normalised version of the text.
-   `getDocumentDate()`. Returns a Date object that matches the document's date as specified in the
    headers' `stateElement` (id="w3c-state").
-   `getDocumentStateElement()`. Returns the element that contains the document's date.
