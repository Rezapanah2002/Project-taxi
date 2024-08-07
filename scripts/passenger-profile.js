document.addEventListener('DOMContentLoaded', function () {
    const email = getEmailFromSession();
    if (!email) {
        alert('لطفا ابتدا وارد حساب کاربری خود شوید.');
        window.location.href = 'auth.html';
        return;
    }

    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            const passenger = data.find(user => user.email === email && user.role === 'passenger');
            if (passenger) {
                displayProfile(passenger);
                displayTaxiRequests(passenger.taxi_requests);
                displayTrips(passenger.trips);

                document.getElementById('taxi-request-form').addEventListener('submit', function (e) {
                    e.preventDefault();
                    const origin = document.getElementById('origin').value;
                    const destination = document.getElementById('destination').value;
                    const fare = document.getElementById('fare').value;

                    const newRequest = {
                        id: Date.now(),
                        origin: origin,
                        destination: destination,
                        fare: parseFloat(fare)
                    };

                    passenger.taxi_requests.push(newRequest);
                    updateUserInJson(data);
                    displayTaxiRequests(passenger.taxi_requests);
                });

            } else {
                alert('اطلاعات کاربر یافت نشد');
            }
        });

    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', function (event) {
            openTab(event, tab.getAttribute('data-tab'));
        });
    });

    if (tabs.length > 0) {
        tabs[0].classList.add('active');
        openTab({ currentTarget: tabs[0] }, tabs[0].getAttribute('data-tab'));
    }

    document.getElementById('add-request-button').addEventListener('click', function () {
        document.getElementById('taxi-request-form').style.display = 'block';
    });
});

function getEmailFromSession() {
    return localStorage.getItem('userEmail');
}

function openTab(event, tabName) {
    var i, tabcontent, tabbuttons;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

function displayProfile(data) {
    const infoTab = document.getElementById('info');
    infoTab.innerHTML = `
        <p>نام: ${data.name}</p>
        <p>ایمیل: ${data.email}</p>
    `;
}

function displayTaxiRequests(data) {
    const requestTab = document.getElementById('request-taxi');
    let html = `
        <h3>درخواست جدید تاکسی</h3>
        <button id="add-request-button">+</button>
        <form id="taxi-request-form" style="display: none;">
            <label for="origin">مبدا:</label>
            <input type="text" id="origin" name="origin" required><br>
            <label for="destination">مقصد:</label>
            <input type="text" id="destination" name="destination" required><br>
            <label for="fare">مبلغ:</label>
            <input type="number" id="fare" name="fare" required><br>
            <button type="submit">ارسال درخواست</button>
        </form>
        <h3>درخواست‌های جاری</h3>
        <ul>`;
    data.forEach(request => {
        html += `
            <li>
                مبدا: ${request.origin}, مقصد: ${request.destination}, مبلغ: ${request.fare} تومان
                <button class="cancel-button" onclick="cancelRequest(${request.id})">لغو</button>
            </li>
        `;
    });
    html += '</ul>';
    requestTab.innerHTML = html;

    document.getElementById('add-request-button').addEventListener('click', function () {
        document.getElementById('taxi-request-form').style.display = 'block';
    });
}

function displayTrips(data) {
    const tripsTab = document.getElementById('trips');
    let html = '<ul>';
    data.forEach(trip => {
        html += `
            <li>
                مبدا: ${trip.origin}, مقصد: ${trip.destination}, مبلغ: ${trip.fare} تومان
                <button class="rate-button" onclick="rateTrip(${trip.id})">امتیاز دهی</button>
            </li>
        `;
    });
    html += '</ul>';
    tripsTab.innerHTML = html;
}

function cancelRequest(id) {
    const email = getEmailFromSession();
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            const passenger = data.find(user => user.email === email && user.role === 'passenger');
            if (passenger) {
                passenger.taxi_requests = passenger.taxi_requests.filter(request => request.id !== id);
                updateUserInJson(data);
                displayTaxiRequests(passenger.taxi_requests);
            }
        });
}

function rateTrip(id) {
    const rating = prompt('لطفا امتیاز خود را وارد کنید (1-5):');
    if (rating < 1 || rating > 5) {
        alert('امتیاز نامعتبر است.');
        return;
    }

    const email = getEmailFromSession();
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            const passenger = data.find(user => user.email === email && user.role === 'passenger');
            if (passenger) {
                const trip = passenger.trips.find(trip => trip.id === id);
                if (trip) {
                    trip.rating = rating;
                    updateUserInJson(data);
                    displayTrips(passenger.trips);
                }
            }
        });
}

function updateUserInJson(data) {
    fetch('users.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
