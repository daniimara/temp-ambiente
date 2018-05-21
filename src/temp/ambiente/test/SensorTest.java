package temp.ambiente.test;

import java.util.List;

import temp.ambiente.dao.AmbienteDAO;
import temp.ambiente.dao.SensorDAO;
import temp.ambiente.vo.Ambiente;
import temp.ambiente.vo.Sensor;

public class SensorTest {

	private static Sensor sensor;
	private static SensorDAO sensorDAO;
	private static AmbienteDAO ambienteDAO;
	
    public void inicializa() {
        sensor = new Sensor();
        sensorDAO = new SensorDAO();
        ambienteDAO = new AmbienteDAO();
    }
	
	public void testCreate() throws Exception {
		Ambiente ambiente = new Ambiente();
		ambiente = ambienteDAO.findAmbiente(Long.valueOf(1));
		sensor.setIdAmbiente(ambiente.getId());
		sensor.setDescricao("Sensor Teste JUnit");
		sensor.setStatus('1');
		sensor.setTemperatura(13);
		sensorDAO.createSensor(sensor);
		
		if(sensor.getId() > 0){
			System.out.println("Sensor Criado id = " + sensor.getId());
		} else {
			throw new RuntimeException();
		}
	}
	
	public void testSelect() throws Exception {
		List<Sensor> sensors = sensorDAO.listAll();
		
		if(sensors.size() > 0){
			System.out.println("Lista de tamanho = " + sensors.size());
		} else {
			throw new RuntimeException();
		}
	}

	public void testSelectUnit() throws Exception {
		sensorDAO.findSensor(sensor.getId());
		
		if(sensor != null){
			System.out.println("Pesquisando pelo ID, id = " + sensor.getId());
		} else {
			throw new RuntimeException();
		}
	}
	
	public void testUpdate() throws Exception {
		sensor = sensorDAO.findSensor(sensor.getId());
		String descricaoAnterior = sensor.getDescricao();
		sensor.setDescricao("Alterado id = " + sensor.getId());
		sensorDAO.updateSensor(sensor);
		sensor = sensorDAO.findSensor(sensor.getId());
		
		if(!descricaoAnterior.equals(sensor.getDescricao())){
			System.out.println("Descricao Anterior: " + descricaoAnterior + " - Atual: " + sensor.getDescricao());
		} else {
			throw new RuntimeException();
		}
	}
	
	public void testDelete() throws Exception {
		Long id = sensor.getId();
		sensorDAO.deleteSensor(sensor); 
		sensor = sensorDAO.findSensor(sensor.getId());
		
		if(sensor == null){
			System.out.println("Sensor Deletado id = " + id);
		} else {
			throw new RuntimeException();
		}
	}
	
}