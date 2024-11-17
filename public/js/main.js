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

  // Toast message
  const Toast = {
    init() {
      // Create toast container if not exists
      if ($("#toast-container").length === 0) {
        $("body").append(`
                <div id="toast-container" class="toast-container position-fixed top-4 end-4 p-3">
                    <div id="globalToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header">
                            <i class="toast-icon me-2"></i>
                            <strong class="me-auto toast-title">Notification</strong>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body"></div>
                    </div>
                </div>
            `);
      }
    },

    show(message, type = "success") {
      this.init();
      const toast = $("#globalToast");
      const header = toast.find(".toast-header");
      const icon = toast.find(".toast-icon");

      // Reset classes
      header.removeClass("bg-success bg-warning bg-danger text-white");
      icon.removeClass("bi-check-circle bi-exclamation-triangle bi-x-circle");

      // Configure based on type
      const configs = {
        success: {
          headerClass: "bg-success",
          iconClass: "bi bi-check-circle",
          title: "Success",
        },
        warning: {
          headerClass: "bg-warning",
          iconClass: "bi bi-exclamation-triangle",
          title: "Warning",
        },
        error: {
          headerClass: "bg-danger",
          iconClass: "bi bi-x-circle",
          title: "Error",
        },
      };

      const config = configs[type];
      header.addClass(`${config.headerClass} text-white`);
      icon.addClass(config.iconClass);
      toast.find(".toast-title").text(config.title);
      toast.find(".toast-body").text(message);

      const bsToast = new bootstrap.Toast(toast[0], {
        delay: 3000,
      });
      bsToast.show();
    },

    // Helper methods
    success(message) {
      this.show(message, "success");
    },

    warning(message) {
      this.show(message, "warning");
    },

    error(message) {
      this.show(message, "error");
    },
  };

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("login") === "success") {
    Toast.success("Login successful! Welcome back.");
  }
})(jQuery);
