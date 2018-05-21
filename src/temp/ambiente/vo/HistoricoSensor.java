package temp.ambiente.vo;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "historico_sensor")
public class HistoricoSensor {
	
	@Id
	@Column(name = "id")
	private Long id;
	
	@Basic
	@Column(name = "id_sensor",nullable=true)
	private Long idSensor;
	
	@Basic
	@Column(name = "device_id",nullable=true, length=12)
	private String deviceId;
	
	@Basic
	@Column(name = "temperatura",nullable=true)
	private Integer temperatura;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getIdSensor() {
		return idSensor;
	}

	public void setIdSensor(Long idSensor) {
		this.idSensor = idSensor;
	}

	public String getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}

	public Integer getTemperatura() {
		return temperatura;
	}

	public void setTemperatura(Integer temperatura) {
		this.temperatura = temperatura;
	}

	@Override
	public boolean equals(Object obj) {
		if ((obj instanceof HistoricoSensor)
				&& ((HistoricoSensor) obj).getId().equals(this.getId())) {
			return true;
		} else
			return false;
	}
	
	@Override
	public int hashCode() {
		return getDeviceId().length() * 8;
	}

	@Override
	public String toString() {
		return String.format("{" +
				"\"id\": \"%d\", " +
				"\"idSensor\": \"%d\", " +
				"\"deviceId\": \"%s\", " +
				"\"temperatura\": \"%d\"}",
				id, idSensor, deviceId, temperatura);
	}
}