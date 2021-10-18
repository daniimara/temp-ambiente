//index.js

var REST_DATA = 'api/principal';
var KEY_ENTER = 13;
var pgtransition = 'slide';

/**
 * Function responsável por carregar a lista de Sensores com Alerta. 
 * Ela busca todos os sensores que estão com a temperatura fora do range definido.
 **/
function loadItems(){
	// Limpa o elemento da lista
	$("#listSensorAlerta").empty();
	/**
	 * Consulta a base de dados através do PrincipalController. 
	 * A function xhrGet se encontra no arquivo util.js
	 **/ 
	xhrGet(REST_DATA, function(data){
		var receivedItems = data.body || [];
		var items = [];
		var i;
		// Verifique se os itens recebidos têm formato correto
		for(i = 0; i < receivedItems.length; ++i){
			var item = receivedItems[i];
			if(item && 'descricaoSensor' in item && 'temperaturaSensor' in item && 'descricaoAmbiente' in item){
				items.push(item);
			}
		}
		for(i = 0; i < items.length; ++i){
			// Adiciona os itens retornado pela busca a lista.
			addItem(items[i]);
		}
		// Finaliza a barra de progresso iniciado ao acessar a pagina Principal.
		finalizarBarraProgresso();
	}, function(err){
		finalizarBarraProgresso();
		console.error(err);
	});
}

/**
 * Adiciona os itens a listview. 
 * 
 * 
 **/
function addItem(item){
	$("#listSensorAlerta").append(
		"<li id='" + Math.random() + "'>" +
			"<img src=images/alerta_temp.png>" +
				"<h1>" + item.descricaoSensor + "&nbsp;&nbsp;&nbsp;<span style='color: red;'>" + item.temperaturaSensor + "&nbsp;°C</span></h1>" +
				"<p>" + item.temperaturaMinima + "&nbsp;°C&nbsp;&nbsp;&nbsp;a&nbsp;&nbsp;&nbsp;" + item.temperaturaMaxima + "&nbsp;°C</p>" +
				"<p>" + item.descricaoAmbiente + "&nbsp;&nbsp;&nbsp;" + item.temperaturaMedia + "&nbsp;°C</p>" +
				"<p>" + item.descricaoLocal + "</p>" +
			"" +
		"</li>");
	$('#listSensorAlerta').listview('refresh');
}

/**
 * Inicia a barra de progresso. Utilizada quando entra na tela Principal.
 * Principalmente quando entra a primeira vez. Pois a tela demora a carregar
 * 
 **/
function iniciarBarraProgresso(){
	    var $this = $( this ),
	        theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
	        textonly = !!$this.jqmData( "textonly" );
	        html = $this.jqmData( "html" ) || "";
	    $.mobile.loading( "show", {
	            text: "Aguarde...",
	            textVisible: true,
	            theme: theme,
	            textonly: textonly,
	            html: html
	    });
	// Atualiza a lista de Sensores.
	loadItems();
	
	}
/**
 * Finaliza a barra de progresso.
 *
 **/
function finalizarBarraProgresso(){
	$.mobile.loading( "hide" );
}

function onKey(evt){
	if(evt.keyCode == KEY_ENTER && !evt.shiftKey){
		evt.stopPropagation();
		evt.preventDefault();
		var row = evt.target.parentNode.parentNode;
		if(row.nextSibling){
			row.nextSibling.firstChild.firstChild.focus();
		}else{
			addItem();
		}
	}
}

/**
 * Link para a tela de Home
 *
 **/
$('#linkIndex').on('click', function (e) {
	$(location).attr('href', 'index.html');
});

/**
 * Link para a tela de Local
 *
 **/
$('#linkLocal').on('click', function (e) {
	$(location).attr('href', 'local/local.html');
});

/**
 * Link para a tela de Ambiente
 *
 **/
$('#linkAmbiente').on('click', function (e) {
	$(location).attr('href', 'ambiente/ambiente.html');
});

/**
 * Link para a tela de Sensor
 *
 **/
$('#linkSensor').on('click', function (e) {
	$(location).attr('href', 'sensor/sensor.html');
});

/**
 * Link para a tela de Informações
 *
 **/
$('#linkInfo').on('click', function (e) {
	$(location).attr('href', 'info.html');
});