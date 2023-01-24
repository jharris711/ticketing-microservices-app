[Common middlewares NPM package](https://www.npmjs.com/package/@jheezytix/common)

# Services

- **AUTH**: Everything related to user signup/signin/signout
- **TICKETS**: Ticket creation/editing. Knows whether a ticket can be updated.
- **ORDERS**: Order creation/editing
- **EXPIRATION**: Watches for orders to be created, cancels them after 15 minutes.
- **PAYMENTS**: Handles credit c ard payments. Cancels orders if payment fails, completes if payments succeeds

# Events

- `UserCreated`
- `UserUpdated`
- `OrderCreated`
- `OrderCanceled`
- `OrderExpired`
- `TicketCreated`
- `TicketUpdated`
- `ChargeCreated`

# Tech:

- NextJS
- MongoDB
- Redis
