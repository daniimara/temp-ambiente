package temp.ambiente.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import temp.ambiente.vo.Ambiente;

public class AmbienteDAO extends GenericDAO<Ambiente>{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
    public AmbienteDAO() {
		super(Ambiente.class);
		genericDAO();
	}

	public void createAmbiente(Ambiente ambiente) throws Exception {
        beginTransaction();
        save(ambiente);
        commitAndCloseTransaction();
    }
 
    public void updateAmbiente(Ambiente ambiente) throws Exception {
        try {
        	Ambiente ambienteNew = find(ambiente.getId());
        	ambienteNew.setDescricao(ambiente.getDescricao());
        	ambienteNew.setStatus(ambiente.getStatus());
        	ambienteNew.setIdLocal(ambiente.getIdLocal());
        	beginTransaction();
        	update(ambienteNew);
            commitAndCloseTransaction();
   	    } catch (Exception e) {
   	    	System.out.println(e.getMessage());
   	        rollback();
   	        throw new Exception();
   	    }
    }
 
    public void deleteAmbiente(Ambiente ambiente) throws Exception{
        beginTransaction();
        delete(ambiente.getId(),Ambiente.class);
        commitAndCloseTransaction();
    }
    
    public void deleteAmbienteByLocal(Long idLocal) throws Exception{
        beginTransaction();
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("idLocal", idLocal);
        executeQuery("delete from Ambiente o " 
                  + "where o.idLocal = :idLocal",parameters);
        commitAndCloseTransaction();
    }
 
    public Ambiente findAmbiente(Long id) throws Exception {
        Ambiente ambiente = find(id);
        return ambiente;
    }
    
    public List<Ambiente> findAmbienteByIdLocal(Long idLocal) throws Exception {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("idLocal", idLocal);
        List<Ambiente> result = findResult(Ambiente.FIND_AMBIENTE_BY_ID_LOCAL, parameters);
        return result;
    }
 
    public List<Ambiente> listAll() throws Exception {
        List<Ambiente> result = findAll();
        return result;
    }
    
    public List<Object[]> listAmbiente() throws Exception {
        Map<String, Object> parameters = new HashMap<String, Object>();
        String query = "SELECT a.id, a.id_local, a.descricao, " +
        "a.temperatura_media, a.temperatura_minima, a.temperatura_maxima, a.status, l.descricao " +
		"FROM AMBIENTE a " +
		"INNER JOIN LOCAL l ON l.id = a.id_local " +
		"ORDER BY a.descricao ASC";
        List<Object[]> result = findResultObject(query, parameters);
        return result;
    }
}