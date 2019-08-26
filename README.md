# jQuery-inDate

**jQuery** plugin that force an input (type text) to reicive a DATE value **DD/MM/YYYY** (day/month/year). Nothing else. Easy to use, and user-friendly. Simply fill the form with the num keypad.

I know, it already exists <input type="date">, but the date-format is mm-dd-yyyy and you can't change it. Me I need dd-mm-yyyy.
It also already exists a lot of very good datePicker pluggins, but most of them are used with the mouse and show a calendar, and i wanted something really simple for <forms>, editable only with keyboards.


online-example : http://clamart-natation.com/inDate/

Please consider the following html :

    <input type="text" value="" id="foo">

To force theses inputs to receive a DD/MM/YYYY value, just insert :

    <script type="text/javascript" src="script-inDate.js"></script>
    <script type="text/javascript">
        var inputDate = $("#foo").inputDate();
        // or (with all options)
        var inputDate = $("#foo").inputDate({
                placeholder	: "jj/mm/aaaa",
                dateMin	: "12/03/1800",
                dateMax	: "01/12/2014"
        });
    </script>
for a quick explaination,

    placeholder   : text printed as default on the input
    dateMin : date minimale possible. if not setted, the script takes today-100 years
    dateMax : date maximale possible. if not setted, the script takes today

once the plugin is launched, at any moment you can access all basic input metods. Note that if you use

    inputDate.val("32/02/2019");

No test will be run to check if the value is correct. To make sure the date is correct, you need to add

    inputDate.checkDate();


This plugin authorise few separators (your can write 01/01/2000 or 01.01.2000 or 01 01 2000 or 01-01-2000 etc.). You can add/remove separators by editing the js file and look for the line with

	    listeSeparators.push(["/",47,191]);

This add the separator "/", with the event.keyCode (onKeyPress) = 47 and event.keyCode (onKeyUp) = 191
(check http://www.asquare.net/javascript/tests/KeyCode.html for values)

The plugin is dealing with the text of the input. You can't write letters. Only separators and numbers. Please also note than the .CSS file is loaded in the script you can modify the link inside (but loading the CSS file normaly is working too !)


### Known issue :

Once tipping a date, people like to enter 31/12/85. The year is here with 2-digits, but the pluggin forces to be 4-digits, he will convert "85" to "1985".

Now, Let's say we have the date "12/04/1956" in the <input>. The user wants to change to "12/04/1856" (100 years before). He will just select the "9" of the year and change it into "8" and press enter. The pluggin will see that the cursor is after the second digit of the year, and deduce that the user wanted to enter a year with 2 digits. He will naturally extract the "18" of the date (2 first digits) and add "19" (of 1900) before, changing "1856" into "1918". To get 1856, the user will have to type the full year.


### Ideas of upgrade :

 - check if the default dateMin is lower than dateMax


Any comments or suggestions are welcome !
Cheers
