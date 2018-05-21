package temp.ambiente.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import temp.ambiente.vo.Sensor;

public class SensorDAO extends GenericDAO<Sensor>{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
    public SensorDAO() {
		super(Sensor.class);
		genericDAO();
	}

	public void createSensor(Sensor sensor) throws Exception {
        beginTransaction();
        save(sensor);
        commitAndCloseTransaction();
    }
 
    public void updateSensor(Sensor sensor) throws Exception {
        try {
        	Sensor sensorNew = find(sensor.getId());
        	sensorNew.setDescricao(sensor.getDescricao());
        	sensorNew.setStatus(sensor.getStatus());
        	beginTransaction();
        	update(sensorNew);
            commitAndCloseTransaction();
   	    } catch (Exception e) {
   	    	System.out.println(e.getMessage());
   	        rollback();
   	        throw new Exception();
   	    }
    }
 
    public void deleteSensor(Sensor sensor) throws Exception{
        beginTransaction();
        delete(sensor.getId(),Sensor.class);
        commitAndCloseTransaction();
    }
    
    public void deleteSensorByAmbiente(Long idAmbiente) throws Exception{
        beginTransaction();
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("idAmbiente", idAmbiente);
        executeQuery("delete from Sensor o " 
                  + "where o.idAmbiente = :idAmbiente",parameters);
        commitAndCloseTransaction();
    }
    
    public void deleteHistoricoBySensor(Long idSensor) throws Exception{
        beginTransaction();
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("idSensor", idSensor);
        executeQuery("delete from HistoricoSensor o " 
                  + "where o.idSensor = :idSensor",parameters);
        commitAndCloseTransaction();
    }
 
    public Sensor findSensor(Long id) throws Exception {
        Sensor sensor = find(id);
        return sensor;
    }
    
    public List<Sensor> findSensorByIdAmbiente(Long idAmbiente) throws Exception {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("idAmbiente", idAmbiente);
        List<Sensor> result = findResult(Sensor.FIND_SENSOR_BY_ID_AMBIENTE, parameters);
        return result;
    }
 
    public List<Sensor> listAll() throws Exception {
        List<Sensor> result = findAll();
        return result;
    }
    
    public List<Object[]> listSensorAlerta() throws Exception {
        Map<String, Object> parameters = new HashMap<String, Object>();
        String query = "SELECT l.descricao AS descricao_local, a.descricao AS descricao_ambiente, s.descricao AS descricao_sensor, " +
			"a.temperatura_media, a.temperatura_minima, a.temperatura_maxima, " +
			"s.temperatura " +
			"FROM LOCAL l " +
			"INNER JOIN AMBIENTE a ON l.id = a.id_local " +
			"INNER JOIN SENSOR s ON a.id = s.id_ambiente " +
			"WHERE l.status = 1 AND a.status = 1 AND s.status = 1 " +
			"AND s.temperatura NOT BETWEEN a.temperatura_minima AND a.temperatura_maxima " +
			"ORDER BY s.descricao ASC";
        List<Object[]> result = findResultObject(query, parameters);
        return result;
    }
    
    public List<Object[]> listSensor() throws Exception {
        Map<String, Object> parameters = new HashMap<String, Object>();
        String query = "SELECT s.id, s.id_ambiente, s.descricao AS descricao_sensor, s.device_id, s.temperatura, s.status, " +
			"a.descricao AS descricao_ambiente, l.descricao AS descricao_local " +
			"FROM SENSOR s " +
			"INNER JOIN AMBIENTE a ON a.id = s.id_ambiente " +
			"INNER JOIN LOCAL l ON l.id = a.id_local " +
			"ORDER BY s.descricao ASC";
        List<Object[]> result = findResultObject(query, parameters);
        return result;
    }
}