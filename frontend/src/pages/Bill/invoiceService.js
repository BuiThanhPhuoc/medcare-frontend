/**
 * Invoice Print Service
 * Dùng window.print() để in hóa đơn
 */

export const generateInvoicePDF = (selectedPatient, paymentDrafts) => {
    if (!selectedPatient) return;

    const amount = paymentDrafts[selectedPatient.id]?.total_amount || '200000';
    const paymentMethod = paymentDrafts[selectedPatient.id]?.payment_method || 'cash';

    // Tạo HTML để in
    const invoiceHTML = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hóa Đơn Thanh Toán - MedCare</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Arial', sans-serif; background: #fff; }
                .invoice-container {
                    max-width: 80mm;
                    margin: 0 auto;
                    padding: 20px;
                    background: white;
                }
                .invoice-header {
                    text-align: center;
                    border-bottom: 2px solid #333;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .invoice-header h1 { font-size: 20px; color: #333; }
                .invoice-header p { font-size: 11px; color: #666; }
                .invoice-id {
                    font-size: 12px;
                    font-weight: bold;
                    margin: 10px 0;
                    text-align: center;
                    border: 1px dashed #999;
                    padding: 8px;
                }
                .patient-info,
                .service-info,
                .payment-info {
                    margin-bottom: 15px;
                    font-size: 12px;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 4px 0;
                    border-bottom: 1px dotted #ccc;
                }
                .info-label { font-weight: bold; width: 40%; }
                .info-value { text-align: right; width: 60%; }
                .total-amount {
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                    margin: 15px 0;
                    padding: 10px;
                    border: 2px solid #e74c3c;
                    color: #e74c3c;
                }
                .footer {
                    text-align: center;
                    font-size: 10px;
                    color: #999;
                    margin-top: 15px;
                    padding-top: 10px;
                    border-top: 1px solid #ccc;
                }
                .thank-you {
                    text-align: center;
                    font-weight: bold;
                    margin: 10px 0;
                    color: #27ae60;
                }
                @media print {
                    body { margin: 0; padding: 0; }
                    .invoice-container { max-width: 100%; margin: 0; padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="invoice-header">
                    <h1>MedCare</h1>
                    <p>Phòng khám đa khoa</p>
                    <p>Địa chỉ: 123 Đường ABC, Hà Nội</p>
                    <p>Hotline: 1900.XXXX</p>
                </div>

                <div class="invoice-id">HĐ #${selectedPatient.id}</div>

                <div class="patient-info">
                    <div class="info-row">
                        <span class="info-label">Bệnh nhân:</span>
                        <span class="info-value">${selectedPatient.patient_name}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">SĐT:</span>
                        <span class="info-value">${selectedPatient.patient_phone || selectedPatient.phone}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Ngày:</span>
                        <span class="info-value">${new Date(selectedPatient.appointment_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Giờ:</span>
                        <span class="info-value">${selectedPatient.appointment_time}</span>
                    </div>
                </div>

                <div class="service-info">
                    <div class="info-row">
                        <span class="info-label">Dịch vụ:</span>
                        <span class="info-value"></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Khám bệnh</span>
                        <span class="info-value">200.000₫</span>
                    </div>
                </div>

                <div class="total-amount">
                    Tổng: ${Number(amount).toLocaleString('vi-VN')} ₫
                </div>

                <div class="payment-info">
                    <div class="info-row">
                        <span class="info-label">Thanh toán:</span>
                        <span class="info-value">
                            ${paymentMethod === 'cash' ? 'Tiền mặt' : paymentMethod === 'transfer' ? 'Chuyển khoản' : 'Thẻ'}
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Giờ thanh toán:</span>
                        <span class="info-value">${new Date().toLocaleTimeString('vi-VN')}</span>
                    </div>
                </div>

                <div class="thank-you">
                    Cảm ơn quý khách!
                </div>

                <div class="footer">
                    <p>In lúc: ${new Date().toLocaleString('vi-VN')}</p>
                    <p>Mang về: Giúp theo dõi tình trạng sức khỏe</p>
                </div>
            </div>

            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.history.back();
                    };
                };
            </script>
        </body>
        </html>
    `;

    // Mở tab in
    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
};

export const downloadInvoicePDF = async (selectedPatient, paymentDrafts) => {
    // Nếu có thư viện PDF (jsPDF), có thể dùng
    // Hiện tại sử dụng window.print() đơn giản hơn
    console.log('Download PDF:', selectedPatient.id);
};
