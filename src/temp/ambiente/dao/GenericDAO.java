package temp.ambiente.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaQuery;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.transaction.UserTransaction;
 
abstract class GenericDAO<T> implements Serializable {
	
    private static final long serialVersionUID = 1L;
    private EntityManager em = null;
    private UserTransaction utx = null;
 
    private Class<T> entityClass;

    public void genericDAO() {
		utx = getUserTransaction();
		em = getEm();
    }
    
	private EntityManager getEm() {
		InitialContext ic;
		try {
			ic = new InitialContext();
			return (EntityManager) ic.lookup("java:comp/env/openjpa-todo/entitymanager");
		} catch (NamingException e) {
			e.printStackTrace();
		}
		return null;
	}
    
    private UserTransaction getUserTransaction() {
		InitialContext ic;
		try {
			ic = new InitialContext();
			return (UserTransaction) ic.lookup("java:comp/UserTransaction");
		} catch (NamingException e) {
			e.printStackTrace();
		}
		return null;
	}
    
    public void beginTransaction() throws Exception {
    	utx.begin();
    }
 
    public void commit() throws Exception {
    	utx.commit();
    }
 
    public void rollback() throws Exception {
    	utx.rollback();
    }
 
    public void closeTransaction() throws Exception {
		if (utx.getStatus() == javax.transaction.Status.STATUS_ACTIVE) {
			utx.rollback();
		}
    }
 
    public void commitAndCloseTransaction() throws Exception {
    	utx.commit();
        closeTransaction();
    }
 
    public void flush() {
        em.flush();
    }
 
    public void joinTransaction() {
    	em = getEm();
        em.joinTransaction();
    }
 
    public GenericDAO(Class<T> entityClass) {
        this.entityClass = entityClass;
    }
 
    public void save(T entity) {
        em.persist(entity);
    }
 
    protected void delete(Object id, Class<T> classe) {
        T entityToBeRemoved = em.getReference(classe, id);
        em.remove(entityToBeRemoved);
    }
    
    public int executeQuery(String namedQuery, Map<String, Object> parameters) {
    	int deleted = 0;
    	Query query = em.createQuery(namedQuery);
        if (parameters != null && !parameters.isEmpty()) {
            populateQueryParameters(query, parameters);
            deleted = query.executeUpdate();
        }
        return deleted;
    }
 
    public void update(T entity) {
        em.merge(entity);
    }
 
    public T find(Long entityID) {
        return em.find(entityClass, entityID);
    }
 
    public T findReferenceOnly(Long entityID) {
        return em.getReference(entityClass, entityID);
    }
 
    // Using the unchecked because JPA does not have a
    // em.getCriteriaBuilder().createQuery()<T> method
    @SuppressWarnings({ "unchecked", "rawtypes" })
    public List<T> findAll() {
        CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
        cq.select(cq.from(entityClass));
        return em.createQuery(cq).getResultList();
    }
 
    // Using the unchecked because JPA does not have a
    // query.getSingleResult()<T> method
    @SuppressWarnings("unchecked")
    protected T findOneResult(String namedQuery, Map<String, Object> parameters) {
        T result = null;
 
        try {
            Query query = em.createNamedQuery(namedQuery);
 
            // Method that will populate parameters if they are passed not null and empty
            if (parameters != null && !parameters.isEmpty()) {
                populateQueryParameters(query, parameters);
            }
 
            result = (T) query.getSingleResult();
 
        } catch (NoResultException e) {
            System.out.println("No result found for named query: " + namedQuery);
        } catch (Exception e) {
            System.out.println("Error while running query: " + e.getMessage());
            e.printStackTrace();
        }
 
        return result;
    }
    
    @SuppressWarnings("unchecked")
    protected List<T> findResult(String namedQuery, Map<String, Object> parameters) {
    	List<T> result = null;
 
        try {
            Query query = em.createNamedQuery(namedQuery);
 
            // Method that will populate parameters if they are passed not null and empty
            if (parameters != null && !parameters.isEmpty()) {
                populateQueryParameters(query, parameters);
            }
 
            result = query.getResultList();
 
        } catch (NoResultException e) {
            System.out.println("No result found for named query: " + namedQuery);
        } catch (Exception e) {
            System.out.println("Error while running query: " + e.getMessage());
            e.printStackTrace();
        }
 
        return result;
    }
    
    @SuppressWarnings("unchecked")
    protected List<Object[]> findResultObject(String nativeQuery, Map<String, Object> parameters) {
    	List<Object[]> result = null;
 
        try {
            Query query = em.createNativeQuery(nativeQuery);
 
            // Method that will populate parameters if they are passed not null and empty
            if (parameters != null && !parameters.isEmpty()) {
                populateQueryParameters(query, parameters);
            }
 
            result = query.getResultList();
 
        } catch (NoResultException e) {
            System.out.println("No result found for named query: " + nativeQuery);
        } catch (Exception e) {
            System.out.println("Error while running query: " + e.getMessage());
            e.printStackTrace();
        }
 
        return result;
    }
 
    private void populateQueryParameters(Query query, Map<String, Object> parameters) {
        for (Entry<String, Object> entry : parameters.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
    }
}