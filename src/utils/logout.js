function logout() {
    localStorage.removeItem("user_uuid");
    localStorage.removeItem("token");
    window.location.href = "/login";
}

export default logout;