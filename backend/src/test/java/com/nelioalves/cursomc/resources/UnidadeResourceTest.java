package com.nelioalves.cursomc.resources;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import com.nelioalves.cursomc.CursomcApplication;
import com.nelioalves.cursomc.domain.Unidade;
import com.nelioalves.cursomc.services.UnidadeService;

@SpringBootTest(classes= CursomcApplication.class)
public class UnidadeResourceTest {
 
	@InjectMocks
	UnidadeResource unidadeResource;
	
	@Mock
    private UnidadeService unidadeservice;
	
	
    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }
	
	@Test
	void testFindAll()  {
        // Create a list of Unidade objects for your test
        List<Unidade> unidadeList = Arrays.asList(
            new Unidade("Unit 1"),
            new Unidade("Unit 2")
        );
        // Mock the service to return the list when findAll() is called
        when(unidadeservice.findAll()).thenReturn(unidadeList);
        
        // Call the controller method
        ResponseEntity<List<Unidade>> response = unidadeResource.findAll();
	
        assertEquals(200, response.getStatusCodeValue()); // Verify that it returns a 200 status code
        List<Unidade> responseBody = response.getBody(); // Get the list from the response
        assertEquals(unidadeList, responseBody);
	}
}
