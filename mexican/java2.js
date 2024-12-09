// وقت آخر طلب تم إرساله
let lastOrderTime = null;

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const now = new Date();

    // التحقق من الوقت المنقضي منذ آخر طلب
    if (lastOrderTime && (now - lastOrderTime) < 5 * 60 * 1000) {
        alert('يرجى الانتظار لمدة 5 دقائق بين الطلبات.');
        return;
    }

    const form = e.target;
    const formData = new FormData(form);

    const webhookURL = 'https://discord.com/api/webhooks/1311726503968641024/X9h4i8421UIXJfNX8xu4KL5r8apw0RziuUUs2BsOguUM8DGNxUM41KEDs062QVSu1T6f';
    const payload = {
        content: `New Order Request:\n**Discord Username:** ${formData.get('discord-username')}\n**Discord ID:** ${formData.get('discord-id')}\n**Product ID:** ${formData.get('product-id')}\n**Budget:** ${formData.get('budget')}\n**Payment Method:** ${formData.get('payment-method')}`
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
            alert('تم إرسال الطلب بنجاح!');
            lastOrderTime = now; // تحديث وقت آخر طلب
        } else {
            alert('فشل في إرسال الطلب. حاول مرة أخرى.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ. حاول مرة أخرى.');
    });
});