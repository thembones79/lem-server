# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2021-02-19

### 🔥 Added

- added Redirection update feature (via PUT `/api/redirection/:id` route)
- added Redirection delete feature (via DELETE `/api/redirection/:id` route)

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
