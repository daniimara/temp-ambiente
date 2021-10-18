package temp.ambiente.vo;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "sensor")
@NamedQuery(name = "Sensor.findSensorByIdAmbiente", query = "select p from Sensor p where p.idAmbiente = :idAmbiente")
public class Sensor {
	
	public static final String FIND_SENSOR_BY_ID_AMBIENTE = "Sensor.findSensorByIdAmbiente";
	
	@Id
	@Column(name = "id")
	@SequenceGenerator( name = "appSensorSeq", sequenceName = "SENSOR_SEQ", allocationSize = 1, initialValue = 1 )
    @GeneratedValue( strategy = GenerationType.SEQUENCE, generator = "appSensorSeq" )
	private Long id;
	
	@Basic
	@Column(name = "id_ambiente",nullable=true)
	private Long idAmbiente;
	
	@Basic
	@Column(name = "descricao",nullable=true, length=150)
	private String descricao;
	
	@Basic
	@Column(name = "device_id",nullable=true, length=12)
	private String deviceId;

	@Basic
	@Column(name = "temperatura",nullable=true)
	private Integer temperatura;
	
	@Basic
	@Column(name = "status",nullable=true)
	private char status;

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getIdAmbiente() {
		return idAmbiente;
	}
	public void setIdAmbiente(Long idAmbiente) {
		this.idAmbiente = idAmbiente;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
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
	public char getStatus() {
		return status;
	}
	public void setStatus(char status) {
		this.status = status;
	}

	@Override
	public boolean equals(Object obj) {
		if ((obj instanceof Sensor)
				&& ((Sensor) obj).getId().equals(this.getId())) {
			return true;
		} else
			return false;
	}
	
	@Override
	public int hashCode() {
		return getDescricao().length() * 8;
	}

	@Override
	public String toString() {
		return String.format("{" +
				"\"id\": \"%d\", " +
				"\"idAmbiente\": \"%d\", " +
				"\"descricao\": \"%s\", " +
				"\"deviceId\": \"%s\", " +
				"\"temperatura\": \"%d\", " +
				"\"status\": \"%s\"}", 
				id, idAmbiente, descricao, deviceId, temperatura, status);
	}
}
