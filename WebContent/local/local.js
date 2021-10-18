// local.js

var REST_DATA = '../api/local';
var KEY_ENTER = 13;
var pgtransition = 'slide';
var id = 0;

/**
 * Function responsável por carregar a lista de Local. 
 * Ela busca todos os locais cadastrados na base de dados.
 **/
function loadItems(){
	// Limpa o elemento da lista
	$("#listLocal").empty();
	/**
	 * Consulta a base de dados através do LocalController. 
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
		// Finaliza a barra de progresso iniciado ao acessar a pagina Local.
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
	$("#listLocal").append(
		"<li id=" + item.id + " onclick=\"linkClicked($(this).index())\" >" +
			"<a id='" + Math.random() + "' href='#pgAddLocal' >" +
				"<h1>" + item.descricao + "</h1>" +
				"<p>" + (item.status==2?"Inativo":"<span style='color: blue;'>Ativo</span>") + "</p>" +
			"</a>" +
		"</li>");
	$('#listLocal').listview('refresh');
	
}

/**
 * Inicia a barra de progresso. Utilizada quando entra na tela local.
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
	// Atualiza a lista de local.
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
 * @Param Local.java
 * @Param Boolean
 **/
function saveChange(data, isNew){
	$("#listLocal").empty();
	if(isNew){
		/**
		 * Insere um novo registro através do LocalController. 
		 * A function xhrPost se encontra no arquivo util.js
		 **/ 
		xhrPost(REST_DATA, data, function(item){
			console.log('create: ', data);
			// recarrega os dados na lista e exibe na tela Local
			loadItems();
			// Deixa a tela de alterar/incluir/deletar limpa para proximas utilizações
			pgAddLocalClear();
			toastr.success('Local salvo com sucesso.', '');
		}, function(err){
			toastr.success('Ocorreu um erro durante a operação.', '');
			console.error(err);
		});
	} else {
		/**
		 * Altera um registro através do LocalController. 
		 * A function xhrPut se encontra no arquivo util.js
		 **/
		xhrPut(REST_DATA, data, function(){
			console.log('update: ', data);
			// recarrega os dados na lista e exibe na tela Local
			loadItems();
			// Deixa a tela de alterar/incluir/deletar limpa para proximas utilizações
			pgAddLocalClear();
			toastr.success('Local salvo com sucesso.', '');
		}, function(err){
			toastr.success('Ocorreu um erro durante a operação.', '');
			console.error(err);
		});
	}
	// Sai da tela de alterar/incluir/deletar e retorna para a local.
	$('#pgAddBack').click();
}

/**
 * Entra na tela de alterar/incluir/deletar de local.
 *
 **/
$('#pgAddNovo').on('click', function (e) {
	// Deixa a tela de alterar/incluir/deletar limpa para utilizações
	pgAddLocalClear();
	// Deixa o botão excluir invisivel.
	desabilitarExcluir();
	e.preventDefault();
	e.stopImmediatePropagation();
	$('#pgAddLocal').data('from', 'pgLocal');
	$.mobile.changePage('#pgAddLocal', {transition: pgtransition});
});

/**
 * Sai da tela de alterar/incluir/deletar de local.
 *
 **/
$('#pgAddBack').on('click', function (e) {
	if(id!=0){
		desabilitarExcluir();
	}
	e.preventDefault();
	e.stopImmediatePropagation();
	var pgFrom = $('#pgAddLocal').data('from');
	$.mobile.changePage('#pgLocal', {transition: pgtransition});
});

/**
 * Botão de salvar um local novo ou alterado.
 * Nesse momento também é realizado a validação dos campos obrigatórios
 *
 **/
$('#pgAddLocalSave').on('click', function (e) {
	e.preventDefault();
	e.stopImmediatePropagation();
	var LocalRec;
	// Carrega a variável LocalRec, de acordo com os campos preenchidos na tela.
	LocalRec = pgAddLocalGetRec();
	// valida campos Obrigatórios
	if(LocalRec.descricao==""){
		toastr.success('Descrição é obrigatório.', '');
		return null;
	}else if(LocalRec.status=="0"){
		toastr.success('Status é obrigatório.', '');
		return null;
	}
	// Caso id=0, esta criando novo local, caso contrário, esta alterando um local.
	if(id==0){
		saveChange(LocalRec, true);
	}else {
		LocalRec.id= id;
		saveChange(LocalRec, false);
	}
	// Limpando campos da tela inserir/alterar/excluir
	pgAddLocalClear();
	// Retornar a tela local.
	$('#pgAddBack').click();
});

/**
 * Quando criado um novo local, o botão excluir deve estar invisivel.
 *
 **/
function desabilitarExcluir(){
	$('#btnExclui').remove();
	$("#btnSalve").removeClass("ui-block-a");
	$("#ulOpcoes").removeClass("ui-grid-solo");
}

/**
 * Quando alterado/deletado um local, o botão excluir deve estar visivel.
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
		$("#listLocal").empty();
		e.preventDefault();
		e.stopImmediatePropagation();
		xhrDelete(REST_DATA + '?id=' + id, function(){
			// recarrega os dados na lista e exibe na tela Local
			id = 0;
			loadItems();
			// Deixa a tela de alterar/incluir/deletar limpa para proximas utilizações
			pgAddLocalClear();
			toastr.success('Local excluído com sucesso.', '');
		}, function(err){
			toastr.success('Ocorreu um erro durante a operação.', '');
			console.error(err);
		});
		// Retornar a tela local.
			$('#pgAddBack').click();
	});
}
	
/**
 * Esta function é resposável por popular a tela de inserir/alterar/excluir
 * Nela o item selecionado na lista é carregado na tela.
 * @param Local.java
 **/
linkClicked = function (index) {
		// Quando o objeto já existir a tela deve exibir o butão excluir
		habilitarExcluir();
		// id é uma variavel global. Ela recebe o id do objeto selecionado na lista da tela local.
	    id=$('#listLocal li').get(index).id;
	    /**
		 * Busca o objeto local pelo id atrevés do LocalController. 
		 * A function xhrGet se encontra no arquivo util.js
		 **/
		LocalRec =xhrGet(REST_DATA+"?id="+id, function(LocalRec){
		console.log('get: ', id);
		// Popula a tela com o objeto pesquisado no controller
		$('#pgAddLocalDescricao').val(LocalRec.descricao);
		$('#pgAddLocalStatus').val(LocalRec.status);
		// foi necessario pois o combo nao estava atualizando.
		$("#pgAddLocalStatus").change();
	}, function(err){
		toastr.success('Ocorreu um erro durante a operação.', '');
		console.error(err);
	});    
}

/**
 * Popula o objeto LocalRec com os valores cadastrados na tela.
 * @Return Local.java
 **/
function pgAddLocalGetRec() {
	var LocalRec = {};
	LocalRec.descricao = $('#pgAddLocalDescricao').val().trim();
	LocalRec.status = $('#pgAddLocalStatus').val().trim();
	return LocalRec;
}

/**
 * Limpa a tela inserir/alterar/excluir e a variavel global id.
 * 
 **/
function pgAddLocalClear() {
	$('#pgAddLocalDescricao').val('');
	$('#pgAddLocalStatus').val('0');
	$("#pgAddLocalStatus").change();
	id=0;
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
 * Link para a tela de Local
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