(() => {
  const App = {
    total: 0,
    htmlElements: {
      loginForm: document.getElementById("form-login"),
      cartTotal: document.getElementById("cartTotal"),
      logoutButton: document.getElementById("logout"),
      backButton: document.getElementById("back"),
      goToPaypal: document.getElementById("goToPaypal"),
      loginDiv: document.querySelector(".login-container"),
      itemsDiv: document.querySelector(".items-container"),
      cartDiv: document.querySelector(".cart-container"),
      itemsList: document.querySelector(".items-list"),
      cartList: document.querySelector(".cart-list"),
    },
    init: () => {
      App.bindEvents();
    },
    bindEvents: () => {
      App.htmlElements.loginForm.addEventListener("submit", App.events.onLogin);
      App.htmlElements.itemsList.addEventListener(
        "click",
        App.events.addToCart
      );
      App.htmlElements.logoutButton.addEventListener(
        "click",
        App.events.logout
      );
      App.htmlElements.itemsDiv.addEventListener("click", App.events.showCart);
      App.htmlElements.backButton.addEventListener("click", App.events.back);
      App.htmlElements.goToPaypal.addEventListener(
        "click",
        App.events.checkout
      );
    },
    initializeData: {
      items: async () => {
        const { count, data } = await App.utils.fetch(
          "http://localhost:4000/api/v1/items/",
          {
            method: "GET",
          }
        );
        data.forEach((item) => {
          App.utils.loadItems(item);
        });
      },
    },
    events: {
      onLogin: async (event) => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        const emailValue = email.value;
        const passwordValue = password.value;
        if (emailValue != "") {
          const { auth, token } = await App.utils.fetch(
            "http://localhost:4000/api/v1/users/login/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: emailValue,
                password: passwordValue,
              }),
              redirect: "follow",
            }
          );
          if (auth) {
            window.sessionStorage.setItem("token", token);
            App.initializeData.items();
            App.htmlElements.loginDiv.style.display = "none";
            App.htmlElements.itemsDiv.style.display = "block";
          } else {
            alert("Error, Email o Contraseña equivocados");
          }
        }
      },
      addToCart: async (event) => {
        event.preventDefault();
        if (event.target.id == "addCart") {
          const id = event.target.parentNode.parentNode.id;
          await App.utils.fetch(
            "http://localhost:4000/api/v1/cart/items/add/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: id,
              }),
              redirect: "follow",
            }
          );
          alert("Item añadido al Carrito");
        }
      },
      showCart: async (event) => {
        event.preventDefault();
        if (event.target.id == "goToCart") {
          /* We have to clean everything */
          App.htmlElements.cartList.innerHTML = "";
          App.total = 0;

          /* We have to enable the button to proceed with paypal checkout */
          App.htmlElements.goToPaypal.removeAttribute("disabled");

          App.htmlElements.itemsDiv.style.display = "none";

          /* This will fetch us the product's id added to the cart */
          const { count, data } = await App.utils.fetch(
            "http://localhost:4000/api/v1/cart/items/",
            {
              method: "GET",
            }
          );

          data.forEach((item) => {
            App.utils.loadItemsCart(item);
          });
          App.htmlElements.cartDiv.style.display = "block";
        }
      },
      logout: () => {
        window.sessionStorage.removeItem("token");
        App.htmlElements.itemsList.innerHTML = "";
        App.htmlElements.loginDiv.style.display = "flex";
        App.htmlElements.itemsDiv.style.display = "none";
      },
      back: () => {
        /* For security purposes, we are cleaning everything */
        App.htmlElements.cartList.innerHTML = "";
        App.total = 0;
        App.htmlElements.goToPaypal.setAttribute("disabled", "true");

        App.htmlElements.itemsDiv.style.display = "block";
        App.htmlElements.cartDiv.style.display = "none";
      },
      checkout: (event) => {
        event.preventDefault();
        console.log("to paypal");
      },
    },
    utils: {
      fetch: async (url, options) => {
        const requestOptions = options;
        const response = await fetch(url, requestOptions);
        return response.json();
      },
      loadItems: ({ _id, name, description, price, id_image }) => {
        /* Since the product's properties is a string, we have to split them */
        const [brand, style, color, configuration] = description.split(".");

        /* Now since we split the properties, it is easier to customize them*/
        App.htmlElements.itemsList.innerHTML += `
        <div class="single-product" id=${_id}>
          <div class="product-title">
            <h1>${name}</h1>
          </div>
          <div class="product-image">
            <img src="/static/img/${id_image}.jpg" alt="${name}">
          </div>
          <div class="product-description">
            <p>${brand}</p>
            <p>${style}</p>
            <p>${color}</p>
            <p>${configuration}</p>
            <p>Precio: $${price}</p>
          </div>
          <div class="product-actions">
            <button type="button" id="addCart">Agregar al Carrito</button>
          </div>
        </div>`;
      },
      loadItemsCart: async ({ item }) => {
        const { data } = await App.utils.fetch(
          "http://localhost:4000/api/v1/item/" + item,
          {
            method: "GET",
          }
        );

        if (data) {
          /* Since we are receiving the product properties on a string, we have to split it*/
          const [brand, style, color, configuration] =
            data.description.split(".");

          /* This will output the total */
          App.total += data.price;

          /* We display the product in html */
          App.htmlElements.cartList.innerHTML += `
        <div class="cart-item" id=${data._id}>
          <div class="item-image">
            <img src="/static/img/${data.id_image}.jpg" width=270 height=200 />
          </div>
          <div class="item-description">
            <div class="product-title">
              <h1>${data.name}</h1>
            </div>
            <div class="product-description">
              <p>${brand}</p>
              <p>${style}</p>
              <p>${color}</p>
              <p>${configuration}</p>
              <p>Precio: $${data.price}</p>
            </div>
          </div>
        </div>`;

          /* We have to update the total also */
          App.htmlElements.cartTotal.innerHTML = `Total: $${App.total}`;
        }
      },
    },
  };
  App.init();
})();
