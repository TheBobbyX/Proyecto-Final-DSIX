const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const { connectDb } = require("./utils");
const {
  validators: ItemValidators,
  controllers: ItemControllers,
} = require("./controllers/Item");
const {
  validators: CartValidators,
  controllers: CartControllers,
} = require("./controllers/Cart");
const {
  validators: UserValidators,
  controllers: UserControllers,
} = require("./controllers/User");

const port = 4000;

app.use(express.json());
app.use(cors());
app.use(helmet());

// Users API
app.post(
  "/api/v1/users/signup/",
  UserValidators.signupUser,
  UserControllers.signupUser
);
app.post(
  "/api/v1/users/login/",
  UserValidators.loginUser,
  UserControllers.loginUser
);

// Items API
app.get("/api/v1/items/", ItemValidators.getItems, ItemControllers.getItems);
app.get("/api/v1/item/:id", ItemValidators.getItem, ItemControllers.getItem);
app.post(
  "/api/v1/items/",
  ItemValidators.createItem,
  ItemControllers.createItem
);
app.post(
  "/api/v1/items/:id",
  ItemValidators.updateItem,
  ItemControllers.updateItem
);
app.delete(
  "/api/v1/items/:id",
  ItemValidators.deleteItem,
  ItemControllers.deleteItem
);

// Cart API
app.get("/api/v1/cart/items/", CartValidators.getCart, CartControllers.getCart);
app.post(
  "/api/v1/cart/items/add/",
  CartValidators.addItemToCart,
  CartControllers.addItemToCart
);
app.delete(
  "/api/v1/cart/items/remove/:id",
  CartValidators.deleteItemFromCart,
  CartControllers.deleteItemFromCart
);

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Ejemplo escuchando en: http://localhost:${port}`);
  });
});
