// shown button 
const showPasswordButton = document.getElementById('PassButton');
const passwordInput = document.getElementById('passInput');

showPasswordButton.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showPasswordButton.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        showPasswordButton.textContent = 'Show';
    }
});
//end show Password Button

// dropdown button
document.addEventListener("DOMContentLoaded", function () {
    var dropdownButton = document.getElementById("navbarDropdown1");
    new bootstrap.Dropdown(dropdownButton);
});
// end dropdown button

// logout popup
function confirmLogout() {
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        window.location.href = "/";
    }
}
function addNewUser() {
    const confirmLogout = confirm("Are you sure you want to log out..? and Create a new Account?");
    if (confirmLogout) {
        window.location.href = "/signup";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Function to show the pop-up
    function showPopup(message) {
        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');
        popupMessage.textContent = message;
        popup.classList.remove('hidden');
    }

    // Function to hide the pop-up
    function hidePopup() {
        const popup = document.getElementById('popup');
        popup.classList.add('hidden');
    }

    // Event listener for the close button
    const closePopupBtn = document.getElementById('closePopupBtn');
    closePopupBtn.addEventListener('click', () => {
        hidePopup();
    });

    // Check for a message in the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
        console.log('Message detected:', message);
        showPopup(message);
    }
});
