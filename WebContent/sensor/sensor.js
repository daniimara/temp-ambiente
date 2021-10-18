// ambiente.js

var REST_DATA = '../api/sensor';
var REST_DATA_LOCAL = '../api/ambiente';
var KEY_ENTER = 13;
var pgtransition = 'slide';
var id = 0;

/**
 * Function responsável por carregar a lista de Sensor. 
 * Ela busca todos os locais cadastrados na base de dados.
 **/
function loadItems(){
	// Limpa o elemento da lista
	$("#listSensor").empty();
	/**
	 * Consulta a base de dados através do SensorController. 
	 * A function xhrGet se encontra no arquivo util.js
	 **/ 
	xhrGet(REST_DATA+"?id="+id, function(data){
		var receivedItems = data.body || [];
		var items = [];
		var i;
		// Verifique se os itens recebidos têm formato correto
		for(i = 0; i < receivedItems.length; ++i){
			var item = receivedItems[i];
			if(item && 'id' in item && 'descricao' in item && 'status' in item){
				items.push(item);
			}
		}
		for(i = 0; i < items.length; ++i){
			// Adiciona os itens retornado pela busca a lista.
			addItem(items[i]);
		}
		// Finaliza a barra de progresso iniciado ao acessar a pagina Sensor.
		finalizarBarraProgresso();
	}, function(err){
		finalizarBarraProgresso();
		console.error(err);
	});
}

/**
 * Adiciona os itens a listview e também cria um link para cada item. 
 * Esse link é utilizado na alteração do registro.
 * 
 **/
function addItem(item){
	$("#listSensor").append(
		"<li id=" + item.id + " onclick=\"linkClicked($(this).index())\" >" +
			"<a id='" + Math.random() + "' href='#pgAddSensor' >" +
			"<h1>" + item.descricao + "&nbsp;&nbsp;&nbsp;" + item.temperatura + "&nbsp;°C</h1>" +
				"<p>" + item.descricaoAmbiente + "&nbsp;&nbsp;&nbsp;" + item.descricaoLocal + "</p>" +
				"<p>" + (item.status==2?"Inativo":"<span style='color: blue;'>Ativo</span>") + "</p>" +
			"" +
			"</a>" +
		"</li>");
	$('#listSensor').listview('refresh');
}

/**
 * Inicia a barra de progresso. Utilizada quando entra na tela ambiente.
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
	// Atualiza a lista de ambiente.
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
 * Function responsável por salvar o item alterado ou criado.
 * Após alterar ou criar um novo item, a tela é redirecionada para a lista de itens.
 * @Param Sensor.java
 * @Param Boolean
 **/
function saveChange(data, isNew){
	$("#listSensor").empty();
	if(isNew){
		/**
		 * Insere um novo registro através do SensorController. 
		 * A function xhrPost se encontra no arquivo util.js
		 **/ 
		xhrPost(REST_DATA, data, function(item){
			console.log('create: ', data);
			// recarrega os dados na lista e exibe na tela Sensor
			loadItems();
			// Deixa a tela de alterar/incluir/deletar limpa para proximas utilizações
			pgAddSensorClear();
			toastr.success('Sensor salvo com sucesso.', '');
		}, function(err){
			toastr.success('Ocorreu um erro durante a operação.', '');
			console.error(err);
		});
	} else {
		/**
		 * Altera um registro através do SensorController. 
		 * A function xhrPut se encontra no arquivo util.js
		 **/
		xhrPut(REST_DATA, data, function(){
			console.log('update: ', data);
			// recarrega os dados na lista e exibe na tela Sensor
			loadItems();
			// Deixa a tela de alterar/incluir/deletar limpa para proximas utilizações
			pgAddSensorClear();
			toastr.success('Sensor salvo com sucesso.', '');
		}, function(err){
			toastr.success('Ocorreu um erro durante a operação.', '');
			console.error(err);
		});
	}
	// Sai da tela de alterar/incluir/deletar e retorna para a ambiente.
	$('#pgAddBack').click();
}

/**
 * Entra na tela de alterar/incluir/deletar de ambiente.
 *
 **/
$('#pgAddNovo').on('click', function (e) {
	// Deixa a tela de alterar/incluir/deletar limpa para utilizações
	pgAddSensorClear();
	getPopularAmbiente();
	// Deixa o botão excluir invisivel.
	desabilitarExcluir();
	e.preventDefault();
	e.stopImmediatePropagation();
	$('#pgAddSensor').data('from', 'pgSensor');
	$.mobile.changePage('#pgAddSensor', {transition: pgtransition});
});

