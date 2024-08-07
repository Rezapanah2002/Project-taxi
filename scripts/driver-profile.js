document.addEventListener('DOMContentLoaded', function () {
    fetch('users.json')
        .then(response => response.json())
        .then(users => {
            const loggedInUser = users[0];

            document.getElementById('driver-name').textContent = loggedInUser.name;
            document.getElementById('driver-email').textContent = loggedInUser.email;
            document.getElementById('driver-city').textContent = loggedInUser.city;
            document.getElementById('driver-area').textContent = loggedInUser.area;

            document.getElementById('driver-activity-areas').textContent = loggedInUser.activityAreas;
            document.getElementById('driver-ratings').textContent = loggedInUser.ratings;

            const tripsList = document.getElementById('driver-trips');
            loggedInUser.trips.forEach(trip => {
                const li = document.createElement('li');
                li.textContent = trip.details;
                tripsList.appendChild(li);
            });

            const requestsList = document.getElementById('driver-requests');
            loggedInUser.requests.forEach(request => {
                const li = document.createElement('li');
                li.textContent = request.details;
                requestsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
