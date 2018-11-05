
# Local Listeners

Since SequelizeEventStream inherits node's *EventEmitter* class you can listen for every hooked event locally using **on(eventName,handler)** method, just as the example bellow:

```javascript
const eventStream  = new SequelizeEventStream(config);

eventStream.attach(sequelize);

eventStream.on("created",(resourceEvent) => {
   console.table(resourceEvent)
});
```
Once attached you just have to trigger an action: Creating a model for example and receive the payload on your local listener.

## Supported events

This is the list of local events:

event|sequelize Action|description
---|---|---
created|create|Fired once a model instance is created
updated|update| Fired once a model instance gets updated
destroyed|destroy| Fired once a model instance gets destroyed
bulk-created|bulkCreate| Fired once a bulk of models gets created
bulk-updated|bulkUpdate| Fired once a bulk of models gets updated
bulk-destroyed|bulkDestroy| Fired once a bulk of models gets destroyed