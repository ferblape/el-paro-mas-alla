"use strict";

$(function(){
  var dataConfiguration = {
    workers: 1000
  };

  var session = new Session();

  $('form').on('submit', function(e){
    e.preventDefault();

    $(this).fadeOut('slow', function(){

      session.set('sex', this.sex.value);
      session.set('sexText', this.sex.options[this.sex.selectedIndex].text.toLowerCase());
      session.set('age', this.age.value);
      session.set('autonomousRegion', this.autonomous_region.value);
      session.set('autonomousRegionText', this.autonomous_region.options[this.autonomous_region.selectedIndex].text);

      var source   = $("#header-template").html(),
          template = Handlebars.compile(source),
          html     = template(session.toJSON());

      $('header').html(html).fadeIn('slow');

      Balls(session);
      Lines(session);
    });
  });

  //$('form').submit();
});
