import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Produce, Sale, CreditSale } from '@/types/karibu';
import { format } from 'date-fns';

// CSV Export Utilities
export const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// Inventory CSV Export
export const exportInventoryToCSV = (produce: Produce[]) => {
  const data = produce.map(item => ({
    'Name': item.name,
    'Type': item.type,
    'Stock (kg)': item.tonnageKg,
    'Cost (UGX)': item.costUgx,
    'Price (UGX)': item.priceUgx,
    'Dealer': item.dealerName,
    'Contact': item.dealerContact,
    'Branch': item.branch,
    'Date Added': format(item.dateAdded, 'yyyy-MM-dd'),
  }));
  exportToCSV(data, 'karibu_inventory_report');
};

// Sales CSV Export
export const exportSalesToCSV = (sales: Sale[]) => {
  const data = sales.map(sale => ({
    'Produce': sale.produceName,
    'Buyer': sale.buyerName,
    'Quantity (kg)': sale.tonnageKg,
    'Amount (UGX)': sale.amountPaidUgx,
    'Sales Agent': sale.salesAgentName,
    'Branch': sale.branch,
    'Date': format(sale.date, 'yyyy-MM-dd'),
  }));
  exportToCSV(data, 'karibu_sales_report');
};

// Credit Sales CSV Export
export const exportCreditSalesToCSV = (creditSales: CreditSale[]) => {
  const data = creditSales.map(credit => ({
    'Buyer': credit.buyerName,
    'National ID': credit.nationalId,
    'Location': credit.location,
    'Contact': credit.contact,
    'Produce': credit.produceName,
    'Type': credit.produceType,
    'Quantity (kg)': credit.tonnageKg,
    'Amount Due (UGX)': credit.amountDueUgx,
    'Dispatch Date': format(credit.dispatchDate, 'yyyy-MM-dd'),
    'Due Date': format(credit.dueDate, 'yyyy-MM-dd'),
    'Sales Agent': credit.salesAgentName,
    'Branch': credit.branch,
  }));
  exportToCSV(data, 'karibu_credit_sales_report');
};

