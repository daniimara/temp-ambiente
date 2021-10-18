package temp.ambiente.vo;

import javax.persistence.*;

@Entity
@Table(name = "ambiente")
@NamedQuery(name = "Ambiente.findAmbienteByIdLocal", query = "select p from Ambiente p where p.idLocal = :idLocal")
public class Ambiente {
	
	public static final String FIND_AMBIENTE_BY_ID_LOCAL = "Ambiente.findAmbienteByIdLocal";
	
	@Id
	@Column(name = "id")
	@SequenceGenerator( name = "appAmbienteSeq", sequenceName = "AMBIENTE_SEQ", allocationSize = 1, initialValue = 1 )
    @GeneratedValue( strategy = GenerationType.SEQUENCE, generator = "appAmbienteSeq" )
	private Long id;
	
	@Basic
	@Column(name = "id_local", nullable=false)
    private Long idLocal; 
	
	@Basic
	@Column(name = "descricao", length=150, nullable=false)
	String descricao;
	
	@Basic
	@Column(name = "temperatura_media")
	Integer temperaturaMedia;

	@Basic
	@Column(name = "TEMPERATURA_MINIMA")
	Integer temperaturaMinima;
	
	@Basic
	@Column(name = "TEMPERATURA_MAXIMA")
	Integer temperaturaMaxima;

	@Basic
	@Column(name = "status")
	char status;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getIdLocal() {
		return idLocal;
	}

	public void setIdLocal(Long idLocal) {
		this.idLocal=idLocal;
		
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public char getStatus() {
		return status;
	}

	public void setStatus(char status) {
		this.status = status;
	}

	public Integer getTemperaturaMedia() {
		return temperaturaMedia;
	}

	public void setTemperaturaMedia(Integer temperaturaMedia) {
		this.temperaturaMedia = temperaturaMedia;
	}

	public Integer getTemperaturaMinima() {
		return temperaturaMinima;
	}

	public void setTemperaturaMinima(Integer temperaturaMinima) {
		this.temperaturaMinima = temperaturaMinima;
	}

	public Integer getTemperaturaMaxima() {
		return temperaturaMaxima;
	}

	public void setTemperaturaMaxima(Integer temperaturaMaxima) {
		this.temperaturaMaxima = temperaturaMaxima;
	}

	@Override
	public boolean equals(Object obj) {
		if ((obj instanceof Ambiente)
				&& (((Ambiente) obj).getId().equals(this.getId()))) {
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
			"\"idLocal\": \"%d\", " +
			"\"descricao\": \"%s\", " +
			"\"temperaturaMedia\": \"%d\", " +
			"\"temperaturaMinima\": \"%d\", " +
			"\"temperaturaMaxima\": \"%d\", " +
			"\"status\": \"%s\"}", 
			id, idLocal, descricao, temperaturaMedia, temperaturaMinima, temperaturaMaxima, status);
	}

	
}
