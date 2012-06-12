$(document).ready(function(){
    QUnit.test("existence of plugin", function() {
        var value = "function";
        equal(typeof $("").specialinput, value, "Expected " + value );
    });

    QUnit.test("no toggler expected at this point", function() {
        equal($(".specialinput-toggler").length, 0, "Expected 0");
    });

    QUnit.test("load plugin", function() {
        $("#text-input").specialinput();

        var toggler = $(".specialinput-toggler");
        equal(toggler.length, 1, "Expected 1");
        var expected_id = "specialinput-toggler-text-input";
        equal(toggler.attr("id"), expected_id, "Expected " + expected_id);
    });

    QUnit.test("keyboard should be displayed on focus", function(){
        $("#text-input").specialinput();
        $("#text-input").focus();
        // when the input is focused the keyboard element is created
        keyboard_id = "specialinput-keyboard-text-input";
        equal($("#" + keyboard_id).length, 1, "Expected  1");

        //try to actually see if the keyboard is displayed
        equal($("#" + keyboard_id).css("display"), "block", 
            "Expected block");
    });

    QUnit.test("keyboard should be displayed when toggler is clicked", function(){
        $("#text-input").specialinput();
        $("#specialinput-toggler-text-input").click();

        // when the toggler is clicked the keyboard element is created
        keyboard_id = "specialinput-keyboard-text-input";
        equal($("#" + keyboard_id).length, 1, "Expected  1");
    });

    QUnit.test("click on a key on the keyboard", function(){
        expect(2);
        $("#text-input").specialinput();

        // display the keyboard
        $("#specialinput-toggler-text-input").click();

        var initial_value = $("#text-input").val();
        equal(initial_value, "", "Expected an empty input");

        var test_char = "à";
        $("#specialinput-keyboard-text-input .specialinput-button").each(function(){
            if ($(this).html() == test_char){
                $(this).click();
                equal($("#text-input").val(), test_char, 
                    "Expected " + test_char);
                return;
            }
        });
    });

    QUnit.test("plugin different language", function(){
        expect(2);

        $("#text-input").specialinput({
            language_chars: {
                "ro-ro": {
                    "lower": ['ă', 'â', 'î', 'ț', 'ș'],
                    "upper": ['Ă', 'Â', 'Î', 'Ț', 'Ș']
                }
            },
            lang: "ro-ro"
        });
        // display the keyboard
        $("#specialinput-toggler-text-input").click();

        var initial_value = $("#text-input").val();
        equal(initial_value, "", "Expected an empty input");

        var test_char = "ă";
        $("#specialinput-keyboard-text-input .specialinput-button").each(function(){
            if ($(this).html() == test_char){
                $(this).click();
                equal($("#text-input").val(), test_char, 
                    "Expected " + test_char);
                return;
            }
        });
    });

    QUnit.test("clicking shift key", function(){
        $("#text-input").specialinput();
        // display the keyboard
        $("#specialinput-toggler-text-input").click();
        var initial_keys = [];
        $("#specialinput-keyboard-text-input .specialinput-button").each(function(){
            if(!$(this).hasClass('specialinput-shift')){
                initial_keys.push($(this).html());
            }
        });
        var expected_keys = initial_keys.map(function(c){return c.toUpperCase()});
        var result_keys = [];
        $("#specialinput-keyboard-text-input .specialinput-shift").click();
        $("#specialinput-keyboard-text-input .specialinput-button").each(function(){
            if(!$(this).hasClass('specialinput-shift')){
                result_keys.push($(this).html());
            }
        });
        equal(expected_keys.toString(), result_keys.toString(),
            "Expected " + expected_keys + " got " + result_keys);
    });
});

