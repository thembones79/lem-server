# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.11.4] - 2021-03-02

### 👾 Fixed

- updated Product model via hook to populate() with linksToRedirs after save()

## [1.11.3] - 2021-03-02

### 👾 Fixed

- added linksToRedirs populate in changeProduct function

## [1.11.2] - 2021-03-01

### 👾 Fixed

- added linksToRedirs populate in addLink function

## [1.11.1] - 2021-02-26

### 👾 Fixed

- removed if-else statement that was causing bug in redirection delete (for redirections that are not attached to any product)

## [1.11.0] - 2021-02-20

### 🔥 Added

- added updating many products nested arrays (via PUT `/api/product/redirection/:_id` route) with one redirection (in one request without a loop)

- added fetching redirection details with attached products (via GET `/api/redirwithprods/:_id` route)

### 💪 Changed

- updated delete redirection code to wipe out deleted redirection from arrays in products that have this redirection

## [1.10.0] - 2021-02-20

### 🔥 Added

- added getting Product details (links to docs and redirs) from watched Line's current Order (via GET `/api/line/:_id` route)

## [1.9.0] - 2021-02-20

### 🔥 Added

- added Redirections list feature (via GET `/api/redirection/` route)
- added Products list feature (via GET `/api/product/` route)
- added get Product details feature (via GET `/api/product/:_id` route)
- added Product delete feature (via DELETE `/api/product/:_id` route)

## [1.8.0] - 2021-02-19

### 🔥 Added

- added Redirection update feature (via PUT `/api/redirection/:_id` route)
- added Redirection delete feature (via DELETE `/api/redirection/:_id` route)

### 💪 Changed

- updated data model in links and redirections to acommodate fileName
- refactored url string to separate file

## [1.7.0] - 2021-02-18

### 🔥 Added

- added Redirections to Product (via POST `/api/product/redirection` route) feature
- added Links do Documentation to Product (via POST `/api/product/link` route) feature
- changed Product data (via PUT `/api/product` route) - allows: adding, removing, changing links and redirections within a Product (and thanks to db populate allows cascading/clean removing related redirection from separate collection)

## [1.6.0] - 2021-02-17

### 🔥 Added

- added New Product (via POST `/api/product` route) feature

## [1.6.0] - 2021-02-16

### 🔥 Added

- Product and Redirection data models
- Redirection functionality

## [1.5.2] - 2020-10-26

### 👾 Fixed

- order not started yet error (server crash)

## [1.5.1] - 2020-10-21

### 👾 Fixed

- CORS with websockets error

## [1.5.0] - 2020-10-21

### 🔥 Added

- websocket server-side handling and securing (for `live view` - not implemeted yet)

## [1.4.0] - 2020-10-16

### 🔥 Added

- added **GET** `/api/aggregatedorders` route

## [1.3.0] - 2020-10-02

### 💪 Changed

- updated scan code validation logic to include warnings

## [1.2.0] - 2020-09-22

### 💪 Changed

- updated README.md

## [1.1.0] - 2020-09-17

### 🔥 Added

- README.md
- CHANGELOG.md

### 💪 Changed

- updated scan error validation to omitt date in the part of the scan string
- updated package.json

## [1.0.0] - 2020-09-04

### 🔥 Added

- initial release
