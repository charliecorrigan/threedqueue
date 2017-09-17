# 3DQueue:
  # _A 3D printer queue management tool for public makerspaces_

**********************************************************************
## Description
**********************************************************************

3DQueue is a free and open source app to help public makerspaces manage their 3D print queues, from project submissions and customer notifications to project approvals and statistics. This app is still a work in progress, but is expected to be completed by January 2018

### Dropbox File Storage

Create an account for your organization and link it to a Dropbox account to store project submission .stl files. Only .stl files can be uploaded through the project submission form. Files are automatically deleted upon either project rejection or 30 days after project completion to keep your Dropbox account tidy.

### Multitenancy Authorization

Once you create a makerspace admin account, you can assign additional public-facing accounts with limited permissions. These frontline accounts can be used to submit projects but not to access other projects or manage the queue.

### Simple Customer Interface

The project submission form is quick easy to fill out. The app will email customers a custom form letter to let them know when their project is available to be picked up or if their project failed to print successfully.

### Queue Management Tools

Project submission form includes required fields so that incomplete project details are not submitted. Admin can check project details at a glance before approving prints to enter the queue. Once a project is approved, it will automatically enter the queue. In order to allow for equitable printer use, customers can only have a single print in the queue at a time. Additional approved projects will enter into the queue as each of the customer's previous projects is marked as completed.

### Statistics at a Glance

See a variety of printer use statistics and graphs for valuable grant reporting data.

**********************************************************************
## Getting Started
**********************************************************************

To use the creator's production app for your makerspace, visit [3DQueue on Heroku](https://threedqueue.herokuapp.com/).

To launch your own version on a different server, keep reading...

### Technical Details
This project was completed using the following:
* Javascript ES6
* Node 8.2.1
* Postgresql 7.3.0
* Knex 0.13.0
* Express 4.15.4
* Dropbox Oauth2 2.5.7
* Ejs 0.8.8
* _see `package-lock.json` for a complete list of dependencies

### Initial Setup

Follow these steps to setup 3DQueue on your local server:

1. Clone this repository onto your own machine:

  ```shell
  git clone https://github.com/charliecorrigan/threedqueue
  ```

2. Change into the `threedqueue` directory
  ```shell
  cd threedqueue
  ```

3. Run npm install to install requisite libraries: 

  ```shell
  npm install
  ```

4. Complete database creation and setup:

  ```shell
  psql
  CREATE DATABASE threedqueue
  \q
  knex migrate:latest
  ```

5. Set up Dropbox Oauth.
    - Visit [Dropbox](https://www.dropbox.com/developers/apps/create) to register your app
    - Create a file in `/config` called `auth.js` and create a file in `/` called `.gitignore`
    - In `auth.js` paste:
    ```
    module.exports = {
      'dropboxAuth' : {
        'clientID'      : REPLACE-THIS-TEXT-WITH-YOUR-APP-ID-PROVIDED-BY-DROPBOX
        'clientSecret'  : REPLACE-THIS-TEXT-WITH-YOUR-APP-SECRET-PROVIDED-BY-DROPBOX
        'callbackURL'   : 'http://localhost:8080/auth/dropbox/callback'
      },
      'dashboardUrl': 'http://localhost:8080/dashboard'
    }
    ```
  - In `.gitignore` paste:
    `/config/auth.js`
  - This will allow your app to access your users' Dropbox accounts once they grant permission. Adding this file to your gitignore file will prevent your keys and app secret from being saved publicly on github.

Spin up a local server and visit your project in your browser

  ```shell
  nodemon server.js
  ```


