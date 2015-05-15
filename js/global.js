var Model = Backbone.Model.extend({
	defaults: {
		nav: 'closed'
  }  
});

var View = Backbone.View.extend({
  el: 'body',
  
  $pageLeft: $('.page-left'),
  $pageRight: $('.page-right'),
  
  duration: 500,
  
  events: {
    'click .hamb-wrap': 'updateNav'
	},
  
  initialize: function() {
    this.render(); 
    this.listenTo(
      this.model, 'change:nav', this.navigation
    );
    
    return this;
  },
  
  render: function() {
    var self = this;
    
    
    
    this.$pageLeft.velocity({
      width: '30%'
    }, {
      duration: this.duration
    });
    
    this.$pageRight.velocity({
      width: '70%',
      marginLeft: '30%'
    }, {
      duration: this.duration
    });
    
    this.$pageLeft.find('.name')
    	.velocity({
  			translateX: [0, -50]
	    }, { 
      	duration: this.duration
	    });

    this.$pageRight.find('img, h1, h2, p, a')
    	.delay(this.duration)
    	.velocity('transition.slideUpIn');
  },
  
  updateNav: function() {
    var state = this.model.get('nav');
    
    this.model.set('nav', 
			state === 'open' ? 'closed' : 'open'
		);
  },
  
  navigation: function() {
		this.$('.hamb').toggleClass('active');
    
    if (this.model.get('nav') === 'open') {
      // animate nav in
      this.$pageLeft.velocity({
        width: '100%'
      }, {
        duration: this.duration * 0.75
      });

      this.$pageLeft.find('.name')
      	.delay(this.duration / 2)
        .velocity({
          width: 0
        }, {
          duration: this.duration * .75
        })

      this.$pageLeft.find('.name-inner')
        .velocity({ 
          top: '100%'
        }, {
          duration: this.duration * .75
        });

      this.$pageLeft.find('.main-nav li')
        .delay(this.duration)
        .velocity('transition.slideUpIn', {
          stagger: 100    
        });
    } else {
      // put everything back to how it was
      this.$pageLeft.velocity('reverse');
      
      this.$pageLeft.find('.name-inner')
      	.delay(this.duration / 1.75)
        .velocity('reverse');
      
      this.$pageLeft.find('.main-nav li')
        .css({ display: 'none' });
      
      this.$pageLeft.find('.name')
        .velocity('reverse');
    }
  }
}); 

var view = new View({
  model: new Model()
});
