function submitForm(event) {
    event.preventDefault(); 
    console.log("Form submission started."); // Check if the function is being called

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value; // Added safe access
    const dob = document.getElementById('dob').value;
    const weight = document.getElementById('weight').value;
    const weightUnit = document.getElementById('weightUnit').value;
    const height = document.getElementById('height').value;
    const heightUnit = document.getElementById('heightUnit').value;
    const terms = document.getElementById('terms').checked;

    if (!name || !email || !password || !confirmPassword || !dob || !weight || !height || !terms) {
        alert("Please fill in all the fields and accept the terms.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 6 characters long and contain both letters and numbers.");
        return;
    }

    if (!terms) {
        alert("You must agree to the Terms & Conditions before registering.");
        return;
    }    

    const formData = {
        name,
        email,
        password,
        gender,
        dob,
        weight,
        weightUnit,
        height,
        heightUnit,
    };

    console.log("Sending data:", formData); 

    fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        console.log("Response received:", response); 
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Registration successful!");
            window.location.href = "LoginPage.html";
        } else {
            alert("Registration failed. Please try again.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error occurred during registration.");
    });
}

document.getElementById('registrationForm').addEventListener('submit', submitForm);
