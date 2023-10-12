const deleteButtons = document.querySelectorAll('.DELETE');

deleteButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (!confirmed) {
      event.preventDefault();
    }
  });
});
