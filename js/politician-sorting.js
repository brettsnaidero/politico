// To keep our code clean and modular, all custom functionality will be contained inside a single object literal called "buttonFilter".
var buttonFilter = {

  // Declare any variables we will need as properties of the object
  $filters: null,
  $reset: null,
  groups: [],
  outputArray: [],
  outputString: '',

  // The "init" method will run on document ready and cache any jQuery objects we will need.
  init: function(){
    var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.

    self.$filters = $('#Filters');
    self.$reset = $('#Reset');
    self.$container = $('#Container');

    self.$filters.find('fieldset').each(function(){
      self.groups.push({
        $buttons: $(this).find('.filter'),
        active: ''
      });
    });

    self.bindHandlers();
  },

  // The "bindHandlers" method will listen for whenever a button is clicked.
  bindHandlers: function(){
    var self = this,
        typingDelay = 300,
        typingTimeout = -1,
        resetTimer = function() {
          clearTimeout(typingTimeout);

          typingTimeout = setTimeout(function() {
            self.parseFilters();
          }, typingDelay);
        };


    // Handle filter clicks
    self.$filters.on('click', 'button.filter', function(e){
      e.preventDefault();

      var $button = $(this);

      // If not already active, make active and deactivate others.
      if (!($button.hasClass('active'))) {
          $button.addClass('active').siblings('.filter').removeClass('active');
      }

      self.parseFilters();
    });

    // When search box input changes, then rest the timer
    self.$filters.on('keyup change', '.search', resetTimer);

    // Handle reset click
    self.$reset.on('click', function(e){
      e.preventDefault();

      // Remove active classes from buttons, except for the 'all' button
      self.$filters.find('button.filter').each (function() {
          if ( $(this).attr('data-filter') == '' ) {
              $(this).addClass('active');
          } else {
              $(this).removeClass('active');
          }
      })

      // Remove search terms
      self.$filters.find('input[type="text"]').val('');

      self.parseFilters();
    });
  },

  // The parseFilters method checks which filters are active in each group:
  parseFilters: function(){
    var self = this;

    // New
    for(var i = 0, group; group = self.groups[i]; i++) {
        group.active = []; // reset arrays
        group.$buttons.each(function(){
            var searchTerm = '',
            $input = $(this),
            minimumLength = 2;

            if ( $input.hasClass('active') ) {
                group.active.push( $(this).attr('data-filter') );
            }

            if ( $input.is('[type="text"]') && this.value.length >= minimumLength ) {
                searchTerm = this.value
                .trim()
                .toLowerCase()
                .replace(' ', '-');

                group.active[0] = '[data-name*="' + searchTerm + '"]';
            }
        });
	    group.active.length && (group.tracker = 0);
    }

    self.concatenate();
  },

  // The "concatenate" method will crawl through each group, concatenating filters as desired:
  concatenate: function(){
    var self = this;

    self.outputString = ''; // Reset output string

    for(var i = 0, group; group = self.groups[i]; i++){
      self.outputString += group.active;
    }

    // If the output string is empty, show all rather than none:
    !self.outputString.length && (self.outputString = 'all');

    console.log(self.outputString);
    // ^ we can check the console here to take a look at the filter string that is produced

    // Send the output string to MixItUp via the 'filter' method:
	  if(self.$container.mixItUp('isLoaded')){
    	self.$container.mixItUp('filter', self.outputString);
	  }
  }
};

// On document ready, initialise our code.
$(function() {

    // Initialize buttonFilter code
    buttonFilter.init();

    $("#Container").mixItUp({
        controls: {
            enable: false // we won't be needing these
        },
        callbacks: {
            onMixFail: function(){
                // alert('No items were found matching the selected filters.');
            }
        }
    });

})
