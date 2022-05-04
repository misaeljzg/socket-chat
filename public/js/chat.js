const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-node-mjzg.herokuapp.com/api/auth/'

let user = null;
let socket = null;

//HTML References
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogout = document.querySelector('#btnLogout');

//Validate the token from the localStorage
const validateJWT  = async() => {
    const token = localStorage.getItem('token') || '';
    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No token in server');
    }

    const resp = await fetch(url, {
        headers: {'x-token' : token}
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = user.name;
    await connectSocket();
    
}

const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('receive-messages', showMessageHistory);

    socket.on('active-users', showUsers);

    socket.on('private-message', (payload) => {
        console.log('Private: ', payload)
    });

    



}

const showUsers = (users =[]) => {
    let usersHtml = '';
    users.forEach(({name, uid}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });

    ulUsers.innerHTML = usersHtml;
}

const showMessageHistory = (messages =[]) => {
    let messagesHtml = '';
    messages.forEach(({name, message}) => {
        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${name}:</span>
                    <span>${message}</span>
                </p>
            </li>
        `
    });

    ulMessages.innerHTML = messagesHtml;
}

txtMessage.addEventListener('keyup', ({keyCode}) => {
    const message = txtMessage.value;
    const uid = txtUid.value;
    if (keyCode !== 13) {return;}
    if(message.length === 0) {return;}

    socket.emit('send-message', {message, uid});

    txtMessage.value = '';
})

const main = async() => {

    await validateJWT();
}

main();