/**
 * Sai da tela de alterar/incluir/deletar de ambiente.
 *
 **/
$('#pgAddBack').on('click', function (e) {
	if(id!=0){
		desabilitarExcluir();
	}
	pgAddSensorClear();
	e.preventDefault();
	e.stopImmediatePropagation();
	var pgFrom = $('#pgAddSensor').data('from');
	$.mobile.changePage('#pgSensor', {transition: pgtransition});
});

/**
 * Botão de salvar um ambiente novo ou alterado.
 * Nesse momento também é realizado a validação dos campos obrigatórios
 *
 **/
$('#pgAddSensorSave').on('click', function (e) {
	e.preventDefault();
	e.stopImmediatePropagation();
	var SensorRec;
	// Carrega a variável SensorRec, de acordo com os campos preenchidos na tela.
	SensorRec = pgAddSensorGetRec();
	// valida campos Obrigatórios
	if(SensorRec.descricao == "") {
		toastr.success('Descrição é obrigatório.', '');
		return null;
	} else if(SensorRec.deviceId == "") {
		toastr.success('Id Sensor é obrigatório.', '');
		return null;
	} else if(SensorRec.deviceId.length != 12) {
		toastr.success('Id Sensor deve ter 12 caracteres.', '');
		return null;
	} else if(SensorRec.status == "0") {
		toastr.success('Status é obrigatório.', '');
		return null;
	} else if(SensorRec.idAmbiente == "0") {
		toastr.success('Ambiente é obrigatório.', '');
		return null;
	}
	// Caso id=0, esta criando novo ambiente, caso contrário, esta alterando um ambiente.
	if(id == 0){
		saveChange(SensorRec, true);
	} else {
		SensorRec.id= id;
		saveChange(SensorRec, false);
	}
	// Limpando campos da tela inserir/alterar/excluir
	pgAddSensorClear();
	// Retornar a tela ambiente.
	$('#pgAddBack').click();
});

/**
 * Quando criado um novo ambiente, o botão excluir deve estar invisivel.
 *
 **/
function desabilitarExcluir(){
	$("#pgAddSensorTempId").hide();
	$('#btnExclui').remove();
	$("#btnSalve").removeClass("ui-block-a");
	$("#ulOpcoes").removeClass("ui-grid-solo");
	
}

/**
 * Quando alterado/deletado um ambiente, o botão excluir deve estar visivel.
 *
 **/
function habilitarExcluir(){
	$("#pgAddSensorTempId").show();
	$("#ulOpcoes").addClass("ui-grid-a");
	$("#btnSalve").addClass("ui-block-a");
	$("<li id='btnExclui' class='ui-block-b'>" +
		"<a  href='#popupDialog' data-rel='popup' data-position-to='window' data-transition='pop' data-icon='delete' " +
		"aria-haspopup='true' aria-owns='popupDialog' aria-expanded='false' class='ui-link ui-btn ui-icon-delete ui-btn-icon-top' " +
		">Excluir</a>" +
	"</li>").appendTo('#ulOpcoes');
	
	$('#pgAddDelete').on('click', function (e) {
		$("#listSensor").empty();
		e.preventDefault();
		e.stopImmediatePropagation();
		xhrDelete(REST_DATA + '?id=' + id, function(){
			// recarrega os dados na lista e exibe na tela Sensor
			id = 0;
			loadItems();
			// Deixa a tela de alterar/incluir/deletar limpa para proximas utilizações
			pgAddSensorClear();
		}, function(err){
			console.error(err);
		});
		// Retornar a tela ambiente.
			$('#pgAddBack').click();
	});
}
	
/**
 * Esta function é resposável por popular a tela de inserir/alterar/excluir
 * Nela o item selecionado na lista é carregado na tela.
 * @param Sensor.java
 **/
linkClicked = function (index) {
	// Quando o objeto já existir a tela deve exibir o butão excluir
	habilitarExcluir();
	// id é uma variavel global. Ela recebe o id do objeto selecionado na lista da tela ambiente.
    id=$('#listSensor li').get(index).id;
	if(id!=0){
	getPopularAmbiente();
	
	}
  }

function getPopularAmbiente() {
	
	$("#pgAddComboAmbiente").append('<option value="0" >Escolha uma opção...</option>');
	
	xhrGet(REST_DATA_LOCAL+"?id=0", function(AmbienteRec){
		var receivedItems = AmbienteRec.body || [];
		var items = [];
		var i;
		// Verifique se os itens recebidos têm formato correto
		for(i = 0; i < receivedItems.length; ++i){
			var item = receivedItems[i];
			if(item && 'id' in item && 'descricao' in item && 'status' in item){
				items.push(item);
			}
		}
		
		for(i = 0; i < items.length; ++i){
			// Adiciona os itens retornado pela busca a lista.
			addItemAmbiente(items[i]);
		}
		
		if(id!=0){
			getPopularSensor();
		} else {
			$("#pgAddComboAmbiente").val('0');
			$("#pgAddComboAmbiente").change();
		}
	}, function(err){
		console.error(err);
	});
}

