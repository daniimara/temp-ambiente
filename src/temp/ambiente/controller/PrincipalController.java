package temp.ambiente.controller;

import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.json.JSONObject;
import temp.ambiente.dao.SensorDAO;

@Path("/principal")
public class PrincipalController {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get() {
		SensorDAO sensorDAO = new SensorDAO();
		try {
			List<Object[]> list = sensorDAO.listSensorAlerta();
			if(list.size() > 0){
				String json = "";
				JSONObject obj = new JSONObject();
				for(int i=0;i<list.size();i++){
					obj = new JSONObject();  
					obj.put("descricaoLocal", list.get(i)[0]);
					obj.put("descricaoAmbiente", list.get(i)[1]);
					obj.put("descricaoSensor", list.get(i)[2]);
					obj.put("temperaturaMedia", list.get(i)[3]);
					obj.put("temperaturaMinima", list.get(i)[4]);
					obj.put("temperaturaMaxima", list.get(i)[5]);
					obj.put("temperaturaSensor", list.get(i)[6]);
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
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR).build();
		}
	}
}