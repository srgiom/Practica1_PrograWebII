const User = require('../models/User');

class CartService {
  async getCart(userId) {
    const user = await User.findById(userId).populate('cart.productId');
    return user.cart;
  }

  async addToCart(userId, productId) {
    const user = await User.findById(userId);
    const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (productIndex > -1) {
      user.cart[productIndex].quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();
    await user.populate('cart.productId');
    return user.cart;
  }

  async removeFromCart(userId, productId) {
    const user = await User.findById(userId);
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();
    await user.populate('cart.productId');
    return user.cart;
  }
}

module.exports = new CartService();
