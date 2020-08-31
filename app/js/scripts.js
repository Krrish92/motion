(function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (
            location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length
                ? target
                : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html, body").animate(
                    {
                        scrollTop: target.offset().top - 70,
                    },
                    1000,
                    "easeInOutExpo"
                );
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#mainNav",
        offset: 100,
    });

    $("#submit").on('click', signup)

    // Collapse Navbar
    var navbarCollapse = function () {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

    async function signup() {
        try {
            $("#submit").attr("disabled", true);
            let name = $("#name").val();
            let mobile = $("#mobile").val();
            let email = $("#email").val();
            let address = $("#address").val();
            let file1 = $("#file1")[0].files[0];
            let file2 = $("#file2")[0].files[0];
            let error = $("#validationError");
            if (!name) {
                error.text("Please enter name");
                return;
            }
            if (!mobile) {
                error.text("Please enter mobile number");
                return;
            }
            if (mobile && isNaN(mobile)) {
                error.text("mobile number should be digits");
                return;
            }
            if (mobile && mobile.length != 10) {
                error.text("mobile number should be 10 digits");
                return;
            }
            if (!email) {
                error.text("Please enter email");
                return;
            }
            if (!address) {
                error.text("Please enter address");
                return;
            }
            $("#validationError").text('');
            let params = {
                name,
                mobile,
                email,
                address
            };
            if (file1) {
                params.file1 = await toBase64(file1)
            }
            if (file2) {
                params.file2 = await toBase64(file2)
            }

            let signupResult = await signupService(params);
            resetSignup();
            alert("You have registered with us successfully");
        } catch (err) {
            console.error(err);
            alert(err.responseJSON.message);
            $("#submit").attr("disabled", false)
        }

    };

    function signupService(params) {
        return $.ajax({
            url: `api/signup`,
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");;
            },
            type: "POST",
            data: JSON.stringify(params),
            processData: false
        });
    }

    function resetSignup() {
        $("#name").val('');
        $("#mobile").val('');
        $("#email").val('');
        $("#address").val('');
        $("#file1").val('');
        $("#file2").val('');
        $("#validationError").text('');
        $("#submit").attr("disabled", false)
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

})(jQuery); // End of use strict
