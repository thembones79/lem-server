# REST API for LEM (Line Efficiency Monitoring) System

The app is meant to work with some kind of frontend. In this particular system, there is SPA (Single Page Application) in React created for this job (here).

LEM System is meant to be an internal tool, so there is no "sign up" feature. Users can not add themselves to the system, they can be added only by admin/manager.

### Install:

```
npm install
```

### Run:

```
npm run dev
```

The app listens on port 3090 if PORT is not provided in environmental variable.

#### Please note that the application has "config" directory.

The "config" directory should have three files:

- Keys.js (committed to the repository – consists of logic determining if the app is currently in production or development environment and uses one of described below config files accordingly)
- Prod.js (all secrets, api keys, MongoDB connection strings are taken here from environmental variables. In this particular case I&#39;m using Heroku environment)
- Dev.js (UNCOMMITTED! – you have to create it yourself and put there MongoDB connection string and secret string (long, random string is needed to properly generate JWTs). Please add this file to your ".gitignore" and never send or commit it anywhere!)
<p align="center">
  <img src="assets/uncommitted_on_backend.png" />
</p>

---

### Usage (note: this is a REST API and it is supposed to be used by some kind of frontend, SPA preferably, or a mobile app):

**Route (unprotected): `/signin`**

> Request: `POST`
>
> Request Body: `{email, password}`
>
> Response: `{token, userId, username, userType}`
>
> _**Feature:** allows existing user to "sign in" - gives user a valid JSON Web Token that can be used to make other protected API requests_

**Route (protected): `/api/line`**

> Request: `POST`
>
> Request Body: `{lineNumber}`
>
> Request Security Headers: `{authorization: validJsonWebTokenString}`
>
> Response: `{message: confirmationMessage}`
>
> _**Feature:** allows user to add new production line_

**Route (protected): `/api/lines`**

> Request: `GET`
>
> Request Security Headers: `{authorization: validJsonWebTokenString}`
>
> Response: `{lines}`
>
> _**Feature:** fetches all lines data_

**Route (protected): `/api/line/status`**

> Request: `PUT`
>
> Request Body: `{lineId, lineStatus}`
>
> Request Security Headers: `{authorization: validJsonWebTokenString}`
>
> Response: `{message: confirmationMessage}`
>
> _**Feature:** changes chosen line ("lineId") status to lineStatus sent in the request&#39;s body_

**Route (protected): `/api/user`**

Request: `POST`

Request Body: `{firstname, lastname, email, password, type}`

Request Security Headers: `{authorization: validJsonWebTokenString}`

Response: `{userType: user.type, userName: user.firstname, userId: user._id,}`

_**Feature:** create a new user with data provided in the request&#39;s body (important! New users can be added only by managers/admins – standard user would get 422 error with message: **"You do not have privileges to add new user!"** )_

---

**Route (protected): `/api/order`**

Request: `POST`

Request Body: `{orderNumber, quantity, partNumber, qrCode, customer, tactTime}`

Request Security Headers: `{authorization: validJsonWebTokenString}`

Response: `{order}`

_**Feature:** adds new order_

---

**Route (protected): `/api/order/close`**

Request: `PUT`

Request Body: `{orderNumber}`

Request Security Headers: `{authorization: validJsonWebTokenString}`

Response: `{message: confirmationMessage}`

_**Feature:** closes (existing and opened) order_

---

**Route (protected): `/api/orders`**

Request: `GET`

Request Security Headers: `{authorization: validJsonWebTokenString}`

Response: `{orders}`

_**Feature:** fetches all orders data_

---

**Route (protected): `/api/order/:dashedordernumber`**

Request: `GET`

Request Security Headers: `{authorization: validJsonWebTokenString}`

Response: `{existingOrder}`

_**Feature:** fetches chosen order full data_

**Route (protected): `/api/order/:dashedordernumber`**

Request: `DELETE`

Request Security Headers: `{authorization: validJsonWebTokenString}`

Response: `{message: confirmationMessage}`

_**Feature:** deletes chosen order_

---

**Route (protected): `/api/scan`**

Request: `POST`

Request Body: `{scanContent, errorCode, _line, _user}`

Request Security Headers: `{authorization: validJsonWebTokenString}`

Response: `{existingOrder}`

_**Feature:** adds new scan to the chosen order and chosen line_

**Route (protected): `/api/menu`**

> Request: `POST`
>
> Request Body: `{menuContent, timeStamp}`
>
> Request Security Headers: `{authorization: validJsonWebTokenString}`
>
> Response: `{existingMenu}`
>
> _**Feature:** overwrites existing order menu with new one (with new time stamp as synchronization indicator and sanity check. Order menu consists orders that have to be processed by manufacture department, and the application. This route is meant to be hit not by regular frontend, but by another node service that takes company&#39;s internal data – excel spreadsheet – processes it and sends to the API in 10 minute intervals)._

**Route (protected): `/api/menu`**

> Request: `GET`
>
> Request Security Headers: `{authorization: validJsonWebTokenString}`
>
> Response: `{timestamp, menuContent}`
>
> _**Feature:** fetches updated order menu content with a last update time stamp_

**Route (protected): `/api/break/start`**

> Request: `POST`
>
> Request Body: `{orderNumber, _line}`
>
> Request Security Headers: `{authorization: validJsonWebTokenString}`
>
> Response: `{existingOrder}`
>
> _**Feature:** creates a new break in chosen order on chosen line (and adds time stamp to the breakStart property)_

**Route (protected): `/api/break/end`**

> Request: `POST`
>
> Request Body: `{orderNumber, _line}`
>
> Request Security Headers: `{authorization: validJsonWebTokenString}`
>
> Response: `{existingOrder}`
>
> _**Feature:** adds a breakEnd time stamp_ _to the last break without a breakEnd_ _in chosen order on chosen line (and adds time stamp to the breakStart property)_

---

### The application also checks correctness of barcode reader scans.

The app divides the code from the scan into 2 parts:

1. the main code (I have called it "qrCode", which takes it from your Excel and assumes that it is correct and that it can change, because, for example, a manager came up with a different pattern to generate and I will not predict it)
2. and attached to it a (five-digit) number from 00001 to the given quantity

When it comes to validation, the app checks:

1. is the part before the number the same as the code taken from your excel (if not, it gives the code `e003 - "wrong code"`)
2. whether the number is in the given range (if not, it gives an error `e002 - "out of range"` )
3. if the number was not repeated (if it repeated, it gives error `e001 - "repeated scan"`)
4. if there is no error from the above it returns `e000 - "OK"` and counts this scan

Thanks to this, manager can change the pattern in Excel that generates the basis of the sticker code and theoretically nothing should go wrong

Error codes will be used in the future for statistical purposes.

Besides time efficiency, there are going to be statistics about errors on particular line, particular user, particular order, particular part number and all permutation of the above.

So it would be easier to estimate, for example, which partnumber is "harder" to make, or who needs some more training, or which line has mixed up components, or which line needs extra help from quality department or from other line to deliver on time, etc.
