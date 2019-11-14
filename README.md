# Project Teamwork Backend

> Teamwork is an internal social network for employees of an organization. 
>The goal of this application is to facilitate more interaction between colleagues and promote team bonding

[![Build Status](https://travis-ci.com/Frost199/project_teamwork_backend.svg?branch=master)](https://travis-ci.com/Frost199/project_teamwork_backend)
[![Maintainability](https://api.codeclimate.com/v1/badges/9bf927dbed10efc5a5d5/maintainability)](https://codeclimate.com/github/Frost199/project_teamwork_backend/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9bf927dbed10efc5a5d5/test_coverage)](https://codeclimate.com/github/Frost199/project_teamwork_backend/test_coverage)
[![Coverage Status](https://coveralls.io/repos/github/Frost199/project_teamwork_backend/badge.svg?branch=master)](https://coveralls.io/github/Frost199/project_teamwork_backend?branch=master)

## Table of content
-   [Overview](#overview)
-   [:gear: Installation and running server](#gear-installation-and-running-server)
-   [:key: Database](#key-database)

## Overview

This project is an internal social network for employees so they can share their ideas, beliefs, share information
and also have fun while at work.

## :gear: Installation and running server

#### npm
    npm install
    nodemon server.js
    
##### test
###### Using env
The NODE_ENV=testing has to be added to the terminal while running the test to specify
that you will be using the test database
    
    NODE_ENV=testing npm test or jasmine

## :key: Database
##### Create user table
change directory to the models folder
    
    node user createTables

##### Drop user table
change directory to the models folder
    
    node user dropTables
##### Admin init
###### install make-runnable
    npm install --save-dev make-runnable
For an actual database, you might not need to specify the node environment

    node user createAdmin
Fill your parameterized values for the database
For a test database, you use the NODE_ENV=testing
    
    NODE_ENV=testing node user createAdmin
