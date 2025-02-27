<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Frontend Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .container {
            max-width: 500px;
            margin: auto;
        }
        input, button {
            display: block;
            width: 100%;
            margin-bottom: 10px;
            padding: 10px;
        }
        button {
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
        .response {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            background: #f9f9f9;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Auth Frontend Test</h1>

    <!-- Register -->
    <h2>Register</h2>
    <input id="registerUserName" type="text" placeholder="Username" required>
    <input id="registerEmail" type="email" placeholder="Email" required>
    <input id="registerPassword" type="password" placeholder="Password" required>
    <input id="confirmPassword" type="password" placeholder="Confirm Password" required>
    <input id="registerAge" type="number" placeholder="Age" required>
    <input id="registerProfilePicture" type="file">
    <button onclick="register()">Register</button>

    <!-- Login -->
    <h2>Login</h2>
    <input id="loginEmail" type="email" placeholder="Email">
    <input id="loginPassword" type="password" placeholder="Password">
    <button onclick="login()">Login</button>

    <!-- Update Username -->
    <h2>Update Username</h2>
    <input id="newUserName" type="text" placeholder="New Username">
    <button onclick="updateUsername()">Update Username</button>

    <!-- Update Email -->
    <h2>Update Email</h2>
    <input id="updateEmail" type="email" placeholder="New Email">
    <button onclick="updateEmail()">Update Email</button>

    <!-- Update Profile Picture -->
    <h2>Update Profile Picture</h2>
    <input id="updateProfilePicture" type="file">
    <button onclick="updateProfilePicture()">Update Profile Picture</button>

    <!-- Update Password -->
    <h2>Update Password</h2>
    <input id="currentPassword" type="password" placeholder="Current Password">
    <input id="newPassword" type="password" placeholder="New Password">
    <input id="newPasswordConfirmation" type="password" placeholder="Confirm New Password">
    <button onclick="updatePassword()">Update Password</button>

    <h1>Add New Item</h1>
    <form id="addItemForm">
        <label for="item_name">Item Name:</label>
        <input type="text" id="item_name" name="item_name" required><br><br>

        <label for="price">Price:</label>
        <input type="number" id="price" name="price" step="0.01" required><br><br>

        <label for="rating">Rating (Optional):</label>
        <input type="number" id="rating" name="rating" step="0.1" min="0" max="5"><br><br>

        <label for="description">Description:</label>
        <textarea id="description" name="description" required></textarea><br><br>

        <label for="currency_id">Currency:</label>
        <select id="currency_id" name="currency_id" required>
            <option value="1">USD</option>
            <option value="2">EUR</option>
            <option value="3">GBP</option>
        </select><br><br>

        <div id="item_sizes">
            <h3>Item Sizes</h3>
            <div class="item-size">
                <label>Garment Type:</label>
                <input type="text" id="garment_type" required><br>
                <label>Size Label:</label>
                <input type="text" id="size_label" required><br>
                <label>Chest Size:</label>
                <input type="number" id="chest_size"><br>
                <label>Waist:</label>
                <input type="number" id="waist"><br>
                <label>Hip:</label>
                <input type="number" id="hip"><br>
                <label>Height:</label>
                <input type="number" id="height"><br>
                <label>Length:</label>
                <input type="number" id="length"><br>
                <label>Neck Size:</label>
                <input type="number" id="neck_size"><br>
                <label>Sleeve Length:</label>
                <input type="number" id="sleeve_length"><br>
                <label>Shoulder Width:</label>
                <input type="number" id="shoulder_width"><br>
                <label>Inseam Length:</label>
                <input type="number" id="inseam_length"><br>
                <label>Leg Opening:</label>
                <input type="number" id="leg_opening"><br>
                <label>Bust:</label>
                <input type="number" id="bust"><br>
                <label>Waist to Hem:</label>
                <input type="number" id="waist_to_hem"><br>
            </div>
        </div>
        <button type="button" onclick="saveItemSize()">Save Item Size</button>
        <ul id="sizeList"></ul><br><br>

        <label for="item_images">Item Images:</label>
        <input type="file" id="item_images" name="item_images[]" multiple accept="image/*" required><br><br>

        <label for="item_colors">Item Colors:</label>
        <select id="item_colors" name="item_colors[]" multiple required>
            <option value="1">Red</option>
            
        </select><br><br>

        <label for="cat_ids">Categories:</label>
        <select id="cat_ids" name="cat_ids[]" multiple required>
            <option value="1">test</option>
            
        </select><br><br>

        <button type="button" onclick="additem()">Add Item</button>
    </form>


    <!-- Response Display -->
    <div class="response" id="response"></div>
</div>

<script>
    const apiBase = 'http://192.168.1.106:8000/api';
    let token = '';

    function setResponse(data) {
        document.getElementById('response').innerText = JSON.stringify(data, null, 2);
    }

    async function register() {
        const userName = document.getElementById('registerUserName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const age = document.getElementById('registerAge').value;
        const profilePicture = document.getElementById('registerProfilePicture').files[0];

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        let profilePictureBase64 = null;
        if (profilePicture) {
            profilePictureBase64 = await convertToBase64(profilePicture);
        }

        const response = await fetch(`${apiBase}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                UserName: userName,
                email: email,
                password: password,
                password_confirmation: confirmPassword,
                age: age,
                profile_picture: profilePictureBase64,
            }),
        });

        const data = await response.json();
        setResponse(data);
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function login() {
        const response = await fetch(`${apiBase}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value,
            }),
        });
        const data = await response.json();
        if (response.ok) {
            token = data.access_token;
            setResponse(data);
        } else {
            setResponse(data);
        }
    }

    async function updateUsername() {
        const response = await fetch(`${apiBase}/profile/update-username`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ UserName: document.getElementById('newUserName').value }),
        });

        const data = await response.json();
        setResponse(data);
    }

    async function updateEmail() {
        const response = await fetch(`${apiBase}/profile/update-email`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email: document.getElementById('updateEmail').value }),
        });

        const data = await response.json();
        setResponse(data);
    }

    async function updateProfilePicture() {
        const formData = new FormData();
        const profilePicture = document.getElementById('updateProfilePicture').files[0];
        if (profilePicture) {
            formData.append("profile_picture", profilePicture);
        } else {
            setResponse({ success: false, message: 'Please select a file.' });
            return;
        }

        const response = await fetch(`${apiBase}/profile/update-profile-picture`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        setResponse(data);
    }

    async function updatePassword() {
        const response = await fetch(`${apiBase}/profile/update-password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                current_password: document.getElementById('currentPassword').value,
                new_password: document.getElementById('newPassword').value,
                new_password_confirmation: document.getElementById('newPasswordConfirmation').value,
            }),
        });
        const data = await response.json();
        setResponse(data);
    }

    let sizeArray = [];

function saveItemSize() {
    const garmentType = document.getElementById('garment_type').value;
    const sizeLabel = document.getElementById('size_label').value;
    const chestSize = document.getElementById('chest_size').value || null;
    const waist = document.getElementById('waist').value || null;
    const hip = document.getElementById('hip').value || null;
    const height = document.getElementById('height').value || null;
    const length = document.getElementById('length').value || null;
    const neckSize = document.getElementById('neck_size').value || null;
    const sleeveLength = document.getElementById('sleeve_length').value || null;
    const shoulderWidth = document.getElementById('shoulder_width').value || null;
    const inseamLength = document.getElementById('inseam_length').value || null;
    const legOpening = document.getElementById('leg_opening').value || null;
    const bust = document.getElementById('bust').value || null;
    const waistToHem = document.getElementById('waist_to_hem').value || null;

    const newSize = {
        garment_type: garmentType,
        size_label: sizeLabel,
        chest_size: chestSize,
        waist: waist,
        hip: hip,
        height: height,
        length: length,
        neck_size: neckSize,
        sleeve_length: sleeveLength,
        shoulder_width: shoulderWidth,
        inseam_length: inseamLength,
        leg_opening: legOpening,
        bust: bust,
        waist_to_hem: waistToHem
    };

    sizeArray.push(newSize);

    const sizeList = document.getElementById('sizeList');
    const listItem = document.createElement('li');
    listItem.textContent = sizeLabel;
    sizeList.appendChild(listItem);

   
    document.getElementById('garment_type').value = '';
    document.getElementById('size_label').value = '';
    document.getElementById('chest_size').value = '';
    document.getElementById('waist').value = '';
    document.getElementById('hip').value = '';
    document.getElementById('height').value = '';
    document.getElementById('length').value = '';
    document.getElementById('neck_size').value = '';
    document.getElementById('sleeve_length').value = '';
    document.getElementById('shoulder_width').value = '';
    document.getElementById('inseam_length').value = '';
    document.getElementById('leg_opening').value = '';
    document.getElementById('bust').value = '';
    document.getElementById('waist_to_hem').value = '';
}

async function additem() {
    const form = document.getElementById('addItemForm');
    const formData = new FormData(form);
    
    console.log(sizeArray);
    formData.append('item_sizes', JSON.stringify(sizeArray))
    const response = await fetch(`${apiBase}/item/additem`, {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    setResponse(data);

}

</script>
</body>
</html>
