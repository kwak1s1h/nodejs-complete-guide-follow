const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database.js');
const Product = require('./models/product.js');
const User = require('./models/user.js');
const Cart = require('./models/cart.js');
const CartItem = require('./models/cart-item.js');
const Order = require('./models/order.js');
const OrderItem = require('./models/order-item.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize.sync({force: false})
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if(!user) {
      return User.create({name: 'max', email: 'test@test.com'});
    }
    return user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(cart => {
    app.listen(3000);
    console.log(`http://localhost:${3000}`);
  })
  .catch(err => console.log(err));