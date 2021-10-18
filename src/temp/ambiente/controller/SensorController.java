package temp.ambiente.controller;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import temp.ambiente.dao.SensorDAO;
import temp.ambiente.vo.Sensor;

@Path("/sensor")
public class SensorController {
	
	@POST
	public Response create(@FormParam("idAmbiente") Long idAmbiente,
						   @FormParam("descricao") String descricao,
						   @FormParam("deviceId") String deviceId,
						   @FormParam("temperatura") Integer temperatura,
			               @FormParam("status") char status) {
		Sensor sensor = new Sensor();
		sensor.setIdAmbiente(idAmbiente);
		sensor.setDescricao(descricao);
		sensor.setDeviceId(deviceId);
		sensor.setStatus(status);
		sensor.setTemperatura(temperatura);
		try {
			SensorDAO dao = new SensorDAO();
			dao.createSensor(sensor);
			return Response.ok(sensor.toString()).build();
		} catch (Exception e) {
			e.printStackTrace();			
			return Response.status(javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR).build();
		} 
	}

	@DELETE
	public Response delete(@QueryParam("id") Long id) {
		try {
			SensorDAO sensorDAO = new SensorDAO();
			Sensor sensor = sensorDAO.findSensor(id);
			if (sensor != null) {
				sensorDAO.deleteHistoricoBySensor(sensor.getId());
				sensorDAO.deleteSensor(sensor);
				return Response.ok().build();
			} else {
				return Response.status(javax.ws.rs.core.Response.Status.NOT_FOUND).build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PUT
	public Response update(@FormParam("id") Long id,
							@FormParam("idAmbiente") Long idAmbiente,
							@FormParam("descricao") String descricao,
							@FormParam("deviceId") String deviceId,
							@FormParam("temperatura") Integer temperatura,
							@FormParam("status") char status) {
		try {
			SensorDAO dao = new SensorDAO();
			Sensor sensor = dao.findSensor(id);
			if (sensor != null) {
				sensor.setIdAmbiente(idAmbiente);
				sensor.setDescricao(descricao);
				sensor.setDeviceId(deviceId);
				sensor.setTemperatura(temperatura);
				sensor.setStatus(status);
				sensor.setTemperatura(temperatura);
				dao.updateSensor(sensor);
				return Response.ok().build();
			} else {
				return Response.status(javax.ws.rs.core.Response.Status.NOT_FOUND).build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(@QueryParam("id") Long id) {
		Sensor sensor = null;
		SensorDAO sensorDAO = new SensorDAO();
		try {
			if (id == 0) {
				List<Object[]> list = sensorDAO.listSensor();
				if(list.size() > 0){
					String json = "";
					JSONObject obj = new JSONObject();
					for(int i=0;i<list.size();i++){
						obj = new JSONObject();  
						obj.put("id", list.get(i)[0]);
						obj.put("idAmbiente", list.get(i)[1]);
						obj.put("descricao", list.get(i)[2]);
						obj.put("deviceId", list.get(i)[3]);
						obj.put("temperatura", list.get(i)[4]);
						obj.put("status", list.get(i)[5]);
						obj.put("descricaoAmbiente", list.get(i)[6]);
						obj.put("descricaoLocal", list.get(i)[7]);
						json += obj;
						if((i + 1) != list.size()){
							json += ",";
						}
					}
					json = "{\"id\":\"all\", \"body\":[" + json + "]}";
					return Response.ok(json).build();
				} else {
					return Response.status(javax.ws.rs.core.Response.Status.NOT_FOUND).build();
				}
				
			} else {
				sensor = sensorDAO.findSensor(id);
				
				if (sensor != null) {
					return Response.ok(sensor.toString()).build();
				} else {
					return Response.status(javax.ws.rs.core.Response.Status.NOT_FOUND).build();
			    }
			}
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR).build();
		}	
	}
}