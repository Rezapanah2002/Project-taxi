document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var role = document.getElementById('role').value;
    var name = document.getElementById('signup-name').value;
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;
    var city = document.getElementById('city').value;
    var area = document.getElementById('area').value;

    var user = {
        role: role,
        name: name,
        email: email,
        password: password
    };

    if (role === 'driver') {
        user.city = city;
        user.area = area;
        user.activity_areas = [];
        user.ratings = [];
        user.trips = [];
    }

    saveUser(user);
});

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
    var isAdmin = document.getElementById('admin-toggle').checked;
    var adminCode = document.getElementById('admin-code').value;

    validateLogin(email, password, isAdmin, adminCode);
});

function saveUser(user) {
    fetch('users.json')
        .then(response => response.json())
        .then(users => {
            users.push(user);

            return fetch('users.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(users)
            });
        })
        .then(response => {
            if (response.ok) {
                alert('ثبت نام با موفقیت انجام شد!');
                window.location.href = getRedirectURL(user.role);
            } else {
                alert('خطا در ثبت نام!');
            }
        })
        .catch(error => console.error('Error:', error));
}

function validateLogin(email, password, isAdmin, adminCode) {
    fetch('users.json')
        .then(response => response.json())
        .then(users => {
            var user = users.find(u => u.email === email && u.password === password);
            if (user) {
                if (user.role === 'admin') {
                    if (isAdmin && adminCode === 'admin1234') {
                        localStorage.setItem('userEmail', email);
                        window.location.href = 'admin-panel.html';
                    } else {
                        alert('لطفاً کد ادمین را وارد کنید');
                    }
                } else if (user.role === 'driver') {
                    localStorage.setItem('userEmail', email);
                    window.location.href = 'driver-profile.html';
                } else if (user.role === 'passenger') {
                    localStorage.setItem('userEmail', email);
                    window.location.href = 'passenger-profile.html';
                } else {
                    alert('جزئیات ورود نامعتبر است');
                }
            } else {
                alert('جزئیات ورود نامعتبر است');
            }
        })
        .catch(error => console.error('Error:', error));
}

function getRedirectURL(role) {
    if (role === 'driver') {
        return 'driver-profile.html';
    } else if (role === 'passenger') {
        return 'passenger-profile.html';
    } else {
        return 'auth.html';
    }
}

document.getElementById('role').addEventListener('change', function () {
    var driverFields = document.querySelectorAll('.driver-only');
    if (this.value === 'driver') {
        driverFields.forEach(function (field) {
            field.style.display = 'block';
        });
    } else {
        driverFields.forEach(function (field) {
            field.style.display = 'none';
        });
    }
});

document.getElementById('admin-toggle').addEventListener('change', function () {
    var adminField = document.querySelector('.admin-only');
    if (this.checked) {
        adminField.style.display = 'block';
    } else {
        adminField.style.display = 'none';
    }
});
