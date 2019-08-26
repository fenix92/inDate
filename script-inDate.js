//<![CDATA[

	/* ============================================ INPUT DATE ============================================ *\

		plugin that create a date content. It's different from <input type="date"> because the format is DD/MM/YYYY, and it does not open any helper
		
		USE -
			to use it, considering the following html :
			<input type="text" value="26/09/1985" id="foo" name="date">

			var inputdate = $("#foo").inDate({
				placeholder:"jj/mm/aaaa",
				dateMin:"12/03/1800",
				dateMax:"01/12/2014"
			});
			-or-
			var inputdate = $("#foo").inDate();
			list of available methods
			-todo-
			
		
		CREDIT -
			Sebastien Pipet (https://www.facebook.com/sebastien.pipet)
		VERSION -
			0.1
		DISCLAIMER -
			All this code is free : you can use, redistribute and/or modify it without any consentement.
			Please just leave my name on it ;-)
		DEFAULT VALUES -
			you can customise the defaults values below :

	/* ========================================= DEFAULT VALUES ============================================ */

	var	linkCSS = "inputdate.css";			// link of the attached CSS file
	var	listeSeparators = [];			// list of the separators.
	// below are the authorised separators : the char + the keyCode + keyUp associated. Note also that order matter : only the firt one will be displayed.
	listeSeparators.push(['/',47,191]);
	listeSeparators.push(['-',45,173]);
	listeSeparators.push([' ',32,32]);
	listeSeparators.push(['.',46,190]);
	var	dateMinDefault = '01'+listeSeparators[0][0]+'01'+listeSeparators[0][0]+(new Date().getFullYear()-100);	// date minimale possible
	var	dateMaxDefault = (new Date()).getDate()+listeSeparators[0][0]+((new Date()).getMonth()+1)+listeSeparators[0][0]+(new Date().getFullYear());	// date of today
	var	titleDefault = "dd"+listeSeparators[0][0]+"mm"+listeSeparators[0][0]+"yyyy";	// date format

	/* =================================================================================================== */


// define the sprintf function
if(typeof sprintf != 'function'){
	window.sprintf = function(i,nbrIntMin){
		var output = i + '';
		while (output.length < nbrIntMin) {
			output = '0' + output;
		}
		return output;
	}

}

