package com.nelioalves.first;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.Test;

public class MyServiceTest {

    @Test
    public void testSomething() {
        int actualResult = yourMethodToTest(); // Replace with your actual test logic

        // Define the expected result
        int expectedResult = 42; // Replace with the expected result

        // Use assertEquals to check if the actual result matches the expected result
        assertEquals(expectedResult, actualResult);
    }
    
    @Test
    public void testAddition() {
        int result = 2 + 2;
        assertEquals(5, result);
    }

    @Test
    public void testSubtraction() {
        int result = 7 - 4;
        assertEquals(3, result);
    }

    @Test
    public void testMultiplication() {
        int result = 5 * 4;
        assertEquals(20, result);
    }
    
    // Replace this method with the actual method you want to test
    private int yourMethodToTest() {
        // Implement the method you want to test
        return 43; // Replace with the actual implementation
    }
}
