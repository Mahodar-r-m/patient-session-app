
$(document).ready(function() {

    // Close button click event
    $('#closeDropdown').on('click', function() {
        $('#patient-dropdown').hide();
        $('#closeDropdown').hide(); // Hide close button
    });
    
    $('#select-patient').on('click', function() {

        $('.add-patient-form-container').fadeOut(); // Hide the form container
        // Show loader before making AJAX call
        $('#loader').show();

        // AJAX call to fetch list of patients
        $.ajax({
        url: '/patients', 
        method: 'GET',
        success: function(response) {
            if (response.success) {
                displayPatientsDropdown(response.data);
            }
        },
        error: function() {
            console.error('Error fetching patients');
        },
        complete: function() {
            // Hide loader when the AJAX call completes (whether success or error)
            $('#loader').hide();
        }
        });
    });

    $('#select-patient').on('input', function() {
        const userInput = $(this).val().trim(); // Get user input

        // AJAX call to filter patients based on the user input
        $.ajax({
        url: `/patients/search?keyword=${userInput}`,
        method: 'GET',
        //   data: { keyword: userInput }, // Pass user input as query parameter
        success: function(response) {
            if (response.success) {
                if (response.data.length === 0) {
                    displayNoMatchFound(); // Display "No match found" message
                } else {
                    displayPatientsDropdown(response.data); // Display filtered patients
                }
            }
        },
        error: function() {
            console.error('Error filtering patients');
        }
        });
    });

    // Event handler for selecting a patient from dropdown
    $(document).on('click', '.patient-row', function() {
        // const selectedPatient = $(this).text().trim(); // Get the selected patient text

        const selectedName = $(this).find('.name').text().trim(); // Get the selected patient's name
        const selectedNumber = $(this).find('.number').text().trim(); // Get the selected patient's number

        const selectedPatient = selectedName + ' (' + selectedNumber + ')';

        $('#select-patient').val(selectedPatient); // Set the input value to the selected patient
        $('.dropdown-content').hide(); // Hide the dropdown
        $('#closeDropdown').hide(); // Hide close button
    });

    // Event handler to toggle the dropdown on input click
    $('#select-patient').on('click', function() {
        $('.dropdown-content').toggle(); // Show/hide the dropdown on input click
    });

  function displayNoMatchFound() {
    const dropdownContent = $('#patient-dropdown');
    dropdownContent.empty(); // Clear previous content

    // Create a message for "No match found"
    const noMatchMessage = $('<div class="no-match">No match found</div>');

    // Append the message to the dropdownContent
    dropdownContent.append(noMatchMessage);

    dropdownContent.show(); // Show the "No match found" message
  }

function displayPatientsDropdown(patients) {
    const dropdownContent = $('#patient-dropdown');
    dropdownContent.empty(); // Clear previous content

    patients.forEach(function(patient) {
    const patientDiv = $('<div class="row patient-row"></div>');

    // Col 1: Circle image (You'll need to replace "patient.image" with the actual image URL)
    const imgCol = $('<div class="col-2"><img src="/images/profile.png" width="50" alt="Patient"></div>');

    // Col 2: Name and mobile number
    const infoCol = $('<div class="col-8 info-col"></div>');
    const name = $('<div class="name">' + patient.name + '</div>');
    const number = $('<div class="number">' + patient.mobileNumber + '</div>');
    infoCol.append(name, number);

    // Col 3: Right arrow icon
    const arrowCol = $('<div class="col-1 arrow-col"><i class="fa fa-chevron-right"></i></div>');

    // Combine columns
    patientDiv.append(imgCol, infoCol, arrowCol);
    dropdownContent.append(patientDiv);
    });

    // Show the dropdown
    dropdownContent.show();
    $('#closeDropdown').show(); // Show close button
    dropdownContent.addClass('below-input').show();
}


// -------------------------------------- Add New Patient Code --------------------------------------

// Show add patient form when the + Add Patient button is clicked
$('.add-patient-btn').on('click', function() {
    $('#patient-dropdown').hide();
    $('#closeDropdown').hide(); // Hide close button
    $('.add-patient-form-container').fadeIn(); // Show the form container
  });

  // Close the form when the close button is clicked
  $('.close-btn').on('click', function() {
    $('.add-patient-form-container').fadeOut(); // Hide the form container
  });

  // Handle checkbox functionality
  $('#same-as-mobile').on('change', function() {
    const primaryMobile = $('#primary-mobile').val();
    if ($(this).is(':checked')) {
      $('#whatsapp-number').val(primaryMobile); // Copy primary mobile to whatsapp number
    } else {
      $('#whatsapp-number').val(''); // Clear whatsapp number field
    }
  });

  // Enable/disable Add button based on form completion
  $('#add-patient-form').on('input', function() {
    const isValid = checkFormValidity();
    $('.add-btn').prop('disabled', !isValid);
  });

  function checkFormValidity() {
    const name = $('#patient-name').val()?.trim();
    const primaryMobile = $('#primary-mobile').val()?.trim();
    const whatsappNumber = $('#whatsapp-number').val()?.trim();
    const email = $('#email-address').val()?.trim();

    return name !== '' && primaryMobile !== '' && whatsappNumber !== '' && email !== '';
  }
  
  // Submit form 
  $('.add-btn').on('click', function(e) {
    // e.preventDefault();
    const name = $('#patient-name').val()?.trim();
    const mobileNumber = $('#primary-mobile').val()?.trim();
    const whatsappNumber = $('#whatsapp-number').val()?.trim();
    const email = $('#email-address').val()?.trim();

    const patientDetails = { name, mobileNumber, whatsappNumber, email }
    // Save patient AJAX call
    $.ajax({
        url: '/patients',
        method: 'POST',
        data: patientDetails,
        success: function(response) {

            const savedPatient = response.data;
            
            const selectedPatient = savedPatient.name + ' (' + savedPatient.mobileNumber + ')';
            // Update the input field with the added patient's name
            $('#select-patient').val(selectedPatient);

        },
        error: function(error) {
            console.error('Error saving patient:', error);
        }
    });
    // Clear input fields after submission
    $('#patient-name').val('');
    $('#primary-mobile').val('');
    $('#whatsapp-number').val('');
    $('#email-address').val('');
    // Uncheck the checkbox after submission
    $('#same-as-mobile').prop('checked', false);
    // Hide the form after successful submission
    $('.add-patient-form-container').fadeOut();
  });

  // Cancel button functionality
  $('.cancel-btn').on('click', function() {
    $('.add-patient-form-container').fadeOut(); // Hide the form on cancel
  });

});