// PDF Export Utilities
export const exportInventoryToPDF = (produce: Produce[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 84, 48); // Karibu green
  doc.text('Karibu Groceries LTD', 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text('Inventory Report', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, 14, 38);
  
  // Summary
  const totalStock = produce.reduce((sum, p) => sum + p.tonnageKg, 0);
  const lowStockItems = produce.filter(p => p.tonnageKg < 1000).length;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Items: ${produce.length}`, 14, 50);
  doc.text(`Total Stock: ${totalStock.toLocaleString()} kg`, 14, 56);
  doc.text(`Low Stock Items: ${lowStockItems}`, 14, 62);
  
  // Table
  autoTable(doc, {
    startY: 70,
    head: [['Name', 'Type', 'Stock (kg)', 'Price/kg', 'Branch', 'Dealer']],
    body: produce.map(item => [
      item.name,
      item.type,
      item.tonnageKg.toLocaleString(),
      `UGX ${(item.priceUgx / item.tonnageKg).toLocaleString()}`,
      item.branch,
      item.dealerName,
    ]),
    theme: 'striped',
    headStyles: { 
      fillColor: [40, 84, 48], // Karibu green
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 247, 245] },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`karibu_inventory_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const exportSalesToPDF = (sales: Sale[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 84, 48);
  doc.text('Karibu Groceries LTD', 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text('Sales Report', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, 14, 38);
  
  // Summary
  const totalRevenue = sales.reduce((sum, s) => sum + s.amountPaidUgx, 0);
  const totalTonnage = sales.reduce((sum, s) => sum + s.tonnageKg, 0);
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Sales: ${sales.length}`, 14, 50);
  doc.text(`Total Revenue: UGX ${totalRevenue.toLocaleString()}`, 14, 56);
  doc.text(`Total Quantity Sold: ${totalTonnage.toLocaleString()} kg`, 14, 62);
  
  // Table
  autoTable(doc, {
    startY: 70,
    head: [['Date', 'Produce', 'Buyer', 'Qty (kg)', 'Amount', 'Branch']],
    body: sales.map(sale => [
      format(sale.date, 'MMM dd, yyyy'),
      sale.produceName,
      sale.buyerName,
      sale.tonnageKg.toLocaleString(),
      `UGX ${sale.amountPaidUgx.toLocaleString()}`,
      sale.branch,
    ]),
    theme: 'striped',
    headStyles: { 
      fillColor: [40, 84, 48],
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 247, 245] },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`karibu_sales_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const exportCreditSalesToPDF = (creditSales: CreditSale[]) => {
  const doc = new jsPDF('landscape');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 84, 48);
  doc.text('Karibu Groceries LTD', 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text('Credit Sales Report', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, 14, 38);
  
  // Summary
  const totalAmountDue = creditSales.reduce((sum, c) => sum + c.amountDueUgx, 0);
  const totalTonnage = creditSales.reduce((sum, c) => sum + c.tonnageKg, 0);
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Credit Sales: ${creditSales.length}`, 14, 50);
  doc.text(`Total Outstanding: UGX ${totalAmountDue.toLocaleString()}`, 14, 56);
  doc.text(`Total Quantity: ${totalTonnage.toLocaleString()} kg`, 120, 50);
  
  // Table
  autoTable(doc, {
    startY: 65,
    head: [['Buyer', 'NIN', 'Location', 'Contact', 'Produce', 'Qty', 'Amount Due', 'Due Date']],
    body: creditSales.map(credit => [
      credit.buyerName,
      credit.nationalId,
      credit.location,
      credit.contact,
      credit.produceName,
      `${credit.tonnageKg} kg`,
      `UGX ${credit.amountDueUgx.toLocaleString()}`,
      format(credit.dueDate, 'MMM dd, yyyy'),
    ]),
    theme: 'striped',
    headStyles: { 
      fillColor: [139, 90, 43], // Earth tone for credit
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [252, 248, 243] },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`karibu_credit_sales_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Full Reports PDF Export
export const exportFullReportToPDF = (produce: Produce[], sales: Sale[], creditSales: CreditSale[]) => {
  const doc = new jsPDF();
  
  // Title Page
  doc.setFontSize(28);
  doc.setTextColor(40, 84, 48);
  doc.text('Karibu Groceries LTD', 105, 60, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setTextColor(80, 80, 80);
  doc.text('Complete Business Report', 105, 75, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy')}`, 105, 90, { align: 'center' });
  
  // Summary section
  const totalStock = produce.reduce((sum, p) => sum + p.tonnageKg, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.amountPaidUgx, 0);
  const totalCredits = creditSales.reduce((sum, c) => sum + c.amountDueUgx, 0);
  
  doc.setFontSize(14);
  doc.setTextColor(40, 84, 48);
  doc.text('Executive Summary', 14, 120);
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Inventory: ${totalStock.toLocaleString()} kg across ${produce.length} items`, 14, 132);
  doc.text(`Total Sales: ${sales.length} transactions worth UGX ${totalRevenue.toLocaleString()}`, 14, 142);
  doc.text(`Outstanding Credits: UGX ${totalCredits.toLocaleString()} from ${creditSales.length} buyers`, 14, 152);
  
  // Inventory Section
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(40, 84, 48);
  doc.text('Inventory Report', 14, 20);
  
  autoTable(doc, {
    startY: 30,
    head: [['Name', 'Type', 'Stock (kg)', 'Branch', 'Dealer']],
    body: produce.map(item => [
      item.name,
      item.type,
      item.tonnageKg.toLocaleString(),
      item.branch,
      item.dealerName,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [40, 84, 48], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
  });
  
  // Sales Section
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(40, 84, 48);
  doc.text('Sales Report', 14, 20);
  
  autoTable(doc, {
    startY: 30,
    head: [['Date', 'Produce', 'Buyer', 'Qty (kg)', 'Amount', 'Branch']],
    body: sales.map(sale => [
      format(sale.date, 'MMM dd, yyyy'),
      sale.produceName,
      sale.buyerName,
      sale.tonnageKg.toLocaleString(),
      `UGX ${sale.amountPaidUgx.toLocaleString()}`,
      sale.branch,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [40, 84, 48], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
  });
  
  // Credit Sales Section
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(139, 90, 43);
  doc.text('Credit Sales Report', 14, 20);
  
  autoTable(doc, {
    startY: 30,
    head: [['Buyer', 'Produce', 'Amount Due', 'Due Date', 'Branch']],
    body: creditSales.map(credit => [
      credit.buyerName,
      credit.produceName,
      `UGX ${credit.amountDueUgx.toLocaleString()}`,
      format(credit.dueDate, 'MMM dd, yyyy'),
      credit.branch,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [139, 90, 43], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
  });
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | Karibu Groceries LTD`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`karibu_complete_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
