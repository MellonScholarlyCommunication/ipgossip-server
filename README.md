# IP Gossip Server

A demonstrator [LDN](https://www.w3.org/TR/ldn/) service using the [Event Notifications](https://www.eventnotifications.net) protocol to share information about bad robot IP-addresses.

## Install

```
npm install
```

## Demo

Start web server:

```
npm run server
```

Post a demo notification:

```
npm run demo-post
```

Process the notifications in `inbox`:

```
npm run handle-inbox
```

Check the results: http://localhost:8000/gossip.jsonld

## Gossip file

```
{
  "ips": [
    {
      "ip": "157.193.101.1",
      "lastReported": "https://acme.org/profile/card#us",
      "timestamp": 1751095002886
    },
    {
      "ip": "157.193.101.2",
      "lastReported": "https://acme.org/profile/card#us",
      "timestamp": 1751095351769
    }
  ]
}
```

## Notification Example

```
{ 
    "@context": "https://www.w3.org/ns/activitystreams" , 
    "id": "urn:uuid:6E5FAF88-A7F1-47A4-B087-77345EBFF495",
    "type": "Announce",
    "actor": {
        "id": "https://acme.org/profile/card#us",
        "inbox": "https://acme.org/inbox/",
        "type": "Organization"
    },
    "object": {
        "id": "157.193.101.1"
    }
}
```