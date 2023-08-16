import axios from "axios";
import { vi } from "vitest";

import { getNewsData } from '../src/utils/newsDataService';
import testData from './mockNewsData.json';



vi.mock('axios');

describe('getNewsData tests', () => {
    describe('GET request test to /newsData', () => { 
        
        it('1 - should actually make the external data call', async () => { 
            // Arrange
            axios.get.mockResolvedValue(testData)
            // Act
            await getNewsData();
            // Assert
            expect(axios.get).toHaveBeenCalled();
        })

        it('2 - should have successful request returning the right data', async () => { 
            // Arrange
            axios.get.mockResolvedValueOnce(testData);
            // Act
            const result = await getNewsData();
            // Assert
            expect(result).toEqual(testData.data);
        })

        it('3 - should have unsuccessful request returning the error object', async () => { 
            // Arrange
            const error = { message: `Error` };
            axios.get.mockRejectedValueOnce(error);
            // Act
            const result = await getNewsData();
            // Assert
            expect(result).toBe(error);
        })
    })
 })