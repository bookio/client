# Install Xcode (including command line tools)
# Install nodejs -> See http://nodejs.org
# Install lessc -> "npm install -g less"
# Install js-beautify -> "npm install -g js-beautify" (not really needed)
#
# Command to use ssh without password: 
# cat ~/.ssh/id_rsa.pub | ssh 163702_ssh@ssh.binero.se "mkdir -p ~/.ssh; cat >> ~/.ssh/authorized_keys"
#
#

#####################

SSH_HOST = ssh.binero.se
SSH_USER = 163702_ssh
SSH_PATH = bookio.com/public_html/booker

#####################

COMPRESS = @java -jar Java/yuicompressor-2.4.8.jar --charset utf-8
LESSC = @lessc 
MKDIR = @mkdir
CP = @cp
ECHO = @echo
BEAUTIFY = @js-beautify -b end-expand
RSYNC = @rsync -rav 
RM = @rm
CAT = @cat

#####################

SITE_PATH = /tmp/Bookio

ALL_FILES = $(shell find . -type f -not -path '*/\.*') js/core.js
JS_FILES = $(filter %.js, $(ALL_FILES))
HTML_FILES = $(filter %.html, $(ALL_FILES))
LESS_FILES = $(filter %.less, $(ALL_FILES))
CSS_FILES = $(patsubst %.less,%.css,$(LESS_FILES))

SITE_FILES = $(addprefix $(SITE_PATH)/,$(CSS_FILES)) $(addprefix $(SITE_PATH)/,$(ALL_FILES)) 
MAKE_FILES = $(CSS_FILES) $(SITE_PATH) $(SITE_FILES)

CORE_JS_FILES = \
	lib/jquery/jquery-2.0.3.js \
	lib/jquery-mobile/jquery.mobile.config.js \
	lib/jquery-mobile/jquery.mobile-1.4.0.js \
	lib/jquery/plugins/jquery.extensions.js \
	lib/jquery/plugins/jquery.cookie.js \
	lib/jquery/plugins/jquery.hookup.js \
	lib/jquery/plugins/jquery.debounce.js \
	lib/jquery/plugins/jquery.hittest.js \
	lib/jquery/plugins/jquery.isotope.js \
	lib/jquery/plugins/jquery.mobile-events.js \
	lib/jquery/plugins/jquery.special-events.js \
	lib/jquery/plugins/jquery.spin.js \
	lib/jquery/plugins/jquery.transit.js \
	lib/jquery/plugins/jquery.i18n.js \
	lib/jquery/plugins/jquery.pubsub.js \
	lib/jquery/plugins/jquery.devoke.js \
	lib/jquery/plugins/jquery.textrange.js \
	lib/jquery/plugins/jquery.keyframes.js \
	lib/jquery-mobile/plugins/jquery.mobile.pages.js \
	lib/mobiscroll/mobiscroll.2.9.5.min.js \
	lib/moment/moment.js \
	lib/moment/moment-range.js \
	lib/underscore/underscore.js \
	lib/rrule/rrule.js \
	js/base64.js \
	js/sprintf.js \
	js/sha1.js \
	js/tools.js \
	js/gopher.js \
	js/date.js \
	js/model.js

CORE_CSS_FILES = \
	lib/jquery-mobile/jquery.mobile-1.4.0.css \
	lib/mobiscroll/mobiscroll.2.9.5.min.css

all:
	@echo "usage: make www   - Deploys to web site"
	@echo "       make css   - Compiles all LESS files into CSS"
	@echo "       make core  - Generates the core files"
	@echo "       make clean - Clean up temporary files"
	

clean:
	$(RM) -r $(SITE_PATH)
		
css: $(CSS_FILES)
	$(ECHO) Done.

site: $(MAKE_FILES)
	$(ECHO) Done.

core: js/core.js css/core.css
	$(ECHO) Done.

safari: $(MAKE_FILES)
	open -a Safari $(SITE_PATH)/index.html

www: $(MAKE_FILES)
	$(RSYNC) $(SITE_PATH)/* $(SSH_USER)@$(SSH_HOST):$(SSH_PATH) 

js/core.js: $(CORE_JS_FILES)
	$(ECHO) Building '$@'...
	$(CAT) > $@ $^

css/core.css: $(CORE_CSS_FILES)
	$(ECHO) Building '$@'...
	$(CAT) > $@ $^

$(SITE_PATH):
	$(MKDIR) -p $(SITE_PATH)

#
# Comment out this rule for compressed output
# (would be nice with comething like 'make debug' and 'make release'...)
#
#$(SITE_PATH)/%.js: %.js
#	$(ECHO) Compressing '$@'...
#	$(MKDIR) -p $(SITE_PATH)/$(<D)
#	$(COMPRESS) $^ -o $@ 

# Compress all css files to local site
$(SITE_PATH)/%.css: %.css
	$(ECHO) Compressing '$@'...
	$(MKDIR) -p $(SITE_PATH)/$(<D)
	$(LESSC) --yui-compress $^ > $@

# Just copy all other files
$(SITE_PATH)/%:%
	$(ECHO) Copying '$@'...
	$(MKDIR) -p $(SITE_PATH)/$(<D)
	$(CP) $^ $@ 

%.css: %.less
	$(ECHO) Compiling '$@'...
	$(LESSC) $^ > $@

