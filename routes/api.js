/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;


module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get((req, res) => {

    }).post((req, res) => {

    }).put((req, res) => {

    }).delete((req, res) => {

    });
    
  app.route('/api/replies/:board')
    .get((req, res) => {

    }).post((req, res) => {

    }).put((req, res) => {

    }).delete((req, res) => {

    });

};
