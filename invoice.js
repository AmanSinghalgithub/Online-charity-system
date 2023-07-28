const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(id,input, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, input,id);
  generateInvoiceTable(doc, input);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("./public/images/logo-140x140.jpg", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Charity", 110, 57)
    .fontSize(10)
    .text("Charity", 200, 50, { align: "right" })
    .text("Electronic City", 200, 65, { align: "right" })
    .text("Bangalore, 560100", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, input, id) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(id, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("paid", 50, customerInformationTop + 30)
    .text(input.d_amount,150,customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(input.d_name, 300, customerInformationTop)
    .font("Helvetica")
    .text(input.d_addr, 300, customerInformationTop + 15)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, input) {
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Name",
    "purpose",
    "date",
    "time",
    "amount",
    "Payment type",
    "mobile no"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  
    const position = invoiceTableTop + 30;
    generateTableRow(
      doc,
      position,
      input.d_name,
      input.d_purpose,
      formatDate(new Date()),
      getT(new Date()),
      input.d_amount,
      input.d_paytype,
      input.d_cell
    );

    generateHr(doc, position + 20);

  const tPosition = invoiceTableTop + 70;
  generateTableRow(
    doc,
    tPosition,
    "Total",
    "",
    "",
    "",
    input.d_amount,
    "",
    ""
  );

  
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Thank you for your Cooperation.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  Name,
  purpose,
  date,
  time,
  amount,
  Payment,
  mobileno
) 
{
  doc
    .fontSize(10)
    .text(Name, 50, y)
    .text(purpose, 100, y)
    .text(date, 150, y, { width: 90, align: "right" })
    .text(time,200, y, { width: 90, align: "right"} )
    .text(amount, 250, y, { width: 90, align: "right" })
    .text(Payment, 350, y,{ width: 90, align: "right" })
    .text(mobileno, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return year + "/" + month + "/" + day
}
function getT(date){
    const hours = date.getHours<10?'0':'' + date.getHours();
    const min = date.getMinutes<10?'0':'' + date.getMinutes();
    const sec = date.getSeconds<10?'0':'' + date.getSeconds();
  
    return hours + ":" + min + ":" + sec;
  
  }

module.exports = {
  createInvoice
};