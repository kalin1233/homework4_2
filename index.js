/*
File: index.js
GUI Assignment: Creating an Interactive Dynamic Table
Kalin Toussaint, UMass Lowell Computer Science, Kalin_Toussaint@student.uml.edu
Copyright (c) 2024 by Kalin. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by KT on June 17, 2024
*/

$(document).ready(function () {
    // Initialize jQuery UI tabs
    $("#tabs").tabs();

    let tabCounter = 1;

    // Function to initialize form validation and handle submission
    function initializeFormValidation(formSelector, tabId) {
        $(formSelector).validate({
            rules: {
                'start-horizontal': {
                    required: true,
                    number: true,
                    range: [-50, 50]
                },
                'end-horizontal': {
                    required: true,
                    number: true,
                    range: [-50, 50]
                },
                'start-vertical': {
                    required: true,
                    number: true,
                    range: [-50, 50]
                },
                'end-vertical': {
                    required: true,
                    number: true,
                    range: [-50, 50]
                }
            },
            messages: {
                'start-horizontal': {
                    required: "Please enter a start horizontal number.",
                    number: "Please enter a valid number. Text is not allowed.",
                    range: "The start horizontal number must be between -50 and 50."
                },
                'end-horizontal': {
                    required: "Please enter an end horizontal number.",
                    number: "Please enter a valid number. Text is not allowed.",
                    range: "The end horizontal number must be between -50 and 50."
                },
                'start-vertical': {
                    required: "Please enter a start vertical number.",
                    number: "Please enter a valid number. Text is not allowed.",
                    range: "The start vertical number must be between -50 and 50."
                },
                'end-vertical': {
                    required: "Please enter an end vertical number.",
                    number: "Please enter a valid number. Text is not allowed.",
                    range: "The end vertical number must be between -50 and 50."
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            submitHandler: function (form) {
                event.preventDefault();

                // Get the input values
                const startHorizontal = parseInt($(form).find('input[name="start-horizontal"]').val());
                const endHorizontal = parseInt($(form).find('input[name="end-horizontal"]').val());
                const startVertical = parseInt($(form).find('input[name="start-vertical"]').val());
                const endVertical = parseInt($(form).find('input[name="end-vertical"]').val());

                // Validate the input values
                const errorMessage = validateInputs(startHorizontal, endHorizontal, startVertical, endVertical);

                if (errorMessage) {
                    alert(errorMessage);
                    return;
                }

                // Generate the multiplication table
                generateTable(startHorizontal, endHorizontal, startVertical, endVertical, `#${tabId}`);
            }
        });
    }

    function validateInputs(startH, endH, startV, endV) {
        if (isNaN(startH) || isNaN(endH) || isNaN(startV) || isNaN(endV)) {
            return "All inputs must be valid numbers.";
        }

        if (startH > endH) {
            return "The Start Horizontal number must be less than or equal to the End Horizontal number. Please enter a Start Horizontal number that is less than or equal to the End Horizontal number.";
        }

        if (startV > endV) {
            return "The Start Vertical number must be less than or equal to the End Vertical number. Please enter a Start Vertical number that is less than or equal to the End Vertical number.";
        }

        return null;
    }

    function generateTable(startH, endH, startV, endV, tabId) {
        let table = '<table>';
        table += '<tr><th></th>';

        // Generate header row
        for (let h = startH; h <= endH; h++) {
            table += `<th>${h}</th>`;
        }
        table += '</tr>';

        // Generate the table rows
        for (let v = startV; v <= endV; v++) {
            table += `<tr><th>${v}</th>`;
            for (let h = startH; h <= endH; h++) {
                table += `<td>${h * v}</td>`;
            }
            table += '</tr>';
        }
        table += '</table>';

        // Insert the table into the specified tab
        $(tabId).html('<div class="table-container">' + table + '</div>');
    }

    function initializeSlider(sliderSelector, inputSelector) {
        $(sliderSelector).slider({
            min: -50,
            max: 50,
            slide: function (event, ui) {
                $(inputSelector).val(ui.value);
                $(inputSelector).trigger('change');
            }
        });

        $(inputSelector).on('input change', function () {
            $(sliderSelector).slider('value', $(this).val());
        });
    }

    function createInputTab() {
        tabCounter++;
        const tabId = `tab-${tabCounter}`;
        const tabTitle = `Input ${tabCounter}`;

        const inputForm = `
            <div class="form-container">
                <form class="multiplication-form" data-tab-id="${tabId}">
                    <label for="start-horizontal-${tabCounter}">Start Horizontal Numbers:</label>
                    <input type="text" id="start-horizontal-${tabCounter}" name="start-horizontal" placeholder="Enter a number from -50 to 50" required>
                    <div id="slider-start-horizontal-${tabCounter}"></div>

                    <label for="end-horizontal-${tabCounter}">End Horizontal Numbers:</label>
                    <input type="text" id="end-horizontal-${tabCounter}" name="end-horizontal" placeholder="Enter a number from -50 to 50" required>
                    <div id="slider-end-horizontal-${tabCounter}"></div>

                    <label for="start-vertical-${tabCounter}">Start Vertical Numbers:</label>
                    <input type="text" id="start-vertical-${tabCounter}" name="start-vertical" placeholder="Enter a number from -50 to 50" required>
                    <div id="slider-start-vertical-${tabCounter}"></div>

                    <label for="end-vertical-${tabCounter}">End Vertical Numbers:</label>
                    <input type="text" id="end-vertical-${tabCounter}" name="end-vertical" placeholder="Enter a number from -50 to 50" required>
                    <div id="slider-end-vertical-${tabCounter}"></div>

                    <button type="submit" class="generate-table">Generate Table</button>
                    <button type="button" class="delete-tab">Delete Tab</button>
                    <input type="checkbox" class="select-tab" data-tab-id="${tabId}"> Select
                </form>
            </div>
        `;

        $("#tabs ul").append(`<li><a href="#${tabId}">${tabTitle}</a></li>`);
        $("#tabs").append(`<div id="${tabId}">${inputForm}</div>`);
        $("#tabs").tabs("refresh");
        $("#tabs").tabs("option", "active", -1);

        initializeSlider(`#slider-start-horizontal-${tabCounter}`, `#start-horizontal-${tabCounter}`);
        initializeSlider(`#slider-end-horizontal-${tabCounter}`, `#end-horizontal-${tabCounter}`);
        initializeSlider(`#slider-start-vertical-${tabCounter}`, `#start-vertical-${tabCounter}`);
        initializeSlider(`#slider-end-vertical-${tabCounter}`, `#end-vertical-${tabCounter}`);

        initializeFormValidation(`form[data-tab-id="${tabId}"]`, tabId);
    }

    function deleteTab(tabId) {
        $(`#tabs ul li a[href='#${tabId}']`).closest('li').remove();
        $(`#${tabId}`).remove();
        $("#tabs").tabs("refresh");
    }

    $('#create-new-tab').click(function () {
        createInputTab();
    });

    // Event delegation for dynamically created delete buttons
    $(document).on('click', '.delete-tab', function () {
        const tabId = $(this).closest('form').data('tab-id');
        deleteTab(tabId);
    });

    $('#delete-selected-tabs').click(function () {
        $('input.select-tab:checked').each(function () {
            const tabId = $(this).data('tab-id');
            deleteTab(tabId);
        });
    });

    // Handle form submission using event delegation for dynamically created forms
    $(document).on('submit', '.multiplication-form', function (event) {
        event.preventDefault();

        const form = this;
        const tabId = $(form).data('tab-id');

        // Get the input values
        const startHorizontal = parseInt($(form).find('input[name="start-horizontal"]').val());
        const endHorizontal = parseInt($(form).find('input[name="end-horizontal"]').val());
        const startVertical = parseInt($(form).find('input[name="start-vertical"]').val());
        const endVertical = parseInt($(form).find('input[name="end-vertical"]').val());

        // Validate the input values
        const errorMessage = validateInputs(startHorizontal, endHorizontal, startVertical, endVertical);

        if (errorMessage) {
            alert(errorMessage);
            return;
        }

        // Generate the multiplication table
        generateTable(startHorizontal, endHorizontal, startVertical, endVertical, `#${tabId}`);
    });

    // Initialize the default form and sliders in the first tab
    initializeSlider('#slider-start-horizontal', '#start-horizontal');
    initializeSlider('#slider-end-horizontal', '#end-horizontal');
    initializeSlider('#slider-start-vertical', '#start-vertical');
    initializeSlider('#slider-end-vertical', '#end-vertical');
    initializeFormValidation('#multiplication-form', 'tab-form');
});
