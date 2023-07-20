const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const { stringify } = require('querystring');
const path = require('path');
app.use(bodyParser.json());
app.use(express.json());


function authentication(req, res, next) {
    var age = req.query.age;
    if (age > 18) {
        next()
    }
    else {
        res.send("below 18")
    }
}

let userinfo = [];
app.get('/data', authentication, (req, res) => {
    res.send(userinfo)
}
)
app.get('/api/get', (req, res) => {
    fs.readFile("todos.json", "utf8", (err, data) => {
        if (err) throw err;
        else
            // res.send(data); //send plain text response
            // res.json(data); //send text as string 
            res.json(JSON.parse(data));//string to object
        // JSON.stringify(data); //object to string
    })
})
app.get('/add', (req, res) => {
    const filePath = path.join(__dirname, 'add.html');
    res.sendFile(filePath);
});
app.post('/api/post', (req, res) => {
    const newtodos = {
        title: req.body.title,
        description: req.body.description,
    }
    fs.readFile("todos.json", "utf8", (err, data) => {
        if (err) throw err;
        const todos = JSON.parse(data);
        todos.push(newtodos);
        // console.log(todos);
        // res.send(todos);

        fs.writeFile("todos.json", JSON.stringify(todos), (err, data) => {
            if (err) throw err;
            res.status(200).json(todos);
        });

    });

}
)
function findIndex(query, arr, findby) {
    var index = (-1);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][findby] == query) {
            index = i;
            break;
        }
    }
    return index;
}
app.put('/update', (req, res) => {
    const fname = req.query.fname;
    fs.readFile("todos.json", "utf8", (err, data) => {
        if (err) throw err;
        const todos = JSON.parse(data);
        var index = findIndex(fname, todos);
        if (index >= 0) {
            todos[index].lname = req.body.lname;

            fs.writeFile("todos.json", JSON.stringify(todos), (err, data) => {
                if (err) throw err;
            })
        }

    })
    res.status(200).send();
});
app.delete('/api/delete', (req, res) => {
    const title = req.query.title;
    fs.readFile("todos.json", "utf8", (err, data) => {
        if (err) throw err;
        const todos = JSON.parse(data);
        var findby = "title";
        var index = findIndex(title, todos, findby);
        if (index >= 0) {
            const newtodos = [];
            for (var i = 0; i < todos.length; i++) {
                if (todos[i].title != title && todos[i] !== null) {
                    newtodos.push(todos[i]);
                }
            }

            fs.writeFile("todos.json", JSON.stringify(newtodos), (err, data) => {
                if (err) throw err;

            })
        }

    })
    res.status(200).send();
});
app.post('/home', (req, res) => {
    app.use(bodyParser.json());
    const userinfos = {
        fname: req.body.fname,
        lname: req.body.lname
    };
    userinfo.push(userinfos);

    res.send(console.log(userinfo));
}
)
app.listen(3000)
