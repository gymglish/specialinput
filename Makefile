all:
	#Install jquery.specialinput
	#Copy css files
	cp jquery.specialinput.css ~/a9engine/webmedia/css/src/jquery.specialinput.scss
	#Copy js files
	cp jquery.specialinput.js ~/a9engine/webmedia/scripts/src/jquery/jquery.specialinput.js
clean:
	rm ~/a9engine/webmedia/css/src/jquery.specialinput.scss ~/a9engine/webmedia/scripts/src/jquery.specialinput.js
