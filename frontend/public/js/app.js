(() => {
    const App = {
        htmlElements: {
            loginForm: document.getElementById('form-login'),
            loginDiv: document.querySelector('.login-container'),
            itemsDiv: document.querySelector('.items-container'),
            itemsList:document.querySelector('.items-list')
            
        },
        init: () => {
            App.bindEvents();
        },
        bindEvents: () => {
            App.htmlElements.loginForm.addEventListener('submit', App.events.onLogin);           
        },
        initializeData: {
            items: async () => {
                const { count, data } = await App.utils.fetch('http://localhost:4000/api/v1/items/',
                { 
                    method: 'GET'
                });
                data.forEach(item => {
                    App.utils.addItems(item);
                });
            }
        },
        events: {
            onLogin: async (event) => {
                event.preventDefault();
                const { email, password } = event.target.elements;
                const emailValue = email.value;
                const passwordValue = password.value;
                if(emailValue!=""){
                    const { auth, token} = await App.utils.fetch('http://localhost:4000/api/v1/users/login/',
                    { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "email": emailValue,
                            "password": passwordValue
                        }),
                        redirect: 'follow'
                    });
                    if(auth){
                        window.sessionStorage.setItem("token",token);
                        App.htmlElements.loginDiv.style.display = "none";
                        App.htmlElements.itemsDiv.style.display = "block";
                        App.initializeData.items();
                    }else{
                        alert("Error, Email o Contraseña equivocados")
                    }
                }
            },
        },
        utils: {
            fetch: async (url, options) => {
                const requestOptions = options;
                const response = await fetch(url, requestOptions);
                return response.json();
                 
            },
            addItems: ({_id, name, description,price}) => {
                App.htmlElements.itemsList.innerHTML += `<div id=${_id}><img src="/static/img/${_id}.jpg" alt="${name}" width="50" height="60"><label for="">${description}</label><label for="">Precio $${price}</label><button id='addCart'> Agregar al Carrito</button></div>`;
                /*if(completed){
                    App.htmlElements.mainTaskList.innerHTML += `<div value=${++App.count}></div>`;
                }else{
                    App.htmlElements.mainTaskList.innerHTML += `<div value=${++App.count}><label name='type' for="">${type}</label><br><button id='Check' style="background-color:grey;"></button><label for="" style="text-decoration:none;">${name}</label><button value='Update'>Editar</button><button value='Delete'>Eliminar</button></div>`;
                } */
            },
           /* redirection:(page) => {
                switch (page) {
                    case 'login':
                        window.location = "/"
                        break;
                    case 'items':
                        window.location = "/items"
                        break;
                    case 'cart':
                        window.location = "/cart"
                        break;
                }
            }*/
        }
    };
    App.init();
})();