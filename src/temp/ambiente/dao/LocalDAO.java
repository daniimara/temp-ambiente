package temp.ambiente.dao;

import java.util.List;
import temp.ambiente.vo.Local;

public class LocalDAO extends GenericDAO<Local>{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
    public LocalDAO() {
		super(Local.class);
		genericDAO();
	}

	public void createLocal(Local local) throws Exception {
        beginTransaction();
        save(local);
        commitAndCloseTransaction();
    }
 
    public void updateLocal(Local local) throws Exception {
        try {
        	Local localNew = find(local.getId());
        	localNew.setDescricao(local.getDescricao());
        	localNew.setStatus(local.getStatus());
        	beginTransaction();
        	update(localNew);
            commitAndCloseTransaction();
   	    } catch (Exception e) {
   	    	System.out.println(e.getMessage());
   	        rollback();
   	        throw new Exception();
   	    }
    }
 
    public void deleteLocal(Local local) throws Exception{
        beginTransaction();
        delete(local.getId(),Local.class);
        commitAndCloseTransaction();
    }
 
    public Local findLocal(Long id) throws Exception {
        Local local = find(id);
        return local;
    }
 
    public List<Local> listAll() throws Exception {
        List<Local> result = findAll();
        return result;
    }
}