(function ( $ ) {

	// loading CSS file
	if(!document.getElementById("inputeDateCSS")){
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.id   = "inputeDateCSS";
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = linkCSS;
		link.media = 'all';
		head.appendChild(link);
	}
	// loading all occurs of the plugin into an object
	var listInputDate = {};

	$.fn.inDate = function(params) {

		// if multiple elements, we split them. Only once they are "alone", we keep doing further
		if (this.length > 1){
			this.each(function() { $(this).inputDate(params) });
			return this;
		}


		// ================= PRIVATE PROPERTIES =================


		var inputDate = this;

		// customizable parameters available, with the default values
		params = $.extend({
                        separator : listeSeparators,
                        placeholder : titleDefault,
			dateMin : dateMinDefault,
			dateMax : dateMaxDefault
		}, params);

		var	focusOnDay	 = false,
			focusOnMonth	 = false,
			focusOnYear	 = false,
			inputHasFocus	 = false,
			separator	 = params.separator,
			defaultValue	 = dateMaxDefault,		// default value
			title		 = params.placeholder,		// default title
			dateMin		 = params.dateMin,
			dateMax		 = params.dateMax,
			currentValue	 = '',
			beforeKeyPressedValue	 = [],			// array of the last updated/checked value of the input

			iname;						// name of the (unique) class of the item (= ID)


		// ================= PUBLIC PROPERTIES =================


		inputDate.credit = 'sebastien pipet';


		// ================= PRIVATE FUNCTIONS =================


		// init the plugin : instanciation
		var ID_intialize = function() {
			// we create a custom ID (wich is actually a (unique) class)
			counter = ID_countItems();
			iname = "inputDate_input_"+counter;
			inputDate.addClass(iname);

			// the plugin HAS TO BE used on input (of text type). We first check it.
			if(! $("."+iname).is('input:text') ){
				console.log("inputDate plugin : fail, it has to be used on a input of type text.");
				return false;
			}else{
				// we store the element into the inputDateList
				listInputDate[counter] = inputDate;
				
				// on veut l'input avec un name si ce n'est pas deja le cas
				if (typeof inputDate.attr('name') === "undefined") {
					inputDate.attr('name','date');
				}
				inputDate.attr('data-min',dateMin)
					.attr('data-max',dateMax)
					.attr('autocomplete', 'off')
					.attr('title', title)
					.attr('placeholder', title);

				// the value of it HAS TO BE "DD/MM/YYYY"
				currentValue = ID_getValue();
				currentValue = ID_checkValue(currentValue[0],currentValue[1],currentValue[2]);
				d = currentValue[0];
				m = currentValue[1];
				y = currentValue[2];
				// on update la valeur
				ID_setValue(d,m,y);

				return inputDate;
			}
		};
		// function that counts the number of items (for old browsers)
		var ID_countItems = function() {
			var count = 0;
			for (var i in listInputDate) {
				if (listInputDate.hasOwnProperty(i)) {
					count++;
				}
			}
			return count;
		};		// we get the value
		// fonction to get a value from the input
		var ID_getValue = function() {
			// on recupere la valeur
			var v = inputDate[0].value;
			var d,m,y;
			// lors le la regex sur la lecture, on peut avoir plusieurs separateurs. on construit le modele regex pour les reconnaitre
			var separatoRegex = ID_arraySeparators();
//			var reg = v.match(new RegExp('^(0?[1-9]|[12][0-9]|3[01])'+separatoRegex+'(0?[1-9]|1[012])'+separatoRegex+'([1-9][0-9]([0-9]{2})?)$'));
			var reg = v.match(new RegExp('^([0-9]*)'+separatoRegex+'([0-9]*)'+separatoRegex+'([0-9]*)$'));
			if(reg){
				// on retourne au propre les valeurs -
				d = reg[1];
				m = reg[2];
				y = reg[3];
				if(y.length == 2){
					var actualYear = (new Date).getFullYear().toString().substr(-2);
					if(actualYear>=y){
						y = '20'+y;
					}else{
						y = '19'+y;
					}
				}
				return [d,m,y];
			}
			return defaultValue.split(separator[0][0]);
		};
		// fonction to set a value into the input
		var ID_setValue = function(d,m,y) {
			function pad (str, max) {
				str = str.toString();
				return str.length < max ? pad("0" + str, max) : str;
			}
			beforeKeyPressedValue = [pad(d, 2),pad(m, 2),pad(y, 4)];
			inputDate.val(pad(d, 2)+separator[0][0]+pad(m, 2)+separator[0][0]+pad(y, 4));
		}
		// fonction that check a correct value of date. If not, we set the value
		var ID_checkValue = function(d,m,y) {
			d=Math.max(1,Math.min(31,parseInt(d)));
			m=Math.max(1,Math.min(12,parseInt(m)));
			var separatoRegex = ID_arraySeparators();
			var reg = new RegExp(separatoRegex,"gi");
			var dateMinParsed = dateMin.replace(reg, separator[0][0]);
			var dateMaxParsed = dateMax.replace(reg, separator[0][0]);
			var dateMinSplitted = dateMinParsed.split(separator[0][0]);	for(var i=0; i<dateMinSplitted.length;i++) dateMinSplitted[i] = parseInt(dateMinSplitted[i], 10);
			var dateMaxSplitted = dateMaxParsed.split(separator[0][0]);	for(var i=0; i<dateMaxSplitted.length;i++) dateMaxSplitted[i] = parseInt(dateMaxSplitted[i], 10);
			// premierement, on compare les dates aux valeurs min et max :
			if(y<=parseInt(dateMinSplitted[2])){
				if(y<parseInt(dateMinSplitted[2])){
					// si l'annee est passee, on set les mois et jours direct aussi
					y = dateMinSplitted[2];
					m = dateMinSplitted[1];
					d = dateMinSplitted[0];
					inputDate.addClass("input_date_error");
				}else{
					if(m<=dateMinSplitted[1]){
						if(m<dateMinSplitted[1]){
							// si meme annee, mais mois trop ancien
							m=dateMinSplitted[1];
							d=dateMinSplitted[0];
							inputDate.addClass("input_date_error");
						}else{
							if(d<dateMinSplitted[0]){
								d=dateMinSplitted[0];
								inputDate.addClass("input_date_error");
							}
						}
					}
				}
			}
			if(y>=dateMaxSplitted[2]){
				if(y>parseInt(dateMaxSplitted[2])){
					// si l'annee nest pas encore passee, on set les mois et jours direct aussi
					y = dateMaxSplitted[2];
					m = dateMaxSplitted[1];
					d = dateMaxSplitted[0];
					inputDate.addClass("input_date_error");
				}else{
					if(m>=dateMaxSplitted[1]){
						if(m>dateMaxSplitted[1]){
							// si meme annee mais mois pas encore arrive
							m==dateMaxSplitted[1];
							d=dateMaxSplitted[0];
							inputDate.addClass("input_date_error");
						}else{
							if(d>dateMaxSplitted[0]){
								d=dateMaxSplitted[0];
								inputDate.addClass("input_date_error");
							}
						}
					}
				}
			}
			// on regarde le nombre de jours possible pour un mois donne
			var nbrDay = new Date(y, m, 0).getDate();
			if(nbrDay<d){
				d = nbrDay;
			}
			return [d,m,y];
		}
		// fonction qui fait perdre le focus
		var ID_Blur = function(isAlreadyBlur){
			var cv = ID_checkValue(beforeKeyPressedValue[0],beforeKeyPressedValue[1],beforeKeyPressedValue[2])
			ID_setValue(cv[0],cv[1],cv[2]);
			if(!isAlreadyBlur){
				inputDate.blur();
			}
		};
		// fonction qui retourne un array des separateurs possibles, pour etre utilise dans les regex
		var ID_arraySeparators = function(){
			var separatoRegex = '[';
			if(typeof separatoRegex != "undefined" && separatoRegex != null && separatoRegex.length != null && separatoRegex.length > 0){
				RegExp.escape = function(string) {
					return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
				};
				$.each(separator, function( index, value ) {
					separatoRegex = separatoRegex + RegExp.escape(value[0]);
				});
				
			}else{
				separator[0][0] = "/";
				separatoRegex += '\\'+separator[0][0];	// si pas de separateur, on force celui la.
			}
			separatoRegex+="]";
			return separatoRegex;
		};
		var ID_selectDay = function(){
			inputDate[0].setSelectionRange(0,2);
			focusOnDay	 = true,
			focusOnMonth	 = false,
			focusOnYear	 = false;
			return true;
		};
		var ID_selectMonth = function(){
			var sepL = separator[0][0].length;
			inputDate[0].setSelectionRange((2+sepL),(4+sepL));
			focusOnDay	 = false,
			focusOnMonth	 = true,
			focusOnYear	 = false;
			return true;
		};
		var ID_selectYear = function(){
			var sepL = separator[0][0].length;
			inputDate[0].setSelectionRange((4+2*sepL),(8+2*sepL));
			focusOnDay	 = false,
			focusOnMonth	 = false,
			focusOnYear	 = true;
			return true;
		};
		var ID_selectInt = function(i){
			// le i prend en compte un separateur de length 1, mais dans les calculs, on fait avec la vrai length du separateur
			//	2 6 / 0 9 / 1 9 8 5
			//	0 1 2 3 4 5 6 7 8 9
			var sepL = separator[0][0].length;
			focusOnDay	 = false,
			focusOnMonth	 = false,
			focusOnYear	 = false;
			switch(i){
				case 0:
				case 1:{	inputDate[0].setSelectionRange(i+(sepL-1)*0,i+(sepL-1)*0+1);	focusOnDay = true;	}
				case 3:
				case 4:{	inputDate[0].setSelectionRange(i+(sepL-1)*1,i+(sepL-1)*1+1);	focusOnMonth = true;	}
				case 6:
				case 7:
				case 8:
				case 9:{	inputDate[0].setSelectionRange(i+(sepL-1)*2,i+(sepL-1)*2+1);	focusOnYear = true;	}

				case 2:{	inputDate[0].setSelectionRange(i+(sepL-1)*1,i+(sepL-1)*1+1);				}
				case 5:{	inputDate[0].setSelectionRange(i+(sepL-1)*2,i+(sepL-1)*2+1);				}
			}
			return true;
		};
		


		// ================= PUBLIC FUNCTIONS =================


		// when the input get the focus, we select the day
		inputDate.focus(function() {
			ID_selectDay();
		});
		// when the input loose the focus, we select the day
		inputDate.blur(function() {
			ID_Blur(true);
		});
		inputDate.checkValue = function(){
			currentValue = ID_getValue();
			var cv = ID_checkValue(currentValue[0],currentValue[1],currentValue[2])
			ID_setValue(cv[0],cv[1],cv[2]);
		};
		// we deal with the direct entries
		inputDate.keydown(function(event){
			inputDate.removeClass("input_date_error");
			// here, we just make sure the date is with a valid syntax ie (1<day<32, 1<month<13, 1<year<9999). later will be checked if the value is valid with date min/max, february 28 days, etc.
			event = event || window.event;
			var charCode = (event.keyCode ? event.keyCode : event.which);
			var keyPressed = event.key; //	var keyPressed = String.fromCharCode(charCode);
			// first step : we get the cursor position
			selPosIn	= event.target.selectionStart;
			selPosOut	= event.target.selectionEnd;
			var isInt	= (charCode >= 48 && charCode <= 57)?true:false;
			var listSepCode = [];
			$.each(separator, function( index, value ) {
				listSepCode.push(value[0]);
			});
			var isSep	= (jQuery.inArray(keyPressed, listSepCode) != -1)?true:false;
			// car on a keyup et non keypressed, selPosIn = selPosOut
			var jour = [beforeKeyPressedValue[0][0],beforeKeyPressedValue[0][1]];
			var mois = [beforeKeyPressedValue[1][0],beforeKeyPressedValue[1][1]];
			var annee = [beforeKeyPressedValue[2][0],beforeKeyPressedValue[2][1],beforeKeyPressedValue[2][2],beforeKeyPressedValue[2][3]];
//console.log("keypressed = "+keyPressed+" ["+charCode+"], position "+selPosIn+", charCode = "+charCode+" (isInt="+isInt+" isSep="+isSep+")");
				if(	charCode==8	// backspace
				||	charCode==9	// tab
				||	charCode==13	// enter
				||	charCode==16	// shift
				||	charCode==37	// arrow left
				||	charCode==38	// arrow up
				||	charCode==39	// arrow right
				||	charCode==40	// arrow down
				||	charCode==46	// del
				){
				// all keys listed up has normal behavior
					if(charCode==9	/*tab*/ || charCode==13	/*enter*/){
						if(selPosIn==8){
							// cas particulier : si on est en position 8 (ie - on entre deux chiffres pour l'annee), on ajoute automatiquement 20 ou 19 juste avant
							var anneeEntree = parseInt(annee[0]+annee[1]+'');
							var dateToday = new Date().getFullYear().toString().substr(-2);
							if(anneeEntree>dateToday){
								ID_setValue(beforeKeyPressedValue[0],beforeKeyPressedValue[1],'19'+anneeEntree);
							}else{
								ID_setValue(beforeKeyPressedValue[0],beforeKeyPressedValue[1],'20'+anneeEntree);
							}
						}
						ID_Blur(false);
					}
					return true;
			}else{
				switch(selPosIn){
					case 0:{
						if(isInt){	// on edite le premier chiffre du jour
							if(keyPressed>3){
								// on termine automatiquement le jour.
								jour = [0,keyPressed];
								ID_setValue(keyPressed,beforeKeyPressedValue[1],beforeKeyPressedValue[2]);
								ID_selectMonth();
							}else{
								// on regarde ce que l on entre ensuite pour voir. on veut n'afficher que 2 chiffres. si il y en a 2+ on "remplace" le premier
								// on autorise jusque 31, osef le mois car il peut changer ensuite
								var j2 = (keyPressed==3)?Math.min(jour[1],1):jour[1];
								j2 = (keyPressed==0)?Math.max(j2,1):j2;
								jour = [keyPressed,j2];
								ID_setValue(jour[0]+""+jour[1],beforeKeyPressedValue[1],beforeKeyPressedValue[2]);
								// et on selectionne le second chiffre
								ID_selectInt(1);
							}
						}
						if(isSep){	// on entre direct un separateur... on prends le premier jour du mois alors...
							ID_setValue(1,beforeKeyPressedValue[1],beforeKeyPressedValue[2]);
							ID_selectMonth();
						}
					}break;
					case 1:{
						if(isInt){	// on edite le second chiffre du jour
							// on autorise jusque 31, osef le mois car il peut changer ensuite
							var j2 = (jour[0]==3)?Math.min(keyPressed,1):keyPressed;
							j2 = (jour[0]==0)?Math.max(j2,1):j2;
							jour = [jour[0],j2];
							ID_setValue(jour[0]+""+jour[1],beforeKeyPressedValue[1],beforeKeyPressedValue[2]);
							// et on selectionne les mois
							ID_selectMonth();
						}
						if(isSep){	// on entre un separateur... on prends le premier chiffre comme etant le jour
							jour[0] = Math.max(jour[0],1);
							ID_setValue(jour[0],beforeKeyPressedValue[1],beforeKeyPressedValue[2]);
							ID_selectMonth();
						}
					}break;
					case 2:
					case 3:{
						if(isInt){	// on bascule ce chiffre sur le mois.
							if(keyPressed>1){
								// on termine automatiquement le mois
								mois = [0,keyPressed];
								ID_setValue(beforeKeyPressedValue[0],keyPressed,beforeKeyPressedValue[2]);
								ID_selectYear();
							}else{
								// on regarde ce que l on entre ensuite pour voir. on veut n'afficher que 2 chiffres. si il y en a 2+ on "remplace" le premier
								// on autorise jusque 12
								var m2 = (keyPressed==1)?Math.min(mois[1],2):mois[1];
								m2 = (keyPressed==0)?Math.max(1,mois[1]):m2;
								mois = [keyPressed,m2];
								ID_setValue(beforeKeyPressedValue[0],mois[0]+""+mois[1],beforeKeyPressedValue[2]);
								// et on selectionne le second chiffre
								ID_selectInt(4);
							}
						}
						if(isSep){
							// on a groupe les int, mais on doit bien separer les cas des separateurs. si =3, on etait dans les jours->mois. Si =4, on est dans les mois-> annee
							if(selPosIn==2){
								// on  ferme les jours
								ID_setValue(beforeKeyPressedValue[0],beforeKeyPressedValue[1],beforeKeyPressedValue[2]);
								ID_selectMonth();
							}else{
								// on ferme les mois, on prends le 1er
								ID_setValue(beforeKeyPressedValue[0],1,beforeKeyPressedValue[2]);
								ID_selectYear();
							}
						}
					}break;
					case 4:{
						if(isInt){	// on edite le second chiffre du mois
							// on autorise jusque 12
							var m2 = (mois[0]==1)?Math.min(keyPressed,2):keyPressed;
							m2 = (mois[0]==0)?Math.max(m2,1):m2;
							mois = [mois[0],m2];
							ID_setValue(beforeKeyPressedValue[0],mois[0]+""+mois[1],beforeKeyPressedValue[2]);
							// et on selectionne les annees
							ID_selectYear();
						}
						if(isSep){	// on entre un separateur... on prends le premier chiffre comme etant le jour
							mois[0] = Math.max(mois[0],1);
							ID_setValue(beforeKeyPressedValue[0],mois[0],beforeKeyPressedValue[2]);
							ID_selectYear();
						}
					}break;
					default:{
						if(isInt){	// on bascule ce chiffre sur l annee.
							annee[Math.min(3,Math.max(0,selPosIn-6))] = keyPressed;
							ID_setValue(beforeKeyPressedValue[0],beforeKeyPressedValue[1],annee[0]+""+annee[1]+annee[2]+annee[3]);
							// et on selectionne le chiffre d'apres (ou on reste sur le dernier)
							ID_selectInt(Math.max(6,Math.min(9,selPosIn+1)));
						}
						if(isSep){
							if(selPosIn==8){
								// cas particulier : si on est en position 8 (ie - on entre deux chiffres pour l'annee), on ajoute automatiquement 20 ou 19 juste avant
								var anneeEntree = parseInt(annee[0]+annee[1]+'');
								var dateToday = new Date().getFullYear().toString().substr(-2);
								if(anneeEntree>dateToday){
									ID_setValue(beforeKeyPressedValue[0],beforeKeyPressedValue[1],'19'+anneeEntree);
								}else{
									ID_setValue(beforeKeyPressedValue[0],beforeKeyPressedValue[1],'20'+anneeEntree);
								}
							}
							// on termine l annee, on a un focus out
							ID_Blur(false);
						}
					}break;
				}
			}
return false;
		});

		return ID_intialize();
	}
}( jQuery ));


 // ]]>
