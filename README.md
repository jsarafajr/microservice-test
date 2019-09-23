# Connector For Google Drive

[![Greenkeeper badge](https://badges.greenkeeper.io/jsarafajr/microservice-test.svg)](https://greenkeeper.io/)

1. Run `npm install` from `main` and `worker` folders. 
2. Provide credentials in file main/src/index.js. Use getAuthUrl() and getCredentials from 'google-auth.ts' to get Google Auth Code and Auth Tokens. 
3. Run `docker-compose up` to build and run the project.  

You can scale up worker process with `docker-compose scale worker=N`.
