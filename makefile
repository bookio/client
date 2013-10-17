# Install Xcode (including command line tools)
# Install nodejs -> http://nodejs.org
# Install lessc -> npm install -g less
# Install js-beautify -> npm install -g js-beautify
#####################

SSH_HOST = ssh.binero.se
SSH_USER = 163702_ssh
SSH_PATH = bookio.com/public_html/bookerX


#####################

COMPRESS = @java -jar Java/yuicompressor-2.4.8.jar --charset utf-8
LESSC = @lessc --yui-compress
MKDIR = @mkdir
CP = @cp
ECHO = @echo
BEAUTIFY = @js-beautify -b end-expand
RSYNC = @rsync -rav 

#####################

SITE_PATH = ~/Desktop/BookioX

ALL_FILES = $(shell find . -type f -not -path '*/\.*')
JS_FILES = $(filter %.js, $(ALL_FILES))
HTML_FILES = $(filter %.html, $(ALL_FILES))
LESS_FILES = $(filter %.less, $(ALL_FILES))
CSS_FILES = $(patsubst %.less,%.css,$(LESS_FILES))

SITE_FILES = $(addprefix $(SITE_PATH)/,$(CSS_FILES)) $(addprefix $(SITE_PATH)/,$(ALL_FILES)) 

all:
	echo $(SITE_FILES)
	
css: $(CSS_FILES)
	$(ECHO) Done.

site: $(SITE_PATH) $(SITE_FILES)
	$(ECHO) Done.

publish: $(CSS_FILES) $(SITE_PATH) $(SITE_FILES)
	$(RSYNC) $(SITE_PATH)/* $(SSH_USER)@$(SSH_HOST):$(SSH_PATH) 

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

