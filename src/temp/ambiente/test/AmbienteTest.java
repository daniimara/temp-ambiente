package temp.ambiente.test;

import java.util.List;
import temp.ambiente.dao.AmbienteDAO;
import temp.ambiente.dao.LocalDAO;
import temp.ambiente.vo.Ambiente;
import temp.ambiente.vo.Local;

public class AmbienteTest {

	private static Ambiente ambiente;
	private static AmbienteDAO ambienteDAO;
	private static LocalDAO localDAO;
	
    public void inicializa() {
        ambiente = new Ambiente();
        ambienteDAO = new AmbienteDAO();
        localDAO = new LocalDAO();
    }
	
	public void testCreate() throws Exception {
		Local local = new Local();
		local = localDAO.findLocal(Long.valueOf(1));
		ambiente.setIdLocal(local.getId());
		
		ambiente.setDescricao("Ambiente Teste JUnit");
		ambiente.setStatus('1');
		ambiente.setTemperaturaMedia(20);
		ambiente.setTemperaturaMinima(11);
		ambiente.setTemperaturaMaxima(12);
		ambienteDAO.createAmbiente(ambiente);
		
		if(ambiente.getId() > 0){
			System.out.println("Ambiente Criado id = " + ambiente.getId());
		} else {
			throw new RuntimeException();
		}
	}
	
	public void testSelect() throws Exception {
		List<Ambiente> ambientes = ambienteDAO.listAll();
		
		if(ambientes.size() > 0){
			System.out.println("Lista de tamanho = " + ambientes.size());
		} else {
			throw new RuntimeException();
		}
	}

	public void testSelectUnit() throws Exception {
		ambienteDAO.findAmbiente(ambiente.getId());
		
		if(ambiente != null){
			System.out.println("Pesquisando pelo ID, id = " + ambiente.getId());
		} else {
			throw new RuntimeException();
		}
	}
	
	public void testUpdate() throws Exception {
		ambiente = ambienteDAO.findAmbiente(ambiente.getId());
		String descricaoAnterior = ambiente.getDescricao();
		ambiente.setDescricao("Alterado id = " + ambiente.getId());
		ambienteDAO.updateAmbiente(ambiente);
		ambiente = ambienteDAO.findAmbiente(ambiente.getId());
		
		if(!descricaoAnterior.equals(ambiente.getDescricao())){
			System.out.println("Descricao Anterior: " + descricaoAnterior + " - Atual: " + ambiente.getDescricao());
		} else {
			throw new RuntimeException();
		}
	}
	
	public void testDelete() throws Exception {
		Long id = ambiente.getId();
		ambienteDAO.deleteAmbiente(ambiente); 
		ambiente = ambienteDAO.findAmbiente(ambiente.getId());
		
		if(ambiente == null){
			System.out.println("Ambiente Deletado id = " + id);
		} else {
			throw new RuntimeException();
		}
	}
}