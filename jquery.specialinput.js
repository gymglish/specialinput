//Special input jquery plugin. Decorate an input type=text with a keyboard for
//special chars
(function($) {
    'use strict';
    $.fn.specialinput = function(options) {
        //setting up default values.
        $.fn.specialinput.defaults = {
            language_chars: {
                'fr-fr': {
                    'lower': [
                        'à', 'â', 'ç', 'è', 'é', 'ê', 'ë', 'î',
                        'ï', 'ô', 'ù', 'û', 'ü', 'æ', 'œ'
                    ],
                    'upper': [
                        'À', 'Â', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Î',
                        'Ï', 'Ô', 'Ù', 'Û', 'Ü', 'Æ', 'Œ'
                    ]
                }
            },
            lang: 'fr-fr', //default language
            toggled: false, //keyboard not toggled by default
            toggle_persistent: false, // if this is set to true, set a cookie
                                     // with the toggled value
            keyboard_case: 'lower', //lower case by default
            templates: { //template for the toggler and the keyboard. Don't change the classes.
                toggler: '<div class="specialinput-toggler"><span class="specialinput-toggler-icon specialinput-toggler-show"></span><span>à ê ç</span></div>',
                keyboard: '<div class="specialinput-keyboard"><div class="specialinput-row"><div class="specialinput-shift specialinput-button">Shift</div> <div class="specialinput-button"></div>'
            },
            global_toggler: '', //Selector for the container of the global toggler. If this is not
                                //set it will display an toggler next to each input.
            keyboard_fix_position: false // If not in a position: relative element, set this to true.
        };
        var opts = $.extend({}, $.fn.specialinput.defaults, options),
            keyboard_clicked = false;

        var selections = {}; // wath the selection position for the input
        
        var toggler = $(opts.templates.toggler);
        if (opts.toggle_persistent && readCookie('specialinput-toggler-hidden') == '1') {
            toggler.find('.specialinput-toggler-icon').removeClass('specialinput-toggler-show').addClass('specialinput-toggler-hide');
        }
        if (opts.global_toggler !== '') {
            var toggler_container = $(opts.global_toggler);
            toggler.attr('rel', this.selector);
            toggler.click(toggleKeyboard);
            toggler_container.append(toggler);
        }

        return this.each(function() {
            //Add toggler template after each input box.
            if (opts.global_toggler === '') {
                var toggler = $(opts.templates.toggler);
                toggler.attr('id', 'specialinput-toggler-' + $(this).attr('id'));
                toggler.click(toggleKeyboard);
                $(this).after(toggler);
            }

            $(this).focus(onFocus);
            $(this).blur(onBlur);
            $(this).keyup(onKeyUp);
            $(this).click(onClick)
        });

        function getInputSelection(el) {
            var start = 0, end = 0, normalizedValue, range,
                textInputRange, len, endRange;

            if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
                start = el.selectionStart;
                end = el.selectionEnd;
            } else {
                range = document.selection.createRange();

                if (range && range.parentElement() == el) {
                    len = el.value.length;
                    normalizedValue = el.value.replace(/\r\n/g, "\n");

                    // Create a working TextRange that lives only in the input
                    textInputRange = el.createTextRange();
                    textInputRange.moveToBookmark(range.getBookmark());

                    // Check if the start and end of the selection are at the very end
                    // of the input, since moveStart/moveEnd doesn't return what we want
                    // in those cases
                    endRange = el.createTextRange();
                    endRange.collapse(false);

                    if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                        start = end = len;
                    } else {
                        start = -textInputRange.moveStart("character", -len);
                        start += normalizedValue.slice(0, start).split("\n").length - 1;

                        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                            end = len;
                        } else {
                            end = -textInputRange.moveEnd("character", -len);
                            end += normalizedValue.slice(0, end).split("\n").length - 1;
                        }
                    }
                }
            }

            return start;
        }

        function onKeyUp(){
            selections[$(this).attr('id')] = getInputSelection(this);
        }

        function onClick(){
            selections[$(this).attr('id')] = getInputSelection(this);
        }

        //enable disable specialinput keyboard
        function toggleKeyboard() {
            // Show up/down icon
            var icon = $(this).find('.specialinput-toggler-icon');
            var hidden = 0;
            if (icon.hasClass('specialinput-toggler-show')) {
                hidden = 1;
                $('.specialinput-toggler-icon')
                    .removeClass('specialinput-toggler-show')
                    .addClass('specialinput-toggler-hide');
            } else {
                hidden = 0;
                $('.specialinput-toggler-icon')
                    .removeClass('specialinput-toggler-hide')
                    .addClass('specialinput-toggler-show');
            }

            if (opts.global_toggler === '') {
                //Show/remove keyboards
                var keyboards = $(this).siblings('.specialinput-keyboard');
                if (keyboards.length > 0) {
                    keyboards.remove();
                } else {
                    var toggler = $(this);
                    var input_id = toggler.attr('id').split('specialinput-toggler-')[1];
                    showKeyboard(input_id);
                }
            } else {
                if (hidden) {
                    $('.specialinput-keyboard').remove();
                }
            }

            // if it's persistent we should remember the choice for future pages.
            if (opts.toggle_persistent) {
                createCookie('specialinput-toggler-hidden', hidden, 360);
            }
        }

        //when the input is focused display the keyboard if it's toggled
        function onFocus() {
            // if keyboard is disabled don't show the keyboard.
            if (opts.toggle_persistent && readCookie('specialinput-toggler-hidden') == '1') {
                return;
            }
            var input_id;
            if (opts.global_toggler === '') {
                var toggler = $(this).siblings('.specialinput-toggler');
                input_id = toggler.attr('id').split('specialinput-toggler-')[1];
                showKeyboard(input_id);
            } else { // this is using a global toggler
                // remove all other present keyboards and keep the one which
                // is attached to this input

                var input = $(this);
                input_id = input.attr('id');
                $('.specialinput-keyboard').each(function() {
                    if ($(this).attr('id') != 'specialinput-keyboard-' + input_id) {
                        $(this).remove();
                    }
                });
                showKeyboard(input_id);
            }
        }

        function onBlur() {
            var self = $(this);
            setTimeout(function() {
                if (!keyboard_clicked) {
                    $('#specialinput-keyboard-' + self.attr('id')).remove();
                }
                keyboard_clicked = false;
            }, 300);
        }

        function adjustKeyboardPosition(input, keyboard) {
            // Fix the distance of the keyboard
            // since the keyboard will be a <body> child, we need to set the
            // absolute position based on the target input.
            var inputOffset = input.offset();
            var offsetX = input.data('specialinput-offsetX') || 0;

            // the top must be the same as the target input + the input height
            keyboard.css('top',inputOffset.top + input.height());

            // the left must be the same as the target input
            // since we would like to place the keyboard "arrow" just below the input, we need to
            // subtract 15% of the keyabord's width(where the arrow is) and since we
            // would like to place the arrow in the middle of the input, we need to
            // sum the input width divided by 2
            keyboard.css('left', inputOffset.left + offsetX - (keyboard.width() * 0.15) + (input.width() / 2));
        }

        function showKeyboard(input_id) {
            //Add keyboard after toggler.
            var keyboard = $(opts.templates.keyboard);
            var keyboard_id = 'specialinput-keyboard-' + input_id;

            var existent_keyboard = $('#' + keyboard_id);
            if (existent_keyboard.length > 0) {
                return;
            }
            keyboard.attr('id', keyboard_id);


            var row = keyboard.find('.specialinput-row');
            keyboard.click(function() {
                keyboard_clicked = true;
            });
            row.find('.specialinput-button').each(function() {
                var button = $(this);
                if (button.hasClass('specialinput-shift')) {
                    if (opts.keyboard_case == 'lower') {
                        // display the uppercase button
                        button.addClass('specialinput-shift-upper');
                    } else {
                        button.addClass('specialinput-shift-lower');
                    }
                    button.click(toggleCase);
                } else {
                    populateKeyboard(button, row);
                }
            });

            var $input = $('#' + input_id);
            $input.data('keyboard', keyboard);
            $('body').append(keyboard);
            adjustKeyboardPosition($input, keyboard);
        }


        function buttonClicked() {
            var self = $(this),
                new_value = self.html(),
                input_id = self.parents('.specialinput-keyboard').attr('id').split('specialinput-keyboard-')[1],
                input = $('#' + input_id),
                e = $.Event('beforechange.specialinput');
            input.trigger(e);
            if (!e.isDefaultPrevented()) {
                var maxlength = input.attr('maxlength');
                if (!maxlength || input.val().length < maxlength) {
                    e = $.Event('change.specialinput', {specialinput: self});
                    var inputVal = input.val();
                    var selectionStart = selections[input_id];
                    var res = "";

                    if (typeof selectionStart === 'number'){
                        var chars = inputVal.split("");
                        chars.splice(selectionStart, 0, new_value);
                        res = chars.join("");
                        selections[input_id] = res.length;
                    } else {
                        res = inputVal + new_value;
                    }

                    input.val(res).trigger(e);
                    if (!e.isDefaultPrevented()) {
                        input.focus();
                    }
                }
            }
        }

        // Lower or uper case keyboard.
        function toggleCase() {
            // Clicked on the upper case
            if ($(this).hasClass('specialinput-shift-upper')) {
                $(this).removeClass('specialinput-shift-upper').addClass('specialinput-shift-lower');
                opts.keyboard_case = 'upper';
            } else {
                $(this).removeClass('specialinput-shift-lower').addClass('specialinput-shift-upper');
                opts.keyboard_case = 'lower';
            }
            //get one button and remove the rest
            var buttons = $(this).siblings();
            var button = $(buttons[0]),
                container = $(this).parent();
            for (var i = 1; i < buttons.length; i++) {
                $(buttons[i]).remove();
            }
            populateKeyboard(button, container);
        }

        // Add keyboard keys
        function populateKeyboard(button, container) {
            var chars = opts.language_chars[opts.lang][opts.keyboard_case];
            for (var i = 0; i < chars.length; i++) {
                var new_button = button.clone();
                new_button.html(chars[i]);
                new_button.click(buttonClicked);
                container.append(new_button);
            }
            container.append($("<div class='specialinput-close'>").click(function() {
                $(this).parents('.specialinput-keyboard').remove();
            }));
            button.remove();
        }

        // Cookie manipulation.
        function createCookie(name, value, days) {
            var expires;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires='+ date.toGMTString();
            }
            else expires = '';
            document.cookie = name + '='+ value + expires + '; path=/';
        }

        function readCookie(name) {
            var nameEQ = name + '=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function eraseCookie(name) {
            createCookie(name, '', -1);
        }
    };
})(jQuery);
