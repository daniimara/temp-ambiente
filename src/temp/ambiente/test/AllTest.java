package temp.ambiente.test;

public class AllTest {
	
	public void runAllTest(){
		//SensorTest();
	}

	public void LocalTest() {
		LocalTest test = new LocalTest();
		try {
			test.inicializa();
			test.testCreate();
			test.testSelect();
			test.testSelectUnit();
			test.testUpdate();
			test.testDelete();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void AmbienteTest() {
		AmbienteTest test = new AmbienteTest();
		try {
			test.inicializa();
			test.testCreate();
			test.testSelect();
			test.testSelectUnit();
			test.testUpdate();
			test.testDelete();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void SensorTest() {
		SensorTest test = new SensorTest();
		try {
			test.inicializa();
			test.testCreate();
			test.testSelect();
			test.testSelectUnit();
			test.testUpdate();
			test.testDelete();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}