//Special input jquery plugin. Decorate an input type=text with a keyboard for
//special chars
(function($) {
    "use strict";
    $.fn.specialinput = function(options) {
        //setting up default values.
        $.fn.specialinput.defaults = {
            language_chars: {
                "fr-fr": {
                    "lower": [
                        'à', 'â','ç', 'è', 'é', 'ê', 'ë', 'î', 
                        'ï', 'ô', 'ù', 'û', 'ü', 'æ', 'œ'
                    ],
                    "upper": [
                        'À','Â','Ç','È','É','Ê','Ë','Î',
                        'Ï','Ô','Ù','Û','Ü','Æ','Œ'
                    ]
                }
            },
            lang: "fr-fr", //default language
            toggled: false, //keyboard not toggled by default
            toggle_persistent: false, // if this is set to true, set a cookie 
                                     // with the toggled value
            keyboard_case: 'lower', //lower case by default
            templates: { //template for the toggler and the keyboard. Don't change the classes.
                toggler: '<div class="specialinput-toggler"><span class="specialinput-toggler-icon specialinput-toggler-show"></span><span>Àé</span></div>',
                keyboard: '<div class="specialinput-keyboard"><div class="specialinput-row"><div class="specialinput-shift specialinput-button">Shift</div> <div class="specialinput-button"></div>'
            },
            global_toggler: "" //Selector for the container of the global toggler. If this is not 
                               //set it will display an toggler next to each input.
        };
        var opts = $.extend({}, $.fn.specialinput.defaults, options),
            keyboard_clicked = false;

        var toggler = $(opts.templates.toggler);
        if (opts.global_toggler !== ""){
            var toggler_container = $(opts.global_toggler);
            toggler.attr('rel', this.selector);
            toggler.click(toggleKeyboard);
            toggler_container.append(toggler);
        }

        return this.each(function() {
            //Add toggler template after each input box.
            if (opts.global_toggler === ""){
                var toggler = $(opts.templates.toggler);
                toggler.attr("id", "specialinput-toggler-" + $(this).attr('id'));
                toggler.click(toggleKeyboard);
                $(this).after(toggler);
            }

            $(this).focus(onFocus);
            $(this).blur(onBlur);
        });

        //enable disable specialinput keyboard
        function toggleKeyboard(){
            // Show up/down icon
            var icon = $(this).find(".specialinput-toggler-icon");
            var hidden = 0;
            if (icon.hasClass("specialinput-toggler-show")){
                hidden = 1;
                icon.removeClass("specialinput-toggler-show").addClass("specialinput-toggler-hide");
            } else {
                hidden = 0;
                icon.removeClass("specialinput-toggler-hide").addClass("specialinput-toggler-show");
            }

            if (opts.global_toggler === ""){
                //Show/remove keyboards
                var keyboards = $(this).siblings('.specialinput-keyboard');
                if (keyboards.length > 0) {
                    keyboards.remove();
                } else {
                    var toggler = $(this);
                    var input_id = toggler.attr("id").split("specialinput-toggler-")[1];
                    showKeyboard(toggler, input_id);
                }
            } else {

            }
            
            // if it's persistent we should remember the choice for future pages.
            if (opts.toggle_persistent){
                createCookie("specialinput-toggler-hidden", hidden)
            }
        }

        //when the input is focused display the keyboard if it's toggled
        function onFocus(){
            // if keyboard is disabled don't show the keyboard.
            if (opts.toggle_persistent && readCookie("specialinput-toggler-hidden") == "1") {
                return;
            }
            if (opts.global_toggler === ""){
                var toggler = $(this).siblings(".specialinput-toggler");
                var input_id = toggler.attr("id").split("specialinput-toggler-")[1];
                showKeyboard(toggler, input_id);
            } else { // this is using a global toggler
                // remove all other present keyboards and keep the one which
                // is attached to this input

                var input = $(this),
                    input_id = input.attr('id');
                $(".specialinput-keyboard").each(function(){
                    if ($(this).attr("id") != "specialinput-keyboard-" + input_id ) {
                        $(this).remove();
                    }
                });
                showKeyboard(input, input_id);
            }
        }

        function onBlur(){
            $(this).delay(500).queue(function(){
                if (!keyboard_clicked){
                    var keyboards = $(this).siblings('.specialinput-keyboard');
                    keyboards.remove();
                }
                keyboard_clicked = false;
            });
        }

        function showKeyboard(after_elem, input_id){
            //Add keyboard after toggler.
            var keyboard = $(opts.templates.keyboard);
            keyboard.attr("id", "specialinput-keyboard-" + input_id);

            var row = keyboard.find('.specialinput-row');
            keyboard.click(function(){
                keyboard_clicked = true;
            });
            row.find(".specialinput-button").each(function(){
                var button = $(this);
                if (button.hasClass('specialinput-shift')){
                    button.addClass('specialinput-shift-' + opts.keyboard_case);
                    button.click(toggleCase);
                } else {
                    populateKeyboard(button, row);
                }
            });
            after_elem.after(keyboard);
        }

        function buttonClicked(){
            var self = $(this),
                new_value = self.html(),
                input_id = self.parents(".specialinput-keyboard").attr("id").split("specialinput-keyboard-")[1],
                input = $("#" + input_id);
            input.val(input.val() + new_value);
            input.focus();
        }

        // Lower or uper case keyboard.
        function toggleCase(){
            if ($(this).hasClass("specialinput-shift-upper")) {
                $(this).removeClass("specialinput-shift-upper").addClass("specialinput-shift-lower");
                opts.keyboard_case = 'lower';
            } else {
                $(this).removeClass("specialinput-shift-lower").addClass("specialinput-shift-upper");
                opts.keyboard_case = 'upper';
            }
            //get one button and remove the rest
            var buttons = $(this).siblings();
            var button = $(buttons[0]),
                container = $(this).parent();
            for (var i=1; i<buttons.length; i++){
                $(buttons[i]).remove();
            }
            populateKeyboard(button, container);
        }

        // Add keyboard keys
        function populateKeyboard(button, container) {
            var chars = opts.language_chars[opts.lang][opts.keyboard_case];
            for (var i=0; i < chars.length; i++){
                var new_button = button.clone();
                new_button.html(chars[i]);
                new_button.click(buttonClicked);
                container.append(new_button);
            }
            button.remove();
        }

        // Cookie manipulation.
        function createCookie(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        }

        function readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }

        function eraseCookie(name) {
            createCookie(name,"",-1);
        }
    };
})(jQuery);
