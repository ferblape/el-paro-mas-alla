"use strict";

var mySlider = window.mySlider = function() {
  var self = {},
      $ocupados = $('#slider-ocupados'),
      $parados = $('#slider-parados'),
      $inactivos = $('#slider-inactivos'),
      ocupadosValue,
      paradosValue,
      inactivosValue;

  self.updatePositions = function(values){
    ocupadosValue  = Math.floor(values[0]);
    paradosValue   = Math.floor(values[1] - values[0]);
    inactivosValue = Math.ceil(100 - values[1]);

    $ocupados.css('width', ocupadosValue + '%');
    $parados.css('width', paradosValue + '%');
    $inactivos.css('width', inactivosValue + '%');

    $ocupados.html(ocupadosValue + '% Ocupados');
    $parados.html(paradosValue + '% Parados');
    $inactivos.html(inactivosValue + '% Inactivos');
  }

  self.getValues = function(){
    return {
      ocupados: ocupadosValue,
      parados: paradosValue,
      inactivos: inactivosValue
    };
  }

  return self;
}

$(function(){

  var pollSlider = new mySlider();

  d3.select('#slider').call(d3.slider().value([33, 66]).on("slide", function(evt, values) {
    pollSlider.updatePositions(values);
  }));

  var session = new Session();

  $('form').on('submit', function(e){
    e.preventDefault();

    session.set('sex', this.sex.value);
    session.set('sexText', this.sex.options[this.sex.selectedIndex].text.toLowerCase());
    session.set('age', this.age.value);
    session.set('autonomousRegion', this.autonomous_region.value);
    session.set('autonomousRegionText', this.autonomous_region.options[this.autonomous_region.selectedIndex].text);

    var source   = $("#header-template").html(),
        template = Handlebars.compile(source),
        html     = template(session.toJSON());

    // $('header').html(html).fadeIn('slow');

    Balls(session);
    //Lines(session);
  });

  // $('form').submit();
});
