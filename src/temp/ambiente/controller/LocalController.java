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

import temp.ambiente.dao.AmbienteDAO;
import temp.ambiente.dao.LocalDAO;
import temp.ambiente.dao.SensorDAO;
import temp.ambiente.vo.Ambiente;
import temp.ambiente.vo.Local;
import temp.ambiente.vo.Sensor;

@Path("/local")
public class LocalController {
	
	public LocalController(){
	}

	@POST
	public Response create(@FormParam("descricao") String descricao, @FormParam("status") char status) {
		Local local = new Local();
		local.setDescricao(descricao);
		local.setStatus(status);
		try {
			LocalDAO dao = new LocalDAO();
			dao.createLocal(local);
			return Response.ok(local.toString()).build();
		} catch (Exception e) {
			e.printStackTrace();			
			return Response.status(javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR).build();
		} 
	}

	@DELETE
	public Response delete(@QueryParam("id") long id) {
		try {
			LocalDAO localDAO = new LocalDAO();
			AmbienteDAO ambienteDAO = new AmbienteDAO();
			SensorDAO sensorDAO = new SensorDAO();
			Local local = localDAO.findLocal(id);
			if (local != null) {
				List<Ambiente> listaAmbiente = ambienteDAO.findAmbienteByIdLocal(local.getId());
				List<Sensor> listaSensor = null;
				for(int i=0; i<listaAmbiente.size(); i++){
					listaSensor = sensorDAO.findSensorByIdAmbiente(listaAmbiente.get(i).getId());
					for(int j=0; j<listaSensor.size(); j++){
						sensorDAO.deleteHistoricoBySensor(listaSensor.get(j).getId());
					}
					sensorDAO.deleteSensorByAmbiente(listaAmbiente.get(i).getId());
				}
				ambienteDAO.deleteAmbienteByLocal(local.getId());
				localDAO.deleteLocal(local);
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
	public Response update(@FormParam("id") long id,
			@FormParam("descricao") String descricao,
			@FormParam("status") char status) {
		try {
			LocalDAO dao = new LocalDAO();
			Local local = dao.findLocal(id);
			if (local != null) {
				local.setDescricao(descricao);
				local.setStatus(status);
				dao.updateLocal(local);
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
	public Response get(@QueryParam("id") long id) {
		Local local = null;
		try {
			LocalDAO dao = new LocalDAO();
			if (id == 0) {
				List<Local> list = dao.listAll();
				if(list.size() > 0){
		            String json = "{\"id\":\"all\", \"body\":" + list.toString() + "}";
					return Response.ok(json).build();
				} else {
					return Response.status(javax.ws.rs.core.Response.Status.NOT_FOUND).build();
				}
			} else {
				local = dao.findLocal(id);
				if (local != null){
					return Response.ok(local.toString()).build();
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