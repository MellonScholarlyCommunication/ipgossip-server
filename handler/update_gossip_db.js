const logger = require('ldn-inbox-server').getLogger();
const fs = require('fs');

/**
 * Handler updates the gossip file
 */
async function handle({path,options,config,notification}) {
    try {
        const gossipFile = process.env.IPGOSSIP_FILE;

        let gossip;

        if (! gossipFile) {
            logger.error('no IPGOSSIP_FILE defined');
            return { path, options, success: false };
        }

        if (! notification.actor?.['id']) {
            logger.error('no actor.id in notification');
            return { path, options, success: false };
        }

        if (! notification.object?.['id']) {
            logger.error('no object.id in notification');
            return { path, options, success: false };
        }

        const ip = notification.object.id;

        if (ip.match(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/g)) {
            // all is ok
        }
        else {
            logger.error(`invalid IP ${ip} in notification`);
            return { path, options, success: false };
        }

        if (fs.existsSync(gossipFile)) {
            gossip = JSON.parse(fs.readFileSync(gossipFile,'utf-8'));
        }
        else {
            gossip = { ips: [] };
        }

        const seen = gossip.ips.findIndex( x => {
            return x.ip === ip;
        });
        if (seen >= 0) {
            logger.info(`${ip} already known`)
            return { path, options, success: true };
        }
        else {
            const timestamp = new Date().getTime();
            gossip.ips.push({
                ip: ip ,
                lastReported: notification.actor.id ,
                timestamp: timestamp
            });
        }

        fs.writeFileSync(gossipFile,JSON.stringify(gossip,null,2));
        fs.writeFileSync(gossipFile  + '.meta',JSON.stringify({
            "Content-Type": "application/ld+json"
        },null,2));

        return { path, options, success: true };
    }
    catch(e) {
        logger.error(`failed to process ${path}`);
        logger.error(e);
        return { path, options, success: false };
    }
}

module.exports = { handle };