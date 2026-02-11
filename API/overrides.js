module.exports = {
    "Update Chat Settings"(docs) {
        docs.reqBody.forEach(element => {
            element.required = false;
        });
    },

    "Get Extension Transactions"(docs) {
        const a = docs.body.find(v => v.name.endsWith('broadcast'));
        a.name = a.name.substring(1);
    },
    "Update Custom Reward"(docs) {
        const a = docs.body.find(v => v.name.endsWith('global_cooldown_seconds'));
        a.name = a.name.substring(2);
    },
    "Get Guest Star Session"(docs) {
        const a = docs.body.find(v => v.name.endsWith('id'));
        a.name = a.name.substring(1);
        const b = docs.body.find(v => v.name.endsWith('guests'));
        b.name = b.name.substring(1);
    },
    "Create Guest Star Session"(docs) {
        const a = docs.body.find(v => v.name.endsWith('id'));
        a.name = a.name.substring(1);
        const b = docs.body.find(v => v.name.endsWith('guests'));
        b.name = b.name.substring(1);
    },
    "End Guest Star Session"(docs) {
        const a = docs.body.find(v => v.name.endsWith('id'));
        a.name = a.name.substring(1);
        const b = docs.body.find(v => v.name.endsWith('guests'));
        b.name = b.name.substring(1);
    },
    "Remove Suspicious Status From Chat User"(docs) {
        const a = docs.body.find(v => v.name.endsWith('types'));
        a.type = "string[]"
    },
    "Get Unban Requests"(docs) {
        const a = docs.body.find(v => v.name.endsWith('broadcaster_name'));
        a.name = a.name.substring(4);
    },
    "Get Cheermotes"(docs) {
        const i = docs.body.findIndex(v => v.name.endsWith('images'));
        docs.body.splice(i + 1, 0, {
            name: '         dark',
            type: 'object',
            description: 'The dark theme variants of the cheermote'
        },{
            name: '            animated',
            type: 'map[string,string]',
            description: 'Each format of sizes: 1, 1.5, 2, 3, and 4. The value of each size contains the URL to the image.'
        },{
            name: '            static',
            type: 'map[string,string]',
            description: 'Each format of sizes: 1, 1.5, 2, 3, and 4. The value of each size contains the URL to the image.'
        },{
            name: '         light',
            type: 'object',
            description: 'The light theme variants of the cheermote'
        },{
            name: '            animated',
            type: 'map[string,string]',
            description: 'Each format of sizes: 1, 1.5, 2, 3, and 4. The value of each size contains the URL to the image.'
        },{
            name: '            static',
            type: 'map[string,string]',
            description: 'Each format of sizes: 1, 1.5, 2, 3, and 4. The value of each size contains the URL to the image.'
        })
    }
}