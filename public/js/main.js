$(document).ready(() => {
  $('#userForm').on('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
      await $.ajax({
        url: '/users',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: () => {
          Swal.fire('Success', 'User added successfully!', 'success');
          location.reload();
        },
        error: (error) => {
          Swal.fire('Error', error.responseText, 'error');
        }
      });
    } catch (error) {
      Swal.fire('Error', 'An error occurred', 'error');
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const image = document.getElementById("previewImage");
  const input = document.getElementById("image");

  input.addEventListener("change", () => {
    if (input.files && input.files[0]) {
      image.src = URL.createObjectURL(input.files[0]);
    }
  });
});
