// ambiente.js

var REST_DATA = '../api/ambiente';
var REST_DATA_LOCAL = '../api/local';
var KEY_ENTER = 13;
var pgtransition = 'slide';
var id = 0;

/**
 * Function responsável por carregar a lista de Ambiente. 
 * Ela busca todos os locais cadastrados na base de dados.
 **/
function loadItems(){
	// Limpa o elemento da lista
	$("#listAmbiente").empty();
	/**
	 * Consulta a base de dados através do AmbienteController. 
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
		// Finaliza a barra de progresso iniciado ao acessar a pagina Ambiente.
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
	$("#listAmbiente").append(
		"<li id=" + item.id + " onclick=\"linkClicked($(this).index())\" >" +
			"<a id='" + Math.random() + "' href='#pgAddAmbiente' >" +
				"<h1>" + item.descricao + "</h1>" +
				"<p>" + item.descricaoLocal + "</p>" +
				"<p>" + (item.status==2?"Inativo":"<span style='color: blue;'>Ativo</span>") + "</p>" +
			"</a>" +
		"</li>");
	$('#listAmbiente').listview('refresh');
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
 * @Param Ambiente.java
 * @Param Boolean
 **/
function saveChange(data, isNew){
	$("#listAmbiente").empty();
	if(isNew){
		/**
		 * Insere um novo registro através do AmbienteController. 
		 * A function xhrPost se encontra no arquivo util.js
		 **/ 
		xhrPost(REST_DATA, data, function(item){
			console.log('create: ', data);
			// recarrega os dados na lista e exibe na tela Ambiente
			loadItems();
			// Deixa a tela de alterar/incluir/deletar limpa para proximas utilizações
			pgAddAmbienteClear();
			toastr.success('Ambiente salvo com sucesso.', '');
		}, function(err){
			toastr.success('Ocorreu um erro durante a operação.', '');
			console.error(err);
		});
	} else {
		/**
		 * Altera um registro através do AmbienteController. 
		 * A function xhrPut se encontra no arquivo util.js
		 **/
		xhrPut(REST_DATA, data, function(){
			console.log('update: ', data);
			// recarrega os dados na lista e exibe na tela Ambiente
			loadItems();
			// Deixa a tela de alterar/incluir/deletar limpa para proximas utilizações
			pgAddAmbienteClear();
			toastr.success('Ambiente salvo com sucesso.', '');
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
	pgAddAmbienteClear();
	getPopularLocal();
	// Deixa o botão excluir invisivel.
	desabilitarExcluir();
	e.preventDefault();
	e.stopImmediatePropagation();
	$('#pgAddAmbiente').data('from', 'pgAmbiente');
	$.mobile.changePage('#pgAddAmbiente', {transition: pgtransition});
});

/**
 * Sai da tela de alterar/incluir/deletar de ambiente.
 *
 **/
$('#pgAddBack').on('click', function (e) {
	if(id!=0){
		desabilitarExcluir();
	}
	pgAddAmbienteClear();
	e.preventDefault();
	e.stopImmediatePropagation();
	var pgFrom = $('#pgAddAmbiente').data('from');
	$.mobile.changePage('#pgAmbiente', {transition: pgtransition});
});

/**
 * Botão de salvar um ambiente novo ou alterado.
 * Nesse momento também é realizado a validação dos campos obrigatórios
 *
 **/
$('#pgAddAmbienteSave').on('click', function (e) {
	e.preventDefault();
	e.stopImmediatePropagation();
	var AmbienteRec;
	// Carrega a variável AmbienteRec, de acordo com os campos preenchidos na tela.
	AmbienteRec = pgAddAmbienteGetRec();
	// valida campos Obrigatórios
	if(AmbienteRec.descricao==""){
		toastr.success('Descrição é obrigatório.', '');
		return null;
	}else if(AmbienteRec.status=="0"){
		toastr.success('Status é obrigatório.', '');
		return null;
	}else if(AmbienteRec.idLocal=="0"){
		toastr.success('Local é obrigatório.', '');
		return null;
	}else if(AmbienteRec.temperaturaMinima==""){
		toastr.success('Temperatura Mínima é obrigatório.', '');
		return null;
	}else if(AmbienteRec.temperaturaMaxima==""){
		toastr.success('Tempreratura Máxima é obrigatório.', '');
		return null;
	}else if(parseInt(AmbienteRec.temperaturaMaxima) < parseInt(AmbienteRec.temperaturaMinima)){
		toastr.success('Temperatura Mínima deve ser menor ou igual a Temperatura Máxima.', '');
		return null;
	}
	// Caso id=0, esta criando novo ambiente, caso contrário, esta alterando um ambiente.
	if(id==0){
		saveChange(AmbienteRec, true);
	}else {
		AmbienteRec.id= id;
		saveChange(AmbienteRec, false);
	}
	// Limpando campos da tela inserir/alterar/excluir
	pgAddAmbienteClear();
	// Retornar a tela ambiente.
	$('#pgAddBack').click();
});

/**
 * Quando criado um novo ambiente, o botão excluir deve estar invisivel.
 *
 **/
function desabilitarExcluir(){
	$('#btnExclui').remove();
	$("#btnSalve").removeClass("ui-block-a");
	$("#ulOpcoes").removeClass("ui-grid-solo");
}

/**
 * Quando alterado/deletado um ambiente, o botão excluir deve estar visivel.
 *
 **/
function habilitarExcluir(){
	$("#ulOpcoes").addClass("ui-grid-a");
	$("#btnSalve").addClass("ui-block-a");
	$("<li id='btnExclui' class='ui-block-b'>" +
		"<a  href='#popupDialog' data-rel='popup' data-position-to='window' data-transition='pop' data-icon='delete' " +
		"aria-haspopup='true' aria-owns='popupDialog' aria-expanded='false' class='ui-link ui-btn ui-icon-delete ui-btn-icon-top' " +
		">Excluir</a>" +
	"</li>").appendTo('#ulOpcoes');
	
	$('#pgAddDelete').on('click', function (e) {
		$("#listAmbiente").empty();
		e.preventDefault();
		e.stopImmediatePropagation();
		xhrDelete(REST_DATA + '?id=' + id, function(){
			// recarrega os dados na lista e exibe na tela Ambiente
			id = 0;
			loadItems();
			// Deixa a tela de alterar/incluir/deletar limpa para proximas utilizações
			pgAddAmbienteClear();
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
 * @param Ambiente.java
 **/
linkClicked = function (index) {
	// Quando o objeto já existir a tela deve exibir o butão excluir
	habilitarExcluir();
	// id é uma variavel global. Ela recebe o id do objeto selecionado na lista da tela ambiente.
    id=$('#listAmbiente li').get(index).id;
	if(id!=0){
	getPopularLocal();
	
	}
  }

function getPopularLocal(){
	
	$("#pgAddComboLocal").append('<option value="0" >Escolha uma opção...</option>');
	
	xhrGet(REST_DATA_LOCAL+"?id=0", function(LocalRec){
		var receivedItems = LocalRec.body || [];
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
			addItemLocal(items[i]);
		}
		
		if(id!=0){
			getPopularAmbiente();
		} else {
			$("#pgAddComboLocal").val('0');
			$("#pgAddComboLocal").change();
		}
	}, function(err){
		console.error(err);
	});
}

function getPopularAmbiente(){
		/**
		 * Busca o objeto ambiente pelo id atrevés do AmbienteController. 
		 * A function xhrGet se encontra no arquivo util.js
		 **/
		xhrGet(REST_DATA+"?id="+id, function(AmbienteRec){
		console.log('get: ', id);
		// Popula a tela com o objeto pesquisado no controller
		$('#pgAddAmbienteDescricao').val(AmbienteRec.descricao);
		$('#pgAddAmbienteStatus').val(AmbienteRec.status);
		$('#pgAddComboLocal').val(AmbienteRec.idLocal);
		$('#pgAddAmbienteTempMini').val(AmbienteRec.temperaturaMinima);
		$('#pgAddAmbienteTempMed').val(AmbienteRec.temperaturaMedia);
		$('#pgAddAmbienteTempMax').val(AmbienteRec.temperaturaMaxima);
		
		// foi necessario pois o combo nao estava atualizando.
		$("#pgAddAmbienteStatus").change();
		$("#pgAddComboLocal").change();
	}, function(err){
		console.error(err);
	});
}

/**
 * Adiciona os itens a listview e também cria um link para cada item. 
 * Esse link é utilizado na alteração do registro.
 * 
 **/
function addItemLocal(item){
	//if(item.status=='1'){
	$("#pgAddComboLocal").append(
			'<option value='+item.id+' >'+item.descricao+'</option>');
	//}	
}

/**
 * Popula o objeto AmbienteRec com os valores cadastrados na tela.
 * @Return Ambiente.java
 **/
function pgAddAmbienteGetRec() {
	var AmbienteRec = {};
	AmbienteRec.descricao = $('#pgAddAmbienteDescricao').val().trim();
	AmbienteRec.status = $('#pgAddAmbienteStatus').val().trim();
	AmbienteRec.idLocal = $('#pgAddComboLocal').val().trim();
	AmbienteRec.temperaturaMinima = $('#pgAddAmbienteTempMini').val().trim();
	AmbienteRec.temperaturaMedia = $('#pgAddAmbienteTempMed').val().trim();
	AmbienteRec.temperaturaMaxima = $('#pgAddAmbienteTempMax').val().trim();
	
	return AmbienteRec;
}

/**
 * Limpa a tela inserir/alterar/excluir e a variavel global id.
 * 
 **/
function pgAddAmbienteClear() {
	$('#pgAddAmbienteDescricao').val('');
	$('#pgAddAmbienteStatus').val('0');
	$("#pgAddAmbienteStatus").change();
	$("#pgAddComboLocal").empty();
	$("#pgAddComboLocal").change();
	$('#pgAddAmbienteTempMini').val('');
	$('#pgAddAmbienteTempMed').val('');
	$('#pgAddAmbienteTempMax').val('');
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