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
import temp.ambiente.dao.AmbienteDAO;
import temp.ambiente.dao.SensorDAO;
import temp.ambiente.vo.Ambiente;
import temp.ambiente.vo.Sensor;

@Path("/ambiente")
public class AmbienteController {
	
	@POST
	public Response create(@FormParam("idLocal") Long idLocal,
						   @FormParam("descricao") String descricao,
						   @FormParam("temperaturaMinima") Integer temperaturaMinima,
			               @FormParam("temperaturaMaxima") Integer temperaturaMaxima,
			               @FormParam("status") char status) {
		Ambiente ambiente = new Ambiente();
		ambiente.setIdLocal(idLocal);
		ambiente.setDescricao(descricao);
		ambiente.setTemperaturaMinima(temperaturaMinima);
		if(temperaturaMaxima!=null&&temperaturaMinima!=null){
		ambiente.setTemperaturaMedia((temperaturaMaxima+temperaturaMinima)/2);
		}
		ambiente.setTemperaturaMaxima(temperaturaMaxima);
		ambiente.setStatus(status);
		try {
			AmbienteDAO dao = new AmbienteDAO();
			dao.createAmbiente(ambiente);
			return Response.ok(ambiente.toString()).build();
		} catch (Exception e) {
			e.printStackTrace();			
			return Response.status(javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR).build();
		} 
	}

	@DELETE
	public Response delete(@QueryParam("id") Long id) {
		try {
			AmbienteDAO ambienteDAO = new AmbienteDAO();
			SensorDAO sensorDAO = new SensorDAO();
			Ambiente ambiente = ambienteDAO.findAmbiente(id);
			if (ambiente != null) {
				List<Sensor> listaSensor = sensorDAO.findSensorByIdAmbiente(ambiente.getId());
				for(int i=0; i<listaSensor.size(); i++){
					sensorDAO.deleteHistoricoBySensor(listaSensor.get(i).getId());
				}
				sensorDAO.deleteSensorByAmbiente(ambiente.getId());
				ambienteDAO.deleteAmbiente(ambiente);
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
							@FormParam("idLocal") Long idLocal,
							@FormParam("descricao") String descricao,
							@FormParam("temperaturaMinima") Integer temperaturaMinima,
							@FormParam("temperaturaMaxima") Integer temperaturaMaxima,
							@FormParam("status") char status) {
		try {
			AmbienteDAO dao = new AmbienteDAO();
			Ambiente ambiente = dao.findAmbiente(id);
			if (ambiente != null) {
				ambiente.setIdLocal(idLocal);
				ambiente.setDescricao(descricao);
				ambiente.setTemperaturaMinima(temperaturaMinima);
				if(temperaturaMaxima!=null&&temperaturaMinima!=null){
					ambiente.setTemperaturaMedia((temperaturaMaxima+temperaturaMinima)/2);
					}
				ambiente.setTemperaturaMaxima(temperaturaMaxima);
				ambiente.setStatus(status);
				dao.updateAmbiente(ambiente);
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
		Ambiente ambiente = null;
		AmbienteDAO ambienteDAO = new AmbienteDAO();
		try {
			if (id == 0) {
				List<Object[]> list = ambienteDAO.listAmbiente();
				if(list.size() > 0){
					String json = "";
					JSONObject obj = new JSONObject();
					for(int i=0;i<list.size();i++){
						obj = new JSONObject();  
						obj.put("id", list.get(i)[0]);
						obj.put("idLocal", list.get(i)[1]);
						obj.put("descricao", list.get(i)[2]);
						obj.put("temperaturaMedia", list.get(i)[3]);
						obj.put("temperaturaMinima", list.get(i)[4]);
						obj.put("temperaturaMaxima", list.get(i)[5]);
						obj.put("status", list.get(i)[6]);
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
				ambiente = ambienteDAO.findAmbiente(id);
				
				if (ambiente != null) {
					return Response.ok(ambiente.toString()).build();
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