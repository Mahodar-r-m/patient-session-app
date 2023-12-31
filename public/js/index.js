
// Get the URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Get the 'success' parameter value
const successMessage = urlParams.get('success');

if (successMessage) {
  // Display the success message using Swal.fire()
  Swal.fire({
    toast: true,
    position: 'bottom',
    icon: 'success',
    title: successMessage, // Use the success message obtained from the URL parameter
    timer: 4000,
    showConfirmButton: false
  });
}
