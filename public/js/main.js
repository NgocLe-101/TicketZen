import cart from "./cart.js";
(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Fixed Navbar
  $(window).scroll(function () {
    if ($(window).width() < 992) {
      if ($(this).scrollTop() > 45) {
        $(".fixed-top").addClass("bg-black-100 shadow");
      } else {
        $(".fixed-top").removeClass("bg-black-100 shadow");
      }
    } else {
      if ($(this).scrollTop() > 45) {
        $(".fixed-top").addClass("bg-black-100 shadow").css("top", -45);
      } else {
        $(".fixed-top").removeClass("bg-black-100 shadow").css("top", 0);
      }
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    margin: 25,
    loop: true,
    center: true,
    dots: false,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });

  $(".add-cart-item").on("click", function (e) {
    let id = $(this).data("id");
    if (!id) return;
    cart.addCartItem(id);
  });
  
  $(".increase-qty, .decrease-qty").click(function () {
    const input = $(this).closest(".input-group").find(".qty-input");
    const newQty = $(this).hasClass("increase-qty")
      ? parseInt(input.val()) + 1
      : Math.max(1, parseInt(input.val()) - 1);
    input.val(newQty);
    cart.updateCartItem($(this).closest(".cart-item").data("id"), newQty);
  });

  // Remove item
  $(".remove-item").click(function () {
    const itemId = $(this).closest(".cart-item").data("id");
    cart.removeCartItem(itemId);
  });

  // Checkout
  $("#checkout-btn").click(function () {
    $.post("/cart/checkout")
      .done(function (response) {
        if (response.success) {
          Toast.success("Order placed successfully!");
          setTimeout(
            () => (window.location.href = "/orders/" + response.orderId),
            1500
          );
        }
      })
      .fail(function (err) {
        Toast.error("Failed to place order");
      });
  });

})(jQuery);
