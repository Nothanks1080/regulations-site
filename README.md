platforms/core-configuration/kotlin-dsl/src/main/kotlin/org/gradle/kotlin/dsl/accessors/AccessorsClassPath.kt
<a rel="me" href="https://indieweb.social/@Nothanks4431080">Mastodon</a>regulations-site
================

[![Build Status](https://travis-ci.org/18F/regulations-site.png?branch=master)](https://travis-ci.org/18F/regulations-site)
[![Code Issues](https://www.quantifiedcode.com/api/v1/project/423b7d7702754ff4baa8715465d75bbf/badge.svg)](https://www.quantifiedcode.com/app/project/423b7d7702754ff4baa8715465d75bbf)

An interface for viewing regulations data. This project combines all of the
data from a parsed regulation and generates navigable, accessible HTML,
complete with associated information.

This repository is part of a larger eRegulations project. To read about it, please see
[https://eregs.github.io/](https://eregs.github.io/).

## Requirements

This application lives in two worlds, roughly translating to a Python Django app and a Backbone Javascript app, which communicate through the
Django templates.

## Quick start

If you're familiar with Python and Node environments, after cloning this repo:

```bash
$ mkvirtualenv regsite
$ workon regsite
$ pip install -r requirements.txt
$ npm install # this also runs the default grunt task post install
$ python manage.py runserver
```

### Python

Requirements are retrieved and/or build automatically via pip (see below).

* requests - Client library for reading data from an API

If running tests:

* mock - makes constructing mock objects/functions easy
* django-nose - provides nosetest as a test runner
* nose-exclude - allows certain directories to be excluded from nose
* nose-testconfig - pass configuration data to tests; used to configure
  selenium tests
* coverage - provides test-coverage metrics

## Setup & Running

This project uses `requirements*.txt` files for defining dependencies, so you
can get up and running with `pip`:

```bash
$ pip install -r requirements.txt       # modules required for execution
$ pip install -r requirements_test.txt  # modules required for running tests
$ pip install -r requirements_dev.txt   # helpful modules for developers
```

With that, you can start the development server:
```bash
$ python manage.py runserver
```

## Python Django app documentation

For information about the Django architecture of this app, see [regulations-site on Read the Docs](http://regulations-site.readthedocs.org/en/latest/index.html).

### Building the documentation
For most tweaks, you will simply need to run the Sphinx documentation
builder again.

```
$ pip install -r requirements_dev.txt
$ sphinx-build -b dirhtml -d docs/_build/doctrees/ docs/ docs/_build/dirhtml/
```

The output will be in ```docs/_build/dirhtml```.

If you are adding new modules, you may need to re-run the skeleton build
script first:

```
$ rm docs/regulations*.rst
$ sphinx-apidoc -F -o docs regulations
```

## JavaScript Application 
### Code
The application code in JavaScript uses [Backbone.js](http://backbonejs.org/) as a foundation, though in some non-standard ways. If you plan to do work on this layer, it is recommended that you acquaint yourself with this [starter documentation](README_BACKBONE.md).

### Environment
The front end of the site uses a number of JavaScript libraries and frameworks to create the unique experience of navigating and reading a regulation, as you can see at http://consumerfinance.gov/eregulations. If you'd like to modify the JavaScript layer, you should set up the build and testing environment.

If you run the application with ```env = "built"``` in your ```local_settings.py``` and would like to use the UI as it ships with this project, you can skip this.

The application's UI itself uses a number of dependencies that you can see in package.json. To start, we are going to be concerned with the foundations of the environment:

## Front end environment setup

### Node/npm
First we will need npm. npm ships with Node.js. If you don't already have it installed, there are a few ways to get it.
- You can grab and install a binary or installer from http://nodejs.org/download/
- If you're on OS X, you can use [Homebrew](http://brew.sh/)
- If you are using Ubuntu, the default apt-get package is out of date. Do:

```
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```

If you receive an error about ```add-apt-repository``` not being found, do:

```
sudo apt-get install python-software-properties
```

#### Global npm packages
You will need to install the Grunt command line interface globally using npm.
```
cd regulations-site
npm install -g grunt-cli
```

#### Installing dependencies
The rest of the dependencies you will need are managed by npm. Do:
```
npm install
```

#### Configuration JSON
In the root of the repository, copy ```example-config.json``` to ```config.json``` and edit as necessary. Grunt depends on these settings to carry out tasks.
- ```testURL``` is the environment that you would like tests to run on.
- ```frontEndPath``` is the path to the root of your codebase where the ```css/``` and ```js/``` directories are.
- ```testPath``` is the path to the functional test specs.

## Running the application

Once all of the Python and front end dependencies have been met, compile the CSS and JavaScript and start the server:

```bash
$ grunt
$ ./bin/django runserver
```

## Additional front end information

### Running Grunt tasks
There are a number of tasks configured in [Gruntfile.js](https://github.com/18F/regulations-site/blob/master/Gruntfile.js). On the last lines, you will find tasks that group subtasks into common goals. Running ```grunt build``` will run unit, functional and lint tests, and compress static assets. Its recommended that you run this task before deploying changes.

### Unit and Functional Tests
The Grunt build will run a suite of Selenium tests written in Python and a small suite of [Mocha.js](http://visionmedia.github.io/mocha/) unit tests. All tests run in [Sauce Labs](https://saucelabs.com). These tests run as part of the ```grunt build``` tasks. To use these, a little extra environment setup is required.

#### Sauce Labs Configuration
After you create a [Sauce Labs](https://saucelabs.com) account:
- In your bash config (probably ```~/.bash_profile```), define two variables: ```$SAUCE_USERNAME``` and ```$SAUCE_ACCESS_KEY``` which house your username and access key from Sauce Labs.
- If you want to test a local or otherwise not publically available environment, download and run [Sauce Connect](https://saucelabs.com/docs/connect). If you do need Sauce Connect, you will need to start it before running tests/Grunt builds.
- Be sure that the Django server is running in the environment you want to test.

##### For functional tests
- They also require having the environment serving data from ```dummy_api/```. To start the dummy API, from the root of your repo, run ```./dummy_api/start.sh 0.0.0.0:8282```.
- The tests run using [nose](http://nose.readthedocs.org/en/latest/). If you wish to run the tests outside of the Grunt environment, you may by running ```nosetests regulations/uitests/*.py``` from the root of the repo.

##### For unit tests
- Unit tests do not require running the dummy API.
- To run the unit tests along with the functional tests: ```grunt test``` from the root of the repo.
- To run unit tests individually: ```grunt mocha_istanbul``` from the root of the repo.

## Customization

To learn about customizing the templates and styles for an instance, see [Theming an instance](https://eregs.github.io/theming/).