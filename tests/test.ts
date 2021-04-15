import * as Index from './../index';



describe("Invalid Sku 'FDFSDFSDFSDF'.", function () {

    const sku = 'FDFSDFSDFSDF';
    it('Should return 0 as the starting quantity in stock (as per the notes).', async function () {
        const result = await Index.getInitialStock(sku);
        expect(result).toBe(0);
    });

    it('Should thrown error since it does not exist in transactions.', async function () {

        try {
            await Index.getTranscactions(sku)
        } catch (error) {
            expect(function(){throw error}).toThrow('Sku FDFSDFSDFSDF does not exist.');          
        }
  
    });

    it('Should thrown error.', async function () {

        try {
            await Index.getCurrentStock(sku)
        } catch (error) {
            expect(function(){throw error}).toThrow('Sku FDFSDFSDFSDF does not exist.');          
        }
  
    });

   

});



describe("Valid Sku 'HGG795032/35/91'.", function () {

    const sku = 'HGG795032/35/91';

    it("Should return valid quantity from Stock.", async function () {
        const result = await Index.getInitialStock(sku);
        expect(result).toBeGreaterThan(0);
    });

    it("Should return valid quantity from Transactions.", async function () {
        const result = await Index.getTranscactions(sku);
        expect(result).toBeGreaterThan(0);
    });

    it("Should return valid current stock.", async function () {
        const initialStock = await Index.getInitialStock(sku);
        const transactionQuantity = await Index.getTranscactions(sku);
        const result = await Index.getCurrentStock(sku);
        expect(result.sku).toEqual(sku);
        expect(result.qty).toEqual(initialStock - transactionQuantity);
    });
});