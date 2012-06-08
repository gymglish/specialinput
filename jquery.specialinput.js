//Special input jquery plugin. Decorate an input type=text with a keyboard for
//special chars
(function($) {
    $.fn.specialinput = function(options) {
        var opts = $.extend({}, $.fn.specialinput.defaults, options);

        return this.each(function() {
            this.
        });

        // Lower or uper case keyboard.
        function toggleCase(){
        
        }

        //enable disable specialinput keyboard
        function toggleKeyboard(){

        }

        //when the input is focused display the keyboard if it's toggled
        function onFocus(){
        
        }

        //setting up default values.
        $fn.specialinput.defaults = {
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
            lang: "fr", //default language
            toggled: true //toggled by default
            toggle-persistent: false // if this is set to true, set a cookie 
                                     // with the toggled value
        }
    }
})(jQuery);
