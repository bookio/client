

/*

@codekit-prepend "components/modal.js";
@codekit-prepend "components/notify.js";
@codekit-prepend "components/spinner.js";
@codekit-prepend "scripts/tools.js";
@codekit-prepend "sample.js";
*/

define(['jquery', 'text!./test.html', 'less!./test.less', 'components/datepicker', 'components/popover'], function($, html) {
	

    function Module() {

        var root = null;
        var datePicker1 = null;
        var datePicker2 = null;

        function init() {
            $('body').empty();
            $('body').append(html);
        
            $('#button').click(function (){
                /*
                var foo = new DatePicker({
                    dateChanged: function(picker) {
                        picker.hide();
                    }
                });
                foo.show($(this));
                return;
                */
                
                var template = 
                    '<div class="dual-date-picker">'+
                        '<div class="start-date">'+
                        '</div>'+
                        '<div class="end-date">'+
                        '</div>'+
                    '</div>';
    
                var html = $(template);
                var startDatePicker = null;
                var endDatePicker = null;
                
                startDatePicker = new DatePicker({
                    dateChanged: function() {
                        if (endDatePicker.date() < startDatePicker.date())
                            endDatePicker.date(startDatePicker.date());
                    }
                });    
                
                endDatePicker = new DatePicker({
                    dateChanged: function() {
                        if (endDatePicker.date() < startDatePicker.date())
                            startDatePicker.date(endDatePicker.date());
                        
                    }
                    
                }); 
                   
                html.find('.start-date').append(startDatePicker.html());
                html.find('.end-date').append(endDatePicker.html());

                var popover = new Popover({
                    content: html
                });
                
                popover.show($(this));
            });                
        }	    

        init();	
    	    
	}

	return Module;

});

