package com.nelioalves.cursomc.utility;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public class PageMockUtil {
    public static <T> Page<T> createPage(List<T> content, int page, int size, long totalElements, boolean hasNext) {
    	  Pageable pageable = PageRequest.of(page, size);
    	  return new PageImpl<>(content, pageable, totalElements);
       
    }
}
