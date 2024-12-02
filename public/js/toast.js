// toast.js - Create new file
const Toast = {
  init() {
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

    header.removeClass("bg-success bg-warning bg-danger text-white");
    icon.removeClass("bi-check-circle bi-exclamation-triangle bi-x-circle");

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

// Make Toast globally available
window.Toast = Toast;

export default Toast;
