class Receipt {
    constructor(receiptData) {
        this.receiptNo = receiptData.receiptNo;
        this.customerName = receiptData.customerName;
        this.items = receiptData.items;
        this.paymentMethod = receiptData.paymentMethod;
        this.date = new Date();
        this.totalAmount = this.calculateTotal();
    }

    calculateTotal() {
        return this.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatItems() {
        return this.items.map(item => {
            const total = item.price * item.quantity;
            return `${item.name.padEnd(15)} ${
                String(item.quantity).padEnd(11)} ${
                this.formatCurrency(item.price).padEnd(8)} ${
                this.formatCurrency(total)}`;
        }).join('\n');
    }

    generateReceipt() {
        return `
=================================================
                    INVOICE
=================================================
Receipt No: ${this.receiptNo}
Date: ${this.date.toLocaleString()}
Customer Name: ${this.customerName}
-------------------------------------------------
Item Name        Quantity    Price    Total
-------------------------------------------------
${this.formatItems()}
-------------------------------------------------
Total Amount: ${this.formatCurrency(this.totalAmount)}
Payment Method: ${this.paymentMethod}
=================================================
          Thank You for Your Purchase!
=================================================`;
    }

    // Method to generate HTML version of receipt
    generateHTMLReceipt() {
        return `
            <div class="receipt">
                <div class="receipt-header">
                    <h2>INVOICE</h2>
                </div>
                <div class="receipt-details">
                    <p><strong>Receipt No:</strong> ${this.receiptNo}</p>
                    <p><strong>Date:</strong> ${this.date.toLocaleString()}</p>
                    <p><strong>Customer Name:</strong> ${this.customerName}</p>
                </div>
                <table class="receipt-items">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>${this.formatCurrency(item.price)}</td>
                                <td>${this.formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="receipt-footer">
                    <p><strong>Total Amount:</strong> ${this.formatCurrency(this.totalAmount)}</p>
                    <p><strong>Payment Method:</strong> ${this.paymentMethod}</p>
                    <p class="thank-you">Thank You for Your Purchase!</p>
                </div>
            </div>`;
    }
}

// Example usage:
const receiptData = {
    receiptNo: "INV-001",
    customerName: "John Doe",
    items: [
        { name: "Product A", quantity: 2, price: 10.99 },
        { name: "Product B", quantity: 1, price: 24.99 },
        { name: "Product C", quantity: 3, price: 5.99 }
    ],
    paymentMethod: "Credit Card"
};

// Create receipt instance
const receipt = new Receipt(receiptData);

// Generate text receipt
console.log(receipt.generateReceipt());

// Generate HTML receipt
document.body.innerHTML = receipt.generateHTMLReceipt(); 