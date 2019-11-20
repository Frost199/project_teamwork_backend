# Project Teamwork Backend

> Teamwork is an internal social network for employees of an organization. 
>The goal of this application is to facilitate more interaction between colleagues and promote team bonding

[![Build Status](https://travis-ci.com/Frost199/project_teamwork_backend.svg?branch=master)](https://travis-ci.com/Frost199/project_teamwork_backend)
[![Maintainability](https://api.codeclimate.com/v1/badges/9bf927dbed10efc5a5d5/maintainability)](https://codeclimate.com/github/Frost199/project_teamwork_backend/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9bf927dbed10efc5a5d5/test_coverage)](https://codeclimate.com/github/Frost199/project_teamwork_backend/test_coverage)
[![Coverage Status](https://coveralls.io/repos/github/Frost199/project_teamwork_backend/badge.svg?branch=master)](https://coveralls.io/github/Frost199/project_teamwork_backend?branch=master)

## Table of content
-   [:notebook_with_decorative_cover: Overview](#notebook_with_decorative_cover-overview)
-   [:gear: Installation and running server](#gear-installation-and-running-server)
-   [:key: Database](#key-database)
-   [:nerd_face: Author](#nerd_face-author)

## :notebook_with_decorative_cover: Overview

This project is an internal social network for employees so they can share their ideas, beliefs, share information
and also have fun while at work.

## :gear: Installation and running server

#### npm
    npm install
    nodemon server.js
    
#### Installation
* run   ```git clone https://github.com/Frost199/project_teamwork_backend.git``` 
* create ```.env``` inside the ```project_teamwork_backend``` folder which is the base folder, then add the contents
below
        
   ```TEAMWORK_DATABASE_URL=postgres://iopnxytv:gYVfD_df_4vqLi87UTx6u8JPKz8jkhdF@salt.db.elephantsql.com:5432/iopnxytv
      TEAMWORK_DATABASE_URL_TEST=postgres://wubncfbz:8t0VtXbVQQmAIfnmax182SETdN6RgLmp@salt.db.elephantsql.com:5432/wubncfbz
      CLOUDINARY_URL=cloudinary://983466679252696:aFzGcpTIsBBgm23XbcL74w5EOGY@manny/
      TEAMWORK_DATABASE_USER=iopnxytv
      TEAMWORK_DATABASE_HOST=salt.db.elephantsql.com
      TEAMWORK_DATABASE=iopnxytv
      TEAMWORK_DATABASE_PASSWORD=gYVfD_df_4vqLi87UTx6u8JPKz8jkhdF
      TEAMWORK_DATABASE_USER_TEST=wubncfbz
      TEAMWORK_DATABASE_HOST_TEST=salt.db.elephantsql.com
      TEAMWORK_DATABASE_TEST=wubncfbz
      TEAMWORK_DATABASE_PASSWORD_TEST=8t0VtXbVQQmAIfnmax182SETdN6RgLmp
      JWT_TOKEN_SECRET=asknfjnuvjdvjdnsjnaoniwenqndnoanncoo2346368381yva2f5c815c03053b089ace56bc6b4e57704d23ebff7e0a+a837995fc8f531be1835f76cc1087c922a4c9d197b4d4cafc6c
  ```
    
##### test
###### Using env
The NODE_ENV=testing has to be added to the terminal while running the test to specify
that you will be using the test database
    
    NODE_ENV=testing npm test or jasmine

## :key: Database
##### Create user table
change directory to the models folder
    
    node user createTable
##### Drop user table
change directory to the models folder
    
    node user dropTable
    

##### Create article table
change directory to the models folder
    
    node article createTable
##### Drop article table
change directory to the models folder
    
    node article dropTable

##### Create gif table
change directory to the models folder
    
    node gifs createTable
##### Drop gif table
change directory to the models folder
    
    node gifs dropTable

##### Create article's comment table
change directory to the models folder
    
    node article_comment createTable
##### Drop article's comment table
change directory to the models folder
    
    node article_comment dropTable
    
    
##### Create gif's comment table
change directory to the models folder
    
    node gif_comment createTable
##### Drop gifs's comment table
change directory to the models folder
    
    node gif_comment dropTable

##### Admin init
###### install make-runnable
    npm install --save-dev make-runnable
For an actual database, you might not need to specify the node environment

    node user createAdmin
Fill your parameterized values for the database
For a test database, you use the NODE_ENV=testing
    
    NODE_ENV=testing node user createAdmin

## :nerd_face: Author
I'm Emmanuel from Enugu in Nigeria, this javascript project has been awesome.

###### Documentation
      The documentation can be found [here](https://documenter.getpostman.com/view/7381258/SW7aX7mg)
