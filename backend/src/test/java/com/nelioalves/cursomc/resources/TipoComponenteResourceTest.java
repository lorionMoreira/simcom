package com.nelioalves.cursomc.resources;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;

import com.nelioalves.cursomc.CursomcApplication;
import com.nelioalves.cursomc.domain.TipoComponente;
import com.nelioalves.cursomc.services.TipoComponenteService;
import com.nelioalves.cursomc.utility.PageMockUtil;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@AutoConfigureMockMvc
@SpringBootTest(classes= CursomcApplication.class)
public class TipoComponenteResourceTest {

 	@InjectMocks
    private TipoComponenteResource tipoComponenteResource;
 	
 	@Mock
    private TipoComponenteService tipoComponenteService;
 	
    @Autowired
    private MockMvc mockMvc;
 	
    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }
    
    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testGetEntitiesWithPagination() throws Exception {
        int expectedPage = 0;  // Set the expected page number
        int expectedSize = 2;  // Set the expected page size
        // Create a list of TipoComponente objects for your test
    	Page<TipoComponente> tipoComponentePage = PageMockUtil.createPage(
    		    List.of(new TipoComponente(), new TipoComponente()),
    		    0, 2, 10, true
    		);

        // Mock the service to return the list when findWithConditionsAndPagination() is called
        when(tipoComponenteService.findWithConditionsAndPagination(0,2)).thenReturn(tipoComponentePage);

        // Call the controller method
        ResponseEntity<Page<TipoComponente>> response = tipoComponenteResource.getEntitiesWithPagination(0, 2);

        // Verify that the service method was called with the expected parameters
        verify(tipoComponenteService).findWithConditionsAndPagination(expectedPage, expectedSize);

        // Verify the response
        mockMvc.perform(MockMvcRequestBuilders.get("/api/tipocomponente/buscar")
                .param("page", "0")
                .param("size", "2")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn();
                
        assertEquals(200, response.getStatusCodeValue()); // Verify that it returns a 200 status code
        Page<TipoComponente> responseBody = response.getBody(); // Get the list from the response
        assertEquals(tipoComponentePage, responseBody); // Verify that the returned list matches the expected list
    }
    /*
    @Test
    public void testFindById() throws Exception {
        // Create a TipoComponente object for the expected response
        TipoComponente expectedTipoComponente = new TipoComponente();

        // Mock the service to return the expected TipoComponente when find() is called
        when(tipoComponenteService.find(1)).thenReturn(expectedTipoComponente);

        // Perform the GET request and validate the response
        mockMvc.perform(get("/api/tipo-componente/findbyid/{id}", 1)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Example TipoComponente"));
    }
    */
}
