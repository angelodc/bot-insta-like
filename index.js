const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('./utils/cors.js');
const Instagram = require('instagram-web-api')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('./public'));

app.use(cors);
app.listen(3000, () => {
    console.log('iniciado server')
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const shortcode = req.body.shortcode;
    const client = new Instagram({ username, password })
    client.login().then((profile) => {
        client.getFollowings({userId: profile.userId}).then(users => {
            console.log('usuarios: ', users.data.length);
                client.getMediaByShortcode({shortcode}).then(media => {
                    //console.log(media);
                    let usuarios = users.data;
                    const promises = usuarios.map(user => {
                        console.log('usuario: ', user.username);
                        return client.addComment({mediaId: media.id, text: `@${user.username}`})
                        .then(result => {
                            console.log('resultado comentario: ', result);
                            return true;
                        })
                    })
                    
                    return Promise.all(promises)
                    .then(result => {
                        console.log('FINALIZADO');
                        return res.status(200).redirect('/');
                    })
                    .catch(err => {
                        console.log('erro promise: ', err);
                        return res.status(500).redirect('/');
                    })
    
                }).catch(err => {
                    console.log('erro get media by shortcode: ');
                    return res.status(500);
                })
        }).catch(err => {
            console.log('erro get followings: ', err);
            return res.status(500).redirect('/');
        })
    }).catch(err => {
        console.log('erro login: ', err);
        return res.status(500).redirect('/');
    })
    
})



