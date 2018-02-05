const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', function(request, response) {
    response.type('text/html');
    response.status(200);
    response.sendFile(__dirname + '/index.html');
});

app.post('/', function(request, response) {
    const body = request.body;

    const fields = {
        '_fullname': {
            validate(value) { return typeof value === 'string' && value[1] },
            error() { return '_fullname required - must be string and contain at least 2 characters'}
        },
        '_email': {
            validate(value) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(value).toLowerCase());
            },
            error() { return 'email required - must be string and a valid email address'}
        },
        '_phone': {
            validate(value) { return typeof value === 'string' && value[6] },
            error() { return '_phone required - must be string and contain at least 7 characters'}
        },
        '_role': {
            'options': [ 'אחר', 'רוקח/ת', 'אח/ות', 'רופא/ה' ],
            validate(value) {
                for(let i = 0, option; option = this.options[i]; i++) {
                    if(option === value) {
                        return true;
                    }
                }
            },
            error() { return `_role required - must be string and be one of the options: ${ this.options.join(', ') }`}
        },
        '_expertise': {
            'min': 1,
            'max': 18,
            /** 1 - "אונקולוגיה"
            2 - "אורתופדיה"
            3 - "גניקולוגיה"
            4 - "גסטרואנטרולוגיה"
            5 - "גריאטריה"
            7 - "כאב"
            8 - "כירורגיה"
            9 - "משפחה"
            10 - "נוירולוגיה"
            11 - "עור ומין"
            12 - "פלסטיקאים"
            13 - "פנימית"
            14 - "ריאות"
            15 - "אחר"
            16 - "אלרגיה"
            17 - "הרדמה"
            18 - "שיקום" */
            validate(value) { return typeof value === 'number' && this.min <= value && this.max >= value },
            error() { return '_fullname required - must be string and contain at least 2 keys'}
        },
        '_work_place': {
            validate(value) { return value == undefined || typeof value === 'string' },
            error() { return '_work_place optional - must be string and contain at least 2 keys'}
        },
        'city': {
            validate(value) { return value == undefined || typeof value === 'string' },
            error() { return 'city optional - must be string and contain at least 2 keys'}
        },
        '_agree': {
            validate(value) { return value === 1 },
            error() { return '_agree required - must be 1 (int)'}
        }
    };

    let errors = [];
    let fieled;
    let requestResponse;
    for(let key in body) {
        field = fields[key];
        if(!field) { errors.push(`unknown key ${ key }`) }
    }
    for(let key in fields) {
        field = fields[key];
        if(field.validate(body[key])) {
        }
        else {
            errors.push(field.error());
        }
    }

    if(errors[0]) {
        requestResponse = { errors };
    }
    else {
        requestResponse = {
            'status': 'success',
            'body': body
        };
    }
    console.log('\x1b[36m%s\x1b[0m', 'Request => ', JSON.stringify(body, null, 2));
    console.log('\x1b[33m%s\x1b[0m', 'Response =>', JSON.stringify(requestResponse, null, 2));

    response.json(requestResponse);
});

app.listen(3000, console.log('Server is running...'));