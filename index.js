const express = require('express');
const app = express();

const getRandomTime = () => {
    return (Math.floor(Math.random() * (8000 - 4000)) + 4000);
}



app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const shortcode = req.body.shortcode;
    const client = new Instagram({ username, password })
    client.login().then((profile) => {
        client.getFollowings({userId: profile.userId}).then(users => {
                client.getMediaByShortcode({shortcode}).then(media => {
                    //console.log(media);
                    let usuarios = users.data;
                    const promises = usuarios.map(user => {
                        console.log('usuario: ', user.username);
                        setTimeout(() => {
                            return client.addComment({mediaId: media.id, text: `@${user.username}`})
                            .then(result => {
                                console.log('resultado comentario: ', result);
                                return true;
                            })
                            .catch(err => {
                                console.log('erro comentario: ', err);
                                return false;
                            })
                        }, getRandomTime())
                    })
                    
                    return Promise.all(promises)
                    .then(result => {
                        console.log('FINALIZADO', result);
                        return res.status(200).redirect('/bot_instagram');
                    })
                    .catch(err => {
                        console.log('erro promise: ', err);
                        return res.status(500).redirect('/bot_instagram');
                    })
    
                }).catch(err => {
                    console.log('erro get media by shortcode: ');
                    return res.status(500).redirect('/bot_instagram');
                })
        }).catch(err => {
            console.log('erro get followings: ', err);
            return res.status(500).redirect('/bot_instagram');
        })
    }).catch(err => {
        console.log('erro login: ', err);
        return res.status(500).redirect('/bot_instagram');
    })
    
})



