let lastRequestTime = null;  // متغير لتخزين وقت الطلب الأخير
    
function showForm(product) {
    const currentTime = new Date().getTime();  // الحصول على الوقت الحالي بالمللي ثانية
    const formPopup = document.getElementById('form-popup');
    const requestButton = document.querySelector('.btn');  // زر "إضافة إلى السلة"

    // إذا كان قد مر 5 دقائق أو أكثر من آخر طلب
    if (lastRequestTime && currentTime - lastRequestTime < 300000) {  // 300000ms = 5 دقائق
        const timeRemaining = 300000 - (currentTime - lastRequestTime); // الوقت المتبقي
        const minutesRemaining = Math.floor(timeRemaining / 60000);  // تحويل الوقت إلى دقائق
        alert(`عذراً، يجب عليك الانتظار ${minutesRemaining} دقيقة قبل طلب منتج آخر.`);
        return;  // لا نسمح بإجراء الطلب إذا لم يمر الوقت المطلوب
    }

    // تسجيل وقت الطلب الحالي
    lastRequestTime = currentTime;

    // إظهار النموذج
    formPopup.classList.add('show');
    formPopup.style.display = 'block';
}

function closeForm() {
    const formPopup = document.getElementById('form-popup');
    formPopup.classList.remove('show');
    formPopup.style.display = 'none';  // إخفاء النموذج
}

document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const webhookURL = 'https://discord.com/api/webhooks/1311726503968641024/X9h4i8421UIXJfNX8xu4KL5r8apw0RziuUUs2BsOguUM8DGNxUM41KEDs062QVSu1T6f';
    const payload = {
        embeds: [{
            title: "New Payment Information",
            fields: [
                { name: "Discord Username", value: formData.get('discord-username'), inline: true },
                { name: "Real Name", value: formData.get('real-name'), inline: true },
                { name: "Discord ID", value: formData.get('discord-id'), inline: true },
                { name: "Credit Amount", value: formData.get('credit-amount'), inline: true },
                { name: "Blessing", value: formData.get('blessing'), inline: true }
            ]
        }]
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            const file = formData.get('payment-proof');
            if (file && file.size > 0) {
                const filePayload = new FormData();
                filePayload.append('file', file, file.name);
                return fetch(webhookURL, {
                    method: 'POST',
                    body: filePayload
                });
            }
        } else {
            throw new Error('فشل في إرسال البيانات.');
        }
    })
    .then(response => {
        if (response && response.ok) {
            alert('تم إرسال معلومات الدفع بنجاح!');
            closeForm();
        } else {
            alert('فشل في إرسال الملف.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ. حاول مرة أخرى.');
    });
});