
$(document).ready(function() {

    // Fetch practitioner record 
    $('#add-practitioner').on('change', function() {
        if (this.checked) {
            // AJAX call to fetch data
            $.ajax({
                url: '/psychiatrists', 
                method: 'GET',
                success: function(response) {
                    if (response && response.data) {
                        const practitioner = response.data[0]; 
                        const fullName = `${practitioner.name} (${practitioner.mobileNumber})`;
                        $('#practitioner-name').val(fullName).prop('disabled', false);
                        $('#practitioner-email-address').val(practitioner.email).prop('disabled', false);
                    }
                },
                error: function() {
                    console.error('Error fetching practitioner data');
                }
            });
        } else {
            // If checkbox is unchecked, clear the fields and disable them
            $('#practitioner-name, #practitioner-email-address').val('').prop('disabled', true);
        }
    });

    // Show Online Session Link input for Online session
    $('input[name="session-type"]').change(function() {
        if ($(this).val() === 'Online') {
            $('#online-session-link-field').show();
        } else {
            $('#online-session-link-field').hide();
        }
    });

    // Function to check and enable/disable the session submit button
    function checkValidity() {
        const selectPatient = $('#select-patient').val().trim();
        const sessionType = $('input[name=session-type]:checked').val();
        const onlineSessionLink = $('#online-session-link').val().trim();
        const sessionDate = $('#session-date').val().trim();
        const sessionTime = $('#session-time').val().trim();
        const practitionerName = $('#practitioner-name').val().trim();
        const practitionerEmail = $('#practitioner-email-address').val().trim();

        const isValidSelectPatient = selectPatient !== '';
        const isValidSessionType = sessionType === 'In-Person' || (sessionType === 'Online' && onlineSessionLink !== '');
        const isValidSessionDate = sessionDate !== '';
        const isValidSessionTime = sessionTime !== '';
        const isValidPractitionerName = practitionerName !== '';
        const isValidPractitionerEmail = practitionerEmail !== '';

        if (
            isValidSelectPatient &&
            isValidSessionType &&
            isValidSessionDate &&
            isValidSessionTime &&
            isValidPractitionerName &&
            isValidPractitionerEmail
        ) {
            $('.add-session-btn').prop('disabled', false);
        } else {
            $('.add-session-btn').prop('disabled', true);
        }
    }

    // Event listeners for input changes
    $('#select-patient, #online-session-link, #session-date, #session-time, input:checkbox, #practitioner-name, #practitioner-email-address').on('input change click focus focusout hover', function() {
        checkValidity();
    });

    $('input[name=session-type]').on('change', function() {
        checkValidity();
        const onlineSessionField = $('#online-session-link-field');
        if ($(this).val() === 'Online') {
            onlineSessionField.show();
        } else {
            onlineSessionField.hide();
        }
    });

    // Handling form submission
    $('.add-session-btn').on('click', function() {

        const sessionData = {
            selectPatient: $('#select-patient').val(),
            sessionType: $('input[name=session-type]:checked').val(),
            sessionDate: $('#session-date').val(),
            sessionTimeSlot: $('#session-time').val(),
            practitionerName: $('#practitioner-name').val(),
            practitionerEmail: $('#practitioner-email-address').val(),
            sessionDetails: $('#session-details').val(),
            onlineSessionLink: ''
        };
    
        // Add condition to check if session type is online, then fetch online link
        if (sessionData.sessionType === 'Online') {
            sessionData.onlineSessionLink = $('#online-session-link').val();
        }
    
        // AJAX request to submit session data
        $.ajax({
            url: '/sessions', // Replace with your backend route to submit session data
            method: 'POST',
            data: sessionData,
            success: function(response) {
                // Reset the form
                $('form')[0].reset();
    
                // Disable the submit button after successful submission
                $('#add-session-btn').prop('disabled', true);
                $('#patient-name').val('');

                // Redirect to another page
                window.location.href = '/?success=Session%20added%20successfully';
            },
            error: function(error) {
                console.error('Error submitting session data:', error);
            }
        });
        
        $('.add-session-btn').prop('disabled', true);
        $('form')[0].reset();
        
    });

    $('.close-btn').on('click', ()=>{
        window.location.href = '/';
    })
});
