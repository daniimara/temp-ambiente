
var pgtransition = 'slide';

/**
 * Sai da tela de alterar/incluir/deletar de Local.
 *
 **/
$('#pgAddLocalBack').on('click', function (e) {

	e.preventDefault();
	e.stopImmediatePropagation();
	var pgFrom = $('#pgAddlocaInfo').data('from');
	$.mobile.changePage('#pgInfo', {transition: pgtransition});
});

/**
 * Sai da tela de alterar/incluir/deletar de Sensor.
 *
 **/
$('#pgAddSensorBack').on('click', function (e) {

	e.preventDefault();
	e.stopImmediatePropagation();
	var pgFrom = $('#pgAddSensorInfo').data('from');
	$.mobile.changePage('#pgInfo', {transition: pgtransition});
});


/**
 * Sai da tela de alterar/incluir/deletar de ambiente.
 *
 **/
$('#pgAddAmbienteBack').on('click', function (e) {

	e.preventDefault();
	e.stopImmediatePropagation();
	var pgFrom = $('#pgAddAmbienteInfo').data('from');
	$.mobile.changePage('#pgInfo', {transition: pgtransition});
});


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
 * Link para a tela de info Sensor
 *
 **/
$('#linkIndexInfSensor').on('click', function (e) {
	$(location).attr('href', 'index.html');
});
$('#linkLocalInfSensor').on('click', function (e) {
	$(location).attr('href', 'local/local.html');
});
$('#linkAmbienteInfSensor').on('click', function (e) {
	$(location).attr('href', 'ambiente/ambiente.html');
});
$('#linkSensorInfSensor').on('click', function (e) {
	$(location).attr('href', 'sensor/sensor.html');
});
$('#linkInfoSensor').on('click', function (e) {
	$(location).attr('href', 'info.html');
});

/**
 * Link para a tela de info Ambiente
 *
 **/
$('#linkIndexInfAmbiente').on('click', function (e) {
	$(location).attr('href', 'index.html');
});
$('#linkLocalInfAmbiente').on('click', function (e) {
	$(location).attr('href', 'local/local.html');
});
$('#linkAmbienteInfAmbiente').on('click', function (e) {
	$(location).attr('href', 'ambiente/ambiente.html');
});
$('#linkSensorInfAmbiente').on('click', function (e) {
	$(location).attr('href', 'sensor/sensor.html');
});
$('#linkInfoAmbiente').on('click', function (e) {
	$(location).attr('href', 'info.html');
});

/**
 * Link para a tela de info Local
 *
 **/
$('#linkIndexInfLocal').on('click', function (e) {
	$(location).attr('href', 'index.html');
});
$('#linkLocalInfLocal').on('click', function (e) {
	$(location).attr('href', 'local/local.html');
});
$('#linkAmbienteInfLocal').on('click', function (e) {
	$(location).attr('href', 'ambiente/ambiente.html');
});
$('#linkSensorInfLocal').on('click', function (e) {
	$(location).attr('href', 'sensor/sensor.html');
});
$('#linkInfoLocal').on('click', function (e) {
	$(location).attr('href', 'info.html');
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