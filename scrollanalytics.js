window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function ScrollAnalytics(section,delay){
	var thisClass = this;
	var viewing = false;
		delay = delay ? delay : 1000; 
	this.active = false;


	function checkPosition(){

		
		var padding = parseInt($('body').css('padding-top'));
		var scrollTop = $(window).scrollTop() + padding ;
		var viewPort  = ($(window).height() - padding);
		

		var offset  = '60%'; 
			offset  = parseInt(offset)/100 ;
			
		
		for(i=0; i<section.length; i++){
			var current  = calculate(section[i]);
			if( current.position <= viewPort*offset && current.visible >  viewPort*offset){
				if( this.active != current.id ){
					this.active = current.id  ;

					
					if(viewing){
						clearTimeout(viewing)
					}

					viewing = setTimeout(function(){
						//CALLBACK HERE
						ga('send', 'event', 'Section View', 'View Page Section', current.id);
						// END CALLBACK HERE
					},delay)
					
				}
				return false;
			}
			
		}

		function calculate(selector){
			var DOM 	= $(selector);
			var offset  = DOM.offset() ? DOM.offset().top : 0;
			var height  = DOM.outerHeight();
			var position=  offset  - scrollTop ;
			var visible =  (offset + height) - scrollTop;
				visible = visible <= 0 ? 0 : visible;

			return { height : height, position : position, visible: visible, id: DOM.attr('id')};
		}
	}

	function recurtion(){
		requestAnimFrame(recurtion);
		checkPosition();
	}

	this.init = function(){
		recurtion();
	}

}



var analytics = new ScrollAnalytics(['#splash','#mechanics','#registration']);
analytics.init();