package com.nelioalves.cursomc.services;

import org.springframework.boot.test.context.SpringBootTest;

import com.nelioalves.cursomc.CursomcApplication;
import com.nelioalves.cursomc.domain.TipoComponente;
import com.nelioalves.cursomc.repositories.TipoComponenteRepository;
import com.nelioalves.cursomc.utility.PageMockUtil;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import static org.mockito.Mockito.when;

import java.util.List;

import static org.junit.Assert.assertEquals;

@SpringBootTest(classes= CursomcApplication.class)
public class TipoComponenteServiceTest {

	    @InjectMocks
	    private TipoComponenteService tipoComponenteService;

	    @Mock
	    private TipoComponenteRepository tipoComponenteRepository;

	    @Before
	    public void init() {
	        MockitoAnnotations.initMocks(this);
	    }

	    @Test
	    public void testFindWithConditionsAndPagination() {
	        // Create a mock Page of TipoComponente for your test
	    	
	    	Page<TipoComponente> tipoComponentePage = PageMockUtil.createPage(
	    		    List.of(new TipoComponente(), new TipoComponente()),
	    		    0, 2, 10, true
	    		);
	    	
	        // Mock the repository to return the mock Page when findWithPagination() is called
	        when(tipoComponenteRepository.findWithPagination(PageRequest.of(0, 2))).thenReturn(tipoComponentePage);

	        // Call the service method
	        Page<TipoComponente> result = tipoComponenteService.findWithConditionsAndPagination(0, 2);

	        // Verify the result
	        assertEquals(tipoComponentePage.getTotalElements(), result.getTotalElements()); // Verify the total number of elements
	        assertEquals(tipoComponentePage.getContent(), result.getContent()); // Verify the content of the Page
	    }
	    
}
