package temp.ambiente.vo;

import javax.persistence.*;

@Entity
@Table(name = "local")
public class Local {
	
	@Id
	@Column(name = "id",updatable=true,insertable=true)
	@SequenceGenerator(name = "LOCAL_SEQ", sequenceName="LOCAL_SEQ", allocationSize=1, initialValue=1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="LOCAL_SEQ")
	private Long id;
	
	@Basic
	@Column(name = "descricao", length=150, nullable=false)
	String descricao;
	
	@Basic
	@Column(name = "status")
	char status;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	@Override
	public boolean equals(Object obj) {
		if ((obj instanceof Local)
				&& (((Local) obj).getId().equals(this.getId()))) {
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
		return String.format("{\"id\": \"%d\", \"descricao\": \"%s\", \"status\": \"%s\"}", id, descricao, status);
	}
}
