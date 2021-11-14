(() => {
  const App = {
    total: 0,
    htmlElements: {
      loginForm: document.getElementById("form-login"),
      signupForm: document.getElementById("form-signup"),
      signupButton: document.getElementById("signupButton"),
      cartTotal: document.getElementById("cartTotal"),
      logoutButton: document.getElementById("logout"),
      backButton: document.getElementById("back"),
      paypalButton: document.getElementById("paypal-button-container"),
      backToLogin: document.getElementById("backToLogin"),

      loginDiv: document.querySelector(".login-container"),
      signupDiv: document.querySelector(".sign-up-container"),
      itemsDiv: document.querySelector(".items-container"),
      cartDiv: document.querySelector(".cart-container"),
      itemsList: document.querySelector(".items-list"),
      cartList: document.querySelector(".cart-list"),

      /* Animating DOM */
      inputEmail: document.getElementById("inputEmail"),
      inputPass: document.getElementById("inputPass"),
      inputSignUpEmail: document.getElementById("inputSignUpEmail"),
      inputSignUpPassword: document.getElementById("inputSignUpPass"),
      inputSignUpConfirmPassword: document.getElementById(
        "inputSignUpConfirmPass"
      ),
    },
    init: () => {
      App.bindEvents();
    },
    bindEvents: () => {
      /** Functional Events */
      App.htmlElements.loginForm.addEventListener("submit", App.events.onLogin);
      App.htmlElements.signupForm.addEventListener(
        "submit",
        App.events.onSignup
      );
      App.htmlElements.signupButton.addEventListener(
        "click",
        App.events.toSignUp
      );
      App.htmlElements.backToLogin.addEventListener(
        "click",
        App.events.toSignUp
      );
      App.htmlElements.itemsList.addEventListener(
        "click",
        App.events.addToCart
      );
      App.htmlElements.cartList.addEventListener(
        "click",
        App.events.removeCart
      );
      App.htmlElements.logoutButton.addEventListener(
        "click",
        App.events.logout
      );
      App.htmlElements.itemsDiv.addEventListener("click", App.events.showCart);
      App.htmlElements.backButton.addEventListener("click", App.events.back);
      App.htmlElements.paypalButton.addEventListener(
        "click",
        App.events.paypal
      );

      /** Animation events */
      App.htmlElements.inputEmail.addEventListener(
        "focusin",
        App.events.onFocusInput
      );
      App.htmlElements.inputPass.addEventListener(
        "focusin",
        App.events.onFocusInput
      );
      App.htmlElements.inputSignUpEmail.addEventListener(
        "focusin",
        App.events.onFocusInput
      );
      App.htmlElements.inputSignUpPassword.addEventListener(
        "focusin",
        App.events.onFocusInput
      );
      App.htmlElements.inputSignUpConfirmPassword.addEventListener(
        "focusin",
        App.events.onFocusInput
      );
      App.htmlElements.inputEmail.addEventListener(
        "blur",
        App.events.outFocusInput
      );
      App.htmlElements.inputPass.addEventListener(
        "blur",
        App.events.outFocusInput
      );
      App.htmlElements.inputSignUpEmail.addEventListener(
        "blur",
        App.events.outFocusInput
      );
      App.htmlElements.inputSignUpPassword.addEventListener(
        "blur",
        App.events.outFocusInput
      );
      App.htmlElements.inputSignUpConfirmPassword.addEventListener(
        "blur",
        App.events.outFocusInput
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
        if (emailValue === "" || passwordValue === "") {
          alert("Todos los campos son obligatorios");
          return;
        }

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
            App.utils.removeCart();
            App.htmlElements.loginDiv.style.display = "none";
            App.htmlElements.itemsDiv.style.display = "block";
          } else {
            alert("Error, Email o Contraseña equivocados");
          }
        }
      },
      onSignup: async (event) => {
        event.preventDefault();
        const { signupEmail, signupPassword, signupConfirmPassword } =
          event.target.elements;
        const emailValue = signupEmail.value;
        const passValue = signupPassword.value;
        const confirmPassValue = signupConfirmPassword.value;

        if (emailValue === "" || passValue === "" || confirmPassValue === "") {
          alert("Todos los campos son obligatorios");
          return;
        }
        if (passValue !== confirmPassValue) {
          alert("Las contraseñas no coinciden");
          return;
        }

        const response = await App.utils.fetch(
          "http://localhost:4000/api/v1/users/signup/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: emailValue,
              password: passValue,
            }),
            redirect: "follow",
          }
        );
        if (response.message !== undefined) {
          if (response.message.includes("duplicate")) {
            alert("Este correo ya ha sido registrado");
            return;
          }
          if (response.message.includes("email is invalid")) {
            alert("Correo inválido, intente otro correo");
            return;
          }
          alert(
            "No se pudo registrar el usuario, intenten dentro de unos minutos"
          );
          return;
        } else {
          alert("Usuario registrado con éxito");
          App.htmlElements.loginDiv.style.display = "flex";
          App.htmlElements.signupDiv.style.display = "none";
        }
      },
      toSignUp: (event) => {
        if (event.target.id === "signupButton") {
          App.htmlElements.loginDiv.style.display = "none";
          App.htmlElements.signupDiv.style.display = "block";
        } else {
          App.htmlElements.loginDiv.style.display = "flex";
          App.htmlElements.signupDiv.style.display = "none";
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
      removeCart: async (event) => {
        event.preventDefault();
        if (event.target.id === "removeCart") {
          const id = event.target.parentNode.parentNode.id;
          const parent = event.target.parentNode.parentNode;
          const price = event.target.getAttribute("data-price");

          const response = await App.utils.fetch(
            "http://localhost:4000/api/v1/cart/items/remove/" + id,
            {
              method: "DELETE",
            }
          );
          if (response.message !== undefined) {
            alert("No se pudo eliminar, intente nuevamente");
          } else {
            App.total -= price;
            parent.remove();
            App.htmlElements.cartTotal.innerHTML = `Total: $${Number(
              App.total
            ).toFixed(2)}`;
            alert("El artículo se ha eliminado con éxito");
            return;
          }
        }
      },
      showCart: async (event) => {
        event.preventDefault();
        if (event.target.id == "goToCart") {
          /* We have to clean everything */
          App.htmlElements.cartList.innerHTML = "";
          App.total = 0;

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

          /** Validate if there are items in the cart, since paypal do not accept values less than $0 */
          if (data.length !== 0) {
            App.events.paypal();
          }
        }
      },
      logout: () => {
        window.sessionStorage.removeItem("token");
        /** We should remove the cart once the user is logged out */
        App.utils.removeCart();

        App.htmlElements.itemsList.innerHTML = "";
        App.htmlElements.loginDiv.style.display = "flex";
        App.htmlElements.itemsDiv.style.display = "none";
      },
      back: () => {
        /* For security purposes, we are cleaning everything */
        App.htmlElements.cartList.innerHTML = "";
        App.total = 0;
        App.htmlElements.paypalButton.innerHTML = "";

        /* We have to update the total also */
        App.htmlElements.cartTotal.innerHTML = `Total: $${App.total}`;

        App.htmlElements.itemsDiv.style.display = "block";
        App.htmlElements.cartDiv.style.display = "none";
      },
      paypal: (event) => {
        paypal
          .Buttons({
            createOrder: function (data, actions) {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: App.total,
                    },
                  },
                ],
              });
            },
            onApprove: function (data, actions) {
              return actions.order.capture().then(function (details) {
                alert(
                  "Transaction completed by " + details.payer.name.given_name
                );
              });
            },
          })
          .render("#paypal-button-container");
      },
      onFocusInput: (event) => {
        event.target.placeholder = "";
      },
      outFocusInput: (event) => {
        switch (event.target.id) {
          case "inputEmail":
          case "inputSignUpEmail":
            event.target.placeholder = "Correo";
            break;
          case "inputPass":
          case "inputSignUpPass":
            event.target.placeholder = "Contraseña";
            break;
          case "inputSignUpConfirmPass":
            event.target.placeholder = "Confirmar Contraseña";
            break;
          default:
            event.target.placeholder = "";
        }
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
      loadItemsCart: async ({ item, _id }) => {
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
        <div class="cart-item" id=${_id}>
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
          <div class="product-actions">
            <button type="button" id="removeCart" data-price="${data.price}">X</button>
          </div
        </div>`;

          /* We have to update the total also */
          App.htmlElements.cartTotal.innerHTML = `Total: $${Number(
            App.total
          ).toFixed(2)}`;
        }
      },
      removeCart: async () => {
        await App.utils.fetch(
          "http://localhost:4000/api/v1/cart/items/removeall/",
          {
            method: "DELETE",
          }
        );
      },
    },
  };
  App.init();
})();
