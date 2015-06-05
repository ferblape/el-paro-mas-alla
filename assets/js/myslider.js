var mySlider = window.mySlider = function() {
  var self = {},
      $ocupados = $('#slider-ocupados'),
      $parados = $('#slider-parados'),
      $inactivos = $('#slider-inactivos'),
      ocupadosValue = 33,
      paradosValue = 33,
      inactivosValue = 33;

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

  self.diff = function(what){
    var v = parseInt($('#'+what).text().match(/[0-9]+/g)[0]);

    if(what == 'ocupados'){
      return ocupadosValue - v;
    }

    if(what == 'parados'){
      return paradosValue - v;
    }

    if(what == 'inactivos'){
      return inactivosValue - v;
    }
  }

  return self;
}

