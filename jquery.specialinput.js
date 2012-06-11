//Special input jquery plugin. Decorate an input type=text with a keyboard for
//special chars
(function($) {
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
            }
        }
        var opts = $.extend({}, $.fn.specialinput.defaults, options),
            keyboard_clicked = false;

        return this.each(function() {
            //Add toggler template after each input box.
            var toggler = $(opts.templates.toggler);
            toggler.attr("id", "specialinput-toggler-" + $(this).attr('id'));
            toggler.click(toggleKeyboard);
            $(this).after(toggler);

            $(this).focus(onFocus);
            $(this).blur(onBlur);
        });

       //enable disable specialinput keyboard
        function toggleKeyboard(){
            // Show up/down icon
            var icon = $(this).find(".specialinput-toggler-icon");
            if (icon.hasClass("specialinput-toggler-show")){
                icon.removeClass("specialinput-toggler-show").addClass("specialinput-toggler-hide");
            } else {
                icon.removeClass("specialinput-toggler-hide").addClass("specialinput-toggler-show");
            }
            //Show/remove keyboards
            var keyboards = $(this).siblings('.specialinput-keyboard');
            if (keyboards.length > 0) {
                keyboards.remove();
            } else {
                showKeyboard($(this));
            }
        }

        //when the input is focused display the keyboard if it's toggled
        function onFocus(){
            showKeyboard($(this).siblings(".specialinput-toggler"));
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

        function showKeyboard(toggler){
            //Add keyboard after toggler.
            var keyboard = $(opts.templates.keyboard);
            var input_id = toggler.attr("id").split("specialinput-toggler-")[1];
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
            toggler.after(keyboard);
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
            buttons = $(this).siblings();
            var button = $(buttons[0]),
                container = $(this).parent();
            for (var i=1; i<buttons.length; i++){
                $(buttons[i]).remove();
            }
            populateKeyboard(button, container);
        }

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
    }
})(jQuery);
