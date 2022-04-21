import "bootstrap";
import axios from "axios";
import "../css/app.scss";

axios.defaults.withCredentials = true;

window.login = function () {
    const email = window.document.getElementById("email").value;
    const password = window.document.getElementById("password").value;

    axios.get("http://localhost/sanctum/csrf-cookie").then((response) => {
        axios
            .post("http://localhost/api/authenticate", {
                email,
                password,
            })
            .then((response) => {
                window.location = "/";
            });
    });
};
