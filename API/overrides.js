function addPagination(docs) {
    docs.body.push(
        {
            "name": "pagination",
            "type": "object",
            "description": "Contains the information used to page through the list of results. The object is empty if there are no more pages left to page through. [Read More](https://dev.twitch.tv/docs/api/guide#pagination)"
        },
        {
            "name": "   cursor",
            "type": "string",
            "description": "The cursor used to get the next page of results. Use the cursor to set the request’s after query parameter."
        }
    );
}
module.exports = [
    "Update Chat Settings",(docs) => {
        docs.reqBody.forEach(element => {
            element.required = false;
        });
    },
    "Update AutoMod Settings",(docs) => {
        docs.reqBody.forEach(element => {
            element.required = false;
        });
    },

    "Get Custom Reward Redemption",(docs) => {
        addPagination(docs);
    },
    "Get Channel Stream Schedule",(docs) => {
        addPagination(docs);
    },
    "Search Categories",(docs) => {
        addPagination(docs);
    },
    "Search Channels",(docs) => {
        addPagination(docs);
    },
    "Get User Block List",(docs) => {
        addPagination(docs);
    },

    "Get Extension Transactions",(docs) => {
        const a = docs.body.find(v => v.name.endsWith('broadcast'));
        a.name = a.name.substring(1);
    },
    "Update Custom Reward",(docs) => {
        const a = docs.body.find(v => v.name.endsWith('global_cooldown_seconds'));
        a.name = a.name.substring(2);
    },
    "Get Guest Star Session",(docs) => {
        const a = docs.body.find(v => v.name.endsWith('id'));
        a.name = a.name.substring(1);
        const b = docs.body.find(v => v.name.endsWith('guests'));
        b.name = b.name.substring(1);
    },
    "Create Guest Star Session",(docs) => {
        const a = docs.body.find(v => v.name.endsWith('id'));
        a.name = a.name.substring(1);
        const b = docs.body.find(v => v.name.endsWith('guests'));
        b.name = b.name.substring(1);
    },
    "End Guest Star Session",(docs) => {
        const a = docs.body.find(v => v.name.endsWith('id'));
        a.name = a.name.substring(1);
        const b = docs.body.find(v => v.name.endsWith('guests'));
        b.name = b.name.substring(1);
    },
    "Remove Suspicious Status From Chat User",(docs) => {
        const a = docs.body.find(v => v.name.endsWith('types'));
        a.type = "string[]"
    },
    "Get Unban Requests",(docs) => {
        const a = docs.body.find(v => v.name.endsWith('broadcaster_name'));
        a.name = a.name.substring(4);
    },
    "Get Cheermotes",(docs) => {
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
    },

    "Get Custom Reward",(docs) => {
        const a = docs.params.find(v => v.name == 'id');
        a.type = 'string[]';
    },
    "Get Custom Reward Redemption",(docs) => {
        const a = docs.params.find(v => v.name == 'id');
        a.type = 'string[]';
    }
]