function getPopularSensor(){
	/**
	 * Busca o objeto ambiente pelo id atrevés do SensorController. 
	 * A function xhrGet se encontra no arquivo util.js
	 **/
	xhrGet(REST_DATA+"?id="+id, function(SensorRec){
	console.log('get: ', id);
	// Popula a tela com o objeto pesquisado no controller
	$('#pgAddSensorDescricao').val(SensorRec.descricao);
	$('#pgAddSensorDeviceId').val(SensorRec.deviceId);
	$('#pgAddSensorStatus').val(SensorRec.status);
	$('#pgAddComboAmbiente').val(SensorRec.idAmbiente);
	$('#pgAddSensorTemperatura').val(SensorRec.temperatura);
	
	// foi necessario pois o combo nao estava atualizando.
	$("#pgAddSensorStatus").change();
	$("#pgAddComboAmbiente").change();
}, function(err){
	toastr.success('Ocorreu um erro durante a operação.', '');
	console.error(err);
});
}


/**
 * Adiciona os itens a listview e também cria um link para cada item. 
 * Esse link é utilizado na alteração do registro.
 * 
 **/
function addItemAmbiente(item){
	//if(item.status=='1'){
	$("#pgAddComboAmbiente").append(
			'<option value='+item.id+' >'+item.descricao+'</option>');
	//}	
}

/**
 * Popula o objeto SensorRec com os valores cadastrados na tela.
 * @Return Sensor.java
 **/
function pgAddSensorGetRec() {
	var SensorRec = {};
	SensorRec.descricao = $('#pgAddSensorDescricao').val().trim();
	SensorRec.deviceId = $('#pgAddSensorDeviceId').val().trim();
	SensorRec.status = $('#pgAddSensorStatus').val().trim();
	SensorRec.idAmbiente = $('#pgAddComboAmbiente').val().trim();
	SensorRec.temperatura = $('#pgAddSensorTemperatura').val().trim();
	if(SensorRec.temperatura==""){
		SensorRec.temperatura = 0;
	}
	
	return SensorRec;
}

/**
 * Limpa a tela inserir/alterar/excluir e a variavel global id.
 * 
 **/
function pgAddSensorClear() {
	$('#pgAddSensorDescricao').val('');
	$('#pgAddSensorDeviceId').val('');
	$('#pgAddSensorStatus').val('0');
	$("#pgAddSensorStatus").change();
	$("#pgAddComboAmbiente").empty();
	$("#pgAddComboAmbiente").change();
	$('#pgAddSensorTemperatura').val('');
	$('#pgAddSensorTempMed').val('');
	$('#pgAddSensorTempMax').val('');
	id = 0;
	desabilitarExcluir();
}


/**
 * Link para a tela de Home
 *
 **/
$('#linkIndex').on('click', function (e) {
	$(location).attr('href', '../index.html');
});

/**
 * Link para a tela de Ambiente
 *
 **/
$('#linkLocal').on('click', function (e) {
	$(location).attr('href', '../local/local.html');
});

/**
 * Link para a tela de Ambiente
 *
 **/
$('#linkAmbiente').on('click', function (e) {
	$(location).attr('href', '../ambiente/ambiente.html');
});

/**
 * Link para a tela de Sensor
 *
 **/
$('#linkSensor').on('click', function (e) {
	$(location).attr('href', '../sensor/sensor.html');
});

/**
 * Link para a tela de Informações
 *
 **/
$('#linkInfo').on('click', function (e) {
	$(location).attr('href', '../info.html');
});




/**
 * Link para a tela de Cadastro
 *
 **/
$('#linkIndexCad').on('click', function (e) {
	$(location).attr('href', '../index.html');
});
$('#linkLocalCad').on('click', function (e) {
	$(location).attr('href', '../local/local.html');
});
$('#linkAmbienteCad').on('click', function (e) {
	$(location).attr('href', '../ambiente/ambiente.html');
});
$('#linkSensorCad').on('click', function (e) {
	$(location).attr('href', '../sensor/sensor.html');
});
$('#linkInfoCad').on('click', function (e) {
	$(location).attr('href', '../info.html');
});