"use strict";

$(function(){

  var pollSlider = new mySlider();

  d3.select('#slider').call(d3.slider().value([33, 66]).on("slide", function(evt, values) {
    pollSlider.updatePositions(values);
  }));

  var session = new Session();

  $('a.tofive').on('click', function(e){
    e.preventDefault();

    $('#five').children().each(function(){
      $(this).show();
      $.modal.close();
    });

    $($(this).attr('href')).show();

    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top
    }, 200);
  });

  $('a.transition').on('click', function(e){
    e.preventDefault();

    $($(this).attr('href')).show();

    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top
    }, 200);
  });

  $('form').on('submit', function(e){
    e.preventDefault();

    session.set('sex', this.sex.value);
    if(this.sex.value == 'Mujer') {
      session.set('sexIcon', 'fa-female');
    } else {
      session.set('sexIcon', 'fa-male');
    }
    session.set('sexText', this.sex.options[this.sex.selectedIndex].text.toLowerCase());
    session.set('age', this.age.value);
    session.set('autonomousRegion', this.autonomous_region.value);
    session.set('autonomousRegionText', this.autonomous_region.options[this.autonomous_region.selectedIndex].text);

    $('#three').fadeOut('slow', function(){

      var source   = $("#header-template").html(),
          template = Handlebars.compile(source),
          html     = template(session.toJSON());
      $('#header').html(html).fadeIn('slow');

      Balls(session);
      //Lines(session);

      setTimeout(function(){
        var sentences = [
          '¡Vaya, por poco!',
          'Ohhhh, ¡eres un poco pesimista!',
          'Ohhhh, ¡eres muy pesimista!',
          'Anda, te has quedado un poco lejos',
          '¡Uyyyy, casi!'
        ];

        var results = {
          sentence: sentences[Math.floor(Math.random() * sentences.length)],
          ocupadosDiff: pollSlider.diff('ocupados'),
          paradosDiff: pollSlider.diff('parados'),
          inactivosDiff: pollSlider.diff('inactivos')
        }

        var source   = $("#results-template").html(),
            template = Handlebars.compile(source),
            html     = template(results);

        $('#results').html(html).modal();
        $('#two .actions').show();
        $('#two').css('height', '1200px');
      }, 3000);
    });
  });

  // $('form').submit();
});
