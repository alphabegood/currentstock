import Stock from './stock.json';
import Transactions from './transactions.json';

interface Transaction {
    sku: string;
    type: string;
    qty: number;
}

interface SkuItem {
    sku: string;
    stock: number;
}


export function getCurrentStock(sku: string): Promise<{ sku: string, qty: number }> {

    return new Promise<{ sku: string, qty: number }>((resolve: any, reject: any) => {

        Promise.all([getInitialStock(sku), getTranscactions(sku)]).then(values => {

            const startingStock = values[0];
            const transactionsQty = values[1]; 
            
            const qty = startingStock > transactionsQty ? startingStock - transactionsQty : 0; 

            const currentStock = { sku: sku, qty: qty };

            resolve(currentStock);

        }).catch(error => reject(error));


    });



}

export function getTranscactions(sku: string): Promise<number> {
    return new Promise<number>((resolve: any, reject: any) => {

        try {

            let quantityOrdered = 0;

            const transactionItems: Transaction[] = Transactions;

            if (!Array.isArray(transactionItems)) {
                throw `The transactions source is not valid.`;
            }

            const filteredTransactionItems = transactionItems.filter((item: Transaction) => {
                return item.sku === sku;
            });

            if (filteredTransactionItems.length === 0) {
                throw `Sku ${sku} does not exist.`;
            }

            quantityOrdered = filteredTransactionItems.reduce((quantityOrdered: number, currentTransaction: Transaction) => {

                currentTransaction.type == 'order'
                    ? quantityOrdered += currentTransaction.qty
                    : quantityOrdered -= currentTransaction.qty;

                return quantityOrdered;

            }, quantityOrdered);

            resolve(quantityOrdered);


        }
        catch (error) {
        
            reject(error);


        }
    });
}

export function getInitialStock(sku: string): Promise<number> {

    return new Promise<number>((resolve: any, reject: any) => {

        try {

            const skuItems: SkuItem[] = Stock;

            if (!Array.isArray(skuItems)) {
                throw `The stock source is not valid.`;
            }

            const filteredStockItems = skuItems.filter((item: SkuItem) => {
                return item.sku === sku;
            });

            if (filteredStockItems.length == 0) {
                //Based on the note the starting quantity is 0;
                resolve(0);
            }

            if (filteredStockItems.length > 1) {
                throw `The Sku ${sku} is not properly defined in the warehouse.`;
            }

            if (!filteredStockItems[0].stock) {
                throw `The Sku ${sku} stock is not defined in the warehouse.`;
            }

            resolve(filteredStockItems[0].stock);

        } catch (error) {

            reject(error);

        }
    });


}


