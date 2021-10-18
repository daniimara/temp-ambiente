package temp.ambiente.test;

import java.util.List;
import temp.ambiente.dao.LocalDAO;
import temp.ambiente.vo.Local;

public class LocalTest {

	private static Local local;
	private static LocalDAO localDAO;
	
    public void inicializa() {
        local = new Local();
        localDAO = new LocalDAO();
    }
	
	public void testCreate() throws Exception {
		local.setDescricao("Local Teste JUnit");
		local.setStatus('1');
		localDAO.createLocal(local);
		
		if(local.getId() > 0){
			System.out.println("Local Criado id = " + local.getId());
		} else {
			throw new RuntimeException();
		}
	}
	
	public void testSelect() throws Exception {
		List<Local> locais = localDAO.listAll();
		
		if(locais.size() > 0){
			System.out.println("Lista de tamanho = " + locais.size());
		} else {
			throw new RuntimeException();
		}
	}

	public void testSelectUnit() throws Exception {
		local = localDAO.findLocal(local.getId());
		
		if(local != null){
			System.out.println("Pesquisando pelo ID, id = " + local.getId());
		} else {
			throw new RuntimeException();
		}
	}
	
	public void testUpdate() throws Exception {
		localDAO.findLocal(local.getId());
		String descricaoAnterior = local.getDescricao();
		local.setDescricao("Alterado id = " + local.getId());
		localDAO.updateLocal(local);
		local = localDAO.findLocal(local.getId());
		
		if(!descricaoAnterior.equals(local.getDescricao())){
			System.out.println("Descricao Anterior: " + descricaoAnterior + " - Atual: " + local.getDescricao());
		} else {
			throw new RuntimeException();
		}
	}
	
	public void testDelete() throws Exception {
		Long id = local.getId();
		localDAO.deleteLocal(local); 
		local = localDAO.findLocal(local.getId());
		
		if(local == null){
			System.out.println("Local Deletado id = " + id);
		} else {
			throw new RuntimeException();
		}
	}
}