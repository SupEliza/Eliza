function logout() {
    localStorage.removeItem("user_uuid");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
}

export default logout;