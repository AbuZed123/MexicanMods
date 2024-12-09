document.getElementById('management-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const discordId = formData.get('discord-id');

    const lastSubmitted = localStorage.getItem(`lastSubmitted_${discordId}`);
    const now = new Date().getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (lastSubmitted && (now - lastSubmitted) < oneWeek) {
        showNotification('يمكنك التقديم مرة أخرى بعد مرور أسبوع كامل.');
        return;
    }

    const webhookURL = 'https://discord.com/api/webhooks/1312475341096489041/2UhrIlgildkhA1vD97McGMkS6VZ68Kpjyk4ipTGCkXB5glp9uepZyyKGUxyK72xgXrk_';
    const payload = {
        content: `New Management Application:\n**Name:** ${formData.get('name')}\n**Age:** ${formData.get('age')}\n**Country:** ${formData.get('country')}\n**Daily Activity:** ${formData.get('activity')}\n**Ticket Experience:** ${formData.get('ticket-experience')}\n**ProBot Commands:** ${formData.get('probot-commands')}\n**Commitment:** ${formData.get('commitment')}`
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
            localStorage.setItem(`lastSubmitted_${discordId}`, now);
            showNotification('تم إرسال الطلب بنجاح!');
        } else {
            throw new Error('Failed to send application.');
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
