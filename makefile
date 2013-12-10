# Install Xcode (including command line tools)
# Install nodejs -> http://nodejs.org
# Install lessc -> npm install -g less
# Install js-beautify -> npm install -g js-beautify
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
LESSC = @lessc --yui-compress
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
	lib/mobiscroll/js/mobiscroll.custom-2.8.3.min.js \
	lib/jquery/plugins/jquery.cookie.js \
	lib/jquery/plugins/jquery.hookup.js \
	lib/jquery/plugins/jquery.debounce.js \
	lib/jquery/plugins/jquery.hittest.js \
	lib/jquery/plugins/jquery.isotope.js \
	lib/jquery/plugins/jquery.mobile-events.js \
	lib/jquery/plugins/jquery.special-events.js \
	lib/jquery/plugins/jquery.spin.js \
	lib/jquery/plugins/jquery.transit.js \
	lib/jquery-mobile/plugins/jquery.mobile.pages.js \
	js/base64.js \
	js/sprintf.js \
	js/sha1.js \
	js/tools.js \
	js/gopher.js \
	js/date.js \
	js/model.js \
	js/notifications.js

CORE_CSS_FILES = \
	lib/jquery-mobile/jquery.mobile-1.4.0.css \
	lib/mobiscroll/css/mobiscroll.custom-2.8.3.min.css

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

core: js/core.js
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

$(SITE_PATH)/%.js: %.js
	$(ECHO) Compressing '$@'...
	$(MKDIR) -p $(SITE_PATH)/$(<D)
	$(COMPRESS) $^ -o $@ 

$(SITE_PATH)/%:%
	$(ECHO) Copying '$@'...
	$(MKDIR) -p $(SITE_PATH)/$(<D)
	$(CP) $^ $@ 

# This rule must be placed last, since we want to copy the CSS files from the site
%.css: %.less
	$(ECHO) Compiling '$@'...
	$(LESSC) $^ > $@

