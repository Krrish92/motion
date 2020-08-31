(async () => {
    $("#login").on('click', async () => {
        try {
            let username = $("#username").val();
            let password = $("#password").val();
            let error = $("#loginError");
            if (!username) {
                error.text("Please enter username");
                return;
            }
            if (!password) {
                error.text("Please enter password");
                return;
            }
            error.text("");
            let loginData = await loginService({ username, password });
            localStorage.setItem("loggedUser", JSON.stringify(loginData));
            window.location.href="/admin";
        } catch (err) {
            console.error(err);
            alert(err.responseJSON.message);
        }

    })

    function loginService(params) {
        return $.ajax({
            url: `${window.location.origin}/api/admin/login`,
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");;
            },
            type: "POST",
            data: JSON.stringify(params),
            processData: false
        });
    }
})();