$(document).ready(function () {
    $(".far").on("click", function () {
        $(this).attr("class", "fa fa-heart")
        var cardID = $(this).attr("id");
        var userID = $("#NamePlate").text();
        console.log(cardID, userID)
        $.ajax({
                method: "PUT",
                url: "/fav",
                data: {
                    cardID: cardID,
                    userID: userID
                }

            })
            .then(function (data) {
                console.log(data);
            })
            .catch(function (err) {
                $("#alert .msg").text(err.responseJSON);
                $("#aldert").fadeIn(500);
            })
    })

    $("form.comments").on("click", function(event){
        event.preventDefault();
        var id = $(this).attr("id");
        var userID = $("#NamePlate").text();
        var comment = $(`#${id}commentID`).val();
        console.log(comment + userID);
        $.ajax({
            method: "POST",
            url: `/${id}`,
            data:{
                comment: comment,
                userID: userID
            }
        }).then(function(data){
            console.log("comment sent")
        }).catch(function(err){
            console.log(err);
        })
        
    })
    var signUpForm = $("form.signup");
    signUpForm.on("submit", function (event) {
        event.preventDefault();
        var userName = $("input#newUserName").val();
        var email = $("input#newUserEmail").val();
        var password = $("input#newUserPassword").val();
        var confirmPassword = $("input#newUserPasswordConf").val();
        console.log(userName + email + password + confirmPassword)
        if (userName && email && password && confirmPassword) {

            if (password == confirmPassword) {
                var userCapture = {
                    userName: userName,
                    email: email,
                    userPassword: password
                }
                $.ajax({
                    method: "POST",
                    url: "/user",
                    data: {
                        email: userCapture.email,
                        username: userCapture.userName,
                        password: userCapture.userPassword
                    }
                })
                .then(function (data) {
                        console.log("user added");
                        $(this).hide();
                        console.log(data)
                    })
                    .catch(function (err) {
                        $("#alert .msg").text(err.responseJSON);
                        $("#alert").fadeIn(500);
                    })

            } else { //passwords didn't match
                console.log("passwords didn't match")
                // $("label#InputPasswordConf").innerHTML("YOUR PASSWORDS DID NOT MATCH");
                $("label[for='newUserPassword']").text("YOUR PASSWORDS DID NOT MATCH")
                $("label[for='newUserPassword']").css("color", "red")
                $("label[for='newUserPasswordConf']").text("YOUR PASSWORDS DID NOT MATCH")
                $("label[for='newUserPasswordConf']").css("color", "red")
            }
        } else { //one of the fields was empty
            console.log("Empty Test Pass")
            $("input").each(function () {
                if (!$(this).val() === "") {
                    $element = $(this);
                    $("label[for='" + $element.attr('id') + "']").css("color", "red");
                }
            })

        }

    })

    $("#favorites").on("click", function () {
        var userID = $("#NamePlate").text();
        console.log(userID + "<--userID")
        $.ajax({
                method: "GET",
                url: `/fav/${userID}`,
                // data: {
                //     cardID: cardID,
                //     userID: userID
                // }

            })
            .then(function (data) {
                console.log(data)
            })
            .catch(function (err) {
                $("#alert .msg").text(err.responseJSON);
                $("#aldert").fadeIn(500);
            })
    })




    var logInForm = $("form.login");
    logInForm.on("submit", function (event) {
        event.preventDefault();
        var userName = $("input#userNameInput").val();
        var password = $("input#passwordInput").val();

        if (userName && password) {
            var userCapture = {
                userName: userName,
                password: password
            }
            $("#NamePlate").text(userName);
            $("#loginBtn").hide();
            $("#signUpBtn").hide();
            $.post("/verify", {
                    userName: userCapture.userName,
                    password: userCapture.password
                })
                .then(function (data) {
                    console.log("verifying,,," + data);
                    (this).hide();

                })
                .catch(function (err) {
                    $("#alert .msg").text(err.responseJSON);
                    $("#aldert").fadeIn(500);
                })
        }
    })

})