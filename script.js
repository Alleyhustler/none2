$(document).ready(function() {
    // Handle image upload
    $('#upload').on('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            $('#overlay-image').attr('src', e.target.result);
            $('#overlay-image').show();
            // Set initial size and position
            $('#overlay-image').css({
                width: '100px',
                height: '100px',
                top: '0px',
                left: '0px'
            });
        }

        reader.readAsDataURL(file);
    });

    // Make overlay image draggable
    $('#overlay-image').on('mousedown', function(e) {
        let offsetX = e.offsetX;
        let offsetY = e.offsetY;
        let startX = e.pageX;
        let startY = e.pageY;

        $(document).on('mousemove', function(e) {
            let dx = e.pageX - startX;
            let dy = e.pageY - startY;
            startX = e.pageX;
            startY = e.pageY;

            let newLeft = Math.min(Math.max(0, parseFloat($('#overlay-image').css('left')) + dx), $('#canvas-container').width() - $('#overlay-image').width());
            let newTop = Math.min(Math.max(0, parseFloat($('#overlay-image').css('top')) + dy), $('#canvas-container').height() - $('#overlay-image').height());

            $('#overlay-image').css({
                left: newLeft + 'px',
                top: newTop + 'px'
            });
        });

        $(document).on('mouseup', function() {
            $(document).off('mousemove');
        });
    });

    // Save the combined image
    $('#save-btn').on('click', function() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const backgroundImage = $('#background-image')[0];
        const overlayImage = $('#overlay-image')[0];

        // Ensure canvas dimensions match the background image
        canvas.width = backgroundImage.naturalWidth;
        canvas.height = backgroundImage.naturalHeight;

        // Scale the background image to fit the canvas
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        // Get position and size of the overlay image
        const overlayWidth = parseFloat($('#overlay-image').width());
        const overlayHeight = parseFloat($('#overlay-image').height());
        const overlayLeft = parseFloat($('#overlay-image').css('left'));
        const overlayTop = parseFloat($('#overlay-image').css('top'));

        // Draw the overlay image
        context.drawImage(overlayImage, overlayLeft, overlayTop, overlayWidth, overlayHeight);

        // Convert canvas to image file and save
        canvas.toBlob(function(blob) {
            saveAs(blob, 'image.png');
        });
    });
});
