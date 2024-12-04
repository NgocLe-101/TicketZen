function updateTotals(cartData) {
    const subtotal = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    $('#subtotal').text('$' + subtotal.toFixed(2));
    $('#total').text('$' + subtotal.toFixed(2));
  }

function updateCartItem(id, quantity) {
  $.post(`/cart/update/${id}`, { quantity })
    .done(function (response) {
      updateTotals(response);
    })
    .fail(function (err) {
      Toast.error("Failed to update cart");
    });
}

function removeCartItem(id) {
  $.post(`/cart/remove/${id}`)
    .done(function (response) {
        console.log(response);
      $(`.cart-item[data-id="${id}"]`).fadeOut(function () {
        $(this).remove();
        updateTotals(response.cart);
      });
    })
    .fail(function (err) {
      Toast.error("Failed to remove item");
    });
}

function addCartItem(id) {
  $.post(`/cart/add/${id}`)
    .done(function (response) {
      Toast.success(response.message);
    })
    .fail(function (err) {
        console.log(err);
      Toast.error("Failed to add item to cart");
    });
}

export default {
  updateCartItem,
  removeCartItem,
  addCartItem,
};
