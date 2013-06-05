
		

define(['jquery', 
    'components/popover', 
    'components/dropdown', 
    'components/itempicker', 
    'lib/kinetic.js', 
    'scripts/tools', 
    'reservation.js', 
    'frameworks/bootstrap/js/bootstrap'], 
    
    function($) {
	
	
    
    Kinetic.Icon = function(config) {
        var self = this;

        // call super constructor
        Kinetic.Shape.call(this, config);

        // Set up some basic stuff
        this.shapeType = 'Icon';
        this.setDrawFunc(this.drawFunc);
        this.setDrawHitFunc(this.drawHitFunc);
		this.setShadowBlur(5);
		this.setShadowOffset({x:2, y:2});
		this.setShadowColor(hsla(0, 0, 0.5, 1));
		this.setShadowOpacity(0.5);
		this.setDraggable(true);

        this.on('imageChange', function(event) {
            self.resizeToImage();
            self.getLayer().draw();
        });
        
        this.on("mousedown", function(event){
	        self.transitionTo({
	          scale: {x:1.2, y:1.2},
	          easing: 'elastic-ease-out',
	          duration: 0.8
	        });
        });

        this.on("mouseup", function(event){
	        self.transitionTo({
	          scale: {x:1, y:1},
	          easing: 'ease-in-out',
	          duration: 0.3
	        });
        });

        this.on("dragend", function(event){
	        
	        var x = self.getX();
	        var y = self.getY();

	        x = Math.floor((x+30) / 60) * 60;
	        y = Math.floor((y+30) / 60) * 60;
	        self.transitionTo({
	          x: x,
	          y: y,
	          scale: {x:1, y:1},
	          easing: 'ease-in-out',
	          duration: 0.3
	        });
        });
        
        // Load the image
        if (this.attrs.src) {
            var image = new Image;
            image.onload = function() {
            	self.setImage(image);
            };
            
            image.src = this.attrs.src;
        }

        self.resizeToImage();
    };

    Kinetic.Icon.prototype.resizeToImage = function() {
        if (this.attrs.image) {
            this.setWidth(this.attrs.image.width);
            this.setHeight(this.attrs.image.height);
            this.setOffset(this.attrs.image.width / 2, this.attrs.image.height / 2);

        }
    };
    

    Kinetic.Icon.prototype.drawFunc = function(canvas) {
        var width = this.getWidth(), height = this.getHeight(), params, self = this, context = canvas.getContext();

        context.beginPath();
        context.rect(0, 0, width, height);
        context.closePath();
        canvas.fillStroke(this);

        if (this.attrs.image) {
            if (this.hasShadow()) {
                canvas.applyShadow(this, function() {
                    context.drawImage(self.attrs.image, 0, 0, width, height);
                });
            }
            else {
                context.drawImage(self.attrs.image, 0, 0, width, height);
            }
        }

    };    
    
            
    Kinetic.Icon.prototype.drawHitFunc = function(canvas) {
        var width = this.getWidth(), height = this.getHeight(), imageHitRegion = this.imageHitRegion, appliedShadow = false, context = canvas.getContext();

        if(imageHitRegion) {
            context.drawImage(imageHitRegion, 0, 0, width, height);
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            canvas.stroke(this);
        }
        else {
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            canvas.fillStroke(this);
        }
    };
    
    Kinetic.Global.extend(Kinetic.Icon, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.Icon, ['image']);





    
	Scene = function(container) {
	
		// To avoid confusion (or NOT)
		var self = this;
		var counter = 0;
		
		this.container = container;

	    var _stage = new Kinetic.Stage({
	        container: container[0],
	        width:  parseInt(container.css('width')),
	        height: parseInt(container.css('height'))
	    });
		var _layer = new Kinetic.Layer();
		var _items = [];
		
	    
		_stage.add(_layer);
		

		this.redraw = function() {
			_stage.draw();
		}

    	$(window).on('resize', function() {
    	   _stage.setWidth(container.outerWidth());
    	   _stage.setHeight(container.outerHeight());
    	});	

		function addItem(src, x, y) {
			var item = new Kinetic.Icon({src:src, x:x, y:y});
			counter++;
			//item.setPosition(x, y);
			if (counter % 2) {
				item.on('click', function(event){
					foo();
				});
    			
			}
			else {
				item.on('click', function(event){
					var dropdown = new ItemPicker({
					});
					var x = container.offset().left;
					var y = item.getX();
					dropdown.show(item.getX() + container.offset().left, item.getY() + container.offset().top);

					/*
					var popover = new Popover({
					  placement:'top',
					  offset:0
					  
					});
					var x = container.offset().left;
					var y = item.getX();
					popover.show(item.getX() + container.offset().left, item.getY() + container.offset().top);
					*/
				});
				
			}
			
			_items.push(item); 
			_layer.add(item);
		}
	    
	    _stage.on("resize", function(event) {
	    });

		addItem("images/icons/car.png", 20+30, 160);
		addItem("images/icons/drink.png", 120+30, 160);
		addItem("images/icons/man.png", 220+30, 160);
		addItem("images/icons/woman.png", 320+30, 160);
		addItem("images/icons/home.png", 420+30, 160);
		addItem("images/icons/bed.png", 520+30, 160);
		    

		_stage.fire("resize");
		_stage.draw();
			
	}
	
	
   // });



});


