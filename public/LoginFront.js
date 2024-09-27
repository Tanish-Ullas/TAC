function submitLogin(event) {
    event.preventDefault();  

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please fill in both fields.");
        return;
    }

    const loginData = {
        email,
        password,
    };

    console.log("Sending login data:", loginData);

    fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
    .then(response => {
        console.log("Response received:", response);
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Login successful!");
            window.location.href = "HomePage.html";  
        } else {
            alert("Login failed. Please check your credentials.");
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert("Error occurred during login.");
    });
}

document.getElementById('loginForm').addEventListener('submit', submitLogin);
