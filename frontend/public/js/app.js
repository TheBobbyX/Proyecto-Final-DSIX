(() => {
    const App = {
        total:0,
        htmlElements: {
            loginForm: document.getElementById('form-login'),
            cartTotal: document.getElementById('Total'),
            loginDiv: document.querySelector('.login-container'),
            itemsDiv: document.querySelector('.items-container'),
            cartDiv: document.querySelector('.cart-container'),
            itemsList:document.querySelector('.items-list'),
            cartList:document.querySelector('.cart-list'),
        },
        init: () => {
            App.bindEvents();
        },
        bindEvents: () => {
            App.htmlElements.loginForm.addEventListener('submit', App.events.onLogin);
            App.htmlElements.itemsList.addEventListener('click', App.events.addToCart);  
            App.htmlElements.itemsDiv.addEventListener('click', App.events.showCart);         
        },
        initializeData: {
            items: async () => {
                const { count, data } = await App.utils.fetch('http://localhost:4000/api/v1/items/',
                { 
                    method: 'GET'
                });
                data.forEach(item => {
                    App.utils.loadItems(item);
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
                        App.initializeData.items();
                        App.htmlElements.itemsDiv.style.display = "block";
                    }else{
                        alert("Error, Email o Contraseña equivocados")
                    }
                }
            },
            addToCart: async (event) =>{
                event.preventDefault();
                if(event.target.id == "addCart"){
                    const id = event.target.parentNode.id;
                    console.log(id);
                    await App.utils.fetch('http://localhost:4000/api/v1/cart/items/add/',
                    { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "id": id
                        }),
                        redirect: 'follow'
                    });
                    alert("Item añadido al Carrito")
                }
            },
            showCart: async (event) =>{
                event.preventDefault();
                if(event.target.id == "goToCart"){
                    App.htmlElements.itemsDiv.style.display = "none";
                    const { count, data } = await App.utils.fetch('http://localhost:4000/api/v1/cart/items/',
                    { 
                        method: 'GET'
                    });
                    //App.total=0;
                    data.forEach(item => {
                        App.utils.loadItemsCart(item);
                    });
                    App.htmlElements.cartDiv.style.display = "block";                    
                }
            }
        },
        utils: {
            fetch: async (url, options) => {
                const requestOptions = options;
                const response = await fetch(url, requestOptions);
                return response.json();
                 
            },
            loadItems: ({_id, name, description, price, id_image}) => {
                App.htmlElements.itemsList.innerHTML += `<div id=${_id}><label for="">${name}</label><br><img src="/static/img/${id_image}.jpg" alt="${name}"><br><label for="">${description}</label><br><label for="">Precio $${price}</label><button id='addCart'> Agregar al Carrito</button></div>`;
            },
            loadItemsCart: async ({item}) => {
                const { data } = await App.utils.fetch('http://localhost:4000/api/v1/item/'+item,
                { 
                    method: 'GET'
                });
                App.htmlElements.cartTotal.innerHTML = Number(App.htmlElements.cartTotal.innerHTML)+data.price;
                App.htmlElements.cartList.innerHTML += `<div id=${data._id}><label for="">${data.name}</label>&nbsp;&nbsp;<label name=total for="">Precio $${data.price}</label></div>`;
                
            },
            
        }
    };
    App.init();
})();