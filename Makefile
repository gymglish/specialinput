all:
	#Install jquery.specialinput
	
	#Copy css files
	cp jquery.specialinput.css ~/a9engine/webmedia/css/src/jquery.specialinput.scss
	#Copy images
	cp images/specialinput-arrows-sprite.png ~/a9engine/httpdocs/frantastique.com/images/specialinput-arrows-sprite.png
	#Copy js files
	cp jquery.specialinput.js ~/a9engine/webmedia/scripts/src/jquery/jquery.specialinput.js
clean:
	rm ~/a9engine/webmedia/css/src/jquery.specialinput.scss ~/a9engine/httpdocs/frantastique.com/images/specialinput-arrows-sprite.png ~/a9engine/webmedia/scripts/src/jquery.specialinput.js
