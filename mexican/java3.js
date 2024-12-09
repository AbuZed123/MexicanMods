document.getElementById('discount-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const discordId = document.getElementById('discord-id').value;
    const discordUsername = document.getElementById('discord-username').value;

    const now = new Date();
    const currentHour = now.getHours();

    // التحقق من أن الوقت الحالي هو الساعة 12 صباحاً
    if (currentHour !== 0) {
        showNotification('يمكنك الحصول على كود خصم جديد فقط في الساعة 12 صباحاً.');
        return;
    }

    const lastUser = localStorage.getItem('lastUser');

    // التحقق من أن الكود لم يُستخدم من قبل شخص آخر
    if (lastUser && lastUser === discordId) {
        showNotification('تم استخدام كود الخصم مرة واحدة فقط كل 12 ساعة.');
        return;
    }

    // توليد كود خصم جديد
    const discountCode = 'DISCOUNT-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    document.getElementById('discount-code').innerText = `كود الخصم الخاص بك: ${discountCode}`;

    // تخزين المستخدم الأخير
    localStorage.setItem('lastUser', discordId);

    // إرسال الكود إلى ديسكورد
    const webhookURL = 'https://discord.com/api/webhooks/1311726503968641024/X9h4i8421UIXJfNX8xu4KL5r8apw0RziuUUs2BsOguUM8DGNxUM41KEDs062QVSu1T6f';
    const payload = {
        content: `New Discount Code Request:\n**Discord ID:** ${discordId}\n**Discord Username:** ${discordUsername}\n**Discount Code:** ${discountCode}`
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
            showNotification('تم إرسال كود الخصم بنجاح!');
        } else {
            showNotification('فشل في إرسال كود الخصم. حاول مرة أخرى.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('حدث خطأ. حاول مرة أخرى.');
    });
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
    }, 3000); // إخفاء الإشعار بعد 3 ثواني
}
